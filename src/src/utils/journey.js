const TOTAL_JOURNEY_DAYS = 1189
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

function getLocalDateOnly(dateValue) {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid journey start date.')
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )
}

export function getJourneyDay(journeyStartDate) {
  const startDate = getLocalDateOnly(journeyStartDate)
  const today = getLocalDateOnly(new Date())

  const elapsedDays = Math.floor(
    (today.getTime() - startDate.getTime()) /
      MILLISECONDS_PER_DAY,
  )

  if (elapsedDays < 0) {
    return 0
  }

  return Math.min(elapsedDays + 1, TOTAL_JOURNEY_DAYS)
}

export function isChapterUnlocked(
  chapterJourneyDay,
  currentJourneyDay,
) {
  return chapterJourneyDay <= currentJourneyDay
}

export function getChapterAccess({
  chapterJourneyDay,
  currentJourneyDay,
  isCompleted = false,
}) {
  return {
    isUnlocked: isChapterUnlocked(
      chapterJourneyDay,
      currentJourneyDay,
    ),
    isCompleted,
  }
}

export function getUnlockedChapters(
  chapters,
  currentJourneyDay,
) {
  return chapters.filter((chapter) =>
    isChapterUnlocked(
      chapter.journeyDay,
      currentJourneyDay,
    ),
  )
}

export function getIncompleteUnlockedChapters(
  chapters,
  currentJourneyDay,
) {
  return chapters.filter(
    (chapter) =>
      isChapterUnlocked(
        chapter.journeyDay,
        currentJourneyDay,
      ) && !chapter.isCompleted,
  )
}

export function isBookUnlocked(
  bookChapters,
  currentJourneyDay,
) {
  return bookChapters.some((chapter) =>
    isChapterUnlocked(
      chapter.journeyDay,
      currentJourneyDay,
    ),
  )
}