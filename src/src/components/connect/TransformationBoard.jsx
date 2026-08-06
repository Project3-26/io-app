import { useEffect, useState } from 'react'
import {
  EyeOff,
  Flag,
  MoreHorizontal,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

const mockUser = {
  name: 'Brian Cooper',
  initials: 'BC',
}

const MAX_LENGTH = 100
const STORAGE_KEY = 'project326-transformations'

const initialTransformations = [
  {
    id: 1,
    name: 'Mia S.',
    initials: 'MS',
    time: '1 hour ago',
    reflection:
      'Wow, God loves me more deeply than I realized.',
    meToo: 18,
    amen: 24,
    praying: 11,
    isMeToo: false,
    isAmen: false,
    isPraying: false,
    reported: false,
    hidden: false,
  },
  {
    id: 2,
    name: 'Caleb R.',
    initials: 'CR',
    time: '3 hours ago',
    reflection: 'Jesus is closer than I thought.',
    meToo: 15,
    amen: 19,
    praying: 8,
    isMeToo: true,
    isAmen: false,
    isPraying: false,
    reported: false,
    hidden: false,
  },
  {
    id: 3,
    name: 'Sarah M.',
    initials: 'SM',
    time: 'Yesterday',
    reflection:
      'I do not have to earn God’s attention.',
    meToo: 31,
    amen: 28,
    praying: 14,
    isMeToo: false,
    isAmen: true,
    isPraying: false,
    reported: false,
    hidden: false,
  },
]

function getSavedTransformations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    const transformations = saved
      ? JSON.parse(saved)
      : initialTransformations

    return transformations.map((item) => ({
      ...item,
      reported: item.reported || false,
      hidden: item.hidden || false,
    }))
  } catch {
    return initialTransformations
  }
}

