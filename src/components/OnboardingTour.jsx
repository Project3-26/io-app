import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Compass, MessageCircle, UserRound, X } from 'lucide-react'

const ONBOARDING_TOUR_ENABLED = true
const ONBOARDING_TOUR_VERSION = 1
const ONBOARDING_STORAGE_KEY = `project326-onboarding-tour-v${ONBOARDING_TOUR_VERSION}`

const TOUR_STEPS = [
  {
    id: 'welcome',
    pageId: 'dashboard',
    eyebrow: 'WELCOME TO PROJECT 3|26',
    title: 'Your Bible journey starts here.',
    body: 'One chapter at a time. We’ll help you keep your place, understand where you are, and keep moving forward.',
    icon: Compass,
  },
  {
    id: 'journey',
    pageId: 'journey',
    eyebrow: 'YOUR JOURNEY',
    title: 'See exactly where you are.',
    body: 'Journey shows your current road through Scripture and gives you a clear next step whenever you come back.',
    icon: Compass,
  },
  {
    id: 'library',
    pageId: 'library',
    eyebrow: 'BIBLE LIBRARY',
    title: 'Explore the Bible without losing your place.',
    body: 'Use the Library when you want to browse books and chapters beyond today’s reading.',
    icon: BookOpen,
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
    title: 'Your account and preferences live here.',
    body: 'Profile is your home for account details, church connection, plan information, and other personal settings.',
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

function OnboardingTour({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

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
    onNavigate?.(step.pageId)
  }, [isOpen, onNavigate, step?.pageId])

  function finishTour() {
    markTourComplete()
    setIsOpen(false)
    onNavigate?.('dashboard')
  }

  function goBack() {
    setStepIndex((current) => Math.max(0, current - 1))
  }

  function goNext() {
    if (isLastStep) {
      finishTour()
      return
    }
    setStepIndex((current) => Math.min(TOUR_STEPS.length - 1, current + 1))
  }

  if (!ONBOARDING_TOUR_ENABLED || !isOpen || !step) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 px-4 pb-6 pt-20 backdrop-blur-[2px] sm:items-center sm:pb-4">
      <div
        className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#071a31] p-5 text-white shadow-2xl shadow-black/40 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Project 3|26 app tour"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
            <Icon size={22} strokeWidth={2.2} />
          </div>

          <button
            type="button"
            onClick={finishTour}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Skip app tour"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
          {step.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-white">
          {step.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {step.body}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            {TOUR_STEPS.map((tourStep, index) => (
              <span
                key={tourStep.id}
                className={`h-1.5 rounded-full transition-all ${
                  index === stepIndex ? 'w-6 bg-orange-400' : 'w-1.5 bg-slate-600'
                }`}
              />
            ))}
            <span className="ml-1 text-[11px] font-medium text-slate-500">{progressLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={goBack}
                className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}

            <button
              type="button"
              onClick={goNext}
              className="flex h-10 items-center gap-1.5 rounded-full bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-400"
            >
              {isLastStep ? 'Start exploring' : 'Next'}
              {!isLastStep && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingTour
