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
  Loader2,
  Sparkles,
  Compass,
  Check,
  Minus,
  SlidersHorizontal,
  Phone,
  Eye,
  Lock,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'
import { getGenderAvatar } from '@/utils/avatar'
import { cleanPhotoUrl } from '@/utils/imageUrl'
import MatchingPreferencesModal from './MatchingPreferencesModal'
import PackageBadge from './PackageBadge'
import QuotaUpgradeModal from './QuotaUpgradeModal'

interface ProfileDetailModalProps {
  profileId: number | string | null
  isOpen: boolean
  onClose: () => void
  onSendInterest?: (profile: any) => void
  interestStatus?: 'idle' | 'sending' | 'pending' | 'accepted' | 'declined'
}

function isFilledValue(val?: any): boolean {
  if (val === undefined || val === null) return false
  const s = String(val).trim().toLowerCase()
  if (!s) return false
  if (
    s === 'prefer not to say' ||
    s === 'prefer_not_to_say' ||
    s === 'not applicable' ||
    s === 'not_applicable' ||
    s === 'not specified' ||
    s.startsWith('select')
  ) {
    return false
  }
  return true
}

export function formatCandidatePrivacyName(firstName?: string, lastName?: string, fallbackName?: string): string {
  if (firstName) {
    const cleanFirst = firstName.trim()
    const cleanLast = (lastName || '').trim()
    if (cleanLast) {
      const lastInitial = cleanLast.replace(/\.+$/, '').charAt(0).toUpperCase()
      return `${cleanFirst} ${lastInitial}.`
    }
    return cleanFirst
  }
  if (fallbackName) {
    const parts = fallbackName.trim().split(/\s+/)
    if (parts.length > 1) {
      const lastInitial = parts[parts.length - 1].replace(/\.+$/, '').charAt(0).toUpperCase()
      return `${parts[0]} ${lastInitial}.`
    }
    return parts[0]
  }
  return 'Candidate'
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
  const [imgError, setImgError] = useState(false)
  const [localInterestStatus, setLocalInterestStatus] = useState(interestStatus)
  const [prefModalOpen, setPrefModalOpen] = useState(false)
  const [revealingContact, setRevealingContact] = useState(false)
  const [upgradeModal, setUpgradeModal] = useState<{
    isOpen: boolean
    feature?: 'SEND_INTEREST' | 'ACCEPT_INTEREST' | 'MESSAGING_CONNECTION' | 'PREFERENCE_MATCH' | 'CONTACT_REVEAL'
    packageCode?: string
    message?: string
  }>({ isOpen: false })

  const handleRevealContact = async () => {
    if (!profile?.id) return
    const token = localStorage.getItem('dehadak_auth')
    if (!token) {
      const memberName = formatCandidatePrivacyName(profile.first_name, profile.last_name, profile.name)
      window.dispatchEvent(
        new CustomEvent('dehadak:open-auth-prompt', {
          detail: { memberName, profileId: profile.id },
        })
      )
      return
    }

    setRevealingContact(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/profiles/${profile.id}/reveal-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (res.ok) {
        setProfile((prev: any) => ({
          ...prev,
          phone: data.phone,
          phone_revealed: true,
        }))
      } else if (res.status === 403) {
        setUpgradeModal({
          isOpen: true,
          feature: 'CONTACT_REVEAL',
          packageCode: 'ROYAL_PLATINUM',
          message: data.error || 'Direct phone number access requires an active Royal Platinum subscription.',
        })
      } else {
        alert(data.error || 'Unable to access contact number')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setRevealingContact(false)
    }
  }

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
      const token = localStorage.getItem('dehadak_auth')
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const res = await fetch(`${API_BASE_URL}/api/search/${id}`, { headers })
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
        const memberName = formatCandidatePrivacyName(profile.first_name, profile.last_name, profile.name)
        window.dispatchEvent(
          new CustomEvent('dehadak:open-auth-prompt', {
            detail: { memberName, profileId: profile.id },
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

  // Official avatars based on gender
  const fallbackPortrait = getGenderAvatar(profile?.gender)

  // Single profile photo handling
  const isPrivate = Boolean(profile?.photo_private || profile?.photo_privacy === 0)
  const hasAccess = Boolean(profile?.has_photo_access !== false)
  const rawPhoto = profile?.photos && Array.isArray(profile.photos) && profile.photos.length > 0
    ? (profile.photos[0]?.url || profile.photos[0])
    : (profile?.avatar_url || '')

  const cleanedPhoto = cleanPhotoUrl(rawPhoto)
  const photoVisible = !isPrivate || hasAccess
  const displayPhoto = (photoVisible && cleanedPhoto && !imgError) ? cleanedPhoto : fallbackPortrait

  const displayName = formatCandidatePrivacyName(profile?.first_name, profile?.last_name, profile?.name)

  const displayAge =
    profile?.age ||
    (profile?.birth_year ? new Date().getFullYear() - parseInt(String(profile.birth_year), 10) : null)

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
    <>
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
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#F5C768] font-mono border border-[#E5A93C]/30">
                    {profile.adId}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-4 text-[#D4A72C]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="font-serif text-sm font-medium text-[#5C4B47]">Loading complete profile details...</p>
              </div>
            ) : profile ? (
              <div className="overflow-y-auto p-6 space-y-6">
                
                {/* 1. Header Hero Card */}
                <div className="bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Single Profile Photo - Clean & Subtle Presentation */}
                    <div className="md:col-span-5 flex flex-col items-center">
                      <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-[#D4A72C]/40 shadow-card group bg-[#FAF7F0]">
                        <img
                          src={displayPhoto}
                          alt={displayName}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            isPrivate && !hasAccess ? 'blur-md filter scale-110' : ''
                          }`}
                          onError={() => setImgError(true)}
                        />
                        
                        {/* Verified Profile Badge */}
                        {profile.verified && (
                          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold shadow-md backdrop-blur-xs">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified Profile</span>
                          </div>
                        )}

                        {/* Privacy Protection Overlay */}
                        {isPrivate && !hasAccess && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                            <Lock className="w-7 h-7 text-amber-300 mb-1" />
                            <span className="text-xs font-bold">Photo Protected</span>
                            <span className="text-[10px] text-white/80 mt-0.5">Mutual interest or request required</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Primary Summary Details & Action CTA */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412] tracking-tight">
                              {displayName}
                            </h2>
                            {profile.package_code && (
                              <PackageBadge code={profile.package_code} name={profile.package_badge} size="sm" />
                            )}
                          </div>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E5A93C]/15 text-[#9B6B15] border border-[#E5A93C]/30 capitalize">
                            {profile.gender === 'male' ? 'Groom (Male)' : profile.gender === 'female' ? 'Bride (Female)' : (profile.gender || 'Member')}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-[#5C4B47] flex items-center gap-1.5 mb-4">
                          <MapPin className="w-4 h-4 text-[#D4A72C] shrink-0" />
                          <span>{[profile.city || profile.district, profile.country || 'Sri Lanka'].filter(Boolean).join(', ')}</span>
                          {displayAge && (
                            <>
                              <span>•</span>
                              <span>{displayAge} years old</span>
                            </>
                          )}
                        </p>

                        {/* Key Chips */}
                        <div className="grid grid-cols-2 gap-2.5 text-xs font-medium">
                          {isFilledValue(profile.profession) && (
                            <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-[#D4A72C] shrink-0" />
                              <span className="truncate">{profile.profession}</span>
                            </div>
                          )}
                          {isFilledValue(profile.education) && (
                            <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-[#D4A72C] shrink-0" />
                              <span className="truncate">{profile.education}</span>
                            </div>
                          )}
                          {isFilledValue(profile.religion) && (
                            <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center gap-2">
                              <Compass className="w-4 h-4 text-[#D4A72C] shrink-0" />
                              <span className="truncate">{profile.religion}</span>
                            </div>
                          )}
                          {isFilledValue(profile.height) && (
                            <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-[#D4A72C] shrink-0" />
                              <span>{profile.height}</span>
                            </div>
                          )}
                        </div>

                        {/* Contact Number & Access Card */}
                        <div className="mt-3 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center text-[#9B6B15] shrink-0">
                              <Phone className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#1C1412]">Contact Phone Number</span>
                                {profile.phone_revealed ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                    Royal Platinum
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-mono font-bold text-[#1C1412] mt-0.5 tracking-wider">
                                {profile.phone || '+94 •• ••• ••••'}
                              </p>
                            </div>
                          </div>

                          {!profile.phone_revealed ? (
                            <button
                              type="button"
                              onClick={handleRevealContact}
                              disabled={revealingContact}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#1C1412] hover:brightness-105 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {revealingContact ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                              <span>Reveal Phone Number</span>
                            </button>
                          ) : (
                            <a
                              href={`tel:${profile.phone}`}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-all flex items-center justify-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Contact</span>
                            </a>
                          )}
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
                </div>

                {/* Preference Match Panel */}
                {profile.preference_match ? (
                  profile.preference_match.is_locked || profile.preference_match.score === null ? (
                    <div className="bg-gradient-to-br from-[#FAF7F0] to-[#FFFFFF] rounded-3xl p-6 border border-[#EADFCF] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center text-[#9B6B15] shrink-0">
                          <Lock className="w-6 h-6 text-[#D4A72C]" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-bold text-[#1C1412]">
                            Compatibility Match Score Locked
                          </h4>
                          <p className="text-xs text-[#5C4B47] mt-1 max-w-lg leading-relaxed">
                            {profile.preference_match.message || 'Unlock deep astrological and lifestyle compatibility scoring with Silver Match or above.'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUpgradeModal({
                          isOpen: true,
                          feature: 'PREFERENCE_MATCH',
                          packageCode: 'SILVER_MATCH',
                          message: profile.preference_match.message || 'Upgrade to Silver Match or above to view compatibility scoring.',
                        })}
                        className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-xs cursor-pointer"
                      >
                        Upgrade to View Match %
                      </button>
                    </div>
                  ) : (
                  <div className="bg-gradient-to-br from-[#FAF7F0] to-[#FFFFFF] rounded-3xl p-6 border border-[#EADFCF] shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADFCF]/70 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-[#D4A72C] fill-[#D4A72C]" />
                          <h3 className="font-serif text-xl font-bold text-[#1C1412] tracking-tight">
                            Your Preference Match
                          </h3>
                        </div>
                        <p className="text-xs text-[#5C4B47] mt-0.5">
                          {profile.preference_match.explanation}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPrefModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#EADFCF] bg-white text-xs font-bold text-[#1C1412] hover:border-[#E5A93C] hover:text-[#9B6B15] transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span>Edit Preferences</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Circular Progress Indicator */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#EADFCF]/80 shadow-xs">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#FAF0E0"
                              strokeWidth="10"
                              fill="none"
                            />
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#E5A93C"
                              strokeWidth="10"
                              strokeDasharray={2 * Math.PI * 50}
                              strokeDashoffset={
                                2 * Math.PI * 50 * (1 - Math.min(Math.max(profile.preference_match.score, 0), 100) / 100)
                              }
                              strokeLinecap="round"
                              fill="none"
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="font-serif text-3xl font-bold text-[#1C1412]">
                              {profile.preference_match.score}%
                            </span>
                            <span className="text-[10px] font-bold text-[#9B6B15] uppercase tracking-wider">
                              Match Score
                            </span>
                          </div>
                        </div>

                        {profile.preference_match.isPartialData && (
                          <span className="mt-3 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-700">
                            Partial data ({profile.preference_match.evaluatedCount} of {profile.preference_match.totalCriteria} evaluated)
                          </span>
                        )}
                      </div>

                      {/* 4 Compact Rows in Priority Order */}
                      <div className="md:col-span-8 space-y-2.5">
                        {profile.preference_match.breakdown?.map((item: any) => {
                          const isMet = item.status === 'met'
                          const isNoRest = item.status === 'no_restriction'
                          const isUnmet = item.status === 'unmet'
                          const isMissing = item.status === 'not_provided'

                          return (
                            <div
                              key={item.criterion}
                              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EADFCF]/80 text-xs shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                    isMet
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : isNoRest
                                        ? 'bg-[#E5A93C]/20 text-[#9B6B15]'
                                        : isMissing
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-neutral-100 text-neutral-400'
                                  }`}
                                >
                                  {isMet && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  {isNoRest && <Sparkles className="w-3.5 h-3.5" />}
                                  {isMissing && <Minus className="w-3.5 h-3.5 stroke-[3]" />}
                                  {isUnmet && <X className="w-3.5 h-3.5 stroke-[2.5]" />}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[#1C1412]">{item.name}</span>
                                    <span className="text-[10px] text-[#5C4B47]/80">({item.weight}%)</span>
                                  </div>
                                  <p className="text-[11px] text-[#5C4B47] truncate">{item.label}</p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span
                                  className={`font-bold font-mono text-xs ${
                                    item.earnedPoints > 0 ? 'text-[#9B6B15]' : 'text-neutral-400'
                                  }`}
                                >
                                  +{item.earnedPoints} pts
                                </span>
                                <p className="text-[10px] font-medium text-[#5C4B47]">
                                  {isMet
                                    ? 'Met'
                                    : isNoRest
                                      ? 'No restriction'
                                      : isMissing
                                        ? 'Not provided'
                                        : 'Not met'}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  )
                ) : (
                  <div className="bg-[#FAF6F0] rounded-3xl p-5 border border-[#EADFCF] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center text-[#9B6B15] shrink-0">
                        <Heart className="w-5 h-5 fill-[#E5A93C]" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#1C1412]">
                          {localStorage.getItem('dehadak_auth')
                            ? 'Complete your profile to see your matches'
                            : 'Log in or create an account to see your matches'}
                        </h4>
                        <p className="text-xs text-[#5C4B47]">
                          {localStorage.getItem('dehadak_auth')
                            ? 'Add your age, height, religion, and marital status to calculate preference match scores.'
                            : 'Preference matching is available for registered users with completed matrimonial profiles.'}
                        </p>
                      </div>
                    </div>

                    {localStorage.getItem('dehadak_auth') ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = '/my-profile'
                        }}
                        className="btn-gold px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-xs cursor-pointer"
                      >
                        Complete Profile
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('open-register-modal'))
                        }}
                        className="btn-gold px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-xs cursor-pointer"
                      >
                        Sign In / Register
                      </button>
                    )}
                  </div>
                )}

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
                      {isFilledValue(profile.religion) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Religion:</span>
                          <span className="font-semibold text-[#1C1412]">{profile.religion}</span>
                        </div>
                      )}
                      {isFilledValue(profile.caste) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Caste:</span>
                          <span className="font-semibold text-[#1C1412] capitalize">
                            {profile.caste === 'other'
                              ? (profile.caste_other || 'Other')
                              : (profile.caste_name_en || profile.caste.replace('_', ' '))}
                          </span>
                        </div>
                      )}
                      {isFilledValue(profile.civil_status || profile.marital_status) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Marital Status:</span>
                          <span className="font-semibold text-[#1C1412]">{profile.civil_status || profile.marital_status}</span>
                        </div>
                      )}
                      {isFilledValue(profile.height) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Height:</span>
                          <span className="font-semibold text-[#1C1412]">{profile.height}</span>
                        </div>
                      )}
                      {isFilledValue(profile.dietary_habits === 'Other' ? (profile.dietary_habits_other || 'Other') : (profile.dietary_habits || profile.food)) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Dietary Habits:</span>
                          <span className="font-semibold text-[#1C1412]">
                            {profile.dietary_habits === 'Other'
                              ? (profile.dietary_habits_other || 'Other')
                              : (profile.dietary_habits || profile.food)}
                          </span>
                        </div>
                      )}
                      {isFilledValue(profile.drinking_habits || profile.drinking) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Drinking Habits:</span>
                          <span className="font-semibold text-[#1C1412]">
                            {profile.drinking_habits || profile.drinking}
                          </span>
                        </div>
                      )}
                      {isFilledValue(profile.smoking_habits || profile.smoking) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Smoking Habits:</span>
                          <span className="font-semibold text-[#1C1412]">
                            {profile.smoking_habits || profile.smoking}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Career & Education */}
                  <div className="bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-sm space-y-3.5">
                    <h3 className="font-serif text-base font-bold text-[#1C1412] border-b border-[#EADFCF] pb-2">
                      Education & Profession
                    </h3>
                    <div className="space-y-2.5 text-xs sm:text-sm">
                      {isFilledValue(profile.education) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Highest Education:</span>
                          <span className="font-semibold text-[#1C1412]">{profile.education}</span>
                        </div>
                      )}
                      {isFilledValue(profile.profession) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Profession:</span>
                          <span className="font-semibold text-[#1C1412]">{profile.profession}</span>
                        </div>
                      )}
                      {isFilledValue(profile.district || profile.city || profile.work_location) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">District / Location:</span>
                          <span className="font-semibold text-[#1C1412]">{profile.district || profile.city || profile.work_location}</span>
                        </div>
                      )}
                      {isFilledValue(profile.country) && (
                        <div className="flex justify-between py-1 border-b border-neutral-100">
                          <span className="text-[#5C4B47]">Country:</span>
                          <span className="font-semibold text-[#1C1412]">{profile.country}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <span className="text-[#5C4B47]">Location Type:</span>
                        <span className="font-semibold text-[#1C1412]">
                          {profile.country && profile.country !== 'Sri Lanka'
                            ? 'Foreign (Working Abroad)'
                            : 'Local (Living in Sri Lanka)'}
                        </span>
                      </div>
                    </div>
                  </div>

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
    </AnimatePresence>
    <MatchingPreferencesModal
      isOpen={prefModalOpen}
      onClose={() => setPrefModalOpen(false)}
      onSaved={() => {
        if (profileId) {
          fetchProfileDetails(profileId)
        }
      }}
    />
    <QuotaUpgradeModal
      isOpen={upgradeModal.isOpen}
      onClose={() => setUpgradeModal({ isOpen: false })}
      feature={upgradeModal.feature}
      packageCode={upgradeModal.packageCode}
      message={upgradeModal.message}
    />
    </>,
    document.body
  )
}
