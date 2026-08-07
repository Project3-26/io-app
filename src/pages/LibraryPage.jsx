import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  Crown,
  FileText,
  Headphones,
  Library,
  Lock,
  Search,
  Wrench,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import {
  getBookAvailability,
  isChapterContentAvailable,
} from '../data/contentAvailability'
import {
  getCurrentUser,
} from '../services/api'

const COMPLETED_CHAPTERS_KEY =
  'project326-completed-chapters'

const bibleBooks = [
  { id: 'genesis', name: 'Genesis', chapters: 50, testament: 'Old Testament' },
  { id: 'exodus', name: 'Exodus', chapters: 40, testament: 'Old Testament' },
  { id: 'leviticus', name: 'Leviticus', chapters: 27, testament: 'Old Testament' },
  { id: 'numbers', name: 'Numbers', chapters: 36, testament: 'Old Testament' },
  { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, testament: 'Old Testament' },
  { id: 'joshua', name: 'Joshua', chapters: 24, testament: 'Old Testament' },
  { id: 'judges', name: 'Judges', chapters: 21, testament: 'Old Testament' },
  { id: 'ruth', name: 'Ruth', chapters: 4, testament: 'Old Testament' },
  { id: 'first-samuel', name: '1 Samuel', chapters: 31, testament: 'Old Testament' },
  { id: 'second-samuel', name: '2 Samuel', chapters: 24, testament: 'Old Testament' },
  { id: 'first-kings', name: '1 Kings', chapters: 22, testament: 'Old Testament' },
  { id: 'second-kings', name: '2 Kings', chapters: 25, testament: 'Old Testament' },
  { id: 'first-chronicles', name: '1 Chronicles', chapters: 29, testament: 'Old Testament' },
  { id: 'second-chronicles', name: '2 Chronicles', chapters: 36, testament: 'Old Testament' },
  { id: 'ezra', name: 'Ezra', chapters: 10, testament: 'Old Testament' },
  { id: 'nehemiah', name: 'Nehemiah', chapters: 13, testament: 'Old Testament' },
  { id: 'esther', name: 'Esther', chapters: 10, testament: 'Old Testament' },
  { id: 'job', name: 'Job', chapters: 42, testament: 'Old Testament' },
  { id: 'psalms', name: 'Psalms', chapters: 150, testament: 'Old Testament' },
  { id: 'proverbs', name: 'Proverbs', chapters: 31, testament: 'Old Testament' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, testament: 'Old Testament' },
  { id: 'song-of-solomon', name: 'Song of Solomon', chapters: 8, testament: 'Old Testament' },
  { id: 'isaiah', name: 'Isaiah', chapters: 66, testament: 'Old Testament' },
  { id: 'jeremiah', name: 'Jeremiah', chapters: 52, testament: 'Old Testament' },
  { id: 'lamentations', name: 'Lamentations', chapters: 5, testament: 'Old Testament' },
  { id: 'ezekiel', name: 'Ezekiel', chapters: 48, testament: 'Old Testament' },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'Old Testament' },
  { id: 'hosea', name: 'Hosea', chapters: 14, testament: 'Old Testament' },
  { id: 'joel', name: 'Joel', chapters: 3, testament: 'Old Testament' },
  { id: 'amos', name: 'Amos', chapters: 9, testament: 'Old Testament' },
  { id: 'obadiah', name: 'Obadiah', chapters: 1, testament: 'Old Testament' },
  { id: 'jonah', name: 'Jonah', chapters: 4, testament: 'Old Testament' },
  { id: 'micah', name: 'Micah', chapters: 7, testament: 'Old Testament' },
  { id: 'nahum', name: 'Nahum', chapters: 3, testament: 'Old Testament' },
  { id: 'habakkuk', name: 'Habakkuk', chapters: 3, testament: 'Old Testament' },
  { id: 'zephaniah', name: 'Zephaniah', chapters: 3, testament: 'Old Testament' },
  { id: 'haggai', name: 'Haggai', chapters: 2, testament: 'Old Testament' },
  { id: 'zechariah', name: 'Zechariah', chapters: 14, testament: 'Old Testament' },
  { id: 'malachi', name: 'Malachi', chapters: 4, testament: 'Old Testament' },

  { id: 'matthew', name: 'Matthew', chapters: 28, testament: 'New Testament' },
  { id: 'mark', name: 'Mark', chapters: 16, testament: 'New Testament' },
  { id: 'luke', name: 'Luke', chapters: 24, testament: 'New Testament' },
  { id: 'john', name: 'John', chapters: 21, testament: 'New Testament' },
  { id: 'acts', name: 'Acts', chapters: 28, testament: 'New Testament' },
  { id: 'romans', name: 'Romans', chapters: 16, testament: 'New Testament' },
  { id: 'first-corinthians', name: '1 Corinthians', chapters: 16, testament: 'New Testament' },
  { id: 'second-corinthians', name: '2 Corinthians', chapters: 13, testament: 'New Testament' },
  { id: 'galatians', name: 'Galatians', chapters: 6, testament: 'New Testament' },
  { id: 'ephesians', name: 'Ephesians', chapters: 6, testament: 'New Testament' },
  { id: 'philippians', name: 'Philippians', chapters: 4, testament: 'New Testament' },
  { id: 'colossians', name: 'Colossians', chapters: 4, testament: 'New Testament' },
  { id: 'first-thessalonians', name: '1 Thessalonians', chapters: 5, testament: 'New Testament' },
  { id: 'second-thessalonians', name: '2 Thessalonians', chapters: 3, testament: 'New Testament' },
  { id: 'first-timothy', name: '1 Timothy', chapters: 6, testament: 'New Testament' },
  { id: 'second-timothy', name: '2 Timothy', chapters: 4, testament: 'New Testament' },
  { id: 'titus', name: 'Titus', chapters: 3, testament: 'New Testament' },
  { id: 'philemon', name: 'Philemon', chapters: 1, testament: 'New Testament' },
  { id: 'hebrews', name: 'Hebrews', chapters: 13, testament: 'New Testament' },
  { id: 'james', name: 'James', chapters: 5, testament: 'New Testament' },
  { id: 'first-peter', name: '1 Peter', chapters: 5, testament: 'New Testament' },
  { id: 'second-peter', name: '2 Peter', chapters: 3, testament: 'New Testament' },
  { id: 'first-john', name: '1 John', chapters: 5, testament: 'New Testament' },
  { id: 'second-john', name: '2 John', chapters: 1, testament: 'New Testament' },
  { id: 'third-john', name: '3 John', chapters: 1, testament: 'New Testament' },
  { id: 'jude', name: 'Jude', chapters: 1, testament: 'New Testament' },
  { id: 'revelation', name: 'Revelation', chapters: 22, testament: 'New Testament' },
]

