import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategoryLabel } from '../../data/categories'
import type { ProductBrandGroup } from '../../utils/productGroups'
import ProductImage from './ProductImage'

interface BrandProductGroupProps {
  group: ProductBrandGroup
  defaultOpen?: boolean
}

export default function BrandProductGroup({ group, defaultOpen = false }: BrandProductGroupProps) {
  const [open, setOpen] = useState(defaultOpen)
  const single = group.products.length === 1
  const product = group.products[0]

  if (single) {
    return (
      <Link
        to={`/products/${product.slug}`}
        className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all card-shine"
      >
        <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 p-2">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="h-12 w-full object-contain"
            containerClassName="h-12 w-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-navy-900 group-hover:text-blue-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{product.genericName}</p>
          <span className="inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-navy-900/5 text-navy-700">
            {getCategoryLabel(product.category)}
          </span>
        </div>
        <span className="text-sm font-semibold text-orange-500 shrink-0">View →</span>
      </Link>
    )
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden hover:border-orange-200/60 transition-colors card-shine">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/80 transition-colors"
        aria-expanded={open}
      >
        <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 p-2">
          <ProductImage
            src={group.hasImage ? group.image : undefined}
            alt={group.brand}
            className="h-12 w-full object-contain"
            containerClassName="h-12 w-full"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-navy-900 text-lg">{group.brand}</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
              {group.products.length} variants
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-1">{group.genericName}</p>
          <p className="text-xs text-gray-400 mt-1">{getCategoryLabel(group.category)}</p>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-gray-100">
              <div className="flex flex-wrap gap-2 pt-4">
                {group.products.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold text-navy-800 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors"
                  >
                    {p.name}
                    <span className="text-xs font-normal text-gray-400">{p.packSize}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
