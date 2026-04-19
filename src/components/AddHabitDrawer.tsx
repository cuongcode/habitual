import { useEffect, useState } from 'react'

import type { HabitFormValues } from '@/components'
import { HabitForm } from '@/components'
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss'
import { requestNotificationPermission, scheduleReminders } from '../services/notificationService'
import { useHabitStore } from '../store/habitStore'
import { useUIStore } from '../store/uiStore'

export function AddHabitDrawer() {
  const [isVisible, setIsVisible] = useState(false)
  const closeDrawer = useUIStore((s) => s.closeAddHabitDrawer)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  function handleClose() {
    setIsVisible(false)
    setTimeout(closeDrawer, 300)
  }

  async function handleCreate(values: HabitFormValues) {
    const store = useHabitStore.getState()

    // Create the habit
    const habitData = {
      name: values.name,
      categoryId: values.categoryId,
      schedule: values.schedule,
      reminderTime: values.reminderEnabled ? values.reminderTime : undefined,
      order: 0,
    }
    await store.addHabit(habitData)

    // Schedule reminder if enabled
    if (values.reminderEnabled && values.reminderTime) {
      await requestNotificationPermission()
      const latestHabits = useHabitStore.getState().habits
      const newHabit = latestHabits[latestHabits.length - 1]
      if (newHabit) scheduleReminders([newHabit])
    }

    // Close drawer
    handleClose()
  }

  const { dragY, handlers } = useSwipeToDismiss(handleClose)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className={`page-enter-fade absolute inset-0 bg-black/40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        {...handlers}
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragY ? 'none' : 'transform 0.3s ease',
        }}
        className={`relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border-t border-muted-light bg-cream shadow-xl ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pb-1 pt-3">
          <div className="h-1 w-8 rounded-full bg-muted-light" />
        </div>

        {/* Title */}
        <h2 className="px-4 pb-3 pt-2 font-display text-[18px] text-ink">New habit</h2>

        {/* Form */}
        <div className="pb-6">
          <HabitForm submitLabel="Create" onSubmit={handleCreate} onCancel={handleClose} />
        </div>
      </div>
    </div>
  )
}
