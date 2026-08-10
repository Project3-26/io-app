import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CircleAlert,
  Crown,
  Headphones,
  LoaderCircle,
  Lock,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ScrollText,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import BibleReader from '../components/BibleReader'
import CompassAssistant from '../components/CompassAssistant'
import StudySummaryAccordion from '../components/StudySummaryAccordion'
import {
  getChapterById,
  getCurrentUser,
  markChapterComplete,
  openChapterPdf,
} from '../services/api'
import { prefetchBibleChapter } from '../services/backend'

const COMPLETED_CHAPTERS_KEY = 'project326-completed-chapters'
const LAST_OPENED_CHAPTER_KEY = 'project326-last-opened-chapter'

const tabs = [
  { id: 'read', label: 'Read', icon: BookOpen },
  { id: 'listen', label: 'Listen', icon: Headphones },
  { id: 'study', label: 'Study', icon: ScrollText },
  { id: 'leader', label: 'Leader', icon: Crown },
]

function getRequestedChapterTab(chapterId) {
  try {
    const raw = sessionStorage.getItem('project326-chapter-request')
    if (!raw) return 'read'
    const request = JSON.parse(raw)
    const fresh = request?.createdAt && Date.now() - request.createdAt < 10000
    const matches = !request?.chapterId || request.chapterId === chapterId
    return fresh && matches && tabs.some((tab) => tab.id === request?.tab)
      ? request.tab
      : 'read'
  } catch {
    return 'read'
  }
}

function parseChapterLocation(chapterId) {
  const match = String(chapterId || '').match(/^(.*)-(\d+)$/)
  return match
    ? { bookId: match[1], chapterNumber: Number(match[2]) }
    : { bookId: 'john', chapterNumber: 1 }
}

