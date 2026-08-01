import { motion } from 'framer-motion'
import { ArrowLeft, Hammer } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { adminModules, modulePlans } from '../../data/adminData'
import { AdminIcon } from './ui'

export default function ModulePlaceholder() {
  const { activeModule, openModule } = useAdmin()
  const module = adminModules.find((m) => m.id === activeModule) || adminModules[0]
  const plan = modulePlans[module.id] || 'Full management tools are on the way.'

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-lg"
      >
        <div className="relative inline-flex">
          <motion.div
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lift shadow-primary/20"
          >
            <AdminIcon name={module.icon} className="w-9 h-9 text-white" />
          </motion.div>
          <span className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center shadow-md">
            <Hammer className="w-4 h-4" />
          </span>
        </div>

        <h1 className="mt-7 font-serif-display text-3xl font-bold text-dark tracking-tight">{module.label}</h1>
        <p className="mt-3 text-sm text-dark/50 font-light leading-relaxed">{plan}</p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/15 px-5 py-2.5 text-xs font-bold text-primary">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full w-2 h-2 bg-primary" />
          </span>
          Coming in the next phase
        </div>

        <button
          onClick={() => openModule('dashboard')}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </motion.div>
    </div>
  )
}
