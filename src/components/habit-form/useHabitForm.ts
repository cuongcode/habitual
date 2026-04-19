import { useEffect, useRef, useState } from 'react'

import { useHabitStore } from '@/store/habitStore'
import type { Schedule } from '@/types'

export interface HabitFormValues {
  name: string
  categoryId: string
  schedule: Schedule
  reminderTime?: string
  reminderEnabled: boolean
}

interface UseHabitFormProps {
  initialValues?: Partial<HabitFormValues>
  onSubmit: (values: HabitFormValues) => Promise<void>
}

export type Tab = 'Basics' | 'Schedule' | 'Reminder'

function getDefaultSchedule(): Schedule {
  return { frequency: 'daily' }
}

function todayISO(): string {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

export function useHabitForm({ initialValues, onSubmit }: UseHabitFormProps) {
  const categories = useHabitStore((s) => s.categories)
  const nameRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<Tab>('Basics')
  const [name, setName] = useState(initialValues?.name ?? '')
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? '')
  const [schedule, setSchedule] = useState<Schedule>(
    initialValues?.schedule ?? getDefaultSchedule(),
  )
  const [reminderEnabled, setReminderEnabled] = useState(initialValues?.reminderEnabled ?? false)
  const [reminderTime, setReminderTime] = useState(initialValues?.reminderTime ?? '08:00')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => nameRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Habit name is required'

    const s = schedule
    if (s.frequency === 'weekly') {
      if (!s.weekdays?.length) errs.schedule = 'Pick at least one weekday'
    } else if (s.frequency === 'monthly') {
      if (!s.dayOfMonth) errs.schedule = 'Pick a day of the month'
    } else if (s.frequency === 'yearly') {
      if (!s.month || !s.dayOfMonth) errs.schedule = 'Pick a month and day'
    } else if (s.frequency === 'custom') {
      if (!s.intervalDays || s.intervalDays < 2) {
        errs.schedule = 'Interval must be at least 2 days'
      }
      if (!s.anchorDate) errs.schedule = 'Pick a start date'
    }
    return errs
  }

  async function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        categoryId: categoryId || 'none',
        schedule,
        reminderTime: reminderEnabled ? reminderTime : undefined,
        reminderEnabled,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFrequencyChange = (freq: Schedule['frequency']) => {
    const now = new Date()
    switch (freq) {
      case 'daily':
        setSchedule({ frequency: 'daily' })
        break
      case 'weekly': {
        const jsDay = now.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
        setSchedule({ frequency: 'weekly', weekdays: [jsDay] })
        break
      }
      case 'monthly':
        setSchedule({ frequency: 'monthly', dayOfMonth: now.getDate() })
        break
      case 'yearly':
        setSchedule({ frequency: 'yearly', month: now.getMonth() + 1, dayOfMonth: now.getDate() })
        break
      case 'custom':
        setSchedule({ frequency: 'custom', intervalDays: 14, anchorDate: todayISO() })
        break
    }
  }

  return {
    state: {
      activeTab,
      name,
      categoryId,
      schedule,
      reminderEnabled,
      reminderTime,
      submitting,
      errors,
      categories,
      nameRef,
    },
    actions: {
      setActiveTab,
      setName,
      setCategoryId,
      setSchedule,
      setReminderEnabled,
      setReminderTime,
      handleSubmit,
      handleFrequencyChange,
    },
  }
}
