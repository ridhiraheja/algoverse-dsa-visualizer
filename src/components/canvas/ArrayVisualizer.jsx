import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../../context/SoundContext'

export default function ArrayVisualizer({ step }) {
  const { triggerCompare, triggerSwap, triggerSuccess } = useSound()

  if (!step || !step.array) {
    return (
      <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No Array Data
      </div>
    )
  }

  const { array, comparing = [], swapped = false, sorted = [], found = -1 } = step
  const maxVal = Math.max(...array, 1)

  // Sound triggers on step update
  useEffect(() => {
    if (swapped) {
      triggerSwap()
    } else if (comparing.length > 0) {
      const val = array[comparing[0]] || 0
      triggerCompare(val, maxVal)
    } else if (step.done) {
      triggerSuccess()
    }
  }, [step])

  return (
    <div style={{
      height: '350px',
      width: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: array.length > 30 ? '3px' : '8px',
      padding: '1.5rem 1rem 0.5rem 1rem',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden'
    }}>
      <AnimatePresence>
        {array.map((value, idx) => {
          const isComparing = comparing.includes(idx)
          const isSwapped = swapped && isComparing
          const isSorted = sorted.includes(idx)
          const isFound = found === idx

          let bg = 'linear-gradient(180deg, #6366f1, #4f46e5)' // Default indigo
          let glow = 'none'

          if (isFound) {
            bg = 'linear-gradient(180deg, #38bdf8, #0284c7)' // Cyan found
            glow = '0 0 15px rgba(56, 189, 248, 0.4)'
          } else if (isSwapped) {
            bg = 'linear-gradient(180deg, #ef4444, #dc2626)' // Red swapped
            glow = '0 0 15px rgba(239, 68, 68, 0.4)'
          } else if (isComparing) {
            bg = 'linear-gradient(180deg, #f59e0b, #d97706)' // Amber comparing
            glow = '0 0 15px rgba(245, 158, 11, 0.4)'
          } else if (isSorted) {
            bg = 'linear-gradient(180deg, #10b981, #059669)' // Emerald sorted
            glow = '0 0 10px rgba(16, 185, 129, 0.3)'
          }

          const heightPercent = Math.max(10, (value / maxVal) * 100)

          return (
            <motion.div
              key={`bar-${idx}-${value}`}
              layout
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                flex: 1,
                maxWidth: '45px',
                height: `${heightPercent}%`,
                background: bg,
                borderRadius: '6px 6px 2px 2px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                boxShadow: glow,
                paddingTop: '6px',
                position: 'relative'
              }}
            >
              {array.length <= 25 && (
                <span style={{
                  fontSize: array.length > 15 ? '0.65rem' : '0.8rem',
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  {value}
                </span>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
