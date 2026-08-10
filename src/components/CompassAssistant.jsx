import { useEffect, useRef, useState } from 'react'
import { Compass, LoaderCircle, Send, X } from 'lucide-react'
import { askCompass, getCompassStatus } from '../services/compass'

const starterQuestions = [
  'How do I get back to today’s chapter?',
  'What is this chapter mainly about?',
  'Where do I find my progress?',
]

export default function CompassAssistant({ currentPage, chapterId }) {
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

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
    if (open) window.setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  if (!enabled) return null

  async function submitQuestion(value = question) {
    const trimmed = value.trim()
    if (!trimmed || isSending) return

    setQuestion('')
    setError('')
    setMessages((current) => [...current, { role: 'user', text: trimmed }])
    setIsSending(true)

    try {
      const payload = await askCompass({
        question: trimmed,
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
      {open && (
        <section className="fixed bottom-24 right-4 z-[80] flex max-h-[68vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden border border-cyan-300/25 bg-[#071a2d] text-white shadow-2xl shadow-black/40 sm:bottom-24 sm:right-6 lg:bottom-8 lg:right-8">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-cyan-400 text-[#041326]">
                <Compass size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-sm font-semibold">Compass</div>
                <div className="text-[11px] text-slate-400">Navigate. Understand. Keep moving.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Close Compass"
            >
              <X size={18} />
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div>
                <p className="text-sm leading-6 text-slate-300">
                  Ask me how to get around Project 3|26 or ask about the chapter you’re studying.
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
                    Grounded in {message.sources.slice(0, 3).join(' · ')}
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
          </div>

          <form
            className="flex gap-2 border-t border-white/10 bg-[#061525] p-3"
            onSubmit={(event) => {
              event.preventDefault()
              submitQuestion()
            }}
          >
            <input
              ref={inputRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask Compass…"
              maxLength={800}
              className="min-w-0 flex-1 border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/35"
            />
            <button
              type="submit"
              disabled={!question.trim() || isSending}
              className="flex h-10 w-10 shrink-0 items-center justify-center bg-cyan-400 text-[#041326] transition hover:bg-cyan-300 disabled:opacity-40"
              aria-label="Ask Compass"
            >
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-24 right-4 z-[79] flex h-14 w-14 items-center justify-center rounded-full border border-cyan-200/25 bg-cyan-400 text-[#041326] shadow-xl shadow-black/30 transition hover:scale-105 hover:bg-cyan-300 active:scale-95 sm:right-6 lg:bottom-8 lg:right-8"
        aria-label="Open Compass"
      >
        <Compass size={25} strokeWidth={2.3} />
      </button>
    </>
  )
}
