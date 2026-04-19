import { Loader2 } from 'lucide-react'

import { BasicsTab } from './BasicsTab'
import { ReminderTab } from './ReminderTab'
import { ScheduleTab } from './ScheduleTab'
import { useHabitForm, type HabitFormValues } from './useHabitForm'

interface HabitFormProps {
  initialValues?: Partial<HabitFormValues>
  onSubmit: (values: HabitFormValues) => Promise<void>
  onCancel: () => void
  submitLabel: 'Create' | 'Save'
}

const TABS = ['Basics', 'Schedule', 'Reminder'] as const

export function HabitForm({ initialValues, onSubmit, onCancel, submitLabel }: HabitFormProps) {
  const { state, actions } = useHabitForm({ initialValues, onSubmit })

  return (
    <div className="flex flex-col">
      {/* Tab Bar */}
      <div className="flex border-b border-muted-light">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => actions.setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-mono text-xs uppercase tracking-wide transition-colors ${state.activeTab === tab ? 'border-b-2 border-rust text-ink' : 'border-b-2 border-transparent text-muted'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[320px] px-4 py-5">
        {state.activeTab === 'Basics' && (
          <BasicsTab
            name={state.name}
            setName={actions.setName}
            nameRef={state.nameRef}
            categoryId={state.categoryId}
            setCategoryId={actions.setCategoryId}
            categories={state.categories}
            errors={state.errors}
          />
        )}

        {state.activeTab === 'Schedule' && (
          <ScheduleTab
            schedule={state.schedule}
            setSchedule={actions.setSchedule}
            onFrequencyChange={actions.handleFrequencyChange}
            errors={state.errors}
          />
        )}

        {state.activeTab === 'Reminder' && (
          <ReminderTab
            reminderEnabled={state.reminderEnabled}
            setReminderEnabled={actions.setReminderEnabled}
            reminderTime={state.reminderTime}
            setReminderTime={actions.setReminderTime}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-muted-light px-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={state.submitting}
          className="font-body text-sm text-muted transition-colors hover:text-ink disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={actions.handleSubmit}
          disabled={state.submitting}
          className="flex items-center justify-center gap-2 rounded-full bg-rust px-6 py-3 font-body text-body text-cream transition-all active:scale-95 disabled:opacity-70"
        >
          {state.submitting ? <Loader2 size={16} className="animate-spin" /> : submitLabel}
        </button>
      </div>
    </div>
  )
}
