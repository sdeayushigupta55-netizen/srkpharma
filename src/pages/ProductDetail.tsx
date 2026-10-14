import { AlertTriangle, CheckCircle, Package, Pill } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AnimatedSection from '../components/ui/AnimatedSection'
import PageHero3D from '../components/ui/PageHero3D'
import ProductCard from '../components/ui/ProductCard'
import ProductImage from '../components/ui/ProductImage'
import Tilt3D from '../components/ui/Tilt3D'
import { getCategoryLabel } from '../data/categories'
import { getProductBySlug, getProductsByCategory } from '../data/products'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProductBySlug(slug || '')

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">
            Product Not Found
          </h1>
          <Link to="/products" className="text-orange-500 font-semibold">
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  return (
    <>
      <PageHero3D
        label={product.genericName}
        title={product.name}
        align="left"
        backLink={{ to: '/products', label: 'Back to Products' }}
      >
        <div className="flex items-center gap-3 mt-4">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              product.prescriptionType === 'NRx'
                ? 'bg-red-500/20 text-red-300'
                : product.prescriptionType === 'Rx'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-green-500/20 text-green-300'
            }`}
          >
            {product.prescriptionType}
          </span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/80">
            {getCategoryLabel(product.category)}
          </span>
        </div>
      </PageHero3D>

      <section className="py-16 perspective-1400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <Tilt3D intensity={10}>
                <div className="rounded-2xl bg-white border border-gray-100 p-8 flex items-center justify-center min-h-[400px] shadow-sm card-shine">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="max-h-80 w-full object-contain"
                    containerClassName="min-h-[320px] w-full"
                  />
                </div>
              </Tilt3D>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-3">
                    Product Overview
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Composition', value: product.composition, icon: Pill },
                    { label: 'Dosage', value: product.dosage, icon: Package },
                    { label: 'Pack Size', value: product.packSize, icon: Package },
                    {
                      label: 'Classification',
                      value: product.prescriptionType,
                      icon: CheckCircle,
                    },
                  ].map(({ label, value, icon: Icon }) => (
                    <Tilt3D key={label} intensity={6}>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-orange-500" />
                          <span className="text-xs font-semibold text-gray-400 uppercase">
                            {label}
                          </span>
                        </div>
                        <p className="text-navy-900 font-medium text-sm">{value}</p>
                      </div>
                    </Tilt3D>
                  ))}
                </div>

                <div>
                  <h3 className="font-bold text-navy-900 mb-3">Indications</h3>
                  <ul className="space-y-2">
                    {product.indications.map((ind) => (
                      <li
                        key={ind}
                        className="flex items-start gap-2 text-gray-600 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {ind}
                      </li>
                    ))}
                  </ul>
                </div>

                {product.administration && (
                  <div>
                    <h3 className="font-bold text-navy-900 mb-3">
                      Dosage &amp; Administration
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.administration}
                    </p>
                  </div>
                )}

                {product.howItWorks && (
                  <div>
                    <h3 className="font-bold text-navy-900 mb-3">How It Works</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.howItWorks}
                    </p>
                  </div>
                )}

                {product.sideEffects && product.sideEffects.length > 0 && (
                  <div>
                    <h3 className="font-bold text-navy-900 mb-3">Common Side Effects</h3>
                    <ul className="space-y-2">
                      {product.sideEffects.map((effect) => (
                        <li
                          key={effect}
                          className="flex items-start gap-2 text-gray-600 text-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                          {effect}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      Most side effects do not require medical attention and disappear as
                      your body adjusts. Consult your doctor if they persist.
                    </p>
                  </div>
                )}

                {product.warnings && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-800 mb-1">
                          Important Warnings
                        </p>
                        <p className="text-sm text-red-700 leading-relaxed">
                          {product.warnings}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Storage:</strong> {product.storage}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-xs text-red-700">
                    <strong>Disclaimer:</strong> Dosage as directed by the
                    Physician. This information is for healthcare professionals
                    only. Brand names are for reference purpose only and shall
                    not be treated as an advertisement.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-gray-50 perspective-1400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-navy-900 mb-8">
                Related Products
              </h2>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
