import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks } from '../../data/company'
import { images } from '../../utils/assets'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-navy-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center group">
            <img
              src={images.logo}
              alt="SRK PHARMA"
              className="h-12 w-auto object-contain bg-transparent transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? scrolled
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-orange-400 bg-white/10'
                    : scrolled
                      ? 'text-navy-900 hover:text-orange-500 hover:bg-gray-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/contact"
            className={`hidden lg:inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              scrolled
                ? 'gradient-orange text-white hover:shadow-lg hover:shadow-orange-500/25'
                : 'bg-white text-navy-900 hover:bg-orange-400 hover:text-white'
            }`}
          >
            Get in Touch
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              scrolled ? 'text-navy-900' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t shadow-xl">
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-navy-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="block mt-2 px-4 py-3 rounded-full text-center text-sm font-semibold gradient-orange text-white"
              >
                Get in Touch
              </Link>
            </nav>
          </div>
      )}
    </header>
  )
}
