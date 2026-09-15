import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Heart, Search, Sparkles, CheckCircle2 } from 'lucide-react'
import { useRegisterModal } from '@/context/RegisterModalContext'

export default function FinalCTASection() {
  const { t } = useTranslation()
  const { openRegisterModal } = useRegisterModal()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.defaultMuted = true
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Video autoPlay prevented, retrying on user event:', error)
        })
      }
    }
  }, [])

  return (
    <section className="relative py-28 overflow-hidden bg-[#1A1210]">
      {/* Background Animated Video */}
      <video
        ref={videoRef}
        src="/videos/cta-bg-animation.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
      >
        <source src="/videos/cta-bg-animation.mp4" type="video/mp4" />
      </video>

      {/* Dark Espresso Vignette Overlays for clear text readability while showing animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1210] via-black/40 to-[#1A1210]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1210]/85 via-transparent to-[#1A1210]/85" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#1A1210]/60 pointer-events-none" />

      {/* Subtle Warm Gold Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating Heart Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F3D77A]/30 to-[#D4A72C]/15 border border-[#D4A72C]/50 flex items-center justify-center mx-auto mb-6 shadow-gold backdrop-blur-md"
        >
          <Heart className="w-8 h-8 text-[#F3D77A] fill-current" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#FAF7F0] tracking-tight leading-tight mb-5 drop-shadow-lg"
        >
          {t('home.finalCTA.heading') || 'Your Story Could Begin Today.'}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#FAF7F0]/90 font-normal max-w-2xl mx-auto mb-10 leading-relaxed font-sans drop-shadow-md"
        >
          {t('home.finalCTA.subtitle') ||
            'Create your profile and take the first step toward a meaningful, lifelong connection.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={openRegisterModal}
            className="btn-gold w-full sm:w-auto px-10 py-4 rounded-full text-base font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('home.finalCTA.createProfile') || 'Create Your Profile'}</span>
          </button>
          <Link
            to="/search"
            className="btn-gold-outline w-full sm:w-auto px-10 py-4 rounded-full text-base font-semibold flex items-center justify-center gap-2 backdrop-blur-md bg-black/40 border border-[#D4A72C]/60 text-[#FAF7F0] hover:bg-[#D4A72C]/20 transition-all"
          >
            <Search className="w-4 h-4 text-[#F3D77A]" />
            <span>{t('home.finalCTA.exploreMatches') || 'Explore Matches'}</span>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#FAF7F0]/85 font-medium"
        >
          <div className="flex items-center gap-1.5 bg-black/35 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-sm shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#D4A72C]" />
            <span>Free Registration</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/35 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-sm shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#D4A72C]" />
            <span>100% Privacy Control</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/35 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-sm shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#D4A72C]" />
            <span>Verified Sri Lankan Community</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
