import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function TrashNav() {
  const navigate = useNavigate()
  return (
    <nav className="pb-safe flex items-center border-t border-muted-light bg-cream px-6 py-3">
      <button
        onClick={() => navigate('/settings')}
        className="flex items-center gap-2 text-ink transition-colors hover:text-rust"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-serif text-[15px]">Settings</span>
      </button>
    </nav>
  )
}
