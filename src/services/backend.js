const BACKEND_BASE_URL =
  import.meta.env.VITE_PROJECT326_BACKEND_URL ||
  'https://admin.project326.io'

const MEMBER_SESSION_KEY =
  'project326-member-session'

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
    return null
  }

  localStorage.setItem(
    MEMBER_SESSION_KEY,
    JSON.stringify(normalized),
  )

  window.dispatchEvent(
    new CustomEvent('project326-auth-change'),
  )

  return normalized
}

export function clearMemberSession() {
  localStorage.removeItem(MEMBER_SESSION_KEY)

  window.dispatchEvent(
    new CustomEvent('project326-auth-change'),
  )
}

export function hasMemberSession() {
  return Boolean(readMemberSession())
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

  try {
    return await requestJson(path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${session.accessToken}`,
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

export async function getMemberSnapshot() {
  const account = await authenticatedRequest(
    '/api/app/me',
  )

  if (!account) {
    return null
  }

  try {
    const progressPayload =
      await authenticatedRequest(
        '/api/app/progress',
      )

    return {
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

    return {
      ...account,
      progress: null,
      progressSyncStatus: 'unavailable',
    }
  }
}

export async function completeMemberChapter(
  chapterId,
  completionMethod,
) {
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

export async function getBibleChapter(
  bookSlug,
  chapterNumber,
) {
  const payload = await authenticatedRequest(
    `/api/app/scripture/${encodeURIComponent(bookSlug)}/${chapterNumber}`,
  )

  if (!payload) {
    const error = new Error(
      'Sign in to read the Bible.',
    )
    error.status = 401
    error.code = 'AUTH_REQUIRED'
    throw error
  }

  return payload
}

export async function checkBackendConnection() {
  return requestJson('/api/health')
}

export { BACKEND_BASE_URL }
