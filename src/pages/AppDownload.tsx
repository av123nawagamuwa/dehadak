import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  Smartphone,
  ShieldCheck,
  Zap,
  Bell,
  Sparkles,
  ArrowRight,
  Share,
  PlusSquare,
  CheckCircle2,
  Lock,
  Heart,
  MessageCircle,
  Search,
  Crown,
  ChevronRight,
} from 'lucide-react'
import InstallAppButton from '@/components/InstallAppButton'
import InstallInstructionsModal from '@/components/InstallInstructionsModal'

export default function AppDownload() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPlatform, setModalPlatform] = useState<'ios' | 'android'>('ios')
  const [activeGuideTab, setActiveGuideTab] = useState<'android' | 'ios'>('android')

  const openModal = (platform: 'ios' | 'android') => {
    setModalPlatform(platform)
    setModalOpen(true)
  }

  const features = [
    {
      icon: Zap,
      title: 'Fast Access',
      desc: 'Launch instantly from your home screen without typing URLs or waiting for store downloads.',
    },
    {
      icon: Bell,
      title: 'Stay Connected',
      desc: 'Never miss an interest request or heartfelt message from genuine Sri Lankan prospects.',
    },
    {
      icon: Smartphone,
      title: 'App-Like Experience',
      desc: 'Enjoy a distraction-free, full-screen standalone interface crafted for seamless navigation.',
    },
    {
      icon: Sparkles,
      title: 'Always Updated',
      desc: 'Always enjoy the latest security features and enhancements automatically through the web.',
    },
  ]

  const androidSteps = [
    {
      num: '01',
      title: 'Open in Chrome',
      desc: 'Visit dehadak.lk using Google Chrome or Edge browser on your Android phone.',
    },
    {
      num: '02',
      title: 'Tap Install App',
      desc: 'Click the "Install App" button on this page or tap the 3 dots menu (⋮) in Chrome.',
    },
    {
      num: '03',
      title: 'Confirm Install',
      desc: 'Tap "Install" when the prompt appears on your screen.',
    },
    {
      num: '04',
      title: 'Launch from Home Screen',
      desc: 'Access Dehadak anytime directly from your phone app drawer or home screen.',
    },
  ]

  const iosSteps = [
    {
      num: '01',
      title: 'Open in Safari',
      desc: 'Navigate to dehadak.lk using Safari browser on your iPhone or iPad.',
    },
    {
      num: '02',
      title: 'Tap Share Icon',
      desc: 'Tap the Share button at the bottom center of the Safari browser.',
    },
    {
      num: '03',
      title: 'Add to Home Screen',
      desc: 'Scroll down through the share sheet and select "Add to Home Screen".',
    },
    {
      num: '04',
      title: 'Tap "Add"',
      desc: 'Tap Add in the top-right corner to place the Dehadak app icon on your device.',
    },
  ]

  return (
    <div className="bg-[#FAF7F0] text-[#241A17] overflow-x-hidden min-h-screen">
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#1C1412] text-white border-b border-[#D4A72C]/25 overflow-hidden">
        {/* Background glow and subtle ambient elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1412] via-[#241A17] to-[#140D0C]" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-xs sm:text-sm font-bold text-[#F3D77A] tracking-wider uppercase mb-6 shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-[#F3D77A]" />
                <span>Dehadak Mobile Web App</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]"
              >
                Take Dehadak <br />
                <span className="text-gold-shimmer">Wherever You Go</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-[#FAF7F0]/85 font-sans leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Install Dehadak directly on your phone and stay connected to meaningful matches, instant messages, and verified profile updates wherever you are. No app store download required.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5"
              >
                <InstallAppButton variant="hero" label="Install App Now" />
                
                <a
                  href="#how-to-install"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-[#FAF7F0] bg-white/5 hover:bg-white/10 border border-[#D4A72C]/30 hover:border-[#D4A72C] backdrop-blur-md transition-all duration-300"
                >
                  <span>How to Install</span>
                  <ArrowRight className="w-4 h-4 text-[#F3D77A]" />
                </a>
              </motion.div>

              {/* Trust Subtext */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#FAF7F0]/70 font-sans"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#F3D77A]" />
                  <span>100% Privacy-Focused</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#F3D77A]" />
                  <span>Zero Storage Overhead</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#F3D77A]" />
                  <span>Secure SSL Encryption</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Realistic Phone Mockup Preview */}
            <div className="lg:col-span-5 flex justify-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative w-72 sm:w-80 rounded-[40px] p-3 bg-gradient-to-b from-[#4A3B36] via-[#241A17] to-[#1C1412] border-4 border-[#D4A72C]/40 shadow-2xl"
              >
                {/* Phone Speaker Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-neutral-800 mr-2" />
                  <div className="w-8 h-1 bg-neutral-700 rounded-full" />
                </div>

                {/* Screen Content Container */}
                <div className="w-full bg-[#FAF7F0] text-[#1C1412] rounded-[32px] overflow-hidden shadow-inner pt-7 pb-4 px-3.5 relative">
                  
                  {/* Mock App Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#EADFCF] mb-3">
                    <div className="flex items-center gap-1.5">
                      <img src="/logo.png" alt="Dehadak" className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-serif text-sm font-bold text-[#1C1412]">Dehadak</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-700">Online</span>
                    </div>
                  </div>

                  {/* Mock Candidate Profile Card Preview */}
                  <div className="rounded-2xl bg-white border border-[#E5A93C]/30 p-3 shadow-md mb-3">
                    <div className="relative rounded-xl overflow-hidden h-36 bg-[#281D1A] mb-2.5">
                      <img
                        src="/profile-female-1.jpg"
                        alt="Candidate Sample"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image not found
                          ;(e.currentTarget as HTMLImageElement).src = '/logo.png'
                        }}
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-[#F7D878] border border-[#E5A93C]/40 flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5" />
                        Verified
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                        <span className="text-xs font-serif font-bold drop-shadow">Sewwandi, 26</span>
                        <span className="text-[10px] bg-[#9B6B15]/80 px-1.5 py-0.5 rounded backdrop-blur">Colombo</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#5C4B47] font-sans mb-2 line-clamp-2 leading-tight">
                      Software Engineer • Buddhist • Seeking dignified and sincere partner.
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#1C1412] text-[11px] font-bold shadow-xs">
                        Send Interest
                      </button>
                      <button className="px-2 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#EADFCF] text-[#1C1412] text-[11px]">
                        <Heart className="w-3.5 h-3.5 text-[#C86D7B]" />
                      </button>
                    </div>
                  </div>

                  {/* Mock Navigation Bottom Bar */}
                  <div className="flex items-center justify-around pt-2 border-t border-[#EADFCF] text-[#5C4B47]">
                    <div className="flex flex-col items-center text-[#9B6B15]">
                      <Search className="w-4 h-4" />
                      <span className="text-[9px] font-bold">Discover</span>
                    </div>
                    <div className="flex flex-col items-center relative">
                      <MessageCircle className="w-4 h-4" />
                      <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-[9px]">Chats</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Heart className="w-4 h-4" />
                      <span className="text-[9px]">Interests</span>
                    </div>
                  </div>

                  {/* Bottom Home Indicator bar */}
                  <div className="w-24 h-1 bg-black/30 rounded-full mx-auto mt-3" />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 2. PLATFORM CARDS ==================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Android Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#241A17] text-white border border-[#D4A72C]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4A72C]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center mb-6 shadow-gold">
                <Smartphone className="w-7 h-7 text-[#F3D77A]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Direct 1-Click Install
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                Install on Android
              </h3>

              <p className="text-sm sm:text-base text-[#FAF7F0]/80 font-sans leading-relaxed mb-6">
                Install Dehadak directly from Google Chrome, Edge, or Samsung Internet. Runs in a full standalone window without Google Play Store downloads.
              </p>

              {/* Quick Steps */}
              <div className="space-y-2.5 mb-8 text-xs sm:text-sm text-[#FAF7F0]/85 font-sans">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#F3D77A] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>Open dehadak.lk in Chrome</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#F3D77A] font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>Tap "Install App" below</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#F3D77A] font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Confirm installation prompt</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#F3D77A] font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                  <span>Launch from Home Screen anytime</span>
                </div>
              </div>
            </div>

            <InstallAppButton variant="card" label="Install on Android" />
          </motion.div>

          {/* iPhone & iPad Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#241A17] text-white border border-[#D4A72C]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4A72C]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center mb-6 shadow-gold">
                <Smartphone className="w-7 h-7 text-[#F3D77A]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A72C]/20 text-[#F3D77A] border border-[#D4A72C]/30 text-xs font-bold uppercase tracking-wider mb-3">
                <Share className="w-3.5 h-3.5" />
                iOS Safari Supported
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                Install on iPhone & iPad
              </h3>

              <p className="text-sm sm:text-base text-[#FAF7F0]/80 font-sans leading-relaxed mb-6">
                Add Dehadak to your iPhone or iPad home screen using Safari in 3 simple taps. Get standalone full-screen access with zero storage footprint.
              </p>

              {/* Quick Steps */}
              <div className="space-y-2.5 mb-8 text-xs sm:text-sm text-[#FAF7F0]/85 font-sans">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#F3D77A] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>Open dehadak.lk in Safari</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#F3D77A] font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>Tap the Share button <Share className="w-3.5 h-3.5 inline ml-1 text-[#F3D77A]" /></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#F3D77A] font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Select "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 inline ml-1 text-[#F3D77A]" /></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#F3D77A] font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                  <span>Tap "Add" in the top right</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openModal('ios')}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-serif font-bold bg-gradient-to-r from-[#F3D77A] via-[#E5A93C] to-[#D4A72C] text-[#241A17] hover:brightness-105 shadow-gold transition-all cursor-pointer active:scale-98"
            >
              <span>View iPhone Instructions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* ==================== 3. WHY INSTALL DEHADAK ==================== */}
      <section className="py-20 bg-white border-y border-[#EADFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9B6B15] bg-[#E5A93C]/15 px-3.5 py-1 rounded-full border border-[#E5A93C]/30">
              Why Choose The App
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1412] mt-4 mb-4">
              Why Install Dehadak?
            </h2>
            <p className="text-sm sm:text-base text-[#5C4B47] font-sans">
              Enjoy all matrimonial features in an ultra-fast, standalone interface optimized specifically for your phone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-[#FAF6F0] border border-[#EADFCF] hover:border-[#D4A72C]/60 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
                  <item.icon className="w-7 h-7 text-[#9B6B15]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1C1412] mb-2.5">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C4B47] font-sans leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. NO APP STORE REQUIRED SECTION ==================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-14 lg:p-16 bg-gradient-to-br from-[#1C1412] to-[#281D1A] text-white border border-[#D4A72C]/30 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#D4A72C]/40 text-xs font-semibold text-[#F7D878] mb-6">
              <ShieldCheck className="w-4 h-4 text-[#F7D878]" />
              <span>Direct Browser Installation</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              No App Store Required
            </h2>

            <p className="text-sm sm:text-base text-[#FAF7F0]/85 font-sans leading-relaxed mb-8">
              Dehadak is a modern Progressive Web Application (PWA). You can install it directly from your web browser with zero memory hogging, zero APK risks, and zero app store delays.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-[#F3D77A]" />
                <span className="text-xs sm:text-sm font-semibold">Under 1MB Storage</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-[#F3D77A]" />
                <span className="text-xs sm:text-sm font-semibold">No Passwords or Store IDs</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-[#F3D77A]" />
                <span className="text-xs sm:text-sm font-semibold">Instant Background Sync</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. INSTALLATION GUIDE ==================== */}
      <section id="how-to-install" className="py-20 bg-[#FAF6F0] border-t border-[#EADFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9B6B15] bg-[#E5A93C]/15 px-3.5 py-1 rounded-full border border-[#E5A93C]/30">
              Step-by-Step Guide
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1412] mt-4 mb-3">
              How to Install Dehadak
            </h2>
            <p className="text-sm sm:text-base text-[#5C4B47] font-sans">
              Choose your device to follow the simple 4-step walkthrough.
            </p>
          </div>

          {/* Guide Platform Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-full bg-white p-1.5 border border-[#EADFCF] shadow-sm">
              <button
                type="button"
                onClick={() => setActiveGuideTab('android')}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                  activeGuideTab === 'android'
                    ? 'bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] shadow-md'
                    : 'text-[#5C4B47] hover:text-[#1C1412]'
                }`}
              >
                Android / Google Chrome
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('ios')}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                  activeGuideTab === 'ios'
                    ? 'bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] shadow-md'
                    : 'text-[#5C4B47] hover:text-[#1C1412]'
                }`}
              >
                iPhone & iPad (Safari)
              </button>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeGuideTab === 'android' ? androidSteps : iosSteps).map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-[#EADFCF] shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="text-3xl font-serif font-black text-[#D4A72C]/40 mb-4">
                  {step.num}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1C1412] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C4B47] font-sans leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <InstallAppButton
              variant="navbar"
              className="px-8 py-3.5 text-sm"
              label="Install App Now"
            />
          </div>
        </div>
      </section>

      {/* ==================== 6. APP UI PREVIEW SECTION ==================== */}
      <section className="py-20 bg-white border-y border-[#EADFCF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9B6B15] bg-[#E5A93C]/15 px-3.5 py-1 rounded-full border border-[#E5A93C]/30">
              Native Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1412] mt-4 mb-4">
              Experience Dehadak Like an App
            </h2>
            <p className="text-sm sm:text-base text-[#5C4B47] font-sans">
              Designed with touch-friendly cards, high-speed matching, and privacy controls built into every screen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Screen 1: Candidate Discovery */}
            <div className="bg-[#FAF6F0] rounded-3xl p-6 border border-[#EADFCF] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-[#9B6B15]" />
                <h3 className="font-serif text-lg font-bold text-[#1C1412]">Verified Discovery</h3>
              </div>
              <p className="text-xs text-[#5C4B47] mb-5">
                Filter verified Sri Lankan brides and grooms by district, profession, and family values.
              </p>
              <div className="rounded-2xl bg-white p-3 border border-[#EADFCF] shadow-inner space-y-2.5">
                <div className="h-28 bg-[#1C1412] rounded-xl overflow-hidden relative flex items-center justify-center">
                  <img src="/profile-male-1.jpg" alt="Profile sample" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-[#F7D878] px-2 py-0.5 rounded font-bold">Kandy • 29 yrs</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-[#1C1412]">
                  <span>Doctor • MBBS</span>
                  <span className="text-emerald-700 font-semibold">100% Verified</span>
                </div>
              </div>
            </div>

            {/* Screen 2: Real-time Messages & Interests */}
            <div className="bg-[#FAF6F0] rounded-3xl p-6 border border-[#EADFCF] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-[#9B6B15]" />
                <h3 className="font-serif text-lg font-bold text-[#1C1412]">Instant Messaging</h3>
              </div>
              <p className="text-xs text-[#5C4B47] mb-5">
                Mutual connections unlock dignified real-time messaging and interest notifications.
              </p>
              <div className="rounded-2xl bg-white p-3 border border-[#EADFCF] shadow-inner space-y-2">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center justify-between">
                  <span className="font-bold">Interest Accepted!</span>
                  <span className="text-[10px]">Just now</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF6F0] text-[11px] text-[#1C1412]">
                  "Ayubowan! Delighted to connect with your family..."
                </div>
              </div>
            </div>

            {/* Screen 3: Privacy & Security */}
            <div className="bg-[#FAF6F0] rounded-3xl p-6 border border-[#EADFCF] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-[#9B6B15]" />
                <h3 className="font-serif text-lg font-bold text-[#1C1412]">Dignified Privacy</h3>
              </div>
              <p className="text-xs text-[#5C4B47] mb-5">
                Control your profile photo blur, hide contact details, and approve viewers on your terms.
              </p>
              <div className="rounded-2xl bg-white p-3 border border-[#EADFCF] shadow-inner space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6F0] text-[11px]">
                  <span>Photo Privacy Blur</span>
                  <span className="text-emerald-700 font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6F0] text-[11px]">
                  <span>Phone Verification</span>
                  <span className="text-emerald-700 font-bold">Audited</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 7. FINAL CTA SECTION ==================== */}
      <section className="py-20 bg-[#1C1412] text-white border-t border-[#D4A72C]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4A72C]/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center mx-auto mb-6 shadow-gold">
            <img src="/logo.png" alt="Dehadak" className="w-10 h-10 object-cover rounded-full" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            Your Journey Is One Tap Away
          </h2>

          <p className="text-sm sm:text-base text-[#FAF7F0]/85 font-sans leading-relaxed mb-10 max-w-xl mx-auto">
            Install Dehadak and keep your matches, conversations, and verified matrimonial profile close wherever you go.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <InstallAppButton variant="hero" label="Install Dehadak App" />
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-[#FAF7F0] bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#D4A72C] transition-all"
            >
              <span>Continue in Browser</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Instructions Modal */}
      <InstallInstructionsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPlatform={modalPlatform}
      />
    </div>
  )
}
