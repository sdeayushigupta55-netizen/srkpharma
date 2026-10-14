/** Resolve public folder assets to a root-safe URL (works on nested routes like /products/slug). */
export function assetUrl(path: string) {
  const clean = path.replace(/^\//, '')
  const base = import.meta.env.BASE_URL ?? '/'

  // Root deploy — always use absolute path from site root
  if (base === '/' || base === './') {
    return `/${clean}`
  }

  // Subpath deploy e.g. /myapp/
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base
  return `${prefix}/${clean}`
}

export const images = {
  logo: assetUrl('images/logo.png'),
  chlozapam: assetUrl('images/chlozapam-050.png'),
  unzolamP: assetUrl('images/unzolam-p.png'),
}

export function productImageUrl(src?: string) {
  if (!src) return undefined
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return assetUrl(src.replace(/^\//, ''))
}
