import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Compass,
  Crown,
  Download,
  Headphones,
  Heart,
  LoaderCircle,
  Lock,
  MessageCircleQuestion,
  Pause,
  Play,
  Printer,
  RotateCcw,
  RotateCw,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import AchievementCelebration from '../components/AchievementCelebration'
import BibleReader from '../components/BibleReader'
import {
  achievements,
  readEarnedAchievements,
  syncAchievements,
} from '../utils/achievements'
import {
  calculateCurrentStreak,
  recordCompletionDay,
} from '../utils/streak'
import {
  getChapterById,
  getCurrentUser,
  markChapterComplete,
  openChapterPdf,
} from '../services/api'

const COMPLETED_CHAPTERS_KEY =
  'project326-completed-chapters'

const bibleBookChapterCounts = {
  genesis: 50,
  exodus: 40,
  leviticus: 27,
  numbers: 36,
  deuteronomy: 34,
  joshua: 24,
  judges: 21,
  ruth: 4,
  'first-samuel': 31,
  'second-samuel': 24,
  'first-kings': 22,
  'second-kings': 25,
  'first-chronicles': 29,
  'second-chronicles': 36,
  ezra: 10,
  nehemiah: 13,
  esther: 10,
  job: 42,
  psalms: 150,
  proverbs: 31,
  ecclesiastes: 12,
  'song-of-solomon': 8,
  isaiah: 66,
  jeremiah: 52,
  lamentations: 5,
  ezekiel: 48,
  daniel: 12,
  hosea: 14,
  joel: 3,
  amos: 9,
  obadiah: 1,
  jonah: 4,
  micah: 7,
  nahum: 3,
  habakkuk: 3,
  zephaniah: 3,
  haggai: 2,
  zechariah: 14,
  malachi: 4,
  matthew: 28,
  mark: 16,
  luke: 24,
  john: 21,
  acts: 28,
  romans: 16,
  'first-corinthians': 16,
  'second-corinthians': 13,
  galatians: 6,
  ephesians: 6,
  philippians: 4,
  colossians: 4,
  'first-thessalonians': 5,
  'second-thessalonians': 3,
  'first-timothy': 6,
  'second-timothy': 4,
  titus: 3,
  philemon: 1,
  hebrews: 13,
  james: 5,
  'first-peter': 5,
  'second-peter': 3,
  'first-john': 5,
  'second-john': 1,
  'third-john': 1,
  jude: 1,
  revelation: 22,
}

const tabs = [
  {
    id: 'read',
    label: 'Read',
    icon: BookOpen,
  },
  {
    id: 'listen',
    label: 'Listen',
    icon: Headphones,
  },
  {
    id: 'study',
    label: 'Study',
    icon: ScrollText,
  },
  {
    id: 'leader',
    label: 'Leader',
    icon: Crown,
  },
]

const sectionIcons = {
  'before-you-read': ScrollText,
  'setting-the-scene': Compass,
  observe: Search,
  interpret: BookOpen,
  apply: Heart,
  prayer: Sparkles,
  'memory-verse': BookOpen,
  'community-connection': Heart,
}

