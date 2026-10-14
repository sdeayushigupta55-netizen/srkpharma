import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Globe,
  Handshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection from '../components/ui/AnimatedSection'
import Background3D from '../components/ui/Background3D'
import HeroVisual from '../components/ui/HeroVisual'
import ProductCard from '../components/ui/ProductCard'
import SectionHeading from '../components/ui/SectionHeading'
import StatCounter from '../components/ui/StatCounter'
import TherapeuticCard from '../components/ui/TherapeuticCard'
import Tilt3D from '../components/ui/Tilt3D'
import WhoWeAreVisual from '../components/ui/WhoWeAreVisual'
import Reveal3D from '../components/ui/Reveal3D'
import { company } from '../data/company'
import { getFeaturedProducts, products } from '../data/products'
import { therapeuticAreas } from '../data/therapeuticAreas'

export default function Home() {
  const featured = getFeaturedProducts()
  const reduceMotion = useReducedMotion()

  const fadeIn = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 } as const,
        animate: { opacity: 1, y: 0 } as const,
        transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
      }

  return (
    <>
      {/* 01 — Hero */}
      <section className="relative min-h-screen hero-mesh overflow-hidden flex items-center">
        <Background3D />
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[80px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeIn}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-orange-400 text-sm font-semibold mb-6">
                <Sparkles size={14} />
                {company.tagline}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-4">
                {company.heroHeadline}
                <br />
                <span className="text-shimmer">{company.heroHeadlineAccent}</span>
              </h1>

              <p className="text-xl text-white/80 font-medium mb-4">
                {company.heroSubline}
              </p>

              <p className="text-lg text-white/70 mb-4 max-w-lg leading-relaxed">
                {company.heroDescription}
              </p>

              <p className="text-base text-white/55 mb-8 max-w-lg leading-relaxed">
                {company.heroExtended}
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-orange text-white font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
                >
                  Explore Our Products
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card text-white font-semibold hover:bg-white/15 transition-all duration-300"
                >
                  Partner With SRK PHARMA
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {company.pillars.map((pillar) => (
                  <span key={pillar} className="flex items-center gap-2 text-white/60 text-sm">
                    <CheckCircle2 size={16} className="text-orange-400 shrink-0" />
                    {pillar}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] },
                  })}
              className="relative flex justify-center lg:justify-end w-full"
            >
              <HeroVisual />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-10 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="gradient-blue rounded-3xl p-8 md:p-12 shadow-2xl shadow-navy-900/25 border border-white/10 card-shine">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {company.stats.map((stat, i) => (
                  <StatCounter
                    key={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 02 — Brand Statement */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-orange-500 mb-4">
              Brand Statement
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-2 leading-tight">
              {company.brandStatement.title}
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-8">
              {company.brandStatement.accent}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {company.brandStatement.body}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {company.commitment.map((item) => (
                <span
                  key={item}
                  className="px-5 py-2 rounded-full bg-navy-900/5 text-navy-800 text-sm font-semibold border border-navy-900/10"
                >
                  {item}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 03 — Who We Are */}
      <section className="py-28 relative overflow-hidden bg-gray-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <AnimatedSection>
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-orange-500 mb-3">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-2 leading-tight">
                {company.whoWeAre.title}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-6">
                {company.whoWeAre.accent}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {company.whoWeAre.intro}
              </p>

              <div className="space-y-4 mb-10">
                {company.whoWeAre.principles.map(({ title, description }, i) => (
                  <Reveal3D key={title} delay={i * 0.08} direction="up">
                    <Tilt3D intensity={8}>
                      <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 transition-colors card-shine">
                        <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center shrink-0 text-white font-bold text-sm">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-navy-900 mb-1">{title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                        </div>
                      </div>
                    </Tilt3D>
                  </Reveal3D>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-900 text-white font-semibold hover:bg-navy-700 transition-all group"
              >
                Discover SRK PHARMA
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <Tilt3D intensity={10}>
                <WhoWeAreVisual />
              </Tilt3D>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 04 — Therapeutic Excellence */}
      <section className="py-28 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="absolute inset-0 hex-pattern opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Therapeutic Excellence"
              title="Focused Expertise. Meaningful Solutions."
              subtitle="Our therapeutic focus enables us to build deeper expertise while developing a differentiated pharmaceutical portfolio."
            />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-8">
            {therapeuticAreas.map((area, i) => (
              <TherapeuticCard key={area.id} area={area} index={i} />
            ))}
          </div>
          <AnimatedSection className="text-center mt-12">
            <Link
              to="/therapeutic-areas"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-navy-700 text-navy-700 font-semibold hover:bg-navy-700 hover:text-white transition-all hover:shadow-lg"
            >
              View All Therapeutic Areas <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* 05 — Quality */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Quality"
              title={`${company.qualityPhilosophy.title} ${company.qualityPhilosophy.accent}`}
              subtitle={company.qualityPhilosophy.intro}
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {company.qualityPhilosophy.pillars.map((pillar, i) => (
              <Reveal3D key={pillar.title} delay={i * 0.08} direction="up">
                <Tilt3D intensity={8}>
                  <div className="h-full p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:border-orange-200/50 transition-all card-shine">
                    <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center mb-4">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-navy-900 mb-2">{pillar.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                </Tilt3D>
              </Reveal3D>
            ))}
          </div>

          <AnimatedSection className="text-center">
            <p className="text-lg font-semibold text-navy-900 mb-6">
              {company.qualityPhilosophy.tagline}
            </p>
            <Link
              to="/quality"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full gradient-blue text-white font-semibold hover:shadow-lg transition-all"
            >
              Our Quality Approach <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* 06 — Science & Innovation */}
      <section className="py-28 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-blue-accent/10 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-orange-400 text-sm font-semibold uppercase tracking-widest">
                Science & Innovation
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
                {company.scienceInnovation.title}
              </h2>
              <p className="text-white/70 text-lg mb-4">{company.scienceInnovation.intro}</p>
              <p className="text-white/60 leading-relaxed mb-6">
                {company.scienceInnovation.body}
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                {company.scienceInnovation.closing}
              </p>
              <div className="flex flex-wrap gap-3">
                {company.scienceInnovation.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-4 py-2 rounded-full glass-card text-white/90 text-sm font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FlaskConical, label: 'Research-Oriented', desc: 'Emerging opportunities' },
                  { icon: Lightbulb, label: 'Innovation Mindset', desc: 'Future-ready portfolio' },
                  { icon: Globe, label: 'Global Outlook', desc: 'International markets' },
                  { icon: Handshake, label: 'Partnerships', desc: 'Strategic collaborations' },
                ].map(({ icon: Icon, label, desc }, i) => (
                  <Reveal3D key={label} delay={i * 0.1} direction="up">
                    <div className="glass-card rounded-2xl p-6 text-center h-full">
                      <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-sm mb-1">{label}</h3>
                      <p className="text-white/50 text-xs">{desc}</p>
                    </div>
                  </Reveal3D>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 07 — Product Portfolio */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <span className="inline-block text-sm font-semibold uppercase tracking-widest text-orange-500 mb-3">
                  Product Portfolio
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
                  A Portfolio Built for Tomorrow
                </h2>
                <p className="text-gray-600 mt-3 max-w-2xl leading-relaxed">
                  {company.portfolioIntro}
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:gap-3 transition-all shrink-0"
              >
                View all {products.length} products <ArrowRight size={18} />
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <AnimatedSection className="text-center mt-14">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full gradient-orange text-white font-semibold hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 text-lg"
            >
              Explore Our Portfolio <ArrowRight size={20} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Global Markets strip */}
      <section className="py-16 bg-gray-50 hex-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">
              Global Vision
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mt-2 mb-4">
              Expanding Access Across Markets
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {company.globalVision}
            </p>
          </AnimatedSection>
          <div className="flex flex-wrap justify-center gap-3">
            {company.globalMarkets.map((market) => (
              <span
                key={market}
                className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-navy-800 text-sm font-medium shadow-sm"
              >
                {market}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 hero-mesh relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-block text-orange-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Partner With {company.name}
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you are a healthcare professional, distributor, or strategic
              partner — we are here to support your needs with quality pharmaceutical
              solutions and responsible healthcare practices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-navy-900 font-bold hover:bg-orange-400 hover:text-white transition-all duration-300 text-lg hover:shadow-xl"
              >
                Contact Us Today <ArrowRight size={20} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full glass-card text-white font-semibold hover:bg-white/15 transition-all text-lg"
              >
                Explore Our Products
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
