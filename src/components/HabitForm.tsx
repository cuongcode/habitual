import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useHabitStore } from '../store/habitStore'
import type { Schedule } from '../types/index'

// ── Types ──────────────────────────────────────────────────────────

export interface HabitFormValues {
  name: string
  categoryId: string
  schedule: Schedule
  reminderTime?: string
  reminderEnabled: boolean
}

interface HabitFormProps {
  initialValues?: Partial<HabitFormValues>
  onSubmit: (values: HabitFormValues) => Promise<void>
  onCancel: () => void
  submitLabel: 'Create' | 'Save'
}

// ── Constants ──────────────────────────────────────────────────────

const TABS = ['Basics', 'Schedule', 'Reminder'] as const
type Tab = (typeof TABS)[number]

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// ── Helpers ────────────────────────────────────────────────────────

function getDefaultSchedule(): Schedule {
  return { frequency: 'daily' }
}

function todayISO(): string {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

// ── Component ──────────────────────────────────────────────────────

export function HabitForm({ initialValues, onSubmit, onCancel, submitLabel }: HabitFormProps) {
  const categories = useHabitStore((s) => s.categories)
  const nameRef = useRef<HTMLInputElement>(null)

  // ── Form state ─────────────────────────────────────────────────

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

  // ── Autofocus ──────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => nameRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

  // ── Validation ─────────────────────────────────────────────────

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Habit name is required'
    // Schedule validation
    const s = schedule
    if (s.frequency === 'weekly' && !(s as any).weekdays?.length) {
      errs.schedule = 'Pick at least one weekday'
    }
    if (s.frequency === 'monthly' && !(s as any).dayOfMonth) {
      errs.schedule = 'Pick a day of the month'
    }
    if (s.frequency === 'yearly') {
      if (!(s as any).month || !(s as any).dayOfMonth) {
        errs.schedule = 'Pick a month and day'
      }
    }
    if (s.frequency === 'custom') {
      if (!(s as any).intervalDays || (s as any).intervalDays < 2) {
        errs.schedule = 'Interval must be at least 2 days'
      }
      if (!(s as any).anchorDate) {
        errs.schedule = 'Pick a start date'
      }
    }
    return errs
  }

  // ── Submit ─────────────────────────────────────────────────────

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

  // ── Schedule helpers ───────────────────────────────────────────

  const now = new Date()

  function handleFrequencyChange(freq: Schedule['frequency']) {
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

  // ── Render ─────────────────────────────────────────────────────

  return (
    <div className="flex flex-col">
      {/* Tab Bar */}
      <div className="flex border-b border-muted-light">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-mono text-xs uppercase tracking-wide transition-colors ${activeTab === tab ? 'border-b-2 border-rust text-ink' : 'border-b-2 border-transparent text-muted'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[320px] px-4 py-5">
        {activeTab === 'Basics' && (
          <BasicsTab
            name={name}
            setName={setName}
            nameRef={nameRef}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            categories={categories}
            errors={errors}
          />
        )}

        {activeTab === 'Schedule' && (
          <ScheduleTab
            schedule={schedule}
            setSchedule={setSchedule}
            onFrequencyChange={handleFrequencyChange}
            errors={errors}
          />
        )}

        {activeTab === 'Reminder' && (
          <ReminderTab
            reminderEnabled={reminderEnabled}
            setReminderEnabled={setReminderEnabled}
            reminderTime={reminderTime}
            setReminderTime={setReminderTime}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-muted-light px-4 pt-4">
        <button
          onClick={onCancel}
          disabled={submitting}
          className="font-body text-sm text-muted transition-colors hover:text-ink disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-full bg-rust px-6 py-3 font-body text-body text-cream transition-all active:scale-95 disabled:opacity-70"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : submitLabel}
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
//  TAB 1 — Basics
// ══════════════════════════════════════════════════════════════════

interface BasicsTabProps {
  name: string
  setName: (v: string) => void
  nameRef: React.RefObject<HTMLInputElement | null>
  categoryId: string
  setCategoryId: (id: string) => void
  categories: { id: string; label: string; colorKey: string }[]
  errors: Record<string, string>
}

function BasicsTab({
  name,
  setName,
  nameRef,
  categoryId,
  setCategoryId,
  categories,
  errors,
}: BasicsTabProps) {
  return (
    <div className="space-y-6">
      {/* Habit Name */}
      <div>
        <label className="mb-2 block font-mono text-label uppercase tracking-wider text-muted">
          Habit Name
        </label>
        <input
          ref={nameRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning walk"
          className="w-full rounded-md border border-muted-light bg-cream px-3 py-2.5 font-body text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-rust"
        />
        {errors.name && <p className="mt-1 font-mono text-label text-rust">{errors.name}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block font-mono text-label uppercase tracking-wider text-muted">
          Category
        </label>

        {categories.length === 0 ? (
          <p className="font-mono text-xs text-muted">No categories yet — add one in Settings.</p>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(categoryId === cat.id ? 'none' : cat.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                  categoryId === cat.id
                    ? `text-cream bg-${cat.colorKey} border-${cat.colorKey}`
                    : 'border-muted-light bg-cream text-ink'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${categoryId === cat.id ? 'bg-cream' : `bg-${cat.colorKey}`}`}
                />
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {errors.category && (
          <p className="mt-1 font-mono text-label text-rust">{errors.category}</p>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
//  TAB 2 — Schedule
// ══════════════════════════════════════════════════════════════════

interface ScheduleTabProps {
  schedule: Schedule
  setSchedule: (s: Schedule) => void
  onFrequencyChange: (f: Schedule['frequency']) => void
  errors: Record<string, string>
}

const FREQUENCY_OPTIONS: { value: Schedule['frequency']; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'Every day' },
  { value: 'weekly', label: 'Weekly', description: 'Pick 1–6 weekdays' },
  { value: 'monthly', label: 'Monthly', description: 'Pick a day of the month' },
  { value: 'yearly', label: 'Yearly', description: 'Pick a date each year' },
  { value: 'custom', label: 'Custom', description: 'Every X days' },
]

function ScheduleTab({ schedule, setSchedule, onFrequencyChange, errors }: ScheduleTabProps) {
  return (
    <div>
      {/* Frequency List */}
      {FREQUENCY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onFrequencyChange(opt.value)}
          className="flex w-full items-center justify-between border-b border-muted-light py-3 text-left"
        >
          <div>
            <div className="font-body text-body text-ink">{opt.label}</div>
            <div className="font-mono text-label text-muted">{opt.description}</div>
          </div>
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${schedule.frequency === opt.value ? 'border-rust bg-rust' : 'border-muted-light bg-transparent'}`}
          >
            {schedule.frequency === opt.value && <div className="h-2 w-2 rounded-full bg-cream" />}
          </div>
        </button>
      ))}

      {/* Anchor Picker */}
      <div className="mt-5">
        {schedule.frequency === 'weekly' && (
          <WeekdayPicker
            selected={(schedule as any).weekdays ?? []}
            onChange={(wds) => setSchedule({ frequency: 'weekly', weekdays: wds })}
          />
        )}

        {schedule.frequency === 'monthly' && (
          <MonthDayPicker
            selected={(schedule as any).dayOfMonth}
            onChange={(d) => setSchedule({ frequency: 'monthly', dayOfMonth: d })}
          />
        )}

        {schedule.frequency === 'yearly' && (
          <YearlyPicker
            month={(schedule as any).month}
            day={(schedule as any).dayOfMonth}
            onMonthChange={(m) => setSchedule({ ...schedule, month: m } as any)}
            onDayChange={(d) => setSchedule({ ...schedule, dayOfMonth: d } as any)}
          />
        )}

        {schedule.frequency === 'custom' && (
          <CustomPicker
            interval={(schedule as any).intervalDays}
            anchor={(schedule as any).anchorDate}
            onIntervalChange={(n) => setSchedule({ ...schedule, intervalDays: n } as any)}
            onAnchorChange={(d) => setSchedule({ ...schedule, anchorDate: d } as any)}
          />
        )}
      </div>

      {errors.schedule && <p className="mt-2 font-mono text-label text-rust">{errors.schedule}</p>}
    </div>
  )
}

// ── Weekday Picker ─────────────────────────────────────────────────

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

function WeekdayPicker({
  selected,
  onChange,
}: {
  selected: Weekday[]
  onChange: (wds: Weekday[]) => void
}) {
  // Display Mon–Sun; map display index → JS weekday (0=Sun)
  const displayToJS: Weekday[] = [1, 2, 3, 4, 5, 6, 0]
  const atMax = selected.length >= 6

  function toggle(jsDay: Weekday) {
    if (selected.includes(jsDay)) {
      // Never deselect the last one
      if (selected.length === 1) return
      onChange(selected.filter((d) => d !== jsDay))
    } else {
      // Cap at 6
      if (atMax) return
      onChange([...selected, jsDay])
    }
  }

  return (
    <div>
      <div className="flex justify-between gap-2">
        {WEEKDAY_LABELS.map((label, i) => {
          const jsDay = displayToJS[i]
          const isSelected = selected.includes(jsDay)
          const isDisabled = atMax && !isSelected
          return (
            <button
              key={label}
              onClick={() => toggle(jsDay)}
              className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs transition-all active:scale-90 ${isSelected ? 'bg-rust text-cream' : 'bg-cream-dark text-ink'} ${isDisabled ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'}`}
            >
              {label}
            </button>
          )
        })}
      </div>
      {atMax && (
        <p className="mt-2 text-center font-mono text-label text-muted">Maximum 6 days selected</p>
      )}
    </div>
  )
}

// ── Month Day Picker ───────────────────────────────────────────────

function MonthDayPicker({
  selected,
  onChange,
}: {
  selected: number
  onChange: (d: number) => void
}) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d) => {
        const isSelected = selected === d
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs transition-colors ${isSelected ? 'bg-rust text-cream' : 'bg-cream-dark text-ink'}`}
          >
            {d}
          </button>
        )
      })}
    </div>
  )
}

// ── Yearly Picker ──────────────────────────────────────────────────

function YearlyPicker({
  month,
  day,
  onMonthChange,
  onDayChange,
}: {
  month: number
  day: number
  onMonthChange: (m: number) => void
  onDayChange: (d: number) => void
}) {
  return (
    <div className="flex gap-4">
      {/* Month grid */}
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {MONTH_LABELS.map((label, i) => {
          const m = i + 1
          const isSelected = month === m
          return (
            <button
              key={label}
              onClick={() => onMonthChange(m)}
              className={`flex items-center justify-center rounded-full py-2 font-mono text-label transition-colors ${isSelected ? 'bg-rust text-cream' : 'bg-cream-dark text-ink'}`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Day grid */}
      <div className="grid max-h-[200px] flex-1 grid-cols-4 gap-1 overflow-y-auto scrollbar-hide">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
          const isSelected = day === d
          return (
            <button
              key={d}
              onClick={() => onDayChange(d)}
              className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-label transition-colors ${isSelected ? 'bg-rust text-cream' : 'bg-cream-dark text-ink'}`}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Custom Picker ──────────────────────────────────────────────────

function CustomPicker({
  interval,
  anchor,
  onIntervalChange,
  onAnchorChange,
}: {
  interval: number
  anchor: string
  onIntervalChange: (n: number) => void
  onAnchorChange: (d: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-body text-body text-ink">Every</span>
        <input
          type="number"
          min={2}
          value={interval}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10)
            if (!isNaN(v)) onIntervalChange(Math.max(2, v))
          }}
          className="w-[60px] rounded-md border border-muted-light bg-cream p-2 text-center font-mono text-ink focus:outline-none focus:ring-1 focus:ring-rust"
        />
        <span className="font-body text-body text-ink">days</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-body text-body text-ink">Starting from</span>
        <input
          type="date"
          value={anchor}
          onChange={(e) => onAnchorChange(e.target.value)}
          className="rounded-md border border-muted-light bg-cream px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:ring-1 focus:ring-rust"
        />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
//  TAB 3 — Reminder
// ══════════════════════════════════════════════════════════════════

interface ReminderTabProps {
  reminderEnabled: boolean
  setReminderEnabled: (v: boolean) => void
  reminderTime: string
  setReminderTime: (v: string) => void
}

function ReminderTab({
  reminderEnabled,
  setReminderEnabled,
  reminderTime,
  setReminderTime,
}: ReminderTabProps) {
  return (
    <div className="space-y-5">
      {/* Toggle Row */}
      <div className="flex items-center justify-between">
        <span className="font-body text-body text-ink">Daily reminder</span>
        <button
          onClick={() => setReminderEnabled(!reminderEnabled)}
          className={`relative h-[24px] w-[44px] rounded-full transition-colors duration-200 ${reminderEnabled ? 'bg-rust' : 'bg-muted-light'}`}
        >
          <span
            className={`absolute top-[2px] h-[20px] w-[20px] rounded-full bg-white transition-all duration-200 ${reminderEnabled ? 'left-[22px]' : 'left-[2px]'}`}
          />
        </button>
      </div>

      {/* Time Picker */}
      {reminderEnabled && (
        <div className="flex items-center gap-3">
          <span className="font-body text-body text-ink">Remind me at</span>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="rounded-md border border-muted-light bg-cream px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:ring-1 focus:ring-rust"
          />
        </div>
      )}

      {/* Note */}
      <p className="font-mono text-label text-muted">
        Notifications require permission. You'll be prompted on first use.
      </p>
    </div>
  )
}
