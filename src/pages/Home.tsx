import HeroSection from '@/components/home/HeroSection'
import FeaturedProfiles from '@/components/home/FeaturedProfiles'
import TrustSection from '@/components/home/TrustSection'
import StatisticsSection from '@/components/home/StatisticsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import SuccessStoriesSection from '@/components/home/SuccessStoriesSection'
import PrivacySection from '@/components/home/PrivacySection'
import FinalCTASection from '@/components/home/FinalCTASection'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] overflow-x-hidden selection:bg-[#D4A72C]/30 selection:text-[#241A17]">
      {/* 1. Cinematic Hero Section with Carousel & Video */}
      <HeroSection />

      {/* 2. Featured Profile Cards */}
      <FeaturedProfiles />

      {/* 3. Built Around Trust & Verification */}
      <TrustSection />

      {/* 4. Live Animated Statistics Section */}
      <StatisticsSection />

      {/* 5. How It Works Overview */}
      <HowItWorksSection />

      {/* 6. Success Stories Testimonials */}
      <SuccessStoriesSection />

      {/* 7. Privacy & Security Assurance */}
      <PrivacySection />

      {/* 8. Final Call to Action */}
      <FinalCTASection />
    </div>
  )
}
