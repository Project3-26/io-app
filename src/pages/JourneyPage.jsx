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
  Users,
  Wrench,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import AppNavigation from '../components/AppNavigation'
import {
  getBookAvailability,
} from '../data/contentAvailability'
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
import {
  calculateCurrentStreak,
} from '../utils/streak'

const COMPLETED_CHAPTERS_KEY =
  'project326-completed-chapters'

const TOTAL_BIBLE_CHAPTERS = 1189

const bibleBooks = [
  { id: 'genesis', name: 'Genesis', chapters: 50 },
  { id: 'exodus', name: 'Exodus', chapters: 40 },
  { id: 'leviticus', name: 'Leviticus', chapters: 27 },
  { id: 'numbers', name: 'Numbers', chapters: 36 },
  { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34 },
  { id: 'joshua', name: 'Joshua', chapters: 24 },
  { id: 'judges', name: 'Judges', chapters: 21 },
  { id: 'ruth', name: 'Ruth', chapters: 4 },
  { id: 'first-samuel', name: '1 Samuel', chapters: 31 },
  { id: 'second-samuel', name: '2 Samuel', chapters: 24 },
  { id: 'first-kings', name: '1 Kings', chapters: 22 },
  { id: 'second-kings', name: '2 Kings', chapters: 25 },
  { id: 'first-chronicles', name: '1 Chronicles', chapters: 29 },
  { id: 'second-chronicles', name: '2 Chronicles', chapters: 36 },
  { id: 'ezra', name: 'Ezra', chapters: 10 },
  { id: 'nehemiah', name: 'Nehemiah', chapters: 13 },
  { id: 'esther', name: 'Esther', chapters: 10 },
  { id: 'job', name: 'Job', chapters: 42 },
  { id: 'psalms', name: 'Psalms', chapters: 150 },
  { id: 'proverbs', name: 'Proverbs', chapters: 31 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12 },
  { id: 'song-of-solomon', name: 'Song of Solomon', chapters: 8 },
  { id: 'isaiah', name: 'Isaiah', chapters: 66 },
  { id: 'jeremiah', name: 'Jeremiah', chapters: 52 },
  { id: 'lamentations', name: 'Lamentations', chapters: 5 },
  { id: 'ezekiel', name: 'Ezekiel', chapters: 48 },
  { id: 'daniel', name: 'Daniel', chapters: 12 },
  { id: 'hosea', name: 'Hosea', chapters: 14 },
  { id: 'joel', name: 'Joel', chapters: 3 },
  { id: 'amos', name: 'Amos', chapters: 9 },
  { id: 'obadiah', name: 'Obadiah', chapters: 1 },
  { id: 'jonah', name: 'Jonah', chapters: 4 },
  { id: 'micah', name: 'Micah', chapters: 7 },
  { id: 'nahum', name: 'Nahum', chapters: 3 },
  { id: 'habakkuk', name: 'Habakkuk', chapters: 3 },
  { id: 'zephaniah', name: 'Zephaniah', chapters: 3 },
  { id: 'haggai', name: 'Haggai', chapters: 2 },
  { id: 'zechariah', name: 'Zechariah', chapters: 14 },
  { id: 'malachi', name: 'Malachi', chapters: 4 },

  { id: 'matthew', name: 'Matthew', chapters: 28 },
  { id: 'mark', name: 'Mark', chapters: 16 },
  { id: 'luke', name: 'Luke', chapters: 24 },
  { id: 'john', name: 'John', chapters: 21 },
  { id: 'acts', name: 'Acts', chapters: 28 },
  { id: 'romans', name: 'Romans', chapters: 16 },
  { id: 'first-corinthians', name: '1 Corinthians', chapters: 16 },
  { id: 'second-corinthians', name: '2 Corinthians', chapters: 13 },
  { id: 'galatians', name: 'Galatians', chapters: 6 },
  { id: 'ephesians', name: 'Ephesians', chapters: 6 },
  { id: 'philippians', name: 'Philippians', chapters: 4 },
  { id: 'colossians', name: 'Colossians', chapters: 4 },
  { id: 'first-thessalonians', name: '1 Thessalonians', chapters: 5 },
  { id: 'second-thessalonians', name: '2 Thessalonians', chapters: 3 },
  { id: 'first-timothy', name: '1 Timothy', chapters: 6 },
  { id: 'second-timothy', name: '2 Timothy', chapters: 4 },
  { id: 'titus', name: 'Titus', chapters: 3 },
  { id: 'philemon', name: 'Philemon', chapters: 1 },
  { id: 'hebrews', name: 'Hebrews', chapters: 13 },
  { id: 'james', name: 'James', chapters: 5 },
  { id: 'first-peter', name: '1 Peter', chapters: 5 },
  { id: 'second-peter', name: '2 Peter', chapters: 3 },
  { id: 'first-john', name: '1 John', chapters: 5 },
  { id: 'second-john', name: '2 John', chapters: 1 },
  { id: 'third-john', name: '3 John', chapters: 1 },
  { id: 'jude', name: 'Jude', chapters: 1 },
  { id: 'revelation', name: 'Revelation', chapters: 22 },
]

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
    badge:
      'border-orange-700/40 bg-[#b86f42] text-white shadow-[0_8px_25px_rgba(184,111,66,0.25)]',
    ring:
      'border-[#d99a71] bg-[#c67b4c]',
    text: 'text-[#9a552e]',
    chip:
      'border-[#d3a081] bg-[#ead4c6] text-[#8c4e2c]',
  },

  silver: {
    label: 'Silver',
    badge:
      'border-slate-400 bg-[#9aa7b0] text-white shadow-[0_8px_25px_rgba(148,163,184,0.25)]',
    ring:
      'border-[#cbd5db] bg-[#aebac2]',
    text: 'text-slate-600',
    chip:
      'border-slate-300 bg-[#dce3e7] text-slate-600',
  },

  gold: {
    label: 'Gold',
    badge:
      'border-amber-500/50 bg-[#d79b2e] text-white shadow-[0_8px_28px_rgba(217,155,46,0.3)]',
    ring:
      'border-[#f0c96b] bg-[#e0aa3e]',
    text: 'text-amber-700',
    chip:
      'border-amber-300 bg-[#efe1bb] text-amber-700',
  },

  legendary: {
    label: 'Legendary',
    badge:
      'border-orange-300 bg-gradient-to-br from-orange-500 via-amber-400 to-cyan-500 text-white shadow-[0_0_35px_rgba(249,115,22,0.4)]',
    ring:
      'border-orange-300 bg-gradient-to-br from-orange-400 to-cyan-500',
    text: 'text-orange-600',
    chip:
      'border-orange-300 bg-[#f0dcc6] text-orange-600',
  },
}

