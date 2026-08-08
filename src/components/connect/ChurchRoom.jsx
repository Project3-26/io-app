import { useEffect, useState } from 'react'
import {
  Bell,
  Calendar,
  Heart,
  MessageCircle,
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
    message: 'Join us for worship and the next message in our current series.',
    author: 'Villas Church',
  },
  {
    id: 2,
    title: 'Community Dinner',
    date: 'Wednesday · 6:30 PM',
    message: 'Bring your family and join us for dinner and fellowship.',
    author: 'Villas Church',
  },
]

const churchDiscussionPosts = [
  {
    id: 101,
    name: 'Sarah M.',
    message: 'Looking forward to seeing everyone Sunday. What has God been teaching you this week?',
    timestamp: '8:42 AM',
    reactions: { '❤️': 3, '🙏': 2 },
    myReactions: [],
    reported: false,
    hidden: false,
  },
  {
    id: 102,
    name: 'James T.',
    message: 'The message about being present with people has stayed with me all week.',
    timestamp: '9:06 AM',
    reactions: { '👍': 2 },
    myReactions: [],
    reported: false,
    hidden: false,
  },
]

function getSavedAnnouncements() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialAnnouncements
  } catch {
    return initialAnnouncements
  }
}

function ChurchRoom() {
  const [activeTab, setActiveTab] = useState('discussion')
  const [announcements, setAnnouncements] = useState(getSavedAnnouncements)
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [deleteAnnouncementId, setDeleteAnnouncementId] = useState(null)
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    date: '',
    message: '',
  })

  const isChurchAdmin = mockUser.role === 'church-admin'

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements))
  }, [announcements])

  function submitAnnouncement(event) {
    event.preventDefault()
    const title = announcementForm.title.trim()
    const date = announcementForm.date.trim()
    const message = announcementForm.message.trim()
    if (!title || !date || !message) return

    setAnnouncements((current) => [
      {
        id: Date.now(),
        title,
        date,
        message,
        author: mockUser.name,
      },
      ...current,
    ])

    setAnnouncementForm({ title: '', date: '', message: '' })
    setShowAnnouncementForm(false)
  }

  function confirmDeleteAnnouncement() {
    setAnnouncements((current) =>
      current.filter((announcement) => announcement.id !== deleteAnnouncementId),
    )
    setDeleteAnnouncementId(null)
  }

  const tabs = [
    { id: 'discussion', label: 'Discussion', icon: MessageCircle },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'prayer', label: 'Church Prayer', icon: Heart },
  ]

  return (
    <div>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex h-9 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition ${
                active
                  ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-200'
                  : 'border-white/10 bg-[#0c2138] text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'discussion' && (
        <DiscussionRoom
          storageKey="project326-villas-discussion"
          prompt="Message your church family…"
          contextLabel="Villas Church chat"
          contextPrompts={['Share life', 'Encourage someone', 'Stay connected']}
          startingPosts={churchDiscussionPosts}
        />
      )}

      {activeTab === 'announcements' && (
        <div className="pb-8">
          <section className="rounded-[24px] border border-orange-300/25 bg-[#e8ddd0] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-200/70 text-orange-600">
                  <Bell size={19} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">
                    Villas Church
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">Announcements</h2>
                </div>
              </div>

              {isChurchAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAnnouncementForm((current) => !current)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white"
                  aria-label="Create announcement"
                >
                  {showAnnouncementForm ? <X size={17} /> : <Plus size={17} />}
                </button>
              )}
            </div>
          </section>

          {showAnnouncementForm && isChurchAdmin && (
            <form onSubmit={submitAnnouncement} className="mt-3 rounded-[24px] border border-white/10 bg-[#0c2138] p-4 sm:p-5">
              <input
                value={announcementForm.title}
                onChange={(event) => setAnnouncementForm((current) => ({ ...current, title: event.target.value }))}
                maxLength={100}
                placeholder="Announcement title"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none"
              />
              <input
                value={announcementForm.date}
                onChange={(event) => setAnnouncementForm((current) => ({ ...current, date: event.target.value }))}
                maxLength={100}
                placeholder="Date or time"
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none"
              />
              <textarea
                value={announcementForm.message}
                onChange={(event) => setAnnouncementForm((current) => ({ ...current, message: event.target.value }))}
                rows={4}
                maxLength={500}
                placeholder="Share the important details"
                className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-white outline-none"
              />
              <div className="mt-3 flex gap-3">
                <button type="button" onClick={() => setShowAnnouncementForm(false)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white">
                  Publish
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 space-y-3">
            {announcements.map((announcement) => (
              <article key={announcement.id} className="rounded-[22px] border border-white/10 bg-[#0c2138] p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-orange-300">
                      <Calendar size={13} />
                      {announcement.date}
                    </div>
                    <h3 className="mt-2 font-semibold">{announcement.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{announcement.message}</p>
                    <p className="mt-3 text-xs text-slate-600">Posted by {announcement.author}</p>
                  </div>
                  {isChurchAdmin && (
                    <button type="button" onClick={() => setDeleteAnnouncementId(announcement.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:text-red-300" aria-label="Delete announcement">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'prayer' && <PrayerRoom />}

      {deleteAnnouncementId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#12202b] p-6 shadow-2xl">
            <h2 className="text-xl font-bold">Delete this announcement?</h2>
            <p className="mt-3 text-sm text-slate-400">This cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setDeleteAnnouncementId(null)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300">Keep</button>
              <button type="button" onClick={confirmDeleteAnnouncement} className="flex-1 rounded-xl bg-red-400 px-4 py-3 text-sm font-bold text-[#210b0b]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChurchRoom