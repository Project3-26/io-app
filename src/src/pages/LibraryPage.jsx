import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Headphones,
  Library,
  Lock,
  Search,
  Sparkles,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import {
  getJourneyDay,
  isChapterUnlocked,
} from '../utils/journey'

const mockUser = {
  journeyStartDate: '2026-08-03',
}

const libraryResources = [
  {
    id: 'john-1-audio',
    chapterId: 'john-1',
    journeyDay: 1,
    book: 'John',
    chapter: 1,
    reference: 'John 1',
    title: 'The Word Tabernacled Among Us',
    type: 'audio',
    label: 'Audio Study',
    duration: '9:43',
    isFavorite: true,
  },
  {
    id: 'john-1-study',
    chapterId: 'john-1',
    journeyDay: 1,
    book: 'John',
    chapter: 1,
    reference: 'John 1',
    title: 'The Word Tabernacled Among Us',
    type: 'study',
    label: 'Study Guide',
    detail: 'Printable PDF',
    isFavorite: false,
  },
  {
    id: 'john-1-leader',
    chapterId: 'john-1',
    journeyDay: 1,
    book: 'John',
    chapter: 1,
    reference: 'John 1',
    title: 'The Word Tabernacled Among Us',
    type: 'leader',
    label: 'Leader Guide',
    detail: 'Leader Plan',
    isFavorite: false,
  },
  {
    id: 'john-2-audio',
    chapterId: 'john-2',
    journeyDay: 2,
    book: 'John',
    chapter: 2,
    reference: 'John 2',
    title: 'The First Sign',
    type: 'audio',
    label: 'Audio Study',
    duration: '11:08',
    isFavorite: false,
  },
  {
    id: 'john-2-study',
    chapterId: 'john-2',
    journeyDay: 2,
    book: 'John',
    chapter: 2,
    reference: 'John 2',
    title: 'The First Sign',
    type: 'study',
    label: 'Study Guide',
    detail: 'Printable PDF',
    isFavorite: false,
  },
  {
    id: 'john-3-audio',
    chapterId: 'john-3',
    journeyDay: 3,
    book: 'John',
    chapter: 3,
    reference: 'John 3',
    title: 'Born From Above',
    type: 'audio',
    label: 'Audio Study',
    duration: '10:34',
    isFavorite: false,
  },
  {
    id: 'john-3-study',
    chapterId: 'john-3',
    journeyDay: 3,
    book: 'John',
    chapter: 3,
    reference: 'John 3',
    title: 'Born From Above',
    type: 'study',
    label: 'Study Guide',
    detail: 'Printable PDF',
    isFavorite: false,
  },
  {
    id: 'romans-8-audio',
    chapterId: 'romans-8',
    journeyDay: 312,
    book: 'Romans',
    chapter: 8,
    reference: 'Romans 8',
    title: 'No Condemnation',
    type: 'audio',
    label: 'Audio Study',
    duration: '14:02',
    isFavorite: false,
  },
  {
    id: 'romans-8-study',
    chapterId: 'romans-8',
    journeyDay: 312,
    book: 'Romans',
    chapter: 8,
    reference: 'Romans 8',
    title: 'No Condemnation',
    type: 'study',
    label: 'Study Guide',
    detail: 'Printable PDF',
    isFavorite: false,
  },
]

const resourceTypes = [
  {
    id: 'bible',
    label: 'Bible',
    description: 'NASB 1995',
    icon: BookOpen,
  },
  {
    id: 'audio',
    label: 'Audio',
    description: 'Listen',
    icon: Headphones,
  },
  {
    id: 'study',
    label: 'Study Guides',
    description: 'Study',
    icon: FileText,
  },
  {
    id: 'leader',
    label: 'Leader Guides',
    description: 'Lead',
    icon: BookOpen,
  },
  {
    id: 'favorites',
    label: 'Favorites',
    description: 'Saved',
    icon: Bookmark,
  },
]

function getResourceIcon(type) {
  if (type === 'audio') {
    return Headphones
  }

  if (type === 'leader') {
    return BookOpen
  }

  return FileText
}

