import { Moon, Sun } from 'lucide-react'

import { SectionLabel } from '@/components'
import { useUIStore } from '@/store/uiStore'

export function AppearanceSection() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const options = [
    { value: 'light' as const, label: 'Light', icon: <Sun size={14} /> },
    { value: 'dark' as const, label: 'Dark', icon: <Moon size={14} /> },
    { value: 'system' as const, label: 'System', icon: null },
  ]

  return (
    <div className="flex flex-col">
      <SectionLabel>Appearance</SectionLabel>
      <div className="overflow-hidden rounded-xl border border-muted-light bg-cream-dark p-4">
        <div className="flex gap-1 rounded-xl border border-muted-light bg-cream p-1">
          {options.map((opt) => (
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
    </div>
  )
}
