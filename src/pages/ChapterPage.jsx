import { useEffect, useMemo, useRef, useState } from 'react'
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
  Quote,
  RotateCcw,
  RotateCw,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import BibleReader from '../components/BibleReader'
import {
  getChapterById,
  getCurrentUser,
  markChapterComplete,
  openChapterPdf,
} from '../services/api'

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

function ChapterPage({
  chapterId = 'john-1',
  onBack,
  onNavigate,
}) {
  const [chapter, setChapter] = useState(null)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('read')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  const [audioCurrentTime, setAudioCurrentTime] =
    useState(0)

  const [audioDuration, setAudioDuration] =
    useState(0)

  const [isCompleting, setIsCompleting] =
    useState(false)

  const [completionMessage, setCompletionMessage] =
    useState('')

  const [notice, setNotice] = useState('')

  const [openSections, setOpenSections] = useState([
    'before-you-read',
  ])

  const audioElementRef = useRef(null)

  const hasLeaderAccess = user?.plan === 'leader'
  const isCompleted = Boolean(chapter?.isCompleted)

  const chapterProgress = useMemo(() => {
    if (!chapter) {
      return 0
    }

    return Math.round(
      (chapter.lessonNumber / chapter.totalLessons) *
        100,
    )
  }, [chapter])

  const audioProgress = useMemo(() => {
    if (!audioDuration) {
      return 0
    }

    return (
      (audioCurrentTime / audioDuration) * 100
    )
  }, [audioCurrentTime, audioDuration])

  const readerLocation = useMemo(() => {
    if (!chapter?.id) {
      return {
        bookId: 'john',
        chapterNumber: 1,
      }
    }

    const match = chapter.id.match(/^(.*)-(\d+)$/)

    if (!match) {
      return {
        bookId: 'john',
        chapterNumber: 1,
      }
    }

    return {
      bookId: match[1],
      chapterNumber: Number(match[2]),
    }
  }, [chapter])

  useEffect(() => {
    async function loadPage() {
      try {
        setIsLoading(true)
        setLoadError('')
        setChapter(null)
        setActiveTab('read')
        setAudioCurrentTime(0)
        setAudioDuration(0)
        setIsPlaying(false)
        setCompletionMessage('')
        setNotice('')

        if (audioElementRef.current) {
          audioElementRef.current.pause()
          audioElementRef.current.currentTime = 0
        }

        const [chapterData, userData] =
          await Promise.all([
            getChapterById(chapterId),
            getCurrentUser(),
          ])

        setChapter(chapterData)
        setUser(userData)
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

  async function completeChapter(
    completionMethod,
  ) {
    if (
      !chapter ||
      chapter.isCompleted ||
      isCompleting
    ) {
      return
    }

    try {
      setIsCompleting(true)
      setCompletionMessage('')

      const result = await markChapterComplete(
        chapter.id,
        completionMethod,
      )

      if (!result.success) {
        throw new Error(
          'Completion could not be saved.',
        )
      }

      setChapter((currentChapter) => ({
        ...currentChapter,
        isCompleted: true,
      }))

      if (completionMethod === 'audio-ended') {
        setCompletionMessage(
          `${chapter.reference} was marked complete because the audio finished.`,
        )
      } else if (
        completionMethod === 'continue'
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

    if (!audioElement || !chapter?.audio.url) {
      setNotice(
        `The audio file could not be found. Confirm that ${
          chapter?.audio.url || 'the audio file'
        } exists inside public.`,
      )

      return
    }

    if (audioElement.paused) {
      audioElement.play().catch(() => {
        setNotice(
          'The audio could not be played.',
        )
      })
    } else {
      audioElement.pause()
    }
  }

  function handleLoadedMetadata(event) {
    const audioElement = event.currentTarget

    setAudioDuration(
      Number.isFinite(audioElement.duration)
        ? audioElement.duration
        : 0,
    )
  }

  function handleAudioTimeUpdate(event) {
    const audioElement = event.currentTarget

    setAudioCurrentTime(
      audioElement.currentTime || 0,
    )

    if (
      Number.isFinite(audioElement.duration)
    ) {
      setAudioDuration(audioElement.duration)
    }
  }

  function handleSeek(event) {
    const audioElement =
      audioElementRef.current

    if (!audioElement) {
      return
    }

    const newTime = Number(
      event.target.value,
    )

    audioElement.currentTime = newTime
    setAudioCurrentTime(newTime)
  }

  function skipAudio(seconds) {
    const audioElement =
      audioElementRef.current

    if (!audioElement) {
      return
    }

    const duration =
      Number.isFinite(audioElement.duration)
        ? audioElement.duration
        : 0

    const newTime = Math.min(
      Math.max(
        audioElement.currentTime + seconds,
        0,
      ),
      duration || Infinity,
    )

    audioElement.currentTime = newTime
    setAudioCurrentTime(newTime)
  }

  function formatAudioTime(seconds) {
    if (!Number.isFinite(seconds)) {
      return '0:00'
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(
      seconds % 60,
    )

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  async function handleAudioEnded() {
    setIsPlaying(false)

    if (audioDuration) {
      setAudioCurrentTime(audioDuration)
    }

    await completeChapter('audio-ended')
  }

  async function handlePdf(pdfUrl, pdfType) {
    const result = await openChapterPdf(
      pdfUrl,
      pdfType,
    )

    if (!result.success) {
      setNotice(result.message)
    }
  }

  function toggleSection(sectionId) {
    setOpenSections((currentSections) => {
      if (
        currentSections.includes(sectionId)
      ) {
        return currentSections.filter(
          (id) => id !== sectionId,
        )
      }

      return [
        ...currentSections,
        sectionId,
      ]
    })
  }

  async function handleContinue() {
    await completeChapter('continue')

    setNotice(
      `${chapter.nextChapter.reference} will open here after the full chapter sequence is connected.`,
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#041326] px-6 text-white">
        <div className="text-center">
          <LoaderCircle
            size={34}
            className="mx-auto animate-spin text-cyan-400"
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading chapter...
          </p>
        </div>
      </div>
    )
  }

  if (loadError || !chapter || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#041326] px-6">
        <div className="max-w-md rounded-3xl border border-red-300/40 bg-[#ead9d9] p-6 text-center text-[#153047] shadow-xl shadow-black/15">
          <CircleAlert
            size={34}
            className="mx-auto text-red-700"
          />

          <h1 className="mt-4 text-xl font-semibold">
            Chapter unavailable
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {loadError ||
              'The chapter could not be loaded.'}
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-xl bg-[#c8d3db] px-4 py-2 text-sm font-semibold transition hover:bg-[#edf2f4]"
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

      <audio
        ref={audioElementRef}
        src={chapter.audio.url}
        preload="metadata"
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() =>
          setIsPlaying(false)
        }
        onTimeUpdate={
          handleAudioTimeUpdate
        }
        onEnded={handleAudioEnded}
      />

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-56 pt-5 sm:px-6 lg:px-8 lg:pb-32 lg:pt-8">
          <header className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                onClick={onBack}
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0c2138] text-slate-300 transition hover:border-cyan-400/35 hover:text-white active:scale-90"
                aria-label="Return to Home"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    {chapter.reference}
                  </h1>

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/35 bg-[#c7dce7] px-2.5 py-1 text-xs font-semibold text-cyan-700">
                      <CheckCircle2 size={14} />
                      Completed
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-400 sm:text-base">
                  {chapter.title}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                completeChapter('manual')
              }
              disabled={
                isCompleted || isCompleting
              }
              className={`hidden shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex ${
                isCompleted
                  ? 'border border-cyan-400/35 bg-[#c7dce7] text-cyan-700'
                  : 'bg-cyan-500 text-white hover:bg-cyan-400 active:scale-95'
              } disabled:cursor-default`}
            >
              {isCompleting ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Check size={17} />
              )}

              {isCompleted
                ? 'Completed'
                : 'Mark Complete'}
            </button>
          </header>

          <section className="mt-5">
            <div className="flex items-center justify-between text-xs text-slate-400 sm:text-sm">
              <span>
                Lesson {chapter.lessonNumber} of{' '}
                {chapter.totalLessons}
              </span>

              <span>
                {chapterProgress}%
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#23384b]">
              <div
                className="h-full rounded-full bg-cyan-500"
                style={{
                  width: `${chapterProgress}%`,
                }}
              />
            </div>
          </section>

          <section className="mt-5 rounded-2xl border border-[#c8d3db] bg-[#dfe8ee] p-1 text-[#153047] shadow-lg shadow-black/10">
            <div className="grid grid-cols-4 gap-1">
              {tabs.map((tab) => {
                const TabIcon = tab.icon
                const isActive =
                  activeTab === tab.id

                const isLeaderTab =
                  tab.id === 'leader'

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-[10px] font-semibold transition min-[375px]:flex-row min-[375px]:gap-1.5 min-[375px]:text-xs sm:text-sm ${
                      isActive
                        ? 'bg-[#c7dce7] text-cyan-700'
                        : 'text-slate-500 hover:bg-[#edf2f4] hover:text-slate-700'
                    }`}
                  >
                    <TabIcon size={17} />

                    <span className="truncate">
                      {tab.label}
                    </span>

                    {isLeaderTab &&
                      !hasLeaderAccess && (
                        <Lock size={11} />
                      )}
                  </button>
                )
              })}
            </div>
          </section>

          {notice && (
            <section className="mt-4 flex items-start gap-3 rounded-2xl border border-cyan-400/30 bg-[#d7e6ec] p-4 text-[#153047]">
              <MessageCircleQuestion
                size={19}
                className="mt-0.5 shrink-0 text-cyan-700"
              />

              <p className="flex-1 text-sm leading-relaxed text-slate-600">
                {notice}
              </p>

              <button
                type="button"
                onClick={() =>
                  setNotice('')
                }
                className="text-xs font-semibold text-cyan-700"
              >
                Close
              </button>
            </section>
          )}

          {completionMessage && (
            <section className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-[#d9e7df] p-4 text-[#153047]">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-emerald-700"
              />

              <p className="text-sm leading-relaxed">
                {completionMessage}
              </p>
            </section>
          )}

          <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:gap-6">
            <div className="space-y-4 lg:col-span-8">
              {activeTab === 'read' && (
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

              {activeTab === 'listen' && (
                <>
                  <section className="rounded-3xl border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-xl shadow-black/15 sm:p-5 lg:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#b8ccd7] bg-[#c7dce7]">
                        <span className="text-sm font-semibold">
                          {chapter.reference}
                        </span>

                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-700">
                          Audio
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                          Listen
                        </p>

                        <h2 className="mt-1 text-base font-semibold sm:text-lg">
                          {chapter.audio.title}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                          {chapter.title}
                        </p>
                      </div>
                    </div>

                    {/* Seekable progress bar */}
                    <div className="mt-6">
                      <input
                        type="range"
                        min="0"
                        max={
                          audioDuration || 0
                        }
                        step="0.1"
                        value={
                          audioCurrentTime
                        }
                        onChange={handleSeek}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#bccbd4] accent-cyan-600"
                        aria-label="Audio progress"
                      />

                      <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>
                          {formatAudioTime(
                            audioCurrentTime,
                          )}
                        </span>

                        <span>
                          {formatAudioTime(
                            audioDuration,
                          ) ||
                            chapter.audio
                              .duration}
                        </span>
                      </div>
                    </div>

                    {/* Playback controls */}
                    <div className="mt-5 flex items-center justify-center gap-5">
                      <button
                        type="button"
                        onClick={() =>
                          skipAudio(-15)
                        }
                        className="group flex flex-col items-center gap-1 text-slate-600 transition hover:text-cyan-700 active:scale-95"
                        aria-label="Go back 15 seconds"
                      >
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#b8ccd7] bg-[#edf2f4] transition group-hover:bg-[#c7dce7]">
                          <RotateCcw
                            size={21}
                          />

                          <span className="absolute text-[9px] font-bold">
                            15
                          </span>
                        </div>

                        <span className="text-[10px] font-semibold">
                          Back
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={toggleAudio}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-90"
                        aria-label={
                          isPlaying
                            ? 'Pause chapter audio'
                            : 'Play chapter audio'
                        }
                      >
                        {isPlaying ? (
                          <Pause
                            size={27}
                            fill="currentColor"
                          />
                        ) : (
                          <Play
                            size={27}
                            fill="currentColor"
                            className="ml-1"
                          />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          skipAudio(15)
                        }
                        className="group flex flex-col items-center gap-1 text-slate-600 transition hover:text-cyan-700 active:scale-95"
                        aria-label="Go forward 15 seconds"
                      >
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#b8ccd7] bg-[#edf2f4] transition group-hover:bg-[#c7dce7]">
                          <RotateCw
                            size={21}
                          />

                          <span className="absolute text-[9px] font-bold">
                            15
                          </span>
                        </div>

                        <span className="text-[10px] font-semibold">
                          Forward
                        </span>
                      </button>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#c8d3db] pt-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck
                          size={16}
                          className="text-cyan-700"
                        />

                        <span>
                          Auto-completes when audio ends
                        </span>
                      </div>

                      <button
                        type="button"
                        className="rounded-lg border border-[#c8d3db] bg-[#edf2f4] px-3 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        1.0x
                      </button>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                        <Quote size={18} />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                          Quote of the Chapter
                        </p>

                        <blockquote className="mt-2 text-sm font-medium leading-relaxed sm:text-base">
                          “{chapter.quote}”
                        </blockquote>

                        <p className="mt-3 text-xs font-semibold text-slate-500">
                          — {chapter.quoteAttribution}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c7dce7] text-cyan-700">
                          <BookOpen size={22} />
                        </div>

                        <div>
                          <h2 className="text-sm font-semibold sm:text-base">
                            Bible Study Guide
                          </h2>

                          <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                            {
                              chapter.studyGuide
                                .description
                            }
                          </p>
                        </div>
                      </div>

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
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#b8ccd7] bg-[#c7dce7] px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-[#d4e5ed] active:scale-95"
                      >
                        <Printer size={17} />
                        Open Study PDF
                      </button>
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'study' && (
                <>
                  <section className="rounded-3xl border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-lg shadow-black/10 sm:p-5">
                    <div className="flex items-start gap-3">
                      <Quote
                        size={21}
                        className="mt-0.5 shrink-0 text-cyan-700"
                      />

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                          Quote of the Chapter
                        </p>

                        <blockquote className="mt-2 text-sm font-medium leading-relaxed sm:text-base">
                          “{chapter.quote}”
                        </blockquote>

                        <p className="mt-3 text-xs font-semibold text-slate-500">
                          — {chapter.quoteAttribution}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    {chapter.studyGuide.sections.map(
                      (section) => {
                        const SectionIcon =
                          sectionIcons[
                            section.id
                          ] || BookOpen

                        const isOpen =
                          openSections.includes(
                            section.id,
                          )

                        return (
                          <article
                            key={section.id}
                            className="overflow-hidden rounded-2xl border border-[#c8d3db] bg-[#dfe8ee] text-[#153047] shadow-lg shadow-black/10"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleSection(
                                  section.id,
                                )
                              }
                              className="flex w-full items-center gap-3 p-4 text-left sm:p-5"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c7dce7] text-cyan-700">
                                <SectionIcon
                                  size={20}
                                />
                              </div>

                              <h2 className="min-w-0 flex-1 text-sm font-semibold sm:text-base">
                                {section.title}
                              </h2>

                              <ChevronDown
                                size={19}
                                className={`shrink-0 text-slate-500 transition ${
                                  isOpen
                                    ? 'rotate-180'
                                    : ''
                                }`}
                              />
                            </button>

                            {isOpen && (
                              <div className="border-t border-[#c8d3db] px-4 pb-5 pt-4 sm:px-5">
                                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                  {
                                    section.content
                                  }
                                </p>
                              </div>
                            )}
                          </article>
                        )
                      },
                    )}
                  </section>

                  <button
                    type="button"
                    onClick={() =>
                      handlePdf(
                        chapter.studyGuide
                          .pdfUrl,
                        'Study Guide',
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#b8ccd7] bg-[#c7dce7] px-4 py-3.5 text-sm font-semibold text-cyan-700 transition hover:bg-[#d4e5ed] active:scale-[0.98]"
                  >
                    <Download size={18} />
                    Open Printable Study Guide PDF
                  </button>
                </>
              )}

              {activeTab === 'leader' && (
                <section
                  className={`rounded-3xl border p-5 text-[#153047] shadow-lg shadow-black/10 sm:p-6 ${
                    hasLeaderAccess
                      ? 'border-[#c8d3db] bg-[#dfe8ee]'
                      : 'border-orange-300/40 bg-[#e8ddd0]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        hasLeaderAccess
                          ? 'bg-[#c7dce7] text-cyan-700'
                          : 'bg-orange-200/70 text-orange-600'
                      }`}
                    >
                      {hasLeaderAccess ? (
                        <Crown size={25} />
                      ) : (
                        <Lock size={23} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">
                          Leader Guide
                        </h2>

                        <span className="rounded-full border border-orange-300/50 bg-orange-200/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                          Leader Plan
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {
                          chapter.leaderGuide
                            .description
                        }
                      </p>
                    </div>
                  </div>

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
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
                    >
                      <Printer size={18} />
                      Open Leader PDF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
                    >
                      <Crown size={18} />
                      Upgrade to Leader Plan
                    </button>
                  )}
                </section>
              )}
            </div>

            <aside className="space-y-4 lg:col-span-4">
              <section className="rounded-3xl border border-orange-300/40 bg-[#e8ddd0] p-5 text-[#153047] shadow-lg shadow-black/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-200/70 text-orange-600">
                    <Crown size={22} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">
                        Leader Guide
                      </h2>

                      {!hasLeaderAccess && (
                        <Lock
                          size={14}
                          className="text-orange-600"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Premium group resources
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {
                    chapter.leaderGuide
                      .description
                  }
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (hasLeaderAccess) {
                      handlePdf(
                        chapter.leaderGuide
                          .pdfUrl,
                        'Leader Guide',
                      )
                    } else {
                      setActiveTab('leader')
                    }
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-300/50 bg-orange-200/70 px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-200"
                >
                  {hasLeaderAccess ? (
                    <>
                      <Printer size={17} />
                      Open Leader PDF
                    </>
                  ) : (
                    <>
                      <Lock size={17} />
                      View Leader Plan
                    </>
                  )}
                </button>
              </section>

              <section className="rounded-3xl border border-emerald-500/25 bg-[#d9e7df] p-5 text-[#153047] shadow-lg shadow-black/10">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={22}
                    className="mt-0.5 shrink-0 text-emerald-700"
                  />

                  <div>
                    <h2 className="font-semibold text-emerald-800">
                      Auto-Completion Enabled
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      This chapter marks complete
                      when the audio finishes, when
                      you mark it manually, or when
                      you continue.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-[76px] z-40 border-t border-white/10 bg-[#041326]/95 p-3 text-white backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <button
            type="button"
            onClick={() =>
              completeChapter('manual')
            }
            disabled={
              isCompleted || isCompleting
            }
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition ${
              isCompleted
                ? 'border-cyan-400/35 bg-[#c7dce7] text-cyan-700'
                : 'border-white/10 bg-[#0c2138] text-slate-300'
            }`}
            aria-label={
              isCompleted
                ? 'Chapter completed'
                : 'Mark chapter complete'
            }
          >
            {isCompleting ? (
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
            ) : (
              <Check size={20} />
            )}
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 text-sm font-semibold text-white transition hover:bg-cyan-400 active:scale-[0.98]"
          >
            <span className="truncate">
              Continue to{' '}
              {
                chapter.nextChapter
                  .reference
              }
            </span>

            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-24 right-0 z-40 hidden border-t border-white/10 bg-[#041326]/95 px-8 py-3 text-white backdrop-blur-xl lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0c2138] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/35 hover:text-white"
          >
            <ArrowLeft size={18} />
            Home
          </button>

          <button
            type="button"
            onClick={() =>
              completeChapter('manual')
            }
            disabled={
              isCompleted || isCompleting
            }
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              isCompleted
                ? 'border border-cyan-400/35 bg-[#c7dce7] text-cyan-700'
                : 'border border-white/10 bg-[#0c2138] text-slate-200 hover:border-cyan-400/35'
            }`}
          >
            {isCompleting ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <CheckCircle2 size={18} />
            )}

            {isCompleted
              ? `${chapter.reference} Completed`
              : `Mark ${chapter.reference} Complete`}
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            Continue to{' '}
            {chapter.nextChapter.reference}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChapterPage