import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
  refreshMemberSession,
} from './backend'

const RESOURCE_CACHE_TTL_MS = 60_000
const CATALOG_CACHE_TTL_MS = 60_000
const resourceCache = new Map()
let catalogCache = null

function cacheKey(bookSlug, chapterNumber) {
  return `${readFounderTestPlan() || 'default'}:${bookSlug}:${chapterNumber}`
}

async function authenticatedContentRequest(path, retry = true) {
  let session = readMemberSession()

  if (!session?.accessToken) {
    return null
  }

  const testPlan = readFounderTestPlan()
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      ...(testPlan ? { 'X-Project326-Test-Plan': testPlan } : {}),
    },
  })

  if (response.status === 401 && retry) {
    session = await refreshMemberSession()
    if (session) {
      return authenticatedContentRequest(path, false)
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
      payload?.error || `Unable to load app content (${response.status}).`,
    )
    error.status = response.status
    error.code = payload?.code || null
    throw error
  }

  return payload
}

async function requestChapterResources(bookSlug, chapterNumber) {
  return authenticatedContentRequest(
    `/api/app/content/${encodeURIComponent(bookSlug)}/${chapterNumber}`,
  )
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

export async function getContentCatalog(options = {}) {
  const force = Boolean(options?.force)

  if (
    !force &&
    catalogCache &&
    Date.now() - catalogCache.createdAt < CATALOG_CACHE_TTL_MS
  ) {
    return catalogCache.value
  }

  const value = await authenticatedContentRequest('/api/app/content/catalog')
  catalogCache = { createdAt: Date.now(), value }
  return value
}

export function clearChapterResourceCache() {
  resourceCache.clear()
  catalogCache = null
}
