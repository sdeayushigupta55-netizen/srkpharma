import type { ProductCategory, TherapeuticArea } from '../types'
import { products } from './products'

const neuroPsychiatryCategories: ProductCategory[] = [
  'anti-depressant',
  'anti-epileptic',
  'anti-parkinsons',
  'anti-psychotic',
  'anxiolytic',
  'mood-stabilizers',
]

function countByCategories(categories: ProductCategory[]) {
  return products.filter((p) => categories.includes(p.category)).length
}

export const therapeuticAreas: TherapeuticArea[] = [
  {
    id: 'neuro-psychiatry',
    name: 'Neuro-Psychiatry',
    slug: 'neuro-psychiatry',
    description:
      'Focused on pharmaceutical solutions addressing evolving neuro-psychiatric healthcare requirements — from depression and anxiety to epilepsy, psychosis and mood disorders.',
    icon: 'brain',
    productCount: countByCategories(neuroPsychiatryCategories),
    categories: neuroPsychiatryCategories,
    highlights: [
      'Antidepressants and anxiolytic formulations',
      'Anti-epileptic and mood stabilizer therapies',
      'Anti-psychotic and neurological care solutions',
    ],
  },
  {
    id: 'addiction-treatment',
    name: 'Addiction Treatment',
    slug: 'addiction-treatment',
    description:
      'Committed to supporting responsible, evidence-based approaches to addiction care through relevant pharmaceutical solutions for alcohol and substance dependence.',
    icon: 'shield',
    productCount: countByCategories(['alcohol-deaddiction']),
    categories: ['alcohol-deaddiction'],
    highlights: [
      'Alcohol de-addiction and abstinence support',
      'Aversive and maintenance therapy options',
      'Evidence-based addiction medicine portfolio',
    ],
  },
  {
    id: 'pain-management',
    name: 'Pain Management',
    slug: 'pain-management',
    description:
      'Focused on pharmaceutical solutions supporting healthcare professionals in responsible pain-management practices, including neuropathic pain and nerve-related conditions.',
    icon: 'activity',
    productCount: countByCategories(['neuropathic-pain']),
    categories: ['neuropathic-pain'],
    highlights: [
      'Neuropathic pain and nerve symptom relief',
      'Gabapentin, pregabalin and combination therapies',
      'Supportive care for chronic pain conditions',
    ],
  },
  {
    id: 'emerging-opportunities',
    name: 'Emerging Opportunities',
    slug: 'emerging-opportunities',
    description:
      'Continuously evaluating new therapeutic and pharmaceutical opportunities aligned with our capabilities and long-term vision — including neuroprotective and respiratory care.',
    icon: 'sparkles',
    productCount: countByCategories(['neuroprotective', 'neuro-otology', 'anti-cough']),
    categories: ['neuroprotective', 'neuro-otology', 'anti-cough'],
    highlights: [
      'Neuroprotective and cognitive support therapies',
      'Neuro-otology and vestibular care formulations',
      'Respiratory and cough care formulations',
      'Pipeline aligned with evolving market needs',
    ],
  },
]

export function getTherapeuticAreaBySlug(slug: string) {
  return therapeuticAreas.find((area) => area.slug === slug)
}

export function getTherapeuticAreaById(id: string) {
  return therapeuticAreas.find((area) => area.id === id)
}

export function getProductsForTherapeuticArea(area: TherapeuticArea) {
  if (area.categories?.length) {
    return products.filter((p) => area.categories!.includes(p.category))
  }
  return products.filter((p) => p.therapeuticArea === area.id)
}
