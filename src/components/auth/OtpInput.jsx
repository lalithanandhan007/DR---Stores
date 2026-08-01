import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

/* 6-digit OTP input with auto-advance, backspace navigation and paste support. */
export default function OtpInput({ length = 6, onChange, onComplete, error }) {
  const [values, setValues] = useState(Array(length).fill(''))
  const inputs = useRef([])

  const emit = useCallback((next) => {
    setValues(next)
    const code = next.join('')
    onChange?.(code)
    if (code.length === length) onComplete?.(code)
  }, [length, onChange, onComplete])

  const handleChange = useCallback((idx, raw) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next = [...values]
    next[idx] = digit
    emit(next)
    if (digit && idx < length - 1) inputs.current[idx + 1]?.focus()
  }, [values, emit, length])

  const handleKeyDown = useCallback((idx, e) => {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus()
    }
  }, [values])

  const handlePaste = useCallback((e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const next = Array(length).fill('')
    text.split('').forEach((d, i) => { next[i] = d })
    emit(next)
    if (text.length === length) inputs.current[length - 1]?.focus()
    else inputs.current[Math.min(text.length, length - 1)]?.focus()
  }, [emit, length])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {values.map((val, idx) => (
          <motion.div
            key={idx}
            animate={{ scale: val ? 1 : 1 }}
            whileFocus={{ scale: 1.05 }}
            className="relative"
          >
            <input
              ref={(el) => { inputs.current[idx] = el }}
              value={val}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${idx + 1}`}
              className={`w-11 h-13 sm:w-13 sm:h-14 rounded-2xl border-2 text-center text-xl font-extrabold text-dark bg-white transition-all duration-300 focus:outline-none ${
                error ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                : val ? 'border-primary bg-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10'
                : 'border-black/10 focus:border-primary focus:ring-4 focus:ring-primary/10'
              }`}
            />
          </motion.div>
        ))}
      </div>
      {error && <p className="text-center text-[11px] font-medium text-red-500 mt-2">{error}</p>}
    </div>
  )
}
