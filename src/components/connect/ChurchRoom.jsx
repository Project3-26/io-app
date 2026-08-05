import { useState } from 'react'
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  Heart,
} from 'lucide-react'

import DiscussionRoom from './DiscussionRoom'
import PrayerRoom from './PrayerRoom'

const announcements = [
  {
    id: 1,
    title: 'Sunday Worship',
    date: 'This Sunday · 10:00 AM',
    message:
      'Join us for worship and the next message in our current series.',
  },
  {
    id: 2,
    title: 'Community Dinner',
    date: 'Wednesday · 6:30 PM',
    message:
      'Bring your family and join us for dinner and fellowship.',
  },
]

function ChurchRoom() {
  const [activeSection, setActiveSection] = useState(null)

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
          <Bell size={24} className="text-orange-300" />

          <h2 className="mt-4 text-xl font-bold">
            Announcements
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Important updates from Villas Church.
          </p>
        </section>

        <div className="mt-5 space-y-4">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="rounded-3xl border border-white/5 bg-[#12202b] p-5"
            >
              <div className="flex items-center gap-2 text-xs text-orange-300">
                <Calendar size={14} />
                {announcement.date}
              </div>

              <h3 className="mt-3 font-semibold">
                {announcement.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {announcement.message}
              </p>
            </article>
          ))}
        </div>
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
        onClick={() => setActiveSection('announcements')}
        className="flex w-full items-start gap-4 rounded-3xl border border-white/5 bg-[#12202b] p-5 text-left transition hover:border-orange-400/20 active:scale-[0.99]"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
          <Bell size={20} />
        </div>

        <div>
          <h3 className="font-semibold">
            Announcements
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Important updates from Villas Church.
          </p>
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