import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react'
import { bibleBooks } from '../data/bibleBooks'
import { john1Scripture } from '../data/john1Scripture'

function BibleReader({
  initialBookId = 'john',
  initialChapter = 1,
}) {
  const [selectedBookId, setSelectedBookId] = useState(initialBookId)
  const [selectedChapter, setSelectedChapter] = useState(initialChapter)
  const [currentView, setCurrentView] = useState(() => {
    const requestedView = sessionStorage.getItem(
      'project326-bible-start-view',
    )

    return requestedView === 'books' ? 'books' : 'reader'
  })
  const [fontSize, setFontSize] = useState(18)

  useEffect(() => {
    const requestedView = sessionStorage.getItem(
      'project326-bible-start-view',
    )

    if (requestedView === 'books') {
      setCurrentView('books')
      sessionStorage.removeItem('project326-bible-start-view')
    }
  }, [])

  const selectedBook = useMemo(
    () =>
      bibleBooks.find((book) => book.id === selectedBookId) || bibleBooks[0],
    [selectedBookId],
  )

  const oldTestamentBooks = useMemo(
    () => bibleBooks.filter((book) => book.testament === 'Old Testament'),
    [],
  )

  const newTestamentBooks = useMemo(
    () => bibleBooks.filter((book) => book.testament === 'New Testament'),
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

  const hasLocalScripture =
    selectedBookId === john1Scripture.bookId &&
    selectedChapter === john1Scripture.chapterNumber

  function selectBook(bookId) {
    setSelectedBookId(bookId)
    setSelectedChapter(1)
    setCurrentView('chapters')
  }

  function selectChapter(chapterNumber) {
    setSelectedChapter(chapterNumber)
    setCurrentView('reader')

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  function goToPreviousChapter() {
    if (selectedChapter > 1) {
      setSelectedChapter((current) => current - 1)
      return
    }

    const currentBookIndex = bibleBooks.findIndex(
      (book) => book.id === selectedBook.id,
    )

    if (currentBookIndex <= 0) return

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

    if (currentBookIndex >= bibleBooks.length - 1) return

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
                ? 'border-cyan-400/40 bg-[#c7dce7] text-cyan-700'
                : 'border-[#c8d3db] bg-[#edf2f4] text-[#153047] hover:border-cyan-400/40 hover:bg-[#e7eef2]'
            }`}
          >
            <span className="block text-sm font-semibold">{book.name}</span>
            <span className="mt-1 block text-[11px] text-slate-500">
              {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
            </span>
          </button>
        ))}
      </div>
    )
  }

  if (currentView === 'books') {
    return (
      <div className="space-y-4">
        <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-lg shadow-black/10">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
              <BookOpen size={21} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                NASB 1995
              </p>
              <h2 className="mt-1.5 text-xl font-semibold">Choose a Book</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Select the book you want to read.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Old Testament
          </h3>
          {renderBookButtons(oldTestamentBooks)}
        </section>

        <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
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
        <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-lg shadow-black/10">
          <button
            type="button"
            onClick={() => setCurrentView('books')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700"
          >
            <ArrowLeft size={17} />
            All Books
          </button>

          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
              <BookOpen size={21} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                NASB 1995
              </p>
              <h2 className="mt-1.5 text-xl font-semibold">{selectedBook.name}</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Choose a chapter to begin reading.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
          <div className="grid grid-cols-5 gap-2 min-[420px]:grid-cols-6 sm:grid-cols-8">
            {chapterOptions.map((chapterNumber) => (
              <button
                key={chapterNumber}
                type="button"
                onClick={() => selectChapter(chapterNumber)}
                className={`flex aspect-square items-center justify-center rounded-xl border text-sm font-semibold transition active:scale-90 ${
                  selectedChapter === chapterNumber
                    ? 'border-cyan-400/50 bg-cyan-500 text-white'
                    : 'border-[#c8d3db] bg-[#edf2f4] text-[#153047] hover:border-cyan-400/40 hover:bg-[#e7eef2]'
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
      <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setCurrentView('books')}
            className="flex items-center gap-3 rounded-xl border border-[#c8d3db] bg-[#edf2f4] px-4 py-3 text-left transition hover:border-cyan-400/40 hover:bg-[#e7eef2]"
          >
            <BookOpen size={20} className="shrink-0 text-cyan-700" />
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-cyan-700">
                Change Passage
              </span>
              <span className="mt-1 block text-base font-semibold">
                {selectedBook.name} {selectedChapter}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('chapters')}
            className="rounded-xl border border-[#c8d3db] bg-[#edf2f4] px-4 py-3 text-sm font-semibold text-[#153047] transition hover:border-cyan-400/40 hover:bg-[#e7eef2]"
          >
            Choose Chapter
          </button>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-lg shadow-black/10">
        <div className="flex items-center justify-between gap-4 border-b border-[#c8d3db] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
              New American Standard Bible 1995
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              {selectedBook.name} {selectedChapter}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={decreaseFontSize}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c8d3db] bg-[#edf2f4] text-slate-600 transition hover:border-cyan-400/40 hover:text-cyan-700"
              aria-label="Decrease text size"
            >
              <Minus size={17} />
            </button>
            <button
              type="button"
              onClick={increaseFontSize}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c8d3db] bg-[#edf2f4] text-slate-600 transition hover:border-cyan-400/40 hover:text-cyan-700"
              aria-label="Increase text size"
            >
              <Plus size={17} />
            </button>
          </div>
        </div>

        {hasLocalScripture ? (
          <div
            className="py-2 leading-[1.85] text-[#243b50]"
            style={{ fontSize: `${fontSize}px` }}
          >
            {john1Scripture.sections.map((section) => (
              <section key={section.heading} className="mt-7 first:mt-3">
                <h3 className="mb-3 text-base font-bold text-[#153047] sm:text-lg">
                  {section.heading}
                </h3>
                <p>
                  {section.verses.map((verse) => (
                    <span key={verse.number}>
                      <sup className="mr-1 font-bold text-cyan-700">
                        {verse.number}
                      </sup>
                      {verse.text}{' '}
                    </span>
                  ))}
                </p>
              </section>
            ))}
          </div>
        ) : (
          <div
            className="py-10 text-center leading-8 text-slate-600"
            style={{ fontSize: `${fontSize}px` }}
          >
            <BookOpen size={36} className="mx-auto text-cyan-700" />
            <p className="mx-auto mt-4 max-w-lg">
              NASB 1995 Scripture text for {selectedBook.name}{' '}
              {selectedChapter} will appear here after the licensed electronic
              files from The Lockman Foundation are imported.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-[#c8d3db] pt-4">
          <button
            type="button"
            onClick={goToPreviousChapter}
            className="flex items-center gap-2 rounded-xl border border-[#c8d3db] bg-[#edf2f4] px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-cyan-400/40 hover:text-cyan-700"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('chapters')}
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-[#edf2f4]"
          >
            Chapters
          </button>

          <button
            type="button"
            onClick={goToNextChapter}
            className="flex items-center gap-2 rounded-xl border border-[#c8d3db] bg-[#edf2f4] px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-cyan-400/40 hover:text-cyan-700"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047]">
        <p className="text-xs leading-5 text-slate-500">
          New American Standard Bible - NASB 1995. Copyright © 1960, 1962,
          1963, 1968, 1971, 1972, 1973, 1975, 1977, 1995 by The Lockman
          Foundation. All rights reserved.
        </p>
      </section>
    </div>
  )
}

export default BibleReader
