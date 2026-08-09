import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Heart,
  LoaderCircle,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import {
  getMemberNotifications,
  markMemberNotificationsRead,
} from '../services/notifications'

function formatTimestamp(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function notificationIcon(notification) {
  if (notification?.roomId === 'prayer') return Heart
  if (notification?.roomId === 'transformation') return Sparkles
  return MessageCircle
}

function NotificationsPage({
  onBack,
  onNavigate,
}) {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadNotifications() {
      try {
        setIsLoading(true)
        setError('')
        const payload = await getMemberNotifications()
        if (!mounted) return

        setNotifications(payload?.notifications || [])

        if ((payload?.unreadCount || 0) > 0) {
          await markMemberNotificationsRead()
          if (mounted) {
            setNotifications((current) => current.map((item) => ({
              ...item,
              readAt: item.readAt || new Date().toISOString(),
            })))
          }
        }
      } catch (loadError) {
        if (mounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load notifications.',
          )
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadNotifications()
    return () => {
      mounted = false
    }
  }, [])

  function openNotification(notification) {
    if (notification?.roomId === 'prayer' || notification?.roomId === 'transformation') {
      onNavigate?.('connect', notification.roomId)
    }
  }

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
                Responses to your prayers, transformations, and community activity appear here.
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
              <Bell size={21} strokeWidth={2.2} />
            </div>
          </header>

          <section className="mt-6 space-y-3">
            {isLoading && (
              <div className="flex min-h-32 items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-[#0c2138] text-sm text-slate-400">
                <LoaderCircle size={18} className="animate-spin" />
                Loading notifications…
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-[20px] border border-red-300/20 bg-red-400/10 px-5 py-5 text-sm text-red-200">
                {error}
              </div>
            )}

            {!isLoading && !error && notifications.length === 0 && (
              <div className="rounded-[20px] border border-white/10 bg-[#0c2138] px-5 py-10 text-center text-sm text-slate-400">
                You’re all caught up.
              </div>
            )}

            {!isLoading && !error && notifications.map((notification) => {
              const NotificationIcon = notificationIcon(notification)
              const prayer = notification.roomId === 'prayer'

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => openNotification(notification)}
                  className="flex w-full items-start gap-3 rounded-[20px] border border-white/10 bg-[#0c2138] p-4 text-left shadow-lg shadow-black/10 transition hover:border-cyan-400/30 hover:bg-[#102943] active:scale-[0.99]"
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    prayer
                      ? 'bg-purple-400/10 text-purple-300'
                      : 'bg-orange-400/10 text-orange-300'
                  }`}>
                    <NotificationIcon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-sm font-semibold leading-5 text-white">
                        {notification.title}
                      </h2>
                      <span className="shrink-0 text-[10px] text-slate-600">
                        {formatTimestamp(notification.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm text-slate-300">
                      {notification.body}
                    </p>

                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-400">
                      Open {prayer ? 'Prayer' : 'Transformation'}
                    </p>
                  </div>
                </button>
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
                  Community notifications are connected
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  When someone responds to one of your Prayer or Transformation posts, you’ll see it here.
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