import {
  ArrowRight,
  BookOpen,
  Check,
  Flame,
  Rocket,
  Trophy,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AchievementsGallery from '../components/AchievementsGallery'
import AppNavigation from '../components/AppNavigation'
import BadgeMedallion from '../components/BadgeMedallion'
import {
  journeyBookOrder,
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

function readCompletedChapters() {
  try {
    const stored = JSON.parse(localStorage.getItem(COMPLETED_CHAPTERS_KEY) || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function currentJourneyBookId() {
  const id = sharedJourney.chapterId || 'john-1'
  const separator = id.lastIndexOf('-')
  return separator > 0 ? id.slice(0, separator) : 'john'
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

  const chaptersCompleted = Math.min(completedChapterIds.length, TOTAL_BIBLE_CHAPTERS)
  const overallProgress = Math.round((chaptersCompleted / TOTAL_BIBLE_CHAPTERS) * 1000) / 10
  const completedBookIds = useMemo(
    () => journeyBookOrder
      .filter((book) =>
        Array.from({ length: book.chapters }, (_, index) => `${book.id}-${index + 1}`)
          .every((id) => completedChapterIds.includes(id)),
      )
      .map((book) => book.id),
    [completedChapterIds],
  )

  const achievementMetrics = useMemo(
    () => ({
      chaptersCompleted,
      completedBooks: completedBookIds.length,
      completedBookIds,
      currentStreak,
    }),
    [chaptersCompleted, completedBookIds, currentStreak],
  )

  useEffect(() => {
    const updated = syncAchievements(achievementMetrics)
    setEarnedAchievementIds(updated)
    setUnseenAchievementIds(readUnseenAchievements())
  }, [achievementMetrics])

  const nextAchievement = achievements
    .filter((achievement) => !earnedAchievementIds.includes(achievement.id))
    .map((achievement) => ({
      achievement,
      progress: getAchievementProgress(achievement, achievementMetrics),
    }))
    .sort((a, b) => b.progress.percentage - a.progress.percentage)[0]

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

  function openBookRoad(book) {
    const currentBook = currentJourneyBookId()
    let chapterId

    if (book.id === currentBook && sharedJourney.chapterId) {
      chapterId = sharedJourney.chapterId
    } else {
      const nextIncomplete = Array.from(
        { length: book.chapters },
        (_, index) => `${book.id}-${index + 1}`,
      ).find((id) => !completedChapterIds.includes(id))
      chapterId = nextIncomplete || `${book.id}-1`
    }

    sessionStorage.setItem(
      'project326-chapter-request',
      JSON.stringify({ chapterId, tab: 'read', createdAt: Date.now() }),
    )
    onOpenChapter(chapterId)
  }

  if (showAchievementsOnly) {
    return (
      <div className="min-h-screen bg-[#041326] text-white">
        <AppNavigation activePage="journey" onNavigate={handleNavigation} />
        <div className="lg:pl-24">
          <AchievementsGallery
            earnedAchievementIds={earnedAchievementIds}
            achievementMetrics={achievementMetrics}
            currentStreak={currentStreak}
            onBack={() => setShowAchievementsOnly(false)}
          />
        </div>
      </div>
    )
  }

  const milestonePreview = earnedAchievementIds.length
    ? achievements.filter((achievement) => earnedAchievementIds.includes(achievement.id)).slice(-4).reverse()
    : achievements.slice(0, 4)

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
            <button
              type="button"
              onClick={openAchievements}
              className={`relative flex h-11 w-11 items-center justify-center border text-orange-400 ${
                unseenAchievementIds.length > 0
                  ? 'animate-pulse border-orange-300 bg-orange-500/30 shadow-[0_0_28px_rgba(249,115,22,0.75)]'
                  : 'border-white/10 bg-[#0c2138]'
              }`}
              aria-label="Achievements"
            >
              <Rocket size={21} />
            </button>
          </header>

          <section className="relative mt-6 min-h-56 overflow-hidden border border-white/10 shadow-2xl shadow-black/20 sm:min-h-64">
            <TrailArtwork />
            <div className="absolute inset-0 bg-gradient-to-r from-[#041326]/92 via-[#041326]/58 to-[#041326]/10" />
            <div className="relative z-10 flex min-h-56 flex-col justify-between p-5 sm:min-h-64 sm:p-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200/20 bg-black/20 px-3 py-1.5 text-xs font-semibold text-orange-200 backdrop-blur-sm">
                <Flame size={15} /> HOT STREAK
              </div>
              <div className="max-w-xl">
                <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'} strong
                </p>
                <p className="mt-2 text-sm text-slate-200 sm:text-base">Keep moving. One faithful day at a time.</p>
                {nextAchievement && (
                  <button type="button" onClick={openAchievements} className="mt-4 flex items-center gap-3 border border-white/10 bg-black/20 px-3 py-2 text-left backdrop-blur-sm">
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
            <button
              type="button"
              onClick={() => openSharedJourneyChapter(onOpenChapter, 'read')}
              className="group mt-3 flex w-full items-center gap-4 border border-[#c8d3db] bg-[#dfe8ee] p-4 text-left text-[#153047] shadow-lg shadow-black/10 sm:p-5"
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center bg-[#c7dce7] text-cyan-800">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em]">Day</span>
                <span className="text-2xl font-bold leading-none">{sharedJourney.cycleDay}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold">{sharedJourney.reference}</p>
                <p className="mt-1 truncate text-sm text-slate-500">{sharedJourney.title}</p>
                <p className="mt-1 text-xs font-semibold text-cyan-700">Day {sharedJourney.cycleDay} of {TOTAL_CYCLE_DAYS}</p>
              </div>
              <ArrowRight size={19} className="shrink-0 text-cyan-700" />
            </button>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">Milestones</p>
                <h2 className="mt-1 text-xl font-semibold">Your badge collection</h2>
              </div>
              <button type="button" onClick={openAchievements} className="text-xs font-semibold text-orange-300">View all →</button>
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {milestonePreview.map((achievement) => (
                <button key={achievement.id} type="button" onClick={openAchievements} className="flex min-w-32 flex-col items-center border border-white/10 bg-[#0c2138] p-3 text-center">
                  <BadgeMedallion achievement={achievement} earned={earnedAchievementIds.includes(achievement.id)} size="sm" showCheck />
                  <span className="mt-2 text-xs font-semibold text-slate-200">{achievement.title}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-9">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">Your Bible Journey</p>
                <h2 className="mt-1 text-2xl font-semibold">The road ahead</h2>
                <p className="mt-1 text-xs text-slate-500">Tap any road to open the next chapter on it.</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-cyan-300">{chaptersCompleted} chapters</p>
                <p className="text-xs text-slate-500">{overallProgress}% overall</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {journeyBookOrder.map((book, index) => {
                const completed = Array.from(
                  { length: book.chapters },
                  (_, chapterIndex) => `${book.id}-${chapterIndex + 1}`,
                ).filter((id) => completedChapterIds.includes(id)).length
                const complete = completed === book.chapters
                const percentage = Math.round((completed / book.chapters) * 100)
                const current = book.id === currentJourneyBookId()

                return (
                  <div key={book.id} className="relative pl-12">
                    {index < journeyBookOrder.length - 1 && (
                      <div className="absolute left-[19px] top-10 h-[calc(100%+12px)] w-px bg-white/10" />
                    )}
                    <div className={`absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      complete
                        ? 'border-cyan-300 bg-cyan-500 text-white'
                        : current
                          ? 'border-orange-300 bg-orange-500 text-white shadow-[0_0_22px_rgba(249,115,22,0.35)]'
                          : 'border-cyan-400/40 bg-[#0c2138] text-cyan-300'
                    }`}>
                      {complete ? <Check size={17} /> : <BookOpen size={15} />}
                    </div>

                    <button
                      type="button"
                      onClick={() => openBookRoad(book)}
                      className={`group w-full border p-4 text-left ${
                        current
                          ? 'border-orange-300/40 bg-[#16263a]'
                          : 'border-white/10 bg-[#0c2138]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{book.name}</p>
                            {current && (
                              <span className="bg-orange-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-300">
                                Current road
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{completed} of {book.chapters} completed</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-cyan-300">{percentage}%</span>
                          <ArrowRight size={16} className="text-cyan-400 transition group-hover:translate-x-1" />
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#23384b]">
                        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${percentage}%` }} />
                      </div>
                    </button>
                  </div>
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
