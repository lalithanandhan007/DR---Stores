import { motion } from 'framer-motion'

/* Organic SVG background shapes */
function Blob({ cx, cy, rx, ry, fill, opacity = 0.4, rotate = 0 }) {
  return (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} opacity={opacity}
      transform={`rotate(${rotate} ${cx} ${cy})`} />
  )
}

function LeafShape({ x, y, scale = 1, rotate = 0, color = '#4CAF50', opacity = 0.35 }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      <path d="M0-14C7-12 12-5 12 2C12 10 7 14 0 14C-7 14-12 10-12 2C-12-5-7-12 0-14Z" fill={color} />
      <path d="M0-11V11M0-7C-4-4-7-2-8 2M0-2C4 1 6 4 7 6" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  )
}

function DotCluster({ x, y, color, opacity = 0.18 }) {
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      {[[-6,-6],[0,-8],[6,-6],[-3,0],[3,0],[0,6]].map(([dx,dy], i) => (
        <circle key={i} cx={dx} cy={dy} r="1.8" fill={color} />
      ))}
    </g>
  )
}

function FloatingLeaves({ colors, count = 5 }) {
  const leaves = Array.from({ length: count }, (_, i) => ({
    x: 20 + (i * 65) + (i % 2 ? 12 : -12),
    y: 25 + (i * 40) % 85,
    rotate: (i * 73) % 360,
    scale: 0.55 + (i % 3) * 0.22,
    color: colors[i % colors.length],
    delay: i * 0.7,
  }))
  return (
    <g>
      {leaves.map((l, i) => (
        <motion.g
          key={i}
          animate={{ y: [l.y, l.y - 10, l.y], rotate: [l.rotate, l.rotate + 18, l.rotate] }}
          transition={{ duration: 4.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: l.delay }}
        >
          <LeafShape x={l.x} y={l.y} scale={l.scale} rotate={l.rotate} color={l.color} opacity={0.3} />
        </motion.g>
      ))}
    </g>
  )
}

/*
  ProductVisual — SVG background with floating organic elements.
  The emoji is rendered as HTML on top for crisp browser-native emoji.
*/
export default function ProductVisual({ product, size = 'card', isHovered = false }) {
  const [c1, c2] = product.gradient
  const isLarge = size === 'detail'
  const w = isLarge ? 600 : 400
  const h = isLarge ? 600 : 340

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* SVG background layer */}
      <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`bg-${product.id}-${size}`} cx="0.5" cy="0.42" r="0.88">
            <stop offset="0%" stopColor={c1} stopOpacity="0.22" />
            <stop offset="50%" stopColor={c2} stopOpacity="0.10" />
            <stop offset="100%" stopColor="#FAFAFA" stopOpacity="0.5" />
          </radialGradient>
          <radialGradient id={`glow-${product.id}-${size}`} cx="0.5" cy="0.45" r="0.45">
            <stop offset="0%" stopColor={c1} stopOpacity="0.30" />
            <stop offset="100%" stopColor={c1} stopOpacity="0" />
          </radialGradient>
          <filter id={`shadow-${product.id}-${size}`}>
            <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor={c1} floodOpacity="0.22" />
          </filter>
          <linearGradient id={`glass-${product.id}-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base gradient */}
        <rect width={w} height={h} fill={`url(#bg-${product.id}-${size})`} />

        {/* Organic blobs */}
        <Blob cx={w * 0.12} cy={h * 0.22} rx={w * 0.2} ry={h * 0.16} fill={c1} opacity={0.07} rotate={-12} />
        <Blob cx={w * 0.85} cy={h * 0.72} rx={w * 0.17} ry={h * 0.18} fill={c2} opacity={0.06} rotate={28} />
        <Blob cx={w * 0.5} cy={h * 0.88} rx={w * 0.22} ry={h * 0.1} fill={c1} opacity={0.04} rotate={-5} />
        <Blob cx={w * 0.7} cy={h * 0.2} rx={w * 0.12} ry={h * 0.14} fill={c2} opacity={0.05} rotate={15} />

        {/* Concentric rings */}
        <circle cx={w / 2} cy={h * 0.45} r={Math.min(w, h) * 0.3} fill="none" stroke={c1} strokeWidth="0.6" opacity="0.08" />
        <circle cx={w / 2} cy={h * 0.45} r={Math.min(w, h) * 0.22} fill="none" stroke={c1} strokeWidth="0.5" opacity="0.06" strokeDasharray="5 5" />

        {/* Center glow */}
        <circle cx={w / 2} cy={h * 0.45} r={Math.min(w, h) * 0.28} fill={`url(#glow-${product.id}-${size})`} />

        {/* Floating leaves */}
        <FloatingLeaves colors={[c1, c2, '#81C784', '#FFB74D']} count={isLarge ? 6 : 5} />

        {/* Dot clusters */}
        <DotCluster x={w * 0.1} y={h * 0.12} color={c1} opacity={0.15} />
        <DotCluster x={w * 0.9} y={h * 0.85} color={c2} opacity={0.12} />
        <DotCluster x={w * 0.75} y={h * 0.15} color={c1} opacity={0.1} />

        {/* Glass overlay top */}
        <rect width={w} height={h * 0.3} fill={`url(#glass-${product.id}-${size})`} />

        {/* Grain */}
        <filter id={`grain-${product.id}-${size}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={w} height={h} filter={`url(#grain-${product.id}-${size})`} opacity="0.025" />
      </svg>

      {/* Emoji — HTML overlay for crisp rendering */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-[2]"
        animate={isHovered ? { scale: 1.1, y: -6 } : { scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16 }}
      >
        <span
          className="select-none drop-shadow-2xl"
          style={{ fontSize: isLarge ? '11rem' : '7.5rem', filter: `drop-shadow(0 12px 24px ${c1}40)` }}
          role="img"
          aria-label={product.name}
        >
          {product.emoji}
        </span>
      </motion.div>
    </div>
  )
}
