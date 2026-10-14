import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import Background3D from './Background3D'

interface PageHero3DProps {
  label: string
  title: string
  subtitle?: string
  children?: ReactNode
  backLink?: { to: string; label: string }
  align?: 'center' | 'left'
}

export default function PageHero3D({
  label,
  title,
  subtitle,
  children,
  backLink,
  align = 'center',
}: PageHero3DProps) {
  const isCenter = align === 'center'
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero-mesh pt-32 pb-20 relative overflow-hidden">
      <Background3D />
      <div className="absolute inset-0 hex-pattern opacity-20" />

      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isCenter ? 'text-center' : ''}`}>
        {backLink && (
          <Link
            to={backLink.to}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> {backLink.label}
          </Link>
        )}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-block text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">
            {label}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">{title}</h1>
          {subtitle && (
            <p className={`text-white/70 text-lg max-w-2xl ${isCenter ? 'mx-auto' : ''}`}>{subtitle}</p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  )
}
