import {
  BACKEND_BASE_URL,
  readMemberSession,
  refreshMemberSession,
} from './backend'

async function referralRequest(path, options = {}, retry = true) {
  let session = readMemberSession()
  if (!session?.accessToken) throw new Error('Sign in to use referrals.')

  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${session.accessToken}`,
    },
  })

  if (response.status === 401 && retry) {
    session = await refreshMemberSession()
    if (session) return referralRequest(path, options, false)
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(payload?.error || `Referral request failed (${response.status}).`)
    error.status = response.status
    error.code = payload?.code || null
    throw error
  }

  return payload
}

export async function getMyReferral() {
  const payload = await referralRequest('/api/app/referrals/me')
  return payload?.referral || null
}

export async function claimReferral(code) {
  return referralRequest('/api/app/referrals/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
}
