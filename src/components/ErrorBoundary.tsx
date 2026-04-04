import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center fixed inset-0 bg-cream gap-4 px-8 overflow-hidden">
          <p className="font-display text-ink text-xl text-center m-0">
            Something went wrong
          </p>
          <p className="font-mono text-muted text-xs text-center m-0">
            {this.state.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rust text-cream font-mono text-xs px-4 py-2 rounded-full mt-2 active:scale-95 transition-transform"
          >
            Reload app
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
