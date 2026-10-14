import { motion, useReducedMotion } from 'framer-motion'
import { Activity, Brain, HeartPulse, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { products } from '../../data/products'
import { therapeuticAreas } from '../../data/therapeuticAreas'

const specialties = [
  { icon: Brain, label: 'Neuro-Psychiatry', color: 'from-blue-accent to-sky-accent' },
  { icon: HeartPulse, label: 'Addiction Care', color: 'from-navy-600 to-blue-accent' },
  { icon: Activity, label: 'Pain Management', color: 'from-orange-500 to-gold-400' },
  { icon: ShieldCheck, label: 'Quality First', color: 'from-navy-700 to-navy-600' },
]

const heroStats = [
  { value: String(products.length), label: 'Products' },
  { value: '170+', label: 'Formulations' },
  { value: String(therapeuticAreas.length), label: 'Focus Areas' },
]

const orbitIcons: { icon: LucideIcon; angle: number }[] = [
  { icon: Brain, angle: 0 },
  { icon: HeartPulse, angle: 90 },
  { icon: Activity, angle: 180 },
  { icon: ShieldCheck, angle: 270 },
]

function OrbitRing({
  size,
  duration,
  reverse,
  dotColor,
  reduceMotion,
}: {
  size: number
  duration: number
  reverse?: boolean
  dotColor: string
  reduceMotion: boolean | null
}) {
  if (reduceMotion) {
    return (
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <div
        className="absolute inset-0 rounded-full border border-dashed border-white/20"
        style={{ borderColor: 'rgba(255,255,255,0.18)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md"
        style={{ width: 10, height: 10, backgroundColor: dotColor }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full opacity-70"
        style={{ width: 6, height: 6, backgroundColor: dotColor }}
      />
    </motion.div>
  )
}

function OrbitIcons({
  radius,
  duration,
  reverse,
  reduceMotion,
}: {
  radius: number
  duration: number
  reverse?: boolean
  reduceMotion: boolean | null
}) {
  if (reduceMotion) return null

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-0 h-0"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {orbitIcons.map(({ icon: Icon, angle }) => (
        <div
          key={angle}
          className="absolute left-0 top-0"
          style={{ transform: `rotate(${angle}deg) translateY(-${radius}px) translate(-50%, -50%)` }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-gold-400 flex items-center justify-center shadow-lg ring-2 ring-white/20">
            <Icon className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default function HeroVisual() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="w-full max-w-[460px] mx-auto lg:mx-0 lg:ml-auto">
      <div className="relative rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-md shadow-2xl shadow-navy-950/30 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-blue-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-center pt-10 pb-6 px-6 min-h-[280px]">
          {/* Connection lines (static) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
            viewBox="0 0 400 280"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            {[
              { cx: 200, cy: 40 },
              { cx: 340, cy: 140 },
              { cx: 200, cy: 240 },
              { cx: 60, cy: 140 },
            ].map((p, i) => (
              <line
                key={i}
                x1="200" y1="140"
                x2={p.cx} y2={p.cy}
                stroke="rgba(91,192,235,0.25)"
                strokeWidth="1"
              />
            ))}
          </svg>

          {/* Orbital hub — brain + moving circles */}
          <div className="relative w-[220px] h-[220px] sm:w-[240px] sm:h-[240px] flex items-center justify-center">
            <OrbitRing size={220} duration={24} dotColor="#f37021" reduceMotion={reduceMotion} />
            <OrbitRing size={170} duration={18} reverse dotColor="#5bc0eb" reduceMotion={reduceMotion} />
            <OrbitRing size={120} duration={14} dotColor="#ffd200" reduceMotion={reduceMotion} />
            <OrbitIcons radius={105} duration={22} reverse reduceMotion={reduceMotion} />

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-navy-700 via-blue-accent to-navy-900 flex items-center justify-center shadow-xl shadow-blue-accent/30 ring-2 ring-white/25">
                <Brain className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={1.5} />
              </div>
              {!reduceMotion && (
                <div className="absolute inset-0 rounded-full border border-orange-400/30 animate-ping-slow" />
              )}
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 px-5 pb-5">
          {specialties.map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="flex items-center gap-2.5 rounded-xl bg-white/[0.07] border border-white/10 px-3 py-2.5"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-white/85 text-xs font-semibold">{label}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-white/[0.04]">
          {heroStats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="py-4 px-2 text-center"
            >
              <p className="text-orange-400 text-lg sm:text-xl font-bold leading-none">{value}</p>
              <p className="text-white/50 text-[10px] uppercase tracking-wider mt-1.5">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
