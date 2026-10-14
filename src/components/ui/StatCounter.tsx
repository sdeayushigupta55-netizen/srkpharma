import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface StatCounterProps {
  value: number
  suffix?: string
  label: string
  index?: number
}

export default function StatCounter({
  value,
  suffix = '',
  label,
  index = 0,
}: StatCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animate(count, value, { duration: 2, ease: 'easeOut' })
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [count, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        <motion.span>{rounded}</motion.span>
        <span className="text-orange-400">{suffix}</span>
      </div>
      <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  )
}
