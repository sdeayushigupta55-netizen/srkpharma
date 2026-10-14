import { Globe, Target, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection from '../components/ui/AnimatedSection'
import PageHero3D from '../components/ui/PageHero3D'
import SectionHeading from '../components/ui/SectionHeading'
import Tilt3D from '../components/ui/Tilt3D'
import WhoWeAreVisual from '../components/ui/WhoWeAreVisual'
import { company } from '../data/company'
import { products } from '../data/products'

export default function About() {
  return (
    <>
      <PageHero3D
        label="About Us"
        title={company.tagline}
        subtitle="A professionally driven pharmaceutical company focused on delivering quality-led, innovative and accessible healthcare solutions."
      />

      <section className="py-24 perspective-1400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionHeading
                  label={company.name}
                  title="A Pharmaceutical Company Built on Quality, Science & Trust"
                  centered={false}
                />
                <p className="text-gray-600 leading-relaxed text-lg">
                  {company.aboutNarrative}
                </p>
              </div>
              <Tilt3D intensity={10}>
                <WhoWeAreVisual />
              </Tilt3D>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-gray-50 hex-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Our Global Vision"
              title="Expanding Access. Creating Impact."
              subtitle={company.globalVision}
            />
          </AnimatedSection>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {company.globalMarkets.map((market) => (
              <span
                key={market}
                className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-navy-800 text-sm font-medium shadow-sm"
              >
                {market}
              </span>
            ))}
          </div>

          <AnimatedSection>
            <SectionHeading
              label="Our Purpose"
              title="Vision, Mission & Values"
              subtitle="Guiding principles that drive everything we do at SRK PHARMA"
            />
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Eye,
                title: 'Vision',
                text: company.vision,
              },
              {
                icon: Target,
                title: 'Mission',
                text: company.mission,
              },
              {
                icon: Globe,
                title: 'Global Outlook',
                text: 'As a trusted supplier of life-saving therapies, we actively contribute to global health programs through strategic partnerships with Ministries of Health in emerging economies and community stakeholders — to foster lasting change and broaden access to evidence-based care.',
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <Tilt3D intensity={12}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full hover:shadow-xl transition-shadow card-shine">
                    <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </Tilt3D>
              </AnimatedSection>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {company.values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.08}>
                <Tilt3D intensity={8}>
                  <div className="flex gap-4 p-6 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 transition-colors card-shine">
                    <div className="w-2 rounded-full gradient-orange shrink-0" />
                    <div>
                      <h4 className="font-bold text-navy-900 mb-2">{value.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </Tilt3D>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-16">
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore our {products.length}-product portfolio across Neuro-Psychiatry,
              Addiction Treatment and Pain Management.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full gradient-orange text-white font-semibold hover:shadow-lg transition-all"
            >
              View Our Products
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
