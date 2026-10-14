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

const slugToCanonical = new Map()
for (const item of mapping.canonicalSet) {
  slugToCanonical.set(item.suggestedSlug, item.canonicalSource)
}

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
  if (!fs.existsSync(srcPath)) continue
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(srcPath, destPath)
  }
  fs.renameSync(srcPath, path.join(archiveDir, `source-${filename(source)}`))
}

for (const entry of mapping.mappings) {
  const filename = entry.originalFilename
  const srcPath = path.join(imagesDir, filename)
  if (!fs.existsSync(srcPath)) continue

  const isCanonicalWhatsApp = [...slugToCanonical.values()].includes(filename)
  if (isCanonicalWhatsApp) continue

  fs.renameSync(srcPath, path.join(archiveDir, filename))
}

function filename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

console.log('Cleanup complete')
