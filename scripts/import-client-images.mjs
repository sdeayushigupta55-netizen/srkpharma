#!/usr/bin/env node
/**
 * Import client product images from Cursor assets folder.
 * Maps filename prefix → product slug, copies as-is to public/images/ (no BG removal).
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
const productsPath = path.join(root, 'src/data/products.ts')

const UUID_SUFFIX =
  /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpe?g|webp)$/i

/** Prefixes to skip entirely (wrong packaging / user excluded) */
const EXCLUDED_PREFIXES = new Set(['SUDEX_100'])

/** Exact filename prefix (no UUID) → catalog slug */
const PREFIX_TO_SLUG = {
  CITLOPRAM_10: 'citlopram-10',
  CITLOPRAM__5: 'citlopram-5',
  CITLOPRAM_PLUS: 'citlopram-plus',
  CITLOPRAM_PLUS_5: 'citlopram-plus-5',
  CITLOPRAM_PLUS_20: 'citlopram-plus-20',
  SLUVOX__100: 'sluvox-100',
  SLUVOX_50_N: 'sluvox-50',
  'PRIDEC_0.25': 'pridec-025',
  'PRIDEC_0.50': 'pridec-050',
  KROGER_10: 'kroger-10',
  KROGER_SR: 'kroger-sr',
  'MARLBORO__0.50': 'marlboo-050',
  'MARLBORO_0.25_N': 'marlboo-025',
  MARLBORO_SR: 'marlboo-sr',
  SRIMINE__1500: 'srimine-1500',
  SRIMINE__500: 'srimine-500',
  SLABOZ_10: 'slaboz-10',
  SLABOZ_5: 'slaboz-5',
  SAMOGIN: 'samogin-50-tab',
  SAMOGIN_50: 'samogin-50-tab',
  SAMOGIN_50_D: 'samogin-50-disp',
  SAMOGIN_100: 'samogin-100-disp',
  SPDEM_10: 'spdem-10',
  SPDEM_10_M: 'spdem-10',
  SPDEM_5: 'spdem-5',
  SPDEM_5__1_: 'spdem-5',
  SHIRBEC_SYRUPS: 'shirbec-100-syrup',
  SHIRBEC_250: 'shirbec-250',
  SHIRBEC_500: 'shirbec-500',
  SHIRBEC_500_D: 'shirbec-500-blister',
  SHIRBEC_750: 'shirbec-750',
  SHIRBEC_1000: 'shirbec-1000',
  SRIGA__NTM: 'gebelin-ntm',
  SRIGA__150: 'sriga-150',
  SRIGA_75: 'sriga-75',
  SRIGA_E: 'sriga-e',
  SRIGA_FORTE: 'gebelin-forte',
  SRILEPA_125: 'sriepa-cl',
  SRILEPA_250: 'sriepa-c-250',
  SRILEPA_110: 'sriepa-100',
  SRIPIRAL_300: 'sripiral-300',
  SRIPIRAL_600: 'sripiral-600',
  SALMIDE_200: 'salmide-200',
  SALMIDE_400: 'salmide-400',
  SEPRIDE_50: 'sepride-50',
  SEPRIDE_100: 'sepride-100',
  SLIDONE_3: 'slidone-3',
  SLIDONE_6: 'slidone-6',
  SRIBAZIM_100: 'sribazim-100',
  SRIBAZIM_200: 'sribazim-200',
  SRIBAZIM_400: 'sribazim-400',
  SRIBAZIM_FORT: 'sribazim-fort',
  SRIMITOR_200: 'srimitor-200',
  'SRIMITOR_133.5': 'srimitor-1335',
  SRIPAR_2: 'sripar-2',
  SRIPAR_3: 'sripar-3',
  SRIPAR_4: 'sripar-4',
  SRIZODONE__50: 'srizodone-50',
  SRIZODONE__100: 'srizodone-100',
  SRIZODONE_SR_100: 'srizodone-d',
  'SRIPRIM_0.25': 'sripram-025',
  SRIPRIM_1: 'sripram-1',
  SRIPRAM_10: 'sripram-10',
  SUDEX_50: 'sudex-50',
  SUDEX_50__1_: 'sudex-50',
  SULOXETIN_20: 'suloxetin-20',
  'SULOXETIN_40.': 'suloxetin-40',
  'CHLOZAPAM__0.50': 'chlozapam-050',
  'CHLOZAPAM_0.25': 'chlozapam-025',
  SIDIROX_500: 'sidirox-500',
  SRINZA: 'srinza-5-tab',
  'SRINZA_2.5': 'srinza-25',
  SRINZA_10: 'srinza-10',
  SRINZA_D: 'srinza-5-md',
  SRINZA_SACHET: 'srinza-5-tab',
  SOZAPINE_50: 'sozapine-50',
  SOZAPINE_100: 'sozapine-100',
  SRIVITA_V: 'srivita-v',
  SRIVITA_FORT: 'srivita-fort',
  SRIVITA_MTS: 'srivita-mts',
  SEPROX_250: 'seprox-250',
  SEPROX_250__1_: 'seprox-250',
  SEPROX_500: 'seprox-500',
  SPIMAT_25: 'spimat-25',
  SPIMAT_50: 'spimat-50',
  SEPRIDOL_5: 'sepridol-5',
  SEPRIDOL_10: 'sepridol-10',
  SPZOLE_10: 'spzole-10',
  SPZOLE_15: 'spzole-15',
  SRIFLUZ_PLUS: 'srifluz-b',
  SRITROLA_10: 'sritrola-10',
  SRITROLA_40: 'sritrola-40',
  SRIPRID_50: 'sriprid-50',
  SRIPRID_100: 'sriprid-100',
  SRIPILIN__100: 'sripilin-100',
  SRIPILIN__300: 'sripilin-300',
  'SRITIVAN_0.50': 'sritivan-050',
  'SRITIVAN_0.5': 'sritivan-050',
  SRITIVAN_1: 'sritivan-1',
  SRITIVAN_1__1_: 'sritivan-1',
  SRITIVAN_2: 'sritivan-2',
  SRITIVAN_2__1_: 'sritivan-2',
  SRIZPO_C: 'srizpo-c',
  SRIZPO__10: 'srizpo-10',
  SRIPROZ_FORTE: 'sriproz-lt',
  SRIDET_5: 'sridet-5',
  SRIDET_10: 'sridet-10',
  SNIUM_300: 'snium-300',
  SNIUM_300__1_: 'snium-300',
  SNIUM_400: 'snium-400',
  SRITHIO_25: 'srithio-25',
  'SRIVENA_37.5': 'srivena-375',
  SRIVENA_75: 'srivena-75',
}

