import { useEffect, useState } from 'react'

import ChapterPage from './pages/ChapterPage'
import ConnectRoomPage from './pages/ConnectRoomPage'
import DashboardPage from './pages/DashboardPage'
import JourneyPage from './pages/JourneyPage'
import LibraryPage from './pages/LibraryPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import UpgradePage from './pages/UpgradePage'

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

function App() {
  const [currentPage, setCurrentPage] = useState(
    PAGE_IDS.dashboard,
  )

  const [selectedChapterId, setSelectedChapterId] =
    useState('john-1')

  const [selectedConnectRoomId, setSelectedConnectRoomId] =
    useState('today')

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [currentPage, selectedChapterId])

  function handleNavigate(pageId, connectRoomId = 'today') {
    if (!NAVIGATION_PAGES.includes(pageId)) {
      return
    }

    if (pageId === PAGE_IDS.connect) {
      setSelectedConnectRoomId(connectRoomId)
      setCurrentPage(PAGE_IDS.connectRoom)
      return
    }

    setCurrentPage(pageId)
  }

  function handleOpenChapter(chapterValue = 'john-1') {
    const chapterId =
      typeof chapterValue === 'string'
        ? chapterValue
        : chapterValue?.id

    if (!chapterId) {
      setSelectedChapterId('john-1')
    } else {
      setSelectedChapterId(chapterId)
    }

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
    return (
      <JourneyPage
        onNavigate={handleNavigate}
        onOpenChapter={handleOpenChapter}
      />
    )
  }

  if (currentPage === PAGE_IDS.library) {
    return (
      <LibraryPage
        onNavigate={handleNavigate}
        onOpenChapter={handleOpenChapter}
      />
    )
  }

  if (
    currentPage === PAGE_IDS.connect ||
    currentPage === PAGE_IDS.connectRoom
  ) {
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
    return (
      <ProfilePage
        onNavigate={handleNavigate}
        onOpenUpgrade={handleOpenUpgrade}
      />
    )
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