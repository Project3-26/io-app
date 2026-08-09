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
  ScrollText,
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import BibleReader from '../components/BibleReader'
import {
  getChapterById,
  getCurrentUser,
  markChapterComplete,
  openChapterPdf,
} from '../services/api'
import { prefetchBibleChapter } from '../services/backend'

const COMPLETED_CHAPTERS_KEY = 'project326-completed-chapters'

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

function ChapterPage({
  chapterId = 'john-1',
  onBack,
  onNavigate,
}) {
  const [chapter, setChapter] = useState(null)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState(() => getRequestedChapterTab(chapterId))
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState('')
  const [isCompleting, setIsCompleting] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const readerLocation = useMemo(
    () => parseChapterLocation(chapter?.id || chapterId),
    [chapter, chapterId],
  )

  const hasLeaderAccess = user?.plan === 'leader'
  const isCompleted = Boolean(chapter?.isCompleted) || readCompletedChapters().includes(chapter?.id)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setIsLoading(true)
        setLoadError('')
        setNotice('')
        setActiveTab(getRequestedChapterTab(chapterId))

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
  }, [chapterId])

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
        window.dispatchEvent(
          new CustomEvent('project326-open-chapter', {
            detail: { chapterId: chapter.nextChapter.id, source: 'continue' },
          }),
        )
      }

      return true
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save your progress.')
      return false
    } finally {
      setIsCompleting(false)
    }
  }

  async function handleContinue() {
    if (!chapter?.nextChapter?.id) return
    const nextLocation = parseChapterLocation(chapter.nextChapter.id)
    prefetchBibleChapter(nextLocation.bookId, nextLocation.chapterNumber)
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

  async function handlePdf(url, label) {
    const result = await openChapterPdf(url, label)
    if (!result.success) setNotice(result.message)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#041326] text-white">
        <LoaderCircle size={34} className="animate-spin text-cyan-400" />
      </div>
    )
  }

  if (loadError || !chapter || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#041326] px-6">
        <div className="max-w-md rounded-3xl border border-red-300/40 bg-[#ead9d9] p-6 text-center text-[#153047]">
          <CircleAlert size={34} className="mx-auto text-red-700" />
          <h1 className="mt-4 text-xl font-semibold">Chapter unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">{loadError}</p>
          <button type="button" onClick={onBack} className="mt-5 bg-[#c8d3db] px-4 py-2 text-sm font-semibold">
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#041326] text-white">
      <AppNavigation activePage="dashboard" onNavigate={onNavigate} />

      {chapter.audio?.url && (
        <audio
          ref={audioRef}
          src={chapter.audio.url}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => completeChapter('audio-ended')}
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

            {activeTab === 'listen' && (
              chapter.audio?.url ? (
                <section className="bg-[#dfe8ee] p-5 text-[#153047]">
                  <h2 className="font-semibold">{chapter.audio.title}</h2>
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-white"
                  >
                    {isPlaying ? <Pause size={27} /> : <Play size={27} />}
                  </button>
                </section>
              ) : (
                <UnavailablePanel title="Audio isn’t loaded for this chapter yet" description="Scripture is fully available. Audio will appear here automatically when it is added." />
              )
            )}

            {activeTab === 'study' && (
              chapter.studyGuide?.pdfUrl || chapter.studyGuide?.sections?.length ? (
                <section className="bg-[#dfe8ee] p-5 text-[#153047]">
                  <h2 className="font-semibold">{chapter.studyGuide.title || 'Study'}</h2>
                  {chapter.studyGuide.description && (
                    <p className="mt-2 text-sm text-slate-600">{chapter.studyGuide.description}</p>
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
                <UnavailablePanel title="Study content isn’t loaded yet" description="You can still read the complete NASB 1995 chapter now." />
              )
            )}

            {activeTab === 'leader' && (
              !hasLeaderAccess ? (
                <UnavailablePanel title="Leader Guides are a separate plan" description="Switch to Leader in Founder View or upgrade to access pastor and small-group leader resources." accent="orange" />
              ) : chapter.leaderGuide?.pdfUrl ? (
                <section className="bg-[#dfe8ee] p-5 text-[#153047]">
                  <h2 className="font-semibold">Leader Guide</h2>
                  <button
                    type="button"
                    onClick={() => handlePdf(chapter.leaderGuide.pdfUrl, 'Leader Guide')}
                    className="mt-5 bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Open Leader Guide
                  </button>
                </section>
              ) : (
                <UnavailablePanel title="Leader Guide isn’t loaded for this chapter yet" description="Your Leader access is active. The guide will appear here when it is added." accent="orange" />
              )
            )}
          </div>
        </main>
      </div>

      {chapter.nextChapter?.id && (
        <div className="fixed inset-x-0 bottom-[76px] z-40 border-t border-white/10 bg-[#041326]/95 p-3 backdrop-blur-xl lg:bottom-0 lg:left-24">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isCompleting}
            className="mx-auto flex h-12 w-full max-w-md items-center justify-center gap-2 bg-cyan-500 px-4 text-sm font-semibold disabled:opacity-60"
          >
            {isCompleting ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <>
                Continue to {chapter.nextChapter.reference}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

function UnavailablePanel({ title, description, accent = 'cyan' }) {
  return (
    <section className={`border p-6 text-[#153047] ${accent === 'orange' ? 'border-orange-300/40 bg-[#e8ddd0]' : 'border-[#c8d3db] bg-[#dfe8ee]'}`}>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </section>
  )
}

export default ChapterPage