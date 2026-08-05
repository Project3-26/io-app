import { useState } from 'react'
import ChapterPage from './pages/ChapterPage'
import ConnectPage from './pages/ConnectPage'
import ConnectRoomPage from './pages/ConnectRoomPage'
import DashboardPage from './pages/DashboardPage'
import JourneyPage from './pages/JourneyPage'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedConnectRoomId, setSelectedConnectRoomId] =
    useState('john-1')

  function handleNavigate(pageId) {
    if (pageId === 'dashboard') {
      setCurrentPage('dashboard')
      return
    }

    if (pageId === 'journey') {
      setCurrentPage('journey')
      return
    }

    if (pageId === 'library') {
      setCurrentPage('library')
      return
    }

    if (pageId === 'connect') {
      setCurrentPage('connect')
      return
    }

    if (pageId === 'profile') {
      setCurrentPage('profile')
    }
  }

  function handleOpenConnectRoom(roomId) {
    setSelectedConnectRoomId(roomId)
    setCurrentPage('connect-room')
  }

  function handleSelectConnectRoom(roomId) {
    setSelectedConnectRoomId(roomId)
  }

  function handleBackToConnect() {
    setCurrentPage('connect')
  }

  if (currentPage === 'chapter') {
    return (
      <ChapterPage
        onBack={() => setCurrentPage('dashboard')}
        onNavigate={handleNavigate}
      />
    )
  }

  if (currentPage === 'journey') {
    return (
      <JourneyPage
        onNavigate={handleNavigate}
        onOpenChapter={() => setCurrentPage('chapter')}
      />
    )
  }

  if (currentPage === 'library') {
    return (
      <LibraryPage
        onNavigate={handleNavigate}
        onOpenChapter={() => setCurrentPage('chapter')}
      />
    )
  }

  if (currentPage === 'connect-room') {
    return (
      <ConnectRoomPage
        selectedRoomId={selectedConnectRoomId}
        onSelectRoom={handleSelectConnectRoom}
        onBack={handleBackToConnect}
        onNavigate={handleNavigate}
      />
    )
  }

  if (currentPage === 'connect') {
    return (
      <ConnectPage
        onNavigate={handleNavigate}
        onOpenRoom={handleOpenConnectRoom}
      />
    )
  }

  if (currentPage === 'profile') {
    return (
      <ProfilePage
        onNavigate={handleNavigate}
      />
    )
  }

  return (
    <DashboardPage
      onOpenChapter={() => setCurrentPage('chapter')}
      onNavigate={handleNavigate}
    />
  )
}

export default App