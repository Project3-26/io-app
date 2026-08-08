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
import { mockChapter } from '../data/mockChapter'
import {
  openSharedJourneyChapter,
  sharedJourney,
  TOTAL_CYCLE_DAYS,
} from '../data/sharedJourney'

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
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

function CrossHillArtwork() {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cc8857" />
          <stop offset="38%" stopColor="#e5a25f" />
          <stop offset="68%" stopColor="#6e5968" />
          <stop offset="100%" stopColor="#20394d" />
        </linearGradient>
        <radialGradient id="sun" cx="72%" cy="43%" r="24%">
          <stop offset="0%" stopColor="#fff4d5" stopOpacity="1" />
          <stop offset="28%" stopColor="#ffd18a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f6b06d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#17283a" />
          <stop offset="100%" stopColor="#09131f" />
        </linearGradient>
      </defs>

      <rect width="1200" height="600" fill="url(#sky)" />
      <rect width="1200" height="600" fill="url(#sun)" />

      <path
        d="M0 390 C120 330 220 350 330 320 C455 285 555 310 680 270 C800 230 920 250 1200 180 L1200 600 L0 600 Z"
        fill="#2b4050"
        opacity="0.65"
      />
      <path
        d="M0 470 C170 410 300 455 440 405 C560 360 695 390 810 355 C940 315 1035 345 1200 300 L1200 600 L0 600 Z"
        fill="url(#hill)"
      />

      <ellipse cx="770" cy="455" rx="205" ry="62" fill="#09131f" opacity="0.82" />

      <g transform="translate(760 235)" fill="#09131f">
        <rect x="-9" y="0" width="18" height="195" rx="4" />
        <rect x="-58" y="48" width="116" height="18" rx="4" />
      </g>

      <circle cx="865" cy="245" r="94" fill="#ffe1a7" opacity="0.08" />
      <circle cx="865" cy="245" r="44" fill="#fff2cb" opacity="0.18" />
    </svg>
  )
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
    openSharedJourneyChapter(onOpenChapter, 'read')
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="dashboard" onNavigate={onNavigate} />

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
            <div className="relative min-h-36 overflow-hidden rounded-[28px] border border-white/10 shadow-xl shadow-black/20 sm:min-h-40">
              <CrossHillArtwork />
              <div className="absolute inset-0 bg-gradient-to-r from-[#041326]/90 via-[#041326]/48 to-transparent" />
              <div className="relative z-10 flex h-full min-h-36 flex-col justify-between px-5 py-4 sm:min-h-40 sm:px-6 sm:py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  {formatLongDate(now)}
                </p>

                <div>
                  <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {formatTime(now)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-200 sm:text-sm">
                    Keep showing up. The Word is shaping you.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-[26px] border border-[#c8d3db] bg-[#dfe8ee] text-[#153047] shadow-lg shadow-black/10">
              <CalendarDays size={20} className="text-cyan-700" />
              <span className="mt-2 text-[10px] font-bold tracking-[0.18em] text-cyan-700">
                {formatMonth(now)}
              </span>
              <span className="text-2xl font-bold leading-none">{now.getDate()}</span>
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
              <MessageCircle size={30} strokeWidth={1.9} className="text-cyan-400" />
              <div>
                <p className="text-base font-semibold text-white sm:text-lg">Connect</p>
                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">Join today&apos;s chat</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('journey')}
              className="group flex min-h-36 flex-col justify-between rounded-[26px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.98] sm:min-h-40 sm:p-5"
            >
              <BookOpen size={30} strokeWidth={1.9} className="text-cyan-700" />
              <div>
                <p className="text-base font-semibold sm:text-lg">Journey</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">See your progress</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('connect', 'villas-church')}
              className="group relative flex min-h-36 overflow-hidden rounded-[26px] border border-white/10 p-4 text-left shadow-lg shadow-black/15 transition active:scale-[0.98] sm:min-h-40 sm:p-5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#163a4c] via-[#13243c] to-[#071421]" />
              <div className="absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="relative z-10 flex w-full flex-col justify-between">
                <Church size={31} strokeWidth={1.85} className="text-cyan-300" />
                <div>
                  <p className="text-base font-semibold text-white sm:text-lg">My Church</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">Church community</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenUpgrade}
              className="group flex min-h-36 flex-col justify-between rounded-[26px] border border-orange-300/35 bg-[#e8ddd0] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-orange-400/60 active:scale-[0.98] sm:min-h-40 sm:p-5"
            >
              <Crown size={30} strokeWidth={1.9} className="text-orange-600" />
              <div>
                <p className="text-base font-semibold sm:text-lg">Leader Guides</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">Lead a group</p>
              </div>
            </button>
          </section>

          <section className="relative mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-[#0c2138] px-4 py-4 shadow-lg shadow-black/10 sm:px-5">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                <Quote size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400 sm:text-xs">
                  Project 3|26 Quote of the Day
                </p>
                <p className="mt-1.5 text-sm font-medium leading-6 text-slate-100 sm:text-base">
                  “{mockChapter.quote}”
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {mockChapter.quoteAttribution} · {sharedJourney.reference}
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