function filePrefix(filename) {
  return filename.replace(UUID_SUFFIX, '').replace(/\.(png|jpe?g|webp)$/i, '')
}

function normalizePrefix(prefix) {
  return prefix.replace(/\s+/g, '').toUpperCase()
}

function loadSlugs() {
  const text = fs.readFileSync(productsPath, 'utf8')
  return [...text.matchAll(/slug: '([^']+)'/g)].map((m) => m[1])
}

/** Prefer canonical filenames over duplicate variants (__1_, _M, etc.) */
function sortPriority(filename) {
  const p = normalizePrefix(filePrefix(filename))
  let score = 0
  if (p.includes('__1_')) score += 10
  if (p.endsWith('_M')) score += 5
  if (p.includes('_N')) score += 2
  return score
}

const CLIENT_BATCH = `
Citlopram_10-8cf08a23-060a-4673-9e20-858b76058e49.png
CITLOPRAM_PLUS_20-fb50c811-7470-456c-9d4c-f92196ca8ec9.png
Citlopram__5-24c1be98-fdd4-4b11-8dfe-0302d8adca6a.png
SLUVOX__100-acc8f97d-ef09-4865-b7cb-077e26e07f2b.png
PRIDEC_0.25-01d22a91-d747-41ba-8098-abbcd2e9234c.png
KROGER_10-bd8ee1fb-9804-4a65-974b-4d74050e417e.png
SLUVOX_50_N-ad5e97d7-1338-4d9f-b99f-cc1748af86d9.png
MARLBORO__0.50-0673bd1a-3f76-44bc-ba3d-2d7d7a6906fb.png
SRIMINE__1500-8ccc3b36-50f8-4b2c-9b21-c2563ecb828f.png
PRIDEC_0.50-e8903a71-a505-4b5c-af00-ab124b768073.png
SLABOZ_10-5bc1fdef-bc4f-4351-88d1-5800a380f1dd.png
MARLBORO_SR-d33afaca-e839-48b0-8602-5e62cb98947f.png
MARLBORO_0.25_N-6ac8a8b1-8d9b-428d-9c1f-d941c2e153fe.png
SAMOGIN-4e6745a4-ffdc-4ebc-afec-b409aeb0b19c.png
SPDEM_10-f2670550-b486-43bc-9f04-2895f1415fc3.png
SHIRBEC_SYRUPS-ceccd54b-9697-48bc-bb1d-ec51d8f7c4af.png
SRIGA__NTM-f1f467fd-310d-494a-9ade-0bca7a542e83.png
SRILEPA_125-7586cdb7-f5d6-45e5-8b6a-07ad7925bf53.png
SRIPIRAL_300-e69f3756-9c09-4e7f-a1e4-d2812ec548c7.png
SALMIDE_200-22a242d3-c961-4fc9-910b-be5fe8fdd37f.png
SRIGA__150-b51aa62f-dfc6-47eb-8bae-1016cf18096e.png
SRIGA_75-3cd6b851-ced9-4add-a803-1801c39ea249.png
SRIGA_E-bf37c8a7-0c88-499e-b4f6-4c83ec8ea9cb.png
SAMOGIN_100-e9709ebb-94dc-4060-867b-9f93d21d1ad8.png
SRILEPA_250-45de651d-83dc-4ee8-88ab-8eae1fdf59d5.png
SEPRIDE_50-2c0b0404-fab1-48bb-a35f-8fb4135a4d5f.png
SALMIDE_400-65eb40be-3a11-4ea7-a7d6-485f653ed8b3.png
SLIDONE_6-2d89b764-2d6a-4650-b04a-431186579b13.png
SRIPIRAL_600-6f2c2929-f200-4726-a76c-538e65ef4104.png
SLABOZ_5-3a4e9b2f-a93d-45bd-87e9-dba4f95beb6f.png
SRIMINE__500-0cd1e495-1cf1-4d66-8121-884f75a355e4.png
SPDEM_10_M-116d1e2f-583a-4d96-aa0f-15237e34cccd.png
SRIBAZIM_100-1d90134e-05e3-4fc7-a780-8a5439a05d3a.png
CITLOPRAM_PLUS_5-c6608ba7-a30e-4672-8db3-9946eb15cd73.png
SHIRBEC_500_d-891837e4-6965-4f83-bd2a-19d93a68d953.png
SRIMITOR_200-9dae6b2e-9e2b-47f8-b325-37ba338bf082.png
SAMOGIN_50_D-ad816232-4ac7-40b8-897a-c2c36135424f.png
SRIPAR_2-61152675-c3f2-4182-a8fe-7f5b75c24f31.png
SAMOGIN_50-98cca355-5903-4316-8c85-23d5eb34f2e8.png
SRIZODONE__50-69ae539c-a620-433e-985d-2bb5d1149f35.png
CITLOPRAM_PLUS-28c94232-93be-4470-ae1d-9459593fc5a9.png
SRIPRIM_1-ce919b13-1f2c-4caa-a7dc-a40ab7a83ffd.png
SRIMITOR_133.5-c2a1964b-90bc-4f1a-b3fa-f66e673f7eb1.png
SRIPRAM_10-11adb3d7-a519-40e4-8de2-5ddbfdd5e2c6.png
SHIRBEC_1000-cbc172b7-b548-4b2e-a7af-31dd97205409.png
SHIRBEC_250-c60ba57d-a8e4-448c-b70a-8b99c7cb3daf.png
SRIBAZIM_FORT-44d93827-609b-470c-b67d-80b8c3853e4c.png
SUDEX_50__1_-c69c76fb-887d-4b19-9ce0-9d350785974e.png
SRIGA_FORTE-4dbd7a95-b015-4e36-83a2-27402c8c98df.png
SULOXETIN_40.-f4a2ce55-2944-481b-9c7d-049acfcea070.png
SRIPAR_4-de196454-8f6b-4c6a-9427-cc43557a5c5a.png
KROGER_SR-d4f21b04-f1b7-46e7-bf9a-9db239ad2622.png
SEPRIDE_100-86214e54-d831-4ecf-b79d-980e79401927.png
CHLOZAPAM__0.50-446d147d-5be3-432e-ac22-5a405025006b.png
SIDIROX_500-8945a1df-7965-4201-bcea-91d181318570.png
SRINZA_2.5-5eda479f-2d43-4295-a3d8-64d98b937221.png
SRIPRIM_0.25-f427b7f2-7894-4370-b362-b60d21b720c0.png
SOZAPINE_100-580199ac-2bca-4b20-b3cd-79cedd3c84b4.png
SPDEM_5-9feb3b6a-eb4a-4acd-b614-6d4cb499b963.png
SOZAPINE_50-746b8fc3-f572-4b25-aad4-189475c16947.png
SUDEX_50-2407ce28-889c-4917-8aee-07e284fb8f83.png
SRIVITA_V-becbf6d1-43ca-4872-af7e-d78d1d19cf94.png
SRIBAZIM_400-d2ef65dd-5200-45d9-af4d-ba382684d62c.png
SULOXETIN_20-c71c756b-c071-4d57-a860-06403203f7dc.png
SPDEM_5__1_-83e78c69-3446-4009-b2bc-fafdcf551e23.png
SEPROX_250__1_-90d1cd65-a3a9-4aaf-b1c0-c109a45d0058.png
SPIMAT_50-8b5543b4-9e18-4670-9240-1d51bef36859.png
SEPRIDOL_10-c96894e0-821d-4b8c-a9c4-f30596fc05ef.png
SEPRIDOL_5-4daa94b4-e167-4df4-b90f-06c6f4465468.png
SRIBAZIM_200-42199b17-7517-4cb5-8cd3-523e1035ed3f.png
SPZOLE_10-14d62065-22bb-4b87-9042-284e52231e9d.png
CHLOZAPAM_0.25-f38d2669-f215-45b5-9873-f0064633ea8a.png
SRIFLUZ_PLUS-ab783adb-4cf0-4615-a0ab-bb639079ad69.png
SRITROLA_40-b30cd8b8-1262-45f9-b08f-d75f6d11f405.png
SRINZA-4df9c7f6-1ac3-4145-be27-184b59209964.png
SRIPRID_100-16d5b1a1-312e-477e-895c-633615920fe8.png
SRIPILIN__100-c7afef99-d3be-4885-aedd-bb7a8b9d605a.png
SRIPILIN__300-0dba0af9-7c11-4ed2-9e6c-b4aeb73a01e0.png
SRITIVAN_0.50-d8685aef-0035-4ba4-acc2-2bd23e7eae23.png
SPZOLE_15-ed528a50-d9ca-4c28-9f15-8a634b3a334f.png
SRIZPO_C-e045961a-47c3-4f63-8cb9-163d91b48264.png
SEPROX_250-b973b0e8-152d-442c-9ae2-c12575c825c3.png
SRIPRID_50-c2b70a44-4d9f-4bad-aada-e44309547482.png
SRILEPA_110-d20cdcdb-1aa3-4464-a003-005009e57da4.png
SLIDONE_3-7886c615-a008-4b27-811c-be1ab65e0851.png
SRIPROZ_FORTE-eadf0b73-37fb-447c-9d4e-dabe65026255.png
SRIZODONE__100-c866da4d-b2aa-4afe-a21a-8496d4a48100.png
SRINZA_10-9fb8b44e-09fe-4f45-8125-c17fd5adaa47.png
SRITIVAN_0.5-c22e9d61-d0f8-492d-a2a6-f25213cccccb.png
SUDEX_100-4dddada8-55ae-4b54-96dc-02c725fdd082.png
SRINZA_D-4e7cb22b-72bf-4809-9b61-745b59a5f731.png
SEPROX_500-f453c613-9a93-42bf-baa1-f7eb9386249d.png
SRIZODONE_SR_100-ba0ec2b5-0264-469c-a6cc-7d3a22a2c14c.png
SRIDET_5-0594cc7f-b296-4ba0-b6c4-219a1c385a21.png
SHIRBEC_750-53b81ddb-8b8c-46c9-8bb7-1c1eaea7f218.png
SHIRBEC_500-1dea9f7c-8e0a-4fd5-9434-3db3dc881248.png
SRIDET_10-8a7c72a6-840e-4311-bc33-453ff67ad8b5.png
SNIUM_400-49388ab8-5bce-49ac-82f4-b42cbd78683e.png
SRIZPO__10-8472ab38-8511-4748-93d7-adee83d30545.png
SRITROLA_10-25bfff44-c1df-4bbb-ac2a-c47e1803cbc6.png
SRIPAR_3-d3847702-e6c4-412f-8f54-cfb353213b21.png
SNIUM_300-3a34255a-747c-4451-814a-9ca025b42ed8.png
SRITHIO_25-44e49767-1c5d-49cc-90e7-38de66e735eb.png
SRITIVAN_1-485f1c0d-991f-41eb-8ab2-e57ae09aa135.png
SRITIVAN_2-c8dc0f01-8b58-4a4c-a344-dddffdd8db94.png
SRIVITA_FORT-14e4b52f-a4f0-4d63-95dc-6d069d737ac1.png
SRITIVAN_1__1_-def3a6d8-3ed8-4125-a39d-1f9ec67e507d.png
SRIVENA_37.5-85a1c029-e8e1-48e8-9678-c118e869c668.png
SNIUM_300__1_-86889a53-37ac-4e8f-b602-f83ca6006c25.png
SRIVITA_MTS-f50e8b3e-5a63-46a5-84b1-1d797e518189.png
SRIVENA_75-f9d0faa6-d96f-4c93-8aaa-15029c40143c.png
SRITIVAN_2__1_-ccc451b1-07cc-46c3-a25d-411d99f6a497.png
SRINZA_Sachet-46912275-febf-4dcb-aa6e-4bb4432f67db.png
SPIMAT_25-3f1647d2-2ce1-47b7-92b2-eaf1cf44d466.png
`
  .trim()
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean)
  .sort((a, b) => sortPriority(a) - sortPriority(b))

