import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/global.css'
import HabitsPage from './pages/HabitsPage'
import HabitCalendarPage from './pages/HabitCalendarPage'
import HabitStatsPage from './pages/HabitStatsPage'
import SettingsPage from './pages/SettingsPage'
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

function App() {
  useEffect(() => {
    console.log('🚀 App mounting, initializing store...')
    useHabitStore
      .getState()
      .init()
      .then(() => console.log('✅ Store ready'))
      .catch((err) => console.error('❌ Store init failed:', err))
  }, [])

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}

// Global error handler
window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error('🔥 Global error:', { msg, url, lineNo, columnNo, error })
  return false
}

createRoot(document.getElementById('root')!).render(<App />)
