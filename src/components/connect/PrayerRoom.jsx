import { useEffect, useState } from 'react'
import {
  Check,
  ChevronDown,
  EyeOff,
  Flag,
  Heart,
  MoreHorizontal,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

const mockUser = {
  name: 'Brian Cooper',
  initials: 'BC',
}

const STORAGE_KEY = 'project326-prayer-requests'

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
    encouragements: {
      prayingWithYou: 6,
      notAlone: 3,
      thankYou: 4,
      praiseGod: 0,
    },
    selectedEncouragement: null,
    reported: false,
    hidden: false,
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
    encouragements: {
      prayingWithYou: 0,
      notAlone: 0,
      thankYou: 0,
      praiseGod: 14,
    },
    selectedEncouragement: null,
    reported: false,
    hidden: false,
  },
]

function normalizePrayer(prayer) {
  return {
    ...prayer,
    encouragements: {
      prayingWithYou:
        prayer.encouragements?.prayingWithYou || 0,
      notAlone:
        prayer.encouragements?.notAlone || 0,
      thankYou:
        prayer.encouragements?.thankYou || 0,
      praiseGod:
        prayer.encouragements?.praiseGod || 0,
    },
    selectedEncouragement:
      prayer.selectedEncouragement || null,
    reported: prayer.reported || false,
    hidden: prayer.hidden || false,
  }
}

function getSavedPrayers() {
  try {
    const savedPrayers = localStorage.getItem(STORAGE_KEY)

    const prayers = savedPrayers
      ? JSON.parse(savedPrayers)
      : initialPrayers

    return prayers.map(normalizePrayer)
  } catch {
    return initialPrayers
  }
}

