import { useEffect, useState } from 'react'
import {
  Check,
  Heart,
  MoreHorizontal,
  Plus,
  X,
} from 'lucide-react'

const mockUser = {
  name: 'Brian Cooper',
  initials: 'BC',
}

const initialPrayers = [
  {
    id: 1,
    name: 'Sarah M.',
    initials: 'SM',
    time: '2 hours ago',
    title: 'Please pray for my daughter’s surgery',
    details:
      'She has surgery Thursday morning. Please pray for peace, a smooth procedure, and a quick recovery.',
    category: 'Health',
    status: 'active',
    praying: 12,
    isPraying: false,
    replies: 4,
  },
  {
    id: 2,
    name: 'James T.',
    initials: 'JT',
    time: 'Yesterday',
    title: 'Prayer for my job transition',
    details:
      'I received the job offer today. Thank you for praying with me through this season.',
    category: 'Work',
    status: 'answered',
    praying: 18,
    isPraying: true,
    replies: 6,
  },
]

function getSavedPrayers() {
  try {
    const savedPrayers = localStorage.getItem(
      'project326-prayer-requests',
    )

    return savedPrayers
      ? JSON.parse(savedPrayers)
      : initialPrayers
  } catch {
    return initialPrayers
  }
}

function PrayerRoom() {
  const [prayers, setPrayers] = useState(getSavedPrayers)
  const [showPrayerForm, setShowPrayerForm] =
    useState(false)

  const [prayerForm, setPrayerForm] = useState({
    title: '',
    details: '',
    category: 'General',
  })

  useEffect(() => {
    localStorage.setItem(
      'project326-prayer-requests',
      JSON.stringify(prayers),
    )
  }, [prayers])

  function submitPrayer(event) {
    event.preventDefault()

    const title = prayerForm.title.trim()
    const details = prayerForm.details.trim()

    if (!title || !details) {
      return
    }

    const newPrayer = {
      id: Date.now(),
      name: mockUser.name,
      initials: mockUser.initials,
      time: 'Just now',
      title,
      details,
      category: prayerForm.category,
      status: 'active',
      praying: 0,
      isPraying: false,
      replies: 0,
    }

    setPrayers((currentPrayers) => [
      newPrayer,
      ...currentPrayers,
    ])

    setPrayerForm({
      title: '',
      details: '',
      category: 'General',
    })

    setShowPrayerForm(false)
  }

  function togglePrayer(prayerId) {
    setPrayers((currentPrayers) =>
      currentPrayers.map((prayer) => {
        if (prayer.id !== prayerId) {
          return prayer
        }

        return {
          ...prayer,
          isPraying: !prayer.isPraying,
          praying: prayer.isPraying
            ? Math.max(prayer.praying - 1, 0)
            : prayer.praying + 1,
        }
      }),
    )
  }

  function markPrayerAnswered(prayerId) {
    setPrayers((currentPrayers) =>
      currentPrayers.map((prayer) => {
        if (prayer.id !== prayerId) {
          return prayer
        }

        return {
          ...prayer,
          status: 'answered',
        }
      }),
    )
  }

  return (
    <div>
      <section className="rounded-3xl border border-purple-400/15 bg-gradient-to-br from-purple-400/[0.08] to-transparent p-5 shadow-xl shadow-black/20">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
            <Heart size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">
              Prayer Room
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Pray for one another
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Share a request and allow others to stand with you
              in prayer.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowPrayerForm((current) => !current)
          }
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-400 px-4 py-3 text-sm font-bold text-[#170d20] transition hover:bg-purple-300 active:scale-[0.99]"
        >
          {showPrayerForm ? (
            <X size={18} />
          ) : (
            <Plus size={18} />
          )}

          {showPrayerForm
            ? 'Close Form'
            : 'Share a Prayer Request'}
        </button>
      </section>

      {showPrayerForm && (
        <form
          onSubmit={submitPrayer}
          className="mt-4 rounded-3xl border border-white/5 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-xl shadow-black/20"
        >
          <label
            htmlFor="prayer-title"
            className="text-xs font-bold uppercase tracking-[0.12em] text-purple-300"
          >
            Prayer request
          </label>

          <input
            id="prayer-title"
            value={prayerForm.title}
            onChange={(event) =>
              setPrayerForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            maxLength={100}
            placeholder="Give your request a short title"
            className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-400/30"
          />

          <label
            htmlFor="prayer-details"
            className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-purple-300"
          >
            Details
          </label>

          <textarea
            id="prayer-details"
            value={prayerForm.details}
            onChange={(event) =>
              setPrayerForm((current) => ({
                ...current,
                details: event.target.value,
              }))
            }
            rows={4}
            maxLength={500}
            placeholder="Share only what you are comfortable sharing"
            className="mt-2 w-full resize-none rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-purple-400/30"
          />

          <label
            htmlFor="prayer-category"
            className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-purple-300"
          >
            Category
          </label>

          <select
            id="prayer-category"
            value={prayerForm.category}
            onChange={(event) =>
              setPrayerForm((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-white/5 bg-[#101c26] px-4 py-3 text-sm text-white outline-none focus:border-purple-400/30"
          >
            <option>General</option>
            <option>Health</option>
            <option>Family</option>
            <option>Work</option>
            <option>Grief</option>
            <option>Church</option>
          </select>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setShowPrayerForm(false)}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !prayerForm.title.trim() ||
                !prayerForm.details.trim()
              }
              className="flex-1 rounded-xl bg-purple-400 px-4 py-3 text-sm font-bold text-[#170d20] transition hover:bg-purple-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Post Request
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-4">
        {prayers.map((prayer) => {
          const isAnswered =
            prayer.status === 'answered'

          const isOwner =
            prayer.name === mockUser.name

          return (
            <article
              key={prayer.id}
              className="rounded-3xl border border-purple-400/10 bg-gradient-to-br from-[#15222d] to-[#0d1821] p-5 shadow-xl shadow-black/20"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-400/10 text-xs font-bold text-purple-200">
                  {prayer.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {prayer.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {prayer.time}
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.04] hover:text-white"
                  aria-label="Prayer request options"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                  {prayer.category}
                </span>

                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    isAnswered
                      ? 'bg-green-400/10 text-green-300'
                      : 'bg-purple-400/10 text-purple-300'
                  }`}
                >
                  {isAnswered && <Check size={11} />}

                  {isAnswered ? 'Answered' : 'Active'}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                {prayer.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {prayer.details}
              </p>

              <div className="mt-5 rounded-2xl border border-white/5 bg-black/10 p-3">
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-purple-300">
                    {prayer.praying}
                  </span>{' '}
                  {isAnswered
                    ? 'people prayed with this request'
                    : 'people are praying'}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => togglePrayer(prayer.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                    prayer.isPraying
                      ? 'bg-purple-400 text-[#170d20]'
                      : 'bg-purple-400/10 text-purple-300 hover:bg-purple-400/15'
                  }`}
                >
                  <Heart
                    size={14}
                    fill={
                      prayer.isPraying
                        ? 'currentColor'
                        : 'none'
                    }
                  />

                  {isAnswered
                    ? 'Praise God'
                    : 'I’m Praying'}
                </button>

                <button
                  type="button"
                  className="rounded-xl bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-white"
                >
                  Encourage ({prayer.replies})
                </button>

                {!isAnswered && isOwner && (
                  <button
                    type="button"
                    onClick={() =>
                      markPrayerAnswered(prayer.id)
                    }
                    className="rounded-xl bg-green-400/10 px-3 py-2 text-xs font-semibold text-green-300 transition hover:bg-green-400/15"
                  >
                    Mark Answered
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default PrayerRoom