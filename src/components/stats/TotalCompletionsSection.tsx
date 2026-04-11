import { SectionLabel } from '../SectionLabel'

interface TotalCompletionsSectionProps {
  total: number
  colorKey?: string
}

export default function TotalCompletionsSection({ total, colorKey }: TotalCompletionsSectionProps) {
  return (
    <div className="py-12 flex flex-col items-center gap-2 border-y border-muted/10">
      <SectionLabel>Total check-ins</SectionLabel>
      <div className="text-[56px] text-ink font-display leading-none" style={{ fontFamily: 'var(--font-display)' }}>
        {isNaN(total) ? 0 : total}
      </div>
      <div className="text-[11px] text-muted font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
        times completed
      </div>
    </div>
  )
}
