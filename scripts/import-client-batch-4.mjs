#!/usr/bin/env node
/**
 * Client batch 4 — final pending images (SHRITIN + SIRTAM). Copy as-is, no BG removal.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const assetsDir =
  process.env.ASSETS_DIR ||
  path.join(process.env.HOME, '.cursor/projects/Users-ayushigupta-projects-srkphrama/assets')
const imagesDir = path.join(root, 'public/images')
const archiveDir = path.join(imagesDir, 'archive/originals-with-bg')
const productsPath = path.join(root, 'src/data/products.ts')

const FILES = [
  { file: 'SHRITIN_DT-3a5cd417-1764-4441-839e-da469317fb5c.png', slug: 'shritin-dt' },
  { file: 'SIRTAM__800-69b5e86e-6767-49b2-a48a-3a2026ce4059.png', slug: 'sirtam-800' },
  { file: 'SIRTAM__400-55c0ac83-af62-477e-8139-2943f39c9809.png', slug: 'sirtam-400' },
  { file: 'SHRITIN-6605b91d-bcb8-4d05-9a47-62b15b8d6c23.png', slug: 'shritin' },
  { file: 'SHRITIN_OD-60a6d197-54e0-4f77-994b-2964833812ad.png', slug: 'shritin-od' },
]

function loadSlugs() {
  const text = fs.readFileSync(productsPath, 'utf8')
  return new Set([...text.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]))
}

fs.mkdirSync(imagesDir, { recursive: true })
fs.mkdirSync(archiveDir, { recursive: true })
const slugs = loadSlugs()
const report = { added: [], replaced: [], missingFile: [], invalidSlug: [] }

for (const { file, slug } of FILES) {
  const src = path.join(assetsDir, file)
  if (!fs.existsSync(src)) {
    report.missingFile.push(file)
    continue
  }
  if (!slugs.has(slug)) {
    report.invalidSlug.push({ file, slug })
    continue
  }
  const dest = path.join(imagesDir, `${slug}.png`)
  const had = fs.existsSync(dest)
  fs.copyFileSync(src, dest)
  fs.copyFileSync(src, path.join(archiveDir, `${slug}.png`))
  for (const ext of ['jpeg', 'jpg', 'webp']) {
    const dup = path.join(imagesDir, `${slug}.${ext}`)
    if (fs.existsSync(dup)) fs.unlinkSync(dup)
  }
  if (had) report.replaced.push(slug)
  else report.added.push(slug)
}

const out = path.join(root, 'scripts/client-batch-4-import-report.json')
fs.writeFileSync(out, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
