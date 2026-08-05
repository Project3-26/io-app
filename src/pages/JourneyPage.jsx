import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Flag,
  Flame,
  Lock,
  Map,
  Mountain,
  Play,
  Rocket,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

const completedBooks = [
  {
    id: 'genesis',
    name: 'Genesis',
    completed: 50,
    total: 50,
    status: 'completed',
  },
  {
    id: 'exodus',
    name: 'Exodus',
    completed: 40,
    total: 40,
    status: 'completed',
  },
  {
    id: 'mark',
    name: 'Mark',
    completed: 16,
    total: 16,
    status: 'completed',
  },
  {
    id: 'acts',
    name: 'Acts',
    completed: 28,
    total: 28,
    status: 'completed',
  },
]

const currentBook = {
  id: 'john',
  name: 'John',
  completed: 1,
  total: 21,
  status: 'current',
}

const upcomingBooks = [
  {
    id: 'romans',
    name: 'Romans',
    completed: 0,
    total: 16,
    status: 'next',
  },
  {
    id: 'first-corinthians',
    name: '1 Corinthians',
    completed: 0,
    total: 16,
    status: 'upcoming',
  },
  {
    id: 'second-corinthians',
    name: '2 Corinthians',
    completed: 0,
    total: 13,
    status: 'upcoming',
  },
  {
    id: 'galatians',
    name: 'Galatians',
    completed: 0,
    total: 6,
    status: 'upcoming',
  },
  {
    id: 'ephesians',
    name: 'Ephesians',
    completed: 0,
    total: 6,
    status: 'upcoming',
  },
]

const journeyBooks = [
  ...completedBooks,
  currentBook,
  ...upcomingBooks,
]

