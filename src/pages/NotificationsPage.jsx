import { ArrowLeft, Bell, CheckCircle2 } from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

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
                Journey reminders, achievements, and church updates will appear here.
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
              <Bell size={21} strokeWidth={2.2} />
            </div>
          </header>

          <section className="mt-6">
            <div className="rounded-[20px] border border-white/10 bg-[#0c2138] px-5 py-10 text-center text-sm text-slate-400">
              You’re all caught up.
            </div>
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
                  Notification settings are managed from Profile. Real member notifications will use the production backend rather than placeholder alerts.
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