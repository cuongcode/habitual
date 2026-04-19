import './styles/global.css'

import { createRoot } from 'react-dom/client'

import App from './App'

// Global error handler
window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error('🔥 Global error:', { msg, url, lineNo, columnNo, error })
  return false
}

// ── Native Feel: Disable Zoom/Gestures ──────────────────────────────

// Disable pinch-to-zoom (iOS 10+)
document.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches.length > 1) {
      e.preventDefault()
    }
  },
  { passive: false },
)

// Disable gesture start (Safari)
document.addEventListener('gesturestart', (e) => {
  e.preventDefault()
})

createRoot(document.getElementById('root')!).render(<App />)
