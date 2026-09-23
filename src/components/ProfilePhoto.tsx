import React, { useState } from 'react'
import { Lock, Eye, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL } from '@/config'
import { getGenderAvatar } from '@/utils/avatar'

interface ProfilePhotoProps {
  photoUrl?: string | null
  gender?: string | null
  name?: string
  isPrivate?: boolean
  hasAccess?: boolean
  accessStatus?: 'none' | 'pending' | 'approved' | 'rejected' | string
  profileId?: string | number
  className?: string
  aspectRatio?: string
  onRequestAccessSuccess?: () => void
}

export default function ProfilePhoto({
  photoUrl,
  gender,
  name,
  isPrivate = false,
  hasAccess = true,
  accessStatus = 'none',
  profileId,
  className = 'w-full h-full',
  aspectRatio = 'aspect-[4/5]',
  onRequestAccessSuccess,
}: ProfilePhotoProps) {
  const { t } = useTranslation()
  const [imgError, setImgError] = useState(false)
  const [reqLoading, setReqLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(accessStatus)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const isMale = String(gender || '').toLowerCase() === 'male' || String(gender || '').toLowerCase() === 'groom'
  const isFemale = String(gender || '').toLowerCase() === 'female' || String(gender || '').toLowerCase() === 'bride'
  const avatarSrc = getGenderAvatar(gender)

  const handleRequestAccess = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const auth = localStorage.getItem('dehadak_auth')
    if (!auth) {
      window.dispatchEvent(
        new CustomEvent('open-auth-prompt', {
          detail: { memberName: name || 'Member', profileId },
        })
      )
      return
    }

    if (!profileId) return

    setReqLoading(true)
    try {
      let token = auth
      try {
        const parsed = JSON.parse(auth)
        if (parsed?.token) token = parsed.token
      } catch {
        // Raw token string
      }
      const res = await fetch(`${API_BASE_URL}/api/profile/${profileId}/photo-access`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (res.ok) {
        setCurrentStatus('pending')
        setFeedbackMsg(t('photo.requestSent') || 'Request sent')
        if (onRequestAccessSuccess) onRequestAccessSuccess()
      } else {
        setFeedbackMsg(data.error || 'Failed to send request')
      }
    } catch {
      setFeedbackMsg('Network error')
    } finally {
      setReqLoading(false)
    }
  }

  // Gender-based Tasteful Avatar
  const renderSilhouette = () => {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#F5EFE6] to-[#E8DEC8] p-4 text-[#241A17]">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#D4A72C]/40 shadow-md mb-2 bg-[#FAF7F0] flex items-center justify-center">
          <img
            src={avatarSrc}
            alt={isMale ? 'Groom Avatar' : isFemale ? 'Bride Avatar' : 'Member Avatar'}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C6B1B]">
          {isMale ? (t('common.groom') || 'Groom') : isFemale ? (t('common.bride') || 'Bride') : (t('common.member') || 'Member')}
        </span>
      </div>
    )
  }

  // Case 1: Photo is Private AND viewer has NO approved access
  if (isPrivate && !hasAccess) {
    return (
      <div className={`relative overflow-hidden ${aspectRatio} ${className} bg-[#FAF7F0]`}>
        {/* Silhouette background */}
        {renderSilhouette()}

        {/* Private Photo Blur Shield Overlay */}
        <div className="absolute inset-0 bg-[#1C1412]/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-10">
          <div className="w-11 h-11 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/50 flex items-center justify-center mb-2 text-[#F3D77A] shadow-lg">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#FAF7F0] tracking-wide mb-1">
            {t('photo.photoPrivate') || 'Photo Private'}
          </span>
          <p className="text-[11px] text-[#FAF7F0]/70 max-w-[190px] leading-tight mb-3">
            {t('photo.permissionRequired') || 'Visible upon approved photo access request'}
          </p>

          {currentStatus === 'pending' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('photo.requestPending') || 'Request Pending'}</span>
            </div>
          ) : (
            <button
              onClick={handleRequestAccess}
              disabled={reqLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4A72C] to-[#E5A93C] text-[#1C1412] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{reqLoading ? 'Sending...' : (t('photo.requestAccess') || 'Request Access')}</span>
            </button>
          )}

          {feedbackMsg && (
            <span className="text-[10px] text-[#F3D77A] mt-1.5 font-medium">{feedbackMsg}</span>
          )}
        </div>
      </div>
    )
  }

  // Case 2: Photo URL is available and loaded
  if (photoUrl && !imgError) {
    const fullPhotoUrl = photoUrl.startsWith('http') ? photoUrl : `${API_BASE_URL}${photoUrl}`
    return (
      <div className={`relative overflow-hidden ${aspectRatio} ${className} bg-[#FAF7F0]`}>
        <img
          src={fullPhotoUrl}
          alt={name || 'Profile photo'}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  // Case 3: Photo absent or failed to load (clean placeholder without claiming private)
  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className} bg-[#FAF7F0]`}>
      {renderSilhouette()}
    </div>
  )
}
