import type { Schedule } from '@/types'

import { CustomPicker } from './CustomPicker'
import { MonthDayPicker } from './MonthDayPicker'
import { WeekdayPicker } from './WeekdayPicker'
import { YearlyPicker } from './YearlyPicker'

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

export function ScheduleTab({
  schedule,
  setSchedule,
  onFrequencyChange,
  errors,
}: ScheduleTabProps) {
  return (
    <div>
      {/* Frequency List */}
      {FREQUENCY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
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
            selected={schedule.weekdays ?? []}
            onChange={(wds) => setSchedule({ frequency: 'weekly', weekdays: wds })}
          />
        )}

        {schedule.frequency === 'monthly' && (
          <MonthDayPicker
            selected={schedule.dayOfMonth}
            onChange={(d) => setSchedule({ frequency: 'monthly', dayOfMonth: d })}
          />
        )}

        {schedule.frequency === 'yearly' && (
          <YearlyPicker
            month={schedule.month}
            day={schedule.dayOfMonth}
            onMonthChange={(m) => setSchedule({ ...schedule, month: m } as Schedule)}
            onDayChange={(d) => setSchedule({ ...schedule, dayOfMonth: d } as Schedule)}
          />
        )}

        {schedule.frequency === 'custom' && (
          <CustomPicker
            interval={schedule.intervalDays}
            anchor={schedule.anchorDate}
            onIntervalChange={(n) => setSchedule({ ...schedule, intervalDays: n } as Schedule)}
            onAnchorChange={(d) => setSchedule({ ...schedule, anchorDate: d } as Schedule)}
          />
        )}
      </div>

      {errors.schedule && <p className="mt-2 font-mono text-label text-rust">{errors.schedule}</p>}
    </div>
  )
}
