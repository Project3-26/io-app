import { useEffect, useRef, useState } from 'react'
import {
  LoaderCircle,
  Lock,
  Send,
  SmilePlus,
} from 'lucide-react'
import { sharedJourney } from '../../data/sharedJourney'
import { hasMemberSession } from '../../services/backend'
import {
  getConnectRoom,
  sendConnectMessage,
  toggleConnectReaction,
} from '../../services/connect'

const REACTIONS = ['👍', '❤️', '🙏', '🔥', '👀']

const defaultStartingPosts = [
  {
    id: 'demo-1',
    name: 'Sarah M.',
    message: 'God did not remain distant. The Word became flesh and came near.',
    createdAt: new Date().toISOString(),
    reactions: { '❤️': 4, '🙏': 3 },
    myReactions: [],
    isMine: false,
  },
  {
    id: 'demo-2',
    name: 'Marcus T.',
    message: 'Jesus is where heaven and earth meet. That really stood out to me today.',
    createdAt: new Date().toISOString(),
    reactions: { '🔥': 3, '👍': 2 },
    myReactions: [],
    isMine: false,
  },
]

const themes = {
  connect: {
    contextBadge: 'bg-cyan-400/10 text-cyan-300',
    notice: 'border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-200',
    chatPanel: 'bg-[#071a2d]',
    avatar: 'bg-[#c7dce7] text-cyan-800',
    ownerBubble: 'bg-cyan-600 text-white',
    ownerTime: 'text-cyan-100/75',
    reactionMine: 'border-cyan-400/40 bg-cyan-400/15 text-cyan-200',
    composer: 'bg-[#081b2d]/95',
    inputFocus: 'focus:border-cyan-400/35',
    sendButton: 'bg-cyan-400 text-[#06111b]',
  },
  church: {
    contextBadge: 'bg-amber-300/15 text-amber-200',
    notice: 'border-amber-300/20 bg-amber-300/[0.08] text-amber-100',
    chatPanel: 'bg-[#151713]',
    avatar: 'bg-[#ead8bd] text-[#7a4d1d]',
    ownerBubble: 'bg-[#b86f42] text-white',
    ownerTime: 'text-orange-100/80',
    reactionMine: 'border-amber-300/40 bg-amber-300/15 text-amber-100',
    composer: 'bg-[#171914]/95',
    inputFocus: 'focus:border-amber-300/40',
    sendButton: 'bg-[#d89a62] text-[#24180d]',
  },
}

