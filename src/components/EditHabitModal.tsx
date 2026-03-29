import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HabitForm from './HabitForm'
import type { HabitFormValues } from './HabitForm'
import { useHabitStore } from '../store/habitStore'
import type { Habit, Category } from '../types/index'
import { requestNotificationPermission, scheduleReminders } from '../services/notificationService'

interface EditHabitModalProps {
  habit: Habit
  onClose: () => void
}

export default function EditHabitModal({ habit, onClose }: EditHabitModalProps) {
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

    // If new category: create it first
    let categoryId = values.categoryId
    if (values.newCategoryLabel) {
      const newCat: Category = {
        id: crypto.randomUUID(),
        label: values.newCategoryLabel,
        colorKey: values.newCategoryColorKey ?? 'rust',
      }
      await store.addCategory(newCat)
      categoryId = newCat.id
    }

    await store.updateHabit(habit.id, {
      name: values.name,
      categoryId,
      schedule: values.schedule,
      reminderTime: values.reminderEnabled ? values.reminderTime : undefined,
    })

    // Schedule reminder if enabled
    if (values.reminderEnabled && values.reminderTime) {
      await requestNotificationPermission()
      const updatedHabit = store.habits.find(h => h.id === habit.id)
      if (updatedHabit) scheduleReminders([updatedHabit])
    }

    handleClose()
  }

  async function handleDelete() {
    await useHabitStore.getState().deleteHabit(habit.id)
    navigate('/')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`relative w-full max-w-lg bg-cream rounded-t-2xl border-t border-muted-light shadow-xl transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto ${
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
          Edit habit
        </h2>

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
        <div className="px-4 pb-6 pt-2 border-t border-muted-light">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 px-4 rounded-full text-center transition-colors"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--color-rust)',
                border: '1px solid rgba(181, 69, 27, 0.3)',
              }}
            >
              Delete habit
            </button>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--color-ink)',
                }}
              >
                Are you sure?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-muted transition-colors hover:text-ink"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-rust text-cream rounded-full transition-all active:scale-95"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}
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
