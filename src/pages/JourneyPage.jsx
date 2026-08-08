import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
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
    badge:
      'border-orange-300 bg-gradient-to-br from-orange-500 via-amber-400 to-cyan-500 text-white',
    ring:
      'border-orange-300 bg-gradient-to-br from-orange-400 to-cyan-500',
    text: 'text-orange-600',
    chip: 'border-orange-300 bg-[#f0dcc6] text-orange-600',
  },
}

function readCompletedChapters() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(COMPLETED_CHAPTERS_KEY) || '[]',
    )

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

function AchievementBadge({ achievement, earned }) {
  const AchievementIcon = achievementIcons[achievement.id] || Award
  const tier = tierStyles[achievement.tier] || tierStyles.bronze

  return (
    <div className="relative flex h-[70px] w-[70px] shrink-0 items-center justify-center">
      <div
        className={`absolute inset-0 rounded-full border-4 ${
          earned ? tier.ring : 'border-[#33485b] bg-[#1a3044]'
        }`}
      />
      <div
        className={`relative flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 ${
          earned
            ? tier.badge
            : 'border-[#40566a] bg-[#23384b] text-slate-500'
        }`}
      >
        {earned ? <AchievementIcon size={23} /> : <Lock size={20} />}
      </div>
    </div>
  )
}

