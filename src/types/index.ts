export type PrescriptionType = 'NRx' | 'Rx' | 'OTC'

export type ProductCategory =
  | 'alcohol-deaddiction'
  | 'anti-depressant'
  | 'anti-epileptic'
  | 'anti-parkinsons'
  | 'anti-psychotic'
  | 'anxiolytic'
  | 'mood-stabilizers'
  | 'neuropathic-pain'
  | 'anti-cough'
  | 'neuroprotective'
  | 'neuro-otology'
  | 'general'

export interface Product {
  id: string
  name: string
  slug: string
  genericName: string
  composition: string
  dosage: string
  packSize: string
  category: ProductCategory
  therapeuticArea: string
  prescriptionType: PrescriptionType
  image?: string
  description: string
  indications: string[]
  storage: string
  warnings?: string
  administration?: string
  howItWorks?: string
  sideEffects?: string[]
  isPlaceholder?: boolean
}

export interface TherapeuticArea {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  productCount: number
  highlights: string[]
  categories?: ProductCategory[]
}

export interface NavLink {
  label: string
  path: string
}
