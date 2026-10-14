import Footer from './Footer'
import Header from './Header'
import PageTransition from './PageTransition'
import ScrollToTop from './ScrollToTop'
import SiteAmbientEffects from '../ui/SiteAmbientEffects'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <SiteAmbientEffects />
      <ScrollToTop />
      <Header />
      <main className="flex-1 relative z-10">
        <PageTransition />
      </main>
      <Footer />
    </div>
  )
}