function JourneyPage({ onNavigate, onOpenChapter }) {
  const [completedChapterIds, setCompletedChapterIds] = useState(() =>
    readCompletedChapters(),
  )
  const [currentStreak, setCurrentStreak] = useState(() =>
    calculateCurrentStreak(),
  )
  const [earnedAchievementIds, setEarnedAchievementIds] = useState(() =>
    readEarnedAchievements(),
  )
  const [unseenAchievementIds, setUnseenAchievementIds] = useState(() =>
    readUnseenAchievements(),
  )
  const [bookFilter, setBookFilter] = useState('all')
  const [showAchievementsOnly, setShowAchievementsOnly] = useState(false)

  const hasNewAchievement = unseenAchievementIds.length > 0

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

    events.forEach((eventName) =>
      window.addEventListener(eventName, refreshProgress),
    )

    return () => {
      events.forEach((eventName) =>
        window.removeEventListener(eventName, refreshProgress),
      )
    }
  }, [])

  const bookProgress = useMemo(
    () =>
      bibleBooks.map((book) => {
        const completed = getCompletedCountForBook(
          book,
          completedChapterIds,
        )
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

  const chaptersCompleted = Math.min(
    completedChapterIds.length,
    TOTAL_BIBLE_CHAPTERS,
  )
  const chaptersRemaining = Math.max(
    TOTAL_BIBLE_CHAPTERS - chaptersCompleted,
    0,
  )
  const overallProgress =
    Math.round((chaptersCompleted / TOTAL_BIBLE_CHAPTERS) * 1000) / 10
  const completedBooks = bookProgress.filter((book) => book.isComplete).length
  const booksStarted = bookProgress.filter((book) => book.hasProgress).length

  const achievementMetrics = useMemo(
    () => ({ chaptersCompleted, completedBooks, currentStreak }),
    [chaptersCompleted, completedBooks, currentStreak],
  )

  useEffect(() => {
    const updated = syncAchievements(achievementMetrics)
    setEarnedAchievementIds(updated)
    setUnseenAchievementIds(readUnseenAchievements())
  }, [achievementMetrics])

  const earnedAchievements = achievements.filter((achievement) =>
    earnedAchievementIds.includes(achievement.id),
  )
  const lockedAchievements = achievements.filter(
    (achievement) => !earnedAchievementIds.includes(achievement.id),
  )

  const nextAchievement = lockedAchievements
    .map((achievement) => ({
      achievement,
      progress: getAchievementProgress(achievement, achievementMetrics),
    }))
    .sort((a, b) => b.progress.percentage - a.progress.percentage)[0]

  const sharedCycleProgress =
    Math.round((sharedJourney.cycleDay / TOTAL_CYCLE_DAYS) * 1000) / 10

  const filteredBooks = bookProgress.filter((book) => {
    if (bookFilter === 'available') {
      return (
        book.availability.status === 'available' ||
        book.availability.status === 'partial'
      )
    }
    if (bookFilter === 'progress') return book.hasProgress
    if (bookFilter === 'completed') return book.isComplete
    if (bookFilter === 'development') {
      return book.availability.status === 'development'
    }
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
          const progress = getAchievementProgress(
            achievement,
            achievementMetrics,
          )
          const tier = tierStyles[achievement.tier] || tierStyles.bronze

          return (
            <article
              key={achievement.id}
              className={`rounded-[24px] border p-4 ${
                earned
                  ? 'border-[#c8d3db] bg-[#dfe8ee] text-[#153047]'
                  : 'border-white/10 bg-[#0c2138] text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <AchievementBadge achievement={achievement} earned={earned} />
                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-flex rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                      earned
                        ? tier.chip
                        : 'border-white/10 bg-[#1a3044] text-slate-500'
                    }`}
                  >
                    {tier.label}
                  </span>
                  <h3 className="mt-2 font-semibold">{achievement.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {earned ? (
                <div className="mt-3 flex items-center gap-2 border-t border-black/10 pt-3">
                  <CheckCircle2 size={15} className={tier.text} />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.12em] ${tier.text}`}
                  >
                    Earned
                  </span>
                </div>
              ) : (
                <>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#23384b]">
                    <div
                      className="h-full rounded-full bg-cyan-600"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] font-semibold text-slate-500">
                    {progress.current} / {progress.target}
                  </p>
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
              <button
                type="button"
                onClick={() => setShowAchievementsOnly(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#0c2138] text-slate-300"
                aria-label="Back to Journey"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-400">
                  PROJECT 3|26
                </p>
                <h1 className="text-2xl font-bold">Achievements</h1>
              </div>
              <Trophy size={24} className="text-orange-400" />
            </div>

            <section className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-center text-[#153047]">
                <p className="text-2xl font-bold">{earnedAchievements.length}</p>
                <p className="mt-1 text-xs text-slate-500">Earned</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-[#0c2138] p-4 text-center">
                <p className="text-2xl font-bold">{lockedAchievements.length}</p>
                <p className="mt-1 text-xs text-slate-400">Remaining</p>
              </div>
              <div className="rounded-[22px] border border-orange-300/35 bg-[#e8ddd0] p-4 text-center text-[#153047]">
                <p className="text-2xl font-bold text-orange-600">{currentStreak}</p>
                <p className="mt-1 text-xs text-slate-500">Day streak</p>
              </div>
            </section>

            {nextAchievement && (
              <section className="mt-4 rounded-[26px] border border-orange-300/35 bg-[#e8ddd0] p-5 text-[#153047]">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">
                  Next Achievement
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  {nextAchievement.achievement.title}
                </h2>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-orange-200">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${nextAchievement.progress.percentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-orange-600">
                  {nextAchievement.progress.current} / {nextAchievement.progress.target}
                </p>
              </section>
            )}

            <section className="mt-6">{renderAchievementCards()}</section>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="journey" onNavigate={handleNavigation} />

      <div className="lg:pl-24">
        <main className="mx-auto w-full max-w-7xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
          <header className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                PROJECT 3|26
              </p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Your Journey</h1>
            </div>

            <button
              type="button"
              onClick={openAchievements}
              className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border text-orange-400 ${
                hasNewAchievement
                  ? 'animate-pulse border-orange-300 bg-orange-500/30 shadow-[0_0_28px_rgba(249,115,22,0.75)]'
                  : 'border-white/10 bg-[#0c2138]'
              }`}
              aria-label="Achievements"
            >
              <Rocket size={21} />
              {hasNewAchievement && (
                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#041326] bg-orange-400" />
              )}
            </button>
          </header>

          <section className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <article className="col-span-2 rounded-[28px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] shadow-xl shadow-black/10 lg:col-span-2 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700 sm:text-xs">
                Bible Progress
              </p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="text-4xl font-bold tracking-tight">{overallProgress}%</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {chaptersCompleted} of {TOTAL_BIBLE_CHAPTERS} chapters
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  {chaptersRemaining} remaining
                </p>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#c8d3db]">
                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </article>

            <div className="flex min-h-36 flex-col justify-between rounded-[26px] border border-white/10 bg-[#0c2138] p-4 shadow-lg shadow-black/10 sm:min-h-40 sm:p-5">
              <BookOpen size={29} className="text-cyan-400" />
              <div>
                <p className="text-2xl font-bold">{booksStarted}</p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">Books started</p>
              </div>
            </div>

            <div className="flex min-h-36 flex-col justify-between rounded-[26px] border border-orange-300/35 bg-[#e8ddd0] p-4 text-[#153047] shadow-lg shadow-black/10 sm:min-h-40 sm:p-5">
              <Flame size={29} className="text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{currentStreak}</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">Day streak</p>
              </div>
            </div>
          </section>

          <section className="mt-4 grid grid-cols-[88px_1fr] gap-4 sm:grid-cols-[104px_1fr]">
            <div className="flex flex-col items-center justify-center rounded-[26px] border border-white/10 bg-[#0c2138] p-3 text-center">
              <CalendarDays size={22} className="text-cyan-400" />
              <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Day
              </span>
              <span className="text-2xl font-bold">{sharedJourney.cycleDay}</span>
            </div>

            <button
              type="button"
              onClick={openChapterOfDay}
              className="group rounded-[26px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-lg shadow-black/10 transition hover:border-cyan-400/40 hover:bg-[#e7eef2] active:scale-[0.99] sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700 sm:text-xs">
                    Chapter of the Day
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">{sharedJourney.reference}</h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Day {sharedJourney.cycleDay} of {TOTAL_CYCLE_DAYS} · {sharedCycleProgress}%
                  </p>
                </div>
                <ArrowRight
                  size={19}
                  className="shrink-0 text-cyan-700 transition group-hover:translate-x-1"
                />
              </div>
            </button>
          </section>

          <button
            type="button"
            onClick={openAchievements}
            className="mt-4 flex w-full items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#0c2138] px-4 py-4 text-left shadow-lg shadow-black/10 transition hover:border-orange-300/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Trophy size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Achievements</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {earnedAchievements.length} earned · {lockedAchievements.length} remaining
                </p>
              </div>
            </div>
            <ArrowRight size={17} className="text-orange-400" />
          </button>

          <section className="mt-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Progress by Book
                </p>
                <h2 className="mt-1 text-2xl font-semibold">The Bible</h2>
              </div>
              <p className="text-xs text-slate-400">{completedBooks} books finished</p>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {[
                ['all', 'All'],
                ['available', 'Available'],
                ['progress', 'Started'],
                ['completed', 'Completed'],
                ['development', 'Development'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setBookFilter(id)}
                  className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    bookFilter === id
                      ? 'border-cyan-500 bg-cyan-500 text-[#041326]'
                      : 'border-white/10 bg-[#0c2138] text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => {
                const status = book.availability.status
                const isPartial = status === 'partial'
                const isDevelopment = status === 'development'

                return (
                  <article
                    key={book.id}
                    className={`rounded-[22px] border p-4 ${
                      isDevelopment
                        ? 'border-white/5 bg-[#10263a] text-slate-500'
                        : 'border-[#c8d3db] bg-[#dfe8ee] text-[#153047]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          book.isComplete
                            ? 'bg-cyan-500 text-white'
                            : isDevelopment
                              ? 'bg-[#1a3044] text-slate-500'
                              : 'bg-[#c7dce7] text-cyan-700'
                        }`}
                      >
                        {book.isComplete ? (
                          <Check size={17} />
                        ) : isDevelopment ? (
                          <Lock size={16} />
                        ) : (
                          <BookOpen size={17} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{book.name}</p>
                        {isDevelopment ? (
                          <p className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-wide">
                            <Wrench size={10} /> In Development
                          </p>
                        ) : isPartial ? (
                          <p className="mt-1 text-xs text-slate-500">
                            {book.availability.availableChapters} of {book.chapters} resources available
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500">
                            {book.completed} of {book.chapters} completed
                          </p>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-cyan-700">
                        {book.completed}/{book.chapters}
                      </p>
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
