import { useEffect, useState } from 'react'
import {
  EyeOff,
  Flag,
  Heart,
  MoreHorizontal,
  Send,
  Trash2,
} from 'lucide-react'
import { mockChapter } from '../../data/mockChapter'

const STORAGE_KEY = `project326-discussion-${mockChapter.id}`
const CURRENT_USER = 'Brian Cooper'

const startingPosts = [
  {
    id: 1,
    name: 'Sarah M.',
    message:
      'God did not remain distant. The Word became flesh and came near.',
    likes: 8,
    isLiked: false,
    reported: false,
    hidden: false,
  },
  {
    id: 2,
    name: 'Marcus T.',
    message:
      'Jesus is where heaven and earth meet.',
    likes: 5,
    isLiked: false,
    reported: false,
    hidden: false,
  },
]

function getSavedPosts() {
  try {
    const savedPosts = localStorage.getItem(STORAGE_KEY)

    const posts = savedPosts
      ? JSON.parse(savedPosts)
      : startingPosts

    return posts.map((post) => ({
      ...post,
      reported: post.reported || false,
      hidden: post.hidden || false,
    }))
  } catch {
    return startingPosts
  }
}

function DiscussionRoom() {
  const [posts, setPosts] = useState(getSavedPosts)
  const [message, setMessage] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [notice, setNotice] = useState('')
  const [deletePostId, setDeletePostId] = useState(null)

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(posts),
    )
  }, [posts])

  function showNotice(text) {
    setNotice(text)

    window.setTimeout(() => {
      setNotice('')
    }, 3000)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const newMessage = message.trim()

    if (!newMessage) {
      return
    }

    setPosts((currentPosts) => [
      ...currentPosts,
      {
        id: Date.now(),
        name: CURRENT_USER,
        message: newMessage,
        likes: 0,
        isLiked: false,
        reported: false,
        hidden: false,
      },
    ])

    setMessage('')
  }

  function toggleAmen(postId) {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post
        }

        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked
            ? Math.max(post.likes - 1, 0)
            : post.likes + 1,
        }
      }),
    )
  }

  function reportPost(postId) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reported: true,
            }
          : post,
      ),
    )

    setOpenMenuId(null)
    showNotice('This post has been reported for review.')
  }

  function hidePost(postId) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              hidden: true,
            }
          : post,
      ),
    )

    setOpenMenuId(null)
    showNotice('Post hidden.')
  }

  function confirmDeletePost() {
    setPosts((currentPosts) =>
      currentPosts.filter(
        (post) => post.id !== deletePostId,
      ),
    )

    setDeletePostId(null)
    setOpenMenuId(null)
    showNotice('Post deleted.')
  }

  const visiblePosts = posts.filter(
    (post) => !post.hidden,
  )

  return (
    <div>
      <section className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.06] p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
          Today’s Discussion
        </p>

        <h2 className="mt-2 text-xl font-bold">
          What stood out to you?
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Share one short thought from {mockChapter.reference}.
        </p>
      </section>

      {notice && (
        <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      <div className="mt-5 space-y-4">
        {visiblePosts.map((post) => {
          const isOwner = post.name === CURRENT_USER

          return (
            <article
              key={post.id}
              className="rounded-3xl border border-white/5 bg-[#12202b] p-5"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {post.name}
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === post.id
                          ? null
                          : post.id,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.04] hover:text-white"
                    aria-label="Discussion post options"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenuId === post.id && (
                    <div className="absolute right-0 top-11 z-30 min-w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#182630] p-2 shadow-2xl">
                      {isOwner ? (
                        <button
                          type="button"
                          onClick={() => {
                            setDeletePostId(post.id)
                            setOpenMenuId(null)
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-300 transition hover:bg-red-400/[0.08]"
                        >
                          <Trash2 size={16} />
                          Delete post
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              reportPost(post.id)
                            }
                            disabled={post.reported}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-40"
                          >
                            <Flag size={16} />

                            {post.reported
                              ? 'Reported'
                              : 'Report post'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              hidePost(post.id)
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-white/[0.05]"
                          >
                            <EyeOff size={16} />
                            Hide post
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-200">
                {post.message}
              </p>

              <button
                type="button"
                onClick={() => toggleAmen(post.id)}
                className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  post.isLiked
                    ? 'bg-orange-400 text-[#181007]'
                    : 'bg-orange-400/10 text-orange-300'
                }`}
              >
                <Heart
                  size={14}
                  fill={
                    post.isLiked
                      ? 'currentColor'
                      : 'none'
                  }
                />

                Amen ({post.likes})
              </button>
            </article>
          )
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 rounded-3xl border border-white/5 bg-[#12202b] p-5"
      >
        <label
          htmlFor="discussion-message"
          className="text-sm font-semibold"
        >
          What stood out?
        </label>

        <textarea
          id="discussion-message"
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          rows={3}
          maxLength={280}
          placeholder={`Share one short thought from ${mockChapter.reference}`}
          className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
        />

        <div className="mt-2 text-right text-xs text-slate-600">
          {message.length}/280
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-[#06111b] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={18} />
          Share
        </button>
      </form>

      {deletePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#12202b] p-6 shadow-2xl">
            <h2 className="text-xl font-bold">
              Delete this post?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              This cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletePostId(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300"
              >
                Keep post
              </button>

              <button
                type="button"
                onClick={confirmDeletePost}
                className="flex-1 rounded-xl bg-red-400 px-4 py-3 text-sm font-bold text-[#210b0b]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscussionRoom