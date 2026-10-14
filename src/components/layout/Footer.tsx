import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'
import Reveal3D from '../ui/Reveal3D'
import { company, navLinks } from '../../data/company'
import { images } from '../../utils/assets'
import { therapeuticAreas } from '../../data/therapeuticAreas'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <Reveal3D direction="up" delay={0}>
            <div>
              <img
                src={images.logo}
                alt="SRK PHARMA"
                className="h-14 w-auto mb-4 object-contain bg-transparent"
              />
              <p className="text-white/60 text-sm leading-relaxed">
                {company.footerSummary}
              </p>
            </div>
          </Reveal3D>

          <Reveal3D direction="up" delay={0.1}>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-orange-400 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal3D>

          <Reveal3D direction="up" delay={0.2}>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-orange-400 mb-4">
                Therapeutic Areas
              </h4>
              <ul className="space-y-2">
                {therapeuticAreas.map((area) => (
                  <li key={area.id}>
                    <Link
                      to={`/therapeutic-areas/${area.slug}`}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal3D>

          <Reveal3D direction="up" delay={0.3}>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-orange-400 mb-4">
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-white/60">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-orange-400" />
                  {company.contact.address}
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="shrink-0 text-orange-400" />
                  <a href={`mailto:${company.contact.email}`} className="text-white/60 hover:text-white transition-colors">
                    {company.contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal3D>
        </div>

        <Reveal3D direction="up" delay={0.4}>
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/40 text-xs text-center md:text-left">
                © {new Date().getFullYear()} {company.legalName}. All rights reserved.
              </p>
              <p className="text-white/30 text-xs text-center max-w-lg">
                Brand names are for reference purpose only and shall not be treated as an advertisement.
                Please consult a registered medical practitioner before taking any medication.
              </p>
            </div>
          </div>
        </Reveal3D>
      </div>
    </footer>
  )
}
