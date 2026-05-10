import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { Schedule } from '@/types'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/en'
import { CustomPicker } from './CustomPicker'
import { EveryXMonthsPicker } from './EveryXMonthsPicker'
import { EveryXWeeksPicker } from './EveryXWeeksPicker'
import { MonthDayPicker } from './MonthDayPicker'
import { WeekdayPicker } from './WeekdayPicker'
import { YearlyPicker } from './YearlyPicker'

interface ScheduleTabProps {
  schedule: Schedule
  setSchedule: (s: Schedule) => void
  onFrequencyChange: (f: Schedule['frequency']) => void
  errors: Record<string, string>
}

const FREQUENCY_OPTIONS: { value: Schedule['frequency']; labelKey: TranslationKey; descriptionKey: TranslationKey }[] = [
  { value: 'daily', labelKey: 'freqDaily', descriptionKey: 'freqDailyDesc' },
  { value: 'weekly', labelKey: 'freqWeekly', descriptionKey: 'freqWeeklyDesc' },
  { value: 'every-x-weeks', labelKey: 'freqEveryXWeeks', descriptionKey: 'freqEveryXWeeksDesc' },
  { value: 'monthly', labelKey: 'freqMonthly', descriptionKey: 'freqMonthlyDesc' },
  { value: 'every-x-months', labelKey: 'freqEveryXMonths', descriptionKey: 'freqEveryXMonthsDesc' },
  { value: 'yearly', labelKey: 'freqYearly', descriptionKey: 'freqYearlyDesc' },
  { value: 'custom', labelKey: 'freqCustom', descriptionKey: 'freqCustomDesc' },
]

export function ScheduleTab({
  schedule,
  setSchedule,
  onFrequencyChange,
  errors,
}: ScheduleTabProps) {
  const { t } = useTranslation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption =
    FREQUENCY_OPTIONS.find((opt) => opt.value === schedule.frequency) || FREQUENCY_OPTIONS[0]

  return (
    <div>
      {/* Frequency Dropdown */}
      <div className="relative z-10" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-muted-light bg-cream p-4 text-left shadow-sm transition-colors hover:bg-cream-dark dark:bg-surface dark:hover:bg-muted/20"
        >
          <div>
            <div className="font-body text-body text-ink">{t(selectedOption.labelKey)}</div>
            <div className="font-mono text-label text-muted">{t(selectedOption.descriptionKey)}</div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-muted transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-muted-light bg-cream shadow-lg dark:bg-surface">
            <div
              className="max-h-[240px] overflow-y-auto py-1 scrollbar-hide divide-y divide-solid divide-muted/20"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onFrequencyChange(opt.value)
                    setIsDropdownOpen(false)
                  }}
                  className="flex w-full items-center justify-between px-4 py-2 text-left transition-colors hover:bg-cream-dark dark:hover:bg-muted/20"
                >
                  <div>
                    <div className="font-body text-body text-ink">{t(opt.labelKey)}</div>
                    <div className="font-mono text-label text-muted">{t(opt.descriptionKey)}</div>
                  </div>
                  {schedule.frequency === opt.value && <Check className="h-5 w-5 text-rust" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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

        {schedule.frequency === 'every-x-weeks' && (
          <EveryXWeeksPicker
            interval={schedule.intervalWeeks}
            weekdays={schedule.weekdays}
            anchor={schedule.anchorDate}
            onIntervalChange={(n) => setSchedule({ ...schedule, intervalWeeks: n } as Schedule)}
            onWeekdaysChange={(wds) => setSchedule({ ...schedule, weekdays: wds } as Schedule)}
            onAnchorChange={(d) => setSchedule({ ...schedule, anchorDate: d } as Schedule)}
          />
        )}

        {schedule.frequency === 'every-x-months' && (
          <EveryXMonthsPicker
            interval={schedule.intervalMonths}
            day={schedule.dayOfMonth}
            anchor={schedule.anchorDate}
            onIntervalChange={(n) => setSchedule({ ...schedule, intervalMonths: n } as Schedule)}
            onDayChange={(d) => setSchedule({ ...schedule, dayOfMonth: d } as Schedule)}
            onAnchorChange={(d) => setSchedule({ ...schedule, anchorDate: d } as Schedule)}
          />
        )}
      </div>

      {errors.schedule && <p className="mt-2 font-mono text-label text-rust">{errors.schedule}</p>}
    </div>
  )
}
