import type { Product } from '../types'

export interface ProductBrandGroup {
  brand: string
  products: Product[]
  genericName: string
  category: Product['category']
  hasImage: boolean
  image?: string
}

export function getBrandKey(name: string) {
  return name.split(/\s+/)[0]
}

export function groupProductsByBrand(items: Product[]): ProductBrandGroup[] {
  const map = new Map<string, Product[]>()

  for (const product of items) {
    const brand = getBrandKey(product.name)
    const list = map.get(brand) ?? []
    list.push(product)
    map.set(brand, list)
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([brand, groupProducts]) => {
      const sorted = [...groupProducts].sort((a, b) => a.name.localeCompare(b.name))
      const withImage = sorted.find((p) => p.image)
      return {
        brand,
        products: sorted,
        genericName: sorted[0].genericName,
        category: sorted[0].category,
        hasImage: Boolean(withImage),
        image: withImage?.image,
      }
    })
}
