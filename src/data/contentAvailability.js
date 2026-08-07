const FULLY_AVAILABLE_BOOKS = [
  'john',
  'romans',
  'genesis',
  'acts',
  'ruth',
  'mark',
  'habakkuk',
  'proverbs',
  'exodus',
  'james',
  'first-samuel',
  'jonah',
  'ephesians',
  'judges',
]

const PARTIALLY_AVAILABLE_BOOKS = {
  psalms: {
    availableChapters: 41,
  },
}

export function isBookFullyAvailable(bookId) {
  return FULLY_AVAILABLE_BOOKS.includes(bookId)
}

export function isChapterContentAvailable(
  bookId,
  chapterNumber,
) {
  if (isBookFullyAvailable(bookId)) {
    return true
  }

  const partialBook =
    PARTIALLY_AVAILABLE_BOOKS[bookId]

  if (!partialBook) {
    return false
  }

  return (
    chapterNumber <=
    partialBook.availableChapters
  )
}

export function getBookAvailability(
  bookId,
  totalChapters,
) {
  if (isBookFullyAvailable(bookId)) {
    return {
      status: 'available',
      availableChapters: totalChapters,
      totalChapters,
    }
  }

  const partialBook =
    PARTIALLY_AVAILABLE_BOOKS[bookId]

  if (partialBook) {
    return {
      status: 'partial',
      availableChapters:
        partialBook.availableChapters,
      totalChapters,
    }
  }

  return {
    status: 'development',
    availableChapters: 0,
    totalChapters,
  }
}

export const contentAvailability = {
  fullyAvailableBooks:
    FULLY_AVAILABLE_BOOKS,
  partiallyAvailableBooks:
    PARTIALLY_AVAILABLE_BOOKS,
}