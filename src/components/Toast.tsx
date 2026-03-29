import { useUIStore } from '../store/uiStore'

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts)
  return (
    <div className="fixed top-4 left-0 right-0 flex flex-col items-center gap-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-2 rounded-full text-cream font-mono text-xs
            transition-opacity duration-300
            ${toast.type === 'success' ? 'bg-rust' : 'bg-brown'}
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
