import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Crown,
  Flame,
  Headphones,
  Lock,
  Quote,
  Sprout,
  Trophy,
  Users,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

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
  // Change this to 'leader' to preview an unlocked Leader Guide.
  const userPlan = 'standard'

  const currentStreak = 20
  const nextMilestone = 30
  const milestoneProgress = (currentStreak / nextMilestone) * 100
  const hasLeaderAccess = userPlan === 'leader'

  const coreResources = [
    {
      title: 'Listen',
      detail: '9:43',
      icon: Headphones,
      iconClass: 'text-orange-400',
      backgroundClass: 'border-orange-400/10 bg-orange-500/10',
    },
    {
      title: 'Bible Study Guide',
      detail: 'Read & Reflect',
      icon: BookOpen,
      iconClass: 'text-cyan-400',
      backgroundClass: 'border-cyan-400/10 bg-cyan-500/10',
    },
  ]

  const badges = [
    {
      icon: Sprout,
      title: 'First Step',
      detail: 'First chapter',
      iconClass: 'text-emerald-400',
      backgroundClass: 'bg-emerald-500/10',
    },
    {
      icon: Flame,
      title: 'One Week Strong',
      detail: '7 day streak',
      iconClass: 'text-orange-400',
      backgroundClass: 'bg-orange-500/10',
    },
    {
      icon: Trophy,
      title: 'Faithful Twenty',
      detail: '20 day streak',
      iconClass: 'text-amber-400',
      backgroundClass: 'bg-amber-500/10',
    },
  ]

  const week = [
    ['S', true],
    ['M', true],
    ['T', true],
    ['W', true],
    ['T', true],
    ['F', false],
    ['S', false],
  ]

  const cardClass =
    'rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] shadow-lg shadow-black/10'

  const actionButtonClass =
    'rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] px-3 py-4 text-center shadow-lg shadow-black/10 transition duration-150 hover:-translate-y-0.5 hover:border-white/10 active:translate-y-0 active:scale-[0.97] sm:py-5'

  return (
    <div className="min-h-screen bg-[#06111b] text-white">
      <AppNavigation
        activePage="dashboard"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-7xl px-3 pb-36 pt-5 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10 lg:pt-8 xl:px-10">
          {/* Header */}
          <header className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 lg:hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-400/10 bg-orange-500/10 sm:h-11 sm:w-11">
                <Flame
                  size={22}
                  strokeWidth={2.2}
                  className="text-orange-400"
                />
              </div>

              <p className="truncate text-sm font-bold tracking-[0.13em] text-[#45c6d8] min-[375px]:text-base sm:text-lg sm:tracking-[0.18em]">
                PROJECT 3|26
              </p>
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-bold tracking-[0.2em] text-[#45c6d8]">
                PROJECT 3|26
              </p>

              <h1 className="mt-3 text-3xl font-bold text-white xl:text-4xl">
                    {getGreeting()}, Brian!
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Ready for today&apos;s chapter?
              </p>
            </div>

            <button
              type="button"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition duration-150 hover:border-cyan-400/20 hover:bg-white/10 hover:text-white active:scale-90 lg:h-11 lg:w-11"
              onClick={onOpenNotifications}
              aria-label="Notifications"
            >
              <Bell size={19} strokeWidth={2} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#08131d] bg-orange-400" />
            </button>
          </header>

          {/* Mobile greeting */}
          <section className="mt-7 lg:hidden">
            <h1 className="text-xl font-bold min-[375px]:text-2xl">
                {getGreeting()}, Brian!
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Ready for today&apos;s chapter?
            </p>
          </section>

          {/* Dashboard grid */}
          <div className="mt-5 grid gap-4 sm:mt-6 lg:mt-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
            {/* Left column */}
            <div className="space-y-3 sm:space-y-4 lg:col-span-7">
              {/* Clickable Today’s Chapter */}
              <button
                type="button"
                onClick={onOpenChapter}
                className={`${cardClass} group relative w-full overflow-hidden p-4 text-left shadow-2xl shadow-black/20 transition duration-150 hover:-translate-y-0.5 hover:border-cyan-400/25 hover:shadow-cyan-950/20 active:translate-y-0 active:scale-[0.99] sm:p-5 lg:p-6`}
                aria-label="Open John 1 chapter"
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/[0.06] blur-3xl" />

                <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-400/[0.05] blur-3xl" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-300">
                        Today&apos;s Chapter
                      </p>

                      <h2 className="mt-2 text-xl font-bold sm:text-2xl lg:text-3xl">
                        John 1
                      </h2>

                      <p className="mt-2 text-sm text-slate-300 lg:text-base">
                        The Word Tabernacled Among Us
                      </p>
                    </div>

                    <div className="hidden rounded-2xl border border-orange-400/10 bg-orange-500/10 px-4 py-3 text-right sm:block">
                      <p className="text-xs text-slate-400">
                        Today
                      </p>

                      <p className="mt-1 text-sm font-semibold text-orange-300">
                        Lesson 1
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4 transition group-hover:border-cyan-400/20 group-hover:bg-cyan-400/[0.07] lg:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                        <Quote size={16} strokeWidth={2} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                          Quote of the Chapter
                        </p>

                        <blockquote className="mt-2 text-sm font-medium leading-relaxed text-slate-100 lg:text-base">
                          “The Word became flesh and tabernacled among us—God
                          didn&apos;t visit, He moved into the neighborhood.”
                        </blockquote>

                        <p className="mt-3 text-xs font-semibold text-slate-400">
                          — Project 3|26
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[5%] rounded-full bg-orange-500" />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Lesson 1 of 21</span>
                    <span>5%</span>
                  </div>

                  <div className="mt-5 flex items-center justify-end gap-2 text-xs font-semibold text-cyan-300 opacity-80 transition group-hover:opacity-100">
                    <span>Continue chapter</span>

                    <ArrowRight
                      size={15}
                      strokeWidth={2}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </button>

              {/* Core resources */}
              <section className="grid grid-cols-2 gap-3 sm:gap-4">
                {coreResources.map((resource) => {
                  const ResourceIcon = resource.icon

                  return (
                    <button
                      key={resource.title}
                      type="button"
                      onClick={onOpenChapter}
                      className={`${actionButtonClass} lg:flex lg:min-h-36 lg:items-center lg:gap-4 lg:px-5 lg:text-left`}
                    >
                      <div
                        className={`mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border sm:h-12 sm:w-12 lg:mx-0 lg:h-14 lg:w-14 ${resource.backgroundClass}`}
                      >
                        <ResourceIcon
                          size={26}
                          strokeWidth={2}
                          className={resource.iconClass}
                        />
                      </div>

                      <div>
                        <p className="mt-3 text-sm font-semibold leading-tight text-white lg:mt-0 lg:text-base">
                          {resource.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400 lg:text-sm">
                          {resource.detail}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </section>

              {/* Leader Guide */}
              <section>
                <button
                  type="button"
                  onClick={() => {
                    if (hasLeaderAccess) {
                      onOpenChapter('john-1')
                    } else {
                      onOpenUpgrade()
                    }
                  }}
                  className={`relative w-full overflow-hidden rounded-2xl border px-4 py-4 text-left shadow-lg shadow-black/10 transition duration-150 active:scale-[0.98] lg:px-5 lg:py-5 ${
                    hasLeaderAccess
                      ? 'border-violet-400/15 bg-gradient-to-br from-[#17202f] to-[#121725] hover:border-violet-400/30'
                      : 'border-amber-400/15 bg-gradient-to-br from-[#191f29] to-[#121820] hover:border-amber-400/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border lg:h-14 lg:w-14 ${
                        hasLeaderAccess
                          ? 'border-violet-400/15 bg-violet-500/10 text-violet-400'
                          : 'border-amber-400/15 bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {hasLeaderAccess ? (
                        <Users size={26} strokeWidth={2} />
                      ) : (
                        <Lock size={24} strokeWidth={2} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-white lg:text-base">
                          Leader Guide
                        </p>

                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/15 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                          <Crown size={11} strokeWidth={2} />
                          Leader Plan
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-400 lg:text-sm">
                        {hasLeaderAccess
                          ? 'Lead Others'
                          : 'Upgrade to unlock'}
                      </p>
                    </div>

                    {!hasLeaderAccess && (
                      <span className="shrink-0 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-[#16120a] lg:px-4 lg:py-2.5">
                        Upgrade
                      </span>
                    )}
                  </div>
                </button>
              </section>

              {/* Challenges */}
              <section>
                <button
                  type="button"
                  className="group relative w-full overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/[0.12] via-[#14232c] to-orange-500/[0.08] p-4 text-left shadow-lg shadow-black/10 transition duration-150 hover:border-cyan-400/30 active:scale-[0.98] lg:p-5"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />

                  <div className="relative flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-500/10 text-cyan-300 lg:h-14 lg:w-14">
                      <CalendarDays size={26} strokeWidth={2} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-white lg:text-base">
                          5-Day Challenges
                        </p>

                        <span className="rounded-full border border-cyan-400/15 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                          Free
                        </span>
                      </div>

                      <p className="mt-1 text-xs leading-relaxed text-slate-400 lg:text-sm">
                        Short guided journeys for real-life needs.
                      </p>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition group-hover:border-cyan-400/20 group-hover:text-cyan-300 lg:h-10 lg:w-10">
                      <ArrowRight size={18} strokeWidth={2} />
                    </div>
                  </div>
                </button>
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-3 sm:space-y-4 lg:col-span-5">
              {/* Streak */}
              <section className={`${cardClass} p-4 sm:p-5 lg:p-6`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-400/10 bg-orange-500/10 text-orange-400 lg:h-12 lg:w-12">
                    <Flame size={23} strokeWidth={2.2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-white lg:text-lg">
                      {currentStreak} Day Streak
                    </h2>

                    <p className="mt-1 text-xs leading-relaxed text-slate-400 lg:text-sm">
                      Keep it going! You&apos;re building momentum.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3 text-xs lg:text-sm">
                    <span className="min-w-0 truncate font-medium text-slate-300">
                      Next award: 30 Days Rooted
                    </span>

                    <span className="shrink-0 text-slate-400">
                      {currentStreak}/{nextMilestone}
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${milestoneProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-7 gap-1 text-center min-[375px]:gap-2">
                  {week.map(([day, complete], index) => (
                    <div key={`${day}-${index}`}>
                      <div
                        className={`mx-auto h-4 w-4 rounded-full min-[375px]:h-5 min-[375px]:w-5 ${
                          complete
                            ? 'bg-orange-500 shadow-sm shadow-orange-500/40'
                            : 'border border-slate-500 bg-transparent'
                        }`}
                      />

                      <p className="mt-2 text-[11px] text-slate-400 min-[375px]:text-xs">
                        {day}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Badges */}
              <section className={`${cardClass} p-4 sm:p-5 lg:p-6`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-white lg:text-lg">
                      Your Badges
                    </h2>

                    <p className="mt-1 text-xs leading-relaxed text-slate-400 lg:text-sm">
                      Milestones earned along the journey.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[#45c6d8] transition duration-150 hover:bg-cyan-400/10 hover:text-cyan-300 active:scale-95"
                  >
                    View All
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {badges.map((badge) => {
                    const BadgeIcon = badge.icon

                    return (
                      <button
                        key={badge.title}
                        type="button"
                        className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center transition duration-150 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.05] active:translate-y-0 active:scale-[0.97]"
                      >
                        <div
                          className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/5 lg:h-12 lg:w-12 ${badge.backgroundClass}`}
                        >
                          <BadgeIcon
                            size={23}
                            strokeWidth={2}
                            className={badge.iconClass}
                          />
                        </div>

                        <p className="mt-3 text-[11px] font-semibold leading-tight text-white lg:text-xs">
                          {badge.title}
                        </p>

                        <p className="mt-1 hidden text-[11px] text-slate-400 xl:block">
                          {badge.detail}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Progress */}
              <section className={`${cardClass} p-4 sm:p-5 lg:p-6`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-white lg:text-lg">
                      Your Progress
                    </h2>

                    <p className="mt-1 text-xs leading-relaxed text-slate-400 lg:text-sm">
                      Your journey through Scripture so far.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[#45c6d8] transition duration-150 hover:bg-cyan-400/10 hover:text-cyan-300 active:scale-95"
                  >
                    See Details
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition duration-150 hover:border-white/10 hover:bg-white/[0.05] active:scale-[0.98]"
                  >
                    <p className="text-2xl font-bold text-white lg:text-3xl">
                      20
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Chapters completed
                    </p>
                  </button>

                  <button
                    type="button"
                    className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition duration-150 hover:border-white/10 hover:bg-white/[0.05] active:scale-[0.98]"
                  >
                    <p className="text-2xl font-bold text-white lg:text-3xl">
                      3
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Badges earned
                    </p>
                  </button>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3 text-xs lg:text-sm">
                    <span className="font-medium text-slate-300">
                      John
                    </span>

                    <span className="text-right text-slate-400">
                      1 of 21 chapters
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[5%] rounded-full bg-[#45c6d8]" />
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-between gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-3 text-left transition duration-150 hover:border-cyan-400/25 hover:bg-cyan-400/[0.08] active:scale-[0.98]"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      Overall Bible progress
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      20 of 1,189 chapters
                    </p>
                  </div>

                  <p className="shrink-0 text-lg font-bold text-[#45c6d8]">
                    2%
                  </p>
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage