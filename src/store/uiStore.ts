import { create } from 'zustand'

type HabitsDisplayMode = 'week' | 'heatmap'

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
}

export const useUIStore = create<UIStore>((set) => ({
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
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
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
}))
