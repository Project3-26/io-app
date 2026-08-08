import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Flame,
  Gem,
  Lock,
  Medal,
  Rocket,
  Shield,
  Star,
  Trophy,
  Wrench,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AppNavigation from '../components/AppNavigation'
import { bibleBooks } from '../data/bibleBooks'
import { getBookAvailability } from '../data/contentAvailability'
import {
  openSharedJourneyChapter,
  sharedJourney,
  TOTAL_CYCLE_DAYS,
} from '../data/sharedJourney'
import {
  achievements,
  clearUnseenAchievements,
  getAchievementProgress,
  readEarnedAchievements,
  readUnseenAchievements,
  syncAchievements,
} from '../utils/achievements'
import { calculateCurrentStreak } from '../utils/streak'

const COMPLETED_CHAPTERS_KEY = 'project326-completed-chapters'
const TOTAL_BIBLE_CHAPTERS = 1189

const achievementIcons = {
  'first-step': Star,
  'seven-chapters': Award,
  'thirty-chapters': Rocket,
  'hundred-chapters': Medal,
  'first-book': BookOpen,
  'five-books': Shield,
  'ten-books': Trophy,
  'three-day-streak': Flame,
  'seven-day-streak': Flame,
  'thirty-day-streak': Flame,
  halfway: Medal,
  'finish-bible': Gem,
}

const tierStyles = {
  bronze: {
    label: 'Bronze',
    badge: 'border-orange-700/40 bg-[#b86f42] text-white',
    ring: 'border-[#d99a71] bg-[#c67b4c]',
    text: 'text-[#9a552e]',
    chip: 'border-[#d3a081] bg-[#ead4c6] text-[#8c4e2c]',
  },
  silver: {
    label: 'Silver',
    badge: 'border-slate-400 bg-[#9aa7b0] text-white',
    ring: 'border-[#cbd5db] bg-[#aebac2]',
    text: 'text-slate-600',
    chip: 'border-slate-300 bg-[#dce3e7] text-slate-600',
  },
  gold: {
    label: 'Gold',
    badge: 'border-amber-500/50 bg-[#d79b2e] text-white',
    ring: 'border-[#f0c96b] bg-[#e0aa3e]',
    text: 'text-amber-700',
    chip: 'border-amber-300 bg-[#efe1bb] text-amber-700',
  },
  legendary: {
    label: 'Legendary',
    badge: 'border-orange-300 bg-gradient-to-br from-orange-500 via-amber-400 to-cyan-500 text-white',
    ring: 'border-orange-300 bg-gradient-to-br from-orange-400 to-cyan-500',
    text: 'text-orange-600',
    chip: 'border-orange-300 bg-[#f0dcc6] text-orange-600',
  },
}

