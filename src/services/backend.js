const LAUNCH_PREVIEW_HOST = 'io-app-git-feature-launch-experience-project-326.vercel.app'
const LAUNCH_PREVIEW_BACKEND_URL =
  'https://project326-admin-git-feature-launch-experience-project-326.vercel.app'

const BACKEND_BASE_URL =
  import.meta.env.VITE_PROJECT326_BACKEND_URL ||
  (window.location.hostname === LAUNCH_PREVIEW_HOST
    ? LAUNCH_PREVIEW_BACKEND_URL
    : 'https://admin.project326.io')

const MEMBER_SESSION_KEY =
  'project326-member-session'
const TEST_PLAN_KEY =
  'project326-founder-test-plan'
const MEMBER_SNAPSHOT_TTL_MS = 30_000
const SCRIPTURE_CACHE_LIMIT = 3

let memberSnapshotCache = null
const scriptureMemoryCache = new Map()
  'project326-member-session'
const TEST_PLAN_KEY =
  'project326-founder-test-plan'
const MEMBER_SNAPSHOT_TTL_MS = 30_000
const SCRIPTURE_CACHE_LIMIT = 3

let memberSnapshotCache = null
const scriptureMemoryCache = new Map()

function normalizeSession(session) {
  if (!session?.accessToken || !session?.refreshToken) {
    return null
  }

  return {
    accessToken: String(session.accessToken),
    refreshToken: String(session.refreshToken),
    expiresAt:
      session.expiresAt === null ||
      session.expiresAt === undefined
        ? null
        : Number(session.expiresAt),
  }
}

function clearRequestCaches() {
  memberSnapshotCache = null
  scriptureMemoryCache.clear()
}

export function readMemberSession() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(MEMBER_SESSION_KEY) || 'null',
    )

    return normalizeSession(stored)
  } catch {
    return null
  }
}

function saveMemberSession(session) {
  const normalized = normalizeSession(session)

  if (!normalized) {
    localStorage.removeItem(MEMBER_SESSION_KEY)
    clearRequestCaches()
    return null
  }

  localStorage.setItem(
    MEMBER_SESSION_KEY,
    JSON.stringify(normalized),
  )
  clearRequestCaches()

  window.dispatchEvent(
    new CustomEvent('project326-auth-change'),
  )

  return normalized
}

export function clearMemberSession() {
  localStorage.removeItem(MEMBER_SESSION_KEY)
  clearRequestCaches()

  window.dispatchEvent(
    new CustomEvent('project326-auth-change'),
  )
}

export function hasMemberSession() {
  return Boolean(readMemberSession())
}

export function readFounderTestPlan() {
  const plan = localStorage.getItem(TEST_PLAN_KEY)

  return ['free', 'standard', 'leader'].includes(plan)
    ? plan
    : null
}

export function setFounderTestPlan(plan) {
  if (!['free', 'standard', 'leader'].includes(plan)) {
    localStorage.removeItem(TEST_PLAN_KEY)
  } else {
    localStorage.setItem(TEST_PLAN_KEY, plan)
  }

  clearRequestCaches()

  window.dispatchEvent(
    new CustomEvent('project326-test-plan-change', {
      detail: { plan },
    }),
  )
}

function isSessionExpiring(session) {
  if (!session?.expiresAt) {
    return false
  }

  const expiresAtMilliseconds =
    session.expiresAt * 1000

  return (
    expiresAtMilliseconds - Date.now() <
    60_000
  )
}

async function requestJson(
  path,
  options = {},
) {
  const response = await fetch(
    `${BACKEND_BASE_URL}${path}`,
    options,
  )

  let payload = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const error = new Error(
      payload?.error ||
        `Request failed (${response.status}).`,
    )

    error.status = response.status
    error.code = payload?.code || null
    error.payload = payload
    throw error
  }

  return payload
}

export async function refreshMemberSession() {
  const currentSession = readMemberSession()

  if (!currentSession?.refreshToken) {
    clearMemberSession()
    return null
  }

  try {
    const payload = await requestJson(
      '/api/app/auth/refresh',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken:
            currentSession.refreshToken,
        }),
      },
    )

    return saveMemberSession(
      payload?.session,
    )
  } catch {
    clearMemberSession()
    return null
  }
}

