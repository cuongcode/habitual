import { Languages, Moon, Palette, Sun } from 'lucide-react'

import { SectionLabel } from '@/components'
import { useTranslation } from '@/i18n/useTranslation'
import { useUIStore } from '@/store/uiStore'

export function AppearanceSection() {
  const { t, lang } = useTranslation()
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const setLanguage = useUIStore((s) => s.setLanguage)

  const themeOptions = [
    { value: 'light' as const, label: t('themeLight'), icon: <Sun size={14} /> },
    { value: 'dark' as const, label: t('themeDark'), icon: <Moon size={14} /> },
    { value: 'system' as const, label: t('themeSystem'), icon: null },
  ]

  return (
    <div className="flex flex-col">
      <div className="mb-3">
        <SectionLabel>{t('appearance')}</SectionLabel>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-muted-light bg-cream-dark p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Palette size={18} className="text-muted" />
            <span className="font-serif text-[15px] text-ink">{t('theme')}</span>
          </div>
          <div className="flex gap-1 rounded-xl border border-muted-light bg-cream p-1">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-center font-mono text-[13px] transition-all ${
                  theme === opt.value
                    ? 'bg-rust text-cream shadow-sm'
                    : 'text-muted hover:bg-cream-dark/50 hover:text-ink'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-muted-light/50 pt-4">
          <div className="flex items-center gap-3">
            <Languages size={18} className="text-muted" />
            <span className="font-serif text-[15px] text-ink">{t('language')}</span>
          </div>
          <div className="flex gap-1 rounded-xl border border-muted-light bg-cream p-1">
            {(['en', 'vi'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-center font-mono text-[13px] transition-all ${
                  lang === l
                    ? 'bg-rust text-cream shadow-sm'
                    : 'text-muted hover:bg-cream-dark/50 hover:text-ink'
                }`}
              >
                {l === 'en' ? t('langEnglish') : t('langVietnamese')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
