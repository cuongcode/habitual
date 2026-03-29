interface TotalCompletionsSectionProps {
  total: number
}

export default function TotalCompletionsSection({ total }: TotalCompletionsSectionProps) {
  return (
    <div className="py-12 flex flex-col items-center gap-2 border-y border-rust/10">
      <div className="text-[11px] text-muted font-mono uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)' }}>
        Total check-ins
      </div>
      <div className="text-[56px] text-ink font-display leading-none" style={{ fontFamily: 'var(--font-display)' }}>
        {total}
      </div>
      <div className="text-[11px] text-muted font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
        times completed
      </div>
    </div>
  )
}
