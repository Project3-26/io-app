import { BACKEND_BASE_URL, readMemberSession, refreshMemberSession } from './backend'

async function sendDevice(path, body, retry = true) {
  let session = readMemberSession()
  if (!session?.accessToken) throw new Error('Sign in before registering notifications.')

  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(body),
  })
  if (response.status === 401 && retry) {
    session = await refreshMemberSession()
    if (session) return sendDevice(path, body, false)
  }
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.error || 'Unable to register notifications.')
  return payload
}

export function registerPushDevice(device) {
  return sendDevice('/api/app/push/devices', device)
}

export function installNativePushBridge() {
  const register = async (device) => {
    const result = await registerPushDevice(device)
    window.dispatchEvent(new CustomEvent('project326-push-registered', { detail: result }))
    return result
  }

  window.Project326Push = { register }
  window.dispatchEvent(new CustomEvent('project326-native-push-ready'))
  return () => {
    if (window.Project326Push?.register === register) delete window.Project326Push
  }
}
