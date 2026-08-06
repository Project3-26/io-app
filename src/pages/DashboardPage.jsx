import {
  ArrowRight,
  Bell,
  BookOpen,
  Crown,
  Flame,
  Headphones,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function DashboardPage({
  onOpenChapter,
  onNavigate,
  onOpenNotifications,
  onOpenUpgrade,
}) {
  const actions = [
    {
      title: 'Read',
      detail: 'Explore the Word',
      icon: BookOpen,
    },
    {
      title: 'Listen',
      detail: 'Hear the Word',
      icon: Headphones,
    },
    {
      title: 'Study',
      detail: 'Dig deeper',
      icon: Sparkles,
    },
  ]

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="dashboard"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-8 lg:pt-7">
          <header className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-300/30 bg-orange-500 text-white shadow-lg shadow-orange-500/20 lg:hidden">
                <Flame size={23} strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold tracking-[0.2em] text-cyan-400 sm:text-sm">
                  PROJECT 3|26
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {getGreeting()}, Brian
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  What would you like to do today?
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-white shadow-lg shadow-black/20 transition hover:border-cyan-400/40 hover:bg-[#102a46] active:scale-95"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={2.1} />

              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#0c2138] bg-orange-500" />
            </button>
          </header>

          <section className="relative mt-6 overflow-hidden rounded-[30px] border border-[#c8d3db] bg-[#dfe8ee] text-[#153047] shadow-2xl shadow-black/15">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_42%)]" />

            <div className="relative p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Today&apos;s chapter
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                  John 1
                </h2>

                <p className="mt-2 text-base font-medium text-slate-600 sm:text-lg">
                  The Word Tabernacled Among Us
                </p>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Begin with Scripture and choose the way you want to engage
                  with today&apos;s chapter.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenChapter('john-1')}
                className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-cyan-500/40 bg-cyan-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:bg-cyan-400 active:translate-y-0 active:scale-[0.98] lg:mt-0 lg:w-auto"
              >
                <BookOpen size={20} strokeWidth={2.3} />
                Continue
                <ArrowRight size={20} strokeWidth={2.3} />
              </button>
            </div>
          </section>

          <section className="mt-4 rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-lg shadow-black/10 sm:p-6">
            <div className="flex gap-4">
              <div className="text-4xl font-semibold leading-none text-cyan-700">
                “
              </div>

              <div>
                <p className="text-sm font-medium leading-6 text-slate-700 sm:text-base">
                  The Word became flesh and tabernacled among us—God didn&apos;t
                  visit. He moved into the neighborhood.
                </p>

                <p className="mt-3 text-sm font-semibold text-cyan-700">
                  — Project 3|26
                </p>
              </div>
            </div>
          </section>

          <section className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
            {actions.map((action) => {
              const ActionIcon = action.icon

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => onOpenChapter('john-1')}
                  className="group flex min-h-28 flex-col items-center justify-center rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] px-2 py-4 text-center text-[#153047] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-[#e7eef2] active:translate-y-0 active:scale-[0.97] sm:min-h-32"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700 transition group-hover:bg-cyan-500 group-hover:text-white">
                    <ActionIcon size={24} strokeWidth={2.3} />
                  </div>

                  <span className="mt-3 text-sm font-semibold sm:text-base">
                    {action.title}
                  </span>

                  <span className="mt-1 hidden text-xs font-medium text-slate-500 min-[390px]:block">
                    {action.detail}
                  </span>
                </button>
              )
            })}
          </section>

          <section className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="flex items-center gap-4 rounded-[22px] border border-orange-300/40 bg-[#e8ddd0] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-orange-400/60 hover:bg-[#eee1d4] active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-200/70 text-orange-600">
                <Crown size={23} strokeWidth={2.2} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  Leader Guide
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Unlock group resources.
                </p>

                <p className="mt-2 text-xs font-semibold text-orange-600">
                  Upgrade to access
                </p>
              </div>

              <ArrowRight
                className="shrink-0 text-orange-600"
                size={19}
              />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('connect')}
              className="flex items-center gap-4 rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700">
                <MessageCircle size={23} strokeWidth={2.2} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  Connect
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Join today&apos;s discussion.
                </p>

                <p className="mt-2 text-xs font-semibold text-cyan-700">
                  Open discussion
                </p>
              </div>

              <ArrowRight
                className="shrink-0 text-cyan-700"
                size={19}
              />
            </button>
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage