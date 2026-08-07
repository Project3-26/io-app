import {
  ArrowRight,
  Bell,
  BookOpen,
  Crown,
  Flame,
  MessageCircle,
  Quote,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import {
  openSharedJourneyChapter,
  sharedJourney,
  TOTAL_CYCLE_DAYS,
} from '../data/sharedJourney'

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Good morning'
  }

  if (hour < 17) {
    return 'Good afternoon'
  }

  return 'Good evening'
}

function DashboardPage({
  onOpenChapter,
  onNavigate,
  onOpenNotifications,
  onOpenUpgrade,
}) {
  function openToday() {
    openSharedJourneyChapter(
      onOpenChapter,
      'read',
    )
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="dashboard"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-8 lg:pt-7">
          <header className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/15 lg:hidden">
                <Flame
                  size={23}
                  strokeWidth={2.3}
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold tracking-[0.18em] text-cyan-400 sm:text-sm">
                  PROJECT 3|26
                </p>

                <h1 className="mt-1 text-xl font-bold sm:text-2xl lg:text-3xl">
                  {getGreeting()}, Brian
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-slate-200 transition hover:border-cyan-400/35 hover:text-white active:scale-95"
              aria-label="Notifications"
            >
              <Bell
                size={20}
                strokeWidth={2.2}
              />

              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#0c2138] bg-orange-400" />
            </button>
          </header>

          <section className="mt-5 rounded-[28px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-xl shadow-black/15 sm:p-6 lg:mt-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#c7dce7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700 sm:text-xs">
                    Chapter of the Day
                  </span>

                  <span className="text-xs font-semibold text-slate-500">
                    Day {sharedJourney.cycleDay} of{' '}
                    {TOTAL_CYCLE_DAYS}
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  {sharedJourney.reference}
                </h2>

                <p className="mt-2 text-base font-semibold text-cyan-700 sm:text-lg">
                  {sharedJourney.title}
                </p>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Join the Project 3|26 community in today&apos;s chapter.
                </p>
              </div>

              <button
                type="button"
                onClick={openToday}
                className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/15 transition hover:bg-cyan-400 active:scale-[0.98] lg:w-auto"
              >
                Open {sharedJourney.reference}

                <ArrowRight
                  size={18}
                />
              </button>
            </div>
          </section>

          <section className="mt-4 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                <Quote size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-700">
                  Today&apos;s Thought
                </p>

                <p className="mt-2 text-sm font-medium leading-6 sm:text-base">
                  “The Word became flesh and dwelt among us.”
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  John 1:14
                </p>
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={() =>
              onNavigate('connect')
            }
            className="group mt-4 flex w-full items-center gap-4 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.99] sm:p-5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white">
              <MessageCircle
                size={21}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">
                Join the conversation
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Discuss today&apos;s chapter, share prayer requests, and connect with your church community.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-cyan-700 transition group-hover:translate-x-1"
            />
          </button>

          <button
            type="button"
            onClick={onOpenUpgrade}
            className="group mt-4 flex w-full items-center gap-4 rounded-[24px] border border-orange-300/40 bg-[#e8ddd0] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-orange-400/60 active:scale-[0.99] sm:p-5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-200/70 text-orange-600">
              <Crown size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">
                Lead Together
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Access leader resources for small groups and churches.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-orange-600 transition group-hover:translate-x-1"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              onNavigate('journey')
            }
            className="group mt-4 flex items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-[#0c2138] px-4 py-3 text-left transition hover:border-cyan-400/30"
          >
            <div className="flex items-center gap-3">
              <BookOpen
                size={18}
                className="text-cyan-400"
              />

              <span className="text-sm font-semibold text-slate-300">
                View your Bible journey
              </span>
            </div>

            <ArrowRight
              size={17}
              className="text-cyan-400 transition group-hover:translate-x-1"
            />
          </button>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage