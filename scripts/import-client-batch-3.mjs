#!/usr/bin/env node
/**
 * Client batch 3 — pending packaging images (Oct 2026).
 * Copies files as-is to public/images/ — no background removal.
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

const UUID_SUFFIX =
  /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpe?g|webp)$/i

/** filename prefix (no UUID) → slug */
const PREFIX_TO_SLUG = {
  SAMOGIN: 'samogin-10-inj',
  SREDOL_ING: 'sredol-inj',
  OZAPHINE_SACHET: 'ozaphine-5',
  SRIVON: 'srivon',
  SRILOFENE__20: 'srilofene-20',
  SRILEPA_125: 'sriepa-25',
  SRILEPA_250: 'sriepa-c-200',
  SRITADOLE_100: 'sritadole-100',
  SRITADOLE_50: 'sritadole-50',
  SREZIL_10: 'srezil-10',
  SREZIL_5: 'srezil-5',
  SREZIL_SYRUPS: 'srezil-syrup',
  'CHLOZAPAM__0.50': 'chlozapam-050-disp',
  COFSRI_P: 'cofsri-p',
  SHRIMLOZ_10: 'shrimloz-10',
  SHRIMLOZ_5: 'shrimloz-5',
  SRIPTY_P: 'sripty-p',
  SRIPTY_SR: 'sripty-sr',
  SRITHIO_25: 'srithio-25',
  SRITHIO_10: 'srithio-10',
  SRITHIO_ING: 'srithio-o',
  SRIPRID_SR_100: 'sriprid-100-sr',
  SRIVITA_M: 'srivita-m',
  SRINZA_SACHET: 'srinza-5-tab',
}

const CLIENT_BATCH = `
SAMOGIN-95280d9b-098a-47e1-84f0-2d253c26b2d9.png
SREDOL_ing-4ffa1529-7528-48f7-b640-10931bd80ab8.png
OZAPHINE_Sachet-e9569fb6-29da-406a-8ac9-32bfd9fc1b59.png
SRIVON-ba872988-cca6-42e4-842c-c54335ec2d7d.png
SRILOFENE__20-eb375112-1d9e-4a63-b206-b5bf463e1c38.png
SRILEPA_125-6e0b7f73-8a76-45f6-ac37-4a273655dbed.png
SRITADOLE_100-655f0341-dc2f-46ae-a922-f7ef47225639.png
SREZIL_10-b2cf034d-5f69-4bdd-bb2b-cce4353a6af2.png
CHLOZAPAM__0.50-1b272f99-2f93-4848-848c-6f5fbc980c5a.png
COFSRI_P-f5ab4dcb-5782-4809-adb2-c183c4d6c158.png
SHRIMLOZ_10-def11e09-7961-4a0c-b253-75129cda01ad.png
SRIPTY_P-81bbf36f-3879-496e-abd0-0193f433f356.png
SREZIL_Syrups-a37652a6-9eb7-44fc-b296-b42a390448d7.png
SRITHIO_25-d954806c-a722-469f-a2c2-6506c28ed92b.png
SRINZA_Sachet-382c0af5-b8d8-4476-9888-cc9f86c4c0a3.png
SREDOL_ing__1_-ce742827-d497-4da4-8c18-9a333b4d6b4a.png
SRITHIO_10-088c1418-0701-4abf-8027-aeefe99b1716.png
SHRIMLOZ_5-cdc0375c-7e0e-4847-bc21-b5ef3c5f72db.png
SREZIL_5-fd55fb1e-b277-4f5b-8094-f26851d7c8be.png
SRITADOLE_50-40241144-ab73-4bdc-bdeb-c3e7899bb6d9.png
SRIPRID_SR_100-3d1624ad-fcfb-4790-b4af-cdb2b27bf00d.png
SRITHIO_ing-5a300dd9-2fc0-4ce4-be56-60470be30faf.png
SRIVITA_M-9ee4eb9b-8bd8-4a33-8750-8a9ca87438dd.png
SRIPTY_SR-0f28cf47-41b3-44bf-95bd-cb9d7193cdcf.png
SRILEPA_250-9fab7cbc-ed03-4999-a23f-5f6a7f7873b8.png
`
  .trim()
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean)

function normalizePrefix(prefix) {
  return prefix.replace(/\s+/g, '').toUpperCase()
}

function filePrefix(filename) {
  return filename.replace(UUID_SUFFIX, '').replace(/\.(png|jpe?g|webp)$/i, '')
}

function loadSlugs() {
  const text = fs.readFileSync(productsPath, 'utf8')
  return new Set([...text.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]))
}

function sortPriority(filename) {
  const p = normalizePrefix(filePrefix(filename))
  if (p.includes('__1_') || p.endsWith('_A')) return 10
  return 0
}

const files = [...CLIENT_BATCH].sort((a, b) => sortPriority(a) - sortPriority(b))
const slugs = loadSlugs()
fs.mkdirSync(imagesDir, { recursive: true })
fs.mkdirSync(archiveDir, { recursive: true })

const report = {
  totalAttached: files.length,
  replaced: [],
  added: [],
  unmatched: [],
  missingFile: [],
  duplicatesSkipped: [],
  notes: [
    'SRINZA_Sachet artwork mapped to slug srinza-5-tab (catalog: Olanzapine ODT 5 mg).',
    'SREDOL_ing duplicate (__1_) skipped when primary SREDOL_ing is present.',
  ],
}

const slugUsed = new Map()
const updatedSlugs = []

for (const filename of files) {
  const srcPath = path.join(assetsDir, filename)
  if (!fs.existsSync(srcPath)) {
    report.missingFile.push(filename)
    continue
  }

  const prefix = normalizePrefix(filePrefix(filename))
  const slug = PREFIX_TO_SLUG[prefix]
  if (!slug) {
    report.unmatched.push({ filename, prefix })
    continue
  }

  if (!slugs.has(slug)) {
    report.unmatched.push({ filename, prefix, slug, reason: 'slug not in catalog' })
    continue
  }

  if (slugUsed.has(slug)) {
    report.duplicatesSkipped.push({ filename, slug, kept: slugUsed.get(slug) })
    continue
  }
  slugUsed.set(slug, filename)

  const destPath = path.join(imagesDir, `${slug}.png`)
  const hadImage = fs.existsSync(destPath)

  fs.copyFileSync(srcPath, destPath)
  fs.copyFileSync(srcPath, path.join(archiveDir, `${slug}.png`))
  updatedSlugs.push(slug)

  if (hadImage) report.replaced.push({ slug, filename })
  else report.added.push({ slug, filename })
}

const outPath = path.join(root, 'scripts/client-batch-3-import-report.json')
fs.writeFileSync(outPath, JSON.stringify({ ...report, updatedSlugs }, null, 2))

console.log(
  JSON.stringify(
    {
      totalAttached: report.totalAttached,
      uniqueProductsUpdated: slugUsed.size,
      replaced: report.replaced.length,
      newlyAddedImages: report.added.length,
      duplicatesSkipped: report.duplicatesSkipped.length,
      unmatched: report.unmatched.length,
      missingFiles: report.missingFile.length,
      updatedSlugs,
    },
    null,
    2,
  ),
)

if (report.unmatched.length) {
  console.log('\nUnmatched:')
  report.unmatched.forEach((u) => console.log(`  ${u.filename} (${u.prefix})`))
}
