import { useEffect, useState } from 'react'
import {
  Check,
  EyeOff,
  Flag,
  Heart,
  LoaderCircle,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import {
  createCommunityPost,
  deleteCommunityPost,
  getCommunityRoom,
  hideCommunityPost,
  reportCommunityPost,
  toggleCommunityReaction,
  updateCommunityPost,
} from '../../services/connect'

const reactions = [
  { id: 'praying', label: '🙏 Praying' },
  { id: 'prayingWithYou', label: '🤝 With you' },
  { id: 'notAlone', label: '🤍 Not alone' },
  { id: 'thankYou', label: '🙌 Thank you' },
]

function formatTimestamp(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat([], {
    month: 'short',
    day: 'numeric',
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

function PrayerRoom() {
  const [posts, setPosts] = useState([])
  const [room, setRoom] = useState({ canParticipate: true })
  const [isLoading, setIsLoading] = useState(true)
  const [isWorking, setIsWorking] = useState(false)
  const [showPrayerForm, setShowPrayerForm] = useState(false)
  const [notice, setNotice] = useState('')
  const [prayerForm, setPrayerForm] = useState({
    title: '',
    details: '',
    category: 'General',
  })

  async function loadRoom({ quiet = false } = {}) {
    try {
      if (!quiet) setIsLoading(true)
      const payload = await getCommunityRoom('prayer')
      setPosts(payload?.posts || [])
      setRoom(payload?.room || { canParticipate: false })
      setNotice('')
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Unable to load the Prayer Room.',
      )
    } finally {
      if (!quiet) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRoom()
  }, [])

  async function submitPrayer(event) {
    event.preventDefault()
    if (isWorking || !room?.canParticipate) return

    const title = prayerForm.title.trim()
    const details = prayerForm.details.trim()
    if (!title || !details) return

    try {
      setIsWorking(true)
      setNotice('')
      const post = await createCommunityPost('prayer', {
        title,
        body: details,
        category: prayerForm.category,
      })
      if (post) setPosts((current) => [post, ...current])
      setPrayerForm({ title: '', details: '', category: 'General' })
      setShowPrayerForm(false)
    } catch (error) {
      setNotice(
        error?.code === 'CHAT_PARTICIPATION_UPGRADE_REQUIRED'
          ? 'Upgrade to Standard to share prayer requests and encourage others.'
          : error instanceof Error
            ? error.message
            : 'Unable to share this prayer request.',
      )
    } finally {
      setIsWorking(false)
    }
  }

  function applyReaction(postId, reaction) {
    setPosts((current) => current.map((post) => {
      if (post.id !== postId) return post

      const myReactions = post.myReactions || []
      const wasMine = myReactions.includes(reaction)
      const currentCount = post.reactions?.[reaction] || 0
      const nextCount = Math.max(0, currentCount + (wasMine ? -1 : 1))

      return {
        ...post,
        myReactions: wasMine
          ? myReactions.filter((item) => item !== reaction)
          : [...myReactions, reaction],
        reactions: {
          ...(post.reactions || {}),
          [reaction]: nextCount,
        },
      }
    }))
  }

  async function toggleReaction(postId, reaction) {
    if (!room?.canParticipate) {
      setNotice('Upgrade to Standard to participate in the Prayer Room.')
      return
    }

    setNotice('')
    applyReaction(postId, reaction)

    try {
      await toggleCommunityReaction(postId, reaction)
    } catch (error) {
      applyReaction(postId, reaction)
      setNotice(error instanceof Error ? error.message : 'Unable to update encouragement.')
    }
  }

  async function markAnswered(postId) {
    try {
      setIsWorking(true)
      await updateCommunityPost(postId, { status: 'answered' })
      await loadRoom({ quiet: true })
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to mark this prayer answered.')
    } finally {
      setIsWorking(false)
    }
  }

  async function deletePost(postId) {
    try {
      setIsWorking(true)
      await deleteCommunityPost(postId)
      setPosts((current) => current.filter((post) => post.id !== postId))
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to delete this prayer request.')
    } finally {
      setIsWorking(false)
    }
  }

  async function reportPost(postId) {
    try {
      await reportCommunityPost(postId)
      setPosts((current) => current.map((post) =>
        post.id === postId ? { ...post, reported: true } : post,
      ))
      setNotice('Prayer request reported for review.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to report this prayer request.')
    }
  }

  async function hidePost(postId) {
    try {
      await hideCommunityPost(postId)
      setPosts((current) => current.filter((post) => post.id !== postId))
      setNotice('Prayer request hidden.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to hide this prayer request.')
    }
  }

  return (
    <div>
      <section className="rounded-3xl border border-purple-400/15 bg-gradient-to-br from-purple-400/[0.08] to-transparent p-5 shadow-xl shadow-black/20">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
            <Heart size={23} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">Prayer Room</p>
            <h2 className="mt-2 text-xl font-bold">Pray for one another</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Share a request and allow the Project 3|26 community to stand with you.
            </p>
          </div>
        </div>

        {room?.canParticipate ? (
          <button
            type="button"
            onClick={() => setShowPrayerForm((current) => !current)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-400 px-4 py-3 text-sm font-bold text-[#170d20] active:scale-[0.99]"
          >
            {showPrayerForm ? <X size={18} /> : <Plus size={18} />}
            {showPrayerForm ? 'Close Form' : 'Share a Prayer Request'}
          </button>
        ) : (
          <div className="mt-5 rounded-2xl border border-purple-300/15 bg-purple-400/[0.06] p-3 text-sm text-purple-100">
            Free John members can read prayer requests. Upgrade to Standard to post and encourage others.
          </div>
        )}
      </section>

      {notice && (
        <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      {showPrayerForm && room?.canParticipate && (
        <form onSubmit={submitPrayer} className="mt-4 rounded-3xl border border-white/5 bg-[#12202b] p-5">
          <label htmlFor="prayer-title" className="text-xs font-bold uppercase tracking-widest text-purple-300">
            Prayer request
          </label>
          <input
            id="prayer-title"
            value={prayerForm.title}
            onChange={(event) => setPrayerForm((current) => ({ ...current, title: event.target.value }))}
            maxLength={100}
            placeholder="Give your request a short title"
            className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
          />

          <label htmlFor="prayer-details" className="mt-4 block text-xs font-bold uppercase tracking-widest text-purple-300">
            Details
          </label>
          <textarea
            id="prayer-details"
            value={prayerForm.details}
            onChange={(event) => setPrayerForm((current) => ({ ...current, details: event.target.value }))}
            rows={4}
            maxLength={500}
            placeholder="Share only what you are comfortable sharing"
            className="mt-2 w-full resize-none rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none"
          />

          <label htmlFor="prayer-category" className="mt-4 block text-xs font-bold uppercase tracking-widest text-purple-300">
            Category
          </label>
          <select
            id="prayer-category"
            value={prayerForm.category}
            onChange={(event) => setPrayerForm((current) => ({ ...current, category: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/5 bg-[#101c26] px-4 py-3 text-sm text-white"
          >
            <option>General</option>
            <option>Health</option>
            <option>Family</option>
            <option>Work</option>
            <option>Grief</option>
            <option>Church</option>
          </select>

          <div className="mt-5 flex gap-3">
            <button type="button" onClick={() => setShowPrayerForm(false)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prayerForm.title.trim() || !prayerForm.details.trim() || isWorking}
              className="flex-1 rounded-xl bg-purple-400 px-4 py-3 text-sm font-bold text-[#170d20] disabled:opacity-40"
            >
              {isWorking ? 'Posting…' : 'Post Request'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
          <LoaderCircle size={18} className="animate-spin" />
          Loading prayer requests…
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {posts.length === 0 && (
            <div className="rounded-3xl border border-white/5 bg-[#12202b] px-5 py-10 text-center text-sm text-slate-500">
              No prayer requests yet. Be the first to share one.
            </div>
          )}

          {posts.map((post) => {
            const answered = post.status === 'answered'
            const availableReactions = answered
              ? [{ id: 'praiseGod', label: '🎉 Praise God' }]
              : reactions

            return (
              <article key={post.id} className="rounded-3xl border border-purple-400/10 bg-[#12202b] p-5">
                <div className="flex items-start gap-3">
                  {post.avatarUrl ? (
                    <img src={post.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-400/10 text-xs font-bold text-purple-200">
                      {initials(post.name)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{post.name}</p>
                      {answered && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          <Check size={10} /> Answered
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{formatTimestamp(post.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-purple-400/10 bg-purple-400/[0.05] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{post.title}</h3>
                    {post.category && (
                      <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{post.body}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {availableReactions.map((reaction) => {
                    const active = (post.myReactions || []).includes(reaction.id)
                    const count = post.reactions?.[reaction.id] || 0
                    return (
                      <button
                        key={reaction.id}
                        type="button"
                        disabled={!room?.canParticipate}
                        onClick={() => toggleReaction(post.id, reaction.id)}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-50 ${active ? 'bg-purple-400 text-[#170d20]' : 'bg-purple-400/10 text-purple-300'}`}
                      >
                        {reaction.label}{count ? ` (${count})` : ''}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-3 text-xs">
                  {post.isMine ? (
                    <>
                      {!answered && (
                        <button type="button" onClick={() => markAnswered(post.id)} className="text-emerald-300">
                          Mark answered
                        </button>
                      )}
                      <button type="button" onClick={() => deletePost(post.id)} className="inline-flex items-center gap-1 text-red-300">
                        <Trash2 size={13} /> Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" disabled={post.reported} onClick={() => reportPost(post.id)} className="inline-flex items-center gap-1 text-slate-500 disabled:opacity-40">
                        <Flag size={13} /> {post.reported ? 'Reported' : 'Report'}
                      </button>
                      <button type="button" onClick={() => hidePost(post.id)} className="inline-flex items-center gap-1 text-slate-500">
                        <EyeOff size={13} /> Hide
                      </button>
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PrayerRoom
