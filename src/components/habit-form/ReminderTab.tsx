interface ReminderTabProps {
  reminderEnabled: boolean
  setReminderEnabled: (v: boolean) => void
  reminderTime: string
  setReminderTime: (v: string) => void
}

export function ReminderTab({
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
          type="button"
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
