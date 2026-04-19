import type { ReactNode } from 'react'
import { Component } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden bg-cream px-8">
          <p className="m-0 text-center font-display text-xl text-ink">Something went wrong</p>
          <p className="m-0 text-center font-mono text-xs text-muted">{this.state.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-full bg-rust px-4 py-2 font-mono text-xs text-cream transition-transform active:scale-95"
          >
            Reload app
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
