#!/usr/bin/env node
/**
 * Restore product images from archive (before background removal).
 * Removes transparent PNG duplicates when the original was JPEG.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const imagesDir = path.join(root, 'public/images')
const archiveDir = path.join(imagesDir, 'archive/originals-with-bg')

const restored = []
const removedTransparentDupes = []

for (const name of fs.readdirSync(archiveDir)) {
  const src = path.join(archiveDir, name)
  if (!fs.statSync(src).isFile()) continue

  const dest = path.join(imagesDir, name)
  fs.copyFileSync(src, dest)
  restored.push(name)

  const ext = path.extname(name).toLowerCase()
  const slug = path.basename(name, path.extname(name))
  if (ext === '.jpeg' || ext === '.jpg') {
    const pngDup = path.join(imagesDir, `${slug}.png`)
    if (fs.existsSync(pngDup)) {
      fs.unlinkSync(pngDup)
      removedTransparentDupes.push(`${slug}.png`)
    }
  }
}

console.log(
  JSON.stringify(
    {
      restored: restored.length,
      removedTransparentDupes: removedTransparentDupes.length,
    },
    null,
    2,
  ),
)
