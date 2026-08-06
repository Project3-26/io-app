import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  Heart,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

import DiscussionRoom from './DiscussionRoom'
import PrayerRoom from './PrayerRoom'

const STORAGE_KEY = 'project326-villas-announcements'

const mockUser = {
  name: 'Brian Cooper',
  role: 'church-admin',
}

const initialAnnouncements = [
  {
    id: 1,
    title: 'Sunday Worship',
    date: 'This Sunday · 10:00 AM',
    message:
      'Join us for worship and the next message in our current series.',
    author: 'Villas Church',
  },
  {
    id: 2,
    title: 'Community Dinner',
    date: 'Wednesday · 6:30 PM',
    message:
      'Bring your family and join us for dinner and fellowship.',
    author: 'Villas Church',
  },
]

function getSavedAnnouncements() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    return saved
      ? JSON.parse(saved)
      : initialAnnouncements
  } catch {
    return initialAnnouncements
  }
}

function ChurchRoom() {
  const [activeSection, setActiveSection] = useState(null)

  const [announcements, setAnnouncements] = useState(
    getSavedAnnouncements,
  )

  const [showAnnouncementForm, setShowAnnouncementForm] =
    useState(false)

  const [deleteAnnouncementId, setDeleteAnnouncementId] =
    useState(null)

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    date: '',
    message: '',
  })

  const isChurchAdmin =
    mockUser.role === 'church-admin'

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(announcements),
    )
  }, [announcements])

  function submitAnnouncement(event) {
    event.preventDefault()

    const title = announcementForm.title.trim()
    const date = announcementForm.date.trim()
    const message = announcementForm.message.trim()

    if (!title || !date || !message) {
      return
    }

    const newAnnouncement = {
      id: Date.now(),
      title,
      date,
      message,
      author: mockUser.name,
    }

    setAnnouncements((current) => [
      newAnnouncement,
      ...current,
    ])

    setAnnouncementForm({
      title: '',
      date: '',
      message: '',
    })

    setShowAnnouncementForm(false)
  }

  function confirmDeleteAnnouncement() {
    setAnnouncements((current) =>
      current.filter(
        (announcement) =>
          announcement.id !== deleteAnnouncementId,
      ),
    )

    setDeleteAnnouncementId(null)
  }

  function BackButton() {
    return (
      <button
        type="button"
        onClick={() => setActiveSection(null)}
        className="mb-5 flex items-center gap-2 text-sm font-semibold text-orange-300"
      >
        <ArrowLeft size={17} />
        Villas Church
      </button>
    )
  }

  if (activeSection === 'announcements') {
    return (
      <div>
        <BackButton />

        <section className="rounded-3xl border border-orange-400/15 bg-orange-400/[0.06] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
              <Bell size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold">
                Announcements
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Important updates from Villas Church.
              </p>
            </div>
          </div>

          {isChurchAdmin && (
            <button
              type="button"
              onClick={() =>
                setShowAnnouncementForm(
                  (current) => !current,
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-3 text-sm font-bold text-[#181007]"
            >
              {showAnnouncementForm ? (
                <X size={18} />
              ) : (
                <Plus size={18} />
              )}

              {showAnnouncementForm
                ? 'Close Form'
                : 'Create Announcement'}
            </button>
          )}
        </section>

        {showAnnouncementForm && isChurchAdmin && (
          <form
            onSubmit={submitAnnouncement}
            className="mt-4 rounded-3xl border border-white/5 bg-[#12202b] p-5"
          >
            <label
              htmlFor="announcement-title"
              className="text-xs font-bold uppercase tracking-widest text-orange-300"
            >
              Title
            </label>

            <input
              id="announcement-title"
              value={announcementForm.title}
              onChange={(event) =>
                setAnnouncementForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              maxLength={100}
              placeholder="Announcement title"
              className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
            />

            <label
              htmlFor="announcement-date"
              className="mt-4 block text-xs font-bold uppercase tracking-widest text-orange-300"
            >
              Date or time
            </label>

            <input
              id="announcement-date"
              value={announcementForm.date}
              onChange={(event) =>
                setAnnouncementForm((current) => ({
                  ...current,
                  date: event.target.value,
                }))
              }
              maxLength={100}
              placeholder="Example: Sunday · 10:00 AM"
              className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
            />

            <label
              htmlFor="announcement-message"
              className="mt-4 block text-xs font-bold uppercase tracking-widest text-orange-300"
            >
              Message
            </label>

            <textarea
              id="announcement-message"
              value={announcementForm.message}
              onChange={(event) =>
                setAnnouncementForm((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
              rows={4}
              maxLength={500}
              placeholder="Share the important details"
              className="mt-2 w-full resize-none rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAnnouncementForm(false)

                  setAnnouncementForm({
                    title: '',
                    date: '',
                    message: '',
                  })
                }}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  !announcementForm.title.trim() ||
                  !announcementForm.date.trim() ||
                  !announcementForm.message.trim()
                }
                className="flex-1 rounded-xl bg-orange-400 px-4 py-3 text-sm font-bold text-[#181007] disabled:opacity-40"
              >
                Publish
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 space-y-4">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="rounded-3xl border border-white/5 bg-[#12202b] p-5"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-orange-300">
                    <Calendar size={14} />
                    {announcement.date}
                  </div>

                  <h3 className="mt-3 font-semibold">
                    {announcement.title}
                  </h3>
                </div>

                {isChurchAdmin && (
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteAnnouncementId(
                        announcement.id,
                      )
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-red-400/[0.08] hover:text-red-300"
                    aria-label="Delete announcement"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {announcement.message}
              </p>

              <p className="mt-4 text-xs text-slate-600">
                Posted by {announcement.author}
              </p>
            </article>
          ))}

          {announcements.length === 0 && (
            <div className="rounded-3xl border border-white/5 bg-[#12202b] p-6 text-center">
              <p className="text-sm text-slate-500">
                No announcements right now.
              </p>
            </div>
          )}
        </div>

        {deleteAnnouncementId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#12202b] p-6 shadow-2xl">
              <h2 className="text-xl font-bold">
                Delete this announcement?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                This cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteAnnouncementId(null)
                  }
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300"
                >
                  Keep
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteAnnouncement}
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

  if (activeSection === 'discussion') {
    return (
      <div>
        <BackButton />
        <DiscussionRoom />
      </div>
    )
  }

  if (activeSection === 'prayer') {
    return (
      <div>
        <BackButton />
        <PrayerRoom />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-orange-400/15 bg-orange-400/[0.06] p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-300">
          Villas Church
        </p>

        <h2 className="mt-2 text-xl font-bold">
          Your church community
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Stay connected around Scripture, prayer, and church life.
        </p>
      </section>

      <button
        type="button"
        onClick={() =>
          setActiveSection('announcements')
        }
        className="flex w-full items-start gap-4 rounded-3xl border border-white/5 bg-[#12202b] p-5 text-left transition hover:border-orange-400/20 active:scale-[0.99]"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
          <Bell size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">
            Announcements
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Important updates from Villas Church.
          </p>

          {announcements.length > 0 && (
            <p className="mt-2 text-xs text-orange-300">
              {announcements.length}{' '}
              {announcements.length === 1
                ? 'announcement'
                : 'announcements'}
            </p>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={() => setActiveSection('discussion')}
        className="flex w-full items-start gap-4 rounded-3xl border border-white/5 bg-[#12202b] p-5 text-left transition hover:border-cyan-400/20 active:scale-[0.99]"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <BookOpen size={20} />
        </div>

        <div>
          <h3 className="font-semibold">
            This Week’s Discussion
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Talk about what God is teaching you.
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => setActiveSection('prayer')}
        className="flex w-full items-start gap-4 rounded-3xl border border-white/5 bg-[#12202b] p-5 text-left transition hover:border-purple-400/20 active:scale-[0.99]"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
          <Heart size={20} />
        </div>

        <div>
          <h3 className="font-semibold">
            Church Prayer
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Pray with your church family.
          </p>
        </div>
      </button>
    </div>
  )
}

export default ChurchRoom