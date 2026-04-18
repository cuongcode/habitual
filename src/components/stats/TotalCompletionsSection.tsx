import { getThemeTokens } from '../../utils/theme'
import { SectionLabel } from '../SectionLabel'

interface TotalCompletionsSectionProps {
  total: number
  colorKey?: string
}

export function TotalCompletionsSection({ total, colorKey }: TotalCompletionsSectionProps) {
  const tokens = getThemeTokens(colorKey)

  return (
    <div className="py-12 flex flex-col items-center gap-2 border-y border-muted/10">
      <SectionLabel>Total check-ins</SectionLabel>
      <div className={`text-[56px] ${tokens.text} font-display leading-none`}>
        {isNaN(total) ? 0 : total}
      </div>
      <div className="text-[11px] text-muted font-mono">
        times completed
      </div>
    </div>
  )
}
