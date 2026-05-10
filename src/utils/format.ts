export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] ?? s[v] ?? s[0]
}

import { format } from 'date-fns'
import type { TranslationKey } from '../i18n/en'
import type { Schedule } from '../types'

export function formatSchedule(
  schedule: Schedule,
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string,
  lang?: string
): string {
  const useShort = lang === 'vi'
  switch (schedule.frequency) {
    case 'daily':
      return t('scheduleEveryDay')
    case 'weekly': {
      const weekdaysMap: Record<number, TranslationKey> = {
        0: useShort ? 'weekdaySunShort' : 'weekdaySun',
        1: useShort ? 'weekdayMonShort' : 'weekdayMon',
        2: useShort ? 'weekdayTueShort' : 'weekdayTue',
        3: useShort ? 'weekdayWedShort' : 'weekdayWed',
        4: useShort ? 'weekdayThuShort' : 'weekdayThu',
        5: useShort ? 'weekdayFriShort' : 'weekdayFri',
        6: useShort ? 'weekdaySatShort' : 'weekdaySat',
      }
      const names = schedule.weekdays.map((wd) => t(weekdaysMap[wd]))
      if (names.length === 1) return t('scheduleEveryWeekOn', { day: names[0] })
      const last = names[names.length - 1]
      const rest = names.slice(0, -1)
      const joined = `${rest.join(', ')} ${t('andSymbol')} ${last}`
      return t('scheduleEveryWeekOn', { day: joined })
    }
    case 'monthly':
      return t('scheduleEveryMonthOn', { ordinal: `${schedule.dayOfMonth}${getOrdinalSuffix(schedule.dayOfMonth)}` })
    case 'yearly': {
      const date = new Date(2000, schedule.month - 1, schedule.dayOfMonth)
      return t('scheduleEveryYearOn', { date: format(date, 'MMMM do') })
    }
    case 'custom':
      return t('scheduleEveryXDays', { n: schedule.intervalDays })
    case 'every-x-weeks': {
      const weekdaysMap: Record<number, TranslationKey> = {
        0: useShort ? 'weekdaySunShort' : 'weekdaySun',
        1: useShort ? 'weekdayMonShort' : 'weekdayMon',
        2: useShort ? 'weekdayTueShort' : 'weekdayTue',
        3: useShort ? 'weekdayWedShort' : 'weekdayWed',
        4: useShort ? 'weekdayThuShort' : 'weekdayThu',
        5: useShort ? 'weekdayFriShort' : 'weekdayFri',
        6: useShort ? 'weekdaySatShort' : 'weekdaySat',
      }
      const dayNames = schedule.weekdays
        .slice()
        .sort((a, b) => a - b)
        .map((wd) => t(weekdaysMap[wd]))
        .join(', ')
      return t('scheduleEveryXWeeksOn', { n: schedule.intervalWeeks, days: dayNames })
    }
    case 'every-x-months': {
      const suffix = getOrdinalSuffix(schedule.dayOfMonth)
      return t('scheduleEveryXMonthsOn', { n: schedule.intervalMonths, ordinal: `${schedule.dayOfMonth}${suffix}` })
    }
    default:
      return ''
  }
}
