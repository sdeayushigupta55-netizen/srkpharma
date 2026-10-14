import type { ProductCategory } from '../types'

export const productCategories: {
  id: ProductCategory
  label: string
  shortLabel: string
}[] = [
  { id: 'alcohol-deaddiction', label: 'Alcohol Deaddiction', shortLabel: 'Deaddiction' },
  { id: 'anti-depressant', label: 'Anti-Depressant', shortLabel: 'Antidepressant' },
  { id: 'anti-epileptic', label: 'Anti-Epileptic', shortLabel: 'Epilepsy' },
  { id: 'anti-parkinsons', label: "Anti-Parkinson's", shortLabel: 'Parkinson\'s' },
  { id: 'anti-psychotic', label: 'Anti-Psychotic', shortLabel: 'Antipsychotic' },
  { id: 'anxiolytic', label: 'Anxiolytic', shortLabel: 'Anxiolytic' },
  { id: 'mood-stabilizers', label: 'Mood Stabilizers', shortLabel: 'Mood' },
  { id: 'neuropathic-pain', label: 'Neuropathic Pain', shortLabel: 'Neuropathic' },
  { id: 'anti-cough', label: 'Anti-Cough', shortLabel: 'Cough' },
  { id: 'neuroprotective', label: 'Neuroprotective', shortLabel: 'Neuroprotective' },
  { id: 'neuro-otology', label: 'Neuro-Otology', shortLabel: 'Neuro-Otology' },
  { id: 'general', label: 'General Medicine', shortLabel: 'General' },
]

export function getCategoryLabel(id: ProductCategory) {
  return productCategories.find((c) => c.id === id)?.label ?? id
}

export function categoryToTherapeuticArea(category: ProductCategory): string {
  if (category === 'general') return 'general'
  return 'neurology'
}
