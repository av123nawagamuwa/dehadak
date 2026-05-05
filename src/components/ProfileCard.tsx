import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, User, Ruler, Briefcase, ChevronRight, Lock, BadgeCheck, Crown } from 'lucide-react'

interface ProfileCardProps {
  name: string
  age: number
  location: string
  religion: string
  ethnicity: string
  height: string
  profession: string
  image: string
  verified?: boolean
  premium?: boolean
  privacyMode?: boolean
}

export default function ProfileCard({
  name,
  age,
  location,
  religion,
  ethnicity,
  height,
  profession,
  image,
  verified = true,
  premium = false,
  privacyMode = true,
}: ProfileCardProps) {
  const { t } = useTranslation()
  const [imgError, setImgError] = useState(false)

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-light-border">
      {/* Photo Area */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-b from-gold/10 to-rose-100/50">
        {!imgError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-20 h-20 text-light-border" />
          </div>
        )}

        {/* Privacy Overlay */}
        {privacyMode && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <Lock className="w-8 h-8 text-gold mb-2" />
            <p className="text-sm font-medium text-foreground text-center px-4">
              {t('profileCard.photoVisibleAfterInterest')}
            </p>
          </div>
        )}

        {/* Badges */}
        {premium && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold text-dark-bg text-xs font-semibold shadow-md">
            <Crown className="w-3 h-3" />
            {t('profileCard.premium')}
          </div>
        )}
        {verified && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
            <BadgeCheck className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {age} {t('profileCard.years')} • {location}
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="text-sm text-muted-foreground">{religion}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="text-sm text-muted-foreground">{ethnicity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="text-sm text-muted-foreground">{height}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="text-sm text-muted-foreground">{profession}</span>
          </div>
        </div>

        <button className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-dark transition-colors group/btn">
          {t('profileCard.viewDetails')}
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}
