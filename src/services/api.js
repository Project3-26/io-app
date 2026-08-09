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

  const nextChapterId = getNextChapterId(chapterId)
  const nextChapter = nextChapterId
    ? buildChapterReference(nextChapterId)
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

function getNextChapterId(chapterId) {
  const match = chapterId.match(/^(.*)-(\d+)$/)

  if (!match) {
    return null
  }

  const bookId = match[1]
  const chapterNumber = Number(match[2])
  const bookIndex = bibleBooks.findIndex(
    (candidate) => candidate.id === bookId,
  )

  if (bookIndex < 0) {
    return null
  }

  const book = bibleBooks[bookIndex]

  if (chapterNumber < book.chapters) {
    return `${bookId}-${chapterNumber + 1}`
  }

  const nextBook = bibleBooks[bookIndex + 1]
  return nextBook ? `${nextBook.id}-1` : null
}

function buildChapterReference(chapterId) {
  const match = chapterId.match(/^(.*)-(\d+)$/)

  if (!match) {
    return null
  }

  const book = bibleBooks.find(
    (candidate) => candidate.id === match[1],
  )

  if (!book) {
    return null
  }

  const chapterNumber = Number(match[2])

  return {
    id: chapterId,
    reference: `${book.name} ${chapterNumber}`,
    title: '',
  }
}

function openNextChapterAfterCompletion(chapterId, completionMethod) {
  if (completionMethod !== 'continue') {
    return
  }

  const nextChapterId = getNextChapterId(chapterId)

  if (!nextChapterId) {
    return
  }

  window.dispatchEvent(
    new CustomEvent('project326-open-chapter', {
      detail: {
        chapterId: nextChapterId,
        source: 'continue',
      },
    }),
  )
}

export async function getChapterById(chapterId) {
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

    openNextChapterAfterCompletion(
      chapterId,
      completionMethod,
    )

    return result
  }

  await wait(80)

  const result = {
    success: true,
    chapterId,
    completionMethod,
    completedAt: new Date().toISOString(),
    mode: 'demo',
  }

  openNextChapterAfterCompletion(
    chapterId,
    completionMethod,
  )

  return result
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
        journeyStartDate: '2026-08-08',
        timezone:
          snapshot.user.timezone ||
          'America/New_York',
      }
    }
  }

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
    journeyStartDate: '2026-08-08',
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
      message: `${pdfType} is not available for this chapter yet.`,
    }
  }

  window.open(pdfUrl, '_blank', 'noopener,noreferrer')

  return {
    success: true,
  }
}
