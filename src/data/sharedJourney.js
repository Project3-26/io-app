export const TOTAL_CYCLE_DAYS = 1189

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

    Example:

    {
      id: 'luke',
      name: 'Luke',
      chapters: 24,
    },
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

    /*
      Chapter-specific titles will eventually
      come from the backend/content database.

      John 1 keeps the current prototype title.
    */
    title:
      chapter.chapterId ===
      'john-1'
        ? 'The Word Tabernacled Among Us'
        : 'Today’s shared chapter',
  }
}

/*
  PROTOTYPE CURRENT DAY

  Later the backend will determine this from
  the official Project 3|26 cycle calendar.

  For now, changing this number lets us test
  the journey sequence.
*/
export const CURRENT_CYCLE_DAY = 1

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