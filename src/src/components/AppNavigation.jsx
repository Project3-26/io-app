import {
  Flame,
  Home,
  Library,
  Map,
  MessageCircle,
  User,
} from 'lucide-react'

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: Home,
  },
  {
    id: 'journey',
    label: 'Journey',
    icon: Map,
  },
  {
    id: 'library',
    label: 'Library',
    icon: Library,
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: MessageCircle,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
  },
]

function AppNavigation({ activePage = 'dashboard', onNavigate }) {
  function handleNavigation(pageId) {
    if (typeof onNavigate === 'function') {
      onNavigate(pageId)
    }
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-24 border-r border-white/10 bg-[#06182b]/95 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-24 items-center justify-center border-b border-white/10">
          <button
            type="button"
            onClick={() => handleNavigation('dashboard')}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-200/40 bg-orange-500 text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 active:scale-95"
            aria-label="Go to Home"
          >
            <Flame size={25} strokeWidth={2.3} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-3 px-3 py-6">
          {navigationItems.map((item) => {
            const NavigationIcon = item.icon
            const isActive = activePage === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                className={`group flex w-full flex-col items-center gap-2 rounded-2xl border px-2 py-3 transition duration-150 active:scale-95 ${
                  isActive
                    ? 'border-cyan-200/40 bg-cyan-400 text-[#041326] shadow-lg shadow-cyan-400/20'
                    : 'border-transparent text-slate-500 hover:border-white/10 hover:bg-white/5 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <NavigationIcon size={22} strokeWidth={isActive ? 2.6 : 2} />
                <span className="text-[11px] font-bold">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <div className="mx-auto w-full max-w-md border-t border-white/10 bg-[#06182b]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="grid grid-cols-5 items-end gap-1">
            {navigationItems.map((item) => {
              const NavigationIcon = item.icon
              const isActive = activePage === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigation(item.id)}
                  className={`group flex min-w-0 flex-col items-center justify-end gap-1 rounded-xl border px-1 py-1.5 transition duration-150 active:scale-95 ${
                    isActive
                      ? 'border-cyan-200/35 bg-cyan-400 text-[#041326] shadow-lg shadow-cyan-400/15'
                      : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200'
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl">
                    <NavigationIcon size={21} strokeWidth={isActive ? 2.6 : 2} />
                  </div>
                  <span className="truncate text-[10px] font-bold min-[375px]:text-[11px]">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}

export default AppNavigation
