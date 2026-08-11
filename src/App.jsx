import { useEffect, useState } from 'react'

import OnboardingTour from './components/OnboardingTour'
import AuthPage from './pages/AuthPage'
import ChapterPage from './pages/ChapterPage'
import ConnectRoomPage from './pages/ConnectRoomPage'
import DashboardPage from './pages/DashboardPage'
import JourneyPage from './pages/JourneyPage'
import LibraryPage from './pages/LibraryPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import UpgradePage from './pages/UpgradePage'
import {
  clearMemberSession,
  getMemberSnapshot,
  hasMemberSession,
  signInMember,
  signUpMember,
} from './services/backend'
import { claimReferral } from './services/referrals'
import { syncAchievements } from './utils/achievements'

const PAGE_IDS = {
  dashboard: 'dashboard',
  chapter: 'chapter',
  journey: 'journey',
  library: 'library',
  connect: 'connect',
  connectRoom: 'connect-room',
  profile: 'profile',
  notifications: 'notifications',
  upgrade: 'upgrade',
}

const NAVIGATION_PAGES = [
  PAGE_IDS.dashboard,
  PAGE_IDS.journey,
  PAGE_IDS.library,
  PAGE_IDS.connect,
  PAGE_IDS.profile,
]

const PENDING_REFERRAL_KEY = 'project326-pending-referral'
const BETA_CREDENTIALS_KEY = 'project326-beta-device-member'
const CHAPTER_TABS = new Set(['read', 'listen', 'study', 'leader'])

// TEMPORARY BETA BEHAVIOR:
// Keep the real authentication flow intact, but hide it during beta. Set this
// to false near production and the existing sign-in/create-account screen is
// restored without rebuilding auth.
const BETA_AUTO_ENTRY_ENABLED = true

function captureReferralFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('ref')?.trim().toUpperCase()
  if (!code) return

  localStorage.setItem(PENDING_REFERRAL_KEY, code)
  params.delete('ref')
  const query = params.toString()
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
}

function captureChapterLaunchFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const chapterId = params.get('chapter')?.trim().toLowerCase() || ''
  const requestedTab = params.get('tab')?.trim().toLowerCase() || 'read'
  const tab = CHAPTER_TABS.has(requestedTab) ? requestedTab : 'read'

  if (!/^[a-z0-9-]+-\d+$/.test(chapterId)) return null

  sessionStorage.setItem(
    'project326-chapter-request',
    JSON.stringify({ chapterId, tab, createdAt: Date.now(), source: 'deep-link' }),
  )

  params.delete('chapter')
  params.delete('tab')
  const query = params.toString()
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)

  return chapterId
}

async function claimPendingReferral() {
  const code = localStorage.getItem(PENDING_REFERRAL_KEY)
  if (!code) return

  try {
    await claimReferral(code)
    localStorage.removeItem(PENDING_REFERRAL_KEY)
  } catch (error) {
    if ([400, 404].includes(error?.status)) {
      localStorage.removeItem(PENDING_REFERRAL_KEY)
    }
  }
}

function readBetaCredentials() {
  try {
    const stored = JSON.parse(localStorage.getItem(BETA_CREDENTIALS_KEY) || 'null')
    if (!stored?.email || !stored?.password || !stored?.displayName) return null
    return stored
  } catch {
    return null
  }
}

function createBetaCredentials() {
  const randomId =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID().replaceAll('-', '')
      : `${Date.now()}${Math.random().toString(36).slice(2)}`
  const shortId = randomId.slice(0, 10).toLowerCase()
  const credentials = {
    email: `beta+${shortId}@project326.org`,
    password: `Beta-${randomId.slice(0, 20)}!`,
    displayName: `Beta ${shortId.slice(-4).toUpperCase()}`,
  }

  localStorage.setItem(BETA_CREDENTIALS_KEY, JSON.stringify(credentials))
  return credentials
}

