import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
  refreshMemberSession,
} from './backend'

async function notificationRequest(path = '', options = {}, retry = true) {
  let session = readMemberSession()

  if (!session?.accessToken) {
    throw new Error('Sign in to view notifications.')
  }

  const testPlan = readFounderTestPlan()
  const response = await fetch(`${BACKEND_BASE_URL}/api/app/notifications${path}`, {
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
    if (session) return notificationRequest(path, options, false)
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.error || `Notification request failed (${response.status}).`)
  }

  return payload
}

export function getMemberNotifications() {
  return notificationRequest()
}

export async function markMemberNotificationsRead() {
  const payload = await notificationRequest('', { method: 'PATCH' })
  window.dispatchEvent(new CustomEvent('project326-notifications-change'))
  return payload
}
