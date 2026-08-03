import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Compass,
  Crown,
  Flame,
  Headphones,
  Home,
  Library,
  Lock,
  Map,
  Sprout,
  Trophy,
  User,
  Users,
} from 'lucide-react'

function App() {
  // Change this to 'leader' to preview an unlocked Leader Guide.
  const userPlan = 'standard'

  const currentStreak = 20
  const nextMilestone = 30
  const milestoneProgress = (currentStreak / nextMilestone) * 100
  const hasLeaderAccess = userPlan === 'leader'

  const coreResources = [
    {
      title: 'Listen',
      detail: '10 min',
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

  const navigationItems = [
    {
      label: 'Today',
      icon: Home,
      active: true,
    },
    {
      label: 'Journey',
      icon: Map,
      active: false,
    },
    {
      label: 'Library',
      icon: Library,
      active: false,
    },
    {
      label: 'Compass',
      icon: Compass,
      active: false,
      featured: true,
    },
    {
      label: 'Profile',
      icon: User,
      active: false,
    },
  ]

  const cardClass =
    'rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] shadow-lg shadow-black/10'

  const actionButtonClass =
    'rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] px-3 py-4 text-center shadow-lg shadow-black/10 transition duration-150 hover:-translate-y-0.5 hover:border-white/10 active:translate-y-0 active:scale-[0.97] sm:py-5'

  return (
    <div className="min-h-screen bg-[#06111b] text-white">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-24 border-r border-white/10 bg-[#08131d]/95 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-24 items-center justify-center border-b border-white/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/10 bg-orange-500/10 text-orange-400">
            <Flame size={25} strokeWidth={2.2} />
          </div>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-3 px-3 py-6">
          {navigationItems.map((item) => {
            const NavigationIcon = item.icon

            return (
              <button
                key={item.label}
                type="button"
                className={`group flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-3 transition duration-150 active:scale-95 ${
                  item.active
                    ? 'bg-cyan-400/10 text-[#45c6d8]'
                    : item.featured
                      ? 'border border-cyan-400/10 bg-cyan-400/5 text-cyan-400 hover:bg-cyan-400/10'
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                <NavigationIcon
                  size={22}
                  strokeWidth={item.active ? 2.4 : 2}
                />

                <span className="text-[11px] font-medium">
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

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
                Good morning, Brian!
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Ready for today&apos;s chapter?
              </p>
            </div>

            <button
              type="button"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition duration-150 hover:border-cyan-400/20 hover:bg-white/10 hover:text-white active:scale-90 lg:h-11 lg:w-11"
              aria-label="Notifications"
            >
              <Bell size={19} strokeWidth={2} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#08131d] bg-orange-400" />
            </button>
          </header>

          {/* Mobile greeting */}
          <section className="mt-7 lg:hidden">
            <h1 className="text-xl font-bold min-[375px]:text-2xl">
              Good morning, Brian!
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Ready for today&apos;s chapter?
            </p>
          </section>

          {/* Desktop dashboard grid */}
          <div className="mt-5 grid gap-4 sm:mt-6 lg:mt-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
            {/* Left column */}
            <div className="space-y-3 sm:space-y-4 lg:col-span-7">
              {/* Today’s chapter */}
              <section
                className={`${cardClass} relative overflow-hidden p-4 shadow-2xl shadow-black/20 sm:p-5 lg:p-6`}
              >
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/[0.06] blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-400/[0.05] blur-3xl" />

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

                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[5%] rounded-full bg-orange-500" />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Lesson 1 of 21</span>
                    <span>5%</span>
                  </div>
                </div>
              </section>

              {/* Core resources */}
              <section className="grid grid-cols-2 gap-3 sm:gap-4">
                {coreResources.map((resource) => {
                  const ResourceIcon = resource.icon

                  return (
                    <button
                      key={resource.title}
                      type="button"
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

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <div className="mx-auto w-full max-w-md border-t border-white/10 bg-[#08131d]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid grid-cols-5 items-end">
            {navigationItems.map((item) => {
              const NavigationIcon = item.icon

              return (
                <button
                  key={item.label}
                  type="button"
                  className={`group flex min-w-0 flex-col items-center justify-end gap-1 rounded-xl px-1 py-1.5 transition duration-150 active:scale-95 ${
                    item.active
                      ? 'text-[#45c6d8]'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label={item.label}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      item.active
                        ? 'bg-cyan-400/15 text-[#45c6d8]'
                        : item.featured
                          ? 'border border-cyan-400/20 bg-cyan-400/5 text-cyan-400'
                          : ''
                    }`}
                  >
                    <NavigationIcon
                      size={21}
                      strokeWidth={item.active ? 2.4 : 2}
                    />
                  </div>

                  <span
                    className={`truncate text-[10px] font-medium min-[375px]:text-[11px] ${
                      item.active
                        ? 'text-[#45c6d8]'
                        : item.featured
                          ? 'text-cyan-400'
                          : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default App