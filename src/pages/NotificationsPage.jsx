import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Flame,
  Megaphone,
  Trophy,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

const notifications = [
  {
    id: 'chapter-ready',
    title: 'Today’s chapter is ready',
    message: 'John 1 is ready whenever you are.',
    time: 'Today',
    icon: Flame,
    type: 'chapter',
  },
  {
    id: 'streak',
    title: 'Your streak reached 20 days',
    message:
      'Keep showing up. Small daily faithfulness matters.',
    time: 'Yesterday',
    icon: Trophy,
    type: 'achievement',
  },
  {
    id: 'church',
    title: 'New Villas Church announcement',
    message:
      'A new church update has been posted in Connect.',
    time: '2 days ago',
    icon: Megaphone,
    type: 'church',
  },
]

function getNotificationStyle(type) {
  if (type === 'achievement') {
    return {
      icon: 'bg-orange-200/70 text-orange-600',
      card: 'border-orange-300/40 bg-[#e8ddd0]',
      accent: 'text-orange-600',
    }
  }

  if (type === 'church') {
    return {
      icon: 'bg-[#c7dce7] text-cyan-700',
      card: 'border-[#c8d3db] bg-[#dfe8ee]',
      accent: 'text-cyan-700',
    }
  }

  return {
    icon: 'bg-[#c7dce7] text-cyan-700',
    card: 'border-[#c8d3db] bg-[#dfe8ee]',
    accent: 'text-cyan-700',
  }
}

function NotificationsPage({
  onBack,
  onNavigate,
}) {
  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="dashboard"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-4xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#0c2138] px-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/35 hover:text-white active:scale-95"
          >
            <ArrowLeft size={17} />
            Back to Home
          </button>

          <header className="mt-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 sm:text-sm">
                PROJECT 3|26
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Journey reminders, achievements, and church
                updates.
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
              <Bell size={21} strokeWidth={2.2} />
            </div>
          </header>

          <section className="mt-6 space-y-3">
            {notifications.map((notification) => {
              const NotificationIcon =
                notification.icon

              const styles =
                getNotificationStyle(
                  notification.type,
                )

              return (
                <article
                  key={notification.id}
                  className={`rounded-[20px] border p-4 text-[#153047] shadow-lg shadow-black/10 ${styles.card}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                    >
                      <NotificationIcon
                        size={19}
                        strokeWidth={2.2}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-sm font-semibold sm:text-base">
                          {notification.title}
                        </h2>

                        <span className="shrink-0 text-xs text-slate-500">
                          {notification.time}
                        </span>
                      </div>

                      <p className="mt-1.5 text-sm leading-5 text-slate-600">
                        {notification.message}
                      </p>

                      <button
                        type="button"
                        className={`mt-3 text-xs font-semibold ${styles.accent}`}
                      >
                        View update
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>

          <section className="mt-4 rounded-[20px] border border-emerald-300/40 bg-[#d9e7df] p-4 text-[#153047] shadow-lg shadow-black/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-200/70 text-emerald-700">
                <CheckCircle2
                  size={19}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Notification preferences
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  Notification settings are managed from
                  Profile. Push delivery will connect through
                  the production backend.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default NotificationsPage