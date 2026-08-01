import { motion } from 'framer-motion'

/* Gradient avatar with initials fallback, or uploaded photo */
export default function Avatar({ name = '', avatar, size = 48, ring = false, className = '' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'U'

  const style = { width: size, height: size, fontSize: size * 0.36 }

  if (avatar) {
    return (
      <motion.img
        whileHover={{ scale: 1.05 }}
        src={avatar}
        alt={name}
        style={style}
        className={`rounded-full object-cover ${ring ? 'ring-3 ring-white shadow-card' : ''} ${className}`}
      />
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={style}
      className={`rounded-full bg-gradient-to-br from-primary via-secondary to-primary-dark text-white font-extrabold flex items-center justify-center select-none ${ring ? 'ring-3 ring-white shadow-card' : ''} ${className}`}
    >
      {initials}
    </motion.div>
  )
}
