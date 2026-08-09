import { bibleBooks } from '../data/bibleBooks'
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

function buildScriptureOnlyChapter(chapterId) {
  const match = chapterId.match(/^(.*)-(\d+)$/)

  if (!match) {
    return null
  }

  const bookId = match[1]
  const chapterNumber = Number(match[2])
  const book = bibleBooks.find(
    (candidate) => candidate.id === bookId,
  )

  if (
    !book ||
    !Number.isInteger(chapterNumber) ||
    chapterNumber < 1 ||
    chapterNumber > book.chapters
  ) {
    return null
  }

  const nextChapter =
    chapterNumber < book.chapters
      ? {
          id: `${bookId}-${chapterNumber + 1}`,
          reference: `${book.name} ${chapterNumber + 1}`,
          title: '',
        }
      : null

  return {
    id: chapterId,
    book: book.name,
    chapterNumber,
    reference: `${book.name} ${chapterNumber}`,
    title: `${book.name} ${chapterNumber}`,
    lessonNumber: chapterNumber,
    totalLessons: book.chapters,
    journeyDay: 1,
    totalJourneyDays: 1189,
    summary: '',
    quote: '',
    quoteAttribution: '',
    audio: {
      title: `${book.name} ${chapterNumber} Audio`,
      duration: '',
      url: '',
    },
    studyGuide: {
      title: 'Study',
      description: '',
      pdfUrl: '',
      sections: [],
    },
    leaderGuide: {
      title: 'Leader Guide',
      theme: '',
      description: '',
      pdfUrl: '',
      overview: '',
      groupFlow: [],
      icebreakers: [],
      leaderPrep: [],
      discussionQuestions: [],
      reflectionPrompt: '',
      prayerGuide: '',
    },
    compassPrompt: `Help me understand ${book.name} ${chapterNumber}.`,
    isCompleted: false,
    nextChapter,
    contentAvailability: {
      scripture: true,
      audio: false,
      study: false,
      leaderGuide: false,
    },
  }
}

export async function getChapterById(chapterId) {
  await wait(120)

  const chapter =
    chapterLibrary[chapterId] ||
    buildScriptureOnlyChapter(chapterId)

  if (!chapter) {
    throw new Error(
      `Chapter "${chapterId}" is not a valid Bible chapter.`,
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
