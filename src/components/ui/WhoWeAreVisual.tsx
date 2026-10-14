import { motion } from 'framer-motion'
import { Award, Globe, Microscope, ShieldCheck, TrendingUp } from 'lucide-react'
import { company } from '../../data/company'

const pillars = [
  { icon: ShieldCheck, title: 'Quality Assurance', desc: 'WHO-GMP certified manufacturing' },
  { icon: Microscope, title: 'Scientific Rigor', desc: 'Evidence-based CNS formulations' },
  { icon: TrendingUp, title: 'Patient Outcomes', desc: 'Long-term neurological care focus' },
  { icon: Award, title: 'Regulatory Trust', desc: 'NRx, Rx & Schedule H compliant' },
]

export default function WhoWeAreVisual() {
  return (
    <div className="relative">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-navy-900/10 border border-gray-100">
        {/* Top — abstract medical visual (no logo, no product photos) */}
        <div className="relative h-52 sm:h-60 hero-gradient overflow-hidden">
          <div className="absolute inset-0 hex-pattern opacity-25" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Abstract molecule / network SVG */}
            <svg viewBox="0 0 320 200" className="w-full h-full opacity-80" fill="none">
              <circle cx="160" cy="100" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="160" cy="100" r="35" stroke="rgba(243,112,33,0.3)" strokeWidth="1.5" />
              {[
                { cx: 160, cy: 40 }, { cx: 220, cy: 75 }, { cx: 220, cy: 125 },
                { cx: 160, cy: 160 }, { cx: 100, cy: 125 }, { cx: 100, cy: 75 },
              ].map((p, i) => (
                <g key={i}>
                  <line x1="160" y1="100" x2={p.cx} y2={p.cy} stroke="rgba(91,192,235,0.3)" strokeWidth="1" />
                  <circle cx={p.cx} cy={p.cy} r="6" fill={i % 2 === 0 ? '#f37021' : '#5bc0eb'} opacity="0.8" />
                </g>
              ))}
              <circle cx="160" cy="100" r="12" fill="#ffd200" opacity="0.9" />
              <circle cx="145" cy="90" r="5" fill="#5bc0eb" />
              <circle cx="175" cy="90" r="5" fill="#5bc0eb" />
              <circle cx="160" cy="115" r="5" fill="#f37021" />
            </svg>
          </div>
          {/* Overlay stats row */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/80 to-transparent px-6 py-5">
            <div className="grid grid-cols-3 gap-3">
              {company.stats.slice(0, 3).map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-xl font-bold text-white">
                    {stat.value}<span className="text-orange-400 text-sm">{stat.suffix}</span>
                  </p>
                  <p className="text-white/50 text-[9px] uppercase tracking-wide leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom — commitment pillars */}
        <div className="bg-white p-7">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-4 h-4 text-orange-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              Our Commitment
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="p-3 rounded-xl bg-gray-50 hover:bg-navy-900/5 border border-gray-100 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-navy-700 group-hover:text-orange-500 transition-colors mb-2" />
                  <h4 className="font-bold text-navy-900 text-xs leading-tight">{pillar.title}</h4>
                  <p className="text-gray-400 text-[10px] mt-1 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              )
            })}
          </div>
          <div className="mt-5 h-0.5 rounded-full gradient-orange" />
        </div>
      </div>
    </div>
  )
}