async function ensureBetaMemberSession() {
  if (hasMemberSession()) return

  const stored = readBetaCredentials()

  if (stored) {
    try {
      await signInMember(stored.email, stored.password)
      return
    } catch (error) {
      if (![400, 401, 404].includes(error?.status)) throw error
    }
  }

  const credentials = stored || createBetaCredentials()

  try {
    await signUpMember(
      credentials.email,
      credentials.password,
      credentials.displayName,
    )
  } catch (error) {
    if (error?.status !== 409) throw error
    await signInMember(credentials.email, credentials.password)
  }
}

function hydrateMemberProgress(snapshot) {
  const progress = snapshot?.progress
  if (!progress) return

  if (Array.isArray(progress.completedChapterIds)) {
    localStorage.setItem(
      'project326-completed-chapters',
      JSON.stringify(progress.completedChapterIds),
    )
  }

  if (Array.isArray(progress.completionDays)) {
    localStorage.setItem(
      'project326-completion-days',
      JSON.stringify(progress.completionDays),
    )
  }

  syncAchievements({
    chaptersCompleted: progress.completedChapters || 0,
    completedBooks: progress.booksCompleted || 0,
    completedBookIds: Array.isArray(progress.completedBookIds)
      ? progress.completedBookIds
      : [],
    currentStreak: progress.currentStreak || 0,
  })

  window.dispatchEvent(
    new CustomEvent('project326-completion-change', {
      detail: { source: 'backend-sync' },
    }),
  )

  window.dispatchEvent(
    new CustomEvent('project326-streak-change', {
      detail: { source: 'backend-sync' },
    }),
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState(PAGE_IDS.dashboard)
  const [selectedChapterId, setSelectedChapterId] = useState('john-1')
  const [selectedConnectRoomId, setSelectedConnectRoomId] = useState('today')
  const [authMode, setAuthMode] = useState('checking')
  const [bootstrapError, setBootstrapError] = useState('')

  useEffect(() => {
    captureReferralFromUrl()
    const launchChapterId = captureChapterLaunchFromUrl()

    let isMounted = true

    async function bootstrapAuthentication() {
      try {
        setBootstrapError('')

        if (!hasMemberSession()) {
          if (!BETA_AUTO_ENTRY_ENABLED) {
            if (isMounted) setAuthMode('signed-out')
            return
          }

          await ensureBetaMemberSession()
        }

        const snapshot = await getMemberSnapshot({ force: true })
        if (!snapshot) throw new Error('Member session is unavailable.')
        hydrateMemberProgress(snapshot)
        await claimPendingReferral()

        if (isMounted) {
          setAuthMode('signed-in')
          if (launchChapterId) {
            setSelectedChapterId(launchChapterId)
            setCurrentPage(PAGE_IDS.chapter)
          }
        }
      } catch (error) {
        if (!BETA_AUTO_ENTRY_ENABLED) {
          clearMemberSession()
          if (isMounted) setAuthMode('signed-out')
          return
        }

        if (isMounted) {
          setBootstrapError(
            error instanceof Error
              ? error.message
              : 'Unable to start the beta experience.',
          )
          setAuthMode('beta-error')
        }
      }
    }

    bootstrapAuthentication()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function refreshAchievementsAfterCompletion(event) {
      if (event?.detail?.source === 'backend-sync' || !hasMemberSession()) return

      try {
        const snapshot = await getMemberSnapshot({ force: true })
        if (isMounted && snapshot?.progress) {
          hydrateMemberProgress(snapshot)
        }
      } catch {
        // Completion is already saved. A later bootstrap/focus sync can retry.
      }
    }

    window.addEventListener(
      'project326-completion-change',
      refreshAchievementsAfterCompletion,
    )

    return () => {
      isMounted = false
      window.removeEventListener(
        'project326-completion-change',
        refreshAchievementsAfterCompletion,
      )
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [currentPage, selectedChapterId])

  useEffect(() => {
    function handleOpenChapterEvent(event) {
      const chapterId = event?.detail?.chapterId
      if (!chapterId) return
      setSelectedChapterId(chapterId)
      setCurrentPage(PAGE_IDS.chapter)
    }

    window.addEventListener('project326-open-chapter', handleOpenChapterEvent)
    return () => {
      window.removeEventListener('project326-open-chapter', handleOpenChapterEvent)
    }
  }, [])

  async function handleAuthenticated() {
    const snapshot = await getMemberSnapshot()
    if (!snapshot) {
      clearMemberSession()
      throw new Error('Your account connected, but your profile could not be loaded.')
    }

    hydrateMemberProgress(snapshot)
    await claimPendingReferral()
    setAuthMode('signed-in')
  }

  function handleNavigate(pageId, connectRoomId = 'today') {
    if (!NAVIGATION_PAGES.includes(pageId)) return

    if (pageId === PAGE_IDS.connect) {
      setSelectedConnectRoomId(connectRoomId)
      setCurrentPage(PAGE_IDS.connectRoom)
      return
    }

    setCurrentPage(pageId)
  }

  function handleOpenChapter(chapterValue = 'john-1') {
    const chapterId = typeof chapterValue === 'string' ? chapterValue : chapterValue?.id
    setSelectedChapterId(chapterId || 'john-1')
    setCurrentPage(PAGE_IDS.chapter)
  }

  function handleCloseChapter() {
    setCurrentPage(PAGE_IDS.dashboard)
  }

  function handleSelectConnectRoom(roomId) {
    setSelectedConnectRoomId(roomId)
  }

  function handleOpenNotifications() {
    setCurrentPage(PAGE_IDS.notifications)
  }

  function handleOpenUpgrade() {
    setCurrentPage(PAGE_IDS.upgrade)
  }

  if (authMode === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#041326] px-4 text-white">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">PROJECT 3|26</p>
          <p className="mt-3 text-sm text-slate-400">Opening your beta journey…</p>
        </div>
      </main>
    )
  }

  if (authMode === 'beta-error') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#041326] px-4 text-white">
        <div className="w-full max-w-md text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">PROJECT 3|26 BETA</p>
          <h1 className="mt-3 text-xl font-semibold">We couldn’t open the beta.</h1>
          <p className="mt-2 text-sm text-slate-400">{bootstrapError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </main>
    )
  }

  if (authMode === 'signed-out') {
    return <AuthPage onAuthenticated={handleAuthenticated} />
  }

  let pageContent

  if (currentPage === PAGE_IDS.chapter) {
    pageContent = (
      <ChapterPage
        chapterId={selectedChapterId}
        onBack={handleCloseChapter}
        onNavigate={handleNavigate}
        onOpenUpgrade={handleOpenUpgrade}
      />
    )
  } else if (currentPage === PAGE_IDS.journey) {
    pageContent = <JourneyPage onNavigate={handleNavigate} onOpenChapter={handleOpenChapter} />
  } else if (currentPage === PAGE_IDS.library) {
    pageContent = <LibraryPage onNavigate={handleNavigate} onOpenChapter={handleOpenChapter} />
  } else if (currentPage === PAGE_IDS.connect || currentPage === PAGE_IDS.connectRoom) {
    pageContent = (
      <ConnectRoomPage
        selectedRoomId={selectedConnectRoomId}
        onSelectRoom={handleSelectConnectRoom}
        onNavigate={handleNavigate}
      />
    )
  } else if (currentPage === PAGE_IDS.notifications) {
    pageContent = (
      <NotificationsPage
        onBack={() => setCurrentPage(PAGE_IDS.dashboard)}
        onNavigate={handleNavigate}
      />
    )
  } else if (currentPage === PAGE_IDS.upgrade) {
    pageContent = (
      <UpgradePage
        onBack={() => setCurrentPage(PAGE_IDS.profile)}
        onNavigate={handleNavigate}
      />
    )
  } else if (currentPage === PAGE_IDS.profile) {
    pageContent = <ProfilePage onNavigate={handleNavigate} onOpenUpgrade={handleOpenUpgrade} />
  } else {
    pageContent = (
      <DashboardPage
        onOpenChapter={handleOpenChapter}
        onNavigate={handleNavigate}
        onOpenNotifications={handleOpenNotifications}
        onOpenUpgrade={handleOpenUpgrade}
      />
    )
  }

  return (
    <>
      {pageContent}
      <OnboardingTour onNavigate={handleNavigate} onOpenChapter={handleOpenChapter} />
    </>
  )
}

export default App
