import {
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
import { sharedJourney } from '../data/sharedJourney'

const connectRooms = [
  {
    id: 'today',
    shortName: 'Today',
    name: 'Today’s Conversation',
    description: 'Talk through the Chapter of the Day together.',
    type: 'chapter',
    members: 128,
    locked: false,
  },
  {
    id: 'prayer',
    shortName: 'Prayer',
    name: 'Prayer Room',
    description: 'Share prayer requests and stand with others in prayer.',
    type: 'prayer',
    members: 92,
    locked: false,
  },
  {
    id: 'transformation',
    shortName: 'Transformation',
    name: 'Transformation Board',
    description: 'Share one short truth about what changed in you.',
    type: 'transformation',
    members: 86,
    locked: false,
  },
  {
    id: 'villas-church',
    shortName: 'My Church',
    name: 'Villas Church',
    description: 'A private Scripture-centered community for Villas Church.',
    type: 'church',
    members: 46,
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

function getRoomStyle(type, active = false) {
  if (type === 'church') {
    return {
      icon: 'bg-orange-200/70 text-orange-600',
      button: active
        ? 'border-orange-300/60 bg-[#e8ddd0] text-[#153047]'
        : 'border-[#c8d3db] bg-[#dfe8ee] text-slate-600 hover:border-orange-300/50 hover:bg-[#eee1d4]',
    }
  }

  if (type === 'prayer') {
    return {
      icon: 'bg-[#d5dce6] text-[#48617b]',
      button: active
        ? 'border-[#9eb1c3] bg-[#d5dce6] text-[#153047]'
        : 'border-[#c8d3db] bg-[#dfe8ee] text-slate-600 hover:border-[#9eb1c3] hover:bg-[#e7eef2]',
    }
  }

  return {
    icon: 'bg-[#c7dce7] text-cyan-700',
    button: active
      ? 'border-cyan-400/50 bg-[#c7dce7] text-[#153047]'
      : 'border-[#c8d3db] bg-[#dfe8ee] text-slate-600 hover:border-cyan-400/40 hover:bg-[#e7eef2]',
  }
}

function RoomSwitcher({ activeRoomId, onSelectRoom }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <div className="flex min-w-max gap-2">
        {connectRooms.map((room) => {
          const RoomIcon = getRoomIcon(room.type)
          const isActive = room.id === activeRoomId
          const styles = getRoomStyle(room.type, isActive)

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelectRoom(room.id)}
              className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-semibold shadow-sm transition active:scale-95 ${styles.button}`}
            >
              {room.locked ? <Lock size={14} /> : <RoomIcon size={15} />}
              {room.shortName}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ConnectRoomPage({
  selectedRoomId = 'today',
  onSelectRoom,
  onNavigate,
}) {
  const activeRoom =
    connectRooms.find((room) => room.id === selectedRoomId) || connectRooms[0]

  function handleSelectRoom(roomId) {
    if (typeof onSelectRoom === 'function') {
      onSelectRoom(roomId)
    }
  }

  function renderRoomContent() {
    if (activeRoom.id === 'today') {
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

    return null
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="connect" onNavigate={onNavigate} />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <header className="rounded-[24px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-xl shadow-black/10 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  Connect
                </p>

                <h1 className="mt-1.5 text-2xl font-semibold sm:text-3xl">
                  {activeRoom.id === 'today'
                    ? `${sharedJourney.reference} — Today’s Conversation`
                    : activeRoom.name}
                </h1>

                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  {activeRoom.id === 'today'
                    ? 'Join the conversation already happening around today’s chapter.'
                    : activeRoom.description}
                </p>

                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Users size={13} />
                  <span>{activeRoom.members} people here</span>
                </div>
              </div>

              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getRoomStyle(activeRoom.type).icon}`}>
                {(() => {
                  const RoomIcon = getRoomIcon(activeRoom.type)
                  return <RoomIcon size={21} />
                })()}
              </div>
            </div>
          </header>

          <section className="mt-4">
            <RoomSwitcher
              activeRoomId={activeRoom.id}
              onSelectRoom={handleSelectRoom}
            />
          </section>

          <div className="mt-4">{renderRoomContent()}</div>
        </main>
      </div>
    </div>
  )
}

export default ConnectRoomPage