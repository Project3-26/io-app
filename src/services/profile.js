import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
} from './backend'

export async function uploadMemberAvatar(file) {
  const session = readMemberSession()

  if (!session?.accessToken) {
    throw new Error('Sign in to update your profile picture.')
  }

  const formData = new FormData()
  formData.append('avatar', file)

  const testPlan = readFounderTestPlan()
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/app/profile/avatar`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...(testPlan
          ? { 'X-Project326-Test-Plan': testPlan }
          : {}),
      },
      body: formData,
    },
  )

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      payload?.error || `Avatar upload failed (${response.status}).`,
    )
  }

  return payload?.profile || null
}
