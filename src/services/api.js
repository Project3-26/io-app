import { mockChapter } from '../data/mockChapter'

const wait = (milliseconds) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })

export async function getTodaysChapter() {
  /*
   * FUTURE BACKEND VERSION:
   *
   * const response = await fetch('/api/chapters/today', {
   *   credentials: 'include',
   * })
   *
   * if (!response.ok) {
   *   throw new Error("Unable to load today's chapter.")
   * }
   *
   * return response.json()
   */

  await wait(350)

  return structuredClone(mockChapter)
}

export async function markChapterComplete(
  chapterId,
  completionMethod,
) {
  /*
   * FUTURE BACKEND VERSION:
   *
   * const response = await fetch(
   *   `/api/chapters/${chapterId}/complete`,
   *   {
   *     method: 'POST',
   *     credentials: 'include',
   *     headers: {
   *       'Content-Type': 'application/json',
   *     },
   *     body: JSON.stringify({
   *       completionMethod,
   *       completedAt: new Date().toISOString(),
   *     }),
   *   },
   * )
   *
   * if (!response.ok) {
   *   throw new Error('Unable to save chapter completion.')
   * }
   *
   * return response.json()
   */

  await wait(300)

  return {
    success: true,
    chapterId,
    completionMethod,
    completedAt: new Date().toISOString(),
  }
}

export async function getCurrentUser() {
  /*
   * FUTURE BACKEND VERSION:
   *
   * const response = await fetch('/api/users/me', {
   *   credentials: 'include',
   * })
   *
   * if (!response.ok) {
   *   throw new Error('Unable to load user information.')
   * }
   *
   * return response.json()
   */

  await wait(150)

  return {
    id: 'demo-user',
    firstName: 'Brian',

    // Change this to 'leader' later to preview access.
    plan: 'standard',

    journeyStartDate: '2026-08-03',
    timezone: 'America/New_York',
  }
}

export async function getAssignedJourneyChapter() {
  /*
   * FUTURE BACKEND RESPONSIBILITY:
   *
   * 1. Read the user's journeyStartDate.
   * 2. Calculate the current journey day in the user's timezone.
   * 3. Find that day's chapter in the 1,189-chapter sequence.
   * 4. Return the chapter and the user's completion status.
   *
   * Example:
   *
   * const response = await fetch('/api/journey/current', {
   *   credentials: 'include',
   * })
   *
   * if (!response.ok) {
   *   throw new Error('Unable to load the journey chapter.')
   * }
   *
   * return response.json()
   */

  return getTodaysChapter()
}

export async function openChapterPdf(pdfUrl, pdfType) {
  if (!pdfUrl) {
    return {
      success: false,
      message: `${pdfType} PDF will open here after its backend URL is connected.`,
    }
  }

  window.open(pdfUrl, '_blank', 'noopener,noreferrer')

  return {
    success: true,
  }
}