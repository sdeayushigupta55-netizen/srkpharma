import { motion } from 'framer-motion'

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  light?: boolean
  centered?: boolean
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  light = false,
  centered = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 perspective-1200 ${centered ? 'text-center' : ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {label && (
        <motion.span
          initial={{ opacity: 0, z: -30 }}
          whileInView={{ opacity: 1, z: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`inline-block text-sm font-semibold uppercase tracking-widest mb-3 ${
            light ? 'text-orange-400' : 'text-orange-500'
          }`}
        >
          {label}
        </motion.span>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold mb-4 ${
          light ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${
            light ? 'text-white/70' : 'text-gray-600'
          }`}
        >
          {subtitle}
        </p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`mt-4 h-1 w-16 rounded-full gradient-orange origin-left ${
          centered ? 'mx-auto origin-center' : ''
        }`}
      />
    </motion.div>
  )
}
