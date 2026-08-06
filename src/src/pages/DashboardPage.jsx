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
    { title: 'Read', detail: 'Explore the Word', icon: BookOpen },
    { title: 'Listen', detail: 'Hear the Word', icon: Headphones },
    { title: 'Study', detail: 'Dig deeper', icon: Sparkles },
  ]

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="dashboard" onNavigate={onNavigate} />

      <div className="lg:pl-24">
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-8 lg:pt-7">
          <header className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-300/30 bg-orange-500 text-white shadow-lg shadow-orange-500/20 lg:hidden">
                <Flame size={23} strokeWidth={2.3} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold tracking-[0.2em] text-cyan-400 sm:text-sm">PROJECT 3|26</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{getGreeting()}, Brian</h1>
                <p className="mt-1 text-sm text-slate-400">What would you like to do today?</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-white shadow-lg shadow-black/20 transition hover:border-cyan-400/40 hover:bg-[#102a46] active:scale-95"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={2.2} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#0c2138] bg-orange-500" />
            </button>
          </header>

          <section className="relative mt-6 overflow-hidden rounded-[30px] border border-cyan-400/30 bg-[#09223c] shadow-2xl shadow-black/25">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,174,239,0.18),transparent_40%)]" />
            <div className="relative p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-400">Today&apos;s chapter</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">John 1</h2>
                <p className="mt-2 text-base font-semibold text-slate-300 sm:text-lg">The Word Tabernacled Among Us</p>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">Begin with Scripture and choose the way you want to engage with today&apos;s chapter.</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChapter('john-1')}
                className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-cyan-300/30 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-base font-black text-white shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 active:translate-y-0 active:scale-[0.98] lg:mt-0 lg:w-auto"
              >
                <BookOpen size={20} strokeWidth={2.4} /> Continue <ArrowRight size={20} strokeWidth={2.4} />
              </button>
            </div>
          </section>

          <section className="mt-4 rounded-[24px] border border-white/10 bg-[#081c31] p-5 shadow-lg shadow-black/15 sm:p-6">
            <div className="flex gap-4">
              <div className="text-4xl font-black leading-none text-orange-500">“</div>
              <div>
                <p className="text-sm font-medium leading-6 text-slate-200 sm:text-base">The Word became flesh and tabernacled among us—God didn&apos;t visit. He moved into the neighborhood.</p>
                <p className="mt-3 text-sm font-bold text-orange-400">— Project 3|26</p>
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
                  className="group flex min-h-28 flex-col items-center justify-center rounded-[22px] border border-cyan-400/25 bg-[#08213a] px-2 py-4 text-center shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-[#0b2b49] active:translate-y-0 active:scale-[0.97] sm:min-h-32"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 transition group-hover:bg-cyan-500 group-hover:text-white">
                    <ActionIcon size={24} strokeWidth={2.4} />
                  </div>
                  <span className="mt-3 text-sm font-black text-white sm:text-base">{action.title}</span>
                  <span className="mt-1 hidden text-xs font-medium text-slate-400 min-[390px]:block">{action.detail}</span>
                </button>
              )
            })}
          </section>

          <section className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
            <button type="button" onClick={onOpenUpgrade} className="flex items-center gap-4 rounded-[22px] border border-dashed border-orange-400/35 bg-[#151d28] p-4 text-left shadow-lg shadow-black/15 transition hover:border-orange-400/70 hover:bg-[#1c2632] active:scale-[0.98]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-400/25 bg-orange-500/10 text-orange-400"><Crown size={23} strokeWidth={2.3} /></div>
              <div className="min-w-0 flex-1"><p className="font-black text-white">Leader Guide</p><p className="mt-1 text-sm text-slate-400">Unlock group resources.</p><p className="mt-2 text-xs font-bold text-orange-400">Upgrade to access</p></div>
              <ArrowRight className="shrink-0 text-orange-400" size={19} />
            </button>

            <button type="button" onClick={() => onNavigate('connect')} className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-[#081c31] p-4 text-left shadow-lg shadow-black/15 transition hover:border-cyan-400/45 hover:bg-[#0b2742] active:scale-[0.98]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400"><MessageCircle size={23} strokeWidth={2.3} /></div>
              <div className="min-w-0 flex-1"><p className="font-black text-white">Connect</p><p className="mt-1 text-sm text-slate-400">Join today&apos;s discussion.</p><p className="mt-2 text-xs font-bold text-cyan-400">Open discussion</p></div>
              <ArrowRight className="shrink-0 text-cyan-400" size={19} />
            </button>
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
