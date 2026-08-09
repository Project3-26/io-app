import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Compass, MessageCircle, UserRound, X } from 'lucide-react'

const ONBOARDING_TOUR_ENABLED = true
const ONBOARDING_TOUR_VERSION = 3
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

function findPageRect() {
  const main = document.querySelector('main')
  if (!main) return null

  const rect = main.getBoundingClientRect()
  const padding = 8
  const left = Math.max(8, rect.left - padding)
  const top = Math.max(8, rect.top - padding)
  const right = Math.min(window.innerWidth - 8, rect.right + padding)
  const bottom = Math.min(window.innerHeight - 8, rect.bottom + padding)

  return {
    left,
    top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  }
}

function OnboardingTour({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [pageRect, setPageRect] = useState(null)

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
    window.scrollTo({ top: 0, behavior: 'smooth' })

    let frame
    let timer

    function measure() {
      setPageRect(findPageRect())
    }

    frame = window.requestAnimationFrame(measure)
    timer = window.setTimeout(measure, 220)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [isOpen, onNavigate, step?.pageId])

  function finishTour() {
    markTourComplete()
    setIsOpen(false)
    onNavigate?.('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setPageRect(null)
    setStepIndex((current) => Math.max(0, current - 1))
  }

  function goNext() {
    if (isLastStep) {
      finishTour()
      return
    }

    setPageRect(null)
    setStepIndex((current) => Math.min(TOUR_STEPS.length - 1, current + 1))
  }

  if (!ONBOARDING_TOUR_ENABLED || !isOpen || !step) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-950/28" />

      {pageRect && (
        <div
          className="absolute rounded-[22px] border-2 border-orange-300 shadow-[0_0_0_9999px_rgba(2,10,23,0.38),0_0_38px_rgba(251,146,60,0.7)] transition-all duration-300"
          style={{
            left: pageRect.left,
            top: pageRect.top,
            width: pageRect.width,
            height: pageRect.height,
          }}
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[390px] sm:px-0 sm:pb-0 lg:right-8">
        <div
          className="pointer-events-auto w-full rounded-[24px] border border-orange-300/30 bg-[#071a31]/97 p-4 text-white shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Project 3|26 app tour"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-400">
                  {step.eyebrow}
                </p>
                <p className="mt-1 text-[11px] font-medium text-slate-500">{progressLabel}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={finishTour}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Skip app tour"
            >
              <X size={16} />
            </button>
          </div>

          <h2 className="mt-4 text-xl font-semibold leading-tight text-white sm:text-2xl">
            {step.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {step.body}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((tourStep, index) => (
                <span
                  key={tourStep.id}
                  className={`h-1.5 rounded-full transition-all ${
                    index === stepIndex ? 'w-6 bg-orange-400' : 'w-1.5 bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <ArrowLeft size={15} />
                  Back
                </button>
              )}

              <button
                type="button"
                onClick={goNext}
                className="flex h-9 items-center gap-1.5 rounded-full bg-orange-500 px-4 text-xs font-bold text-white transition hover:bg-orange-400"
              >
                {isLastStep ? 'Start exploring' : 'Next'}
                {!isLastStep && <ArrowRight size={15} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingTour
