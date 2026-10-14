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
import { Link, useParams } from 'react-router-dom'
import AnimatedSection from '../components/ui/AnimatedSection'
import PageHero3D from '../components/ui/PageHero3D'
import ProductCard from '../components/ui/ProductCard'
import Tilt3D from '../components/ui/Tilt3D'
import { getProductsForTherapeuticArea, getTherapeuticAreaBySlug } from '../data/therapeuticAreas'

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

export default function TherapeuticAreaDetail() {
  const { slug } = useParams()
  const area = getTherapeuticAreaBySlug(slug || '')

  if (!area) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">
            Therapeutic Area Not Found
          </h1>
          <Link to="/therapeutic-areas" className="text-orange-500 font-semibold">
            ← Back to Therapeutic Areas
          </Link>
        </div>
      </div>
    )
  }

  const Icon = iconMap[area.icon] || Pill
  const areaProducts = getProductsForTherapeuticArea(area)

  return (
    <>
      <PageHero3D
        label="Therapeutic Area"
        title={area.name}
        subtitle={area.description}
        align="left"
        backLink={{ to: '/therapeutic-areas', label: 'All Therapeutic Areas' }}
      >
        <div className="flex items-center gap-4 mt-4">
          <div className="w-14 h-14 rounded-2xl gradient-orange flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <span className="text-white/60 text-sm">{areaProducts.length} products</span>
        </div>
      </PageHero3D>

      <section className="py-16 perspective-1400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">
              Our Therapeutic Focus
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {area.highlights.map((highlight, i) => (
                <AnimatedSection key={highlight} delay={i * 0.08}>
                  <Tilt3D intensity={10}>
                    <div className="flex items-start gap-3 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors card-shine h-full">
                      <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center shrink-0 text-white text-sm font-bold">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 text-sm font-medium">{highlight}</p>
                    </div>
                  </Tilt3D>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-navy-900">
                Products in {area.name}
              </h2>
              <span className="text-sm text-gray-500">
                {areaProducts.length} products
              </span>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {areaProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
