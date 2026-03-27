import { create } from 'zustand'

interface UIStore {
  addHabitDrawerOpen: boolean
  openAddHabitDrawer(): void
  closeAddHabitDrawer(): void
}

export const useUIStore = create<UIStore>((set) => ({
  addHabitDrawerOpen: false,
  openAddHabitDrawer: () => set({ addHabitDrawerOpen: true }),
  closeAddHabitDrawer: () => set({ addHabitDrawerOpen: false }),
}))
