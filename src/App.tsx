import { Routes, Route, useLocation } from "react-router"
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
import MatchingPreferences from "@/pages/MatchingPreferences"
import MyProfile from "@/pages/MyProfile"
import MessagesPage from "@/pages/Messages"
import NotificationsPage from "@/pages/NotificationsPage"
import Login from "@/pages/Login"
import ForgotPassword from "@/pages/ForgotPassword"
import AppDownload from "@/pages/AppDownload"
import PaymentSuccess from "@/pages/PaymentSuccess"
import RegisterModal from "@/components/RegisterModal"
import AuthPromptModal from "@/components/AuthPromptModal"
import NotificationPromptModal from "@/components/NotificationPromptModal"
import { Toaster } from "@/components/ui/sonner"
import { RegisterModalProvider } from "@/context/RegisterModalContext"

// Dedicated Admin Portal Pages
import AdminLogin from "@/pages/admin/AdminLogin"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminVerifications from "@/pages/admin/AdminVerifications"
import AdminProfiles from "@/pages/admin/AdminProfiles"

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#F4EFE6] text-[#1C1412]">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/verifications" element={<AdminVerifications />} />
          <Route path="/admin/profiles" element={<AdminProfiles />} />
        </Routes>
      </div>
    )
  }

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
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/app" element={<AppDownload />} />
            <Route path="/download-app" element={<AppDownload />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/matching-preferences" element={<MatchingPreferences />} />
            <Route path="/profile-edit" element={<MatchingPreferences />} />
            <Route path="/profile-creation" element={<ProfileCreation />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </main>
        <Footer />
        <MobileBottomNavigation />
        <RegisterModal />
        <AuthPromptModal />
        <NotificationPromptModal />
        <Toaster position="top-center" richColors />
      </div>
    </RegisterModalProvider>
  )
}
