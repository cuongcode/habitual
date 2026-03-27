import { StrictMode, useState, useEffect } from 'react'
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
  const [ready, setReady] = useState(false)

  useEffect(() => {
    useHabitStore
      .getState()
      .init()
      .then(() => {
        setReady(true)
      })
  }, [])

  if (!ready) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          backgroundColor: '#FAF6F1',
        }}
      />
    )
  }

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
