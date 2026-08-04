import { useState } from 'react'
import ChapterPage from './pages/ChapterPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  function handleNavigate(pageId) {
    if (pageId === 'dashboard') {
      setCurrentPage('dashboard')
      return
    }

    // These pages are not built yet.
    // For now, keep the user on the current page.
    console.log(`${pageId} page is not built yet.`)
  }

  if (currentPage === 'chapter') {
    return (
      <ChapterPage
        onBack={() => setCurrentPage('dashboard')}
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