import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applyThemePreference, readThemePreference } from './services/theme'

// Apply this before React renders so a saved dark preference does not flash light.
applyThemePreference(readThemePreference())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
