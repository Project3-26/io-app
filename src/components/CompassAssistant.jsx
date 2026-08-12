import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Compass, LoaderCircle, Send, X } from 'lucide-react'
import { askCompass, getCompassStatus } from '../services/compass'

const libraryStarterQuestions = [
  'How do I find a specific book or chapter?',
  'What should I read next?',
  'Where do I find my progress?',
]

const chapterStarterQuestions = [
  'What is this chapter mainly about?',
  'What should I notice in this chapter?',
  'How can I apply this chapter?',
]

function buildVerseStarterQuestions(verseNumber) {
  return [
    `What should I notice about verse ${verseNumber}?`,
    `How does verse ${verseNumber} fit this chapter?`,
    `How might I apply verse ${verseNumber}?`,
  ]
}

export default function CompassAssistant({
  currentPage,
  chapterId,
  selectedVerseNumber = null,
  placement = 'reader',
}) {
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [showFloatingHint, setShowFloatingHint] = useState(false)
  const inputRef = useRef(null)
  const triggerRef = useRef(null)
  const chatEndRef = useRef(null)

  const starterQuestions = useMemo(() => {
    if (selectedVerseNumber) return buildVerseStarterQuestions(selectedVerseNumber)
    return placement === 'library' ? libraryStarterQuestions : chapterStarterQuestions
  }, [placement, selectedVerseNumber])

  useEffect(() => {
    let mounted = true
    getCompassStatus()
      .then((payload) => {
        if (mounted) setEnabled(Boolean(payload?.enabled))
      })
      .catch(() => {
        if (mounted) setEnabled(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50)
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    window.requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    })
  }, [open, messages, isSending, error])

  useEffect(() => {
    if (!enabled || placement !== 'floating') return undefined

    setShowFloatingHint(true)
    const hintTimer = window.setTimeout(() => setShowFloatingHint(false), 5000)

    return () => window.clearTimeout(hintTimer)
  }, [chapterId, enabled, placement])

  if (!enabled) return null

  function closeAssistant() {
    setOpen(false)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }

  async function submitQuestion(value = question) {
    const trimmed = value.trim()
    if (!trimmed || isSending) return

    setQuestion('')
    setError('')
    setMessages((current) => [...current, { role: 'user', text: trimmed }])
    setIsSending(true)

    const contextualQuestion = selectedVerseNumber
      ? `The user selected verse ${selectedVerseNumber} in the current chapter. ${trimmed}`
      : trimmed

    try {
      const payload = await askCompass({
        question: contextualQuestion,
        currentPage,
        chapterId,
      })
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: payload?.answer || 'I could not answer that right now.',
          sources: payload?.sources || [],
        },
      ])
    } catch (requestError) {
      if (requestError?.status === 503) {
        setEnabled(false)
        setOpen(false)
        return
      }
      setError(requestError?.message || 'Compass could not answer that right now.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      {placement === 'library' ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="group mt-4 flex w-full items-center gap-4 border border-cyan-300/25 bg-[#08243b] p-5 text-left text-white shadow-lg shadow-black/15 transition hover:border-cyan-300/50 hover:bg-[#0a2b47] sm:p-6"
          aria-haspopup="dialog"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-cyan-200/25 bg-[#0b2f4c] text-cyan-300">
            <Compass size={25} strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400 sm:text-xs">
              Compass AI
            </span>
            <span className="mt-1 block text-lg font-semibold">Ask a Bible question</span>
            <span className="mt-1 block text-xs leading-5 text-slate-400 sm:text-sm">
              Explore Scripture or get help finding your way through Project 3|26.
            </span>
          </span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-cyan-500 text-white transition group-hover:translate-x-0.5">
            <ArrowRight size={18} />
          </span>
        </button>
      ) : (
        <>
          {placement === 'floating' && showFloatingHint && !open && (
            <button
              type="button"
              onClick={() => {
                setShowFloatingHint(false)
                setOpen(true)
              }}
              className="fixed bottom-[calc(33vh+0.5rem)] right-20 z-[70] max-w-[220px] !rounded-[1.5rem] border border-cyan-200/30 bg-white px-4 py-3 text-left text-sm font-medium leading-5 text-[#08243b] shadow-xl shadow-black/25 transition hover:bg-cyan-50 sm:right-24"
              aria-label="Open Compass AI: Have questions about the text? Ask me!"
            >
              Have questions about the text? Ask me!
              <span className="absolute -right-2 bottom-4 h-4 w-4 rotate-45 border-r border-t border-cyan-200/30 bg-white" aria-hidden="true" />
            </button>
          )}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => {
              setShowFloatingHint(false)
              setOpen(true)
            }}
            className={
              placement === 'floating'
                ? 'fixed bottom-[33vh] right-4 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-cyan-200/40 bg-[#08243b] text-cyan-200 shadow-xl shadow-black/35 transition hover:-translate-y-0.5 hover:border-cyan-200/70 hover:bg-[#0a2b47] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:right-6'
                : 'inline-flex h-9 items-center gap-2 border border-cyan-600/25 bg-[#c7dce7] px-3 text-xs font-semibold text-cyan-800 transition hover:border-cyan-600/45 hover:bg-[#bad4df]'
            }
            aria-haspopup="dialog"
            aria-label="Open Compass AI"
            title="Compass AI"
          >
            <Compass size={placement === 'floating' ? 28 : 16} strokeWidth={2.1} />
            {placement !== 'floating' && (
              <>
                <span className="hidden sm:inline">
                  {selectedVerseNumber ? `Ask about verse ${selectedVerseNumber}` : 'Ask Compass AI'}
                </span>
                <span className="sm:hidden">Compass</span>
              </>
            )}
          </button>
        </>
      )}

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <button
            type="button"
            onClick={closeAssistant}
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Close Compass AI"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Compass AI"
            className="relative z-[91] flex max-h-[82vh] w-full max-w-lg flex-col overflow-hidden border border-cyan-300/25 bg-[#071a2d] text-white shadow-2xl shadow-black/50"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-cyan-200/30 bg-[#0b2a43] text-cyan-300">
                  <Compass size={21} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="text-sm font-semibold">Compass AI</div>
                  <div className="text-[11px] text-slate-400">
                    {selectedVerseNumber
                      ? `Asking about ${chapterId?.replace(/-(\d+)$/, ' $1') || 'this chapter'}, verse ${selectedVerseNumber}`
                      : chapterId
                        ? `Asking about ${chapterId.replace(/-(\d+)$/, ' $1')}`
                        : 'Navigate. Understand. Keep moving.'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAssistant}
                className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Close Compass AI"
              >
                <X size={18} />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
              {messages.length === 0 && (
                <div>
                  <p className="text-sm leading-6 text-slate-300">
                    {selectedVerseNumber
                      ? `Verse ${selectedVerseNumber} is selected. Ask what to notice, how it fits the chapter, or how to apply it.`
                      : chapterId
                        ? 'Ask about the chapter you are reading.'
                        : 'Ask a Bible question or get help finding something in Project 3|26.'}
                  </p>
                  <div className="mt-4 space-y-2">
                    {starterQuestions.map((starter) => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => submitQuestion(starter)}
                        className="block w-full border border-white/10 bg-white/[0.035] px-3 py-2.5 text-left text-xs leading-5 text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.05]"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={message.role === 'user' ? 'ml-8 bg-cyan-500 px-3 py-2.5 text-sm text-white' : 'mr-6 border border-white/10 bg-white/[0.04] px-3 py-2.5'}
                >
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                  {message.role === 'assistant' && message.sources?.length > 0 && (
                    <p className="mt-2 text-[10px] leading-4 text-slate-500">
                      Grounded in {message.sources.slice(0, 3).map((source, sourceIndex) => {
                        const label = typeof source === 'string' ? source : source?.label || 'Approved source'
                        const url = typeof source === 'object' ? source?.url : null
                        return (
                          <span key={`${label}-${sourceIndex}`}>
                            {sourceIndex > 0 && ' · '}
                            {url ? (
                              <a href={url} target="_blank" rel="noreferrer" className="text-cyan-300 underline decoration-cyan-300/40 underline-offset-2 hover:text-cyan-100">
                                {label}
                              </a>
                            ) : label}
                          </span>
                        )
                      })}
                    </p>
                  )}
                </div>
              ))}

              {isSending && (
                <div className="mr-20 flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-slate-400">
                  <LoaderCircle size={14} className="animate-spin" /> Compass is looking through approved Project 3|26 material…
                </div>
              )}

              {error && <div className="border border-red-300/20 bg-red-300/[0.06] px-3 py-2 text-xs text-red-200">{error}</div>}
              <div ref={chatEndRef} aria-hidden="true" />
            </div>

            <form
              className="flex gap-2 border-t border-white/10 bg-[#061525] p-3 sm:p-4"
              onSubmit={(event) => {
                event.preventDefault()
                submitQuestion()
              }}
            >
              <input
                ref={inputRef}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask Compass AI…"
                maxLength={selectedVerseNumber ? 720 : 800}
                className="min-w-0 flex-1 border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/35"
              />
              <button
                type="submit"
                disabled={!question.trim() || isSending}
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-cyan-400 text-[#041326] transition hover:bg-cyan-300 disabled:opacity-40"
                aria-label="Ask Compass AI"
              >
                <Send size={17} />
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  )
}
