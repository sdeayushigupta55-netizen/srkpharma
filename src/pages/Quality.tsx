import {
  Award,
  ClipboardCheck,
  FileCheck,
  FlaskConical,
  Microscope,
  ShieldCheck,
} from 'lucide-react'
import AnimatedSection from '../components/ui/AnimatedSection'
import PageHero3D from '../components/ui/PageHero3D'
import SectionHeading from '../components/ui/SectionHeading'
import Tilt3D from '../components/ui/Tilt3D'
import { company } from '../data/company'

const icons = [ShieldCheck, Microscope, FlaskConical, FileCheck, ClipboardCheck, Award]

export default function Quality() {
  return (
    <>
      <PageHero3D
        label="Quality Assurance"
        title={`${company.qualityPhilosophy.title} ${company.qualityPhilosophy.accent}`}
        subtitle={company.qualityPhilosophy.intro}
      />

      <section className="py-24 perspective-1400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Our Quality Philosophy"
              title={company.qualityPhilosophy.tagline}
              subtitle="Every SRK product reflects our commitment to consistency, compliance, control and continuous improvement"
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {company.qualityPoints.map((point, i) => {
              const Icon = icons[i % icons.length]
              return (
                <AnimatedSection key={point.title} delay={i * 0.08}>
                  <Tilt3D intensity={12}>
                    <div className="group h-full p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:border-navy-700/10 transition-all duration-300 card-shine">
                      <div
                        className="w-14 h-14 rounded-xl gradient-blue flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 mb-3">
                        {point.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </Tilt3D>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 hex-pattern perspective-1400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Tilt3D intensity={5} scale={1.01}>
              <div className="gradient-blue rounded-2xl p-8 md:p-12 text-center shadow-2xl shadow-navy-900/20 card-shine">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Manufacturing Excellence
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto mb-8">
                  Our state-of-the-art manufacturing facilities operate under strict
                  WHO-GMP guidelines, with validated processes, trained personnel, and
                  continuous improvement programs ensuring every batch meets the highest
                  standards.
                </p>
                <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  {['WHO-GMP Certified', 'ISO Compliant', 'Schedule H Compliant'].map(
                    (badge, i) => (
                      <AnimatedSection key={badge} delay={i * 0.1}>
                        <div className="glass-card rounded-xl py-4 px-6 text-white font-semibold text-sm hover:bg-white/15 transition-colors">
                          {badge}
                        </div>
                      </AnimatedSection>
                    )
                  )}
                </div>
              </div>
            </Tilt3D>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
