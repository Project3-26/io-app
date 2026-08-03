function App() {
  const currentStreak = 20
  const nextMilestone = 30
  const milestoneProgress = (currentStreak / nextMilestone) * 100

  const actionButtonClass =
    'rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] px-3 py-5 text-center shadow-lg shadow-black/10 transition duration-150 hover:-translate-y-0.5 hover:border-white/10 active:translate-y-0 active:scale-[0.97]'

  const badges = [
    {
      icon: '🌱',
      title: 'First Step',
      detail: 'First chapter',
    },
    {
      icon: '🔥',
      title: 'One Week Strong',
      detail: '7 day streak',
    },
    {
      icon: '🏆',
      title: 'Faithful Twenty',
      detail: '20 day streak',
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

  return (
    <div className="min-h-screen bg-[#06111b] text-white">
      <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#102330]">
              <span className="text-2xl">🔥</span>
            </div>

            <p className="text-lg font-bold tracking-[0.18em] text-[#45c6d8]">
              PROJECT 3|26
            </p>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl transition duration-150 hover:bg-white/10 active:scale-90"
            aria-label="Notifications"
          >
            ♧
          </button>
        </header>

        <section className="mt-8">
          <h1 className="text-2xl font-bold">Good morning, Brian!</h1>

          <p className="mt-2 text-sm text-slate-400">
            Ready for today&apos;s chapter?
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-2xl shadow-black/20">
          <p className="text-sm font-medium text-slate-300">
            Today&apos;s Chapter
          </p>

          <h2 className="mt-2 text-2xl font-bold">John 1</h2>

          <p className="mt-2 text-sm text-slate-300">
            The Word Tabernacled Among Us
          </p>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[5%] rounded-full bg-orange-500" />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Lesson 1 of 21</span>
            <span>5%</span>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-3">
          <button type="button" className={actionButtonClass}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-2xl">
              🎧
            </div>

            <p className="mt-3 text-sm font-semibold text-white">
              Listen
            </p>

            <p className="mt-1 text-xs text-slate-400">
              10 min
            </p>
          </button>

          <button type="button" className={actionButtonClass}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-2xl">
              📖
            </div>

            <p className="mt-3 text-sm font-semibold text-white">
              Study Guide
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Read &amp; Reflect
            </p>
          </button>

          <button type="button" className={actionButtonClass}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-2xl">
              👥
            </div>

            <p className="mt-3 text-sm font-semibold text-white">
              Leader Guide
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Lead Others
            </p>
          </button>
        </section>

        <section className="mt-4 rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-lg shadow-black/10">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xl">
              🔥
            </div>

            <div className="flex-1">
              <h2 className="text-base font-semibold text-white">
                {currentStreak} Day Streak
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Keep it going! You&apos;re building momentum.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">
                Next award: 30 Days Rooted
              </span>

              <span className="text-slate-400">
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

          <div className="mt-5 grid grid-cols-7 gap-2 text-center">
            {week.map(([day, complete], index) => (
              <div key={`${day}-${index}`}>
                <div
                  className={`mx-auto h-5 w-5 rounded-full ${
                    complete
                      ? 'bg-orange-500 shadow-sm shadow-orange-500/40'
                      : 'border border-slate-500 bg-transparent'
                  }`}
                />

                <p className="mt-2 text-xs text-slate-400">
                  {day}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-lg shadow-black/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Your Badges
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Milestones you&apos;ve earned along the journey.
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg px-2 py-1 text-xs font-semibold text-[#45c6d8] transition duration-150 hover:bg-cyan-400/10 hover:text-cyan-300 active:scale-95"
            >
              View All
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {badges.map((badge) => (
              <button
                key={badge.title}
                type="button"
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center transition duration-150 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.05] active:translate-y-0 active:scale-[0.97]"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#102330] text-2xl">
                  {badge.icon}
                </div>

                <p className="mt-3 text-xs font-semibold leading-tight text-white">
                  {badge.title}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  {badge.detail}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-lg shadow-black/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Your Progress
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your journey through Scripture so far.
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg px-2 py-1 text-xs font-semibold text-[#45c6d8] transition duration-150 hover:bg-cyan-400/10 hover:text-cyan-300 active:scale-95"
            >
              See Details
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition duration-150 hover:border-white/10 hover:bg-white/[0.05] active:scale-[0.98]"
            >
              <p className="text-2xl font-bold text-white">20</p>

              <p className="mt-1 text-xs text-slate-400">
                Chapters completed
              </p>
            </button>

            <button
              type="button"
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition duration-150 hover:border-white/10 hover:bg-white/[0.05] active:scale-[0.98]"
            >
              <p className="text-2xl font-bold text-white">3</p>

              <p className="mt-1 text-xs text-slate-400">
                Badges earned
              </p>
            </button>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">
                John
              </span>

              <span className="text-slate-400">
                1 of 21 chapters
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[5%] rounded-full bg-[#45c6d8]" />
            </div>
          </div>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-between rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-3 text-left transition duration-150 hover:border-cyan-400/25 hover:bg-cyan-400/[0.08] active:scale-[0.98]"
          >
            <div>
              <p className="text-xs text-slate-400">
                Overall Bible progress
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                20 of 1,189 chapters
              </p>
            </div>

            <p className="text-lg font-bold text-[#45c6d8]">
              2%
            </p>
          </button>
        </section>
      </main>
    </div>
  )
}

export default App