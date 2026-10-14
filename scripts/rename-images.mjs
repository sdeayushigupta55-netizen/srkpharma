#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.join(__dirname, '../public/images')
const archiveDir = path.join(imagesDir, 'archive')

const mapping = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'product-image-mapping.json'), 'utf8')
)

fs.mkdirSync(archiveDir, { recursive: true })

const slugToCanonical = new Map()
for (const item of mapping.canonicalSet) {
  slugToCanonical.set(item.suggestedSlug, item.canonicalSource)
}

const canonicalSources = new Set([...slugToCanonical.values()])

for (const [slug, source] of slugToCanonical) {
  const ext = path.extname(source) || '.jpeg'
  const destName = `${slug}${ext}`
  const destPath = path.join(imagesDir, destName)

  if (source === 'chlozapam.png' || source === 'unzolam-p.png') {
    const srcPath = path.join(imagesDir, source)
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath)
    }
    continue
  }

  const srcPath = path.join(imagesDir, source)
  if (!fs.existsSync(srcPath)) {
    console.warn(`Missing source: ${source}`)
    continue
  }
  fs.copyFileSync(srcPath, destPath)
  console.log(`Renamed: ${source} -> ${destName}`)
}

for (const entry of mapping.mappings) {
  const filename = entry.originalFilename
  const srcPath = path.join(imagesDir, filename)
  if (!fs.existsSync(srcPath)) continue

  const isCanonicalWhatsApp = [...slugToCanonical.entries()].some(
    ([, source]) => source === filename
  )

  if (isCanonicalWhatsApp) continue

  const archivePath = path.join(archiveDir, filename)
  fs.renameSync(srcPath, archivePath)
  console.log(`Archived duplicate: ${filename}`)
}

console.log('\nDone! Canonical images in public/images/, duplicates in public/images/archive/')
