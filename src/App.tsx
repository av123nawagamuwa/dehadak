import { Routes, Route } from "react-router"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MobileBottomNavigation from "@/components/MobileBottomNavigation"
import ScrollToTop from "@/components/ScrollToTop"
import Home from "@/pages/Home"
import SearchPage from "@/pages/Search"
import HowItWorksPage from "@/pages/HowItWorks"
import SuccessStoriesPage from "@/pages/SuccessStories"
import PricingPage from "@/pages/Pricing"
import ProfileCreation from "@/pages/ProfileCreation"
import MyProfile from "@/pages/MyProfile"
import MessagesPage from "@/pages/Messages"
import Login from "@/pages/Login"
import ForgotPassword from "@/pages/ForgotPassword"
import AppDownload from "@/pages/AppDownload"
import RegisterModal from "@/components/RegisterModal"
import AuthPromptModal from "@/components/AuthPromptModal"
import { RegisterModalProvider } from "@/context/RegisterModalContext"

export default function App() {
  return (
    <RegisterModalProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF7F0] overflow-x-hidden">
        <ScrollToTop />
        <Navbar transparent={true} />
        <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/matches" element={<MessagesPage defaultTab="received" />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/app" element={<AppDownload />} />
            <Route path="/download-app" element={<AppDownload />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile-edit" element={<ProfileCreation />} />
            <Route path="/profile-creation" element={<ProfileCreation />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </main>
        <Footer />
        <MobileBottomNavigation />
        <RegisterModal />
        <AuthPromptModal />
      </div>
    </RegisterModalProvider>
  )
}