function readCompletedChapters() {
  try {
    const stored = JSON.parse(localStorage.getItem(COMPLETED_CHAPTERS_KEY) || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function getCompletedCountForBook(book, completedChapterIds) {
  return Array.from(
    { length: book.chapters },
    (_, index) => `${book.id}-${index + 1}`,
  ).filter((chapterId) => completedChapterIds.includes(chapterId)).length
}

function AchievementBadge({ achievement, earned, compact = false }) {
  const AchievementIcon = achievementIcons[achievement.id] || Award
  const tier = tierStyles[achievement.tier] || tierStyles.bronze
  const outer = compact ? 'h-14 w-14' : 'h-[70px] w-[70px]'
  const inner = compact ? 'h-10 w-10' : 'h-[52px] w-[52px]'

  return (
    <div className={`relative flex ${outer} shrink-0 items-center justify-center`}>
      <div className={`absolute inset-0 rounded-full border-4 ${earned ? tier.ring : 'border-[#33485b] bg-[#1a3044]'}`} />
      <div className={`relative flex ${inner} items-center justify-center rounded-full border-2 ${earned ? tier.badge : 'border-[#40566a] bg-[#23384b] text-slate-500'}`}>
        {earned ? <AchievementIcon size={compact ? 18 : 23} /> : <Lock size={compact ? 16 : 20} />}
      </div>
    </div>
  )
}

function TrailArtwork() {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="trailSky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#214b63" />
          <stop offset="50%" stopColor="#18354b" />
          <stop offset="100%" stopColor="#c9854d" />
        </linearGradient>
        <linearGradient id="trailGround" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d2434" />
          <stop offset="100%" stopColor="#06131f" />
        </linearGradient>
      </defs>
      <rect width="1200" height="500" fill="url(#trailSky)" />
      <circle cx="970" cy="115" r="90" fill="#f4bd79" opacity="0.45" />
      <path d="M0 270 C190 210 310 270 470 225 C650 175 770 215 930 180 C1030 155 1120 150 1200 145 L1200 500 L0 500 Z" fill="#234157" opacity="0.72" />
      <path d="M0 345 C170 300 300 335 455 305 C610 275 760 310 910 270 C1030 238 1120 255 1200 235 L1200 500 L0 500 Z" fill="url(#trailGround)" />
      <path d="M515 500 C545 425 615 392 650 350 C700 290 668 244 748 205 C800 180 850 177 900 163" fill="none" stroke="#d8b07b" strokeWidth="42" strokeLinecap="round" opacity="0.85" />
      <path d="M515 500 C545 425 615 392 650 350 C700 290 668 244 748 205 C800 180 850 177 900 163" fill="none" stroke="#f0d1a7" strokeWidth="12" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

function JourneyPage({ onNavigate, onOpenChapter }) {
  const [completedChapterIds, setCompletedChapterIds] = useState(readCompletedChapters)
  const [currentStreak, setCurrentStreak] = useState(calculateCurrentStreak)
  const [earnedAchievementIds, setEarnedAchievementIds] = useState(readEarnedAchievements)
  const [unseenAchievementIds, setUnseenAchievementIds] = useState(readUnseenAchievements)
  const [bookFilter, setBookFilter] = useState('all')
  const [showAchievementsOnly, setShowAchievementsOnly] = useState(false)

  useEffect(() => {
    function refreshProgress() {
      setCompletedChapterIds(readCompletedChapters())
      setCurrentStreak(calculateCurrentStreak())
      setEarnedAchievementIds(readEarnedAchievements())
      setUnseenAchievementIds(readUnseenAchievements())
    }

    const events = [
      'focus',
      'storage',
      'project326-completion-change',
      'project326-streak-change',
      'project326-achievement-change',
      'project326-achievement-viewed',
    ]

    events.forEach((eventName) => window.addEventListener(eventName, refreshProgress))
    return () => events.forEach((eventName) => window.removeEventListener(eventName, refreshProgress))
  }, [])

  const bookProgress = useMemo(
    () =>
      bibleBooks.map((book) => {
        const completed = getCompletedCountForBook(book, completedChapterIds)
        const availability = getBookAvailability(book.id, book.chapters)
        return {
          ...book,
          completed,
          isComplete: completed >= book.chapters,
          hasProgress: completed > 0,
          availability,
        }
      }),
    [completedChapterIds],
  )

  const chaptersCompleted = Math.min(completedChapterIds.length, TOTAL_BIBLE_CHAPTERS)
  const overallProgress = Math.round((chaptersCompleted / TOTAL_BIBLE_CHAPTERS) * 1000) / 10
  const completedBooks = bookProgress.filter((book) => book.isComplete).length

  const achievementMetrics = useMemo(
    () => ({ chaptersCompleted, completedBooks, currentStreak }),
    [chaptersCompleted, completedBooks, currentStreak],
  )

  useEffect(() => {
    const updated = syncAchievements(achievementMetrics)
    setEarnedAchievementIds(updated)
    setUnseenAchievementIds(readUnseenAchievements())
  }, [achievementMetrics])

  const earnedAchievements = achievements.filter((achievement) => earnedAchievementIds.includes(achievement.id))
  const lockedAchievements = achievements.filter((achievement) => !earnedAchievementIds.includes(achievement.id))
  const nextAchievement = lockedAchievements
    .map((achievement) => ({ achievement, progress: getAchievementProgress(achievement, achievementMetrics) }))
    .sort((a, b) => b.progress.percentage - a.progress.percentage)[0]

  const filteredBooks = bookProgress.filter((book) => {
    if (bookFilter === 'available') return book.availability.status === 'available' || book.availability.status === 'partial'
    if (bookFilter === 'progress') return book.hasProgress
    if (bookFilter === 'completed') return book.isComplete
    if (bookFilter === 'development') return book.availability.status === 'development'
    return true
  })

  function openChapterOfDay() {
    openSharedJourneyChapter(onOpenChapter, 'read')
  }

  function openAchievements() {
    clearUnseenAchievements()
    setUnseenAchievementIds([])
    setShowAchievementsOnly(true)
  }

  function handleNavigation(pageId) {
    if (pageId === 'journey') {
      setShowAchievementsOnly(false)
      return
    }
    onNavigate(pageId)
  }

  function renderAchievementCards() {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const earned = earnedAchievementIds.includes(achievement.id)
          const progress = getAchievementProgress(achievement, achievementMetrics)
          const tier = tierStyles[achievement.tier] || tierStyles.bronze

          return (
            <article key={achievement.id} className={`rounded-[24px] border p-4 ${earned ? 'border-[#c8d3db] bg-[#dfe8ee] text-[#153047]' : 'border-white/10 bg-[#0c2138] text-slate-300'}`}>
              <div className="flex items-center gap-3">
                <AchievementBadge achievement={achievement} earned={earned} />
                <div className="min-w-0 flex-1">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${earned ? tier.chip : 'border-white/10 bg-[#1a3044] text-slate-500'}`}>
                    {tier.label}
                  </span>
                  <h3 className="mt-2 font-semibold">{achievement.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{achievement.description}</p>
                </div>
              </div>

              {earned ? (
                <div className="mt-3 flex items-center gap-2 border-t border-black/10 pt-3">
                  <CheckCircle2 size={15} className={tier.text} />
                  <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${tier.text}`}>Earned</span>
                </div>
              ) : (
                <>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#23384b]">
                    <div className="h-full rounded-full bg-cyan-600" style={{ width: `${progress.percentage}%` }} />
                  </div>
                  <p className="mt-2 text-[10px] font-semibold text-slate-500">{progress.current} / {progress.target}</p>
                </>
              )}
            </article>
          )
        })}
      </div>
    )
  }

  if (showAchievementsOnly) {
    return (
      <div className="min-h-screen bg-[#041326] text-white">
        <AppNavigation activePage="journey" onNavigate={handleNavigation} />
        <div className="lg:pl-24">
          <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setShowAchievementsOnly(false)} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-slate-300" aria-label="Back to Journey">
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-400">PROJECT 3|26</p>
                <h1 className="text-2xl font-bold">Achievements</h1>
              </div>
              <Trophy size={24} className="text-orange-400" />
            </div>

            {nextAchievement && (
              <section className="mt-5 rounded-[26px] border border-orange-300/35 bg-[#e8ddd0] p-5 text-[#153047]">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">Next Achievement</p>
                <h2 className="mt-1 text-lg font-semibold">{nextAchievement.achievement.title}</h2>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-orange-200">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${nextAchievement.progress.percentage}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold text-orange-600">{nextAchievement.progress.current} / {nextAchievement.progress.target}</p>
              </section>
            )}

            <section className="mt-6">{renderAchievementCards()}</section>
          </main>
        </div>
      </div>
    )
  }

  const milestonePreview = earnedAchievements.length > 0 ? earnedAchievements.slice(-4).reverse() : achievements.slice(0, 4)

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="journey" onNavigate={handleNavigation} />

      <div className="lg:pl-24">
        <main className="mx-auto w-full max-w-7xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
          <header className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">PROJECT 3|26</p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Your Journey</h1>
            </div>
            <button type="button" onClick={openAchievements} className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border text-orange-400 ${unseenAchievementIds.length > 0 ? 'animate-pulse border-orange-300 bg-orange-500/30 shadow-[0_0_28px_rgba(249,115,22,0.75)]' : 'border-white/10 bg-[#0c2138]'}`} aria-label="Achievements">
              <Rocket size={21} />
            </button>
          </header>

          <section className="relative mt-6 min-h-56 overflow-hidden rounded-[30px] border border-white/10 shadow-2xl shadow-black/20 sm:min-h-64">
            <TrailArtwork />
            <div className="absolute inset-0 bg-gradient-to-r from-[#041326]/92 via-[#041326]/58 to-[#041326]/10" />
            <div className="relative z-10 flex min-h-56 flex-col justify-between p-5 sm:min-h-64 sm:p-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200/20 bg-black/20 px-3 py-1.5 text-xs font-semibold text-orange-200 backdrop-blur-sm">
                <Flame size={15} />
                HOT STREAK
              </div>

              <div className="max-w-xl">
                <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'} strong
                </p>
                <p className="mt-2 text-sm text-slate-200 sm:text-base">Keep moving. One faithful day at a time.</p>

                {nextAchievement && (
                  <button type="button" onClick={openAchievements} className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-left backdrop-blur-sm">
                    <Trophy size={18} className="text-orange-300" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-200">Next milestone</p>
                      <p className="text-sm font-semibold">{nextAchievement.achievement.title}</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">Today on the Journey</p>
            <button type="button" onClick={openChapterOfDay} className="group mt-3 flex w-full items-center gap-4 rounded-[26px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] sm:p-5">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-800">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em]">Day</span>
                <span className="text-2xl font-bold leading-none">{sharedJourney.cycleDay}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold">{sharedJourney.reference}</p>
                <p className="mt-1 truncate text-sm text-slate-500">{sharedJourney.title}</p>
                <p className="mt-1 text-xs font-semibold text-cyan-700">Day {sharedJourney.cycleDay} of {TOTAL_CYCLE_DAYS}</p>
              </div>
              <ArrowRight size={19} className="shrink-0 text-cyan-700 transition group-hover:translate-x-1" />
            </button>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">Milestones</p>
                <h2 className="mt-1 text-xl font-semibold">What you’ve earned</h2>
              </div>
              <button type="button" onClick={openAchievements} className="text-xs font-semibold text-orange-300">View all →</button>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {milestonePreview.map((achievement) => {
                const earned = earnedAchievementIds.includes(achievement.id)
                return (
                  <button key={achievement.id} type="button" onClick={openAchievements} className="flex min-w-28 flex-col items-center rounded-[22px] border border-white/10 bg-[#0c2138] p-3 text-center">
                    <AchievementBadge achievement={achievement} earned={earned} compact />
                    <span className="mt-2 text-xs font-semibold text-slate-200">{achievement.title}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="mt-9">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">Your Bible Journey</p>
                <h2 className="mt-1 text-2xl font-semibold">The road ahead</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-cyan-300">{chaptersCompleted} chapters</p>
                <p className="text-xs text-slate-500">{overallProgress}% overall</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {[
                ['all', 'All'],
                ['available', 'Available'],
                ['progress', 'Started'],
                ['completed', 'Completed'],
                ['development', 'Development'],
              ].map(([id, label]) => (
                <button key={id} type="button" onClick={() => setBookFilter(id)} className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition ${bookFilter === id ? 'border-cyan-500 bg-cyan-500 text-[#041326]' : 'border-white/10 bg-[#0c2138] text-slate-300'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {filteredBooks.map((book, index) => {
                const status = book.availability.status
                const isPartial = status === 'partial'
                const isDevelopment = status === 'development'
                const percentage = Math.round((book.completed / book.chapters) * 100)

                return (
                  <article key={book.id} className="relative pl-12">
                    {index < filteredBooks.length - 1 && <div className="absolute left-[19px] top-10 h-[calc(100%+12px)] w-px bg-white/10" />}
                    <div className={`absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 ${book.isComplete ? 'border-cyan-300 bg-cyan-500 text-white' : book.hasProgress ? 'border-cyan-400 bg-[#0c2138] text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.25)]' : 'border-white/10 bg-[#0c2138] text-slate-600'}`}>
                      {book.isComplete ? <Check size={17} /> : isDevelopment ? <Lock size={15} /> : <BookOpen size={15} />}
                    </div>

                    <div className={`rounded-[22px] border p-4 ${isDevelopment ? 'border-white/5 bg-[#0c2138]/60 text-slate-500' : 'border-white/10 bg-[#0c2138] text-white'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">{book.name}</p>
                          {isDevelopment ? (
                            <p className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-wide"><Wrench size={10} /> In Development</p>
                          ) : isPartial ? (
                            <p className="mt-1 text-xs text-slate-500">{book.availability.availableChapters} of {book.chapters} resources available</p>
                          ) : (
                            <p className="mt-1 text-xs text-slate-500">{book.completed} of {book.chapters} completed</p>
                          )}
                        </div>
                        {!isDevelopment && <span className="text-xs font-semibold text-cyan-300">{percentage}%</span>}
                      </div>

                      {!isDevelopment && (
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#23384b]">
                          <div className="h-full rounded-full bg-cyan-500" style={{ width: `${percentage}%` }} />
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default JourneyPage