import './styles/global.css'

import { createRoot } from 'react-dom/client'

import App from './App'

// Global error handler
window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error('🔥 Global error:', { msg, url, lineNo, columnNo, error })
  return false
}

createRoot(document.getElementById('root')!).render(<App />)
