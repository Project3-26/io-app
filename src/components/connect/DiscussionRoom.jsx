import { useEffect, useRef, useState } from 'react'
import {
  EyeOff,
  Flag,
  MoreHorizontal,
  Send,
  SmilePlus,
  Trash2,
} from 'lucide-react'
import { sharedJourney } from '../../data/sharedJourney'

const DEFAULT_STORAGE_KEY = `project326-discussion-${sharedJourney.chapterId || 'today'}`
const CURRENT_USER = 'Brian Cooper'
const REACTIONS = ['👍', '❤️', '🙏', '🔥', '👀']

const defaultStartingPosts = [
  {
    id: 1,
    name: 'Sarah M.',
    message: 'God did not remain distant. The Word became flesh and came near.',
    timestamp: '9:14 AM',
    reactions: { '❤️': 4, '🙏': 3 },
    myReactions: [],
    reported: false,
    hidden: false,
  },
  {
    id: 2,
    name: 'Marcus T.',
    message: 'Jesus is where heaven and earth meet. That really stood out to me today.',
    timestamp: '9:22 AM',
    reactions: { '🔥': 3, '👍': 2 },
    myReactions: [],
    reported: false,
    hidden: false,
  },
  {
    id: 3,
    name: 'Elena R.',
    message: 'The phrase “full of grace and truth” keeps pulling me back in.',
    timestamp: '9:37 AM',
    reactions: { '👀': 2, '❤️': 1 },
    myReactions: [],
    reported: false,
    hidden: false,
  },
]

function normalizePosts(posts) {
  return posts.map((post) => ({
    ...post,
    timestamp: post.timestamp || 'Just now',
    reactions: post.reactions || {},
    myReactions: post.myReactions || [],
    reported: post.reported || false,
    hidden: post.hidden || false,
  }))
}

