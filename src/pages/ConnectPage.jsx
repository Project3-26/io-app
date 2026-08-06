import {
  Bell,
  BookOpen,
  ChevronRight,
  Church,
  Heart,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

const connectRooms = [
  {
    id: 'john-1',
    name: 'John 1 Discussion',
    description:
      'Share what stood out and respond to today’s chapter.',
    type: 'chapter',
    members: 128,
    unread: 4,
    color: 'cyan',
    locked: false,
  },
  {
    id: 'transformation',
    name: 'Transformation Board',
    description:
      'Share one short truth about what changed in you.',
    type: 'transformation',
    members: 86,
    unread: 3,
    color: 'orange',
    locked: false,
  },
  {
    id: 'prayer',
    name: 'Prayer Room',
    description:
      'Share requests and stand with others in prayer.',
    type: 'prayer',
    members: 92,
    unread: 5,
    color: 'purple',
    locked: false,
  },
  {
    id: 'villas-church',
    name: 'Villas Church',
    description:
      'A private Scripture-centered community for Villas Church.',
    type: 'church',
    members: 46,
    unread: 2,
    color: 'orange',
    locked: false,
  },
]

function getRoomIcon(type) {
  if (type === 'chapter') {
    return BookOpen
  }

  if (type === 'transformation') {
    return Sparkles
  }

  if (type === 'prayer') {
    return Heart
  }

  if (type === 'church') {
    return Church
  }

  return Users
}

function getRoomStyles(color) {
  const styles = {
    cyan: {
      icon: 'bg-cyan-400/10 text-cyan-300',
      border:
        'border-cyan-400/10 hover:border-cyan-400/30',
      glow:
        'hover:shadow-[0_0_24px_rgba(34,211,238,0.08)]',
      label: 'text-cyan-300',
    },

    orange: {
      icon: 'bg-orange-400/10 text-orange-300',
      border:
        'border-orange-400/10 hover:border-orange-400/30',
      glow:
        'hover:shadow-[0_0_24px_rgba(251,146,60,0.08)]',
      label: 'text-orange-300',
    },

    purple: {
      icon: 'bg-purple-400/10 text-purple-300',
      border:
        'border-purple-400/10 hover:border-purple-400/30',
      glow:
        'hover:shadow-[0_0_24px_rgba(192,132,252,0.08)]',
      label: 'text-purple-300',
    },
  }

  return styles[color] || styles.cyan
}

function ConnectPage({ onNavigate, onOpenRoom }) {
  function handleOpenRoom(room) {
    if (room.locked) {
      return
    }

    if (onOpenRoom) {
      onOpenRoom(room.id)
    }
  }

  return (
    <div className="min-h-screen bg-[#06111b] text-white">
      <AppNavigation
        activePage="connect"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-5xl px-3 pb-32 pt-5 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10 lg:pt-8">
          <header>
            <p className="text-sm font-bold tracking-[0.18em] text-[#45c6d8]">
              PROJECT 3|26
            </p>

            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  Connect
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Respond to Scripture through conversation,
                  transformation, prayer, and church community.
                </p>
              </div>

              <div
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-300 shadow-[0_0_18px_rgba(251,146,60,0.15)]"
                aria-label="6 unread Connect updates"
              >
                <Bell size={22} />

                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#06111b] bg-orange-500 px-1 text-[10px] font-bold text-white">
                  6
                </span>
              </div>
            </div>
          </header>

          <section className="mt-7 rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.07] to-transparent p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <BookOpen size={21} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                  A shared response to Scripture
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Scripture is the center. These spaces help you
                  express what you are learning, share what is
                  changing in you, and walk with others.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-7">
            <div>
              <h2 className="text-xl font-bold">
                Choose a space
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Each space has one clear Scripture-centered
                purpose.
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {connectRooms.map((room) => {
                const RoomIcon = getRoomIcon(room.type)
                const styles = getRoomStyles(room.color)

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleOpenRoom(room)}
                    className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 text-left shadow-xl shadow-black/20 transition active:scale-[0.99] ${styles.border} ${styles.glow} ${
                      room.locked
                        ? 'cursor-not-allowed opacity-65'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
                      >
                        {room.locked ? (
                          <Lock size={21} />
                        ) : (
                          <RoomIcon size={23} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-base font-semibold">
                            {room.name}
                          </h3>

                          {room.type === 'church' && (
                            <Lock
                              size={13}
                              className="shrink-0 text-orange-300"
                            />
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {room.locked
                            ? 'Connect through your church to enter this room.'
                            : room.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Users size={14} />

                            <span>
                              {room.members} members
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {!room.locked &&
                              room.unread > 0 && (
                                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                                  {room.unread}
                                </span>
                              )}

                            <ChevronRight
                              size={18}
                              className={`transition group-hover:translate-x-1 ${styles.label}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-orange-400/10 bg-orange-400/[0.05] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
                <Church size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">
                    Church Rooms
                  </h2>

                  <Lock
                    size={13}
                    className="text-orange-300"
                  />
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Partner churches can offer private spaces for
                  Scripture discussion, prayer, transformation,
                  and shared discipleship.
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  Your church connection is managed from your
                  Profile.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-white/5 bg-white/[0.025] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h2 className="font-semibold">
                  A protected community
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Connect is designed for Scripture-centered
                  conversation, prayer, transformation, and
                  encouragement. Reporting and moderation tools
                  help protect that purpose.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default ConnectPage