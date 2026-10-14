import { Link } from 'react-router-dom'
import { getCategoryLabel } from '../../data/categories'
import type { Product } from '../../types'
import ProductImage from './ProductImage'
import Reveal3D from './Reveal3D'
import Tilt3D from './Tilt3D'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <Reveal3D delay={index * 0.06} direction={index % 2 === 0 ? 'up' : 'left'}>
      <Tilt3D intensity={10} scale={1.04}>
        <Link
          to={`/products/${product.slug}`}
          className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-orange-200/50 transition-all duration-500 card-shine"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="relative h-52 bg-white flex items-center justify-center p-4 border-b border-gray-100"
            style={{ transform: 'translateZ(20px)' }}
          >
            <ProductImage
              src={product.image}
              alt={product.name}
              className="h-44 w-full object-contain"
              containerClassName="h-44 w-full"
            />
            <span
              className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${
                product.prescriptionType === 'NRx'
                  ? 'bg-red-100 text-red-600'
                  : product.prescriptionType === 'Rx'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-green-100 text-green-600'
              }`}
              style={{ transform: 'translateZ(30px)' }}
            >
              {product.prescriptionType}
            </span>
          </div>
          <div className="p-5" style={{ transform: 'translateZ(10px)' }}>
            <h3 className="text-lg font-bold text-navy-900 group-hover:text-blue-accent transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {product.genericName}
            </p>
            <span className="inline-block mt-2 text-[11px] font-medium px-2.5 py-1 rounded-full bg-navy-900/5 text-navy-700">
              {getCategoryLabel(product.category)}
            </span>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-400">{product.packSize}</span>
              <span className="text-sm font-semibold text-orange-500 group-hover:translate-x-1 transition-transform">
                View Details →
              </span>
            </div>
          </div>
        </Link>
      </Tilt3D>
    </Reveal3D>
  )
}