const slugs = new Set(loadSlugs())
fs.mkdirSync(imagesDir, { recursive: true })

const report = {
  totalAttached: CLIENT_BATCH.length,
  excluded: [],
  replaced: [],
  addedForExistingProduct: [],
  unmatched: [],
  missingFile: [],
  duplicatesSkipped: [],
}

const slugUsed = new Map()

for (const filename of CLIENT_BATCH) {
  const srcPath = path.join(assetsDir, filename)
  if (!fs.existsSync(srcPath)) {
    report.missingFile.push(filename)
    continue
  }

  const prefix = normalizePrefix(filePrefix(filename))

  if (EXCLUDED_PREFIXES.has(prefix)) {
    report.excluded.push({ filename, prefix, reason: 'user excluded (wrong packaging)' })
    continue
  }

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

  if (hadImage) {
    report.replaced.push({ slug, filename })
  } else {
    report.addedForExistingProduct.push({ slug, filename })
  }
}

const outPath = path.join(root, 'scripts/client-image-import-report.json')
fs.writeFileSync(outPath, JSON.stringify(report, null, 2))

console.log(
  JSON.stringify(
    {
      totalAttached: report.totalAttached,
      excluded: report.excluded.length,
      replacedExistingImages: report.replaced.length,
      newImagesAdded: report.addedForExistingProduct.length,
      uniqueProductsUpdated: slugUsed.size,
      duplicateSkips: report.duplicatesSkipped.length,
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

if (report.excluded.length) {
  console.log('\nExcluded:')
  report.excluded.forEach((e) => console.log(`  ${e.filename}`))
}
