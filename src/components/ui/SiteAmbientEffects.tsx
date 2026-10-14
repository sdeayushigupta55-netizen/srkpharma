import { useReducedMotion } from 'framer-motion'
import MedicineCapsule3D from './MedicineCapsule3D'
import ParticleCanvas from './ParticleCanvas'

type AmbientCapsule = {
  size: 'sm' | 'md'
  top: string
  left: string
  delay: number
  duration: number
  topColor: string
  bottomColor: string
  opacity: number
}

/** Side-edge capsules — evenly spaced, no overlap */
const ambientCapsules: AmbientCapsule[] = [
  // Left edge
  { size: 'md', top: '12%', left: '2%', delay: 0, duration: 10, topColor: 'from-orange-500 to-gold-400', bottomColor: 'from-white to-slate-100', opacity: 0.65 },
  { size: 'sm', top: '45%', left: '3%', delay: 1.2, duration: 9, topColor: 'from-blue-accent to-sky-accent', bottomColor: 'from-white to-blue-50', opacity: 0.58 },
  { size: 'sm', top: '78%', left: '2%', delay: 2.1, duration: 11, topColor: 'from-navy-600 to-blue-accent', bottomColor: 'from-white to-slate-200', opacity: 0.6 },
  // Right edge
  { size: 'md', top: '15%', left: '97%', delay: 0.5, duration: 10.5, topColor: 'from-orange-500 to-orange-400', bottomColor: 'from-white to-amber-50', opacity: 0.62 },
  { size: 'sm', top: '48%', left: '96%', delay: 1.6, duration: 8.5, topColor: 'from-navy-700 to-navy-600', bottomColor: 'from-white to-slate-100', opacity: 0.55 },
  { size: 'sm', top: '82%', left: '97%', delay: 0.9, duration: 9.5, topColor: 'from-gold-400 to-orange-400', bottomColor: 'from-white to-slate-200', opacity: 0.58 },
]

export default function SiteAmbientEffects() {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <ParticleCanvas density={0.000028} connectDistance={110} className="opacity-[0.28]" />

      <div className="hidden lg:block absolute inset-0">
        {ambientCapsules.map((cap, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: cap.top, left: cap.left, opacity: cap.opacity }}
          >
            <MedicineCapsule3D
              size={cap.size}
              topColor={cap.topColor}
              bottomColor={cap.bottomColor}
              delay={cap.delay}
              duration={cap.duration}
              floatY={12}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
