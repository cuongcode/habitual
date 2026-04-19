import type { Habit } from '../types/index'

// Request permission if not already granted
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

// Track active timeouts so we can cancel and reschedule
const activeTimeouts = new Map<string, number>()

// Schedule a daily check — call once on app init
// For each habit with reminderTime, fire a notification at that time
export function scheduleReminders(habits: Habit[]): void {
  const habitsWithReminders = habits.filter((h) => h.reminderTime)
  habitsWithReminders.forEach((habit) => {
    // Clear any existing timeout for this habit
    const existingTimeout = activeTimeouts.get(habit.id)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    const [hours, minutes] = habit.reminderTime!.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)
    const delay = target.getTime() - now.getTime()

    const timeoutId = window.setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(`Habitual — ${habit.name}`, {
          body: 'Time to check in.',
          icon: '/icon-192.png',
        })
      }
      activeTimeouts.delete(habit.id)
      // Re-schedule for tomorrow
      scheduleReminders([habit])
    }, delay)

    activeTimeouts.set(habit.id, timeoutId)
  })
}
