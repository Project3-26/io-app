import { useEffect, useState } from 'react'

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
} from './services/backend'
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

  useEffect(() => {
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
          <p className="mt-3 text-sm text-slate-400">Connecting your journey…</p>
        </div>
      </main>
    )
  }

  if (authMode === 'signed-out') {
    return <AuthPage onAuthenticated={handleAuthenticated} />
  }

  if (currentPage === PAGE_IDS.chapter) {
    return (
      <ChapterPage
        chapterId={selectedChapterId}
        onBack={handleCloseChapter}
        onNavigate={handleNavigate}
        onOpenUpgrade={handleOpenUpgrade}
      />
    )
  }

  if (currentPage === PAGE_IDS.journey) {
    return <JourneyPage onNavigate={handleNavigate} onOpenChapter={handleOpenChapter} />
  }

  if (currentPage === PAGE_IDS.library) {
    return <LibraryPage onNavigate={handleNavigate} onOpenChapter={handleOpenChapter} />
  }

  if (currentPage === PAGE_IDS.connect || currentPage === PAGE_IDS.connectRoom) {
    return (
      <ConnectRoomPage
        selectedRoomId={selectedConnectRoomId}
        onSelectRoom={handleSelectConnectRoom}
        onNavigate={handleNavigate}
      />
    )
  }

  if (currentPage === PAGE_IDS.notifications) {
    return (
      <NotificationsPage
        onBack={() => setCurrentPage(PAGE_IDS.dashboard)}
        onNavigate={handleNavigate}
      />
    )
  }

  if (currentPage === PAGE_IDS.upgrade) {
    return (
      <UpgradePage
        onBack={() => setCurrentPage(PAGE_IDS.profile)}
        onNavigate={handleNavigate}
      />
    )
  }

  if (currentPage === PAGE_IDS.profile) {
    return <ProfilePage onNavigate={handleNavigate} onOpenUpgrade={handleOpenUpgrade} />
  }

  return (
    <DashboardPage
      onOpenChapter={handleOpenChapter}
      onNavigate={handleNavigate}
      onOpenNotifications={handleOpenNotifications}
      onOpenUpgrade={handleOpenUpgrade}
    />
  )
}

export default App
