/**
 * Builds src/data/products.ts from scripts/product-catalog-data.mjs
 * Run: node scripts/build-products.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { catalogRaw } from './product-catalog-data.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const imagesDir = path.join(root, 'public/images')
const outPath = path.join(root, 'src/data/products.ts')

const imageFiles = new Set(
  fs.readdirSync(imagesDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
)

const storage =
  'Store in a cool, dry place. Protect from light. Keep out of reach of children. Dosage as directed by the physician.'

const CATEGORY_LABELS = {
  'alcohol-deaddiction': 'alcohol dependence and addiction care',
  'anti-depressant': 'depression and mood disorders',
  'anti-epileptic': 'epilepsy and seizure disorders',
  'anti-parkinsons': "Parkinson's disease and movement disorders",
  'anti-psychotic': 'schizophrenia and psychotic disorders',
  anxiolytic: 'anxiety and related conditions',
  'mood-stabilizers': 'bipolar disorder and mood stabilization',
  'neuropathic-pain': 'neuropathic pain and nerve-related symptoms',
  'anti-cough': 'cough and upper respiratory symptoms',
  neuroprotective: 'neuroprotection and cognitive support',
  'neuro-otology': 'vertigo, Ménière\'s disease and vestibular disorders',
  general: 'general therapeutic use',
}

/** @type {Record<string, Partial<import('../src/types/index.js').Product>>} */
const enrichments = {
  'sricat-333': {
    description:
      'SRICAT 333 (Acamprosate Calcium 333 mg) is an enteric-coated, delayed-release oral tablet used to maintain alcohol abstinence in individuals with alcohol dependence.',
    indications: [
      'Treatment of alcohol addiction',
      'Maintenance of abstinence after detoxification',
      'Supportive therapy alongside counselling and psychosocial support',
    ],
    administration:
      'Standard adult dose: two 333 mg tablets (666 mg total) three times daily, ideally with meals. Renal adjustment: one 333 mg tablet three times daily for moderate kidney impairment. Swallow tablets whole with water — do not crush, chew, or break, as this ruins the delayed-release coating.',
    howItWorks:
      'Acamprosate is believed to stabilize the chemical balance in the brain by blocking glutaminergic N-methyl-D-aspartate receptors and activating gamma-aminobutyric acid type A receptors.',
    warnings:
      'Kidney disease: strictly contraindicated in severe kidney impairment; dose adjustment required for moderate impairment. Mental health: monitor closely for depression, anxiety, or suicidal thoughts. Pregnancy and breastfeeding: consult a healthcare provider before use.',
    sideEffects: [
      'Diarrhea (very common, especially during the first few weeks)',
      'Nausea, vomiting, or abdominal gas and pain',
      'Decreased libido or sexual dysfunction',
      'Itching or rash',
      'Anxiety, dizziness, or dry mouth',
    ],
  },
  'sricat-666': {
    description:
      'SRICAT 666 (Acamprosate Calcium 666 mg) is an enteric-coated, delayed-release oral tablet used to maintain alcohol abstinence in individuals with alcohol dependence.',
    indications: [
      'Treatment of alcohol addiction',
      'Maintenance of abstinence after detoxification',
      'Supportive therapy alongside counselling and psychosocial support',
    ],
    administration:
      'Standard adult dose: two 333 mg tablets (666 mg total) three times daily, ideally with meals — one SRICAT 666 tablet provides this dose per administration. Renal adjustment: one 333 mg tablet three times daily for moderate kidney impairment. Swallow whole with water; do not crush, chew, or break.',
    howItWorks:
      'Acamprosate is believed to stabilize the chemical balance in the brain by blocking glutaminergic N-methyl-D-aspartate receptors and activating gamma-aminobutyric acid type A receptors.',
    warnings:
      'Kidney disease: strictly contraindicated in severe kidney impairment; dose adjustment required for moderate impairment. Mental health: monitor closely for depression, anxiety, or suicidal thoughts. Pregnancy and breastfeeding: consult a healthcare provider before use.',
    sideEffects: [
      'Diarrhea (very common, especially during the first few weeks)',
      'Nausea, vomiting, or abdominal gas and pain',
      'Decreased libido or sexual dysfunction',
      'Itching or rash',
      'Anxiety, dizziness, or dry mouth',
    ],
  },
  'srifram-250': {
    description:
      'SRIFRAM 250 (Disulfiram 250 mg) is used in the treatment of alcohol addiction. It produces an unpleasant reaction when combined with alcohol — including nausea, flushing, and headache — to discourage drinking while on this medication.',
    indications: [
      'Treatment of alcohol addiction',
      'Abstinence maintenance with counselling and social support',
      'Aversive therapy in motivated, alcohol-dependent patients',
    ],
    administration:
      'Initial phase: supervised loading under a healthcare provider. Maintenance: as directed by the physician. Wait at least 12 hours after the last drink before the first dose. Avoid alcohol in all forms — including beer, wine, mouthwash, vinegar, and liquid medications — for up to two weeks after stopping treatment.',
    howItWorks:
      'Disulfiram blocks the enzyme that breaks down converted alcohol in the body, causing acetaldehyde to accumulate and producing unpleasant physical effects if alcohol is consumed.',
    warnings:
      'Never administer during alcohol intoxication or without the patient\'s full knowledge — instruct relatives accordingly. Alcohol is unsafe while on this medicine. Use caution in kidney and liver disease; dose adjustment may be needed. Not established in pregnancy — consult your doctor. Avoid driving if drowsy or dizzy.',
    sideEffects: [
      'Drowsiness or fatigue',
      'Headache',
      'Metallic or garlic-like taste in the mouth',
      'Decreased libido',
      'Dizziness and sleepiness (initially)',
    ],
  },
  'srifram-500': {
    description:
      'SRIFRAM 500 (Disulfiram 500 mg) is used in the treatment of alcohol addiction. It produces an unpleasant reaction when combined with alcohol — including nausea, flushing, and headache — to discourage drinking while on this medication.',
    indications: [
      'Treatment of alcohol addiction',
      'Abstinence maintenance with counselling and social support',
      'Aversive therapy in motivated, alcohol-dependent patients',
    ],
    administration:
      'Initial phase: supervised loading under a healthcare provider. Maintenance: as directed by the physician. Wait at least 12 hours after the last drink before the first dose. Avoid alcohol in all forms — including beer, wine, mouthwash, vinegar, and liquid medications — for up to two weeks after stopping treatment.',
    howItWorks:
      'Disulfiram blocks the enzyme that breaks down converted alcohol in the body, causing acetaldehyde to accumulate and producing unpleasant physical effects if alcohol is consumed.',
    warnings:
      'Never administer during alcohol intoxication or without the patient\'s full knowledge — instruct relatives accordingly. Alcohol is unsafe while on this medicine. Use caution in kidney and liver disease; dose adjustment may be needed. Not established in pregnancy — consult your doctor. Avoid driving if drowsy or dizzy.',
    sideEffects: [
      'Drowsiness or fatigue',
      'Headache',
      'Metallic or garlic-like taste in the mouth',
      'Decreased libido',
      'Dizziness and sleepiness (initially)',
    ],
  },
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function therapeuticArea(category) {
  return category === 'general' || category === 'anti-cough' ? 'general' : 'neurology'
}

function resolveImage(slug, imageExt) {
  const exts = [
    'png',
    ...(imageExt ? [imageExt] : []),
    'jpeg',
    'jpg',
    'webp',
  ].filter((ext, index, list) => list.indexOf(ext) === index)

  for (const ext of exts) {
    const filename = `${slug}.${ext}`
    if (imageFiles.has(filename)) {
      return { slug, ext: ext.toLowerCase() }
    }
  }
  return undefined
}

function defaultDescription(name, genericName, category) {
  const area = CATEGORY_LABELS[category] ?? category
  return `${name} — quality-assured ${genericName} from SRK PHARMA, indicated for ${area}.`
}

function defaultIndications(category) {
  const area = CATEGORY_LABELS[category] ?? 'conditions in its therapeutic class'
  return [`As directed by registered medical practitioner for ${area}`, 'Supportive care as per clinical guidelines']
}

const slugCollisionsFixed = []

const lines = []
lines.push(`import type { Product } from '../types'`)
lines.push('')
lines.push(`function img(slug: string, ext = 'png') {`)
lines.push(`  return \`/images/\${slug}.\${ext}\``)
lines.push(`}`)
lines.push('')
lines.push(`const storage =`)
lines.push(`  '${esc(storage)}'`)
lines.push('')
lines.push(`export const products: Product[] = [`)

const seenSlugs = new Map()

for (const raw of catalogRaw) {
  let slug = raw.slug
  if (seenSlugs.has(slug)) {
    slugCollisionsFixed.push(`${slug} -> ${slug} (duplicate serial ${seenSlugs.get(slug)} & current)`)
  }
  seenSlugs.set(slug, raw.name)

  const enrich = enrichments[slug] ?? {}
  const resolved = resolveImage(slug, raw.imageExt)
  const category = raw.category
  const description = enrich.description ?? defaultDescription(raw.name, raw.genericName, category)
  const indications = enrich.indications ?? defaultIndications(category)

  lines.push(`  {`)
  lines.push(`    id: '${slug}',`)
  lines.push(`    name: '${esc(raw.name)}',`)
  lines.push(`    slug: '${slug}',`)
  lines.push(`    genericName: '${esc(raw.genericName)}',`)
  lines.push(`    composition: '${esc(raw.composition)}',`)
  lines.push(`    dosage: '${esc(raw.dosage)}',`)
  lines.push(`    packSize: '${esc(raw.packSize)}',`)
  lines.push(`    category: '${category}',`)
  lines.push(`    therapeuticArea: '${therapeuticArea(category)}',`)
  lines.push(`    prescriptionType: '${raw.prescriptionType}',`)
  if (resolved) {
    lines.push(`    image: img('${resolved.slug}', '${resolved.ext}'),`)
  }
  lines.push(`    description: '${esc(description)}',`)
  lines.push(`    indications: [${indications.map((i) => `'${esc(i)}'`).join(', ')}],`)
  lines.push(`    storage,`)
  if (enrich.warnings) lines.push(`    warnings: '${esc(enrich.warnings)}',`)
  if (enrich.administration) lines.push(`    administration: '${esc(enrich.administration)}',`)
  if (enrich.howItWorks) lines.push(`    howItWorks: '${esc(enrich.howItWorks)}',`)
  if (enrich.sideEffects?.length) {
    lines.push(
      `    sideEffects: [${enrich.sideEffects.map((s) => `'${esc(s)}'`).join(', ')}],`
    )
  }
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

console.log(`Generated ${catalogRaw.length} products -> ${outPath}`)
if (slugCollisionsFixed.length) {
  console.log('Slug collision notes:', slugCollisionsFixed)
} else {
  console.log('No slug collisions — all slugs unique')
}
