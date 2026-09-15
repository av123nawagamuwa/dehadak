import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Heart,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react'

import { useRegisterModal } from '@/context/RegisterModalContext'

export default function HeroSection() {
  const { t } = useTranslation()
  const { openRegisterModal } = useRegisterModal()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const slides = [
    {
      id: 0,
      type: 'video',
      src: '/videos/animation-muted.mp4',
      badge: 'From First Connection to Marriage',
      caption: 'Where meaningful conversations turn into lifelong partnerships',
      tag: 'Animated Story',
    },
    {
      id: 1,
      type: 'image',
      src: '/images/hero-luxury.jpg',
      badge: 'Rooted in Sri Lankan Traditions',
      caption: 'Honor family heritage, astrology, and cultural values with confidence',
      tag: 'Royal Heritage',
    },
    {
      id: 2,
      type: 'image',
      src: '/images/story-1.jpg',
      badge: '1,000+ Verified Love Stories',
      caption: 'Genuine couples finding true companionship across Sri Lanka',
      tag: 'Real Couples',
    },
  ]

  // Auto-advance non-video slides or cycle every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Floating Romantic Particles
  const particles = [
    { id: 1, left: '12%', delay: 0, duration: 7, size: 8 },
    { id: 2, left: '32%', delay: 2, duration: 8.5, size: 10 },
    { id: 3, left: '58%', delay: 1, duration: 6.5, size: 7 },
    { id: 4, left: '78%', delay: 3, duration: 9, size: 11 },
    { id: 5, left: '22%', delay: 4, duration: 7.5, size: 6 },
    { id: 6, left: '88%', delay: 2.5, duration: 8, size: 9 },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1C1412] pt-24 pb-16 lg:py-0">
      
      {/* Background Media Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {slides[currentSlide].type === 'video' ? (
            <motion.div
              key="bg-video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 overflow-hidden"
            >
              <video
                src="/videos/animation-muted.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover scale-105 blur-[2px]"
              />
            </motion.div>
          ) : (
            <motion.div
              key={slides[currentSlide].src}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 0.38, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[1px]"
              style={{ backgroundImage: `url(${slides[currentSlide].src})` }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic Dark Espresso & Warm Rose Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#281D1A]/80 to-[#1C1412]/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1412]/92 via-[#1C1412]/50 to-[#1C1412]/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#1C1412]/40 to-[#1C1412]/95" />

      {/* Subtle Floating Romantic Bokeh Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 150 }}
            animate={{
              opacity: [0, 0.5, 0.3, 0],
              y: [-20, -260],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              left: p.left,
              bottom: '8%',
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            className="absolute rounded-full bg-gradient-to-t from-[#E5A93C] to-[#FFF3D1] blur-[1px] shadow-[0_0_14px_#E5A93C]"
          />
        ))}
      </div>

      {/* Main Hero Content */}
      <div
        ref={ref}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[85vh] py-12">
          
          {/* Left Column: Heading, Subheading, CTAs & Trust Badges */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            
            {/* Top Brand Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/40 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F7D878]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#F7D878]">
                Sri Lanka's Premier Matrimonial Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#FAF6F0] leading-[1.12] tracking-tight"
            >
              {t('home.heroTitlePrefix')}{' '}
              <span className="text-gold-shimmer block sm:inline">
                {t('home.heroTitleHighlight')}
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[#FAF6F0]/85 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              {t('home.heroSubtitle')}
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={openRegisterModal}
                className="btn-gold w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-lg"
              >
                <Heart className="w-4 h-4 fill-current" />
                {t('home.createYourProfile')}
              </button>
              <Link
                to="/search"
                className="btn-gold-outline w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Search className="w-4 h-4 text-[#F7D878]" />
                {t('home.exploreMatches')}
              </Link>
            </motion.div>

            {/* Trust Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-4 text-xs sm:text-sm font-medium text-[#FAF6F0]/75"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C]" />
                <span>{t('home.verifiedProfiles')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C]" />
                <span>{t('home.privacyProtected')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C]" />
                <span>{t('home.trustedCommunity')}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Video & Image Showcase Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6"
          >
            <div className="glass-espresso rounded-3xl p-4 sm:p-5 shadow-luxury border border-[#E5A93C]/35 relative overflow-hidden backdrop-blur-2xl">
              
              {/* Carousel Viewport */}
              <div className="relative h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden bg-black/40 border border-[#E5A93C]/25 group">
                <AnimatePresence mode="wait">
                  {slides[currentSlide].type === 'video' ? (
                    <motion.div
                      key="carousel-video"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="w-full h-full relative"
                    >
                      <video
                        ref={videoRef}
                        src="/videos/animation-muted.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Controls Top Right */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (videoRef.current) {
                              if (isPlaying) {
                                videoRef.current.pause()
                                setIsPlaying(false)
                              } else {
                                videoRef.current.play()
                                setIsPlaying(true)
                              }
                            }
                          }}
                          aria-label={isPlaying ? 'Pause video' : 'Play video'}
                          className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-[#F7D878] transition-colors"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-white/90 font-medium">
                          <VolumeX className="w-3.5 h-3.5 text-[#F7D878]" />
                          <span>Muted Preview</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={slides[currentSlide].src}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="w-full h-full relative bg-cover bg-center"
                      style={{ backgroundImage: `url(${slides[currentSlide].src})` }}
                    />
                  )}
                </AnimatePresence>

                {/* Soft Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Slide Caption Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E5A93C]/90 text-[#1C1412] text-[10px] font-extrabold uppercase tracking-wider mb-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>{slides[currentSlide].tag}</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white drop-shadow-md">
                    {slides[currentSlide].badge}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-1 mt-0.5">
                    {slides[currentSlide].caption}
                  </p>
                </div>

                {/* Left / Right Carousel Controls */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-[#E5A93C]/30 text-white flex items-center justify-center hover:bg-[#E5A93C] hover:text-[#1C1412] transition-all opacity-0 group-hover:opacity-100 shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-[#E5A93C]/30 text-white flex items-center justify-center hover:bg-[#E5A93C] hover:text-[#1C1412] transition-all opacity-0 group-hover:opacity-100 shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Carousel Progress Indicators & Quick Metric Bar */}
              <div className="mt-4 flex items-center justify-between gap-3">
                
                {/* Slide Indicators */}
                <div className="flex items-center gap-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentSlide === idx
                          ? 'w-8 bg-gradient-to-r from-[#F7D878] to-[#E5A93C] shadow-[0_0_8px_#E5A93C]'
                          : 'w-2 bg-white/25 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Floating Metric Pill */}
                <div className="flex items-center gap-3 text-xs text-[#FAF6F0]/80">
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-[#E5A93C]/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span className="font-semibold text-[11px]">100% Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-[#E5A93C]/20">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span className="font-semibold text-[11px]">1,000+ Married</span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none text-[#FAF6F0]/50"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-5 h-5 text-[#E5A93C]" />
      </motion.div>
    </section>
  )
}
