import { StrictMode, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ErrorBoundary, InstallPrompt, ToastContainer } from '@/components'

import HabitCalendarPage from './pages/HabitCalendarPage'
import HabitsPage from './pages/HabitsPage'
import HabitStatsPage from './pages/HabitStatsPage'
import SettingsPage from './pages/SettingsPage'
import { scheduleReminders } from './services/notificationService'
import { useHabitStore } from './store/habitStore'

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

export default function App() {
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
