import { Routes, Route } from 'react-router'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import SearchPage from '@/pages/Search'
import PricingPage from '@/pages/Pricing'
import ProfileCreation from '@/pages/ProfileCreation'
import MessagesPage from '@/pages/Messages'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar transparent={true} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/profile-creation" element={<ProfileCreation />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
