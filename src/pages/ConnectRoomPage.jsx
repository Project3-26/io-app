import {
  ArrowLeft,
  BookOpen,
  Church,
  Heart,
  Lock,
  Sparkles,
  Users,
} from 'lucide-react'

import AppNavigation from '../components/AppNavigation'
import ChurchRoom from '../components/connect/ChurchRoom'
import DiscussionRoom from '../components/connect/DiscussionRoom'
import PrayerRoom from '../components/connect/PrayerRoom'
import TransformationBoard from '../components/connect/TransformationBoard'

const connectRooms = [
  {
    id: 'john-1',
    shortName: 'Discussion',
    name: 'John 1 Discussion',
    description:
      'Share what stood out and respond to today’s chapter.',
    type: 'chapter',
    members: 128,
    color: 'cyan',
    locked: false,
  },
  {
    id: 'transformation',
    shortName: 'Transformation',
    name: 'Transformation Board',
    description:
      'Share one short truth about what changed in you.',
    type: 'transformation',
    members: 86,
    color: 'orange',
    locked: false,
  },
  {
    id: 'prayer',
    shortName: 'Prayer',
    name: 'Prayer Room',
    description:
      'Share prayer requests and stand with others in prayer.',
    type: 'prayer',
    members: 92,
    color: 'purple',
    locked: false,
  },
  {
    id: 'villas-church',
    shortName: 'Villas',
    name: 'Villas Church',
    description:
      'A private Scripture-centered community for Villas Church.',
    type: 'church',
    members: 46,
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

function getRoomStyles(color, active = false) {
  const styles = {
    cyan: {
      icon: 'bg-cyan-400/10 text-cyan-300',
      border: active
        ? 'border-cyan-400/40'
        : 'border-cyan-400/10',
      background: active
        ? 'bg-cyan-400/10'
        : 'bg-white/[0.025]',
      text: 'text-cyan-300',
      glow: active
        ? 'shadow-[0_0_18px_rgba(34,211,238,0.12)]'
        : '',
    },

    orange: {
      icon: 'bg-orange-400/10 text-orange-300',
      border: active
        ? 'border-orange-400/40'
        : 'border-orange-400/10',
      background: active
        ? 'bg-orange-400/10'
        : 'bg-white/[0.025]',
      text: 'text-orange-300',
      glow: active
        ? 'shadow-[0_0_18px_rgba(251,146,60,0.12)]'
        : '',
    },

    purple: {
      icon: 'bg-purple-400/10 text-purple-300',
      border: active
        ? 'border-purple-400/40'
        : 'border-purple-400/10',
      background: active
        ? 'bg-purple-400/10'
        : 'bg-white/[0.025]',
      text: 'text-purple-300',
      glow: active
        ? 'shadow-[0_0_18px_rgba(192,132,252,0.12)]'
        : '',
    },
  }

  return styles[color] || styles.cyan
}

function RoomSwitcher({
  activeRoomId,
  onSelectRoom,
}) {
  return (
    <div className="-mx-3 overflow-x-auto px-3 pb-2 min-[375px]:-mx-4 min-[375px]:px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <div className="flex min-w-max gap-2">
        {connectRooms.map((room) => {
          const RoomIcon = getRoomIcon(room.type)
          const isActive = room.id === activeRoomId
          const styles = getRoomStyles(
            room.color,
            isActive,
          )

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelectRoom(room.id)}
              className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition active:scale-95 ${styles.border} ${styles.background} ${styles.glow} ${
                isActive
                  ? styles.text
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {room.locked ? (
                <Lock size={15} />
              ) : (
                <RoomIcon size={16} />
              )}

              {room.shortName}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RoomPlaceholder({ room }) {
  const RoomIcon = getRoomIcon(room.type)
  const styles = getRoomStyles(room.color)

  return (
    <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-xl shadow-black/20">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${styles.icon}`}
      >
        <RoomIcon size={26} />
      </div>

      <p
        className={`mt-5 text-xs font-bold uppercase tracking-[0.16em] ${styles.text}`}
      >
        {room.name}
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Room content goes here
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
        This screen is ready to receive the existing{' '}
        {room.name} content.
      </p>
    </section>
  )
}

function ConnectRoomPage({
  selectedRoomId = 'john-1',
  onSelectRoom,
  onBack,
  onNavigate,
}) {
  const activeRoom =
    connectRooms.find(
      (room) => room.id === selectedRoomId,
    ) || connectRooms[0]

  const ActiveRoomIcon = getRoomIcon(
    activeRoom.type,
  )

  const activeStyles = getRoomStyles(
    activeRoom.color,
  )

  function handleSelectRoom(roomId) {
    if (onSelectRoom) {
      onSelectRoom(roomId)
    }
  }

  function handleBack() {
    if (onBack) {
      onBack()
    }
  }

  function renderRoomContent() {
    if (activeRoom.id === 'john-1') {
      return <DiscussionRoom />
    }

    if (activeRoom.id === 'prayer') {
      return <PrayerRoom />
    }

    if (activeRoom.id === 'transformation') {
      return <TransformationBoard />
    }

    if (activeRoom.id === 'villas-church') {
      return <ChurchRoom />
    }

    return <RoomPlaceholder room={activeRoom} />
  }

  return (
    <div className="min-h-screen bg-[#06111b] text-white">
      <AppNavigation
        activePage="connect"
        onNavigate={onNavigate}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-5xl px-3 pb-32 pt-5 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10 lg:pt-8">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-11 items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:text-white active:scale-95"
          >
            <ArrowLeft size={18} />
            Connect
          </button>

          <header className="mt-6">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${activeStyles.icon}`}
              >
                <ActiveRoomIcon size={26} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {activeRoom.name}
                  </h1>

                  {activeRoom.type === 'church' && (
                    <Lock
                      size={15}
                      className="shrink-0 text-orange-300"
                    />
                  )}
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {activeRoom.description}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <Users size={14} />

                  <span>
                    {activeRoom.members} members
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Switch spaces
            </p>

            <RoomSwitcher
              activeRoomId={activeRoom.id}
              onSelectRoom={handleSelectRoom}
            />
          </div>

          <div className="mt-5">
            {renderRoomContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ConnectRoomPage