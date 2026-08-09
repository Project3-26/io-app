import { useEffect, useState } from 'react'

import OnboardingTour from './components/OnboardingTour'
import AuthPage from './pages/AuthPage'
import ChapterPage from './pages/ChapterPage'
import ConnectRoomPage from './pages/ConnectRoomPage'
import DashboardPage from './pages/DashboardPage'
import GuestPreviewPage from './pages/GuestPreviewPage'
import JourneyPage from './pages/JourneyPage'
import LibraryPage from './pages/LibraryPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import UpgradePage from './pages/UpgradePage'
import {
  clearMemberSession,
  getMemberSnapshot,
  hasMemberSession,
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

function captureReferralFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('ref')?.trim().toUpperCase()
  if (!code) return

  localStorage.setItem(PENDING_REFERRAL_KEY, code)
  params.delete('ref')
  const query = params.toString()
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
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
  const [authEntryMode, setAuthEntryMode] = useState('sign-in')

  useEffect(() => {
    captureReferralFromUrl()

    let isMounted = true

    async function bootstrapAuthentication() {
      if (!hasMemberSession()) {
        if (isMounted) setAuthMode('signed-out')
        return
      }

      try {
        const snapshot = await getMemberSnapshot()
        if (!snapshot) throw new Error('Member session is unavailable.')
        hydrateMemberProgress(snapshot)
        await claimPendingReferral()
        if (isMounted) setAuthMode('signed-in')
      } catch {
        clearMemberSession()
        if (isMounted) setAuthMode('signed-out')
      }
    }

    bootstrapAuthentication()
    return () => {
      isMounted = false
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

  function handleGuestPreview() {
    setAuthMode('guest-preview')
  }

  function handleGuestCreateAccount() {
    setAuthEntryMode('create-account')
    setAuthMode('signed-out')
  }

  function handleGuestSignIn() {
    setAuthEntryMode('sign-in')
    setAuthMode('signed-out')
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
          <p className="mt-3 text-sm text-slate-400">Connecting your journey…</p>
        </div>
      </main>
    )
  }

  if (authMode === 'guest-preview') {
    return (
      <GuestPreviewPage
        onCreateAccount={handleGuestCreateAccount}
        onSignIn={handleGuestSignIn}
      />
    )
  }

  if (authMode === 'signed-out') {
    return (
      <AuthPage
        onAuthenticated={handleAuthenticated}
        onGuestPreview={handleGuestPreview}
        initialMode={authEntryMode}
      />
    )
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
      <OnboardingTour onNavigate={handleNavigate} />
    </>
  )
}

export default App
