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

export function getConnectRoom(roomId, chapterId, options = {}) {
  const query = chapterId
    ? `?chapterId=${encodeURIComponent(chapterId)}`
    : ''
  return connectRequest(
    `/api/app/connect/${encodeURIComponent(roomId)}${query}`,
    { signal: options.signal },
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

export async function getCommunityRoom(postType) {
  return connectRequest(
    `/api/app/community/${encodeURIComponent(postType)}`,
  )
}

export async function createCommunityPost(postType, post) {
  const payload = await connectRequest(
    `/api/app/community/${encodeURIComponent(postType)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    },
  )
  return payload?.post || null
}

export function toggleCommunityReaction(postId, reaction) {
  return connectRequest(
    `/api/app/community/posts/${encodeURIComponent(postId)}/reaction`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction }),
    },
  )
}

export function updateCommunityPost(postId, updates) {
  return connectRequest(
    `/api/app/community/posts/${encodeURIComponent(postId)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    },
  )
}

export function deleteCommunityPost(postId) {
  return connectRequest(
    `/api/app/community/posts/${encodeURIComponent(postId)}`,
    { method: 'DELETE' },
  )
}

export function reportCommunityPost(postId) {
  return connectRequest(
    `/api/app/community/posts/${encodeURIComponent(postId)}/report`,
    { method: 'POST' },
  )
}

export function hideCommunityPost(postId) {
  return connectRequest(
    `/api/app/community/posts/${encodeURIComponent(postId)}/hide`,
    { method: 'POST' },
  )
}

export async function getChurchMemberships() {
  const payload = await connectRequest('/api/app/churches')
  return payload?.memberships || []
}

export async function joinChurchByCode(code) {
  const payload = await connectRequest('/api/app/churches/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  return payload?.membership || null
}

export async function createChurchInvite(churchSlug) {
  const payload = await connectRequest(
    `/api/app/churches/${encodeURIComponent(churchSlug)}/invites`,
    { method: 'POST' },
  )
  return payload?.invite || null
}

export async function leaveChurch(churchSlug) {
  return connectRequest(
    `/api/app/churches/${encodeURIComponent(churchSlug)}/membership`,
    { method: 'DELETE' },
  )
}
