import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
  refreshMemberSession,
} from './backend'

async function connectRequest(path, options = {}, retry = true) {
  let session = readMemberSession()

  if (!session?.accessToken) {
    throw new Error('Sign in to use Connect.')
  }

  const testPlan = readFounderTestPlan()
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${session.accessToken}`,
      ...(testPlan
        ? { 'X-Project326-Test-Plan': testPlan }
        : {}),
    },
  })

  if (response.status === 401 && retry) {
    session = await refreshMemberSession()
    if (session) return connectRequest(path, options, false)
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(
      payload?.error || `Connect request failed (${response.status}).`,
    )
    error.status = response.status
    error.code = payload?.code || null
    error.payload = payload
    throw error
  }

  return payload
}

export function getConnectRoom(roomId, chapterId) {
  const query = chapterId
    ? `?chapterId=${encodeURIComponent(chapterId)}`
    : ''
  return connectRequest(
    `/api/app/connect/${encodeURIComponent(roomId)}${query}`,
  )
}

export function sendConnectMessage(roomId, chapterId, message) {
  const query = chapterId
    ? `?chapterId=${encodeURIComponent(chapterId)}`
    : ''
  return connectRequest(
    `/api/app/connect/${encodeURIComponent(roomId)}${query}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    },
  )
}

export function toggleConnectReaction(messageId, emoji) {
  return connectRequest(
    `/api/app/connect/messages/${encodeURIComponent(messageId)}/reaction`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji }),
    },
  )
}
