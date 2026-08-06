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
    locked: false,
  },
]

function getRoomIcon(type) {
  if (type === 'chapter') return BookOpen
  if (type === 'transformation') return Sparkles
  if (type === 'prayer') return Heart
  if (type === 'church') return Church

  return Users
}

function ConnectPage({
  onNavigate,
  onOpenRoom,
}) {
  function handleOpenRoom(room) {
    if (room.locked) {
      return
    }

    if (typeof onOpenRoom === 'function') {
      onOpenRoom(room.id)
    }
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="connect"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 sm:text-sm">
                PROJECT 3|26
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Connect
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-5 text-slate-400 sm:text-base">
                Respond to Scripture through conversation,
                transformation, prayer, and church community.
              </p>
            </div>

            <div
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-white shadow-lg shadow-black/20"
              aria-label="6 unread Connect updates"
            >
              <Bell size={20} strokeWidth={2.1} />

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#041326] bg-orange-500 px-1 text-[10px] font-semibold text-white">
                6
              </span>
            </div>
          </header>

          <section className="mt-5 rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                <BookOpen size={19} strokeWidth={2.2} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                  A shared response to Scripture
                </p>

                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  Scripture is the center. These spaces help you
                  express what you are learning, share what is
                  changing, and walk with others.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                Community spaces
              </p>

              <h2 className="mt-1.5 text-2xl font-semibold">
                Choose a space
              </h2>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {connectRooms.map((room) => {
                const RoomIcon = getRoomIcon(room.type)
                const isChurch =
                  room.type === 'church'
                const isPrayer =
                  room.type === 'prayer'

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleOpenRoom(room)}
                    disabled={room.locked}
                    className={`group rounded-[20px] border p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] ${
                      isChurch
                        ? 'border-orange-300/45 bg-[#e8ddd0] hover:border-orange-400/60 hover:bg-[#eee1d4]'
                        : 'border-[#c8d3db] bg-[#dfe8ee] hover:border-cyan-400/40 hover:bg-[#e7eef2]'
                    } ${
                      room.locked
                        ? 'cursor-not-allowed opacity-60'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isChurch
                            ? 'bg-orange-200/70 text-orange-600'
                            : isPrayer
                              ? 'bg-[#d5dce6] text-[#48617b]'
                              : 'bg-[#c7dce7] text-cyan-700'
                        }`}
                      >
                        {room.locked ? (
                          <Lock size={19} />
                        ) : (
                          <RoomIcon
                            size={20}
                            strokeWidth={2.2}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold sm:text-base">
                            {room.name}
                          </h3>

                          {isChurch && (
                            <Lock
                              size={12}
                              className="shrink-0 text-orange-600"
                            />
                          )}
                        </div>

                        <p className="mt-1.5 text-sm leading-5 text-slate-500">
                          {room.locked
                            ? 'Connect through your church to enter this room.'
                            : room.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Users size={13} />

                            <span>
                              {room.members} members
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {!room.locked &&
                              room.unread > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1.5 text-[10px] font-semibold text-white">
                                  {room.unread}
                                </span>
                              )}

                            <ChevronRight
                              size={17}
                              className={`transition group-hover:translate-x-1 ${
                                isChurch
                                  ? 'text-orange-600'
                                  : 'text-cyan-700'
                              }`}
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

          <section className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] border border-orange-300/40 bg-[#e8ddd0] p-4 text-[#153047] shadow-lg shadow-black/10">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-200/70 text-orange-600">
                  <Church size={19} strokeWidth={2.2} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">
                      Church Rooms
                    </h2>

                    <Lock
                      size={12}
                      className="text-orange-600"
                    />
                  </div>

                  <p className="mt-1.5 text-sm leading-5 text-slate-600">
                    Private spaces for Scripture discussion,
                    prayer, and shared discipleship.
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Managed through your Profile.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                  <ShieldCheck size={19} strokeWidth={2.2} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    A protected community
                  </h2>

                  <p className="mt-1.5 text-sm leading-5 text-slate-600">
                    Reporting and moderation tools help keep
                    every room focused on Scripture, prayer, and
                    encouragement.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default ConnectPage