import { useUIStore } from '../store/uiStore'
import { translate } from './index'
import type { TranslationKey } from './en'

export function useTranslation() {
  const lang = useUIStore(state => state.language)

  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    return translate(lang, key, vars)
  }

  return { t, lang }
}
