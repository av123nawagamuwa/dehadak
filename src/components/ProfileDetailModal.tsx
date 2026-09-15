import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ShieldCheck,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Ruler,
  Users,
  Sparkles,
  Eye,
  EyeOff,
  Compass,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'

interface ProfileDetailModalProps {
  profileId: number | string | null
  isOpen: boolean
  onClose: () => void
  onSendInterest?: (profile: any) => void
  interestStatus?: 'idle' | 'sending' | 'pending' | 'accepted' | 'declined'
}

function cleanPhotoUrl(url: any): string {
  if (!url) return ''
  if (typeof url === 'string') {
    if (url.startsWith('{')) {
      try {
        const parsed = JSON.parse(url)
        return parsed.url || url
      } catch (e) {
        return url
      }
    }
    return url
  }
  if (typeof url === 'object' && url.url) return url.url
  return String(url)
}

export default function ProfileDetailModal({
  profileId,
  isOpen,
  onClose,
  onSendInterest,
  interestStatus = 'idle',
}: ProfileDetailModalProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [privacyBlur, setPrivacyBlur] = useState(false)
  const [localInterestStatus, setLocalInterestStatus] = useState(interestStatus)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setLocalInterestStatus(interestStatus)
  }, [interestStatus])

  useEffect(() => {
    if (isOpen && profileId) {
      document.body.style.overflow = 'hidden'
      fetchProfileDetails(profileId)
    } else {
      document.body.style.overflow = 'unset'
      setProfile(null)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, profileId])

  const fetchProfileDetails = async (id: number | string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/search/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      } else {
        console.error('Failed to load profile details')
      }
    } catch (err) {
      console.error('Network error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInterest = () => {
    if (onSendInterest && profile) {
      onSendInterest(profile)
    } else if (profile) {
      const token = localStorage.getItem('dehadak_auth')
      if (!token) {
        window.dispatchEvent(
          new CustomEvent('dehadak:open-auth-prompt', {
            detail: { memberName: profile.name, profileId: profile.id },
          })
        )
        return
      }

      setLocalInterestStatus('sending')
      fetch(`${API_BASE_URL}/api/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId: profile.user_id || profile.id }),
      })
        .then((res) => res.json())
        .then(() => {
          setLocalInterestStatus('pending')
        })
        .catch(() => {
          setLocalInterestStatus('idle')
        })
    }
  }

  if (!mounted) return null

  // Fallback portraits based on gender
  const idNum = typeof profileId === 'number' ? profileId : parseInt(String(profileId || '1'), 10) || 1
  const isMale = String(profile?.gender || '').toLowerCase() === 'male' || String(profile?.gender || '').toLowerCase() === 'groom'
  const malePortraits = [
    '/profile-male-1.jpg',
    '/profile-male-2.jpg',
    '/profile-male-3.jpg',
  ]
  const femalePortraits = [
    '/profile-female-1.jpg',
    '/profile-female-2.jpg',
    '/profile-female-3.jpg',
  ]
  const defaultPortraits = isMale ? malePortraits : femalePortraits
  const fallbackPortrait = defaultPortraits[Math.abs(idNum) % defaultPortraits.length]

  const photosList =
    profile?.photos && Array.isArray(profile.photos) && profile.photos.length > 0
      ? profile.photos.map(cleanPhotoUrl).filter(Boolean)
      : [fallbackPortrait]

  const displayPhoto = photosList[activePhotoIdx] || fallbackPortrait

  const currentStatus = onSendInterest ? interestStatus : localInterestStatus
  const interestBtnLabel =
    currentStatus === 'pending'
      ? 'Interest Request Sent'
      : currentStatus === 'accepted'
        ? 'Connected'
        : currentStatus === 'declined'
          ? 'Declined'
          : currentStatus === 'sending'
            ? 'Sending Request...'
            : 'Send Interest Request'

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 25 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-[#FAF7F0] text-[#1C1412] border border-[#D4A72C]/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top Bar with Close Button */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1C1412] text-white border-b border-[#D4A72C]/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Dehadak" className="w-7 h-7 rounded-full object-cover" />
                <span className="font-serif text-lg font-bold text-white tracking-wide">
                  Candidate Profile Details
                </span>
                {profile?.adId && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-[#F7D878] font-mono border border-white/15">
                    {profile.adId}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-[#D4A72C] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-serif font-bold text-[#1C1412]">
                  Loading verified profile details...
                </p>
              </div>
            ) : profile ? (
              <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8">
                
                {/* 1. Header Profile Banner */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-white rounded-3xl p-5 sm:p-6 border border-[#EADFCF] shadow-sm">
                  
                  {/* Portrait & Photos */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-[#1C1412] border-2 border-[#D4A72C]/40 shadow-md">
                      <img
                        src={displayPhoto}
                        alt={profile.name}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          privacyBlur ? 'blur-md scale-105' : ''
                        }`}
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).src = fallbackPortrait
                        }}
                      />

                      {/* Verified Badge Overlay */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-[#F7D878] border border-[#E5A93C]/40 flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-[#F7D878]" />
                        <span>100% Verified Profile</span>
                      </div>

                      {/* Photo Blur Toggle */}
                      <button
                        type="button"
                        onClick={() => setPrivacyBlur(!privacyBlur)}
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white/90 hover:text-white border border-white/20 text-xs flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {privacyBlur ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{privacyBlur ? 'Unblur' : 'Blur Photo'}</span>
                      </button>
                    </div>

                    {/* Thumbnail Gallery (if multiple photos) */}
                    {photosList.length > 1 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto w-full pb-1">
                        {photosList.map((p: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIdx(idx)}
                            className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                              activePhotoIdx === idx
                                ? 'border-[#D4A72C] shadow-gold scale-105'
                                : 'border-[#EADFCF] opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={p} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Primary Summary Details & Action CTA */}
                  <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412] tracking-tight">
                          {profile.name}
                        </h2>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E5A93C]/15 text-[#9B6B15] border border-[#E5A93C]/30">
                          {profile.gender || 'Bride/Groom'}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-[#5C4B47] flex items-center gap-1.5 mb-4">
                        <MapPin className="w-4 h-4 text-[#D4A72C] shrink-0" />
                        <span>{profile.city || profile.district}, Sri Lanka</span>
                        <span>•</span>
                        <span>{profile.age} years old</span>
                      </p>

                      {/* Key Chips */}
                      <div className="grid grid-cols-2 gap-2.5 text-xs font-medium">
                        <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#D4A72C] shrink-0" />
                          <span className="truncate">{profile.profession || 'Professional'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#D4A72C] shrink-0" />
                          <span className="truncate">{profile.education || 'Graduate'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center gap-2">
                          <Compass className="w-4 h-4 text-[#D4A72C] shrink-0" />
                          <span className="truncate">{profile.religion || 'Buddhist'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-[#D4A72C] shrink-0" />
                          <span>{profile.height || "5' 5\""}</span>
                        </div>
                      </div>
                    </div>

                    {/* Send Interest Action Button */}
                    <div className="pt-3 border-t border-[#EADFCF]">
                      <button
                        type="button"
                        onClick={handleInterest}
                        disabled={currentStatus !== 'idle'}
                        className={`w-full py-3.5 px-6 rounded-2xl font-serif font-bold text-base flex items-center justify-center gap-2 transition-all shadow-gold ${
                          currentStatus === 'idle'
                            ? 'bg-gradient-to-r from-[#F3D77A] via-[#E5A93C] to-[#D4A72C] text-[#1C1412] hover:brightness-105 active:scale-98 cursor-pointer'
                            : 'bg-[#FAF6F0] text-[#1C1412]/60 border border-[#EADFCF] cursor-not-allowed'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            currentStatus === 'accepted' ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                        <span>{interestBtnLabel}</span>
                      </button>
                      <p className="text-[11px] text-center text-[#5C4B47] mt-2">
                        Mutual interest is required before contact details and phone numbers are shared.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. About Me / Personal Bio */}
                {profile.about_me && (
                  <div className="bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-[#1C1412] mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4A72C]" />
                      <span>About Candidate</span>
                    </h3>
                    <p className="text-sm text-[#5C4B47] font-sans leading-relaxed whitespace-pre-line">
                      {profile.about_me}
                    </p>
                  </div>
                )}

                {/* 3. Detailed Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Personal & Cultural Attributes */}
                  <div className="bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-sm space-y-3.5">
                    <h3 className="font-serif text-base font-bold text-[#1C1412] border-b border-[#EADFCF] pb-2">
                      Personal & Cultural Background
                    </h3>
                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span className="text-[#5C4B47]">Ethnicity:</span>
                        <span className="font-semibold text-[#1C1412]">{profile.ethnicity || 'Sinhalese'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span className="text-[#5C4B47]">Marital Status:</span>
                        <span className="font-semibold text-[#1C1412]">{profile.marital_status || 'Never Married'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span className="text-[#5C4B47]">Dietary Habits:</span>
                        <span className="font-semibold text-[#1C1412]">{profile.dietary_habits || 'Non-Vegetarian'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span className="text-[#5C4B47]">Drinking / Smoking:</span>
                        <span className="font-semibold text-[#1C1412]">
                          {profile.drinking === 'no' || !profile.drinking ? 'Non-Drinker' : 'Social'} •{' '}
                          {profile.smoking === 'no' || !profile.smoking ? 'Non-Smoker' : 'Occasional'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Career & Education */}
                  <div className="bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-sm space-y-3.5">
                    <h3 className="font-serif text-base font-bold text-[#1C1412] border-b border-[#EADFCF] pb-2">
                      Education & Profession
                    </h3>
                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span className="text-[#5C4B47]">Highest Education:</span>
                        <span className="font-semibold text-[#1C1412]">{profile.education || "Bachelor's Degree"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span className="text-[#5C4B47]">Profession:</span>
                        <span className="font-semibold text-[#1C1412]">{profile.profession || 'Professional'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span className="text-[#5C4B47]">Work Location:</span>
                        <span className="font-semibold text-[#1C1412]">{profile.work_location || profile.district || 'Sri Lanka'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span className="text-[#5C4B47]">Country:</span>
                        <span className="font-semibold text-[#1C1412]">{profile.country || 'Sri Lanka'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Family Information (if available) */}
                  {profile.parent_info && (
                    <div className="bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-sm space-y-3.5">
                      <h3 className="font-serif text-base font-bold text-[#1C1412] border-b border-[#EADFCF] pb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#D4A72C]" />
                        <span>Family Background</span>
                      </h3>
                      <div className="space-y-2.5 text-xs sm:text-sm">
                        {profile.parent_info.father_profession && (
                          <div className="flex justify-between py-1 border-b border-neutral-100">
                            <span className="text-[#5C4B47]">Father's Profession:</span>
                            <span className="font-semibold text-[#1C1412]">{profile.parent_info.father_profession}</span>
                          </div>
                        )}
                        {profile.parent_info.mother_profession && (
                          <div className="flex justify-between py-1 border-b border-neutral-100">
                            <span className="text-[#5C4B47]">Mother's Profession:</span>
                            <span className="font-semibold text-[#1C1412]">{profile.parent_info.mother_profession}</span>
                          </div>
                        )}
                        {profile.parent_info.family_values && (
                          <div className="flex justify-between py-1 border-b border-neutral-100">
                            <span className="text-[#5C4B47]">Family Values:</span>
                            <span className="font-semibold text-[#1C1412]">{profile.parent_info.family_values}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Horoscope Details (if available) */}
                  {profile.horoscope && (
                    <div className="bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-sm space-y-3.5">
                      <h3 className="font-serif text-base font-bold text-[#1C1412] border-b border-[#EADFCF] pb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4A72C]" />
                        <span>Horoscope / Astrology</span>
                      </h3>
                      <div className="space-y-2.5 text-xs sm:text-sm">
                        {profile.horoscope.zodiac_sign && (
                          <div className="flex justify-between py-1 border-b border-neutral-100">
                            <span className="text-[#5C4B47]">Zodiac Sign (Lagna):</span>
                            <span className="font-semibold text-[#1C1412]">{profile.horoscope.zodiac_sign}</span>
                          </div>
                        )}
                        {profile.horoscope.nakshatra && (
                          <div className="flex justify-between py-1 border-b border-neutral-100">
                            <span className="text-[#5C4B47]">Nakshatra (Nekatha):</span>
                            <span className="font-semibold text-[#1C1412]">{profile.horoscope.nakshatra}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Horoscope Matching:</span>
                          <span className="font-semibold text-[#9B6B15]">Optional / Mutual Compatibility</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* 4. Partner Expectations */}
                {profile.partner_expectations && (
                  <div className="bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-[#1C1412] mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#C86D7B]" />
                      <span>Partner Expectations</span>
                    </h3>
                    <p className="text-sm text-[#5C4B47] font-sans leading-relaxed whitespace-pre-line">
                      {profile.partner_expectations}
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="p-16 text-center text-[#5C4B47]">
                <p>Profile information could not be retrieved.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
