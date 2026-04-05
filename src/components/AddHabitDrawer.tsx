import { useState, useEffect } from 'react'
import HabitForm from './HabitForm'
import type { HabitFormValues } from './HabitForm'
import { useHabitStore } from '../store/habitStore'
import { useUIStore } from '../store/uiStore'
import { requestNotificationPermission, scheduleReminders } from '../services/notificationService'
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss'

export default function AddHabitDrawer() {
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
        className={`relative w-full max-w-lg bg-cream rounded-t-2xl border-t border-muted-light shadow-xl max-h-[90vh] overflow-y-auto ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 rounded-full bg-muted-light" />
        </div>

        {/* Title */}
        <h2
          className="px-4 pt-2 pb-3 text-ink"
          style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}
        >
          New habit
        </h2>

        {/* Form */}
        <div className="pb-6">
          <HabitForm
            submitLabel="Create"
            onSubmit={handleCreate}
            onCancel={handleClose}
          />
        </div>
      </div>
    </div>
  )
}
