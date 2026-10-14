import AnimatedSection from '../components/ui/AnimatedSection'
import PageHero3D from '../components/ui/PageHero3D'
import SectionHeading from '../components/ui/SectionHeading'
import TherapeuticCard from '../components/ui/TherapeuticCard'
import { company } from '../data/company'
import { therapeuticAreas } from '../data/therapeuticAreas'

export default function TherapeuticAreasPage() {
  return (
    <>
      <PageHero3D
        label="Therapeutic Excellence"
        title="Focused Expertise. Meaningful Solutions."
        subtitle="Our therapeutic focus enables us to build deeper expertise while developing a differentiated pharmaceutical portfolio across Neuro-Psychiatry, Addiction Treatment and Pain Management."
      />

      <section className="py-24 perspective-1400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Our Focus Areas"
              title="One-Stop Solution for CNS Care"
              subtitle="Carefully selected therapeutic opportunities aligned with SRK's capabilities and long-term vision"
            />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-8">
            {therapeuticAreas.map((area, i) => (
              <TherapeuticCard key={area.id} area={area} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 hex-pattern">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">
              {company.brandStatement.accent}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {company.brandStatement.body}
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
