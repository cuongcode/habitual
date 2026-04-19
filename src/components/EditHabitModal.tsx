import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { HabitFormValues } from '@/components'
import { HabitForm } from '@/components'
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss'
import { requestNotificationPermission, scheduleReminders } from '../services/notificationService'
import { useHabitStore } from '../store/habitStore'
import type { Habit } from '../types/index'

interface EditHabitModalProps {
  habit: Habit
  onClose: () => void
}

export function EditHabitModal({ habit, onClose }: EditHabitModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  function handleClose() {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const initialValues: Partial<HabitFormValues> = {
    name: habit.name,
    categoryId: habit.categoryId,
    schedule: habit.schedule,
    reminderTime: habit.reminderTime,
    reminderEnabled: !!habit.reminderTime,
  }

  async function handleSave(values: HabitFormValues) {
    const store = useHabitStore.getState()

    await store.updateHabit(habit.id, {
      name: values.name,
      categoryId: values.categoryId,
      schedule: values.schedule,
      reminderTime: values.reminderEnabled ? values.reminderTime : undefined,
    })

    // Schedule reminder if enabled
    if (values.reminderEnabled && values.reminderTime) {
      await requestNotificationPermission()
      const updatedHabit = store.habits.find((h) => h.id === habit.id)
      if (updatedHabit) scheduleReminders([updatedHabit])
    }

    handleClose()
  }

  async function handleDelete() {
    await useHabitStore.getState().deleteHabit(habit.id)
    navigate('/')
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
        <h2 className="px-4 pb-3 pt-2 font-display text-lg text-ink">Edit habit</h2>

        {/* Form */}
        <div className="pb-4">
          <HabitForm
            initialValues={initialValues}
            submitLabel="Save"
            onSubmit={handleSave}
            onCancel={handleClose}
          />
        </div>

        {/* Danger Zone */}
        <div className="border-t border-muted-light px-4 pb-6 pt-2">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full rounded-full px-4 py-2.5 text-center font-body text-sm text-rust transition-colors"
              style={{
                border: '1px solid rgba(181, 69, 27, 0.3)',
              }}
            >
              Delete habit
            </button>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="font-body text-sm text-ink">Are you sure?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 font-body text-sm text-muted transition-colors hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-full bg-rust px-4 py-2 font-body text-sm text-cream transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
