import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
  refreshMemberSession,
} from './backend'

const COMPASS_TIMEOUT_MS = 30_000

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
