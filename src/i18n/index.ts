import { en } from './en'
import { vi } from './vi'
import type { TranslationKey } from './en'

export type Language = 'en' | 'vi'

const translations: Record<Language, Record<TranslationKey, string>> = { en, vi }

// Interpolation: replace {{key}} placeholders with values
// e.g. t('importSuccess', { habits: 3, entries: 42 })
// → 'Restored 3 habits, 42 entries'
export function translate(
  lang: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  let str: string = translations[lang][key] ?? translations['en'][key] ?? key
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replaceAll(`{{${k}}}`, String(v))
    })
  }
  return str
}

// Detect browser language on first launch
export function detectLanguage(): Language {
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('vi')) return 'vi'
  return 'en'
}
