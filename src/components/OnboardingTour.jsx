import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Compass, MessageCircle, ScrollText, UserRound, X } from 'lucide-react'

const ONBOARDING_TOUR_ENABLED = true
const ONBOARDING_TOUR_VERSION = 5
const ONBOARDING_STORAGE_KEY = `project326-onboarding-tour-v${ONBOARDING_TOUR_VERSION}`

const TOUR_STEPS = [
  {
    id: 'welcome',
    pageId: 'dashboard',
    eyebrow: 'WELCOME TO PROJECT 3|26',
    title: 'Your Bible journey starts here.',
    body: 'This is your home base. Your current reading, progress, and next step stay together here so you always know where to begin.',
    icon: Compass,
  },
  {
    id: 'journey',
    pageId: 'journey',
    eyebrow: 'YOUR JOURNEY',
    title: 'See exactly where you are.',
    body: 'Journey shows your progress through Scripture, streaks, milestones, medallions, and the road ahead.',
    icon: Compass,
  },
  {
    id: 'library',
    pageId: 'library',
    eyebrow: 'BIBLE LIBRARY',
    title: 'Explore the Bible without losing your place.',
    body: 'Use the Library whenever you want to browse books and chapters beyond today’s reading.',
    icon: BookOpen,
  },
  {
    id: 'chapter',
    pageId: 'chapter',
    chapterId: 'john-1',
    focusSelector: '[data-tour="chapter-tabs"]',
    eyebrow: 'YOUR DAILY CHAPTER',
    title: 'Choose how you want to engage.',
    body: 'Every chapter gathers its resources in one place: Read the Scripture, Listen on the go, Study the passage more deeply, or open Leader tools when you have that access.',
    icon: ScrollText,
  },
  {
    id: 'connect',
    pageId: 'connect',
    eyebrow: 'CONNECT',
    title: 'You are not doing this alone.',
    body: 'Connect is where the Project 3|26 community can encourage one another and talk about the journey together.',
    icon: MessageCircle,
  },
  {
    id: 'profile',
    pageId: 'profile',
    eyebrow: 'YOUR PROFILE',
    title: 'Make Project 3|26 yours.',
    body: 'Profile is where you can personalize your name and photo, connect your church, and see your current Bible access.',
    icon: UserRound,
  },
]

function hasCompletedTour() {
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'complete'
  } catch {
    return false
  }
}

function markTourComplete() {
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'complete')
  } catch {
    // If storage is unavailable, simply allow the tour to reappear later.
  }
}

function getFocusRect(selector) {
  const target =
    (selector && document.querySelector(selector)) ||
    document.querySelector('main h1') ||
    document.querySelector('main header') ||
    document.querySelector('main')
  if (!target) return null

  const rect = target.getBoundingClientRect()
  const paddingX = 14
  const paddingY = 10

  return {
    left: Math.max(10, rect.left - paddingX),
    top: Math.max(10, rect.top - paddingY),
    width: Math.min(window.innerWidth - 20, rect.width + paddingX * 2),
    height: Math.max(44, rect.height + paddingY * 2),
  }
}

function OnboardingTour({ onNavigate, onOpenChapter }) {
  const [isOpen, setIsOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [focusRect, setFocusRect] = useState(null)

  const step = TOUR_STEPS[stepIndex]
  const Icon = step?.icon || Compass
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === TOUR_STEPS.length - 1
  const progressLabel = useMemo(
    () => `${stepIndex + 1} of ${TOUR_STEPS.length}`,
    [stepIndex],
  )

  useEffect(() => {
    if (!ONBOARDING_TOUR_ENABLED || hasCompletedTour()) return

    const timer = window.setTimeout(() => setIsOpen(true), 650)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isOpen || !step?.pageId) return

    if (step.pageId === 'chapter') {
      onOpenChapter?.(step.chapterId || 'john-1')
    } else {
      onNavigate?.(step.pageId)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })

    let frame
    let timer
    let observer

    function measure() {
      setFocusRect(getFocusRect(step.focusSelector))
    }

    frame = window.requestAnimationFrame(measure)
    timer = window.setTimeout(measure, 240)
    observer = new MutationObserver(measure)
    observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', measure)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [isOpen, onNavigate, onOpenChapter, step?.chapterId, step?.focusSelector, step?.pageId])

  function finishTour() {
    markTourComplete()
    setIsOpen(false)
    onNavigate?.('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setFocusRect(null)
    setStepIndex((current) => Math.max(0, current - 1))
  }

  function goNext() {
    if (isLastStep) {
      finishTour()
      return
    }

    setFocusRect(null)
    setStepIndex((current) => Math.min(TOUR_STEPS.length - 1, current + 1))
  }

  if (!ONBOARDING_TOUR_ENABLED || !isOpen || !step) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-950/18" />

      {focusRect && (
        <div
          className="absolute rounded-2xl border-2 border-orange-400 bg-orange-300/5 shadow-[0_0_0_5px_rgba(251,146,60,0.16),0_0_30px_rgba(251,146,60,0.35)] transition-all duration-300"
          style={{
            left: focusRect.left,
            top: focusRect.top,
            width: focusRect.width,
            height: focusRect.height,
          }}
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-x-0 bottom-4 flex justify-center px-4 sm:bottom-6 lg:bottom-auto lg:top-6">
        <div
          className="pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-[26px] border-2 border-orange-400 bg-[#fff8ee] text-[#102238] shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
          role="dialog"
          aria-modal="true"
          aria-label="Project 3|26 app tour"
        >
          <div className="h-2 w-full bg-orange-500" />

          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
                  <Icon size={23} strokeWidth={2.3} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-600">
                    {step.eyebrow}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{progressLabel}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={finishTour}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition hover:border-slate-400 hover:text-slate-800"
                aria-label="Skip app tour"
              >
                <X size={17} />
              </button>
            </div>

            <h2 className="mt-5 text-2xl font-extrabold leading-tight text-[#102238] sm:text-[28px]">
              {step.title}
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-slate-600">
              {step.body}
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-orange-100 px-3.5 py-2.5 text-xs font-bold text-orange-800">
              <span className="text-base leading-none">↓</span>
              The page behind this card is the feature we’re showing you.
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-orange-200 pt-4">
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((tourStep, index) => (
                  <span
                    key={tourStep.id}
                    className={`h-2 rounded-full transition-all ${
                      index === stepIndex ? 'w-7 bg-orange-500' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex h-10 items-center gap-1 rounded-full px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-10 items-center gap-1.5 rounded-full bg-orange-500 px-5 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
                >
                  {isLastStep ? 'Start exploring' : 'Next'}
                  {!isLastStep && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingTour
