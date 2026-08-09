import {
  BACKEND_BASE_URL,
  readMemberSession,
  refreshMemberSession,
} from './backend'

export async function getBillingOffers() {
  const response = await fetch(`${BACKEND_BASE_URL}/api/billing/offers`, {
    cache: 'no-store',
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.error || 'Unable to load billing offers.')
  }
  return payload?.offers || []
}

async function authenticatedBillingRequest(path, options = {}, retry = true) {
  let session = readMemberSession()
  if (!session?.accessToken) throw new Error('Sign in to continue to checkout.')

  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${session.accessToken}`,
    },
  })

  if (response.status === 401 && retry) {
    session = await refreshMemberSession()
    if (session) return authenticatedBillingRequest(path, options, false)
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(payload?.error || `Billing request failed (${response.status}).`)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export function createCheckout({ productCode, priceId, billingInterval }) {
  return authenticatedBillingRequest('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productCode, priceId, billingInterval }),
  })
}
