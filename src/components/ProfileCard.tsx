import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  Crown,
  User,
  Ruler,
  ChevronRight,
  Lock,
} from 'lucide-react'
import { getGenderAvatar } from '@/utils/avatar'
import { API_BASE_URL } from '@/config'
import PackageBadge from './PackageBadge'

export interface PreferenceMatchCriterion {
  criterion: string
  name: string
  weight: number
  earnedPoints: number
  status: 'met' | 'unmet' | 'not_provided' | 'no_restriction'
  label: string
}

export interface PreferenceMatchData {
  score: number | null
  is_locked?: boolean
  message?: string
  isPartialData?: boolean
  evaluatedCount?: number
  totalCriteria?: number
  label?: string
  explanation?: string
  breakdown?: PreferenceMatchCriterion[]
}

interface ProfileCardProps {
  id?: string | number
  name: string
  age: number
  location: string
  religion: string
  ethnicity?: string
  caste?: string
  height?: string
  profession: string
  education?: string
  gender?: string
  image: string
  verified?: boolean
  premium?: boolean
  packageCode?: string
  packageName?: string
  privacyMode?: boolean
  interestStatus?: 'idle' | 'sending' | 'pending' | 'accepted' | 'declined'
  preferenceMatch?: PreferenceMatchData | null
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
  caste,
  height,
  profession,
  education,
  gender,
  image,
  verified = false,
  premium = false,
  packageCode,
  packageName,
  privacyMode = false,
  interestStatus = 'idle',
  preferenceMatch,
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

  // Smart fallback official Sri Lankan avatars based on gender
  const fallbackPortrait = getGenderAvatar(gender)
  const finalImage = !imgError && image && image.trim() !== '' ? image : fallbackPortrait
  const cardImage = privacyMode ? fallbackPortrait : finalImage

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

  const navigate = useNavigate()
  const profileUrl = id ? `/search?profileId=${id}` : '/search'

  const handlePhotoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onViewProfile && id) {
      onViewProfile(id)
    } else if (id) {
      navigate(profileUrl)
    }
  }

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

  const isPlatinum = (packageCode || '').toUpperCase() === 'PLATINUM' || (packageCode || '').toUpperCase() === 'ROYAL_PLATINUM'

  return (
    <div className={`group bg-[#FFFFFF] rounded-3xl shadow-card hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 overflow-hidden border h-full flex flex-col justify-between relative ${
      isPlatinum 
        ? 'border-amber-400/90 shadow-md ring-2 ring-amber-400/30' 
        : 'border-[#EEE6D8]'
    }`}>
      {/* Profile Photo Area */}
      <div
        onClick={handlePhotoClick}
        className="relative h-72 overflow-hidden bg-gradient-to-b from-[#FAF7F0] to-[#EEE6D8] cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handlePhotoClick(e as any)
          }
        }}
        title={`View ${name}'s profile`}
      >
        <img
          src={cardImage}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={() => setImgError(true)}
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Badges Top Left & Right */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 flex-wrap max-w-[75%]">
          {packageCode ? (
            <PackageBadge code={packageCode} name={packageName} size="sm" />
          ) : premium ? (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] text-[11px] font-bold shadow-md">
              <Crown className="w-3 h-3 text-[#241A17]" />
              {t('profileCard.premium')}
            </span>
          ) : null}
          {isPlatinum && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
              Top Featured
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
            <span className="truncate font-medium capitalize">
              {caste && caste !== 'prefer_not_to_say' && caste !== 'not_applicable'
                ? (caste === 'other' ? 'Other' : caste.replace('_', ' '))
                : (ethnicity || 'Sinhalese')}
            </span>
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

        {/* Preference Match Section (Only for registered & logged-in users with match data) */}
        {preferenceMatch && (
          preferenceMatch.is_locked || preferenceMatch.score === null ? (
            <div className="bg-[#FAF7F0] rounded-2xl p-2.5 border border-[#EADFCF] space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1412]">
                  <Lock className="w-3.5 h-3.5 text-[#D4A72C]" />
                  <span>Match % Locked</span>
                </div>
                <Link to="/pricing" className="text-[10px] font-bold text-[#996F16] hover:text-[#D4A72C] hover:underline">
                  Unlock
                </Link>
              </div>
              <p className="text-[10px] text-[#5C4B47] leading-tight">
                {preferenceMatch.message || 'Upgrade to Silver Match or above to view compatibility.'}
              </p>
            </div>
          ) : (
            <div className="bg-[#FAF7F0] rounded-2xl p-3 border border-[#EADFCF] space-y-2">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#D4A72C] fill-[#D4A72C]" />
                <span className="text-xs font-bold text-[#1C1412]">
                  {preferenceMatch.score}% Preference match
                </span>
              </div>

              {/* Slim gold progress bar */}
              <div className="w-full bg-[#EADFCF]/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#D4A72C] to-[#E5A93C] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(preferenceMatch.score, 0), 100)}%` }}
                />
              </div>

              {preferenceMatch.isPartialData && (
                <p className="text-[10px] text-[#5C4B47] font-medium">
                  Partial data ({preferenceMatch.evaluatedCount} of {preferenceMatch.totalCriteria} evaluated)
                </p>
              )}
            </div>
          )
        )}

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