async function getValidMemberSession() {
  const session = readMemberSession()

  if (!session) {
    return null
  }

  if (isSessionExpiring(session)) {
    return refreshMemberSession()
  }

  return session
}

async function authenticatedRequest(
  path,
  options = {},
  retry = true,
) {
  const session =
    await getValidMemberSession()

  if (!session) {
    return null
  }

  const testPlan = readFounderTestPlan()

  try {
    return await requestJson(path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${session.accessToken}`,
        ...(testPlan
          ? { 'X-Project326-Test-Plan': testPlan }
          : {}),
      },
    })
  } catch (error) {
    if (
      retry &&
      error?.status === 401
    ) {
      const refreshed =
        await refreshMemberSession()

      if (refreshed) {
        return authenticatedRequest(
          path,
          options,
          false,
        )
      }
    }

    throw error
  }
}

export async function signInMember(
  email,
  password,
) {
  const payload = await requestJson(
    '/api/app/auth/sign-in',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    },
  )

  saveMemberSession(payload.session)

  return payload.user
}

export async function signUpMember(
  email,
  password,
  displayName,
) {
  const payload = await requestJson(
    '/api/app/auth/sign-up',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        displayName,
      }),
    },
  )

  if (payload?.session) {
    saveMemberSession(payload.session)
  }

  return payload
}

export async function updateMemberProfile(updates) {
  const payload = await authenticatedRequest(
    '/api/app/profile',
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    },
  )

  memberSnapshotCache = null
  return payload?.profile || null
}

export async function getMemberSnapshot(options = {}) {
  const force = Boolean(options?.force)
  const now = Date.now()

  if (
    !force &&
    memberSnapshotCache &&
    now - memberSnapshotCache.createdAt < MEMBER_SNAPSHOT_TTL_MS
  ) {
    return memberSnapshotCache.value
  }

  const account = await authenticatedRequest(
    '/api/app/me',
  )

  if (!account) {
    return null
  }

  let snapshot

  try {
    const progressPayload =
      await authenticatedRequest(
        '/api/app/progress',
      )

    snapshot = {
      ...account,
      progress:
        progressPayload?.progress || null,
      progressSyncStatus: 'connected',
    }
  } catch (error) {
    console.warn(
      'Member progress sync is temporarily unavailable.',
      error,
    )

    snapshot = {
      ...account,
      progress: null,
      progressSyncStatus: 'unavailable',
    }
  }

  memberSnapshotCache = {
    createdAt: now,
    value: snapshot,
  }

  return snapshot
}

export async function completeMemberChapter(
  chapterId,
  completionMethod,
) {
  memberSnapshotCache = null

  return authenticatedRequest(
    '/api/app/chapters/complete',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chapterId,
        completionMethod,
      }),
    },
  )
}

function scriptureCacheKey(bookSlug, chapterNumber) {
  return `${readFounderTestPlan() || 'default'}:${bookSlug}:${chapterNumber}`
}

function rememberScripture(key, promise) {
  scriptureMemoryCache.set(key, promise)

  while (scriptureMemoryCache.size > SCRIPTURE_CACHE_LIMIT) {
    const oldestKey = scriptureMemoryCache.keys().next().value
    scriptureMemoryCache.delete(oldestKey)
  }

  promise.catch(() => {
    if (scriptureMemoryCache.get(key) === promise) {
      scriptureMemoryCache.delete(key)
    }
  })

  return promise
}

export async function getBibleChapter(
  bookSlug,
  chapterNumber,
) {
  const key = scriptureCacheKey(bookSlug, chapterNumber)
  const cached = scriptureMemoryCache.get(key)

  if (cached) {
    return cached
  }

  const request = authenticatedRequest(
    `/api/app/scripture/${encodeURIComponent(bookSlug)}/${chapterNumber}`,
  ).then((payload) => {
    if (!payload) {
      const error = new Error(
        'Sign in to read the Bible.',
      )
      error.status = 401
      error.code = 'AUTH_REQUIRED'
      throw error
    }

    return payload
  })

  return rememberScripture(key, request)
}

export function prefetchBibleChapter(bookSlug, chapterNumber) {
  if (!hasMemberSession()) return

  getBibleChapter(bookSlug, chapterNumber).catch(() => {
    // Prefetch is opportunistic. The normal reader request owns error UI.
  })
}

export async function checkBackendConnection() {
  return requestJson('/api/health')
}

export { BACKEND_BASE_URL }