function TransformationBoard() {
  const [transformations, setTransformations] =
    useState(getSavedTransformations)

  const [showForm, setShowForm] = useState(false)
  const [reflection, setReflection] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [notice, setNotice] = useState('')
  const [deletePostId, setDeletePostId] = useState(null)

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transformations),
    )
  }, [transformations])

  function showNotice(message) {
    setNotice(message)

    window.setTimeout(() => {
      setNotice('')
    }, 3000)
  }

  function submitTransformation(event) {
    event.preventDefault()

    const trimmedReflection = reflection.trim()

    if (!trimmedReflection) {
      return
    }

    const newTransformation = {
      id: Date.now(),
      name: mockUser.name,
      initials: mockUser.initials,
      time: 'Just now',
      reflection: trimmedReflection,
      meToo: 0,
      amen: 0,
      praying: 0,
      isMeToo: false,
      isAmen: false,
      isPraying: false,
      reported: false,
      hidden: false,
    }

    setTransformations((current) => [
      newTransformation,
      ...current,
    ])

    setReflection('')
    setShowForm(false)
  }

  function toggleReaction(id, reaction) {
    setTransformations((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item
        }

        if (reaction === 'meToo') {
          return {
            ...item,
            isMeToo: !item.isMeToo,
            meToo: item.isMeToo
              ? Math.max(item.meToo - 1, 0)
              : item.meToo + 1,
          }
        }

        if (reaction === 'amen') {
          return {
            ...item,
            isAmen: !item.isAmen,
            amen: item.isAmen
              ? Math.max(item.amen - 1, 0)
              : item.amen + 1,
          }
        }

        return {
          ...item,
          isPraying: !item.isPraying,
          praying: item.isPraying
            ? Math.max(item.praying - 1, 0)
            : item.praying + 1,
        }
      }),
    )
  }

  function reportPost(id) {
    setTransformations((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              reported: true,
            }
          : item,
      ),
    )

    setOpenMenuId(null)
    showNotice('This post has been reported for review.')
  }

  function hidePost(id) {
    setTransformations((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              hidden: true,
            }
          : item,
      ),
    )

    setOpenMenuId(null)
    showNotice('Post hidden.')
  }

  function confirmDeletePost() {
    setTransformations((current) =>
      current.filter((item) => item.id !== deletePostId),
    )

    setDeletePostId(null)
    setOpenMenuId(null)
    showNotice('Transformation post deleted.')
  }

  const visibleTransformations = transformations.filter(
    (item) => !item.hidden,
  )

  return (
    <div>
      <section className="rounded-3xl border border-orange-400/15 bg-gradient-to-br from-orange-400/[0.08] to-transparent p-5 shadow-xl shadow-black/20">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
            <Sparkles size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
              Transformation Board
            </p>

            <h2 className="mt-2 text-xl font-bold">
              What changed in you?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Share one short truth, realization, or moment
              that stayed with you.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm((current) => !current)
          }
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3 text-sm font-bold text-[#181007]"
        >
          {showForm ? (
            <X size={18} />
          ) : (
            <Plus size={18} />
          )}

          {showForm
            ? 'Close'
            : 'Share What Changed'}
        </button>
      </section>

      {notice && (
        <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submitTransformation}
          className="mt-4 rounded-3xl border border-white/5 bg-[#12202b] p-5"
        >
          <label
            htmlFor="transformation-reflection"
            className="text-xs font-bold uppercase tracking-widest text-orange-300"
          >
            What changed in me
          </label>

          <textarea
            id="transformation-reflection"
            value={reflection}
            onChange={(event) =>
              setReflection(
                event.target.value.slice(
                  0,
                  MAX_LENGTH,
                ),
              )
            }
            rows={3}
            maxLength={MAX_LENGTH}
            placeholder="Example: Wow, God really loves me."
            className="mt-2 w-full resize-none rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none"
          />

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Keep it simple and honest.
            </p>

            <p className="text-xs text-slate-600">
              {reflection.length}/{MAX_LENGTH}
            </p>
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
              disabled={!reflection.trim()}
              className="flex-1 rounded-xl bg-orange-400 px-4 py-3 text-sm font-bold text-[#181007] disabled:opacity-40"
            >
              Share
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-4">
        {visibleTransformations.map((item) => {
          const isOwner = item.name === mockUser.name

          return (
            <article
              key={item.id}
              className="rounded-3xl border border-orange-400/10 bg-[#12202b] p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs font-bold text-orange-200">
                  {item.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {item.time}
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === item.id
                          ? null
                          : item.id,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-white/[0.04] hover:text-white"
                    aria-label="Transformation post options"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenuId === item.id && (
                    <div className="absolute right-0 top-11 z-30 min-w-44 rounded-2xl border border-white/10 bg-[#182630] p-2 shadow-2xl">
                      {isOwner ? (
                        <button
                          type="button"
                          onClick={() => {
                            setDeletePostId(item.id)
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
                              reportPost(item.id)
                            }
                            disabled={item.reported}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 hover:bg-white/[0.05] disabled:opacity-40"
                          >
                            <Flag size={16} />

                            {item.reported
                              ? 'Reported'
                              : 'Report post'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              hidePost(item.id)
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 hover:bg-white/[0.05]"
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

              <div className="mt-4 rounded-2xl border border-orange-400/10 bg-orange-400/[0.05] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-300">
                  What changed in me
                </p>

                <p className="mt-3 text-lg font-medium leading-7 text-white">
                  {item.reflection}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    toggleReaction(item.id, 'meToo')
                  }
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                    item.isMeToo
                      ? 'bg-orange-400 text-[#181007]'
                      : 'bg-orange-400/10 text-orange-300'
                  }`}
                >
                  Me Too ({item.meToo})
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleReaction(item.id, 'amen')
                  }
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                    item.isAmen
                      ? 'bg-cyan-400 text-[#041326]'
                      : 'bg-cyan-400/10 text-cyan-300'
                  }`}
                >
                  Amen ({item.amen})
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleReaction(item.id, 'praying')
                  }
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                    item.isPraying
                      ? 'bg-cyan-400 text-[#170d20]'
                      : 'bg-cyan-400/10 text-cyan-300'
                  }`}
                >
                  Praying ({item.praying})
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {deletePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#12202b] p-6 shadow-2xl">
            <h2 className="text-xl font-bold">
              Delete this transformation post?
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

export default TransformationBoard