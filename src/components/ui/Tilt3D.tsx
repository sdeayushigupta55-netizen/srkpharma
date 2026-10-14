import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
} from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface Tilt3DProps {
  children: ReactNode
  className?: string
  intensity?: number
  scale?: number
  spring?: SpringOptions
}

export default function Tilt3D({
  children,
  className = '',
  intensity = 8,
  scale = 1.015,
  spring = { stiffness: 200, damping: 28 },
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), spring)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), spring)
  const lift = useSpring(useTransform(my, [-0.5, 0.5], [4, 10]), spring)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div className={`perspective-1200 ${className}`} ref={ref}>
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, z: lift, transformStyle: 'preserve-3d' }}
        whileHover={{ scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}
