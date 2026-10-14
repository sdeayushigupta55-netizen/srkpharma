import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'
import Quality from './pages/Quality'
import TherapeuticAreaDetail from './pages/TherapeuticAreaDetail'
import TherapeuticAreasPage from './pages/TherapeuticAreas'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/therapeutic-areas" element={<TherapeuticAreasPage />} />
          <Route
            path="/therapeutic-areas/:slug"
            element={<TherapeuticAreaDetail />}
          />
          <Route path="/quality" element={<Quality />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
