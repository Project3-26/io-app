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
    label: 'Today',
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

function AppNavigation({
  activePage = 'dashboard',
  onNavigate,
}) {
  function handleNavigation(pageId) {
    if (typeof onNavigate === 'function') {
      onNavigate(pageId)
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-24 border-r border-white/10 bg-[#08131d]/95 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-24 items-center justify-center border-b border-white/10">
          <button
            type="button"
            onClick={() => handleNavigation('dashboard')}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/10 bg-orange-500/10 text-orange-400 transition hover:border-orange-400/20 hover:bg-orange-500/15 active:scale-95"
            aria-label="Go to Today"
          >
            <Flame size={25} strokeWidth={2.2} />
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
                className={`group flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-3 transition duration-150 active:scale-95 ${
                  isActive
                    ? 'bg-cyan-400/10 text-[#45c6d8]'
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <NavigationIcon
                  size={22}
                  strokeWidth={isActive ? 2.4 : 2}
                />

                <span className="text-[11px] font-medium">
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <div className="mx-auto w-full max-w-md border-t border-white/10 bg-[#08131d]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid grid-cols-5 items-end">
            {navigationItems.map((item) => {
              const NavigationIcon = item.icon
              const isActive = activePage === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigation(item.id)}
                  className={`group flex min-w-0 flex-col items-center justify-end gap-1 rounded-xl px-1 py-1.5 transition duration-150 active:scale-95 ${
                    isActive
                      ? 'text-[#45c6d8]'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      isActive
                        ? 'bg-cyan-400/15 text-[#45c6d8]'
                        : ''
                    }`}
                  >
                    <NavigationIcon
                      size={21}
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                  </div>

                  <span
                    className={`truncate text-[10px] font-medium min-[375px]:text-[11px] ${
                      isActive ? 'text-[#45c6d8]' : ''
                    }`}
                  >
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