import { useEffect, useState } from 'react'
import { Heart, Send } from 'lucide-react'

const startingPosts = [
  {
    id: 1,
    name: 'Sarah M.',
    message:
      'God did not remain distant. The Word became flesh and came near.',
    likes: 8,
    isLiked: false,
  },
  {
    id: 2,
    name: 'Marcus T.',
    message:
      'Jesus is where heaven and earth meet.',
    likes: 5,
    isLiked: false,
  },
]

function DiscussionRoom() {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem(
      'project326-discussion-posts',
    )

    return savedPosts
      ? JSON.parse(savedPosts)
      : startingPosts
  })

  const [message, setMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(
      'project326-discussion-posts',
      JSON.stringify(posts),
    )
  }, [posts])

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
        name: 'Brian Cooper',
        message: newMessage,
        likes: 0,
        isLiked: false,
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
          Share one short thought from John 1.
        </p>
      </section>

      <div className="mt-5 space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-3xl border border-white/5 bg-[#12202b] p-5"
          >
            <p className="text-sm font-semibold">
              {post.name}
            </p>

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
        ))}
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
          placeholder="Share one short thought"
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
    </div>
  )
}

export default DiscussionRoom