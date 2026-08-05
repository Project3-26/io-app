import { useEffect, useState } from 'react'
import {
  MoreHorizontal,
  Plus,
  Sparkles,
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
  },
]

function getSavedTransformations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    return saved
      ? JSON.parse(saved)
      : initialTransformations
  } catch {
    return initialTransformations
  }
}

function TransformationBoard() {
  const [transformations, setTransformations] =
    useState(getSavedTransformations)

  const [showForm, setShowForm] = useState(false)
  const [reflection, setReflection] = useState('')

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transformations),
    )
  }, [transformations])

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
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3 text-sm font-bold text-[#181007] transition hover:bg-orange-300 active:scale-[0.99]"
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

      {showForm && (
        <form
          onSubmit={submitTransformation}
          className="mt-4 rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-xl shadow-black/20"
        >
          <label
            htmlFor="transformation-reflection"
            className="text-xs font-bold uppercase tracking-[0.12em] text-orange-300"
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
            className="mt-2 w-full resize-none rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-orange-400/30"
          />

          <div className="mt-2 flex items-center justify-between gap-3">
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
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!reflection.trim()}
              className="flex-1 rounded-xl bg-orange-400 px-4 py-3 text-sm font-bold text-[#181007] transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Share
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-4">
        {transformations.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-orange-400/10 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-xl shadow-black/20"
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

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.04] hover:text-white"
                aria-label="Transformation post options"
              >
                <MoreHorizontal size={18} />
              </button>
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
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  item.isMeToo
                    ? 'bg-orange-400 text-[#181007]'
                    : 'bg-orange-400/10 text-orange-300 hover:bg-orange-400/15'
                }`}
              >
                Me Too ({item.meToo})
              </button>

              <button
                type="button"
                onClick={() =>
                  toggleReaction(item.id, 'amen')
                }
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  item.isAmen
                    ? 'bg-cyan-400 text-[#06111b]'
                    : 'bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/15'
                }`}
              >
                Amen ({item.amen})
              </button>

              <button
                type="button"
                onClick={() =>
                  toggleReaction(item.id, 'praying')
                }
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  item.isPraying
                    ? 'bg-purple-400 text-[#170d20]'
                    : 'bg-purple-400/10 text-purple-300 hover:bg-purple-400/15'
                }`}
              >
                Praying ({item.praying})
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default TransformationBoard