const resourceTypes = [
  {
    id: 'bible',
    label: 'Bible',
    description: 'Read Scripture',
    icon: BookOpen,
    tab: 'read',
  },
  {
    id: 'audio',
    label: 'Audio',
    description: 'Listen',
    icon: Headphones,
    tab: 'listen',
  },
  {
    id: 'study',
    label: 'Study Guides',
    description: 'Go deeper',
    icon: FileText,
    tab: 'study',
  },
  {
    id: 'leader',
    label: 'Leader Guides',
    description: 'Lead others',
    icon: Crown,
    tab: 'leader',
  },
]

function readCompletedChapters() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(
        COMPLETED_CHAPTERS_KEY,
      ) || '[]',
    )

    return Array.isArray(stored)
      ? stored
      : []
  } catch {
    return []
  }
}

function LibraryPage({
  onNavigate,
  onOpenChapter,
}) {
  const [
    libraryView,
    setLibraryView,
  ] = useState('home')

  const [
    selectedResourceType,
    setSelectedResourceType,
  ] = useState(null)

  const [
    selectedBookId,
    setSelectedBookId,
  ] = useState(null)

  const [
    bookSearch,
    setBookSearch,
  ] = useState('')

  const [
    completedChapterIds,
    setCompletedChapterIds,
  ] = useState(() =>
    readCompletedChapters(),
  )

  const [
    user,
    setUser,
  ] = useState(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser =
          await getCurrentUser()

        setUser(currentUser)
      } catch {
        setUser(null)
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    function refreshCompletedChapters() {
      setCompletedChapterIds(
        readCompletedChapters(),
      )
    }

    window.addEventListener(
      'focus',
      refreshCompletedChapters,
    )

    window.addEventListener(
      'storage',
      refreshCompletedChapters,
    )

    window.addEventListener(
      'project326-completion-change',
      refreshCompletedChapters,
    )

    return () => {
      window.removeEventListener(
        'focus',
        refreshCompletedChapters,
      )

      window.removeEventListener(
        'storage',
        refreshCompletedChapters,
      )

      window.removeEventListener(
        'project326-completion-change',
        refreshCompletedChapters,
      )
    }
  }, [])

  const hasLeaderAccess =
    user?.plan === 'leader'

  const selectedResource =
    resourceTypes.find(
      (resource) =>
        resource.id ===
        selectedResourceType,
    )

  const selectedBook =
    bibleBooks.find(
      (book) =>
        book.id ===
        selectedBookId,
    )

  const filteredBooks =
    useMemo(() => {
      const search =
        bookSearch
          .trim()
          .toLowerCase()

      if (!search) {
        return bibleBooks
      }

      return bibleBooks.filter(
        (book) =>
          book.name
            .toLowerCase()
            .includes(search),
      )
    }, [bookSearch])

  const oldTestamentBooks =
    filteredBooks.filter(
      (book) =>
        book.testament ===
        'Old Testament',
    )

  const newTestamentBooks =
    filteredBooks.filter(
      (book) =>
        book.testament ===
        'New Testament',
    )

  const chapterOptions =
    useMemo(() => {
      if (!selectedBook) {
        return []
      }

      return Array.from(
        {
          length:
            selectedBook.chapters,
        },
        (_, index) =>
          index + 1,
      )
    }, [selectedBook])

  function returnHome() {
    setLibraryView('home')
    setSelectedResourceType(null)
    setSelectedBookId(null)
    setBookSearch('')
  }

  function handleNavigation(pageId) {
    if (pageId === 'library') {
      returnHome()
      return
    }

    onNavigate(pageId)
  }

  function selectResource(
    resourceTypeId,
  ) {
    setSelectedResourceType(
      resourceTypeId,
    )

    setSelectedBookId(null)
    setBookSearch('')
    setLibraryView('books')
  }

  function selectBook(book) {
    const availability =
      getBookAvailability(
        book.id,
        book.chapters,
      )

    const isBible =
      selectedResourceType ===
      'bible'

    if (
      !isBible &&
      availability.status ===
        'development'
    ) {
      return
    }

    setSelectedBookId(book.id)
    setLibraryView('chapters')
  }

  function isChapterAvailable(
    chapterNumber,
  ) {
    if (
      selectedResourceType ===
      'bible'
    ) {
      return true
    }

    return isChapterContentAvailable(
      selectedBook.id,
      chapterNumber,
    )
  }

  function isChapterCompleted(
    chapterNumber,
  ) {
    const chapterId =
      `${selectedBook.id}-${chapterNumber}`

    return completedChapterIds.includes(
      chapterId,
    )
  }

  function openChapter(
    chapterNumber,
  ) {
    if (
      !isChapterAvailable(
        chapterNumber,
      )
    ) {
      return
    }

    const chapterId =
      `${selectedBook.id}-${chapterNumber}`

    const tab =
      selectedResource?.tab ||
      'read'

    sessionStorage.setItem(
      'project326-chapter-request',
      JSON.stringify({
        chapterId,
        tab,
        createdAt: Date.now(),
      }),
    )

    onOpenChapter(chapterId)
  }

  function returnToBooks() {
    setSelectedBookId(null)
    setLibraryView('books')
  }

  function renderBookButton(book) {
    const isBible =
      selectedResourceType ===
      'bible'

    const availability =
      getBookAvailability(
        book.id,
        book.chapters,
      )

    const isDevelopment =
      !isBible &&
      availability.status ===
        'development'

    const isPartial =
      !isBible &&
      availability.status ===
        'partial'

    return (
      <button
        key={book.id}
        type="button"
        onClick={() =>
          selectBook(book)
        }
        disabled={isDevelopment}
        className={`relative rounded-xl border px-3 py-3 text-left transition ${
          isDevelopment
            ? 'cursor-not-allowed border-[#c2ccd2] bg-[#d4dde2] text-slate-500'
            : 'border-[#c8d3db] bg-[#edf2f4] text-[#153047] hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.98]'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold">
            {book.name}
          </p>

          {isDevelopment && (
            <Lock
              size={13}
              className="mt-0.5 shrink-0 text-slate-400"
            />
          )}

          {isPartial && (
            <span className="shrink-0 rounded-full bg-[#c7dce7] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-cyan-700">
              Partial
            </span>
          )}
        </div>

        {isDevelopment ? (
          <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            <Wrench size={10} />
            In Development
          </p>
        ) : isPartial ? (
          <p className="mt-1 text-[11px] text-slate-500">
            {
              availability.availableChapters
            }{' '}
            of {book.chapters} available
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-slate-500">
            {book.chapters}{' '}
            {book.chapters === 1
              ? 'chapter'
              : 'chapters'}
          </p>
        )}
      </button>
    )
  }

  if (
    libraryView === 'books'
  ) {
    const ResourceIcon =
      selectedResource?.icon ||
      BookOpen

    const isBible =
      selectedResourceType ===
      'bible'

    return (
      <div className="min-h-screen bg-[#041326] text-white">
        <AppNavigation
          activePage="library"
          onNavigate={handleNavigation}
        />

        <div className="lg:pl-24">
          <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            <button
              type="button"
              onClick={returnHome}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#0c2138] px-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/35 hover:text-white"
            >
              <ArrowLeft size={17} />
              Library
            </button>

            <header className="mt-4 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-xl shadow-black/10">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                  <ResourceIcon
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    {
                      selectedResource?.label
                    }
                  </p>

                  <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                    Choose a Book
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    {isBible
                      ? 'Read any book of the Bible.'
                      : 'Available Project 3|26 resources are ready to open.'}
                  </p>
                </div>
              </div>
            </header>

            <div className="relative mt-4">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="search"
                value={bookSearch}
                onChange={(event) =>
                  setBookSearch(
                    event.target.value,
                  )
                }
                placeholder="Search books"
                className="h-12 w-full rounded-2xl border border-[#c8d3db] bg-[#dfe8ee] pl-11 pr-4 text-sm text-[#153047] outline-none placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>

            {oldTestamentBooks.length >
              0 && (
              <section className="mt-4 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  Old Testament
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {oldTestamentBooks.map(
                    renderBookButton,
                  )}
                </div>
              </section>
            )}

            {newTestamentBooks.length >
              0 && (
              <section className="mt-4 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  New Testament
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {newTestamentBooks.map(
                    renderBookButton,
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    )
  }

  if (
    libraryView ===
      'chapters' &&
    selectedBook
  ) {
    const ResourceIcon =
      selectedResource?.icon ||
      BookOpen

    const isBible =
      selectedResourceType ===
      'bible'

    const availability =
      getBookAvailability(
        selectedBook.id,
        selectedBook.chapters,
      )

    return (
      <div className="min-h-screen bg-[#041326] text-white">
        <AppNavigation
          activePage="library"
          onNavigate={handleNavigation}
        />

        <div className="lg:pl-24">
          <main className="mx-auto w-full max-w-5xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            <button
              type="button"
              onClick={
                returnToBooks
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#0c2138] px-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/35 hover:text-white"
            >
              <ArrowLeft
                size={17}
              />
              All Books
            </button>

            <header className="mt-4 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-xl shadow-black/10">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                  <ResourceIcon
                    size={21}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    {
                      selectedResource?.label
                    }
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-semibold sm:text-2xl">
                      {
                        selectedBook.name
                      }
                    </h1>

                    {!isBible &&
                      availability.status ===
                        'partial' && (
                        <span className="rounded-full bg-[#c7dce7] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-700">
                          {
                            availability.availableChapters
                          }{' '}
                          chapters available
                        </span>
                      )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {isBible
                      ? 'Choose any chapter.'
                      : 'Available chapters are ready to use.'}
                  </p>
                </div>
              </div>
            </header>

            <section className="mt-4 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
              <div className="grid grid-cols-5 gap-2 min-[420px]:grid-cols-6 sm:grid-cols-8 lg:grid-cols-10">
                {chapterOptions.map(
                  (
                    chapterNumber,
                  ) => {
                    const available =
                      isChapterAvailable(
                        chapterNumber,
                      )

                    const completed =
                      isChapterCompleted(
                        chapterNumber,
                      )

                    return (
                      <button
                        key={
                          chapterNumber
                        }
                        type="button"
                        onClick={() =>
                          openChapter(
                            chapterNumber,
                          )
                        }
                        disabled={
                          !available
                        }
                        className={`relative flex aspect-square items-center justify-center rounded-xl border text-sm font-semibold transition ${
                          !available
                            ? 'cursor-not-allowed border-[#c3ccd2] bg-[#d3dce1] text-slate-400'
                            : completed
                              ? 'border-cyan-500 bg-cyan-500 text-white shadow-md shadow-cyan-500/20 active:scale-90'
                              : 'border-[#c8d3db] bg-[#edf2f4] text-[#153047] hover:border-cyan-400/50 hover:bg-[#c7dce7] hover:text-cyan-700 active:scale-90'
                        }`}
                        aria-label={`${selectedBook.name} chapter ${chapterNumber}${
                          !available
                            ? ', in development'
                            : completed
                              ? ', completed'
                              : ''
                        }`}
                      >
                        {
                          chapterNumber
                        }

                        {completed &&
                          available && (
                            <Check
                              size={10}
                              strokeWidth={
                                3
                              }
                              className="absolute right-1 top-1"
                            />
                          )}

                        {!available && (
                          <Lock
                            size={9}
                            className="absolute right-1 top-1"
                          />
                        )}
                      </button>
                    )
                  },
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#c8d3db] pt-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-[#c8d3db] bg-[#edf2f4]" />
                  Available
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-cyan-500 text-white">
                    <Check
                      size={9}
                      strokeWidth={3}
                    />
                  </span>
                  Completed
                </div>

                {!isBible && (
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-[#d3dce1] text-slate-500">
                      <Lock
                        size={9}
                      />
                    </span>
                    In Development
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="library"
        onNavigate={handleNavigation}
      />

      <div className="lg:pl-24">
        <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 sm:text-sm">
                PROJECT 3|26
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Library
              </h1>

              <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
                Read Scripture anytime and explore every Project 3|26 resource available today.
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
              <Library
                size={21}
                strokeWidth={2.2}
              />
            </div>
          </header>

          <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {resourceTypes.map(
              (resource) => {
                const ResourceIcon =
                  resource.icon

                const isLeaderUpsell =
                  resource.id ===
                    'leader' &&
                  !hasLeaderAccess

                return (
                  <button
                    key={
                      resource.id
                    }
                    type="button"
                    onClick={() =>
                      selectResource(
                        resource.id,
                      )
                    }
                    className={`group rounded-[22px] border p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                      isLeaderUpsell
                        ? 'border-orange-300/40 bg-[#e8ddd0] hover:border-orange-400/60'
                        : 'border-[#c8d3db] bg-[#dfe8ee] hover:border-cyan-400/40 hover:bg-[#e7eef2]'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isLeaderUpsell
                          ? 'bg-orange-200/70 text-orange-600'
                          : 'bg-[#c7dce7] text-cyan-700'
                      }`}
                    >
                      <ResourceIcon
                        size={20}
                        strokeWidth={
                          2.2
                        }
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <p className="text-sm font-semibold">
                        {
                          resource.label
                        }
                      </p>

                      {isLeaderUpsell && (
                        <Lock
                          size={12}
                          className="text-orange-600"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {isLeaderUpsell
                        ? 'Unlock leader resources'
                        : resource.description}
                    </p>

                    <div
                      className={`mt-3 flex items-center gap-1 text-xs font-semibold ${
                        isLeaderUpsell
                          ? 'text-orange-600'
                          : 'text-cyan-700'
                      }`}
                    >
                      {isLeaderUpsell
                        ? 'Explore'
                        : 'Browse'}

                      <ChevronRight
                        size={14}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </button>
                )
              },
            )}
          </section>

          <section className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
              Chapter of the Day
            </p>

            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem(
                  'project326-chapter-request',
                  JSON.stringify({
                    chapterId:
                      'john-1',
                    tab: 'read',
                    createdAt:
                      Date.now(),
                  }),
                )

                onOpenChapter(
                  'john-1',
                )
              }}
              className="group mt-3 flex w-full items-center gap-4 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-xl shadow-black/10 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.99] sm:p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-white">
                <BookOpen
                  size={23}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold">
                  John 1
                </p>

                <p className="mt-1 truncate text-sm text-slate-500">
                  Join everyone reading today&apos;s chapter.
                </p>
              </div>

              <ArrowRight
                size={19}
                className="shrink-0 text-cyan-700 transition group-hover:translate-x-1"
              />
            </button>
          </section>

          <section className="mt-5 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                <Bookmark
                  size={19}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">
                  Your Journey
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {completedChapterIds.length}{' '}
                  chapters completed. Your progress follows you wherever you read.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default LibraryPage