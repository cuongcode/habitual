import { create } from 'zustand'

type HabitsDisplayMode = 'week' | 'heatmap'
type Theme = 'light' | 'dark' | 'system'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

interface UIStore {
  addHabitDrawerOpen: boolean
  openAddHabitDrawer(): void
  closeAddHabitDrawer(): void
  toasts: Toast[]
  showToast(message: string, type?: 'success' | 'error'): void
  dismissToast(id: string): void
  habitsDisplayMode: HabitsDisplayMode
  setHabitsDisplayMode(mode: HabitsDisplayMode): void
  heatmapYear: number
  setHeatmapYear(year: number): void
  theme: Theme
  setTheme(theme: Theme): void
  openSwipeRowId: string | null
  setOpenSwipeRowId(id: string | null): void
}

// ── Theme helpers ──────────────────────────────────────────────────

function getSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyThemeToDOM(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && getSystemPrefersDark())

  document.documentElement.classList.toggle('dark', isDark)

  // Update <meta name="theme-color"> for mobile browser chrome
  const meta = document.getElementById('theme-color-meta')
  if (meta) {
    meta.setAttribute('content', isDark ? '#1C1917' : '#F5F0E8')
  }
}

// Listen for OS theme changes when in "system" mode
let systemMediaQuery: MediaQueryList | null = null

function setupSystemThemeListener(getTheme: () => Theme) {
  // Clean up previous listener
  if (systemMediaQuery) {
    systemMediaQuery.removeEventListener('change', handleSystemChange)
  }

  systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  function handleSystemChange() {
    if (getTheme() === 'system') {
      applyThemeToDOM('system')
    }
  }

  systemMediaQuery.addEventListener('change', handleSystemChange)
}

// ── Store ──────────────────────────────────────────────────────────

const storedTheme = (localStorage.getItem('theme') as Theme) || 'light'

export const useUIStore = create<UIStore>((set, get) => {
  // Apply theme on store creation & set up system listener
  applyThemeToDOM(storedTheme)
  setupSystemThemeListener(() => get().theme)

  return {
    addHabitDrawerOpen: false,
    openAddHabitDrawer: () => set({ addHabitDrawerOpen: true }),
    closeAddHabitDrawer: () => set({ addHabitDrawerOpen: false }),
    toasts: [],
    showToast: (message, type = 'success') => {
      const id = crypto.randomUUID()
      set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, 3000)
    },
    dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    habitsDisplayMode: (localStorage.getItem('habitsDisplayMode') as HabitsDisplayMode) ?? 'week',
    heatmapYear: parseInt(localStorage.getItem('heatmapYear') ?? '') || new Date().getFullYear(),
    setHabitsDisplayMode: (mode) => {
      localStorage.setItem('habitsDisplayMode', mode)
      set({ habitsDisplayMode: mode })
    },
    setHeatmapYear: (year) => {
      localStorage.setItem('heatmapYear', String(year))
      set({ heatmapYear: year })
    },
    theme: storedTheme,
    setTheme: (theme) => {
      localStorage.setItem('theme', theme)
      applyThemeToDOM(theme)
      set({ theme })
    },
    openSwipeRowId: null,
    setOpenSwipeRowId: (id) => set({ openSwipeRowId: id }),
  }
})
