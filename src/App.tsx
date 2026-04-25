import { StrictMode, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ErrorBoundary, InstallPrompt, SplashScreen, ToastContainer, UpdatePrompt } from '@/components'

import HabitCalendarPage from './pages/HabitCalendarPage'
import HabitsPage from './pages/HabitsPage'
import HabitStatsPage from './pages/HabitStatsPage'
import LandingPage from './pages/LandingPage'
import SettingsPage from './pages/SettingsPage'
import TrashPage from './pages/TrashPage'
import { scheduleReminders } from './services/notificationService'
import { useHabitStore } from './store/habitStore'
import { isStandalone } from './utils/pwa'

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
  {
    path: '/settings/trash',
    element: <TrashPage />,
  },
])

export default function App() {
  const isReady = useHabitStore((s) => s.isReady)
  const [showSplash, setShowSplash] = useState(true)
  const [showLanding, setShowLanding] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem('habitual_has_visited') === 'true'
    if (!hasVisited && !isStandalone()) {
      setShowLanding(true)
    }
  }, [])

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

  // Remove splash from DOM after fade-out animation completes
  useEffect(() => {
    if (!isReady) return
    const timer = setTimeout(() => setShowSplash(false), 300)
    return () => clearTimeout(timer)
  }, [isReady])

  const handleGetStarted = () => {
    localStorage.setItem('habitual_has_visited', 'true')
    setShowLanding(false)
  }

  return (
    <StrictMode>
      <ErrorBoundary>
        {showSplash && <SplashScreen fadeOut={isReady} />}
        {isReady && !showLanding && (
          <>
            <ToastContainer />
            <InstallPrompt />
            <UpdatePrompt />
            <RouterProvider router={router} />
          </>
        )}
        {isReady && showLanding && <LandingPage onGetStarted={handleGetStarted} />}
      </ErrorBoundary>
    </StrictMode>
  )
}