function PrayerRoom() {
  const [prayers, setPrayers] = useState(getSavedPrayers)
  const [showPrayerForm, setShowPrayerForm] =
    useState(false)

  const [openEncouragementId, setOpenEncouragementId] =
    useState(null)

  const [openMenuId, setOpenMenuId] = useState(null)
  const [notice, setNotice] = useState('')
  const [deletePrayerId, setDeletePrayerId] =
    useState(null)

  const [prayerForm, setPrayerForm] = useState({
    title: '',
    details: '',
    category: 'General',
  })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(prayers),
    )
  }, [prayers])

  function showNotice(message) {
    setNotice(message)

    window.setTimeout(() => {
      setNotice('')
    }, 3000)
  }

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
      encouragements: {
        prayingWithYou: 0,
        notAlone: 0,
        thankYou: 0,
        praiseGod: 0,
      },
      selectedEncouragement: null,
      reported: false,
      hidden: false,
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

  function chooseEncouragement(prayerId, optionId) {
    setPrayers((currentPrayers) =>
      currentPrayers.map((prayer) => {
        if (prayer.id !== prayerId) {
          return prayer
        }

        const previous =
          prayer.selectedEncouragement

        const encouragements = {
          ...prayer.encouragements,
        }

        if (previous) {
          encouragements[previous] = Math.max(
            encouragements[previous] - 1,
            0,
          )
        }

        if (previous === optionId) {
          return {
            ...prayer,
            encouragements,
            selectedEncouragement: null,
          }
        }

        encouragements[optionId] += 1

        return {
          ...prayer,
          encouragements,
          selectedEncouragement: optionId,
        }
      }),
    )

    setOpenEncouragementId(null)
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
          selectedEncouragement: null,
        }
      }),
    )
  }

  function reportPrayer(prayerId) {
    setPrayers((currentPrayers) =>
      currentPrayers.map((prayer) =>
        prayer.id === prayerId
          ? {
              ...prayer,
              reported: true,
            }
          : prayer,
      ),
    )

    setOpenMenuId(null)
    showNotice(
      'This prayer request has been reported for review.',
    )
  }

  function hidePrayer(prayerId) {
    setPrayers((currentPrayers) =>
      currentPrayers.map((prayer) =>
        prayer.id === prayerId
          ? {
              ...prayer,
              hidden: true,
            }
          : prayer,
      ),
    )

    setOpenMenuId(null)
    showNotice('Prayer request hidden.')
  }

  function confirmDeletePrayer() {
    setPrayers((currentPrayers) =>
      currentPrayers.filter(
        (prayer) => prayer.id !== deletePrayerId,
      ),
    )

    setDeletePrayerId(null)
    setOpenMenuId(null)
    showNotice('Prayer request deleted.')
  }

  const visiblePrayers = prayers.filter(
    (prayer) => !prayer.hidden,
  )

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
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-400 px-4 py-3 text-sm font-bold text-[#170d20]"
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

      {notice && (
        <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4 text-sm text-cyan-200">
          {notice}
        </div>
      )}

      {showPrayerForm && (
        <form
          onSubmit={submitPrayer}
          className="mt-4 rounded-3xl border border-white/5 bg-[#12202b] p-5"
        >
          <label
            htmlFor="prayer-title"
            className="text-xs font-bold uppercase tracking-widest text-purple-300"
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
            className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
          />

          <label
            htmlFor="prayer-details"
            className="mt-4 block text-xs font-bold uppercase tracking-widest text-purple-300"
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
            className="mt-2 w-full resize-none rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none"
          />

          <label
            htmlFor="prayer-category"
            className="mt-4 block text-xs font-bold uppercase tracking-widest text-purple-300"
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
            <button
              type="button"
              onClick={() => setShowPrayerForm(false)}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !prayerForm.title.trim() ||
                !prayerForm.details.trim()
              }
              className="flex-1 rounded-xl bg-purple-400 px-4 py-3 text-sm font-bold text-[#170d20] disabled:opacity-40"
            >
              Post Request
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-4">
        {visiblePrayers.map((prayer) => {
          const isAnswered =
            prayer.status === 'answered'

          const isOwner =
            prayer.name === mockUser.name

          const options = isAnswered
            ? [
                {
                  id: 'praiseGod',
                  label: '🎉 Praise God',
                },
              ]
            : [
                {
                  id: 'prayingWithYou',
                  label: '🙏 Praying with you',
                },
                {
                  id: 'notAlone',
                  label: '🤍 You’re not alone',
                },
                {
                  id: 'thankYou',
                  label: '🙌 Thank you for sharing',
                },
              ]

          const selectedOption = options.find(
            (option) =>
              option.id ===
              prayer.selectedEncouragement,
          )

          const totalEncouragements = Object.values(
            prayer.encouragements,
          ).reduce((total, count) => total + count, 0)

          return (
            <article
              key={prayer.id}
              className="rounded-3xl border border-purple-400/10 bg-[#12202b] p-5"
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

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === prayer.id
                          ? null
                          : prayer.id,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.04] hover:text-white"
                    aria-label="Prayer request options"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenuId === prayer.id && (
                    <div className="absolute right-0 top-11 z-30 min-w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#182630] p-2 shadow-2xl">
                      {isOwner ? (
                        <button
                          type="button"
                          onClick={() => {
                            setDeletePrayerId(prayer.id)
                            setOpenMenuId(null)
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-300 transition hover:bg-red-400/[0.08]"
                        >
                          <Trash2 size={16} />
                          Delete request
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              reportPrayer(prayer.id)
                            }
                            disabled={prayer.reported}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-40"
                          >
                            <Flag size={16} />

                            {prayer.reported
                              ? 'Reported'
                              : 'Report post'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              hidePrayer(prayer.id)
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

              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] text-slate-400">
                  {prayer.category}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    isAnswered
                      ? 'bg-green-400/10 text-green-300'
                      : 'bg-purple-400/10 text-purple-300'
                  }`}
                >
                  {isAnswered ? 'Answered' : 'Active'}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                {prayer.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {prayer.details}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => togglePrayer(prayer.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                    prayer.isPraying
                      ? 'bg-purple-400 text-[#170d20]'
                      : 'bg-purple-400/10 text-purple-300'
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

                  I’m Praying ({prayer.praying})
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenEncouragementId(
                        openEncouragementId === prayer.id
                          ? null
                          : prayer.id,
                      )
                    }
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                      selectedOption
                        ? 'bg-cyan-400 text-[#06111b]'
                        : 'bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    {selectedOption
                      ? selectedOption.label
                      : `Encourage (${totalEncouragements})`}

                    <ChevronDown size={14} />
                  </button>

                  {openEncouragementId === prayer.id && (
                    <div className="absolute bottom-full left-0 z-20 mb-2 min-w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#182630] p-2 shadow-2xl">
                      {options.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            chooseEncouragement(
                              prayer.id,
                              option.id,
                            )
                          }
                          className={`w-full rounded-xl px-3 py-3 text-left text-sm transition ${
                            prayer.selectedEncouragement ===
                            option.id
                              ? 'bg-cyan-400/15 text-cyan-300'
                              : 'text-slate-300 hover:bg-white/[0.05]'
                          }`}
                        >
                          {option.label}

                          <span className="ml-2 text-xs text-slate-500">
                            {
                              prayer.encouragements[
                                option.id
                              ]
                            }
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isAnswered && isOwner && (
                  <button
                    type="button"
                    onClick={() =>
                      markPrayerAnswered(prayer.id)
                    }
                    className="rounded-xl bg-green-400/10 px-3 py-2 text-xs font-semibold text-green-300"
                  >
                    <Check
                      size={13}
                      className="mr-1 inline"
                    />

                    Mark Answered
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {deletePrayerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#12202b] p-6 shadow-2xl">
            <h2 className="text-xl font-bold">
              Delete this prayer request?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              This cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletePrayerId(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300"
              >
                Keep request
              </button>

              <button
                type="button"
                onClick={confirmDeletePrayer}
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

export default PrayerRoom