function JourneyPage({
  onNavigate,
  onOpenChapter,
}) {
  const chaptersCompleted = 242
  const totalChapters = 1189
  const chaptersRemaining = totalChapters - chaptersCompleted
  const overallProgress = Math.round(
    (chaptersCompleted / totalChapters) * 1000,
  ) / 10

  const currentBookProgress = Math.round(
    (currentBook.completed / currentBook.total) * 100,
  )

  return (
    <div className="min-h-screen bg-[#06111b] text-white">
      <AppNavigation
        activePage="journey"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-7xl px-3 pb-32 pt-5 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10 lg:pt-8 xl:px-10">
          {/* Header */}
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold tracking-[0.18em] text-[#45c6d8]">
                PROJECT 3|26
              </p>

              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Journey
              </h1>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Your 3.26-year journey through Scripture.
              </p>
            </div>

            <button
                type="button"
                className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-orange-400/60 bg-orange-400/15 text-orange-300 shadow-[0_0_22px_rgba(251,146,60,0.45)] transition hover:scale-105 hover:bg-orange-400/20 hover:shadow-[0_0_30px_rgba(251,146,60,0.65)] active:scale-95"
                aria-label="New journey achievement"
                title="New achievement earned"
            >
            <span className="absolute inset-0 animate-ping rounded-full border border-orange-400/30 opacity-40" />

            <Rocket
                size={23}
                className="relative z-10"
            />

            <span className="absolute -right-1 -top-1 z-20 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#06111b] bg-orange-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-orange-500/40">
                1
            </span>
            </button>
          </header>

          {/* Top progress cards */}
          <section className="mt-7 grid gap-4 lg:grid-cols-12 lg:gap-6">
            {/* Overall progress */}
            <article className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-xl shadow-black/20 lg:col-span-7 lg:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold sm:text-lg">
                  Overall Progress
                </h2>

                <span className="text-lg font-bold text-cyan-300">
                  {overallProgress}%
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center sm:mx-0 lg:h-40 lg:w-40">
                  <div className="absolute inset-0 rounded-full border-[14px] border-slate-700/50" />

                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#22d3ee ${overallProgress}%, transparent ${overallProgress}%)`,
                      maskImage:
                        'radial-gradient(circle, transparent 56%, black 58%)',
                      WebkitMaskImage:
                        'radial-gradient(circle, transparent 56%, black 58%)',
                    }}
                  />

                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {chaptersCompleted}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      of {totalChapters}
                    </p>

                    <p className="text-xs text-slate-400">
                      chapters
                    </p>
                  </div>
                </div>

                <div className="grid flex-1 gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                    <CheckCircle2
                      size={20}
                      className="text-cyan-300"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-200">
                        Completed
                      </p>
                    </div>

                    <p className="font-semibold">
                      {chaptersCompleted}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                    <BookOpen
                      size={20}
                      className="text-cyan-300"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-200">
                        Remaining
                      </p>
                    </div>

                    <p className="font-semibold">
                      {chaptersRemaining}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                    <CalendarDays
                      size={20}
                      className="text-cyan-300"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-200">
                        Total Journey
                      </p>
                    </div>

                    <p className="font-semibold">
                      {totalChapters}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Current book */}
            <button
              type="button"
              onClick={onOpenChapter}
              className="group rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.08] to-[#0d1821] p-5 text-left shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-400/30 active:translate-y-0 active:scale-[0.99] lg:col-span-5 lg:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold sm:text-lg">
                  Current Book
                </h2>

                <span className="font-semibold text-cyan-300">
                  John
                </span>
              </div>

              <div className="mt-7 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Current chapter
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    John 1
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/15">
                  <Play
                    size={23}
                    fill="currentColor"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between text-sm">
                <span className="text-slate-300">
                  Chapter 1 of 21
                </span>

                <span className="font-semibold">
                  {currentBookProgress}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#45c6d8]"
                  style={{
                    width: `${currentBookProgress}%`,
                  }}
                />
              </div>

              <p className="mt-6 text-sm leading-relaxed text-slate-400">
                You&apos;re on day {chaptersCompleted} of your
                3.26-year journey.
              </p>

              <div className="mt-5 flex items-center justify-end gap-2 text-sm font-semibold text-cyan-300">
                Continue John 1

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </button>
          </section>

          {/* Journey at a glance */}
          <section className="mt-4 rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-xl shadow-black/20 lg:mt-6 lg:p-6">
            <h2 className="text-base font-semibold sm:text-lg">
              Journey at a Glance
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0">
              <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-col sm:border-0 sm:bg-transparent sm:text-center">
                <CalendarDays
                  size={25}
                  className="text-cyan-300"
                />

                <div>
                  <p className="text-sm text-slate-400">
                    Started
                  </p>

                  <p className="mt-1 font-semibold">
                    January 1, 2026
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-col sm:border-y-0 sm:border-x sm:bg-transparent sm:text-center">
                <Flame
                  size={25}
                  className="text-orange-400"
                />

                <div>
                  <p className="text-sm text-slate-400">
                    Current Streak
                  </p>

                  <p className="mt-1 font-semibold text-orange-300">
                    20 Days
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-col sm:border-0 sm:bg-transparent sm:text-center">
                <Flag
                  size={25}
                  className="text-cyan-300"
                />

                <div>
                  <p className="text-sm text-slate-400">
                    Projected Finish
                  </p>

                  <p className="mt-1 font-semibold">
                    April 10, 2029
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="mt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Journey Timeline
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Revisit completed books and see what comes next.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
              >
                <Map size={17} />
                View by Book
              </button>
            </div>

            {/* Filters */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {['All', 'Completed', 'Current', 'Upcoming'].map(
                (filter, index) => (
                  <button
                    key={filter}
                    type="button"
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      index === 0
                        ? 'bg-[#45c6d8] text-[#06111b]'
                        : 'border border-white/5 bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>

            {/* Desktop table headings */}
            <div className="mt-3 hidden grid-cols-[1fr_180px_130px_30px] gap-5 px-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 lg:grid">
              <span>Book</span>
              <span>Chapters</span>
              <span>Status</span>
              <span />
            </div>

            {/* Books list */}
            <div className="mt-2 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821]">
              {journeyBooks.map((book, index) => {
                const progress =
                  book.total > 0
                    ? Math.round(
                        (book.completed / book.total) * 100,
                      )
                    : 0

                const isCompleted =
                  book.status === 'completed'
                const isCurrent = book.status === 'current'
                const isLocked =
                  book.status === 'next' ||
                  book.status === 'upcoming'

                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={
                      isCurrent ? onOpenChapter : undefined
                    }
                    className={`group grid w-full items-center gap-3 border-b border-white/5 p-4 text-left transition last:border-b-0 sm:grid-cols-[44px_1fr_auto] lg:grid-cols-[44px_1fr_180px_130px_30px] lg:gap-5 lg:px-5 ${
                      isCurrent
                        ? 'bg-orange-400/[0.06] ring-1 ring-inset ring-orange-400/40'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                        isCompleted
                          ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                          : isCurrent
                            ? 'border-orange-400/40 bg-orange-400/10 text-orange-300'
                            : 'border-slate-600 bg-slate-700/20 text-slate-500'
                      }`}
                    >
                      {isCompleted && <Check size={18} />}

                      {isCurrent && (
                        <Circle
                          size={16}
                          fill="currentColor"
                        />
                      )}

                      {isLocked && <Lock size={17} />}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`font-semibold ${
                          isLocked
                            ? 'text-slate-400'
                            : 'text-white'
                        }`}
                      >
                        {book.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 lg:hidden">
                        {book.completed}/{book.total} chapters
                      </p>
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${
                            isCurrent
                              ? 'bg-orange-400'
                              : 'bg-[#45c6d8]'
                          }`}
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      <span className="w-12 text-right text-sm text-slate-300">
                        {book.completed}/{book.total}
                      </span>
                    </div>

                    <div className="justify-self-end">
                      {isCompleted && (
                        <span className="text-xs font-semibold text-cyan-300 sm:text-sm">
                          Completed
                        </span>
                      )}

                      {isCurrent && (
                        <span className="text-xs font-semibold text-orange-300 sm:text-sm">
                          In Progress
                        </span>
                      )}

                      {book.status === 'next' && (
                        <span className="text-xs font-medium text-slate-400 sm:text-sm">
                          Up Next
                        </span>
                      )}

                      {book.status === 'upcoming' && (
                        <span className="text-xs font-medium text-slate-500 sm:text-sm">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <ChevronRight className="hidden text-slate-500 transition group-hover:translate-x-1 group-hover:text-slate-300 lg:block" />
                  </button>
                )
              })}
            </div>
          </section>

          {/* Encouragement */}
          <section className="mt-6 overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] via-[#15222d] to-orange-400/[0.05] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
                <Mountain size={38} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold">
                  Keep going!
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  Every chapter is another step toward knowing
                  Scripture more deeply and living it more
                  faithfully.
                </p>

                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15"
                >
                  View Stats
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default JourneyPage