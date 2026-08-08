import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  Crown,
  FileText,
  Headphones,
  Library,
  Lock,
  Search,
  Wrench,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import { bibleBooks } from '../data/bibleBooks'
import {
  getBookAvailability,
  isChapterContentAvailable,
} from '../data/contentAvailability'
import {
  openSharedJourneyChapter,
  sharedJourney,
} from '../data/sharedJourney'
import { getCurrentUser } from '../services/api'

const COMPLETED_CHAPTERS_KEY = 'project326-completed-chapters'

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
      localStorage.getItem(COMPLETED_CHAPTERS_KEY) || '[]',
    )

    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function LibraryPage({ onNavigate, onOpenChapter }) {
  const [libraryView, setLibraryView] = useState('home')
  const [selectedResourceType, setSelectedResourceType] = useState(null)
  const [selectedBookId, setSelectedBookId] = useState(null)
  const [bookSearch, setBookSearch] = useState('')
  const [completedChapterIds, setCompletedChapterIds] = useState(() =>
    readCompletedChapters(),
  )
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadUser() {
      try {
        setUser(await getCurrentUser())
      } catch {
        setUser(null)
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    function refreshCompletedChapters() {
      setCompletedChapterIds(readCompletedChapters())
    }

    window.addEventListener('focus', refreshCompletedChapters)
    window.addEventListener('storage', refreshCompletedChapters)
    window.addEventListener(
      'project326-completion-change',
      refreshCompletedChapters,
    )

    return () => {
      window.removeEventListener('focus', refreshCompletedChapters)
      window.removeEventListener('storage', refreshCompletedChapters)
      window.removeEventListener(
        'project326-completion-change',
        refreshCompletedChapters,
      )
    }
  }, [])

  const hasLeaderAccess = user?.plan === 'leader'

  const selectedResource = resourceTypes.find(
    (resource) => resource.id === selectedResourceType,
  )

  const selectedBook = bibleBooks.find((book) => book.id === selectedBookId)

  const filteredBooks = useMemo(() => {
    const search = bookSearch.trim().toLowerCase()

    if (!search) return bibleBooks

    return bibleBooks.filter((book) =>
      book.name.toLowerCase().includes(search),
    )
  }, [bookSearch])

  const oldTestamentBooks = filteredBooks.filter(
    (book) => book.testament === 'Old Testament',
  )

  const newTestamentBooks = filteredBooks.filter(
    (book) => book.testament === 'New Testament',
  )

  const chapterOptions = useMemo(() => {
    if (!selectedBook) return []

    return Array.from({ length: selectedBook.chapters }, (_, index) => index + 1)
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

  function selectResource(resourceTypeId) {
    setSelectedResourceType(resourceTypeId)
    setSelectedBookId(null)
    setBookSearch('')
    setLibraryView('books')
  }

  function selectBook(book) {
    const availability = getBookAvailability(book.id, book.chapters)
    const isBible = selectedResourceType === 'bible'

    if (!isBible && availability.status === 'development') return

    setSelectedBookId(book.id)
    setLibraryView('chapters')
  }

  function isChapterAvailable(chapterNumber) {
    if (selectedResourceType === 'bible') return true

    return isChapterContentAvailable(selectedBook.id, chapterNumber)
  }

  function isChapterCompleted(chapterNumber) {
    return completedChapterIds.includes(`${selectedBook.id}-${chapterNumber}`)
  }

  function openChapter(chapterNumber) {
    if (!isChapterAvailable(chapterNumber)) return

    const chapterId = `${selectedBook.id}-${chapterNumber}`
    const tab = selectedResource?.tab || 'read'

    sessionStorage.setItem(
      'project326-chapter-request',
      JSON.stringify({ chapterId, tab, createdAt: Date.now() }),
    )

    onOpenChapter(chapterId)
  }

  function returnToBooks() {
    setSelectedBookId(null)
    setLibraryView('books')
  }

  function renderBookButton(book) {
    const isBible = selectedResourceType === 'bible'
    const availability = getBookAvailability(book.id, book.chapters)
    const isDevelopment =
      !isBible && availability.status === 'development'
    const isPartial = !isBible && availability.status === 'partial'

    return (
      <button
        key={book.id}
        type="button"
        onClick={() => selectBook(book)}
        disabled={isDevelopment}
        className={`relative min-h-24 rounded-[20px] border p-3 text-left transition active:scale-[0.98] ${
          isDevelopment
            ? 'cursor-not-allowed border-white/5 bg-[#10263a] text-slate-500'
            : 'border-white/10 bg-[#0c2138] text-white hover:border-cyan-400/35'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold">{book.name}</p>

          {isDevelopment && <Lock size={13} className="shrink-0" />}

          {isPartial && (
            <span className="rounded-full bg-[#c7dce7] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-cyan-700">
              Partial
            </span>
          )}
        </div>

        {isDevelopment ? (
          <p className="mt-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            <Wrench size={10} />
            In Development
          </p>
        ) : isPartial ? (
          <p className="mt-3 text-[11px] text-slate-400">
            {availability.availableChapters} of {book.chapters} available
          </p>
        ) : (
          <p className="mt-3 text-[11px] text-slate-400">
            {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
          </p>
        )}
      </button>
    )
  }

  if (libraryView === 'books') {
    const ResourceIcon = selectedResource?.icon || BookOpen
    const isBible = selectedResourceType === 'bible'

    return (
      <div className="min-h-screen bg-[#041326] text-white">
        <AppNavigation activePage="library" onNavigate={handleNavigation} />

        <div className="lg:pl-24">
          <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={returnHome}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-slate-300 transition hover:border-cyan-400/35 hover:text-white"
                aria-label="Back to Library"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  {selectedResource?.label}
                </p>
                <h1 className="text-2xl font-bold">Choose a Book</h1>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700">
                <ResourceIcon size={19} />
              </div>
            </div>

            <div className="relative mt-5">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                value={bookSearch}
                onChange={(event) => setBookSearch(event.target.value)}
                placeholder="Search books"
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#0c2138] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
              />
            </div>

            {!isBible && (
              <div className="mt-3 rounded-2xl border border-white/10 bg-[#0c2138] px-4 py-3 text-xs text-slate-400">
                Only produced Project 3|26 resources can be opened here.
              </div>
            )}

            {oldTestamentBooks.length > 0 && (
              <section className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Old Testament
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {oldTestamentBooks.map(renderBookButton)}
                </div>
              </section>
            )}

            {newTestamentBooks.length > 0 && (
              <section className="mt-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  New Testament
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {newTestamentBooks.map(renderBookButton)}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    )
  }

  if (libraryView === 'chapters' && selectedBook) {
    const ResourceIcon = selectedResource?.icon || BookOpen
    const isBible = selectedResourceType === 'bible'
    const availability = getBookAvailability(
      selectedBook.id,
      selectedBook.chapters,
    )

    return (
      <div className="min-h-screen bg-[#041326] text-white">
        <AppNavigation activePage="library" onNavigate={handleNavigation} />

        <div className="lg:pl-24">
          <main className="mx-auto w-full max-w-5xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={returnToBooks}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-slate-300 transition hover:border-cyan-400/35 hover:text-white"
                aria-label="Back to books"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  {selectedResource?.label}
                </p>
                <h1 className="truncate text-2xl font-bold">{selectedBook.name}</h1>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700">
                <ResourceIcon size={19} />
              </div>
            </div>

            {!isBible && availability.status === 'partial' && (
              <div className="mt-4 inline-flex rounded-full bg-[#c7dce7] px-3 py-1 text-xs font-semibold text-cyan-700">
                {availability.availableChapters} chapters available
              </div>
            )}

            <section className="mt-5 rounded-[26px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
              <div className="grid grid-cols-5 gap-2 min-[420px]:grid-cols-6 sm:grid-cols-8 lg:grid-cols-10">
                {chapterOptions.map((chapterNumber) => {
                  const available = isChapterAvailable(chapterNumber)
                  const completed = isChapterCompleted(chapterNumber)

                  return (
                    <button
                      key={chapterNumber}
                      type="button"
                      onClick={() => openChapter(chapterNumber)}
                      disabled={!available}
                      className={`relative flex aspect-square items-center justify-center rounded-xl border text-sm font-semibold transition ${
                        !available
                          ? 'cursor-not-allowed border-[#c3ccd2] bg-[#d3dce1] text-slate-400'
                          : completed
                            ? 'border-cyan-500 bg-cyan-500 text-white shadow-md shadow-cyan-500/20 active:scale-90'
                            : 'border-[#c8d3db] bg-[#edf2f4] text-[#153047] hover:border-cyan-400/50 hover:bg-[#c7dce7] hover:text-cyan-700 active:scale-90'
                      }`}
                    >
                      {chapterNumber}
                      {completed && available && (
                        <Check size={10} strokeWidth={3} className="absolute right-1 top-1" />
                      )}
                      {!available && (
                        <Lock size={9} className="absolute right-1 top-1" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#c8d3db] pt-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-[#c8d3db] bg-[#edf2f4]" />
                  Available
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-cyan-500 text-white">
                    <Check size={9} strokeWidth={3} />
                  </span>
                  Completed
                </div>
                {!isBible && (
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-[#d3dce1] text-slate-500">
                      <Lock size={9} />
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
      <AppNavigation activePage="library" onNavigate={handleNavigation} />

      <div className="lg:pl-24">
        <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
          <header className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                PROJECT 3|26
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Library
              </h1>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-cyan-400">
              <Library size={21} />
            </div>
          </header>

          <button
            type="button"
            onClick={() => openSharedJourneyChapter(onOpenChapter, 'read')}
            className="group mt-5 w-full rounded-[28px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-left text-[#153047] shadow-xl shadow-black/15 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.995] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700 sm:text-xs">
                  Chapter of the Day
                </p>
                <h2 className="mt-2 text-3xl font-bold">{sharedJourney.reference}</h2>
                <p className="mt-1.5 text-sm font-semibold text-cyan-700">
                  {sharedJourney.title}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-white transition group-hover:translate-x-0.5">
                <ArrowRight size={19} />
              </div>
            </div>
          </button>

          <section className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
            {resourceTypes.map((resource) => {
              const ResourceIcon = resource.icon
              const isLeaderUpsell =
                resource.id === 'leader' && !hasLeaderAccess

              return (
                <button
                  key={resource.id}
                  type="button"
                  onClick={() => selectResource(resource.id)}
                  className={`group flex min-h-36 flex-col justify-between rounded-[26px] border p-4 text-left shadow-lg shadow-black/10 transition active:scale-[0.98] sm:min-h-40 sm:p-5 ${
                    isLeaderUpsell
                      ? 'border-orange-300/35 bg-[#e8ddd0] text-[#153047] hover:border-orange-400/60'
                      : resource.id === 'bible'
                        ? 'border-white/10 bg-[#0c2138] text-white hover:border-cyan-400/35'
                        : 'border-[#c8d3db] bg-[#dfe8ee] text-[#153047] hover:border-cyan-400/40 hover:bg-[#e7eef2]'
                  }`}
                >
                  <ResourceIcon
                    size={30}
                    strokeWidth={1.9}
                    className={
                      isLeaderUpsell
                        ? 'text-orange-600'
                        : resource.id === 'bible'
                          ? 'text-cyan-400'
                          : 'text-cyan-700'
                    }
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold sm:text-lg">
                        {resource.label}
                      </p>
                      {isLeaderUpsell && <Lock size={12} className="text-orange-600" />}
                    </div>
                    <p
                      className={`mt-1 text-xs leading-5 sm:text-sm ${
                        resource.id === 'bible' ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isLeaderUpsell ? 'Unlock leader resources' : resource.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </section>

          <section className="mt-4 rounded-[24px] border border-white/10 bg-[#0c2138] px-4 py-4 shadow-lg shadow-black/10 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                <Bookmark size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400 sm:text-xs">
                  Your Journey
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {completedChapterIds.length} chapters completed
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('journey')}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-cyan-400"
                aria-label="Open Journey"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default LibraryPage