function readCompletedChapters() {
  try {
    const value = JSON.parse(localStorage.getItem(COMPLETED_CHAPTERS_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function rememberCompleted(chapterId) {
  const current = readCompletedChapters()
  if (current.includes(chapterId)) return
  localStorage.setItem(COMPLETED_CHAPTERS_KEY, JSON.stringify([...current, chapterId]))
  window.dispatchEvent(
    new CustomEvent('project326-completion-change', {
      detail: { chapterId, completed: true },
    }),
  )
}

function rememberLastOpened(chapter, activeTab) {
  if (!chapter?.id) return
  localStorage.setItem(
    LAST_OPENED_CHAPTER_KEY,
    JSON.stringify({
      id: chapter.id,
      reference: chapter.reference,
      title: chapter.title,
      tab: activeTab,
      openedAt: Date.now(),
    }),
  )
  window.dispatchEvent(new CustomEvent('project326-last-opened-change'))
}

function ChapterPage({ chapterId = 'john-1', onBack, onNavigate }) {
  const [chapter, setChapter] = useState(null)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState(() => getRequestedChapterTab(chapterId))
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState('')
  const [isCompleting, setIsCompleting] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [loadVersion, setLoadVersion] = useState(0)
  const audioRef = useRef(null)

  const readerLocation = useMemo(
    () => parseChapterLocation(chapter?.id || chapterId),
    [chapter, chapterId],
  )

  const hasLeaderAccess = user?.plan === 'leader'
  const isCompleted =
    Boolean(chapter?.isCompleted) || readCompletedChapters().includes(chapter?.id)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setIsLoading(true)
        setLoadError('')
        setNotice('')
        setActiveTab(getRequestedChapterTab(chapterId))
        setAudioCurrentTime(0)
        setAudioDuration(0)
        setIsPlaying(false)

        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }

        const location = parseChapterLocation(chapterId)
        prefetchBibleChapter(location.bookId, location.chapterNumber)

        const [nextChapter, nextUser] = await Promise.all([
          getChapterById(chapterId),
          getCurrentUser(),
        ])

        if (!mounted) return
        setChapter({
          ...nextChapter,
          isCompleted:
            nextChapter.isCompleted || readCompletedChapters().includes(nextChapter.id),
        })
        setUser(nextUser)
        sessionStorage.removeItem('project326-chapter-request')
      } catch (error) {
        if (mounted) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load the chapter.')
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [chapterId, loadVersion])

  useEffect(() => {
    if (!chapter?.id) return
    rememberLastOpened(chapter, activeTab)
  }, [chapter, activeTab])

  async function completeChapter(method) {
    if (!chapter || isCompleting) return false
    if (isCompleted && method !== 'continue') return true

    try {
      setIsCompleting(true)
      setNotice('')

      if (!isCompleted) {
        const result = await markChapterComplete(chapter.id, method)
        if (!result?.success) throw new Error('Completion could not be saved.')
        rememberCompleted(chapter.id)
        setChapter((current) => ({ ...current, isCompleted: true }))
      } else if (method === 'continue' && chapter.nextChapter?.id) {
        openChapter(chapter.nextChapter.id, 'read')
      }

      return true
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save your progress.')
      return false
    } finally {
      setIsCompleting(false)
    }
  }

  function openChapter(nextChapterId, tab = 'read') {
    if (!nextChapterId) return
    const location = parseChapterLocation(nextChapterId)
    prefetchBibleChapter(location.bookId, location.chapterNumber)
    sessionStorage.setItem(
      'project326-chapter-request',
      JSON.stringify({ chapterId: nextChapterId, tab, createdAt: Date.now() }),
    )
    window.dispatchEvent(
      new CustomEvent('project326-open-chapter', {
        detail: { chapterId: nextChapterId, source: 'reader-navigation' },
      }),
    )
  }

  async function handleContinue() {
    if (!chapter?.nextChapter?.id) return
    await completeChapter('continue')
  }

  function toggleAudio() {
    const audio = audioRef.current
    if (!audio || !chapter?.audio?.url) return

    if (audio.paused) {
      audio.play().catch(() => setNotice('The audio could not be played.'))
    } else {
      audio.pause()
    }
  }

  function handleLoadedMetadata(event) {
    const audio = event.currentTarget
    setAudioDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
  }

  function handleAudioTimeUpdate(event) {
    const audio = event.currentTarget
    setAudioCurrentTime(audio.currentTime || 0)
    if (Number.isFinite(audio.duration)) setAudioDuration(audio.duration)
  }

  function handleSeek(event) {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Number(event.target.value)
    audio.currentTime = newTime
    setAudioCurrentTime(newTime)
  }

  function skipAudio(seconds) {
    const audio = audioRef.current
    if (!audio) return

    const duration = Number.isFinite(audio.duration) ? audio.duration : 0
    const newTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      duration || Infinity,
    )

    audio.currentTime = newTime
    setAudioCurrentTime(newTime)
  }

  function formatAudioTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  async function handleAudioEnded() {
    setIsPlaying(false)
    if (audioDuration) setAudioCurrentTime(audioDuration)
    await completeChapter('audio-ended')
  }

  async function handlePdf(url, label) {
    const result = await openChapterPdf(url, label)
    if (!result.success) setNotice(result.message)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#041326] text-white">
        <AppNavigation activePage="dashboard" onNavigate={onNavigate} />
        <div className="flex min-h-screen items-center justify-center lg:pl-24">
          <div className="text-center">
            <LoaderCircle size={34} className="mx-auto animate-spin text-cyan-400" />
            <p className="mt-3 text-sm text-slate-400">
              Opening {chapterId.replace('-', ' ')}…
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loadError || !chapter || !user) {
    return (
      <div className="min-h-screen bg-[#041326] px-6 text-white">
        <AppNavigation activePage="dashboard" onNavigate={onNavigate} />
        <div className="flex min-h-screen items-center justify-center lg:pl-24">
          <div className="w-full max-w-md rounded-3xl border border-red-300/40 bg-[#ead9d9] p-6 text-center text-[#153047]">
            <CircleAlert size={34} className="mx-auto text-red-700" />
            <h1 className="mt-4 text-xl font-semibold">Chapter unavailable</h1>
            <p className="mt-2 text-sm text-slate-600">
              {loadError || 'We could not load this chapter.'}
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setLoadVersion((value) => value + 1)}
                className="inline-flex items-center gap-2 bg-cyan-600 px-4 py-2 text-sm font-semibold text-white"
              >
                <RefreshCw size={15} /> Retry
              </button>
              <button
                type="button"
                onClick={onBack}
                className="bg-[#c8d3db] px-4 py-2 text-sm font-semibold"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const audioExists = chapter.contentAvailability?.audio
  const studyExists = chapter.contentAvailability?.study
  const leaderExists = chapter.contentAvailability?.leaderGuide

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="dashboard" onNavigate={onNavigate} />

      {chapter.audio?.url && (
        <audio
          ref={audioRef}
          src={chapter.audio.url}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={handleAudioEnded}
        />
      )}

      <div className="lg:pl-24">
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-56 pt-5 sm:px-6 lg:px-8 lg:pb-32 lg:pt-8">
          <header className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                onClick={onBack}
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-[#0c2138] text-slate-300"
                aria-label="Back"
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold sm:text-3xl">{chapter.reference}</h1>
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 bg-[#c7dce7] px-2.5 py-1 text-xs font-semibold text-cyan-700">
                      <Check size={13} /> Completed
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-400">{chapter.title}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => completeChapter('manual')}
              disabled={isCompleted || isCompleting}
              className="hidden bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:bg-[#c7dce7] disabled:text-cyan-700 sm:inline-flex"
            >
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          </header>

          <CompassAssistant currentPage="chapter" chapterId={chapter.id} placement="floating" />

          <section className="mt-5 border border-[#c8d3db] bg-[#dfe8ee] p-1 text-[#153047]">
            <div className="grid grid-cols-4 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const lockedLeader = tab.id === 'leader' && !hasLeaderAccess
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 p-2.5 text-xs font-semibold ${
                      active
                        ? lockedLeader
                          ? 'bg-[#e8ddd0] text-orange-600'
                          : 'bg-[#c7dce7] text-cyan-700'
                        : lockedLeader
                          ? 'text-orange-600'
                          : 'text-slate-500'
                    }`}
                  >
                    <Icon size={17} />
                    {tab.label}
                    {lockedLeader && <Lock size={11} />}
                  </button>
                )
              })}
            </div>
          </section>

          {notice && (
            <section className="mt-4 border border-cyan-300/20 bg-[#d7e6ec] p-4 text-sm text-[#153047]">
              {notice}
            </section>
          )}

          <div className="mt-5">
            {activeTab === 'read' && (
              <BibleReader
                key={chapter.id}
                initialBookId={readerLocation.bookId}
                initialChapter={readerLocation.chapterNumber}
              />
            )}

            {activeTab === 'listen' &&
              (chapter.audio?.locked ? (
                <UnavailablePanel
                  title="Audio is available with Bible Study access"
                  description="This chapter has audio ready, but your current access does not include it."
                  locked
                />
              ) : chapter.audio?.url ? (
                <section className="rounded-3xl border border-[#c8d3db] bg-[#dfe8ee] p-4 text-[#153047] shadow-xl shadow-black/15 sm:p-5 lg:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#b8ccd7] bg-[#c7dce7]">
                      <span className="text-sm font-semibold">{chapter.reference}</span>
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
                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">{chapter.title}</p>
                      {chapter.audio.body && (
                        <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-500 sm:text-sm">
                          {chapter.audio.body}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <input
                      type="range"
                      min="0"
                      max={audioDuration || 0}
                      step="0.1"
                      value={audioCurrentTime}
                      onChange={handleSeek}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#bccbd4] accent-cyan-600"
                      aria-label="Audio progress"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>{formatAudioTime(audioCurrentTime)}</span>
                      <span>{formatAudioTime(audioDuration)}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-5">
                    <button
                      type="button"
                      onClick={() => skipAudio(-15)}
                      className="group flex flex-col items-center gap-1 text-slate-600 transition hover:text-cyan-700 active:scale-95"
                      aria-label="Go back 15 seconds"
                    >
                      <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#b8ccd7] bg-[#edf2f4] transition group-hover:bg-[#c7dce7]">
                        <RotateCcw size={21} />
                        <span className="absolute text-[9px] font-bold">15</span>
                      </div>
                      <span className="text-[10px] font-semibold">Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleAudio}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-90"
                      aria-label={isPlaying ? 'Pause chapter audio' : 'Play chapter audio'}
                    >
                      {isPlaying ? (
                        <Pause size={27} fill="currentColor" />
                      ) : (
                        <Play size={27} fill="currentColor" className="ml-1" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => skipAudio(15)}
                      className="group flex flex-col items-center gap-1 text-slate-600 transition hover:text-cyan-700 active:scale-95"
                      aria-label="Go forward 15 seconds"
                    >
                      <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#b8ccd7] bg-[#edf2f4] transition group-hover:bg-[#c7dce7]">
                        <RotateCw size={21} />
                        <span className="absolute text-[9px] font-bold">15</span>
                      </div>
                      <span className="text-[10px] font-semibold">Forward</span>
                    </button>
                  </div>
                </section>
              ) : (
                <UnavailablePanel
                  title={
                    audioExists
                      ? 'Audio is temporarily unavailable'
                      : 'Audio isn’t loaded for this chapter yet'
                  }
                  description={
                    audioExists
                      ? 'The resource exists, but its file could not be opened. Try again shortly.'
                      : 'Scripture is fully available. Audio will appear here automatically when it is published from Admin.'
                  }
                />
              ))}

            {activeTab === 'study' &&
              (chapter.studyGuide?.locked ? (
                <UnavailablePanel
                  title="Study content is available with Bible Study access"
                  description="This chapter has study content ready, but your current access does not include it."
                  locked
                />
              ) : chapter.studyGuide?.pdfUrl ||
                chapter.studyGuide?.body ||
                chapter.studyGuide?.sections?.length ? (
                <section className="bg-[#dfe8ee] p-5 text-[#153047]">
                  <h2 className="font-semibold">{chapter.studyGuide.title || 'Study'}</h2>
                  {chapter.studyGuide.description && (
                    <p className="mt-2 text-sm text-slate-600">
                      {chapter.studyGuide.description}
                    </p>
                  )}

                  <StudySummaryAccordion sections={chapter.studyGuide.sections} />

                  {chapter.studyGuide.body && (
                    <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {chapter.studyGuide.body}
                    </div>
                  )}

                  {chapter.studyGuide.pdfUrl && (
                    <button
                      type="button"
                      onClick={() => handlePdf(chapter.studyGuide.pdfUrl, 'Study Guide')}
                      className="mt-5 bg-cyan-600 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Open Study Guide
                    </button>
                  )}
                </section>
              ) : (
                <UnavailablePanel
                  title={
                    studyExists
                      ? 'Study content is temporarily unavailable'
                      : 'Study content isn’t loaded yet'
                  }
                  description={
                    studyExists
                      ? 'The resource exists, but its content could not be opened. Try again shortly.'
                      : 'You can still read the complete chapter now. Published study content will appear here automatically.'
                  }
                />
              ))}

            {activeTab === 'leader' &&
              (!hasLeaderAccess || chapter.leaderGuide?.locked ? (
                <UnavailablePanel
                  title="Leader Guides are a separate plan"
                  description={
                    leaderExists
                      ? 'A Leader Guide is ready for this chapter. Leader access unlocks it.'
                      : 'Leader access unlocks pastor and small-group leader resources as they are published.'
                  }
                  accent="orange"
                  locked
                />
              ) : chapter.leaderGuide?.pdfUrl || chapter.leaderGuide?.body ? (
                <section className="bg-[#dfe8ee] p-5 text-[#153047]">
                  <h2 className="font-semibold">
                    {chapter.leaderGuide.title || 'Leader Guide'}
                  </h2>
                  {chapter.leaderGuide.body && (
                    <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {chapter.leaderGuide.body}
                    </div>
                  )}
                  {chapter.leaderGuide.pdfUrl && (
                    <button
                      type="button"
                      onClick={() => handlePdf(chapter.leaderGuide.pdfUrl, 'Leader Guide')}
                      className="mt-5 bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Open Leader Guide
                    </button>
                  )}
                </section>
              ) : (
                <UnavailablePanel
                  title="Leader Guide isn’t loaded for this chapter yet"
                  description="Your Leader access is active. The guide will appear here automatically when it is published."
                  accent="orange"
                />
              ))}
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-[76px] z-40 border-t border-white/10 bg-[#041326]/95 p-3 backdrop-blur-xl lg:bottom-0 lg:left-24">
        <div className="mx-auto flex w-full max-w-xl gap-2">
          {chapter.previousChapter?.id && (
            <button
              type="button"
              onClick={() => openChapter(chapter.previousChapter.id, 'read')}
              className="flex h-12 shrink-0 items-center justify-center gap-2 border border-white/10 bg-[#0c2138] px-4 text-sm font-semibold text-slate-200"
              aria-label={`Previous chapter, ${chapter.previousChapter.reference}`}
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>
          )}

          {chapter.nextChapter?.id ? (
            <button
              type="button"
              onClick={handleContinue}
              disabled={isCompleting}
              className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 bg-cyan-500 px-4 text-sm font-semibold disabled:opacity-60"
            >
              {isCompleting ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <>
                  <span className="truncate">
                    Continue to {chapter.nextChapter.reference}
                  </span>
                  <ArrowRight size={18} className="shrink-0" />
                </>
              )}
            </button>
          ) : !isCompleted ? (
            <button
              type="button"
              onClick={() => completeChapter('manual')}
              disabled={isCompleting}
              className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 bg-cyan-500 px-4 text-sm font-semibold disabled:opacity-60"
            >
              <Check size={18} /> Finish Bible Journey
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function UnavailablePanel({ title, description, accent = 'cyan', locked = false }) {
  return (
    <section
      className={`border p-6 text-[#153047] ${
        accent === 'orange'
          ? 'border-orange-300/40 bg-[#e8ddd0]'
          : 'border-[#c8d3db] bg-[#dfe8ee]'
      }`}
    >
      <div className="flex items-start gap-3">
        {locked && (
          <Lock
            size={18}
            className={
              accent === 'orange'
                ? 'mt-0.5 shrink-0 text-orange-600'
                : 'mt-0.5 shrink-0 text-cyan-700'
            }
          />
        )}
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </section>
  )
}

export default ChapterPage
