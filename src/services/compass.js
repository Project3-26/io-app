import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
  refreshMemberSession,
} from './backend'

async function compassRequest(path, options = {}, retry = true) {
  let session = readMemberSession()
  const headers = {
    ...(options.headers || {}),
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
  }
  const testPlan = readFounderTestPlan()
  if (testPlan) headers['X-Project326-Test-Plan'] = testPlan

  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    ...options,
    headers,
  })

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

export async function askCompass({ question, currentPage, chapterId }) {
  return compassRequest('/api/app/compass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, currentPage, chapterId }),
  })
}
