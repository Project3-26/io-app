export const TOTAL_CYCLE_DAYS = 1189
export const BETA_JOURNEY_START_DATE = '2026-08-08'
export const JOURNEY_TIME_ZONE = 'America/New_York'

/*
  PROJECT 3|26 SHARED JOURNEY ORDER

  This is intentionally NOT canonical Bible order.

  The shared Chapter of the Day follows the order
  Project 3|26 teaches/releases the books.

  Library and Progress by Book remain in normal
  Genesis → Revelation canonical order.
*/

export const journeyBookOrder = [
  {
    id: 'john',
    name: 'John',
    chapters: 21,
  },
  {
    id: 'romans',
    name: 'Romans',
    chapters: 16,
  },
  {
    id: 'genesis',
    name: 'Genesis',
    chapters: 50,
  },
  {
    id: 'acts',
    name: 'Acts',
    chapters: 28,
  },
  {
    id: 'ruth',
    name: 'Ruth',
    chapters: 4,
  },
  {
    id: 'mark',
    name: 'Mark',
    chapters: 16,
  },
  {
    id: 'habakkuk',
    name: 'Habakkuk',
    chapters: 3,
  },
  {
    id: 'proverbs',
    name: 'Proverbs',
    chapters: 31,
  },
  {
    id: 'exodus',
    name: 'Exodus',
    chapters: 40,
  },
  {
    id: 'james',
    name: 'James',
    chapters: 5,
  },
  {
    id: 'first-samuel',
    name: '1 Samuel',
    chapters: 31,
  },
  {
    id: 'jonah',
    name: 'Jonah',
    chapters: 4,
  },
  {
    id: 'ephesians',
    name: 'Ephesians',
    chapters: 6,
  },
  {
    id: 'judges',
    name: 'Judges',
    chapters: 21,
  },

  /*
    ADD EACH NEW BOOK BELOW THIS LINE
    IN THE ORDER YOU PRODUCE IT.
  */
]

function buildJourneyChapters() {
  return journeyBookOrder.flatMap(
    (book) =>
      Array.from(
        {
          length: book.chapters,
        },
        (_, index) => {
          const chapterNumber =
            index + 1

          return {
            chapterId:
              `${book.id}-${chapterNumber}`,
            bookId: book.id,
            bookName: book.name,
            chapterNumber,
            reference:
              `${book.name} ${chapterNumber}`,
          }
        },
      ),
  )
}

export const journeyChapters =
  buildJourneyChapters()

export function getSharedJourneyForCycleDay(
  cycleDay,
) {
  const safeCycleDay =
    Math.max(
      1,
      Number(cycleDay) || 1,
    )

  const chapter =
    journeyChapters[
      safeCycleDay - 1
    ]

  if (!chapter) {
    return {
      cycleDay: safeCycleDay,
      chapterId: null,
      reference:
        'Journey content coming soon',
      title:
        'The next Project 3|26 book has not been added to the journey order yet.',
    }
  }

  return {
    cycleDay: safeCycleDay,
    chapterId:
      chapter.chapterId,
    reference:
      chapter.reference,
    title:
      chapter.chapterId ===
      'john-1'
        ? 'The Word Tabernacled Among Us'
        : 'Today’s shared chapter',
  }
}

function getDateKeyInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )

  return `${values.year}-${values.month}-${values.day}`
}

function dateKeyToUtcMilliseconds(dateKey) {
  const [year, month, day] = dateKey
    .split('-')
    .map(Number)

  return Date.UTC(
    year,
    month - 1,
    day,
  )
}

export function getBetaCycleDay(now = new Date()) {
  const todayKey = getDateKeyInTimeZone(
    now,
    JOURNEY_TIME_ZONE,
  )

  const elapsedDays = Math.floor(
    (
      dateKeyToUtcMilliseconds(todayKey) -
      dateKeyToUtcMilliseconds(BETA_JOURNEY_START_DATE)
    ) /
      86_400_000,
  )

  return Math.min(
    TOTAL_CYCLE_DAYS,
    Math.max(1, elapsedDays + 1),
  )
}

export const CURRENT_CYCLE_DAY =
  getBetaCycleDay()

export const sharedJourney =
  getSharedJourneyForCycleDay(
    CURRENT_CYCLE_DAY,
  )

export function openSharedJourneyChapter(
  onOpenChapter,
  tab = 'read',
) {
  if (
    !sharedJourney.chapterId
  ) {
    return
  }

  sessionStorage.setItem(
    'project326-chapter-request',
    JSON.stringify({
      chapterId:
        sharedJourney.chapterId,
      tab,
      createdAt: Date.now(),
    }),
  )

  onOpenChapter(
    sharedJourney.chapterId,
  )
}
