import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
} from './backend'

const MAX_AVATAR_DIMENSION = 1200
const AVATAR_JPEG_QUALITY = 0.84

export async function uploadMemberAvatar(file) {
  const session = readMemberSession()

  if (!session?.accessToken) {
    throw new Error('Sign in to update your profile picture.')
  }

  const uploadFile = await normalizeAvatarImage(file)
  const formData = new FormData()
  formData.append('avatar', uploadFile)

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

async function normalizeAvatarImage(file) {
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    throw new Error('Choose an image for your profile picture.')
  }

  let image
  try {
    image = await loadBrowserImage(file)
  } catch {
    throw new Error(
      'This photo format cannot be processed on this device. Try a JPG, PNG, WebP, or a screenshot of the photo.',
    )
  }

  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height

  if (!sourceWidth || !sourceHeight) {
    throw new Error('Unable to read that profile picture.')
  }

  const scale = Math.min(
    1,
    MAX_AVATAR_DIMENSION / Math.max(sourceWidth, sourceHeight),
  )
  const width = Math.max(1, Math.round(sourceWidth * scale))
  const height = Math.max(1, Math.round(sourceHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Unable to prepare that profile picture.')
  }

  context.drawImage(image, 0, 0, width, height)

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', AVATAR_JPEG_QUALITY)
  })

  if (!blob) {
    throw new Error('Unable to prepare that profile picture.')
  }

  return new File([blob], 'avatar.jpg', {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}

function loadBrowserImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image decode failed'))
    }
    image.src = url
  })
}
