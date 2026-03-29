import { useState, useEffect, useRef } from 'react'
import { Loader2, Check } from 'lucide-react'
import { useHabitStore } from '../store/habitStore'
import type { Schedule } from '../types/index'

// ── Types ──────────────────────────────────────────────────────────

export interface HabitFormValues {
  name: string
  categoryId: string
  newCategoryLabel?: string
  newCategoryColorKey?: string
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

const COLOR_OPTIONS = [
  { key: 'rust', hex: '#B5451B' },
  { key: 'brown', hex: '#6B4226' },
  { key: 'muted', hex: '#9C8E85' },
  { key: 'amber', hex: '#C4893A' },
  { key: 'sage', hex: '#4A7C59' },
  { key: 'slate', hex: '#5B6FA6' },
]

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ── Helpers ────────────────────────────────────────────────────────

function getDefaultSchedule(): Schedule {
  return { frequency: 'daily' }
}

function todayISO(): string {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

// ── Component ──────────────────────────────────────────────────────

export default function HabitForm({ initialValues, onSubmit, onCancel, submitLabel }: HabitFormProps) {
  const categories = useHabitStore((s) => s.categories)
  const nameRef = useRef<HTMLInputElement>(null)

  // ── Form state ─────────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState<Tab>('Basics')
  const [name, setName] = useState(initialValues?.name ?? '')
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? '')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryLabel, setNewCategoryLabel] = useState(initialValues?.newCategoryLabel ?? '')
  const [newCategoryColorKey, setNewCategoryColorKey] = useState(initialValues?.newCategoryColorKey ?? 'rust')
  const [schedule, setSchedule] = useState<Schedule>(initialValues?.schedule ?? getDefaultSchedule())
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
    if (!categoryId && !newCategoryLabel.trim()) {
      errs.category = 'Select or create a category'
    }
    if (showNewCategory && newCategoryLabel.trim() && !newCategoryColorKey) {
      errs.category = 'Pick a color for the new category'
    }
    // Schedule validation
    const s = schedule
    if (s.frequency === 'weekly' && (s as any).weekday === undefined) {
      errs.schedule = 'Pick a weekday'
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
        categoryId: showNewCategory ? '' : categoryId,
        newCategoryLabel: showNewCategory ? newCategoryLabel.trim() : undefined,
        newCategoryColorKey: showNewCategory ? newCategoryColorKey : undefined,
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
        // JS getDay 0=Sun → our weekday type 0=Sun,1=Mon,...6=Sat
        const jsDay = now.getDay()
        setSchedule({ frequency: 'weekly', weekday: jsDay as 0 | 1 | 2 | 3 | 4 | 5 | 6 })
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

  // ── Category color lookup ──────────────────────────────────────

  function getCategoryColor(colorKey: string): string {
    const found = COLOR_OPTIONS.find(c => c.key === colorKey)
    return found?.hex ?? '#9C8E85'
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
            className="flex-1 py-3 text-center transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: activeTab === tab ? 'var(--color-ink)' : 'var(--color-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--color-rust)' : '2px solid transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 py-5 min-h-[320px]">
        {activeTab === 'Basics' && (
          <BasicsTab
            name={name}
            setName={setName}
            nameRef={nameRef}
            categoryId={categoryId}
            setCategoryId={(id) => { setCategoryId(id); setShowNewCategory(false) }}
            categories={categories}
            showNewCategory={showNewCategory}
            setShowNewCategory={setShowNewCategory}
            newCategoryLabel={newCategoryLabel}
            setNewCategoryLabel={setNewCategoryLabel}
            newCategoryColorKey={newCategoryColorKey}
            setNewCategoryColorKey={setNewCategoryColorKey}
            getCategoryColor={getCategoryColor}
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
      <div className="flex justify-between items-center px-4 pt-4 border-t border-muted-light">
        <button
          onClick={onCancel}
          disabled={submitting}
          className="text-muted transition-colors hover:text-ink disabled:opacity-50"
          style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center justify-center gap-2 bg-rust text-cream rounded-full px-6 py-3 transition-all active:scale-95 disabled:opacity-70"
          style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            submitLabel
          )}
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
  showNewCategory: boolean
  setShowNewCategory: (v: boolean) => void
  newCategoryLabel: string
  setNewCategoryLabel: (v: string) => void
  newCategoryColorKey: string
  setNewCategoryColorKey: (v: string) => void
  getCategoryColor: (colorKey: string) => string
  errors: Record<string, string>
}

function BasicsTab({
  name, setName, nameRef,
  categoryId, setCategoryId,
  categories,
  showNewCategory, setShowNewCategory,
  newCategoryLabel, setNewCategoryLabel,
  newCategoryColorKey, setNewCategoryColorKey,
  getCategoryColor,
  errors,
}: BasicsTabProps) {
  return (
    <div className="space-y-6">
      {/* Habit Name */}
      <div>
        <label
          className="block mb-2 uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)' }}
        >
          Habit Name
        </label>
        <input
          ref={nameRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning walk"
          className="w-full bg-cream border border-muted-light rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-rust placeholder:text-muted"
          style={{
            fontFamily: 'var(--font-body)',
            padding: '10px 12px',
          }}
        />
        {errors.name && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-rust)' }} className="mt-1">
            {errors.name}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          className="block mb-2 uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)' }}
        >
          Category
        </label>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wide transition-colors ${
                categoryId === cat.id && !showNewCategory
                  ? 'bg-rust text-cream'
                  : 'bg-cream text-ink border border-muted-light'
              }`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: getCategoryColor(cat.colorKey) }}
              />
              {cat.label}
            </button>
          ))}

          {/* + New pill */}
          <button
            onClick={() => { setShowNewCategory(true); setCategoryId('') }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs uppercase tracking-wide transition-colors ${
              showNewCategory
                ? 'bg-rust text-cream border border-rust'
                : 'bg-cream text-muted border border-dashed border-muted'
            }`}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
          >
            + New
          </button>
        </div>

        {/* New Category Sub-form */}
        {showNewCategory && (
          <div className="mt-3 space-y-3 p-3 bg-cream-dark rounded-lg">
            <input
              type="text"
              value={newCategoryLabel}
              onChange={(e) => setNewCategoryLabel(e.target.value)}
              placeholder="Category name"
              className="w-full bg-cream border border-muted-light rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-rust placeholder:text-muted"
              style={{
                fontFamily: 'var(--font-body)',
                padding: '8px 12px',
                fontSize: '14px',
              }}
              autoFocus
            />
            <div className="flex gap-3 items-center">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.key}
                  onClick={() => setNewCategoryColorKey(color.key)}
                  className="relative w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: color.hex }}
                >
                  {newCategoryColorKey === color.key && (
                    <Check size={14} color="#F5F0E8" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {errors.category && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-rust)' }} className="mt-1">
            {errors.category}
          </p>
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
  { value: 'weekly', label: 'Weekly', description: 'Pick a weekday' },
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
          className="w-full flex justify-between items-center py-3 border-b border-muted-light text-left"
        >
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-ink)' }}>
              {opt.label}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)' }}>
              {opt.description}
            </div>
          </div>
          <div
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
            style={{
              borderColor: schedule.frequency === opt.value ? 'var(--color-rust)' : 'var(--color-muted-light)',
              backgroundColor: schedule.frequency === opt.value ? 'var(--color-rust)' : 'transparent',
            }}
          >
            {schedule.frequency === opt.value && (
              <div className="w-2 h-2 rounded-full bg-cream" />
            )}
          </div>
        </button>
      ))}

      {/* Anchor Picker */}
      <div className="mt-5">
        {schedule.frequency === 'weekly' && (
          <WeekdayPicker
            selected={(schedule as any).weekday}
            onChange={(wd) => setSchedule({ frequency: 'weekly', weekday: wd as 0 | 1 | 2 | 3 | 4 | 5 | 6 })}
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

      {errors.schedule && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-rust)' }} className="mt-2">
          {errors.schedule}
        </p>
      )}
    </div>
  )
}

