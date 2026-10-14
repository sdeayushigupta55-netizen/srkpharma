#!/usr/bin/env node
/**
 * Client batch 2 — Oct 2026 product images (27 files).
 * Copies files as-is — no background removal.
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
  CITLOPRAM_10: 'citlopram-10',
  CITLOPRAM__5: 'citlopram-5',
  CITLOPRAM__5_A: 'citlopram-5',
  CITLOPRAM_S_PLUS: 'citlopram-s-plus',
  '3D_UNZOLAM_P': 'unzolam-p',
  '3D_UNZOLAM_P__1_': 'unzolam-p',
  'CHLOZAPAM___0.10': 'chlozapam-010',
  'CHLOZAPAM___0.5': 'chlozapam-050',
  NITZPAM_5: 'nitzpam-5',
  NITZPAM_10: 'nitzpam-10',
  SILEPRAM_25_: 'silepram-25',
  'AEGON____0.2': 'aegon-02',
  'AEGON__0.4': 'aegon-04',
  AEGON__SR_F: 'aegon-sr',
  AEGON__S_01: 'aegon-s',
  SLUVOX__100: 'sluvox-100',
  SIRTAM_SYRUPS: 'sirtam-syrup',
  SRICAT__333: 'sricat-333',
  SRICAT__666: 'sricat-666',
  SHRICET_SYRUPS: 'shricet-syrup',
  SHRICET: 'shricet-inj',
  'SHRICET__500': 'shricet-500',
  'SHRICET__P': 'shricet-p',
  SREDOL_DS: 'sredol-ds',
  'SREDOL__P': 'sredol-p',
  'SREDOL__50': 'sredol-50',
  SIRTAM: 'srenet',
  SPDEM_5: 'spdem-5',
}

const CLIENT_BATCH = `
Citlopram__5-b8c181a3-c066-47b0-8d81-e8fbb8f833da.png
3D_UNZOLAM_P-66442231-5467-4932-9492-29fc4733bf7f.png
Chlozapam___0.10-b8f2e00a-4a0f-4bbc-b25e-2bb0435c576b.png
Chlozapam___0.5-98c9a4c0-14dc-47d3-9f0f-11ade4a21c68.png
NITZPAM_5-95040f6a-c657-44c3-9947-491b6afaa887.png
NITZPAM_10-e7d7c442-1fb2-4a3f-8b4c-40e0cf9b624a.png
Silepram_25_-99659aca-425f-4534-8d7c-a46f1d2529cd.png
Aegon____0.2-f7a34a2e-84ec-40d6-abda-46fa67400486.png
Aegon__0.4-4970b4e3-a636-4075-9f40-eaedd009f1a2.png
SLUVOX__100-02273245-7d5a-4083-8bfd-f5a8a96c2385.png
SIRTAM_SYRUPS-05b2897a-038f-469a-8f3a-a69a8be5e184.png
CITLOPRAM_S_PLUS-4285042b-8a98-46ec-a592-1946e7ddb3db.png
Sricat__666-41055170-416b-47a3-b4d4-28b1167f57bd.png
Aegon__SR_f-9b7d3fba-0330-4c7f-8ef1-a0e858256fec.png
Sricat__333-dedd5556-2dd0-4e0b-aa94-680c6d36fb18.png
SHRICET_SYRUPS-529dbd25-cb8d-41e6-af1b-d2416970eeaf.png
SREDOL_DS-fd74c9ed-0de7-4a87-bf94-3898d646952a.png
Citlopram_10-b0ad099f-9a7e-46c3-93a6-c41bcba8f8ae.png
SPDEM_5-17488654-991b-4543-b2c4-bb39923b17a3.png
Aegon__S_01-040d6086-dfef-466b-b185-b03a20293f57.png
SHRICET-f76aa24c-9dfa-4965-af27-c9ddffa22e7d.png
SREDOL__P-b6d7bd77-99cc-45c2-8d34-4e34c39e55c1.png
SIRTAM-f28b8ed2-ceb1-44dd-a6ad-de521a89455d.png
SHRICET__500-b61ce9d7-7505-4a87-a0cd-23933d5b7e05.png
SREDOL__50-15049497-6b22-456b-a99c-547370ffa2cc.png
SHRICET__P-89976e26-0278-495e-b760-df35f9746ff0.png
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
    'SIRTAM injection image mapped to catalog slug srenet (Piracetam Injection 200 mg/ml).',
  ],
}

const slugUsed = new Map()

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

  if (hadImage) report.replaced.push({ slug, filename })
  else report.added.push({ slug, filename })
}

const outPath = path.join(root, 'scripts/client-batch-2-import-report.json')
fs.writeFileSync(outPath, JSON.stringify(report, null, 2))

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
    },
    null,
    2,
  ),
)

if (report.unmatched.length) {
  console.log('\nUnmatched:')
  report.unmatched.forEach((u) => console.log(`  ${u.filename} (${u.prefix})`))
}
