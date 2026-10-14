import { LayoutGrid, List } from 'lucide-react'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import AnimatedSection from '../components/ui/AnimatedSection'
import BrandProductGroup from '../components/ui/BrandProductGroup'
import PageHero3D from '../components/ui/PageHero3D'
import ProductCard from '../components/ui/ProductCard'
import { productCategories } from '../data/categories'
import { products } from '../data/products'
import type { ProductCategory } from '../types'
import { groupProductsByBrand } from '../utils/productGroups'

type ViewMode = 'grouped' | 'grid'

export default function Products() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grouped')

  const categoryCounts = useMemo(() => {
    const counts = new Map<ProductCategory, number>()
    for (const p of products) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    }
    return counts
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === 'all' || p.category === activeCategory
      const q = search.toLowerCase()
      const matchesSearch =
        search === '' ||
        p.name.toLowerCase().includes(q) ||
        p.genericName.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

  const brandGroups = useMemo(() => groupProductsByBrand(filtered), [filtered])

  return (
    <>
      <PageHero3D
        label="Portfolio"
        title="Our Products"
        subtitle={`${products.length} quality-assured CNS formulations across ${productCategories.length - 1} therapeutic categories`}
      />

      <section className="py-16 perspective-1400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by brand, generic name, or composition..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20 outline-none transition-all"
                />
              </div>

              <div className="flex rounded-xl border border-gray-200 p-1 bg-gray-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grouped')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grouped'
                      ? 'bg-white text-navy-900 shadow-sm'
                      : 'text-gray-500 hover:text-navy-900'
                  }`}
                >
                  <List size={16} />
                  By Brand
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-navy-900 shadow-sm'
                      : 'text-gray-500 hover:text-navy-900'
                  }`}
                >
                  <LayoutGrid size={16} />
                  All Products
                </button>
              </div>
            </div>

            <div className="mb-10">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-1 h-6 rounded-full gradient-orange" />

    <h2 className="text-lg font-bold text-navy-900">
      Therapeutic Areas
    </h2>
  </div>

  <div className="flex flex-wrap gap-2">
    <button
      type="button"
      onClick={() => setActiveCategory('all')}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        activeCategory === 'all'
          ? 'gradient-orange text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      All ({products.length})
    </button>

    {productCategories.map((cat) => {
      const count = categoryCounts.get(cat.id) ?? 0

      if (count === 0) return null

      return (
        <button
          type="button"
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === cat.id
              ? 'gradient-orange text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.shortLabel} ({count})
        </button>
      )
    })}
  </div>
</div>
          </AnimatedSection>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found matching your search.</p>
            </div>
          ) : viewMode === 'grouped' ? (
            <div className="space-y-3">
              {brandGroups.map((group) => (
                <BrandProductGroup
                  key={group.brand}
                  group={group}
                  defaultOpen={Boolean(search) && group.products.length > 1}
                />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
