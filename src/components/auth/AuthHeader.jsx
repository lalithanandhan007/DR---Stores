import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

/* Consistent animated heading block for auth screens */
export default function AuthHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center lg:text-left mb-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary bg-primary/8 border border-primary/15 px-4 py-2 rounded-full mb-5"
      >
        <Leaf className="w-3.5 h-3.5" />
        {eyebrow}
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-serif-display text-3xl sm:text-4xl font-bold text-dark tracking-tight leading-[1.15]"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-3 text-dark/50 text-sm font-light leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
