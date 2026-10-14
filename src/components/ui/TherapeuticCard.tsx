import { Link } from 'react-router-dom'
import {
  Activity,
  Brain,
  Heart,
  Microscope,
  Pill,
  Shield,
  Sparkles,
  Wind,
} from 'lucide-react'
import type { TherapeuticArea } from '../../types'
import Reveal3D from './Reveal3D'
import Tilt3D from './Tilt3D'

const iconMap: Record<string, typeof Brain> = {
  brain: Brain,
  heart: Heart,
  activity: Activity,
  shield: Shield,
  wind: Wind,
  sparkles: Sparkles,
  pill: Pill,
  microscope: Microscope,
}

interface TherapeuticCardProps {
  area: TherapeuticArea
  index?: number
}

export default function TherapeuticCard({ area, index = 0 }: TherapeuticCardProps) {
  const Icon = iconMap[area.icon] || Pill

  return (
    <Reveal3D delay={index * 0.1} direction={index % 2 === 0 ? 'up' : 'right'}>
      <Tilt3D intensity={12}>
        <Link
          to={`/therapeutic-areas/${area.slug}`}
          className="group block relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-2xl transition-all duration-500 card-shine"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-accent/5 to-transparent rounded-bl-full" />
          <div className="relative">
            <div
              className="w-14 h-14 rounded-xl gradient-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
              style={{ transform: 'translateZ(25px)' }}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h3
              className="text-xl font-bold text-navy-900 mb-2 group-hover:text-blue-accent transition-colors"
              style={{ transform: 'translateZ(15px)' }}
            >
              {area.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{area.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-500">
                {area.productCount} Products
              </span>
              <span className="text-navy-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Explore →
              </span>
            </div>
          </div>
        </Link>
      </Tilt3D>
    </Reveal3D>
  )
}
