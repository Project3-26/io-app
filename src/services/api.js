import { mockChapter } from '../data/mockChapter'
import {
  completeMemberChapter,
  getMemberSnapshot,
  hasMemberSession,
} from './backend'

const wait = (milliseconds) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })

const chapterLibrary = {
  [mockChapter.id]: mockChapter,
}

export async function getChapterById(chapterId) {
  /*
   * Bible content is still served from the current frontend content bundle.
   * The backend is now connected for identity/progress first; published
   * chapter content will move to the content API in a later slice.
   */

  await wait(120)

  const chapter = chapterLibrary[chapterId]

  if (!chapter) {
    throw new Error(
      `Chapter "${chapterId}" has not been added yet.`,
    )
  }

  return structuredClone(chapter)
}

export async function getTodaysChapter() {
  return getChapterById(mockChapter.id)
}

export async function markChapterComplete(
  chapterId,
  completionMethod,
) {
  if (hasMemberSession()) {
    const result =
      await completeMemberChapter(
        chapterId,
        completionMethod,
      )

    if (!result?.success) {
      throw new Error(
        'Unable to save chapter completion.',
      )
    }

    return result
  }

  await wait(150)

  return {
    success: true,
    chapterId,
    completionMethod,
    completedAt: new Date().toISOString(),
    mode: 'demo',
  }
}

export async function getCurrentUser() {
  if (hasMemberSession()) {
    const snapshot =
      await getMemberSnapshot()

    if (snapshot?.user) {
      const leaderAccess =
        Boolean(
          snapshot.access?.leaderGuideAccess,
        )

      const fullBibleAccess =
        Boolean(
          snapshot.access?.fullBibleStudyAccess,
        )

      return {
        id: snapshot.user.id,
        firstName:
          snapshot.user.firstName ||
          'Member',
        displayName:
          snapshot.user.displayName ||
          snapshot.user.firstName ||
          'Member',
        email:
          snapshot.user.email || '',
        plan: leaderAccess
          ? 'leader'
          : fullBibleAccess
            ? 'standard'
            : 'free',
        access: snapshot.access,
        progress: snapshot.progress,
        journeyStartDate: null,
        timezone:
          snapshot.user.timezone ||
          'America/New_York',
      }
    }
  }

  await wait(80)

  return {
    id: 'demo-user',
    firstName: 'Brian',
    displayName: 'Brian Cooper',
    email: 'demo@project326.io',
    plan: 'standard',
    access: {
      freeJohnAccess: true,
      fullBibleStudyAccess: true,
      leaderGuideAccess: false,
      entitlements: [],
    },
    journeyStartDate: '2026-08-03',
    timezone: 'America/New_York',
  }
}

export async function getAssignedJourneyChapter() {
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