function LibraryPage({
  onNavigate,
  onOpenChapter,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const currentJourneyDay = getJourneyDay(
    mockUser.journeyStartDate,
  )

  const resourcesWithAccess = useMemo(() => {
    return libraryResources.map((resource) => ({
      ...resource,
      isUnlocked: isChapterUnlocked(
        resource.journeyDay,
        currentJourneyDay,
      ),
    }))
  }, [currentJourneyDay])

  const filteredResources = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase()

    return resourcesWithAccess.filter((resource) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        resource.reference
          .toLowerCase()
          .includes(normalizedSearch) ||
        resource.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        resource.book
          .toLowerCase()
          .includes(normalizedSearch) ||
        resource.label
          .toLowerCase()
          .includes(normalizedSearch)

      const matchesFilter =
        activeFilter === 'all' ||
        activeFilter === resource.type ||
        (activeFilter === 'favorites' &&
          resource.isFavorite) ||
        (activeFilter === 'unlocked' &&
          resource.isUnlocked) ||
        (activeFilter === 'locked' &&
          !resource.isUnlocked)

      return matchesSearch && matchesFilter
    })
  }, [
    activeFilter,
    resourcesWithAccess,
    searchTerm,
  ])

  const recentResources = resourcesWithAccess
    .filter((resource) => resource.isUnlocked)
    .slice(0, 3)

  const unlockedResources = filteredResources.filter(
    (resource) => resource.isUnlocked,
  )

  const lockedResources = filteredResources.filter(
    (resource) => !resource.isUnlocked,
  )

  function handleResourceType(resourceTypeId) {
    if (resourceTypeId === 'bible') {
      onOpenChapter('john-1')
      return
    }

    setActiveFilter((currentFilter) =>
      currentFilter === resourceTypeId
        ? 'all'
        : resourceTypeId,
    )
  }

  function handleResourceClick(resource) {
    if (!resource.isUnlocked) {
      return
    }

    onOpenChapter(resource.chapterId)
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="library"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-7xl px-3 pb-32 pt-5 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10 lg:pt-8 xl:px-10">
          <header>
            <p className="text-sm font-bold tracking-[0.18em] text-cyan-400">
              PROJECT 3|26
            </p>

            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  Library
                </h1>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Read the Bible and access your audio,
                  studies, leader guides, and saved resources.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300">
                <Library size={23} />
              </div>
            </div>
          </header>

          <section className="mt-7">
            <div className="relative">
              <Search
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search chapters, audio, PDFs, or topics"
                className="h-14 w-full rounded-2xl border border-white/5 bg-gradient-to-br from-[#0b2742] to-[#071a2d] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>
          </section>

          <section className="mt-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {resourceTypes.map((resourceType) => {
                const ResourceTypeIcon =
                  resourceType.icon

                const isBible =
                  resourceType.id === 'bible'

                const isActive =
                  activeFilter === resourceType.id

                return (
                  <button
                    key={resourceType.id}
                    type="button"
                    onClick={() =>
                      handleResourceType(
                        resourceType.id,
                      )
                    }
                    className={`group rounded-2xl border p-4 text-left transition active:scale-[0.98] ${
                      isBible
                        ? 'border-cyan-400/25 bg-gradient-to-br from-cyan-400/[0.15] to-[#071a2d] hover:border-cyan-400/40'
                        : isActive
                          ? 'border-cyan-400/30 bg-cyan-400/10'
                          : 'border-white/5 bg-gradient-to-br from-[#0b2742] to-[#071a2d] hover:border-white/10'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        isBible
                          ? 'bg-cyan-400/15 text-cyan-200'
                          : isActive
                            ? 'bg-cyan-400/15 text-cyan-300'
                            : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      <ResourceTypeIcon size={21} />
                    </div>

                    <p className="mt-3 text-sm font-semibold">
                      {resourceType.label}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {resourceType.description}
                    </p>

                    {isBible && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-300">
                        Open
                        <ArrowRight
                          size={14}
                          className="transition group-hover:translate-x-1"
                        />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {[
              ['all', 'All'],
              ['unlocked', 'Unlocked'],
              ['locked', 'Locked'],
              ['audio', 'Audio'],
              ['study', 'Study Guides'],
              ['leader', 'Leader Guides'],
            ].map(([filterId, filterLabel]) => (
              <button
                key={filterId}
                type="button"
                onClick={() =>
                  setActiveFilter(filterId)
                }
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeFilter === filterId
                    ? 'bg-cyan-500 text-[#041326]'
                    : 'border border-white/5 bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                {filterLabel}
              </button>
            ))}
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <section>
                <div>
                  <h2 className="text-xl font-bold">
                    Continue
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Return to your current Project 3|26 chapter.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenChapter('john-1')
                  }
                  className="group mt-4 w-full rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.08] to-[#071a2d] p-5 text-left shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-400/30 active:translate-y-0 active:scale-[0.99]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
                      <BookOpen size={26} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">
                        Current Chapter
                      </p>

                      <h3 className="mt-2 text-lg font-bold">
                        John 1
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        The Word Tabernacled Among Us
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
                      <ArrowRight
                        size={19}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </button>
              </section>

              <section>
                <div>
                  <h2 className="text-xl font-bold">
                    {searchTerm
                      ? 'Search Results'
                      : 'Available Resources'}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {filteredResources.length} resources found
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {unlockedResources.map((resource) => {
                    const ResourceIcon =
                      getResourceIcon(resource.type)

                    return (
                      <button
                        key={resource.id}
                        type="button"
                        onClick={() =>
                          handleResourceClick(resource)
                        }
                        className="group flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-gradient-to-br from-[#0b2742] to-[#071a2d] p-4 text-left transition hover:border-cyan-400/20 hover:bg-white/[0.04] active:scale-[0.99]"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.07] text-cyan-300">
                          <ResourceIcon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">
                              {resource.reference}
                            </p>

                            <span className="rounded-full border border-white/5 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              {resource.label}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-sm text-slate-400">
                            {resource.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {resource.duration ||
                              resource.detail}
                          </p>
                        </div>

                        {resource.isFavorite && (
                          <Bookmark
                            size={17}
                            fill="currentColor"
                            className="shrink-0 text-orange-400"
                          />
                        )}

                        <ChevronRight
                          size={19}
                          className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300"
                        />
                      </button>
                    )
                  })}

                  {lockedResources.map((resource) => {
                    const ResourceIcon =
                      getResourceIcon(resource.type)

                    return (
                      <div
                        key={resource.id}
                        className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 opacity-70"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-slate-500">
                          <ResourceIcon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-slate-400">
                              {resource.reference}
                            </p>

                            <span className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                              {resource.label}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {resource.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            Unlocks on Journey Day{' '}
                            {resource.journeyDay}
                          </p>
                        </div>

                        <Lock
                          size={18}
                          className="shrink-0 text-slate-600"
                        />
                      </div>
                    )
                  })}

                  {filteredResources.length === 0 && (
                    <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 text-center">
                      <Search
                        size={30}
                        className="mx-auto text-slate-600"
                      />

                      <h3 className="mt-4 font-semibold">
                        No resources found
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        Try another chapter, topic, or
                        resource type.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-4 lg:col-span-4">
              <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b2742] to-[#071a2d] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Recently Opened
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Return to recent resources
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {recentResources.map((resource) => (
                    <button
                      key={resource.id}
                      type="button"
                      onClick={() =>
                        handleResourceClick(resource)
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.04]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {resource.reference}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {resource.label}
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="text-slate-600"
                      />
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-orange-400/10 bg-gradient-to-br from-orange-400/[0.06] to-[#071a2d] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                    <Bookmark size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Saved Resources
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Favorites and bookmarks
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveFilter('favorites')
                  }
                  className="mt-5 flex w-full items-center justify-between rounded-xl border border-orange-400/10 bg-orange-400/[0.05] px-4 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-400/10"
                >
                  View Favorites
                  <ArrowRight size={17} />
                </button>
              </section>

              <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b2742] to-[#071a2d] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300">
                    <Download size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Downloads
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Offline audio and PDFs
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Offline downloads will appear here once
                  that feature is connected.
                </p>
              </section>

              <section className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.05] p-5">
                <div className="flex items-start gap-3">
                  <Sparkles
                    size={22}
                    className="mt-0.5 shrink-0 text-cyan-300"
                  />

                  <div>
                    <h2 className="font-semibold">
                      Challenges & Collections
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      Five-day challenges and special studies
                      will live in the Library too.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LibraryPage