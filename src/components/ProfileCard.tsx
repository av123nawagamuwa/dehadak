import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  MapPin,
  User,
  Ruler,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Lock,
  BadgeCheck,
  Crown,
  Heart,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'

interface ProfileCardProps {
  id?: string | number
  name: string
  age: number
  location: string
  religion: string
  ethnicity?: string
  height?: string
  profession: string
  education?: string
  gender?: string
  image: string
  verified?: boolean
  premium?: boolean
  privacyMode?: boolean
  interestStatus?: 'idle' | 'sending' | 'pending' | 'accepted' | 'declined'
  onSendInterest?: () => void
  onViewProfile?: (id: string | number) => void
}

export default function ProfileCard({
  id,
  name,
  age,
  location,
  religion,
  ethnicity,
  height,
  profession,
  education,
  gender,
  image,
  verified = true,
  premium = false,
  privacyMode = false,
  interestStatus = 'idle',
  onSendInterest,
  onViewProfile,
}: ProfileCardProps) {
  const { t } = useTranslation()
  const [imgError, setImgError] = useState(false)
  const [localStatus, setLocalStatus] = useState<'idle' | 'sending' | 'pending' | 'accepted' | 'declined'>(
    interestStatus
  )

  useEffect(() => {
    setLocalStatus(interestStatus)
  }, [interestStatus])

  // Smart fallback Sri Lankan profile portraits based on gender
  const idNum = typeof id === 'number' ? id : parseInt(String(id || '1'), 10) || 1
  const isMale = String(gender || '').toLowerCase() === 'male' || String(gender || '').toLowerCase() === 'groom'
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
  const finalImage = !imgError && image && image.trim() !== '' ? image : fallbackPortrait

  const currentStatus = onSendInterest ? interestStatus : localStatus

  const interestLabel =
    currentStatus === 'pending'
      ? 'Interest Sent'
      : currentStatus === 'accepted'
        ? 'Connected'
        : currentStatus === 'declined'
          ? 'Declined'
          : currentStatus === 'sending'
            ? 'Sending...'
            : 'Send Interest'

  const profileUrl = id ? `/search?profileId=${id}` : '/search'

  const handleInterestClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onSendInterest) {
      onSendInterest()
      return
    }

    const token = localStorage.getItem('dehadak_auth')
    if (!token) {
      window.dispatchEvent(
        new CustomEvent('open-auth-prompt', {
          detail: { memberName: name, profileId: id },
        })
      )
      return
    }

    if (localStatus !== 'idle') return

    setLocalStatus('sending')
    try {
      const response = await fetch(`${API_BASE_URL}/api/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: id }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401) {
        localStorage.removeItem('dehadak_auth')
        window.dispatchEvent(
          new CustomEvent('open-auth-prompt', {
            detail: { memberName: name, profileId: id },
          })
        )
        setLocalStatus('idle')
        return
      }

      if (response.ok || response.status === 409) {
        setLocalStatus((data.status || 'pending') as any)
      } else {
        setLocalStatus('idle')
      }
    } catch {
      setLocalStatus('idle')
    }
  }

  return (
    <div className="group bg-[#FFFFFF] rounded-3xl shadow-card hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 overflow-hidden border border-[#EEE6D8] h-full flex flex-col justify-between">
      {/* Profile Photo Area */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-b from-[#FAF7F0] to-[#EEE6D8]">
        <img
          src={finalImage}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={() => setImgError(true)}
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Privacy Lock Shield */}
        {privacyMode && (
          <div className="absolute inset-0 bg-[#241A17]/70 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center mb-2 shadow-gold">
              <Lock className="w-6 h-6 text-[#F3D77A]" />
            </div>
            <p className="text-xs font-semibold text-[#FAF7F0]">
              {t('profileCard.photoVisibleAfterInterest')}
            </p>
          </div>
        )}

        {/* Badges Top Left & Right */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          {premium && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] text-[11px] font-bold shadow-md">
              <Crown className="w-3 h-3 text-[#241A17]" />
              {t('profileCard.premium')}
            </span>
          )}
        </div>

        {verified && (
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10B981] text-white text-[11px] font-semibold shadow-md backdrop-blur-sm">
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>Verified</span>
          </div>
        )}

        {/* Name & Quick Age/Location on Image Bottom */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="font-serif text-xl font-bold tracking-tight drop-shadow-sm flex items-center gap-1.5">
            {name}
            {verified && <BadgeCheck className="w-4 h-4 text-[#F3D77A] inline-block shrink-0" />}
          </h3>
          <p className="text-xs text-white/90 font-medium drop-shadow-sm">
            {age} {t('profileCard.years')} • {location || 'Sri Lanka'}
          </p>
        </div>
      </div>

      {/* Profile Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Attributes Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs text-[#241A17]/80">
          <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-2 rounded-xl border border-[#EEE6D8]">
            <User className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
            <span className="truncate font-medium">{religion || 'Buddhist'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-2 rounded-xl border border-[#EEE6D8]">
            <MapPin className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
            <span className="truncate font-medium">{ethnicity || 'Sinhalese'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-2 rounded-xl border border-[#EEE6D8]">
            <Briefcase className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
            <span className="truncate font-medium">{profession || 'Professional'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-2 rounded-xl border border-[#EEE6D8]">
            {height ? (
              <>
                <Ruler className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
                <span className="truncate font-medium">{height}</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
                <span className="truncate font-medium">{education || 'Graduate'}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1 border-t border-[#EEE6D8]">
          {onViewProfile && id ? (
            <button
              type="button"
              onClick={() => onViewProfile(id)}
              className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#996F16] hover:text-[#D4A72C] transition-colors py-1 group/btn cursor-pointer"
            >
              <span>{t('profileCard.viewDetails')}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link
              to={profileUrl}
              className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#996F16] hover:text-[#D4A72C] transition-colors py-1 group/btn"
            >
              <span>{t('profileCard.viewDetails')}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}

          <button
            onClick={handleInterestClick}
            disabled={currentStatus !== 'idle'}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              currentStatus === 'idle'
                ? 'btn-gold shadow-sm active:scale-95'
                : 'bg-[#FAF7F0] text-[#241A17]/60 border border-[#EEE6D8] cursor-not-allowed'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                currentStatus === 'accepted' ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            <span>{interestLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
