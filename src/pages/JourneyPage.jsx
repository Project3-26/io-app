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
  const chaptersRemaining =
    totalChapters - chaptersCompleted

  const overallProgress =
    Math.round(
      (chaptersCompleted / totalChapters) * 1000,
    ) / 10

  const currentBookProgress = Math.round(
    (currentBook.completed / currentBook.total) * 100,
  )

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="journey"
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
                Your Journey
              </h1>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                See where you have been and what comes next.
              </p>
            </div>

            <button
              type="button"
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-300/30 bg-orange-500/10 text-orange-400 shadow-lg shadow-black/20 transition hover:border-orange-400/50 hover:bg-orange-500/15 active:scale-95"
              aria-label="New journey achievement"
              title="New achievement earned"
            >
              <Rocket size={22} strokeWidth={2.2} />

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#041326] bg-orange-500 px-1 text-[10px] font-semibold text-white">
                1
              </span>
            </button>
          </header>

          <section className="mt-6 grid gap-4 lg:grid-cols-12">
            <article className="rounded-[30px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-2xl shadow-black/15 sm:p-7 lg:col-span-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    Overall progress
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                    {chaptersCompleted} chapters completed
                  </h2>
                </div>

                <div className="rounded-2xl border border-[#b8ccd7] bg-[#c7dce7] px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-cyan-700">
                    {overallProgress}%
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <div className="h-3 overflow-hidden rounded-full bg-[#c8d3db]">
                  <div
                    className="h-full rounded-full bg-cyan-500"
                    style={{
                      width: `${overallProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Genesis to Revelation
                  </span>

                  <span className="font-semibold text-slate-700">
                    {chaptersRemaining} remaining
                  </span>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#c8d3db] bg-[#edf2f4] p-4 text-center">
                  <CheckCircle2
                    className="mx-auto text-cyan-700"
                    size={22}
                  />

                  <p className="mt-2 text-xl font-bold">
                    {chaptersCompleted}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Completed
                  </p>
                </div>

                <div className="rounded-2xl border border-[#c8d3db] bg-[#edf2f4] p-4 text-center">
                  <BookOpen
                    className="mx-auto text-cyan-700"
                    size={22}
                  />

                  <p className="mt-2 text-xl font-bold">
                    {chaptersRemaining}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Remaining
                  </p>
                </div>

                <div className="rounded-2xl border border-[#c8d3db] bg-[#edf2f4] p-4 text-center">
                  <CalendarDays
                    className="mx-auto text-cyan-700"
                    size={22}
                  />

                  <p className="mt-2 text-xl font-bold">
                    {totalChapters}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Total
                  </p>
                </div>
              </div>
            </article>

            <button
              type="button"
              onClick={() => onOpenChapter('john-1')}
              className="group rounded-[30px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-left text-[#153047] shadow-2xl shadow-black/15 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-[#e7eef2] active:translate-y-0 active:scale-[0.99] sm:p-7 lg:col-span-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    Current book
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    John
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-md shadow-cyan-500/15">
                  <Play
                    size={22}
                    fill="currentColor"
                  />
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm text-slate-500">
                  Current chapter
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  John 1
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Chapter 1 of 21
                </span>

                <span className="font-semibold text-cyan-700">
                  {currentBookProgress}%
                </span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#c8d3db]">
                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{
                    width: `${currentBookProgress}%`,
                  }}
                />
              </div>

              <div className="mt-7 flex items-center justify-between">
                <span className="font-semibold">
                  Continue John 1
                </span>

                <ArrowRight
                  size={19}
                  className="text-cyan-700 transition group-hover:translate-x-1"
                />
              </div>
            </button>
          </section>

          <section className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="flex items-center gap-4 rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:flex-col sm:text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Started
                </p>

                <p className="mt-1 font-semibold">
                  January 1, 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[22px] border border-orange-300/40 bg-[#e8ddd0] p-4 text-[#153047] shadow-lg shadow-black/10 sm:flex-col sm:text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-200/70 text-orange-600">
                <Flame size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Current streak
                </p>

                <p className="mt-1 font-semibold text-orange-600">
                  20 days
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:flex-col sm:text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700">
                <Flag size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Projected finish
                </p>

                <p className="mt-1 font-semibold">
                  April 10, 2029
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Your progress
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Journey Timeline
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Revisit completed books and preview what is ahead.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#c8d3db] bg-[#dfe8ee] px-4 py-3 text-sm font-semibold text-[#153047] transition hover:border-cyan-400/40 hover:bg-[#e7eef2]"
              >
                <Map size={17} />
                View by book
              </button>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {[
                'All',
                'Completed',
                'Current',
                'Upcoming',
              ].map((filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={`shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                    index === 0
                      ? 'border-cyan-500/50 bg-cyan-500 text-[#041326]'
                      : 'border-[#c8d3db] bg-[#dfe8ee] text-[#153047] hover:border-cyan-400/40'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-3 overflow-hidden rounded-[28px] border border-[#c8d3db] bg-[#dfe8ee] text-[#153047] shadow-xl shadow-black/10">
              {journeyBooks.map((book) => {
                const progress =
                  book.total > 0
                    ? Math.round(
                        (book.completed / book.total) * 100,
                      )
                    : 0

                const isCompleted =
                  book.status === 'completed'

                const isCurrent =
                  book.status === 'current'

                const isLocked =
                  book.status === 'next' ||
                  book.status === 'upcoming'

                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={
                      isCurrent
                        ? () => onOpenChapter('john-1')
                        : undefined
                    }
                    disabled={!isCurrent}
                    className={`group grid w-full grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-[#c8d3db] p-4 text-left transition last:border-b-0 sm:p-5 lg:grid-cols-[44px_1fr_200px_130px_24px] ${
                      isCurrent
                        ? 'bg-[#c7dce7]'
                        : isLocked
                          ? 'cursor-default bg-[#d2dce1]'
                          : 'cursor-default hover:bg-[#e7eef2]'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                        isCompleted
                          ? 'border-cyan-300 bg-cyan-100 text-cyan-700'
                          : isCurrent
                            ? 'border-cyan-400 bg-cyan-500 text-white'
                            : 'border-[#b9c4cb] bg-[#e1e8eb] text-slate-500'
                      }`}
                    >
                      {isCompleted && <Check size={18} />}

                      {isCurrent && (
                        <Circle
                          size={15}
                          fill="currentColor"
                        />
                      )}

                      {isLocked && <Lock size={17} />}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`font-semibold ${
                          isLocked
                            ? 'text-slate-500'
                            : 'text-[#153047]'
                        }`}
                      >
                        {book.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 lg:hidden">
                        {book.completed} of {book.total} chapters
                      </p>
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#c3ced5]">
                        <div
                          className="h-full rounded-full bg-cyan-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      <span className="w-14 text-right text-sm font-semibold text-slate-600">
                        {book.completed}/{book.total}
                      </span>
                    </div>

                    <div className="justify-self-end">
                      {isCompleted && (
                        <span className="text-xs font-semibold text-cyan-700 sm:text-sm">
                          Completed
                        </span>
                      )}

                      {isCurrent && (
                        <span className="text-xs font-semibold text-cyan-700 sm:text-sm">
                          In progress
                        </span>
                      )}

                      {book.status === 'next' && (
                        <span className="text-xs font-medium text-slate-500 sm:text-sm">
                          Up next
                        </span>
                      )}

                      {book.status === 'upcoming' && (
                        <span className="text-xs font-medium text-slate-500 sm:text-sm">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <ChevronRight className="hidden text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-700 lg:block" />
                  </button>
                )
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default JourneyPage