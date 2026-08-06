import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react'

const bibleBooks = [
  {
    id: 'genesis',
    name: 'Genesis',
    abbreviation: 'Gen',
    chapters: 50,
    testament: 'Old Testament',
  },
  {
    id: 'exodus',
    name: 'Exodus',
    abbreviation: 'Ex',
    chapters: 40,
    testament: 'Old Testament',
  },
  {
    id: 'leviticus',
    name: 'Leviticus',
    abbreviation: 'Lev',
    chapters: 27,
    testament: 'Old Testament',
  },
  {
    id: 'numbers',
    name: 'Numbers',
    abbreviation: 'Num',
    chapters: 36,
    testament: 'Old Testament',
  },
  {
    id: 'deuteronomy',
    name: 'Deuteronomy',
    abbreviation: 'Deut',
    chapters: 34,
    testament: 'Old Testament',
  },
  {
    id: 'joshua',
    name: 'Joshua',
    abbreviation: 'Josh',
    chapters: 24,
    testament: 'Old Testament',
  },
  {
    id: 'judges',
    name: 'Judges',
    abbreviation: 'Judg',
    chapters: 21,
    testament: 'Old Testament',
  },
  {
    id: 'ruth',
    name: 'Ruth',
    abbreviation: 'Ruth',
    chapters: 4,
    testament: 'Old Testament',
  },
  {
    id: 'first-samuel',
    name: '1 Samuel',
    abbreviation: '1 Sam',
    chapters: 31,
    testament: 'Old Testament',
  },
  {
    id: 'second-samuel',
    name: '2 Samuel',
    abbreviation: '2 Sam',
    chapters: 24,
    testament: 'Old Testament',
  },
  {
    id: 'first-kings',
    name: '1 Kings',
    abbreviation: '1 Kings',
    chapters: 22,
    testament: 'Old Testament',
  },
  {
    id: 'second-kings',
    name: '2 Kings',
    abbreviation: '2 Kings',
    chapters: 25,
    testament: 'Old Testament',
  },
  {
    id: 'first-chronicles',
    name: '1 Chronicles',
    abbreviation: '1 Chron',
    chapters: 29,
    testament: 'Old Testament',
  },
  {
    id: 'second-chronicles',
    name: '2 Chronicles',
    abbreviation: '2 Chron',
    chapters: 36,
    testament: 'Old Testament',
  },
  {
    id: 'ezra',
    name: 'Ezra',
    abbreviation: 'Ezra',
    chapters: 10,
    testament: 'Old Testament',
  },
  {
    id: 'nehemiah',
    name: 'Nehemiah',
    abbreviation: 'Neh',
    chapters: 13,
    testament: 'Old Testament',
  },
  {
    id: 'esther',
    name: 'Esther',
    abbreviation: 'Esth',
    chapters: 10,
    testament: 'Old Testament',
  },
  {
    id: 'job',
    name: 'Job',
    abbreviation: 'Job',
    chapters: 42,
    testament: 'Old Testament',
  },
  {
    id: 'psalms',
    name: 'Psalms',
    abbreviation: 'Ps',
    chapters: 150,
    testament: 'Old Testament',
  },
  {
    id: 'proverbs',
    name: 'Proverbs',
    abbreviation: 'Prov',
    chapters: 31,
    testament: 'Old Testament',
  },
  {
    id: 'ecclesiastes',
    name: 'Ecclesiastes',
    abbreviation: 'Eccl',
    chapters: 12,
    testament: 'Old Testament',
  },
  {
    id: 'song-of-solomon',
    name: 'Song of Solomon',
    abbreviation: 'Song',
    chapters: 8,
    testament: 'Old Testament',
  },
  {
    id: 'isaiah',
    name: 'Isaiah',
    abbreviation: 'Isa',
    chapters: 66,
    testament: 'Old Testament',
  },
  {
    id: 'jeremiah',
    name: 'Jeremiah',
    abbreviation: 'Jer',
    chapters: 52,
    testament: 'Old Testament',
  },
  {
    id: 'lamentations',
    name: 'Lamentations',
    abbreviation: 'Lam',
    chapters: 5,
    testament: 'Old Testament',
  },
  {
    id: 'ezekiel',
    name: 'Ezekiel',
    abbreviation: 'Ezek',
    chapters: 48,
    testament: 'Old Testament',
  },
  {
    id: 'daniel',
    name: 'Daniel',
    abbreviation: 'Dan',
    chapters: 12,
    testament: 'Old Testament',
  },
  {
    id: 'hosea',
    name: 'Hosea',
    abbreviation: 'Hos',
    chapters: 14,
    testament: 'Old Testament',
  },
  {
    id: 'joel',
    name: 'Joel',
    abbreviation: 'Joel',
    chapters: 3,
    testament: 'Old Testament',
  },
  {
    id: 'amos',
    name: 'Amos',
    abbreviation: 'Amos',
    chapters: 9,
    testament: 'Old Testament',
  },
  {
    id: 'obadiah',
    name: 'Obadiah',
    abbreviation: 'Obad',
    chapters: 1,
    testament: 'Old Testament',
  },
  {
    id: 'jonah',
    name: 'Jonah',
    abbreviation: 'Jonah',
    chapters: 4,
    testament: 'Old Testament',
  },
  {
    id: 'micah',
    name: 'Micah',
    abbreviation: 'Mic',
    chapters: 7,
    testament: 'Old Testament',
  },
  {
    id: 'nahum',
    name: 'Nahum',
    abbreviation: 'Nah',
    chapters: 3,
    testament: 'Old Testament',
  },
  {
    id: 'habakkuk',
    name: 'Habakkuk',
    abbreviation: 'Hab',
    chapters: 3,
    testament: 'Old Testament',
  },
  {
    id: 'zephaniah',
    name: 'Zephaniah',
    abbreviation: 'Zeph',
    chapters: 3,
    testament: 'Old Testament',
  },
  {
    id: 'haggai',
    name: 'Haggai',
    abbreviation: 'Hag',
    chapters: 2,
    testament: 'Old Testament',
  },
  {
    id: 'zechariah',
    name: 'Zechariah',
    abbreviation: 'Zech',
    chapters: 14,
    testament: 'Old Testament',
  },
  {
    id: 'malachi',
    name: 'Malachi',
    abbreviation: 'Mal',
    chapters: 4,
    testament: 'Old Testament',
  },
  {
    id: 'matthew',
    name: 'Matthew',
    abbreviation: 'Matt',
    chapters: 28,
    testament: 'New Testament',
  },
  {
    id: 'mark',
    name: 'Mark',
    abbreviation: 'Mark',
    chapters: 16,
    testament: 'New Testament',
  },
  {
    id: 'luke',
    name: 'Luke',
    abbreviation: 'Luke',
    chapters: 24,
    testament: 'New Testament',
  },
  {
    id: 'john',
    name: 'John',
    abbreviation: 'John',
    chapters: 21,
    testament: 'New Testament',
  },
  {
    id: 'acts',
    name: 'Acts',
    abbreviation: 'Acts',
    chapters: 28,
    testament: 'New Testament',
  },
  {
    id: 'romans',
    name: 'Romans',
    abbreviation: 'Rom',
    chapters: 16,
    testament: 'New Testament',
  },
  {
    id: 'first-corinthians',
    name: '1 Corinthians',
    abbreviation: '1 Cor',
    chapters: 16,
    testament: 'New Testament',
  },
  {
    id: 'second-corinthians',
    name: '2 Corinthians',
    abbreviation: '2 Cor',
    chapters: 13,
    testament: 'New Testament',
  },
  {
    id: 'galatians',
    name: 'Galatians',
    abbreviation: 'Gal',
    chapters: 6,
    testament: 'New Testament',
  },
  {
    id: 'ephesians',
    name: 'Ephesians',
    abbreviation: 'Eph',
    chapters: 6,
    testament: 'New Testament',
  },
  {
    id: 'philippians',
    name: 'Philippians',
    abbreviation: 'Phil',
    chapters: 4,
    testament: 'New Testament',
  },
  {
    id: 'colossians',
    name: 'Colossians',
    abbreviation: 'Col',
    chapters: 4,
    testament: 'New Testament',
  },
  {
    id: 'first-thessalonians',
    name: '1 Thessalonians',
    abbreviation: '1 Thess',
    chapters: 5,
    testament: 'New Testament',
  },
  {
    id: 'second-thessalonians',
    name: '2 Thessalonians',
    abbreviation: '2 Thess',
    chapters: 3,
    testament: 'New Testament',
  },
  {
    id: 'first-timothy',
    name: '1 Timothy',
    abbreviation: '1 Tim',
    chapters: 6,
    testament: 'New Testament',
  },
  {
    id: 'second-timothy',
    name: '2 Timothy',
    abbreviation: '2 Tim',
    chapters: 4,
    testament: 'New Testament',
  },
  {
    id: 'titus',
    name: 'Titus',
    abbreviation: 'Titus',
    chapters: 3,
    testament: 'New Testament',
  },
  {
    id: 'philemon',
    name: 'Philemon',
    abbreviation: 'Philem',
    chapters: 1,
    testament: 'New Testament',
  },
  {
    id: 'hebrews',
    name: 'Hebrews',
    abbreviation: 'Heb',
    chapters: 13,
    testament: 'New Testament',
  },
  {
    id: 'james',
    name: 'James',
    abbreviation: 'James',
    chapters: 5,
    testament: 'New Testament',
  },
  {
    id: 'first-peter',
    name: '1 Peter',
    abbreviation: '1 Pet',
    chapters: 5,
    testament: 'New Testament',
  },
  {
    id: 'second-peter',
    name: '2 Peter',
    abbreviation: '2 Pet',
    chapters: 3,
    testament: 'New Testament',
  },
  {
    id: 'first-john',
    name: '1 John',
    abbreviation: '1 John',
    chapters: 5,
    testament: 'New Testament',
  },
  {
    id: 'second-john',
    name: '2 John',
    abbreviation: '2 John',
    chapters: 1,
    testament: 'New Testament',
  },
  {
    id: 'third-john',
    name: '3 John',
    abbreviation: '3 John',
    chapters: 1,
    testament: 'New Testament',
  },
  {
    id: 'jude',
    name: 'Jude',
    abbreviation: 'Jude',
    chapters: 1,
    testament: 'New Testament',
  },
  {
    id: 'revelation',
    name: 'Revelation',
    abbreviation: 'Rev',
    chapters: 22,
    testament: 'New Testament',
  },
]

