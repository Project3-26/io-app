import { useEffect, useRef, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { getMemberNotifications } from '../services/notifications'

const POLL_INTERVAL_MS = 4000
const TOAST_DURATION_MS = 6000

function LiveNotificationToast({ activePage, onNavigate }) {
  const [notification, setNotification] = useState(null)
  const knownIdsRef = useRef(new Set())
  const initializedRef = useRef(false)

  useEffect(() => {
    let mounted = true
    let timeoutId = null

    async function checkNotifications() {
      try {
        const payload = await getMemberNotifications()
        if (!mounted) return

        const rows = payload?.notifications || []
        const unread = rows.filter((item) => !item.readAt)

        if (!initializedRef.current) {
          knownIdsRef.current = new Set(rows.map((item) => item.id))
          initializedRef.current = true
          return
        }

        const newest = unread.find((item) => !knownIdsRef.current.has(item.id))
        rows.forEach((item) => knownIdsRef.current.add(item.id))

        if (!newest) return

        window.dispatchEvent(new CustomEvent('project326-notifications-change'))

        if (activePage === 'connect') return

        setNotification(newest)
        window.clearTimeout(timeoutId)
        timeoutId = window.setTimeout(() => {
          if (mounted) setNotification(null)
        }, TOAST_DURATION_MS)
      } catch {
        // The notification center owns user-facing load errors. Live polling
        // stays quiet so a temporary network issue never interrupts the app.
      }
    }

    checkNotifications()
    const intervalId = window.setInterval(checkNotifications, POLL_INTERVAL_MS)

    return () => {
      mounted = false
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [activePage])

  if (!notification) return null

  function openNotification() {
    const roomId = notification.roomId || 'today'
    setNotification(null)
    if (typeof onNavigate === 'function') {
      onNavigate('connect', roomId)
    }
  }

  return (
    <div className="fixed left-3 right-3 top-3 z-[90] sm:left-auto sm:right-5 sm:top-5 sm:w-[390px]">
      <div className="overflow-hidden rounded-2xl border border-cyan-300/25 bg-[#102238] text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <button
          type="button"
          onClick={openNotification}
          className="flex w-full items-start gap-3 px-4 py-4 text-left"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-[#06111b]">
            <Bell size={19} strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                  New notification
                </p>
                <p className="mt-1 text-sm font-bold leading-5 text-white">
                  {notification.title}
                </p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setNotification(null)
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
            {notification.body && (
              <p className="mt-1.5 text-sm text-slate-300">{notification.body}</p>
            )}
            <p className="mt-2 text-[11px] font-semibold text-cyan-300">Tap to open</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default LiveNotificationToast
