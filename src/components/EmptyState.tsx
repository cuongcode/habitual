import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  compact?: boolean
}

export function EmptyState({ icon, title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`flex flex-1 flex-col items-center justify-center px-8 ${compact ? 'gap-2' : 'gap-4'}`}>
      {icon && <div className="text-muted-light">{icon}</div>}
      <div className={`flex flex-col items-center ${compact ? 'gap-1' : 'gap-2'}`}>
        <h3 className={`m-0 text-center font-display text-ink ${compact ? 'text-base' : 'text-lg'}`}>
          {title}
        </h3>
        <p className="m-0 text-center font-mono text-xs leading-relaxed text-muted">
          {description}
        </p>
      </div>
      {action && <div className={compact ? 'mt-1' : 'mt-2'}>{action}</div>}
    </div>
  )
}
