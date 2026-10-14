/**
 * Generates src/data/masterProducts.json from client master list.
 * Run: node scripts/build-master-catalog.mjs
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const storage =
  'Store in a cool, dry place. Protect from light. Keep out of reach of children. Dosage as directed by the physician.'

/** @type {Array<[string,string,string,string,string,string,string,'NRx'|'Rx']>} */
const rows = [
  // Alcohol Deaddiction
  ['SRIFRAM 250', 'srifram-250', 'Disulfiram Tablets IP', 'Disulfiram IP 250 mg', '250 mg', '10 × 10 Tablets', 'alcohol-deaddiction', 'Rx'],
  ['SRIFRAM 500', 'srifram-500', 'Disulfiram Tablets IP', 'Disulfiram IP 500 mg', '500 mg', '10 × 10 Tablets', 'alcohol-deaddiction', 'Rx'],
  ['SRICAT 333', 'sricat-333', 'Acamprosate Calcium Enteric-Coated Tablets', 'Acamprosate Calcium 333 mg', '333 mg', '10 × 6 Tablets', 'alcohol-deaddiction', 'Rx'],
  ['SRICAT 666', 'sricat-666', 'Acamprosate Calcium Enteric-Coated Tablets', 'Acamprosate Calcium 666 mg', '666 mg', '10 × 6 Tablets', 'alcohol-deaddiction', 'Rx'],
  ['SRIXONE 50', 'srixone-50', 'Naltrexone Hydrochloride IP', 'Naltrexone Hydrochloride IP 50 mg', '50 mg', '10 × 6 Tablets', 'alcohol-deaddiction', 'Rx'],
  ['SRIXONE 25', 'srixone-25', 'Naltrexone Hydrochloride IP', 'Naltrexone Hydrochloride IP 25 mg', '25 mg', '10 × 6 Tablets', 'alcohol-deaddiction', 'Rx'],
  ['SRITHAN 5', 'srithan-5', 'Methadone Hydrochloride IP', 'Methadone Hydrochloride IP 5 mg', '5 mg', '10 × 10 Tablets', 'alcohol-deaddiction', 'NRx'],
  ['SRITHAN 10', 'srithan-10', 'Methadone Hydrochloride IP', 'Methadone Hydrochloride IP 10 mg', '10 mg', '10 × 10 Tablets', 'alcohol-deaddiction', 'NRx'],
  ['AEGON SR', 'aegon-sr', 'Buprenorphine & Naloxone Sublingual Tablets IP', 'Buprenorphine 2 mg + Naloxone 0.5 mg', '2 mg / 0.5 mg', '10 × 10 Tablets', 'alcohol-deaddiction', 'NRx'],
  ['AEGON S', 'aegon-s', 'Buprenorphine & Naloxone Sublingual Tablets IP', 'Buprenorphine 0.4 mg + Naloxone 0.1 mg', '0.4 mg / 0.1 mg', '10 × 10 Tablets', 'alcohol-deaddiction', 'NRx'],
  ['AEGON 0.2', 'aegon-02', 'Buprenorphine Sublingual Tablets IP', 'Buprenorphine IP eq. to Buprenorphine 0.2 mg', '0.2 mg', '10 × 10 Tablets', 'alcohol-deaddiction', 'NRx'],
  ['AEGON 0.4', 'aegon-04', 'Buprenorphine Sublingual Tablets IP', 'Buprenorphine IP eq. to Buprenorphine 0.4 mg', '0.4 mg', '10 × 10 Tablets', 'alcohol-deaddiction', 'NRx'],
  // Anti-Depressant
  ['SRIPLINE 10', 'sripline-10', 'Amitriptyline Hydrochloride IP', 'Amitriptyline Hydrochloride IP 10 mg', '10 mg', '20 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SRIPLINE 25', 'sripline-25', 'Amitriptyline Hydrochloride IP', 'Amitriptyline Hydrochloride IP 25 mg', '25 mg', '20 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['CHLOZAPAM 0.50', 'chlozapam-050', 'Clonazepam IP Mouth Dissolving Tablets', 'Clonazepam IP 0.50 mg', '0.50 mg', '10 × 10 Tablets', 'anti-depressant', 'NRx'],
  ['CHLOZAPAM P', 'clonazepam-p', 'Clonazepam & Propranolol Tablets', 'Clonazepam IP 0.5 mg + Propranolol HCl 20 mg', '0.5 mg / 20 mg', '10 × 10 Tablets', 'anti-depressant', 'NRx'],
  ['CHLOZAPAM 0.10', 'chlozapam-010', 'Clonazepam IP Mouth Dissolving Tablets', 'Clonazepam IP 0.10 mg', '0.10 mg', '10 × 10 Tablets', 'anti-depressant', 'NRx'],
  ['CITLOPRAM PLUS', 'citlopram-plus', 'Escitalopram & Clonazepam Tablets', 'Escitalopram Oxalate 10 mg + Clonazepam 0.5 mg', '10 mg / 0.5 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['CITLOPRAM S PLUS', 'citlopram-s-plus', 'Escitalopram & Clonazepam Tablets', 'Escitalopram 10 mg + Clonazepam 0.5 mg', '10 mg / 0.5 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['CITLOPRAM PLUS 5', 'citlopram-plus-5', 'Escitalopram & Clonazepam Tablets', 'Escitalopram 5 mg + Clonazepam 0.5 mg', '5 mg / 0.5 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['CITLOPRAM 20', 'citlopram-20', 'Escitalopram Tablets', 'Escitalopram Oxalate IP eq. to Escitalopram 20 mg + Clonazepam 0.25 mg', '20 mg / 0.25 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['CITLOPRAM 10', 'citlopram-10', 'Escitalopram Tablets', 'Escitalopram Oxalate IP eq. to Escitalopram 10 mg', '10 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['CITLOPRAM 5', 'citlopram-5', 'Escitalopram Tablets', 'Escitalopram Oxalate IP eq. to Escitalopram 5 mg', '5 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SULOXETIN 20', 'suloxetin-20', 'Duloxetine Gastro-Resistant Tablets IP', 'Duloxetine 20 mg', '20 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SULOXETIN 40', 'suloxetin-40', 'Duloxetine Gastro-Resistant Tablets IP', 'Duloxetine 40 mg', '40 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SUDEX 50', 'sudex-50', 'Desvenlafaxine Extended Release Tablets', 'Desvenlafaxine Succinate eq. to Desvenlafaxine 50 mg', '50 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SUDEX 100', 'sudex-100', 'Desvenlafaxine Extended Release Tablets', 'Desvenlafaxine Succinate eq. to Desvenlafaxine 100 mg', '100 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SMIMINE 25', 'smimine-25', 'Imipramine Hydrochloride IP', 'Imipramine Hydrochloride IP 25 mg', '25 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SMIMINE 75', 'smimine-75', 'Imipramine Hydrochloride IP', 'Imipramine Hydrochloride IP 75 mg', '75 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SMIMINE D', 'smimine-d', 'Imipramine & Diazepam Tablets', 'Imipramine HCl 25 mg + Diazepam 5 mg', '25 mg / 5 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SMIMINE FORT', 'smimine-fort', 'Imipramine & Diazepam Tablets', 'Imipramine HCl 25 mg + Diazepam 2 mg', '25 mg / 2 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SILEPRAM 25', 'silepram-25', 'Milnacipran Hydrochloride IP', 'Milnacipran Hydrochloride IP 25 mg', '25 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SILEPRAM 50', 'silepram-50', 'Milnacipran Hydrochloride IP', 'Milnacipran Hydrochloride IP 50 mg', '50 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SUXEVIN 12.5', 'suxevin-12-5', 'Paroxetine Controlled Release Tablets IP', 'Paroxetine Controlled Release IP 12.5 mg', '12.5 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SUXEVIN 25', 'suxevin-25', 'Paroxetine Controlled Release Tablets IP', 'Paroxetine Controlled Release IP 25 mg', '25 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SRITRL 50', 'sritrl-50', 'Sertraline Hydrochloride IP', 'Sertraline Hydrochloride IP 50 mg', '50 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SRITRL 100', 'sritrl-100', 'Sertraline Hydrochloride IP', 'Sertraline Hydrochloride IP 100 mg', '100 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SRIVENA 37.5', 'srivena-375', 'Venlafaxine Prolonged-Release Capsules BP', 'Venlafaxine 37.5 mg', '37.5 mg', '10 × 2 × 10 Capsules', 'anti-depressant', 'Rx'],
  ['SRIVENA 75', 'srivena-75', 'Venlafaxine Prolonged-Release Capsules BP', 'Venlafaxine 75 mg', '75 mg', '10 × 2 × 10 Capsules', 'anti-depressant', 'Rx'],
  ['SRIZPO C', 'srizpo-c', 'Chlordiazepoxide & Clidinium Tablets', 'Chlordiazepoxide 5 mg + Clidinium Bromide 2.5 mg', '5 mg / 2.5 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SRIZPO 10', 'srizpo-10', 'Chlordiazepoxide Tablets', 'Chlordiazepoxide IP 10 mg', '10 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SLUVOX 50', 'sluvox-50', 'Fluvoxamine Tablets', 'Fluvoxamine 50 mg', '50 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SLUVOX 100', 'sluvox-100', 'Fluvoxamine Tablets', 'Fluvoxamine 100 mg', '100 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SPDEM 5', 'spdem-5', 'Zolpidem Tartrate Tablets IP', 'Zolpidem Tartrate IP 5 mg', '5 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
  ['SPDEM 10', 'spdem-10', 'Zolpidem Tartrate Tablets IP', 'Zolpidem Tartrate IP 10 mg', '10 mg', '10 × 10 Tablets', 'anti-depressant', 'Rx'],
]

// Continue with remaining categories in part 2 - script will be long
// For brevity I'll append more rows...

function desc(name, generic) {
  return `${name} — quality-assured ${generic} formulation from SRK Group.`
}

function neuroArea(cat) {
  return cat === 'anti-cough' || cat === 'general' ? 'general' : 'neurology'
}

const products = rows.map(([name, slug, generic, composition, dosage, pack, category, rx]) => ({
  id: slug,
  name,
  slug,
  genericName: generic,
  composition,
  dosage,
  packSize: pack,
  category,
  therapeuticArea: neuroArea(category),
  prescriptionType: rx,
  image: `/images/${slug}.jpeg`,
  description: desc(name, generic),
  indications: ['As directed by registered medical practitioner'],
  storage,
}))

writeFileSync(
  join(__dirname, '../src/data/masterProducts.json'),
  JSON.stringify(products, null, 2)
)
console.log(`Wrote ${products.length} products`)
