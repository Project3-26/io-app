import { ArrowLeft, Bell, CheckCircle2, Flame, Megaphone, Trophy } from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

const notifications = [
  {
    id: 'chapter-ready',
    title: 'Today’s chapter is ready',
    message: 'John 1 is ready whenever you are.',
    time: 'Today',
    icon: Flame,
    tone: 'text-orange-300 bg-orange-400/10 border-orange-400/15',
  },
  {
    id: 'streak',
    title: 'Your streak reached 20 days',
    message: 'Keep showing up. Small daily faithfulness matters.',
    time: 'Yesterday',
    icon: Trophy,
    tone: 'text-amber-300 bg-amber-400/10 border-amber-400/15',
  },
  {
    id: 'church',
    title: 'New Villas Church announcement',
    message: 'A new church update has been posted in Connect.',
    time: '2 days ago',
    icon: Megaphone,
    tone: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/15',
  },
]

function NotificationsPage({ onBack, onNavigate }) {
  return (
    <div className="min-h-screen bg-[#06111b] text-white">
      <AppNavigation activePage="dashboard" onNavigate={onNavigate} />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-4xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Today
          </button>

          <header className="mt-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold tracking-[0.18em] text-[#45c6d8]">PROJECT 3|26</p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Notifications</h1>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">Your journey, achievements, and church updates.</p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300">
              <Bell size={23} />
            </div>
          </header>

          <section className="mt-8 space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon

              return (
                <article key={notification.id} className="flex items-start gap-4 rounded-2xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-4 sm:p-5">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${notification.tone}`}>
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold">{notification.title}</h2>
                      <span className="shrink-0 text-xs text-slate-600">{notification.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{notification.message}</p>
                  </div>
                </article>
              )
            })}
          </section>

          <section className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-300" />
            <p className="text-sm leading-6 text-slate-400">Notification preferences are already managed from Profile. Push delivery will connect through the production backend.</p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default NotificationsPage