function BibleReader({
  initialBookId = 'john',
  initialChapter = 1,
}) {
  const [selectedBookId, setSelectedBookId] =
    useState(initialBookId)

  const [selectedChapter, setSelectedChapter] =
    useState(initialChapter)

  const [currentView, setCurrentView] = useState('reader')
  const [fontSize, setFontSize] = useState(18)

  const selectedBook = useMemo(
    () =>
      bibleBooks.find(
        (book) => book.id === selectedBookId,
      ) || bibleBooks[0],
    [selectedBookId],
  )

  const oldTestamentBooks = useMemo(
    () =>
      bibleBooks.filter(
        (book) => book.testament === 'Old Testament',
      ),
    [],
  )

  const newTestamentBooks = useMemo(
    () =>
      bibleBooks.filter(
        (book) => book.testament === 'New Testament',
      ),
    [],
  )

  const chapterOptions = useMemo(
    () =>
      Array.from(
        { length: selectedBook.chapters },
        (_, index) => index + 1,
      ),
    [selectedBook],
  )

  function selectBook(bookId) {
    setSelectedBookId(bookId)
    setSelectedChapter(1)
    setCurrentView('chapters')
  }

  function selectChapter(chapterNumber) {
    setSelectedChapter(chapterNumber)
    setCurrentView('reader')

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  function goToPreviousChapter() {
    if (selectedChapter > 1) {
      setSelectedChapter((current) => current - 1)
      return
    }

    const currentBookIndex = bibleBooks.findIndex(
      (book) => book.id === selectedBook.id,
    )

    if (currentBookIndex <= 0) {
      return
    }

    const previousBook = bibleBooks[currentBookIndex - 1]

    setSelectedBookId(previousBook.id)
    setSelectedChapter(previousBook.chapters)
  }

  function goToNextChapter() {
    if (selectedChapter < selectedBook.chapters) {
      setSelectedChapter((current) => current + 1)
      return
    }

    const currentBookIndex = bibleBooks.findIndex(
      (book) => book.id === selectedBook.id,
    )

    if (currentBookIndex >= bibleBooks.length - 1) {
      return
    }

    const nextBook = bibleBooks[currentBookIndex + 1]

    setSelectedBookId(nextBook.id)
    setSelectedChapter(1)
  }

  function decreaseFontSize() {
    setFontSize((current) => Math.max(current - 2, 14))
  }

  function increaseFontSize() {
    setFontSize((current) => Math.min(current + 2, 28))
  }

  function renderBookButtons(books) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {books.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => selectBook(book.id)}
            className={`min-h-14 rounded-xl border px-3 py-3 text-left transition active:scale-[0.97] ${
              selectedBookId === book.id
                ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-200'
                : 'border-white/5 bg-white/[0.035] text-slate-200 hover:border-cyan-400/20 hover:bg-cyan-400/[0.07]'
            }`}
          >
            <span className="block text-sm font-semibold">
              {book.name}
            </span>

            <span className="mt-1 block text-[11px] text-slate-500">
              {book.chapters}{' '}
              {book.chapters === 1 ? 'chapter' : 'chapters'}
            </span>
          </button>
        ))}
      </div>
    )
  }

  if (currentView === 'books') {
    return (
      <div className="space-y-4">
        <section className="rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.08] to-[#0d1821] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <BookOpen size={23} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                NASB 1995
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Choose a Book
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Select the book you want to read.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-[#12202b] p-4 sm:p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            Old Testament
          </h3>

          {renderBookButtons(oldTestamentBooks)}
        </section>

        <section className="rounded-3xl border border-white/5 bg-[#12202b] p-4 sm:p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
            New Testament
          </h3>

          {renderBookButtons(newTestamentBooks)}
        </section>
      </div>
    )
  }

  if (currentView === 'chapters') {
    return (
      <div className="space-y-4">
        <section className="rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.08] to-[#0d1821] p-5">
          <button
            type="button"
            onClick={() => setCurrentView('books')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300"
          >
            <ArrowLeft size={17} />
            All Books
          </button>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <BookOpen size={23} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                NASB 1995
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {selectedBook.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Choose a chapter to begin reading.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-[#12202b] p-4 sm:p-5">
          <div className="grid grid-cols-5 gap-2 min-[420px]:grid-cols-6 sm:grid-cols-8">
            {chapterOptions.map((chapterNumber) => (
              <button
                key={chapterNumber}
                type="button"
                onClick={() => selectChapter(chapterNumber)}
                className={`flex aspect-square items-center justify-center rounded-xl border text-sm font-bold transition active:scale-90 ${
                  selectedChapter === chapterNumber
                    ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-200'
                    : 'border-white/5 bg-white/[0.035] text-slate-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.07]'
                }`}
                aria-label={`${selectedBook.name} chapter ${chapterNumber}`}
              >
                {chapterNumber}
              </button>
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-white/5 bg-[#12202b] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setCurrentView('books')}
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.035] px-4 py-3 text-left transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06]"
          >
            <BookOpen
              size={20}
              className="shrink-0 text-cyan-300"
            />

            <div>
              <span className="block text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                Change Passage
              </span>

              <span className="mt-1 block text-base font-semibold text-white">
                {selectedBook.name} {selectedChapter}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('chapters')}
            className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:text-white"
          >
            Choose Chapter
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5">
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
              New American Standard Bible 1995
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {selectedBook.name} {selectedChapter}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={decreaseFontSize}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:border-cyan-400/20 hover:text-white"
              aria-label="Decrease text size"
            >
              <Minus size={17} />
            </button>

            <button
              type="button"
              onClick={increaseFontSize}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:border-cyan-400/20 hover:text-white"
              aria-label="Increase text size"
            >
              <Plus size={17} />
            </button>
          </div>
        </div>

        <div
          className="py-10 text-center leading-8 text-slate-300"
          style={{ fontSize: `${fontSize}px` }}
        >
          <BookOpen
            size={36}
            className="mx-auto text-cyan-300"
          />

          <p className="mx-auto mt-4 max-w-lg">
            NASB 1995 Scripture text for {selectedBook.name}{' '}
            {selectedChapter} will appear here after the licensed
            electronic files from The Lockman Foundation are
            imported.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-4">
          <button
            type="button"
            onClick={goToPreviousChapter}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:text-white"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('chapters')}
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/[0.07]"
          >
            Chapters
          </button>

          <button
            type="button"
            onClick={goToNextChapter}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:text-white"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
        <p className="text-xs leading-5 text-slate-500">
          New American Standard Bible - NASB 1995. Copyright ©
          1960, 1962, 1963, 1968, 1971, 1972, 1973, 1975, 1977,
          1995 by The Lockman Foundation. All rights reserved.
        </p>
      </section>
    </div>
  )
}

export default BibleReader