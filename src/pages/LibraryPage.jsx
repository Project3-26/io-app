import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  ChevronRight,
  Clock3,
  FileText,
  Headphones,
  Library,
  Lock,
  Search,
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
    label: 'Audio',
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
    label: 'Audio',
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
    label: 'Audio',
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
    label: 'Audio',
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
    description: 'Read Scripture',
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
    description: 'Go deeper',
    icon: FileText,
  },
  {
    id: 'leader',
    label: 'Leader Guides',
    description: 'Lead others',
    icon: BookOpen,
  },
  {
    id: 'favorites',
    label: 'Favorites',
    description: 'Saved items',
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
        <main className="mx-auto w-full max-w-7xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 sm:text-sm">
                PROJECT 3|26
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Library
              </h1>

              <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
                Read Scripture and find the resources connected to your journey.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
              <Library size={23} strokeWidth={2.2} />
            </div>
          </header>

          <section className="mt-6">
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
                placeholder="Search chapters, audio, guides, or topics"
                className="h-14 w-full rounded-2xl border border-[#c8d3db] bg-[#dfe8ee] pl-12 pr-4 text-sm text-[#153047] shadow-lg shadow-black/10 outline-none transition placeholder:text-slate-500 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
              />
            </div>
          </section>

          <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
                  className={`group rounded-[22px] border p-4 text-left shadow-lg shadow-black/10 transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                    isBible
                      ? 'border-cyan-400/40 bg-[#dfe8ee] text-[#153047]'
                      : isActive
                        ? 'border-orange-300/60 bg-[#e8ddd0] text-[#153047]'
                        : 'border-[#c8d3db] bg-[#dfe8ee] text-[#153047] hover:border-cyan-400/40'
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      isBible
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/15'
                        : isActive
                          ? 'bg-orange-200/70 text-orange-600'
                          : 'bg-[#c7dce7] text-cyan-700'
                    }`}
                  >
                    <ResourceTypeIcon
                      size={21}
                      strokeWidth={2.2}
                    />
                  </div>

                  <p className="mt-3 text-sm font-semibold">
                    {resourceType.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {resourceType.description}
                  </p>

                  {isBible && (
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-700">
                      Open Bible
                      <ArrowRight
                        size={14}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  )}
                </button>
              )
            })}
          </section>

          <section className="mt-5 flex gap-2 overflow-x-auto pb-2">
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
                className={`shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                  activeFilter === filterId
                    ? 'border-cyan-500/50 bg-cyan-500 text-[#041326]'
                    : 'border-[#c8d3db] bg-[#dfe8ee] text-[#153047] hover:border-cyan-400/40'
                }`}
              >
                {filterLabel}
              </button>
            ))}
          </section>

          <section className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
              Continue
            </p>

            <button
              type="button"
              onClick={() =>
                onOpenChapter('john-1')
              }
              className="group mt-3 w-full rounded-[28px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-left text-[#153047] shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-cyan-400/40 active:translate-y-0 active:scale-[0.99] sm:p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-md shadow-cyan-500/15">
                  <BookOpen size={25} strokeWidth={2.2} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold">
                    John 1
                  </h2>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    The Word Tabernacled Among Us
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700">
                  <ArrowRight
                    size={19}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </div>
            </button>
          </section>

          <div className="mt-7 grid gap-6 lg:grid-cols-12">
            <section className="lg:col-span-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                    Resources
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    {searchTerm
                      ? 'Search Results'
                      : 'Available Resources'}
                  </h2>
                </div>

                <p className="text-sm text-slate-500">
                  {filteredResources.length} found
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
                      className="group flex w-full items-center gap-4 rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.99]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700">
                        <ResourceIcon
                          size={21}
                          strokeWidth={2.2}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">
                            {resource.reference}
                          </p>

                          <span className="rounded-full border border-[#c2ccd3] bg-[#edf2f4] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                            {resource.label}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {resource.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {resource.duration ||
                            resource.detail}
                        </p>
                      </div>

                      {resource.isFavorite && (
                        <Bookmark
                          size={17}
                          fill="currentColor"
                          className="shrink-0 text-orange-500"
                        />
                      )}

                      <ChevronRight
                        size={19}
                        className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-700"
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
                      className="flex items-center gap-4 rounded-[22px] border border-[#b9c4cb] bg-[#cbd4d9] p-4 text-[#153047] opacity-75"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#b3bec5] bg-[#d7e0e5] text-slate-500">
                        <ResourceIcon
                          size={21}
                          strokeWidth={2.1}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-600">
                            {resource.reference}
                          </p>

                          <span className="rounded-full border border-[#b3bec5] bg-[#d7e0e5] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                            {resource.label}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {resource.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Unlocks on Journey Day{' '}
                          {resource.journeyDay}
                        </p>
                      </div>

                      <Lock
                        size={18}
                        className="shrink-0 text-slate-500"
                      />
                    </div>
                  )
                })}

                {filteredResources.length === 0 && (
                  <div className="rounded-[28px] border border-[#c8d3db] bg-[#dfe8ee] p-8 text-center text-[#153047]">
                    <Search
                      size={30}
                      className="mx-auto text-slate-400"
                    />

                    <h3 className="mt-4 font-semibold">
                      No resources found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Try another chapter, topic, or resource type.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-4 lg:col-span-4">
              <section className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-lg shadow-black/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700">
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

                <div className="mt-4 space-y-2">
                  {recentResources.map((resource) => (
                    <button
                      key={resource.id}
                      type="button"
                      onClick={() =>
                        handleResourceClick(resource)
                      }
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-[#e7eef2]"
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
                        className="text-slate-400"
                      />
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-orange-300/50 bg-[#e8ddd0] p-5 text-[#153047] shadow-lg shadow-black/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-200/70 text-orange-600">
                    <Bookmark size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Favorites
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Saved resources and bookmarks
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveFilter('favorites')
                  }
                  className="mt-5 flex w-full items-center justify-between rounded-2xl border border-orange-400/40 bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
                >
                  View favorites
                  <ArrowRight size={17} />
                </button>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LibraryPage