// ── Weekday Picker ─────────────────────────────────────────────────

function WeekdayPicker({ selected, onChange }: { selected: number; onChange: (wd: number) => void }) {
  // Display Mon-Sun but value maps to JS weekday: 0=Sun,1=Mon,...,6=Sat
  // Display index 0=Mon → JS weekday 1, ..., display index 6=Sun → JS weekday 0
  const displayToJS = [1, 2, 3, 4, 5, 6, 0]

  return (
    <div className="flex gap-2 justify-between">
      {WEEKDAY_LABELS.map((label, i) => {
        const jsDay = displayToJS[i]
        const isSelected = selected === jsDay
        return (
          <button
            key={label}
            onClick={() => onChange(jsDay)}
            className="flex items-center justify-center rounded-full transition-colors"
            style={{
              width: '36px',
              height: '36px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              backgroundColor: isSelected ? 'var(--color-rust)' : 'var(--color-cream-dark, #EDE8DF)',
              color: isSelected ? 'var(--color-cream)' : 'var(--color-ink)',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ── Month Day Picker ───────────────────────────────────────────────

function MonthDayPicker({ selected, onChange }: { selected: number; onChange: (d: number) => void }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d) => {
        const isSelected = selected === d
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className="flex items-center justify-center rounded-full transition-colors"
            style={{
              width: '36px',
              height: '36px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              backgroundColor: isSelected ? 'var(--color-rust)' : 'var(--color-cream-dark, #EDE8DF)',
              color: isSelected ? 'var(--color-cream)' : 'var(--color-ink)',
            }}
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
  month, day, onMonthChange, onDayChange,
}: {
  month: number; day: number
  onMonthChange: (m: number) => void; onDayChange: (d: number) => void
}) {
  return (
    <div className="flex gap-4">
      {/* Month grid */}
      <div className="grid grid-cols-3 gap-1.5 flex-1">
        {MONTH_LABELS.map((label, i) => {
          const m = i + 1
          const isSelected = month === m
          return (
            <button
              key={label}
              onClick={() => onMonthChange(m)}
              className="flex items-center justify-center rounded-full transition-colors py-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                backgroundColor: isSelected ? 'var(--color-rust)' : 'var(--color-cream-dark, #EDE8DF)',
                color: isSelected ? 'var(--color-cream)' : 'var(--color-ink)',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-4 gap-1 flex-1 max-h-[200px] overflow-y-auto scrollbar-hide">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
          const isSelected = day === d
          return (
            <button
              key={d}
              onClick={() => onDayChange(d)}
              className="flex items-center justify-center rounded-full transition-colors"
              style={{
                width: '32px',
                height: '32px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                backgroundColor: isSelected ? 'var(--color-rust)' : 'var(--color-cream-dark, #EDE8DF)',
                color: isSelected ? 'var(--color-cream)' : 'var(--color-ink)',
              }}
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
  interval, anchor, onIntervalChange, onAnchorChange,
}: {
  interval: number; anchor: string
  onIntervalChange: (n: number) => void; onAnchorChange: (d: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-ink)' }}>
          Every
        </span>
        <input
          type="number"
          min={2}
          value={interval}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10)
            if (!isNaN(v)) onIntervalChange(Math.max(2, v))
          }}
          className="w-[60px] text-center bg-cream border border-muted-light rounded-md focus:outline-none focus:ring-1 focus:ring-rust"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-ink)',
            padding: '8px',
          }}
        />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-ink)' }}>
          days
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-ink)' }}>
          Starting from
        </span>
        <input
          type="date"
          value={anchor}
          onChange={(e) => onAnchorChange(e.target.value)}
          className="bg-cream border border-muted-light rounded-md focus:outline-none focus:ring-1 focus:ring-rust"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            color: 'var(--color-ink)',
            padding: '8px 12px',
          }}
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

function ReminderTab({ reminderEnabled, setReminderEnabled, reminderTime, setReminderTime }: ReminderTabProps) {
  return (
    <div className="space-y-5">
      {/* Toggle Row */}
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-ink)' }}>
          Daily reminder
        </span>
        <button
          onClick={() => setReminderEnabled(!reminderEnabled)}
          className="relative rounded-full transition-colors duration-200"
          style={{
            width: '44px',
            height: '24px',
            backgroundColor: reminderEnabled ? 'var(--color-rust)' : 'var(--color-muted-light, #C4BAB3)',
          }}
        >
          <span
            className="absolute top-[2px] rounded-full bg-white transition-all duration-200"
            style={{
              width: '20px',
              height: '20px',
              left: reminderEnabled ? '22px' : '2px',
            }}
          />
        </button>
      </div>

      {/* Time Picker */}
      {reminderEnabled && (
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-ink)' }}>
            Remind me at
          </span>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="bg-cream border border-muted-light rounded-md focus:outline-none focus:ring-1 focus:ring-rust"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              color: 'var(--color-ink)',
              padding: '8px 12px',
            }}
          />
        </div>
      )}

      {/* Note */}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)' }}>
        Notifications require permission. You'll be prompted on first use.
      </p>
    </div>
  )
}
