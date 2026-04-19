import { useUIStore } from '../store/uiStore'

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts)
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-4 z-50 flex flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-full px-4 py-2 font-mono text-xs text-cream transition-opacity duration-300 ${toast.type === 'success' ? 'bg-rust' : 'bg-brown'} `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
