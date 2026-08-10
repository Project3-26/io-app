import { bibleBooks } from '../data/bibleBooks'
import { sharedJourney } from '../data/sharedJourney'
import {
  completeMemberChapter,
  getMemberSnapshot,
  hasMemberSession,
} from './backend'
import { getChapterResources } from './chapterContent'

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
  const previousChapterId = getPreviousChapterId(chapterId)
  const previousChapter = previousChapterId
    ? buildChapterReference(previousChapterId)
    : null

  return {
    id: chapterId,
    book: book.name,
    chapterNumber,
    reference: `${book.name} ${chapterNumber}`,
    title: `${book.name} ${chapterNumber}`,
    lessonNumber: chapterNumber,
    totalLessons: book.chapters,
    journeyDay: sharedJourney.cycleDay,
    totalJourneyDays: 1189,
    summary: '',
    quote: '',
    quoteAttribution: '',
    listenSummary: '',
    audio: {
      title: `${book.name} ${chapterNumber} Audio`,
      duration: '',
      url: '',
      body: '',
      locked: false,
    },
    studyGuide: {
      title: 'Study',
      description: '',
      body: '',
      pdfUrl: '',
      locked: false,
      sections: [],
    },
    leaderGuide: {
      title: 'Leader Guide',
      theme: '',
      description: '',
      body: '',
      pdfUrl: '',
      locked: false,
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
    previousChapter,
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

function getPreviousChapterId(chapterId) {
  const match = chapterId.match(/^(.*)-(\d+)$/)

  if (!match) return null

  const bookId = match[1]
  const chapterNumber = Number(match[2])
  const bookIndex = bibleBooks.findIndex((candidate) => candidate.id === bookId)

  if (bookIndex < 0) return null
  if (chapterNumber > 1) return `${bookId}-${chapterNumber - 1}`

  const previousBook = bibleBooks[bookIndex - 1]
  return previousBook ? `${previousBook.id}-${previousBook.chapters}` : null
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

function mergePublishedResources(chapter, payload) {
  const resources = payload?.resources || {}
  const audio = resources.audio
  const study = resources.study
  const leader = resources.leader
  const studyExperience = payload?.studyExperience || null
  const studySections = Array.isArray(studyExperience?.sections)
    ? studyExperience.sections
        .filter((section) => section?.key && section?.summary)
        .map((section) => ({
          key: section.key,
          label: section.label || section.key,
          summary: section.summary,
        }))
    : []
  const listenSummary =
    typeof payload?.listenSummary === 'string' && payload.listenSummary.trim()
      ? payload.listenSummary.trim()
      : typeof studyExperience?.listenSummary === 'string' && studyExperience.listenSummary.trim()
        ? studyExperience.listenSummary.trim()
        : ''
  const chapterQuote = payload?.chapterQuote || null

  return {
    ...chapter,
    quote: chapterQuote?.text || chapter.quote,
    quoteAttribution: chapterQuote?.attribution || chapter.quoteAttribution,
    listenSummary,
    audio: {
      ...chapter.audio,
      title: chapter.reference,
      body: listenSummary,
      url: audio?.url || '',
      locked: Boolean(audio?.locked),
    },
    studyGuide: {
      ...chapter.studyGuide,
      // The admin upload filename is useful for operators, but it should not
      // become member-facing UI (for example, "John_3_bible.study.pdf").
      title: `${chapter.reference} Study Guide`,
      description: study?.body ? '' : chapter.studyGuide.description,
      body: study?.body || '',
      pdfUrl: study?.url || '',
      locked: Boolean(study?.locked),
      sections: studySections,
    },
    leaderGuide: {
      ...chapter.leaderGuide,
      title: leader?.title || chapter.leaderGuide.title,
      body: leader?.body || '',
      pdfUrl: leader?.url || '',
      locked: Boolean(leader?.locked),
    },
    contentAvailability: {
      ...chapter.contentAvailability,
      audio: Boolean(audio),
      study: Boolean(study) || studySections.length > 0,
      leaderGuide: Boolean(leader),
    },
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
  const chapter = buildScriptureOnlyChapter(chapterId)

  if (!chapter) {
    throw new Error(
      `Chapter "${chapterId}" is not a valid Bible chapter.`,
    )
  }

  try {
    const resourcePayload = await getChapterResources(
      chapterId.replace(/-\d+$/, ''),
      chapter.chapterNumber,
    )
    return mergePublishedResources(chapter, resourcePayload)
  } catch (error) {
    console.warn('Published chapter resources are temporarily unavailable.', error)
    return chapter
  }
}

export async function getTodaysChapter() {
  if (!sharedJourney.chapterId) {
    throw new Error('Today’s Journey chapter is not available yet.')
  }

  return getChapterById(sharedJourney.chapterId)
}

export async function markChapterComplete(
  chapterId,
  completionMethod,
) {
  if (!hasMemberSession()) {
    throw new Error('Sign in to save chapter progress.')
  }

  const result = await completeMemberChapter(
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

export async function getCurrentUser() {
  if (!hasMemberSession()) {
    throw new Error('Sign in to load your account.')
  }

  const snapshot = await getMemberSnapshot()

  if (!snapshot?.user) {
    throw new Error('Unable to load your account.')
  }

  const leaderAccess = Boolean(
    snapshot.access?.leaderGuideAccess,
  )

  const fullBibleAccess = Boolean(
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
