import { useEffect, useState } from 'react'
import {
  EyeOff,
  Flag,
  LoaderCircle,
  Plus,
  Sparkles,
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
} from '../../services/connect'

const MAX_LENGTH = 100
const reactions = [
  { id: 'meToo', label: 'Me Too' },
  { id: 'amen', label: 'Amen' },
  { id: 'praying', label: 'Praying' },
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

function TransformationBoard() {
  const [posts, setPosts] = useState([])
  const [room, setRoom] = useState({ canParticipate: true })
  const [isLoading, setIsLoading] = useState(true)
  const [isWorking, setIsWorking] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [reflection, setReflection] = useState('')
  const [notice, setNotice] = useState('')

  async function loadRoom({ quiet = false } = {}) {
    try {
      if (!quiet) setIsLoading(true)
      const payload = await getCommunityRoom('transformation')
      setPosts(payload?.posts || [])
      setRoom(payload?.room || { canParticipate: false })
      setNotice('')
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Unable to load the Transformation Board.',
      )
    } finally {
      if (!quiet) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRoom()
  }, [])

  async function submitTransformation(event) {
    event.preventDefault()
    const body = reflection.trim()
    if (!body || isWorking || !room?.canParticipate) return

    try {
      setIsWorking(true)
      setNotice('')
      const post = await createCommunityPost('transformation', { body })
      if (post) setPosts((current) => [post, ...current])
      setReflection('')
      setShowForm(false)
    } catch (error) {
      setNotice(
        error?.code === 'CHAT_PARTICIPATION_UPGRADE_REQUIRED'
          ? 'Upgrade to Standard to share and respond on the Transformation Board.'
          : error instanceof Error
            ? error.message
            : 'Unable to share this transformation.',
      )
    } finally {
      setIsWorking(false)
    }
  }

  async function toggleReaction(postId, reaction) {
    if (!room?.canParticipate || isWorking) {
      setNotice('Upgrade to Standard to participate on the Transformation Board.')
      return
    }

    try {
      setIsWorking(true)
      await toggleCommunityReaction(postId, reaction)
      await loadRoom({ quiet: true })
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to update reaction.')
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
      setNotice(error instanceof Error ? error.message : 'Unable to delete this post.')
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
      setNotice('Transformation post reported for review.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to report this post.')
    }
  }

  async function hidePost(postId) {
    try {
      await hideCommunityPost(postId)
      setPosts((current) => current.filter((post) => post.id !== postId))
      setNotice('Transformation post hidden.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to hide this post.')
    }
  }

  return (
    <div>
      <section className="rounded-3xl border border-orange-400/15 bg-gradient-to-br from-orange-400/[0.08] to-transparent p-5 shadow-xl shadow-black/20">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
            <Sparkles size={23} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Transformation Board</p>
            <h2 className="mt-2 text-xl font-bold">What changed in you?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Share one short truth, realization, or moment that stayed with you.
            </p>
          </div>
        </div>

        {room?.canParticipate ? (
          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3 text-sm font-bold text-[#181007] active:scale-[0.99]"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? 'Close' : 'Share What Changed'}
          </button>
        ) : (
          <div className="mt-5 rounded-2xl border border-orange-300/15 bg-orange-400/[0.06] p-3 text-sm text-orange-100">
            Free John members can read the Transformation Board. Upgrade to Standard to share and respond.
          </div>
        )}
      </section>

      {notice && (
        <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      {showForm && room?.canParticipate && (
        <form onSubmit={submitTransformation} className="mt-4 rounded-3xl border border-white/5 bg-[#12202b] p-5">
          <label htmlFor="transformation-reflection" className="text-xs font-bold uppercase tracking-widest text-orange-300">
            What changed in me
          </label>
          <textarea
            id="transformation-reflection"
            value={reflection}
            onChange={(event) => setReflection(event.target.value.slice(0, MAX_LENGTH))}
            rows={3}
            maxLength={MAX_LENGTH}
            placeholder="Example: Wow, God really loves me."
            className="mt-2 w-full resize-none rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-600">Keep it simple and honest.</p>
            <p className="text-xs text-slate-600">{reflection.length}/{MAX_LENGTH}</p>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setReflection('')
              }}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reflection.trim() || isWorking}
              className="flex-1 rounded-xl bg-orange-400 px-4 py-3 text-sm font-bold text-[#181007] disabled:opacity-40"
            >
              {isWorking ? 'Sharing…' : 'Share'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
          <LoaderCircle size={18} className="animate-spin" />
          Loading transformations…
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {posts.length === 0 && (
            <div className="rounded-3xl border border-white/5 bg-[#12202b] px-5 py-10 text-center text-sm text-slate-500">
              No transformation posts yet. Share the first one.
            </div>
          )}

          {posts.map((post) => (
            <article key={post.id} className="rounded-3xl border border-orange-400/10 bg-[#12202b] p-5">
              <div className="flex items-start gap-3">
                {post.avatarUrl ? (
                  <img src={post.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs font-bold text-orange-200">
                    {initials(post.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{post.name}</p>
                  <p className="mt-1 text-xs text-slate-600">{formatTimestamp(post.createdAt)}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-orange-400/10 bg-orange-400/[0.05] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-300">What changed in me</p>
                <p className="mt-3 text-lg font-medium leading-7 text-white">{post.body}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {reactions.map((reaction) => {
                  const active = (post.myReactions || []).includes(reaction.id)
                  const count = post.reactions?.[reaction.id] || 0
                  return (
                    <button
                      key={reaction.id}
                      type="button"
                      disabled={!room?.canParticipate || isWorking}
                      onClick={() => toggleReaction(post.id, reaction.id)}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                        active
                          ? reaction.id === 'amen'
                            ? 'bg-cyan-400 text-[#06111b]'
                            : reaction.id === 'praying'
                              ? 'bg-purple-400 text-[#170d20]'
                              : 'bg-orange-400 text-[#181007]'
                          : reaction.id === 'amen'
                            ? 'bg-cyan-400/10 text-cyan-300'
                            : reaction.id === 'praying'
                              ? 'bg-purple-400/10 text-purple-300'
                              : 'bg-orange-400/10 text-orange-300'
                      }`}
                    >
                      {reaction.label}{count ? ` (${count})` : ''}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 border-t border-white/5 pt-3 text-xs">
                {post.isMine ? (
                  <button type="button" onClick={() => deletePost(post.id)} className="inline-flex items-center gap-1 text-red-300">
                    <Trash2 size={13} /> Delete
                  </button>
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
          ))}
        </div>
      )}
    </div>
  )
}

export default TransformationBoard