function readCompletedChapters() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(
        COMPLETED_CHAPTERS_KEY,
      ) || '[]',
    )

    return Array.isArray(stored)
      ? stored
      : []
  } catch {
    return []
  }
}

function getCompletedCountForBook(
  book,
  completedChapterIds,
) {
  return Array.from(
    {
      length: book.chapters,
    },
    (_, index) =>
      `${book.id}-${index + 1}`,
  ).filter((chapterId) =>
    completedChapterIds.includes(
      chapterId,
    ),
  ).length
}

function AchievementBadge({
  achievement,
  earned,
}) {
  const AchievementIcon =
    achievementIcons[
      achievement.id
    ] || Award

  const tier =
    tierStyles[
      achievement.tier
    ] || tierStyles.bronze

  return (
    <div className="relative flex h-[82px] w-[82px] shrink-0 items-center justify-center">
      <div
        className={`absolute inset-0 rounded-full border-4 ${
          earned
            ? tier.ring
            : 'border-[#33485b] bg-[#1a3044]'
        }`}
      />

      <div
        className={`relative flex h-[62px] w-[62px] items-center justify-center rounded-full border-2 ${
          earned
            ? tier.badge
            : 'border-[#40566a] bg-[#23384b] text-slate-500'
        }`}
      >
        {earned ? (
          <AchievementIcon
            size={28}
            strokeWidth={2.2}
          />
        ) : (
          <Lock
            size={23}
          />
        )}
      </div>

      {earned && (
        <div className="absolute -bottom-1 rounded-full border border-white/50 bg-[#041326] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
          {tier.label}
        </div>
      )}
    </div>
  )
}

