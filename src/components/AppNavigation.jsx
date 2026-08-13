import { useEffect, useState } from 'react'
import {
  Flame,
  Home,
  Library,
  Compass,
  MessageCircle,
  MoreHorizontal,
  User,
} from 'lucide-react'
import LiveNotificationToast from './LiveNotificationToast'
import { getMemberNotifications } from '../services/notifications'

const UNREAD_NOTIFICATION_CACHE_KEY = 'project326-unread-notification-count'

const primaryNavigationItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'journey', label: 'Journey', icon: Compass },
  { id: 'connect', label: 'Connect', icon: MessageCircle },
]

const secondaryNavigationItems = [
  { id: 'library', label: 'Library', icon: Library },
  { id: 'profile', label: 'Profile', icon: User },
]

function readCachedUnreadCount() {
  const value = Number(localStorage.getItem(UNREAD_NOTIFICATION_CACHE_KEY) || 0)
  return Number.isFinite(value) && value > 0 ? value : 0
}

function AppNavigation({ activePage = 'dashboard', onNavigate }) {
  const [unreadNotifications, setUnreadNotifications] = useState(readCachedUnreadCount)
  const [moreOpen, setMoreOpen] = useState(false)
  const secondaryActive = secondaryNavigationItems.some((item) => item.id === activePage)

  useEffect(() => {
    let mounted = true

    async function loadUnreadNotifications() {
      try {
        const payload = await getMemberNotifications()
        if (!mounted) return
        const unreadCount = payload?.unreadCount || 0
        setUnreadNotifications(unreadCount)
        localStorage.setItem(UNREAD_NOTIFICATION_CACHE_KEY, String(unreadCount))
      } catch {
        // Keep the last known unread count visible if refresh temporarily fails.
      }
    }

    loadUnreadNotifications()
    window.addEventListener('project326-notifications-change', loadUnreadNotifications)

    return () => {
      mounted = false
      window.removeEventListener('project326-notifications-change', loadUnreadNotifications)
    }
  }, [])

  useEffect(() => {
    setMoreOpen(false)
  }, [activePage])

  function handleNavigation(pageId) {
    setMoreOpen(false)
    if (typeof onNavigate === 'function') onNavigate(pageId)
  }

  function renderNavigationButton(item, compact = false) {
    const NavigationIcon = item.icon
    const isActive = activePage === item.id
    const showUnreadDot = item.id === 'dashboard' && unreadNotifications > 0

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleNavigation(item.id)}
        className={compact
          ? `group flex min-w-0 flex-col items-center justify-end gap-1 rounded-xl border px-1 py-1.5 transition duration-150 active:scale-95 ${isActive ? 'border-cyan-300/25 bg-cyan-400 text-[#06111b] shadow-lg shadow-cyan-400/10' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'}`
          : `group flex w-full flex-col items-center gap-2 rounded-2xl border px-2 py-3 transition duration-150 active:scale-95 ${isActive ? 'border-cyan-300/30 bg-cyan-400 text-[#06111b] shadow-lg shadow-cyan-400/15' : 'border-transparent text-slate-500 hover:border-white/10 hover:bg-white/5 hover:text-slate-200'}`}
        aria-current={isActive ? 'page' : undefined}
        aria-label={showUnreadDot ? `Home, ${unreadNotifications} unread notifications` : item.label}
      >
        <div className={`relative ${compact ? 'flex h-9 w-9 items-center justify-center rounded-xl' : ''}`}>
          <NavigationIcon size={compact ? 21 : 22} strokeWidth={isActive ? 2.5 : 2} />
          {showUnreadDot && (
            <span
              className={`absolute ${compact ? 'right-0 top-0' : '-right-1.5 -top-1'} h-2.5 w-2.5 rounded-full border ${isActive ? 'border-cyan-400' : 'border-[#08131d]'} bg-red-500`}
              aria-hidden="true"
            />
          )}
        </div>
        <span className={compact ? 'truncate text-[10px] font-semibold min-[375px]:text-[11px]' : 'text-[11px] font-semibold'}>
          {item.label}
        </span>
      </button>
    )
  }

  return (
    <>
      <LiveNotificationToast activePage={activePage} onNavigate={onNavigate} />

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-24 border-r border-white/10 bg-[#08131d]/95 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-24 items-center justify-center border-b border-white/10">
          <button
            type="button"
            onClick={() => handleNavigation('dashboard')}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-300/30 bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400 active:scale-95"
            aria-label={unreadNotifications > 0 ? `Go to Home, ${unreadNotifications} unread notifications` : 'Go to Home'}
          >
            <Flame size={25} strokeWidth={2.2} />
            {unreadNotifications > 0 && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#08131d] bg-red-500" aria-hidden="true" />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-3 px-3 py-6">
          {primaryNavigationItems.map((item) => renderNavigationButton(item))}

          <div className="mt-auto w-full border-t border-white/10 pt-3">
            {secondaryNavigationItems.map((item) => renderNavigationButton(item))}
          </div>
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        {moreOpen && (
          <div className="mx-auto mb-2 w-[calc(100%-1rem)] max-w-md rounded-2xl border border-white/10 bg-[#0b1a27]/98 p-2 shadow-2xl backdrop-blur-xl">
            <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">More</p>
            <div className="grid grid-cols-2 gap-2">
              {secondaryNavigationItems.map((item) => {
                const NavigationIcon = item.icon
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${isActive ? 'border-cyan-300/25 bg-cyan-400 text-[#06111b]' : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}
                  >
                    <NavigationIcon size={19} />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mx-auto w-full max-w-md border-t border-white/10 bg-[#08131d]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid grid-cols-4 items-end gap-1">
            {primaryNavigationItems.map((item) => renderNavigationButton(item, true))}
            <button
              type="button"
              onClick={() => setMoreOpen((current) => !current)}
              className={`group flex min-w-0 flex-col items-center justify-end gap-1 rounded-xl border px-1 py-1.5 transition duration-150 active:scale-95 ${moreOpen || secondaryActive ? 'border-cyan-300/25 bg-cyan-400 text-[#06111b] shadow-lg shadow-cyan-400/10' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
              aria-expanded={moreOpen}
              aria-label="More navigation"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl">
                <MoreHorizontal size={21} strokeWidth={moreOpen || secondaryActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-semibold min-[375px]:text-[11px]">More</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default AppNavigation