function getRequestedChapterTab(
  chapterId,
) {
  try {
    const storedRequest =
      sessionStorage.getItem(
        'project326-chapter-request',
      )

    if (!storedRequest) {
      return 'read'
    }

    const request =
      JSON.parse(storedRequest)

    const validTabs = [
      'read',
      'listen',
      'study',
      'leader',
    ]

    const isFresh =
      request?.createdAt &&
      Date.now() -
        request.createdAt <
        10000

    const matchesChapter =
      !request?.chapterId ||
      request.chapterId ===
        chapterId

    if (
      isFresh &&
      matchesChapter &&
      validTabs.includes(
        request?.tab,
      )
    ) {
      return request.tab
    }
  } catch {
    return 'read'
  }

  return 'read'
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

function saveCompletedChapter(
  chapterId,
) {
  const completed =
    readCompletedChapters()

  if (
    completed.includes(
      chapterId,
    )
  ) {
    return completed
  }

  const updated = [
    ...completed,
    chapterId,
  ]

  localStorage.setItem(
    COMPLETED_CHAPTERS_KEY,
    JSON.stringify(updated),
  )

  window.dispatchEvent(
    new CustomEvent(
      'project326-completion-change',
      {
        detail: {
          chapterId,
          completed: true,
        },
      },
    ),
  )

  return updated
}

function getCompletedBookCount(
  completedChapterIds,
) {
  return Object.entries(
    bibleBookChapterCounts,
  ).filter(
    ([
      bookId,
      totalChapters,
    ]) => {
      for (
        let chapterNumber = 1;
        chapterNumber <=
        totalChapters;
        chapterNumber += 1
      ) {
        if (
          !completedChapterIds.includes(
            `${bookId}-${chapterNumber}`,
          )
        ) {
          return false
        }
      }

      return true
    },
  ).length
}

function ChapterPage({
  chapterId = 'john-1',
  onBack,
  onNavigate,
}) {
  const [chapter, setChapter] =
    useState(null)

  const [user, setUser] =
    useState(null)

  const [
    activeTab,
    setActiveTab,
  ] = useState(() =>
    getRequestedChapterTab(
      chapterId,
    ),
  )

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    loadError,
    setLoadError,
  ] = useState('')

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false)

  const [
    audioCurrentTime,
    setAudioCurrentTime,
  ] = useState(0)

  const [
    audioDuration,
    setAudioDuration,
  ] = useState(0)

  const [
    isCompleting,
    setIsCompleting,
  ] = useState(false)

  const [
    completionMessage,
    setCompletionMessage,
  ] = useState('')

  const [
    notice,
    setNotice,
  ] = useState('')

  const [
    openSections,
    setOpenSections,
  ] = useState([
    'before-you-read',
  ])

  const [
    achievementCelebration,
    setAchievementCelebration,
  ] = useState(null)

  const audioElementRef =
    useRef(null)

  const hasLeaderAccess =
    user?.plan === 'leader'

  const isCompleted =
    Boolean(
      chapter?.isCompleted,
    ) ||
    readCompletedChapters().includes(
      chapter?.id,
    )

  const chapterProgress =
    useMemo(() => {
      if (!chapter) {
        return 0
      }

      return Math.round(
        (chapter.lessonNumber /
          chapter.totalLessons) *
          100,
      )
    }, [chapter])

  const readerLocation =
    useMemo(() => {
      if (!chapter?.id) {
        return {
          bookId: 'john',
          chapterNumber: 1,
        }
      }

      const match =
        chapter.id.match(
          /^(.*)-(\d+)$/,
        )

      if (!match) {
        return {
          bookId: 'john',
          chapterNumber: 1,
        }
      }

      return {
        bookId: match[1],
        chapterNumber: Number(
          match[2],
        ),
      }
    }, [chapter])

  useEffect(() => {
    async function loadPage() {
      try {
        setIsLoading(true)
        setLoadError('')
        setChapter(null)
        setAudioCurrentTime(0)
        setAudioDuration(0)
        setIsPlaying(false)
        setCompletionMessage('')
        setNotice('')
        setAchievementCelebration(
          null,
        )

        setActiveTab(
          getRequestedChapterTab(
            chapterId,
          ),
        )

        if (
          audioElementRef.current
        ) {
          audioElementRef.current.pause()
          audioElementRef.current.currentTime =
            0
        }

        const [
          chapterData,
          userData,
        ] = await Promise.all([
          getChapterById(
            chapterId,
          ),
          getCurrentUser(),
        ])

        const completedLocally =
          readCompletedChapters().includes(
            chapterData.id,
          )

        setChapter({
          ...chapterData,
          isCompleted:
            chapterData.isCompleted ||
            completedLocally,
        })

        setUser(userData)

        sessionStorage.removeItem(
          'project326-chapter-request',
        )
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Unable to load the chapter.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPage()
  }, [chapterId])

  function checkForAchievements(
    completedChapterIds,
  ) {
    const previousEarned =
      new Set(
        readEarnedAchievements(),
      )

    const metrics = {
      chaptersCompleted:
        completedChapterIds.length,
      completedBooks:
        getCompletedBookCount(
          completedChapterIds,
        ),
      currentStreak:
        calculateCurrentStreak(),
    }

    const updatedEarned =
      syncAchievements(metrics)

    const newlyEarnedIds =
      updatedEarned.filter(
        (achievementId) =>
          !previousEarned.has(
            achievementId,
          ),
      )

    if (
      newlyEarnedIds.length === 0
    ) {
      return
    }

    const newlyEarned =
      newlyEarnedIds
        .map((achievementId) =>
          achievements.find(
            (achievement) =>
              achievement.id ===
              achievementId,
          ),
        )
        .filter(Boolean)

    if (
      newlyEarned.length === 0
    ) {
      return
    }

    setAchievementCelebration({
      achievement:
        newlyEarned[0],
      additionalCount:
        Math.max(
          newlyEarned.length - 1,
          0,
        ),
    })
  }

  async function completeChapter(
    completionMethod,
  ) {
    if (
      !chapter ||
      isCompleted ||
      isCompleting
    ) {
      return
    }

    try {
      setIsCompleting(true)
      setCompletionMessage('')

      const result =
        await markChapterComplete(
          chapter.id,
          completionMethod,
        )

      if (!result.success) {
        throw new Error(
          'Completion could not be saved.',
        )
      }

      const updatedCompleted =
        saveCompletedChapter(
          chapter.id,
        )

      recordCompletionDay()

      checkForAchievements(
        updatedCompleted,
      )

      setChapter(
        (currentChapter) => ({
          ...currentChapter,
          isCompleted: true,
        }),
      )

      if (
        completionMethod ===
        'audio-ended'
      ) {
        setCompletionMessage(
          `${chapter.reference} was marked complete because the audio finished.`,
        )
      } else if (
        completionMethod ===
        'continue'
      ) {
        setCompletionMessage(
          `${chapter.reference} was completed. You are ready for ${chapter.nextChapter.reference}.`,
        )
      } else {
        setCompletionMessage(
          `${chapter.reference} has been marked complete.`,
        )
      }
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Unable to save your progress.',
      )
    } finally {
      setIsCompleting(false)
    }
  }

  function toggleAudio() {
    const audioElement =
      audioElementRef.current

    if (
      !audioElement ||
      !chapter?.audio.url
    ) {
      setNotice(
        'The audio could not be played.',
      )

      return
    }

    if (audioElement.paused) {
      audioElement
        .play()
        .catch(() => {
          setNotice(
            'The audio could not be played.',
          )
        })
    } else {
      audioElement.pause()
    }
  }

  function handleLoadedMetadata(
    event,
  ) {
    const audioElement =
      event.currentTarget

    setAudioDuration(
      Number.isFinite(
        audioElement.duration,
      )
        ? audioElement.duration
        : 0,
    )
  }

  function handleAudioTimeUpdate(
    event,
  ) {
    const audioElement =
      event.currentTarget

    setAudioCurrentTime(
      audioElement.currentTime ||
        0,
    )

    if (
      Number.isFinite(
        audioElement.duration,
      )
    ) {
      setAudioDuration(
        audioElement.duration,
      )
    }
  }

  function handleSeek(event) {
    const audioElement =
      audioElementRef.current

    if (!audioElement) {
      return
    }

    const newTime =
      Number(
        event.target.value,
      )

    audioElement.currentTime =
      newTime

    setAudioCurrentTime(
      newTime,
    )
  }

  function skipAudio(seconds) {
    const audioElement =
      audioElementRef.current

    if (!audioElement) {
      return
    }

    const duration =
      Number.isFinite(
        audioElement.duration,
      )
        ? audioElement.duration
        : 0

    const newTime = Math.min(
      Math.max(
        audioElement.currentTime +
          seconds,
        0,
      ),
      duration ||
        Infinity,
    )

    audioElement.currentTime =
      newTime

    setAudioCurrentTime(
      newTime,
    )
  }

  function formatAudioTime(
    seconds,
  ) {
    if (
      !Number.isFinite(
        seconds,
      )
    ) {
      return '0:00'
    }

    const minutes =
      Math.floor(
        seconds / 60,
      )

    const remainingSeconds =
      Math.floor(
        seconds % 60,
      )

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  async function handleAudioEnded() {
    setIsPlaying(false)

    if (audioDuration) {
      setAudioCurrentTime(
        audioDuration,
      )
    }

    await completeChapter(
      'audio-ended',
    )
  }

  async function handlePdf(
    pdfUrl,
    pdfType,
  ) {
    const result =
      await openChapterPdf(
        pdfUrl,
        pdfType,
      )

    if (!result.success) {
      setNotice(
        result.message,
      )
    }
  }

  function toggleSection(
    sectionId,
  ) {
    setOpenSections(
      (currentSections) => {
        if (
          currentSections.includes(
            sectionId,
          )
        ) {
          return currentSections.filter(
            (id) =>
              id !==
              sectionId,
          )
        }

        return [
          ...currentSections,
          sectionId,
        ]
      },
    )
  }

  async function handleContinue() {
    await completeChapter(
      'continue',
    )

    setNotice(
      `${chapter.nextChapter.reference} will open here after the full chapter sequence is connected.`,
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#041326] px-6 text-white">
        <LoaderCircle
          size={34}
          className="animate-spin text-cyan-400"
        />
      </div>
    )
  }

  if (
    loadError ||
    !chapter ||
    !user
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#041326] px-6">
        <div className="max-w-md rounded-3xl border border-red-300/40 bg-[#ead9d9] p-6 text-center text-[#153047]">
          <CircleAlert
            size={34}
            className="mx-auto text-red-700"
          />

          <h1 className="mt-4 text-xl font-semibold">
            Chapter unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {loadError}
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-xl bg-[#c8d3db] px-4 py-2 text-sm font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation
        activePage="dashboard"
        onNavigate={onNavigate}
      />

      <AchievementCelebration
        achievement={
          achievementCelebration?.achievement
        }
        additionalCount={
          achievementCelebration?.additionalCount ||
          0
        }
        onClose={() =>
          setAchievementCelebration(
            null,
          )
        }
      />

      <audio
        ref={audioElementRef}
        src={chapter.audio.url}
        preload="metadata"
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onPlay={() =>
          setIsPlaying(true)
        }
        onPause={() =>
          setIsPlaying(false)
        }
        onTimeUpdate={
          handleAudioTimeUpdate
        }
        onEnded={
          handleAudioEnded
        }
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-56 pt-5 sm:px-6 lg:px-8 lg:pb-32 lg:pt-8">
          <header className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                onClick={onBack}
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0c2138] text-slate-300"
              >
                <ArrowLeft
                  size={20}
                />
              </button>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {
                      chapter.reference
                    }
                  </h1>

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#c7dce7] px-2.5 py-1 text-xs font-semibold text-cyan-700">
                      <CheckCircle2
                        size={14}
                      />
                      Completed
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {chapter.title}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                completeChapter(
                  'manual',
                )
              }
              disabled={
                isCompleted ||
                isCompleting
              }
              className={`hidden rounded-xl px-4 py-2.5 text-sm font-semibold sm:flex ${
                isCompleted
                  ? 'bg-[#c7dce7] text-cyan-700'
                  : 'bg-cyan-500 text-white'
              }`}
            >
              <Check size={17} />

              {isCompleted
                ? 'Completed'
                : 'Mark Complete'}
            </button>
          </header>

          <section className="mt-5 rounded-2xl border border-[#c8d3db] bg-[#dfe8ee] p-1 text-[#153047]">
            <div className="grid grid-cols-4 gap-1">
              {tabs.map(
                (tab) => {
                  const TabIcon =
                    tab.icon

                  const active =
                    activeTab ===
                    tab.id

                  const leaderUpsell =
                    tab.id ===
                      'leader' &&
                    !hasLeaderAccess

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          tab.id,
                        )
                      }
                      className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-semibold ${
                        active
                          ? leaderUpsell
                            ? 'bg-[#e8ddd0] text-orange-600'
                            : 'bg-[#c7dce7] text-cyan-700'
                          : leaderUpsell
                            ? 'text-orange-600'
                            : 'text-slate-500'
                      }`}
                    >
                      <TabIcon
                        size={17}
                      />
                      {tab.label}

                      {leaderUpsell && (
                        <Lock
                          size={11}
                        />
                      )}
                    </button>
                  )
                },
              )}
            </div>
          </section>

          {completionMessage && (
            <section className="mt-4 rounded-2xl bg-[#d9e7df] p-4 text-sm text-[#153047]">
              {
                completionMessage
              }
            </section>
          )}

          {notice && (
            <section className="mt-4 flex items-center gap-3 rounded-2xl bg-[#d7e6ec] p-4 text-[#153047]">
              <MessageCircleQuestion
                size={18}
                className="text-cyan-700"
              />

              <p className="flex-1 text-sm">
                {notice}
              </p>
            </section>
          )}

          <div className="mt-5">
            {activeTab ===
              'read' && (
              <BibleReader
                key={chapter.id}
                initialBookId={
                  readerLocation.bookId
                }
                initialChapter={
                  readerLocation.chapterNumber
                }
              />
            )}

            {activeTab ===
              'listen' && (
              <section className="rounded-3xl bg-[#dfe8ee] p-5 text-[#153047]">
                <h2 className="font-semibold">
                  {
                    chapter.audio.title
                  }
                </h2>

                <input
                  type="range"
                  min="0"
                  max={
                    audioDuration ||
                    0
                  }
                  value={
                    audioCurrentTime
                  }
                  onChange={
                    handleSeek
                  }
                  className="mt-6 w-full accent-cyan-600"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>
                    {formatAudioTime(
                      audioCurrentTime,
                    )}
                  </span>

                  <span>
                    {audioDuration
                      ? formatAudioTime(
                          audioDuration,
                        )
                      : chapter.audio
                          .duration}
                  </span>
                </div>

                <div className="mt-5 flex justify-center gap-6">
                  <button
                    type="button"
                    onClick={() =>
                      skipAudio(-15)
                    }
                  >
                    <RotateCcw
                      size={22}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={
                      toggleAudio
                    }
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-white"
                  >
                    {isPlaying ? (
                      <Pause
                        size={27}
                      />
                    ) : (
                      <Play
                        size={27}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      skipAudio(15)
                    }
                  >
                    <RotateCw
                      size={22}
                    />
                  </button>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-[#c8d3db] pt-4 text-xs text-slate-500">
                  <ShieldCheck
                    size={16}
                    className="text-cyan-700"
                  />
                  Auto-completes when audio ends
                </div>
              </section>
            )}

            {activeTab ===
              'study' && (
              <div className="space-y-3">
                {chapter.studyGuide.sections.map(
                  (section) => {
                    const SectionIcon =
                      sectionIcons[
                        section.id
                      ] ||
                      BookOpen

                    const open =
                      openSections.includes(
                        section.id,
                      )

                    return (
                      <section
                        key={
                          section.id
                        }
                        className="overflow-hidden rounded-2xl bg-[#dfe8ee] text-[#153047]"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleSection(
                              section.id,
                            )
                          }
                          className="flex w-full items-center gap-3 p-4 text-left"
                        >
                          <SectionIcon
                            size={19}
                            className="text-cyan-700"
                          />

                          <span className="flex-1 font-semibold">
                            {
                              section.title
                            }
                          </span>

                          <ChevronDown
                            size={18}
                            className={
                              open
                                ? 'rotate-180'
                                : ''
                            }
                          />
                        </button>

                        {open && (
                          <div className="border-t border-[#c8d3db] p-4 text-sm leading-7 text-slate-600">
                            {
                              section.content
                            }
                          </div>
                        )}
                      </section>
                    )
                  },
                )}

                <button
                  type="button"
                  onClick={() =>
                    handlePdf(
                      chapter
                        .studyGuide
                        .pdfUrl,
                      'Study Guide',
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c7dce7] p-3 text-sm font-semibold text-cyan-700"
                >
                  <Download
                    size={18}
                  />
                  Open Study Guide PDF
                </button>
              </div>
            )}

            {activeTab ===
              'leader' && (
              <section
                className={`rounded-3xl p-5 text-[#153047] ${
                  hasLeaderAccess
                    ? 'bg-[#dfe8ee]'
                    : 'bg-[#e8ddd0]'
                }`}
              >
                <h2 className="font-semibold">
                  Leader Guide
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {
                    chapter
                      .leaderGuide
                      .description
                  }
                </p>

                {hasLeaderAccess ? (
                  <button
                    type="button"
                    onClick={() =>
                      handlePdf(
                        chapter
                          .leaderGuide
                          .pdfUrl,
                        'Leader Guide',
                      )
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 p-3 text-sm font-semibold text-white"
                  >
                    <Printer
                      size={18}
                    />
                    Open Leader PDF
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 p-3 text-sm font-semibold text-white"
                  >
                    <Crown
                      size={18}
                    />
                    Unlock Leader Guides
                  </button>
                )}
              </section>
            )}
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-[76px] z-40 border-t border-white/10 bg-[#041326]/95 p-3 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={
            handleContinue
          }
          className="mx-auto flex h-12 w-full max-w-md items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 text-sm font-semibold"
        >
          Continue to{' '}
          {
            chapter
              .nextChapter
              .reference
          }

          <ArrowRight
            size={18}
          />
        </button>
      </div>
    </div>
  )
}

export default ChapterPage