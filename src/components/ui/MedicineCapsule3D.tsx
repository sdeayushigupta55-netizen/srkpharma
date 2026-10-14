import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'

interface MedicineCapsule3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  topColor?: string
  bottomColor?: string
  className?: string
  delay?: number
  duration?: number
  floatY?: number
  rotateY?: number
  style?: CSSProperties
}

const sizes = {
  sm: { w: 14, h: 36 },
  md: { w: 20, h: 52 },
  lg: { w: 28, h: 72 },
  xl: { w: 36, h: 96 },
}

export default function MedicineCapsule3D({
  size = 'md',
  topColor = 'from-orange-500 to-orange-400',
  bottomColor = 'from-white to-slate-200',
  className = '',
  delay = 0,
  duration = 7,
  floatY = 18,
  rotateY = 360,
  style,
}: MedicineCapsule3DProps) {
  const reduceMotion = useReducedMotion()
  const { w, h } = sizes[size]

  return (
    <motion.div
      className={`preserve-3d ${className}`}
      style={{ perspective: 600, ...style }}
      animate={
        reduceMotion
          ? {}
          : {
              y: [0, -floatY, 0],
              rotateY: [0, rotateY],
              rotateX: [8, -8, 8],
              rotateZ: [-4, 4, -4],
            }
      }
      transition={{
        y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        rotateY: { duration: duration * 2.5, repeat: Infinity, ease: 'linear', delay },
        rotateX: { duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut', delay },
        rotateZ: { duration: duration * 0.9, repeat: Infinity, ease: 'easeInOut', delay },
      }}
    >
      <div
        className="relative shadow-2xl"
        style={{
          width: w,
          height: h,
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))',
        }}
      >
        {/* Capsule body */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden flex flex-col ring-1 ring-white/25"
          style={{ transform: 'translateZ(8px)' }}
        >
          <div className={`flex-1 bg-gradient-to-b ${topColor}`} />
          <div className="h-px bg-white/40 shrink-0" />
          <div className={`flex-1 bg-gradient-to-b ${bottomColor}`} />
        </div>
        {/* Highlight shine */}
        <div
          className="absolute top-[12%] left-[18%] w-[22%] h-[55%] rounded-full bg-white/25 blur-[1px]"
          style={{ transform: 'translateZ(12px)' }}
        />
        {/* 3D depth edge */}
        <div
          className="absolute inset-0 rounded-full bg-navy-900/20"
          style={{ transform: 'translateZ(-6px) scale(0.96)' }}
        />
      </div>
    </motion.div>
  )
}
