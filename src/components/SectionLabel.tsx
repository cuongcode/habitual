export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="m-0 mb-3 px-2 font-mono text-[11px] uppercase tracking-wider text-muted">
      {children}
    </h2>
  )
}
