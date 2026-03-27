import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/global.css'
import HabitsPage from './pages/HabitsPage'
import HabitCalendarPage from './pages/HabitCalendarPage'
import HabitStatsPage from './pages/HabitStatsPage'
import SettingsPage from './pages/SettingsPage'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
