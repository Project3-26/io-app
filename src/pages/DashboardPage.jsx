import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Church,
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

function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatMonth(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
  })
    .format(date)
    .toUpperCase()
}

function DashboardPage({
  onOpenChapter,
  onNavigate,
  onOpenNotifications,
  onOpenUpgrade,
}) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, 30000)

    return () => window.clearInterval(interval)
  }, [])

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
                <Flame size={23} strokeWidth={2.3} />
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
              <Bell size={20} strokeWidth={2.2} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#0c2138] bg-orange-400" />
            </button>
          </header>

          <section className="mt-5 grid grid-cols-[1fr_88px] gap-3 sm:grid-cols-[1fr_104px] lg:mt-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0c2138] px-5 py-4 shadow-lg shadow-black/10 sm:px-6 sm:py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                {formatLongDate(now)}
              </p>

              <p className="mt-1 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {formatTime(now)}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-[26px] border border-[#c8d3db] bg-[#dfe8ee] text-[#153047] shadow-lg shadow-black/10">
              <CalendarDays size={20} className="text-cyan-700" />
              <span className="mt-2 text-[10px] font-bold tracking-[0.18em] text-cyan-700">
                {formatMonth(now)}
              </span>
              <span className="text-2xl font-bold leading-none">
                {now.getDate()}
              </span>
            </div>
          </section>

          <button
            type="button"
            onClick={openToday}
            className="group mt-3 w-full rounded-[28px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-left text-[#153047] shadow-xl shadow-black/15 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.995] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#c7dce7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700 sm:text-xs">
                    Chapter of the Day
                  </span>

                  <span className="text-xs font-semibold text-slate-500">
                    Day {sharedJourney.cycleDay} of {TOTAL_CYCLE_DAYS}
                  </span>
                </div>

                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  {sharedJourney.reference}
                </h2>

                <p className="mt-1.5 text-sm font-semibold text-cyan-700 sm:text-base">
                  {sharedJourney.title}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-white transition group-hover:translate-x-0.5">
                <ArrowRight size={19} />
              </div>
            </div>
          </button>

          <section className="mt-4 grid grid-cols-2 gap-4 sm:gap-5">
            <button
              type="button"
              onClick={() => onNavigate('connect')}
              className="group flex min-h-36 flex-col justify-between rounded-[26px] border border-white/10 bg-[#0c2138] p-4 text-left shadow-lg shadow-black/10 transition hover:border-cyan-400/35 active:scale-[0.98] sm:min-h-40 sm:p-5"
            >
              <MessageCircle
                size={30}
                strokeWidth={1.9}
                className="text-cyan-400"
              />

              <div>
                <p className="text-base font-semibold text-white sm:text-lg">
                  Connect
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                  Join today&apos;s chat
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('journey')}
              className="group flex min-h-36 flex-col justify-between rounded-[26px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.98] sm:min-h-40 sm:p-5"
            >
              <BookOpen
                size={30}
                strokeWidth={1.9}
                className="text-cyan-700"
              />

              <div>
                <p className="text-base font-semibold sm:text-lg">
                  Journey
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  See your progress
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('connect', 'villas-church')}
              className="group flex min-h-36 flex-col justify-between rounded-[26px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.98] sm:min-h-40 sm:p-5"
            >
              <Church
                size={31}
                strokeWidth={1.85}
                className="text-cyan-700"
              />

              <div>
                <p className="text-base font-semibold sm:text-lg">
                  My Church
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Church community
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenUpgrade}
              className="group flex min-h-36 flex-col justify-between rounded-[26px] border border-orange-300/35 bg-[#e8ddd0] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-orange-400/60 active:scale-[0.98] sm:min-h-40 sm:p-5"
            >
              <Crown
                size={30}
                strokeWidth={1.9}
                className="text-orange-600"
              />

              <div>
                <p className="text-base font-semibold sm:text-lg">
                  Leader Guides
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Lead a group
                </p>
              </div>
            </button>
          </section>

          <section className="mt-4 rounded-[24px] border border-white/10 bg-[#0c2138] px-4 py-4 shadow-lg shadow-black/10 sm:px-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                <Quote size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400 sm:text-xs">
                  Today&apos;s Thought
                </p>

                <p className="mt-1.5 text-sm font-medium leading-6 text-slate-200 sm:text-base">
                  “The Word became flesh and dwelt among us.”
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  John 1:14
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage