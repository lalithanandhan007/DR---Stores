import { Component } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, RotateCcw, Home } from 'lucide-react'

/* ====================================================================
   Top-level error boundary. Catches any render error so the app never
   silently drops to a blank white page — instead we show a branded
   fallback with a way to recover (reload / go home).
   ==================================================================== */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surface to console for debugging; the UI still renders the fallback.
    console.error('[ErrorBoundary] Caught render error:', error, info?.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lift mb-6"
          >
            <Leaf className="w-9 h-9 text-white" />
          </motion.div>
          <h1 className="font-serif-display text-2xl font-bold text-dark">Something went wrong</h1>
          <p className="text-sm text-dark/45 mt-2 font-light">
            An unexpected error occurred while rendering this page. Your data is safe — please try reloading.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm shadow-lg shadow-primary/15 hover:shadow-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Try again
            </button>
            <Link
              to="/"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-black/10 text-sm font-bold text-dark/70 hover:border-dark/25 transition-all"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error?.message && (
            <p className="mt-6 text-[11px] text-red-500/70 font-mono break-all">{this.state.error.message}</p>
          )}
        </div>
      </div>
    )
  }
}