function JourneyPage({
  onNavigate,
  onOpenChapter,
}) {
  const [
    completedChapterIds,
    setCompletedChapterIds,
  ] = useState(() =>
    readCompletedChapters(),
  )

  const [
    currentStreak,
    setCurrentStreak,
  ] = useState(() =>
    calculateCurrentStreak(),
  )

  const [
    earnedAchievementIds,
    setEarnedAchievementIds,
  ] = useState(() =>
    readEarnedAchievements(),
  )

  const [
    unseenAchievementIds,
    setUnseenAchievementIds,
  ] = useState(() =>
    readUnseenAchievements(),
  )

  const [
    bookFilter,
    setBookFilter,
  ] = useState('all')

  const [
    showAchievementsOnly,
    setShowAchievementsOnly,
  ] = useState(false)

  const hasNewAchievement =
    unseenAchievementIds.length > 0

  useEffect(() => {
    function refreshProgress() {
      setCompletedChapterIds(
        readCompletedChapters(),
      )

      setCurrentStreak(
        calculateCurrentStreak(),
      )

      setEarnedAchievementIds(
        readEarnedAchievements(),
      )

      setUnseenAchievementIds(
        readUnseenAchievements(),
      )
    }

    window.addEventListener(
      'focus',
      refreshProgress,
    )

    window.addEventListener(
      'storage',
      refreshProgress,
    )

    window.addEventListener(
      'project326-completion-change',
      refreshProgress,
    )

    window.addEventListener(
      'project326-streak-change',
      refreshProgress,
    )

    window.addEventListener(
      'project326-achievement-change',
      refreshProgress,
    )

    window.addEventListener(
      'project326-achievement-viewed',
      refreshProgress,
    )

    return () => {
      window.removeEventListener(
        'focus',
        refreshProgress,
      )

      window.removeEventListener(
        'storage',
        refreshProgress,
      )

      window.removeEventListener(
        'project326-completion-change',
        refreshProgress,
      )

      window.removeEventListener(
        'project326-streak-change',
        refreshProgress,
      )

      window.removeEventListener(
        'project326-achievement-change',
        refreshProgress,
      )

      window.removeEventListener(
        'project326-achievement-viewed',
        refreshProgress,
      )
    }
  }, [])

  const bookProgress =
    useMemo(() => {
      return bibleBooks.map(
        (book) => {
          const completed =
            getCompletedCountForBook(
              book,
              completedChapterIds,
            )

          const availability =
            getBookAvailability(
              book.id,
              book.chapters,
            )

          return {
            ...book,
            completed,
            isComplete:
              completed >=
              book.chapters,
            hasProgress:
              completed > 0,
            availability,
          }
        },
      )
    }, [completedChapterIds])

  const chaptersCompleted =
    Math.min(
      completedChapterIds.length,
      TOTAL_BIBLE_CHAPTERS,
    )

  const chaptersRemaining =
    Math.max(
      TOTAL_BIBLE_CHAPTERS -
        chaptersCompleted,
      0,
    )

  const overallProgress =
    Math.round(
      (chaptersCompleted /
        TOTAL_BIBLE_CHAPTERS) *
        1000,
    ) / 10

  const completedBooks =
    bookProgress.filter(
      (book) =>
        book.isComplete,
    ).length

  const booksStarted =
    bookProgress.filter(
      (book) =>
        book.hasProgress,
    ).length

  const achievementMetrics =
    useMemo(
      () => ({
        chaptersCompleted,
        completedBooks,
        currentStreak,
      }),
      [
        chaptersCompleted,
        completedBooks,
        currentStreak,
      ],
    )

  useEffect(() => {
    const updated =
      syncAchievements(
        achievementMetrics,
      )

    setEarnedAchievementIds(
      updated,
    )

    setUnseenAchievementIds(
      readUnseenAchievements(),
    )
  }, [achievementMetrics])

  const earnedAchievements =
    achievements.filter(
      (achievement) =>
        earnedAchievementIds.includes(
          achievement.id,
        ),
    )

  const lockedAchievements =
    achievements.filter(
      (achievement) =>
        !earnedAchievementIds.includes(
          achievement.id,
        ),
    )

  const nextAchievement =
    lockedAchievements
      .map((achievement) => ({
        achievement,
        progress:
          getAchievementProgress(
            achievement,
            achievementMetrics,
          ),
      }))
      .sort(
        (a, b) =>
          b.progress.percentage -
          a.progress.percentage,
      )[0]

  const sharedCycleProgress =
    Math.round(
      (sharedJourney.cycleDay /
        TOTAL_CYCLE_DAYS) *
        1000,
    ) / 10

  const filteredBooks =
    bookProgress.filter(
      (book) => {
        if (
          bookFilter ===
          'available'
        ) {
          return (
            book.availability.status ===
              'available' ||
            book.availability.status ===
              'partial'
          )
        }

        if (
          bookFilter ===
          'progress'
        ) {
          return book.hasProgress
        }

        if (
          bookFilter ===
          'completed'
        ) {
          return book.isComplete
        }

        if (
          bookFilter ===
          'development'
        ) {
          return (
            book.availability.status ===
            'development'
          )
        }

        return true
      },
    )

  function openChapterOfDay() {
    openSharedJourneyChapter(
      onOpenChapter,
      'read',
    )
  }

  function openAchievements() {
    clearUnseenAchievements()
    setUnseenAchievementIds([])
    setShowAchievementsOnly(true)
  }

  function handleNavigation(
    pageId,
  ) {
    if (
      pageId === 'journey'
    ) {
      setShowAchievementsOnly(
        false,
      )
      return
    }

    onNavigate(pageId)
  }

  function renderAchievementCards() {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map(
          (achievement) => {
            const earned =
              earnedAchievementIds.includes(
                achievement.id,
              )

            const progress =
              getAchievementProgress(
                achievement,
                achievementMetrics,
              )

            const tier =
              tierStyles[
                achievement.tier
              ] ||
              tierStyles.bronze

            return (
              <article
                key={
                  achievement.id
                }
                className={`rounded-[24px] border p-4 ${
                  earned
                    ? 'border-[#c8d3db] bg-[#dfe8ee] text-[#153047]'
                    : 'border-[#33485b] bg-[#10263a] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <AchievementBadge
                    achievement={
                      achievement
                    }
                    earned={earned}
                  />

                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                        earned
                          ? tier.chip
                          : 'border-[#33485b] bg-[#1a3044] text-slate-500'
                      }`}
                    >
                      {tier.label}
                    </span>

                    <h3
                      className={`mt-2 font-semibold ${
                        earned
                          ? 'text-[#153047]'
                          : 'text-slate-300'
                      }`}
                    >
                      {
                        achievement.title
                      }
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {
                        achievement.description
                      }
                    </p>
                  </div>
                </div>

                {earned ? (
                  <div className="mt-4 flex items-center gap-2 border-t border-[#c8d3db] pt-3">
                    <CheckCircle2
                      size={15}
                      className={
                        tier.text
                      }
                    />

                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.12em] ${tier.text}`}
                    >
                      Achievement earned
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#23384b]">
                      <div
                        className="h-full rounded-full bg-cyan-600"
                        style={{
                          width: `${progress.percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-[10px] font-semibold text-slate-500">
                      {progress.current} /{' '}
                      {progress.target}
                    </p>
                  </>
                )}
              </article>
            )
          },
        )}
      </div>
    )
  }

  if (showAchievementsOnly) {
    return (
      <div className="min-h-screen bg-[#041326] text-white">
        <AppNavigation
          activePage="journey"
          onNavigate={
            handleNavigation
          }
        />

        <div className="lg:pl-24">
          <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            <button
              type="button"
              onClick={() =>
                setShowAchievementsOnly(
                  false,
                )
              }
              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#0c2138] px-3 text-sm font-semibold text-slate-300"
            >
              <ArrowLeft
                size={17}
              />
              Journey
            </button>

            <header className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                  PROJECT 3|26
                </p>

                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  Achievements
                </h1>

                <p className="mt-2 max-w-xl text-sm text-slate-400">
                  Collect milestones as your journey through Scripture grows.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-300/30 bg-orange-500/10 text-orange-400">
                <Trophy
                  size={23}
                />
              </div>
            </header>

            <section className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-center text-[#153047]">
                <Trophy
                  size={21}
                  className="mx-auto text-cyan-700"
                />

                <p className="mt-2 text-2xl font-bold">
                  {
                    earnedAchievements.length
                  }
                </p>

                <p className="text-xs text-slate-500">
                  Earned
                </p>
              </div>

              <div className="rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-center text-[#153047]">
                <Lock
                  size={21}
                  className="mx-auto text-slate-500"
                />

                <p className="mt-2 text-2xl font-bold">
                  {
                    lockedAchievements.length
                  }
                </p>

                <p className="text-xs text-slate-500">
                  Remaining
                </p>
              </div>

              <div className="rounded-[22px] border border-orange-300/40 bg-[#e8ddd0] p-4 text-center text-[#153047]">
                <Flame
                  size={21}
                  className="mx-auto text-orange-600"
                />

                <p className="mt-2 text-2xl font-bold text-orange-600">
                  {currentStreak}
                </p>

                <p className="text-xs text-slate-500">
                  Day streak
                </p>
              </div>
            </section>

            {nextAchievement && (
              <section className="mt-6 rounded-[26px] border border-orange-300/40 bg-[#e8ddd0] p-5 text-[#153047]">
                <div className="flex items-center gap-4">
                  <AchievementBadge
                    achievement={
                      nextAchievement
                        .achievement
                    }
                    earned={false}
                  />

                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">
                      Next Achievement
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      {
                        nextAchievement
                          .achievement
                          .title
                      }
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {
                        nextAchievement
                          .achievement
                          .description
                      }
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-orange-200">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{
                      width: `${nextAchievement.progress.percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-orange-600">
                  {
                    nextAchievement
                      .progress.current
                  }{' '}
                  /{' '}
                  {
                    nextAchievement
                      .progress.target
                  }
                </p>
              </section>
            )}

            <section className="mt-7">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Badge Collection
                </h2>

                <p className="text-xs text-slate-400">
                  Bronze · Silver · Gold · Legendary
                </p>
              </div>

              {renderAchievementCards()}
            </section>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="journey"
        onNavigate={
          handleNavigation
        }
      />

      <div className="lg:pl-24">
        <main className="mx-auto w-full max-w-7xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                PROJECT 3|26
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Your Journey
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Follow the shared journey, build momentum, and celebrate every milestone.
              </p>
            </div>

            <button
              type="button"
              onClick={
                openAchievements
              }
              className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border text-orange-400 ${
                hasNewAchievement
                  ? 'animate-pulse border-orange-300 bg-orange-500/30 shadow-[0_0_28px_rgba(249,115,22,0.75)]'
                  : 'border-orange-300/30 bg-orange-500/10'
              }`}
            >
              <Rocket
                size={21}
              />

              {hasNewAchievement && (
                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#041326] bg-orange-400" />
              )}
            </button>
          </header>

          <section className="mt-6 grid gap-4 lg:grid-cols-12">
            <article className="rounded-[28px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-[#153047] lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Your progress
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {chaptersCompleted}{' '}
                chapters completed
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Read in any order. Every completed chapter counts.
              </p>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#c8d3db]">
                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-500">
                  {overallProgress}%
                </span>

                <span className="font-semibold">
                  {chaptersRemaining}{' '}
                  remaining
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#edf2f4] p-3 text-center">
                  <CheckCircle2
                    size={21}
                    className="mx-auto text-cyan-700"
                  />

                  <p className="mt-2 text-xl font-bold">
                    {chaptersCompleted}
                  </p>

                  <p className="text-xs text-slate-500">
                    Chapters
                  </p>
                </div>

                <div className="rounded-2xl bg-[#edf2f4] p-3 text-center">
                  <BookOpen
                    size={21}
                    className="mx-auto text-cyan-700"
                  />

                  <p className="mt-2 text-xl font-bold">
                    {booksStarted}
                  </p>

                  <p className="text-xs text-slate-500">
                    Books started
                  </p>
                </div>

                <div className="rounded-2xl bg-[#edf2f4] p-3 text-center">
                  <Check
                    size={21}
                    className="mx-auto text-cyan-700"
                  />

                  <p className="mt-2 text-xl font-bold">
                    {completedBooks}
                  </p>

                  <p className="text-xs text-slate-500">
                    Books finished
                  </p>
                </div>
              </div>
            </article>

            <button
              type="button"
              onClick={
                openChapterOfDay
              }
              className="rounded-[28px] border border-[#c8d3db] bg-[#dfe8ee] p-5 text-left text-[#153047] lg:col-span-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Chapter of the Day
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {
                  sharedJourney.reference
                }
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {
                  sharedJourney.title
                }
              </p>

              <div className="mt-5 flex items-center gap-2">
                <Users
                  size={18}
                  className="text-cyan-700"
                />

                <span className="text-sm font-semibold">
                  Read together
                </span>
              </div>

              <div className="mt-5 flex justify-between text-sm">
                <span className="text-slate-500">
                  Day{' '}
                  {
                    sharedJourney.cycleDay
                  }{' '}
                  of{' '}
                  {
                    TOTAL_CYCLE_DAYS
                  }
                </span>

                <span className="font-semibold text-cyan-700">
                  {
                    sharedCycleProgress
                  }
                  %
                </span>
              </div>

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#c8d3db]">
                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{
                    width: `${sharedCycleProgress}%`,
                  }}
                />
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="font-semibold">
                  Open today&apos;s chapter
                </span>

                <ArrowRight
                  size={18}
                  className="text-cyan-700"
                />
              </div>
            </button>
          </section>

          <section className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-[22px] border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047]">
              <CalendarDays
                size={20}
                className="text-cyan-700"
              />

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Shared journey
                </p>

                <p className="mt-1 font-semibold">
                  Day{' '}
                  {
                    sharedJourney.cycleDay
                  }{' '}
                  of{' '}
                  {
                    TOTAL_CYCLE_DAYS
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] border border-orange-300/40 bg-[#e8ddd0] p-4 text-[#153047]">
              <Flame
                size={20}
                className="text-orange-600"
              />

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Hot streak
                </p>

                <p className="mt-1 font-semibold text-orange-600">
                  {currentStreak}{' '}
                  consecutive{' '}
                  {currentStreak === 1
                    ? 'day'
                    : 'days'}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
                  Achievements
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  Your Milestones
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  openAchievements
                }
                className="flex items-center gap-2 rounded-xl border border-orange-300/30 bg-orange-500/10 px-3 py-2 text-sm font-semibold text-orange-400"
              >
                {
                  earnedAchievements.length
                }{' '}
                earned

                <ArrowRight
                  size={16}
                />
              </button>
            </div>

            <div className="mt-4">
              {renderAchievementCards()}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold">
              Progress by Book
            </h2>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {[
                ['all', 'All Books'],
                ['available', 'Available'],
                ['progress', 'My Progress'],
                ['completed', 'Completed'],
                [
                  'development',
                  'In Development',
                ],
              ].map(
                ([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      setBookFilter(
                        id,
                      )
                    }
                    className={`shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-semibold ${
                      bookFilter === id
                        ? 'border-cyan-500 bg-cyan-500 text-[#041326]'
                        : 'border-[#c8d3db] bg-[#dfe8ee] text-[#153047]'
                    }`}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>

            <div className="mt-3 overflow-hidden rounded-[26px] border border-[#c8d3db] bg-[#dfe8ee] text-[#153047]">
              {filteredBooks.map(
                (book) => {
                  const status =
                    book.availability
                      .status

                  const isPartial =
                    status ===
                    'partial'

                  const isDevelopment =
                    status ===
                    'development'

                  return (
                    <div
                      key={book.id}
                      className={`grid grid-cols-[42px_1fr_auto] items-center gap-3 border-b border-[#c8d3db] p-4 last:border-b-0 ${
                        isDevelopment
                          ? 'bg-[#d4dde2]'
                          : ''
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          book.isComplete
                            ? 'bg-cyan-500 text-white'
                            : isDevelopment
                              ? 'bg-[#cbd5da] text-slate-500'
                              : 'bg-[#edf2f4] text-slate-500'
                        }`}
                      >
                        {book.isComplete ? (
                          <Check size={18} />
                        ) : isDevelopment ? (
                          <Lock size={17} />
                        ) : (
                          <BookOpen size={18} />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {book.name}
                        </p>

                        {isDevelopment ? (
                          <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                            <Wrench size={10} />
                            In Development
                          </p>
                        ) : isPartial ? (
                          <p className="mt-1 text-xs text-slate-500">
                            {
                              book
                                .availability
                                .availableChapters
                            }{' '}
                            of{' '}
                            {
                              book.chapters
                            }{' '}
                            available
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500">
                            {
                              book.completed
                            }{' '}
                            of{' '}
                            {
                              book.chapters
                            }{' '}
                            completed
                          </p>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-cyan-700">
                        {book.completed}/
                        {book.chapters}
                      </p>
                    </div>
                  )
                },
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default JourneyPage