import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { ContactFormModal } from './components/contact/ContactFormModal'
import { ListPage } from './pages/ListPage'
import { DetailPage } from './pages/DetailPage'

function App() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  const handleOpenContactForm = useCallback(() => {
    setIsContactFormOpen(true)
  }, [])

  const handleCloseContactForm = useCallback(() => {
    setIsContactFormOpen(false)
  }, [])

  return (
    <div className="app-shell">
      <Header onOpenContactForm={handleOpenContactForm} />

      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/works-finder/" element={<ListPage />} />
          <Route path="/works-finder/:workId" element={<DetailPage />} />
          <Route path="/" element={<ListPage />} />
        </Routes>
      </AnimatePresence>

      <Footer />

      {isContactFormOpen && (
        <ContactFormModal onClose={handleCloseContactForm} />
      )}
    </div>
  )
}

export default App