function formatTimestamp(value) {
  const date = value ? new Date(value) : new Date()

  if (Number.isNaN(date.getTime())) return 'Just now'

  return new Intl.DateTimeFormat([], {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function initials(name) {
  return String(name || 'M')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function DiscussionRoom({
  roomId,
  prompt = `Share something about ${sharedJourney.reference}…`,
  contextLabel = 'Live conversation',
  contextPrompts = ['What stood out?', 'What confused you?', 'How might you live this?'],
  startingPosts = defaultStartingPosts,
  theme = 'connect',
}) {
  const resolvedRoomId = roomId || (theme === 'church' ? 'villas-church' : 'today')
  const chapterId = resolvedRoomId === 'today' ? sharedJourney.chapterId : null
  const palette = themes[theme] || themes.connect
  const signedIn = hasMemberSession()

  const [posts, setPosts] = useState(startingPosts)
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState({ canParticipate: signedIn })
  const [isLoading, setIsLoading] = useState(signedIn)
  const [isSending, setIsSending] = useState(false)
  const [reactionPickerId, setReactionPickerId] = useState(null)
  const [notice, setNotice] = useState('')
  const bottomRef = useRef(null)

  async function loadRoom({ quiet = false } = {}) {
    if (!signedIn) return

    try {
      if (!quiet) setIsLoading(true)
      const payload = await getConnectRoom(resolvedRoomId, chapterId)
      setRoom(payload.room)
      setPosts(payload.messages || [])
      setNotice('')
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Unable to load this conversation.',
      )
    } finally {
      if (!quiet) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRoom()
  }, [resolvedRoomId, chapterId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [posts.length])

  async function handleSubmit(event) {
    event.preventDefault()
    const newMessage = message.trim()
    if (!newMessage || isSending) return

    if (!signedIn) {
      setNotice('Sign in with a member account to participate in Connect.')
      return
    }

    if (!room?.canParticipate) {
      setNotice('Free John members can follow today’s conversation. Upgrade to Standard to post, reply, and react.')
      return
    }

    try {
      setIsSending(true)
      setNotice('')
      const payload = await sendConnectMessage(
        resolvedRoomId,
        chapterId,
        newMessage,
      )
      setPosts((current) => [...current, payload.message])
      setMessage('')
    } catch (error) {
      setNotice(
        error?.code === 'CHAT_PARTICIPATION_UPGRADE_REQUIRED'
          ? 'Free John members can read today’s chat. Upgrade to Standard to join the conversation.'
          : error instanceof Error
            ? error.message
            : 'Unable to send your message.',
      )
    } finally {
      setIsSending(false)
    }
  }

  async function toggleReaction(postId, emoji) {
    if (!signedIn || !room?.canParticipate) {
      setNotice('Upgrade to Standard to react and participate in today’s conversation.')
      setReactionPickerId(null)
      return
    }

    try {
      await toggleConnectReaction(postId, emoji)
      await loadRoom({ quiet: true })
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Unable to update reaction.',
      )
    } finally {
      setReactionPickerId(null)
    }
  }

  return (
    <div className="pb-24 lg:pb-28">
      <section className="rounded-[22px] border border-white/10 bg-[#0c2138] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className={`rounded-full px-2.5 py-1 font-semibold ${palette.contextBadge}`}>
            {contextLabel}
          </span>
          {contextPrompts.map((item, index) => (
            <span key={item} className="contents">
              {index > 0 && <span>•</span>}
              <span>{item}</span>
            </span>
          ))}
        </div>
      </section>

      {!room?.canParticipate && signedIn && resolvedRoomId === 'today' && (
        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-400/[0.08] p-3 text-sm text-cyan-100">
          <Lock size={17} className="mt-0.5 shrink-0" />
          <p>
            You’re viewing today’s conversation with Free John. Upgrade to Standard to post and react.
          </p>
        </div>
      )}

      {notice && (
        <div className={`mt-3 rounded-2xl border p-3 text-sm ${palette.notice}`}>
          {notice}
        </div>
      )}

      <div className={`mt-4 rounded-[24px] border border-white/10 p-3 sm:p-4 ${palette.chatPanel}`}>
        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
            <LoaderCircle size={18} className="animate-spin" />
            Loading conversation…
          </div>
        ) : (
          <div className="max-h-[58vh] space-y-4 overflow-y-auto pr-1">
            {posts.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-500">
                No messages yet. Start the conversation.
              </div>
            )}

            {posts.map((post) => {
              const isOwner = Boolean(post.isMine)
              const visibleReactions = Object.entries(post.reactions || {}).filter(([, count]) => count > 0)

              return (
                <div key={post.id} className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-[84%] sm:max-w-[72%] ${isOwner ? 'text-right' : 'text-left'}`}>
                    <div className={`mb-1.5 flex items-center gap-2 px-1 ${isOwner ? 'flex-row-reverse justify-start' : ''}`}>
                      {post.avatarUrl ? (
                        <img src={post.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${palette.avatar}`}>
                          {initials(post.name)}
                        </div>
                      )}
                      <span className="text-xs font-semibold text-slate-300">{post.name}</span>
                    </div>

                    <div className={`rounded-2xl px-4 py-3 shadow-md ${isOwner ? `rounded-br-md ${palette.ownerBubble}` : 'rounded-bl-md border border-white/10 bg-[#12283d] text-slate-100'}`}>
                      <p className="text-sm leading-6">{post.message}</p>
                      <div className={`mt-1.5 text-[10px] ${isOwner ? palette.ownerTime : 'text-slate-500'}`}>
                        {formatTimestamp(post.createdAt)}
                      </div>
                    </div>

                    <div className={`mt-1.5 flex flex-wrap items-center gap-1.5 ${isOwner ? 'justify-end' : 'justify-start'}`}>
                      {visibleReactions.map(([emoji, count]) => {
                        const mine = (post.myReactions || []).includes(emoji)
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => toggleReaction(post.id, emoji)}
                            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${mine ? palette.reactionMine : 'border-white/10 bg-white/[0.04] text-slate-300'}`}
                          >
                            <span>{emoji}</span>
                            <span>{count}</span>
                          </button>
                        )
                      })}

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setReactionPickerId(reactionPickerId === post.id ? null : post.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400"
                          aria-label="React to message"
                        >
                          <SmilePlus size={14} />
                        </button>

                        {reactionPickerId === post.id && (
                          <div className={`absolute bottom-9 z-30 flex gap-1 rounded-2xl border border-white/10 bg-[#182630] p-2 shadow-2xl ${isOwner ? 'right-0' : 'left-0'}`}>
                            {REACTIONS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => toggleReaction(post.id, emoji)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-[calc(4.9rem+env(safe-area-inset-bottom))] z-40 px-4 lg:bottom-4 lg:left-24 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <form onSubmit={handleSubmit} className={`rounded-[20px] border border-white/10 p-2.5 shadow-[0_-10px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-3 ${palette.composer}`}>
            <div className="flex items-end gap-2">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={1}
                maxLength={500}
                disabled={signedIn && !room?.canParticipate}
                placeholder={
                  signedIn && !room?.canParticipate
                    ? 'Upgrade to Standard to join the conversation'
                    : prompt
                }
                className={`min-h-11 max-h-28 flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60 ${palette.inputFocus}`}
              />
              <button
                type="submit"
                disabled={!message.trim() || isSending || (signedIn && !room?.canParticipate)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl disabled:cursor-not-allowed disabled:opacity-40 ${palette.sendButton}`}
                aria-label="Send message"
              >
                {isSending ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
            <div className="mt-1 px-1 text-right text-[10px] text-slate-600">{message.length}/500</div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DiscussionRoom
