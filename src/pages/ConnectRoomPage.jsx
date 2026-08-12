import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Church,
  LoaderCircle,
  MessageCircle,
  Users,
} from 'lucide-react'

import AppNavigation from '../components/AppNavigation'
import ChurchRoom from '../components/connect/ChurchRoom'
import DiscussionRoom from '../components/connect/DiscussionRoom'
import { sharedJourney } from '../data/sharedJourney'
import { hasMemberSession } from '../services/backend'
import { getChurchMemberships } from '../services/connect'

const communityRooms = [
  {
    id: 'today',
    shortName: 'Today’s Chapter',
    name: 'Today’s Chapter',
    type: 'chapter',
  },
  {
    id: 'journey',
    shortName: 'Journey Chat',
    name: 'Journey Chat',
    type: 'journey',
  },
]

function getRoomIcon(type) {
  if (type === 'chapter') return BookOpen
  if (type === 'journey') return MessageCircle
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

  return {
    icon: 'bg-[#c7dce7] text-cyan-700',
    button: active
      ? 'border-cyan-400/50 bg-[#c7dce7] text-[#153047]'
      : 'border-[#c8d3db] bg-[#dfe8ee] text-slate-600 hover:border-cyan-400/40 hover:bg-[#e7eef2]',
  }
}

function roomDescriptor(room) {
  if (room.type === 'church') return 'Private church community'
  if (room.id === 'today') return 'Discuss today’s shared Bible chapter'
  if (room.id === 'journey') return 'Encouragement, questions, and testimonies for the journey'
  return 'Project 3|26 community'
}

function RoomSwitcher({ rooms, activeRoomId, onSelectRoom }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <div className="flex min-w-max gap-2">
        {rooms.map((room) => {
          const RoomIcon = getRoomIcon(room.type)
          const isActive = room.id === activeRoomId
          const styles = getRoomStyle(room.type, isActive)

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelectRoom(room.id)}
              className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold shadow-sm transition active:scale-95 ${styles.button}`}
            >
              <RoomIcon size={14} />
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
  const signedIn = hasMemberSession()
  const [memberships, setMemberships] = useState([])
  const [isLoadingChurches, setIsLoadingChurches] = useState(signedIn)

  useEffect(() => {
    let mounted = true

    if (!signedIn) {
      setIsLoadingChurches(false)
      return undefined
    }

    getChurchMemberships()
      .then((rows) => {
        if (mounted) setMemberships(rows)
      })
      .catch(() => {
        if (mounted) setMemberships([])
      })
      .finally(() => {
        if (mounted) setIsLoadingChurches(false)
      })

    return () => {
      mounted = false
    }
  }, [signedIn])

  const rooms = useMemo(
    () => [
      ...communityRooms,
      ...memberships
        .filter((membership) => membership?.slug)
        .map((membership) => ({
          id: membership.slug,
          shortName: 'My Group',
          name: membership.name,
          type: 'church',
          membership,
        })),
    ],
    [memberships],
  )

  const activeRoom = rooms.find((room) => room.id === selectedRoomId) || rooms[0]

  useEffect(() => {
    if (
      selectedRoomId !== activeRoom.id &&
      typeof onSelectRoom === 'function'
    ) {
      onSelectRoom(activeRoom.id)
    }
  }, [selectedRoomId, activeRoom.id, onSelectRoom])

  function handleSelectRoom(roomId) {
    if (typeof onSelectRoom === 'function') {
      onSelectRoom(roomId)
    }
  }

  function renderRoomContent() {
    if (activeRoom.id === 'today') {
      return <DiscussionRoom roomId="today" contextLabel="Today’s Chapter" />
    }
    if (activeRoom.id === 'journey') {
      return (
        <DiscussionRoom
          roomId="journey"
          prompt="Share an encouragement, question, or testimony…"
          contextLabel="Journey Chat"
          contextPrompts={['Encourage someone', 'Ask a question', 'Share what God is doing']}
        />
      )
    }
    if (activeRoom.type === 'church') {
      return (
        <ChurchRoom
          roomId={activeRoom.id}
          churchName={activeRoom.name}
          membership={activeRoom.membership}
        />
      )
    }
    return null
  }

  const ActiveRoomIcon = getRoomIcon(activeRoom.type)
  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="connect" onNavigate={onNavigate} />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-32 pt-3 sm:px-6 lg:px-8 lg:pb-10 lg:pt-5">
          <header className="rounded-[18px] border border-[#c8d3db] bg-[#dfe8ee] px-3.5 py-3 text-[#153047] shadow-lg shadow-black/10 sm:px-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold sm:text-lg">
                  {activeRoom.id === 'today'
                    ? `${sharedJourney.reference} — Today’s Chapter`
                    : activeRoom.name}
                </h1>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 sm:text-xs">
                  <Users size={12} />
                  <span>{roomDescriptor(activeRoom)}</span>
                </div>
              </div>

              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${getRoomStyle(activeRoom.type).icon}`}>
                <ActiveRoomIcon size={16} />
              </div>
            </div>
          </header>

          <section className="mt-2.5">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <RoomSwitcher
                  rooms={rooms}
                  activeRoomId={activeRoom.id}
                  onSelectRoom={handleSelectRoom}
                />
              </div>
              {isLoadingChurches && (
                <LoaderCircle size={16} className="shrink-0 animate-spin text-slate-500" />
              )}
            </div>
          </section>

          <div className="mt-2.5">{renderRoomContent()}</div>
        </main>
      </div>
    </div>
  )
}

export default ConnectRoomPage
