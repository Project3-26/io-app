import {
  BACKEND_BASE_URL,
  readFounderTestPlan,
  readMemberSession,
} from './backend'

const MAX_AVATAR_DIMENSION = 1200
const AVATAR_JPEG_QUALITY = 0.84
const MAX_SOURCE_AVATAR_BYTES = 25 * 1024 * 1024
const MAX_UPLOAD_AVATAR_BYTES = 4 * 1024 * 1024

export async function uploadMemberAvatar(file) {
  const session = readMemberSession()

  if (!session?.accessToken) {
    throw new Error('Your session has expired. Reopen Project 3|26 and try the photo again.')
  }

  const uploadFile = await normalizeAvatarImage(file)

  if (uploadFile.size > MAX_UPLOAD_AVATAR_BYTES) {
    throw new Error(
      'That photo is still too large after resizing. Choose a smaller photo and try again.',
    )
  }

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
    if (response.status === 413) {
      throw new Error(
        'That photo is too large to upload. Choose a smaller photo and try again.',
      )
    }

    if (response.status === 401) {
      throw new Error(
        'Your session has expired. Reopen Project 3|26 and try the photo again.',
      )
    }

    throw new Error(
      payload?.error || `We could not upload that photo (${response.status}). Please try again.`,
    )
  }

  return payload?.profile || null
}

async function normalizeAvatarImage(file) {
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    throw new Error('That file is not a photo. Choose an image and try again.')
  }

  if (file.size > MAX_SOURCE_AVATAR_BYTES) {
    throw new Error(
      'That photo is too large to process. Choose a photo smaller than 25 MB and try again.',
    )
  }

  let image
  try {
    image = await loadBrowserImage(file)
  } catch {
    throw new Error(
      'We could not read that photo format on this device. Try a JPG, PNG, WebP, or a screenshot of the photo.',
    )
  }

  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height

  if (!sourceWidth || !sourceHeight) {
    throw new Error('We could not read that photo. Choose a different image and try again.')
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
    throw new Error('We could not prepare that photo on this device. Try a different image.')
  }

  context.drawImage(image, 0, 0, width, height)

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', AVATAR_JPEG_QUALITY)
  })

  if (!blob) {
    throw new Error('We could not prepare that photo. Try a different image.')
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
