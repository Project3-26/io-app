import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
  refreshMemberSession,
} from './backend'

const COMPASS_TIMEOUT_MS = 30_000
const MAPTILER_STYLE_ID = import.meta.env.VITE_MAPTILER_STYLE_ID?.trim() || ''

async function compassRequest(path, options = {}, retry = true) {
  let session = readMemberSession()
  const headers = {
    ...(options.headers || {}),
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
  }
  const testPlan = readFounderTestPlan()
  if (testPlan) headers['X-Project326-Test-Plan'] = testPlan

  const timeoutController = new AbortController()
  const timeoutId = window.setTimeout(() => timeoutController.abort(), COMPASS_TIMEOUT_MS)
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeoutController.signal])
    : timeoutController.signal

  let response
  try {
    response = await fetch(`${BACKEND_BASE_URL}${path}`, { ...options, headers, signal })
  } catch (error) {
    if (error?.name === 'AbortError') {
      const aborted = new Error(
        options.signal?.aborted
          ? 'Compass request cancelled.'
          : 'Compass took too long to respond. Please try again.',
      )
      aborted.code = options.signal?.aborted ? 'REQUEST_CANCELLED' : 'REQUEST_TIMEOUT'
      throw aborted
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (response.status === 401 && retry) {
    session = await refreshMemberSession()
    if (session) return compassRequest(path, options, false)
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(payload?.error || 'Compass is unavailable right now.')
    error.status = response.status
    error.code = payload?.code || null
    throw error
  }
  return payload
}

export async function getCompassStatus() {
  return compassRequest('/api/app/compass')
}

export async function askCompass({ question, currentPage, chapterId, signal }) {
  return compassRequest('/api/app/compass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, currentPage, chapterId }),
    signal,
  })
}

export async function getChapterGeography(chapterId, { signal } = {}) {
  if (!chapterId) throw new Error('A Bible chapter is required.')

  return compassRequest(
    `/api/app/geography/chapters/${encodeURIComponent(chapterId)}`,
    { signal },
  )
}

export function getPreviewGeographyFeature() {
  const isVercelPreview = window.location.hostname.endsWith('.vercel.app')
  if (!isVercelPreview || !MAPTILER_STYLE_ID) return null

  return {
    enabled: true,
    placeContextEnabled: true,
    interactiveMapsEnabled: true,
    previewOnly: true,
  }
}

export function getPreviewChapterGeography(chapterId) {
  if (!getPreviewGeographyFeature() || chapterId !== 'john-4') return null

  return {
    chapterId: 'john-4',
    summary: 'John 4 follows Jesus north from Judea toward Galilee. The encounter at the well takes place in Samaria, near Sychar.',
    bounds: [[34.75, 31.45], [35.75, 33.15]],
    mapStyleUrl: `/api/maptiler?resource=${encodeURIComponent(`maps/${MAPTILER_STYLE_ID}/style.json`)}`,
    places: [
      {
        id: 'jerusalem',
        name: 'Jerusalem / Judea',
        latitude: 31.78,
        longitude: 35.22,
        ancientRegion: 'Judea',
        summary: 'Jesus begins this northbound journey in the Judean region.',
        isStoryLocation: false,
      },
      {
        id: 'sychar',
        name: 'Sychar / Jacob’s well area',
        latitude: 32.21,
        longitude: 35.28,
        ancientRegion: 'Samaria',
        summary: 'The setting for Jesus’ conversation with the Samaritan woman. The exact identification is represented as an approximate study location.',
        isStoryLocation: true,
      },
      {
        id: 'galilee',
        name: 'Galilee',
        latitude: 32.8,
        longitude: 35.0,
        ancientRegion: 'Galilee',
        summary: 'Jesus continues north toward Galilee after this encounter.',
        isStoryLocation: false,
      },
    ],
    routes: [
      {
        id: 'john-4-direct',
        name: 'Jesus’ direct route through Samaria',
        kind: 'story',
        summary: 'The highlighted route passes north through Samaria toward Galilee.',
        coordinates: [[35.22, 31.78], [35.28, 32.21], [35.0, 32.8]],
        labelCoordinate: [35.08, 32.48],
      },
      {
        id: 'john-4-avoidance',
        name: 'Common avoidance route east of the Jordan',
        kind: 'comparison',
        summary: 'A longer route many Jewish travelers used to avoid Samaritan territory.',
        coordinates: [[35.22, 31.78], [35.55, 31.95], [35.62, 32.55], [35.0, 32.8]],
        labelCoordinate: [35.54, 32.5],
      },
    ],
    routeComparison: {
      title: 'A direct road with a social boundary',
      body: 'Traveling north through Samaria was the direct route from Judea to Galilee. Many Jewish travelers chose a longer eastern route to avoid Samaritan territory. Jesus’ journey through Samaria sets the scene for his conversation at the well.',
    },
  }
}
