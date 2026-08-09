import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
  refreshMemberSession,
} from './backend'

const RESOURCE_CACHE_TTL_MS = 60_000
const resourceCache = new Map()

function cacheKey(bookSlug, chapterNumber) {
  return `${readFounderTestPlan() || 'default'}:${bookSlug}:${chapterNumber}`
}

async function requestChapterResources(bookSlug, chapterNumber, retry = true) {
  let session = readMemberSession()

  if (!session?.accessToken) {
    return null
  }

  const testPlan = readFounderTestPlan()
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/app/content/${encodeURIComponent(bookSlug)}/${chapterNumber}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...(testPlan ? { 'X-Project326-Test-Plan': testPlan } : {}),
      },
    },
  )

  if (response.status === 401 && retry) {
    session = await refreshMemberSession()
    if (session) {
      return requestChapterResources(bookSlug, chapterNumber, false)
    }
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const error = new Error(
      payload?.error || `Unable to load chapter resources (${response.status}).`,
    )
    error.status = response.status
    error.code = payload?.code || null
    throw error
  }

  return payload
}

export async function getChapterResources(bookSlug, chapterNumber, options = {}) {
  const force = Boolean(options?.force)
  const key = cacheKey(bookSlug, chapterNumber)
  const existing = resourceCache.get(key)

  if (!force && existing && Date.now() - existing.createdAt < RESOURCE_CACHE_TTL_MS) {
    return existing.value
  }

  const value = await requestChapterResources(bookSlug, chapterNumber)
  resourceCache.set(key, { createdAt: Date.now(), value })
  return value
}

export function clearChapterResourceCache() {
  resourceCache.clear()
}
