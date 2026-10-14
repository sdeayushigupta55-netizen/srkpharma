/**
 * Generates src/data/products.ts from scripts/master-products.json
 * Run: node scripts/generate-products.mjs
 */
import fs from 'fs'
import path from 'path'

const root = path.resolve(import.meta.dirname, '..')
const masterPath = path.join(root, 'scripts/master-products.json')
const imagesDir = path.join(root, 'public/images')
const outPath = path.join(root, 'src/data/products.ts')

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))

const imageFiles = new Set(
  fs.readdirSync(imagesDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
)

function resolveImage(slug) {
  for (const ext of ['png', 'jpeg', 'jpg', 'webp']) {
    if (imageFiles.has(`${slug}.${ext}`)) return `/images/${slug}.${ext}`
  }
  return undefined
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function therapeuticArea(category) {
  return category === 'general' ? 'general' : 'neurology'
}

const lines = []
lines.push(`import type { Product } from '../types'`)
lines.push('')
lines.push(`const storage =`)
lines.push(`  'Store in a cool, dry place. Protect from light. Keep out of reach of children.'`)
lines.push('')
lines.push(`export const products: Product[] = [`)

for (const p of master.products) {
  const image = resolveImage(p.slug)
  const imageLine = image ? `\n    image: '${image}',` : ''
  const extras = []
  if (p.warnings) extras.push(`    warnings: '${esc(p.warnings)}',`)
  if (p.administration) extras.push(`    administration: '${esc(p.administration)}',`)
  if (p.howItWorks) extras.push(`    howItWorks: '${esc(p.howItWorks)}',`)
  if (p.sideEffects?.length) {
    extras.push(
      `    sideEffects: [${p.sideEffects.map((s) => `'${esc(s)}'`).join(', ')}],`
    )
  }

  lines.push(`  {`)
  lines.push(`    id: '${p.slug}',`)
  lines.push(`    name: '${esc(p.name)}',`)
  lines.push(`    slug: '${p.slug}',`)
  lines.push(`    genericName: '${esc(p.genericName)}',`)
  lines.push(`    composition: '${esc(p.composition)}',`)
  lines.push(`    dosage: '${esc(p.dosage)}',`)
  lines.push(`    packSize: '${esc(p.packSize)}',`)
  lines.push(`    category: '${p.category}',`)
  lines.push(`    therapeuticArea: '${therapeuticArea(p.category)}',`)
  lines.push(`    prescriptionType: '${p.prescriptionType}',${imageLine}`)
  lines.push(`    description: '${esc(p.description)}',`)
  lines.push(`    indications: [${p.indications.map((i) => `'${esc(i)}'`).join(', ')}],`)
  lines.push(`    storage: '${esc(p.storage || 'Store in a cool, dry place. Protect from light. Keep out of reach of children.')}',`)
  extras.forEach((l) => lines.push(l))
  lines.push(`  },`)
}

lines.push(`]`)
lines.push('')
lines.push(`export function getProductBySlug(slug: string) {`)
lines.push(`  return products.find((p) => p.slug === slug)`)
lines.push(`}`)
lines.push('')
lines.push(`export function getProductsByArea(areaId: string) {`)
lines.push(`  return products.filter((p) => p.therapeuticArea === areaId)`)
lines.push(`}`)
lines.push('')
lines.push(`export function getProductsByCategory(category: string) {`)
lines.push(`  return products.filter((p) => p.category === category)`)
lines.push(`}`)
lines.push('')
lines.push(`export function getFeaturedProducts() {`)
lines.push(`  return products.filter((p) => p.image).slice(0, 6)`)
lines.push(`}`)
lines.push('')

fs.writeFileSync(outPath, lines.join('\n'))
console.log(`Generated ${master.products.length} products -> ${outPath}`)
