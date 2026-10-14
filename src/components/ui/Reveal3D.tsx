import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Reveal3DProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

const offsets = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
}

/** Subtle scroll reveal — fade + slight slide, like Cadila/Teva pharma sites */
export default function Reveal3D({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: Reveal3DProps) {
  const reduceMotion = useReducedMotion()
  const o = offsets[direction]

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, x: o.x, y: o.y }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