function DiscussionRoom({
  storageKey = DEFAULT_STORAGE_KEY,
  prompt = `Share something about ${sharedJourney.reference}…`,
  contextLabel = 'Live conversation',
  contextPrompts = ['What stood out?', 'What confused you?', 'How might you live this?'],
  startingPosts = defaultStartingPosts,
}) {
  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = localStorage.getItem(storageKey)
      return normalizePosts(savedPosts ? JSON.parse(savedPosts) : startingPosts)
    } catch {
      return normalizePosts(startingPosts)
    }
  })
  const [message, setMessage] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [reactionPickerId, setReactionPickerId] = useState(null)
  const [notice, setNotice] = useState('')
  const [deletePostId, setDeletePostId] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(posts))
  }, [posts, storageKey])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [posts.length])

  function showNotice(text) {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const newMessage = message.trim()
    if (!newMessage) return

    const time = new Intl.DateTimeFormat([], {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date())

    setPosts((currentPosts) => [
      ...currentPosts,
      {
        id: Date.now(),
        name: CURRENT_USER,
        message: newMessage,
        timestamp: time,
        reactions: {},
        myReactions: [],
        reported: false,
        hidden: false,
      },
    ])
    setMessage('')
  }

  function toggleReaction(postId, emoji) {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post
        const hasReacted = post.myReactions.includes(emoji)
        const currentCount = post.reactions[emoji] || 0
        const nextReactions = { ...post.reactions }

        if (hasReacted) {
          const nextCount = Math.max(currentCount - 1, 0)
          if (nextCount === 0) delete nextReactions[emoji]
          else nextReactions[emoji] = nextCount
        } else {
          nextReactions[emoji] = currentCount + 1
        }

        return {
          ...post,
          reactions: nextReactions,
          myReactions: hasReacted
            ? post.myReactions.filter((reaction) => reaction !== emoji)
            : [...post.myReactions, emoji],
        }
      }),
    )
    setReactionPickerId(null)
  }

  function reportPost(postId) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, reported: true } : post,
      ),
    )
    setOpenMenuId(null)
    showNotice('This message has been reported for review.')
  }

  function hidePost(postId) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, hidden: true } : post,
      ),
    )
    setOpenMenuId(null)
    showNotice('Message hidden.')
  }

  function confirmDeletePost() {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== deletePostId),
    )
    setDeletePostId(null)
    setOpenMenuId(null)
    showNotice('Message deleted.')
  }

  const visiblePosts = posts.filter((post) => !post.hidden)

  return (
    <div className="pb-24 lg:pb-28">
      <section className="rounded-[22px] border border-white/10 bg-[#0c2138] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 font-semibold text-cyan-300">
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

      {notice && (
        <div className="mt-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-3 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      <div className="mt-4 rounded-[24px] border border-white/10 bg-[#071a2d] p-3 sm:p-4">
        <div className="max-h-[58vh] space-y-4 overflow-y-auto pr-1">
          {visiblePosts.map((post) => {
            const isOwner = post.name === CURRENT_USER
            const visibleReactions = Object.entries(post.reactions).filter(([, count]) => count > 0)

            return (
              <div key={post.id} className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-[84%] sm:max-w-[72%] ${isOwner ? 'text-right' : 'text-left'}`}>
                  {!isOwner && (
                    <div className="mb-1.5 flex items-center gap-2 px-1">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c7dce7] text-[10px] font-bold text-cyan-800">
                        {post.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-xs font-semibold text-slate-300">{post.name}</span>
                    </div>
                  )}

                  <div className={`relative rounded-2xl px-4 py-3 shadow-md ${isOwner ? 'rounded-br-md bg-cyan-600 text-white' : 'rounded-bl-md border border-white/10 bg-[#12283d] text-slate-100'}`}>
                    <p className="text-sm leading-6">{post.message}</p>
                    <div className={`mt-1.5 text-[10px] ${isOwner ? 'text-cyan-100/75' : 'text-slate-500'}`}>
                      {post.timestamp}
                    </div>

                    <div className={`absolute top-1 ${isOwner ? '-left-10' : '-right-10'}`}>
                      <button type="button" onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white" aria-label="Message options">
                        <MoreHorizontal size={16} />
                      </button>

                      {openMenuId === post.id && (
                        <div className={`absolute top-9 z-30 min-w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#182630] p-2 shadow-2xl ${isOwner ? 'left-0' : 'right-0'}`}>
                          {isOwner ? (
                            <button type="button" onClick={() => { setDeletePostId(post.id); setOpenMenuId(null) }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-300 transition hover:bg-red-400/[0.08]">
                              <Trash2 size={16} /> Delete message
                            </button>
                          ) : (
                            <>
                              <button type="button" onClick={() => reportPost(post.id)} disabled={post.reported} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-40">
                                <Flag size={16} /> {post.reported ? 'Reported' : 'Report message'}
                              </button>
                              <button type="button" onClick={() => hidePost(post.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-white/[0.05]">
                                <EyeOff size={16} /> Hide message
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`mt-1.5 flex flex-wrap items-center gap-1.5 ${isOwner ? 'justify-end' : 'justify-start'}`}>
                    {visibleReactions.map(([emoji, count]) => {
                      const mine = post.myReactions.includes(emoji)
                      return (
                        <button key={emoji} type="button" onClick={() => toggleReaction(post.id, emoji)} className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition ${mine ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-200' : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.07]'}`}>
                          <span>{emoji}</span><span>{count}</span>
                        </button>
                      )
                    })}

                    <div className="relative">
                      <button type="button" onClick={() => setReactionPickerId(reactionPickerId === post.id ? null : post.id)} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.07] hover:text-white" aria-label="React to message">
                        <SmilePlus size={14} />
                      </button>
                      {reactionPickerId === post.id && (
                        <div className={`absolute bottom-9 z-30 flex gap-1 rounded-2xl border border-white/10 bg-[#182630] p-2 shadow-2xl ${isOwner ? 'right-0' : 'left-0'}`}>
                          {REACTIONS.map((emoji) => (
                            <button key={emoji} type="button" onClick={() => toggleReaction(post.id, emoji)} className="flex h-9 w-9 items-center justify-center rounded-xl text-lg transition hover:bg-white/[0.08] active:scale-95">
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
      </div>

      <div className="fixed inset-x-0 bottom-[calc(4.9rem+env(safe-area-inset-bottom))] z-40 px-4 lg:bottom-4 lg:left-24 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <form onSubmit={handleSubmit} className="rounded-[20px] border border-white/10 bg-[#081b2d]/95 p-2.5 shadow-[0_-10px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-3">
            <div className="flex items-end gap-2">
              <textarea id="discussion-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={1} maxLength={280} placeholder={prompt} className="min-h-11 max-h-28 flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/35" />
              <button type="submit" disabled={!message.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-[#06111b] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">
                <Send size={18} />
              </button>
            </div>
            <div className="mt-1 px-1 text-right text-[10px] text-slate-600">{message.length}/280</div>
          </form>
        </div>
      </div>

      {deletePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#12202b] p-6 shadow-2xl">
            <h2 className="text-xl font-bold">Delete this message?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">This cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setDeletePostId(null)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300">Keep message</button>
              <button type="button" onClick={confirmDeletePost} className="flex-1 rounded-xl bg-red-400 px-4 py-3 text-sm font-bold text-[#210b0b]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscussionRoom