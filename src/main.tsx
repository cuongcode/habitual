import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/global.css'
import HabitsPage from './pages/HabitsPage'
import HabitCalendarPage from './pages/HabitCalendarPage'
import HabitStatsPage from './pages/HabitStatsPage'
import SettingsPage from './pages/SettingsPage'
import { useHabitStore } from './store/habitStore'
import { scheduleReminders } from './services/notificationService'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HabitsPage />,
  },
  {
    path: '/habit/:habitId',
    element: <HabitCalendarPage />,
  },
  {
    path: '/habit/:habitId/stats',
    element: <HabitStatsPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
])

import { ToastContainer } from './components/Toast'
import { InstallPrompt } from './components/InstallPrompt'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  useEffect(() => {
    console.log('🚀 App mounting, initializing store...')
    useHabitStore
      .getState()
      .init()
      .then(() => {
        console.log('✅ Store ready')
        // Schedule notifications for habits with reminders
        scheduleReminders(useHabitStore.getState().habits)
      })
      .catch((err) => console.error('❌ Store init failed:', err))
  }, [])

  return (
    <StrictMode>
      <ErrorBoundary>
        <ToastContainer />
        <InstallPrompt />
        <RouterProvider router={router} />
      </ErrorBoundary>
    </StrictMode>
  )
}

// Global error handler
window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error('🔥 Global error:', { msg, url, lineNo, columnNo, error })
  return false
}

createRoot(document.getElementById('root')!).render(<App />)
