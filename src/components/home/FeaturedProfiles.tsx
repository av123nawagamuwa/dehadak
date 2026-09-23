import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, HeartHandshake } from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { useRegisterModal } from '@/context/RegisterModalContext'
import { API_BASE_URL } from '@/config'
import { getGenderAvatar } from '@/utils/avatar'
import { cleanPhotoUrl } from '@/utils/imageUrl'

export default function FeaturedProfiles() {
  const { t } = useTranslation()
  const { openRegisterModal } = useRegisterModal()
  const [profiles, setProfiles] = useState<any[]>([])
  const bannerVideoRef = useRef<HTMLVideoElement>(null)

  // Default curated authentic profiles for initial showcase
  const demoProfiles = [
    {
      id: '1',
      name: 'Amaya K.',
      age: 26,
      location: 'Colombo, Western Province',
      religion: 'Buddhist',
      ethnicity: 'Sinhalese',
      height: "5'4\"",
      profession: 'Software Engineer',
      education: 'BSc (Hons) in Computing',
      image: '/profile-female-1.jpg',
      verified: true,
      premium: true,
      privacyMode: false,
    },
    {
      id: '2',
      name: 'Dr. Kasun D.',
      age: 29,
      location: 'Kandy, Central Province',
      religion: 'Buddhist',
      ethnicity: 'Sinhalese',
      height: "5'10\"",
      profession: 'Medical Doctor',
      education: 'MBBS (Peradeniya)',
      image: '/profile-male-1.jpg',
      verified: true,
      premium: true,
      privacyMode: false,
    },
    {
      id: '3',
      name: 'Tharushi W.',
      age: 27,
      location: 'Gampaha, Western Province',
      religion: 'Christian',
      ethnicity: 'Sinhalese',
      height: "5'5\"",
      profession: 'Financial Analyst',
      education: 'BSc in Finance (USJ)',
      image: '/profile-female-2.jpg',
      verified: true,
      premium: false,
      privacyMode: false,
    },
    {
      id: '4',
      name: 'Dulantha P.',
      age: 31,
      location: 'Kurunegala, NW Province',
      religion: 'Buddhist',
      ethnicity: 'Sinhalese',
      height: "5'11\"",
      profession: 'Civil Engineer / Director',
      education: 'BSc Eng (Moratuwa)',
      image: '/profile-male-2.jpg',
      verified: true,
      premium: true,
      privacyMode: false,
    },
  ]

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/search?limit=4`)
        if (res.ok) {
          const data = await res.json()
          if (data.profiles && data.profiles.length > 0) {
            const mapped = data.profiles.map((p: any) => {
              const isPhotoPrivate = Boolean(p.photo_private || p.photo_privacy === 0 || p.photo_privacy === false)
              const rawPhoto = p.photos && p.photos.length > 0 ? (p.photos[0]?.url || p.photos[0]) : (p.avatar_url || '')
              const cleaned = cleanPhotoUrl(rawPhoto)
              const avatarFallback = getGenderAvatar(p.gender)
              const finalPhoto = (!isPhotoPrivate && cleaned) ? cleaned : avatarFallback

              return {
                id: p.id || p.user_id,
                name: `${p.first_name || ''} ${p.last_name ? p.last_name.charAt(0) + '.' : ''}`.trim() || 'Member',
                age: p.birth_year ? new Date().getFullYear() - Number(p.birth_year) : (p.age || 27),
                location: [p.city, p.district].filter(Boolean).join(', ') || 'Sri Lanka',
                religion: p.religion || 'Buddhist',
                ethnicity: p.ethnicity || 'Sinhalese',
                height: p.height || "5'6\"",
                profession: p.profession || 'Professional',
                education: p.education || 'Graduate',
                gender: p.gender || 'male',
                image: finalPhoto,
                verified: p.verification_status === 'VERIFIED' || p.verified === true,
                premium: (p.plan || '').toLowerCase() === 'premium' || (p.plan || '').toLowerCase() === 'vip',
                privacyMode: isPhotoPrivate,
              }
            })
            setProfiles(mapped)
            return
          }
        }
      } catch (err) {
        // Fallback to demo profiles
      }
      setProfiles(demoProfiles)
    }

    fetchFeatured()

    if (bannerVideoRef.current) {
      bannerVideoRef.current.muted = true
      bannerVideoRef.current.defaultMuted = true
      bannerVideoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <section className="py-24 bg-[#FAF7F0] relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#D4A72C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B76E79]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEE6D8] border border-[#D4A72C]/30 text-xs font-semibold text-[#996F16] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>Hand-Picked Verified Profiles</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A17] tracking-tight">
              {t('home.featured.heading')}
            </h2>
            <p className="text-sm sm:text-base text-[#241A17]/70 mt-2 max-w-xl">
              {t('home.featured.subtitle')}
            </p>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#241A17] text-[#F3D77A] font-semibold text-sm hover:bg-[#33221D] transition-colors shadow-md w-fit group"
          >
            <span>{t('home.featured.viewAll')}</span>
            <ArrowRight className="w-4 h-4 text-[#F3D77A] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Staggered Grid of Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id || index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full"
            >
              <ProfileCard {...profile} />
            </motion.div>
          ))}
        </div>

        {/* Enhanced Full-Height Video Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 relative rounded-3xl overflow-hidden text-white flex flex-col items-center justify-center text-center p-8 sm:p-14 lg:p-16 min-h-[380px] sm:min-h-[460px] md:min-h-[500px] border border-[#D4A72C]/40 shadow-2xl group"
        >
          {/* Background Animated Video */}
          <video
            ref={bannerVideoRef}
            src="/videos/family-values-animation.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85 scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out pointer-events-none"
          >
            <source src="/videos/family-values-animation.mp4" type="video/mp4" />
          </video>

          {/* Dark Espresso Vignette Overlays for Crisp Text Readability while showing full video */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412]/90 via-black/35 to-[#1C1412]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1412]/80 via-transparent to-[#1C1412]/80" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#1C1412]/60 pointer-events-none" />

          {/* Subtle Warm Gold Center Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Center Content */}
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            {/* Emblem Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#D4A72C]/25 border border-[#D4A72C]/50 flex items-center justify-center mb-4 shadow-gold backdrop-blur-md">
              <HeartHandshake className="w-7 h-7 text-[#F3D77A]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 border border-[#D4A72C]/40 text-xs font-semibold text-[#F7D878] mb-3 backdrop-blur-sm shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Authentic Sri Lankan Matrimony</span>
            </div>

            <h3 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#FAF7F0] mb-3 leading-tight tracking-tight drop-shadow-lg">
              Are you seeking a partner with genuine family values?
            </h3>

            <p className="text-sm sm:text-base text-[#FAF7F0]/90 font-sans max-w-lg mb-8 leading-relaxed drop-shadow">
              Join over 5,000 verified Sri Lankans at home and overseas who trust Dehadak for meaningful lifelong unions.
            </p>

            <button
              onClick={openRegisterModal}
              className="btn-gold px-9 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-gold hover:shadow-gold-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your Profile</span>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
