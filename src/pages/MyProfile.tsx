import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import {
  BadgeCheck,
  Briefcase,
  Heart,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Shield,
  User,
  Calendar,
  Edit3,
  Sparkles,
  Crown,
  Moon,
  GraduationCap,
  FileText,
  Camera,
  CheckCircle2,
  Users,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'
import EditProfileModal from '@/components/EditProfileModal'

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

type ProfileResponse = {
  id: number
  first_name: string
  last_name: string
  display_format: string
  gender: string
  birth_year: string
  birth_month: string
  birth_day: string
  religion: string
  ethnicity: string
  height: string
  civil_status: string
  country: string
  district: string
  city: string
  profession: string
  education: string
  drinking: string
  smoking: string
  food: string
  description: string
  plan: string
  created_at: string
  phone?: string
  email?: string
  horoscope_required?: boolean
  birth_time?: string
  birth_city?: string
  adId?: string
  parent_info?: {
    father_religion?: string
    father_ethnicity?: string
    father_caste?: string
    father_country?: string
    father_profession?: string
    father_info?: string
    mother_religion?: string
    mother_ethnicity?: string
    mother_caste?: string
    mother_country?: string
    mother_profession?: string
    mother_info?: string
  } | null
  horoscope?: {
    birth_year?: string
    birth_month?: string
    birth_day?: string
    birth_time?: string
    birth_country?: string
    birth_city?: string
    pdf_url?: string
    privacy?: boolean
  } | null
  photos?: Array<any>
}

function ProfileDetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#EADFCF] bg-[#FAF6F0] p-4 transition-all hover:border-[#E5A93C]/50">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E5A93C]/15 text-[#E5A93C]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#1C1412]/60">{label}</p>
        <p className="text-sm font-semibold text-[#1C1412] truncate">{value || 'Not provided'}</p>
      </div>
    </div>
  )
}

export default function MyProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const loadProfile = async () => {
    const token = localStorage.getItem('dehadak_auth')
    if (!token) {
      navigate('/login', { state: { from: '/profile' } })
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          localStorage.removeItem('dehadak_auth')
          navigate('/login', { replace: true, state: { from: '/profile' } })
          return
        }

        setError(data.error || 'Unable to load your profile')
        return
      }

      setProfile(data)
    } catch {
      setError('Unable to load your profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E5A93C] border-t-transparent" />
          <p className="text-sm font-semibold text-[#1C1412]/70">Loading your verified profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] pt-32 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl border border-[#EADFCF] bg-white p-8 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/40 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-[#E5A93C]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1C1412]">No Profile Found</h1>
          <p className="mt-2 text-sm text-[#1C1412]/70">
            {error || 'Please register or create your profile to view your matrimonial dashboard.'}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-register-modal'))}
              className="btn-gold px-6 py-3 rounded-2xl font-bold text-sm"
            >
              Create Free Profile
            </button>
            <Link
              to="/login"
              className="rounded-2xl border border-gray-300 px-6 py-3 font-semibold text-sm text-[#1C1412] hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Verified Member'
  const age = profile.birth_year ? new Date().getFullYear() - Number(profile.birth_year) : null
  
  // Format clean location without repeating country
  let cleanLocation = 'Sri Lanka'
  if (profile.country && profile.country !== 'Sri Lanka') {
    cleanLocation = profile.city && profile.city !== profile.country
      ? `${profile.city}, ${profile.country}`
      : profile.country
  } else if (profile.district && profile.district !== 'Overseas') {
    cleanLocation = `${profile.district}, Sri Lanka`
  }

  const rawPhoto = profile.photos?.[0]?.url || profile.photos?.[0]
  const cleanedPhotoPath = cleanPhotoUrl(rawPhoto)
  const primaryPhoto = cleanedPhotoPath
    ? (cleanedPhotoPath.startsWith('http') ? cleanedPhotoPath : `${API_BASE_URL}${cleanedPhotoPath}`)
    : ''

  const idNum = typeof profile.id === 'number' ? profile.id : parseInt(String(profile.id || '1'), 10) || 1
  const isMale = String(profile.gender || '').toLowerCase() === 'male' || String(profile.gender || '').toLowerCase() === 'groom'
  const malePortraits = ['/profile-male-1.jpg', '/profile-male-2.jpg', '/profile-male-3.jpg']
  const femalePortraits = ['/profile-female-1.jpg', '/profile-female-2.jpg', '/profile-female-3.jpg']
  const defaultPortraits = isMale ? malePortraits : femalePortraits
  const fallbackPortrait = defaultPortraits[Math.abs(idNum) % defaultPortraits.length]
  const displayPhoto = primaryPhoto || fallbackPortrait

  const horoscopeFileUrl = profile.horoscope?.pdf_url
    ? (profile.horoscope.pdf_url.startsWith('http') ? profile.horoscope.pdf_url : `${API_BASE_URL}${profile.horoscope.pdf_url}`)
    : ''

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-xs font-bold uppercase tracking-wider text-[#9B6B15] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>My Matrimonial Profile</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1412] tracking-tight">
              {fullName}
            </h1>
            <p className="mt-1 text-sm text-[#1C1412]/70">
              Account ID: <span className="font-bold text-[#1C1412]">{profile.adId || `DH-${profile.id + 1000000000}`}</span> • Verified Member
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="btn-gold px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-gold hover:shadow-gold-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Details & Right Sidebars */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Left Column (8 cols): Primary Profile Card & Information */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Primary Profile Card */}
            <div className="overflow-hidden rounded-3xl border border-[#EADFCF] bg-white shadow-card">
              
              {/* Photo & Hero Banner Area */}
              <div className="relative h-64 sm:h-72 bg-gradient-to-br from-[#1C1412] via-[#281D1A] to-[#1C1412] p-6 flex items-end">
                <img
                  src={displayPhoto}
                  alt={fullName}
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#F7D878] to-[#E5A93C] text-[#1C1412] text-xs font-bold shadow-md">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{profile.plan ? profile.plan.toUpperCase() : 'STANDARD'}</span>
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>Verified Profile</span>
                  </div>
                </div>

                {/* Name & Quick Info on Banner */}
                <div className="relative z-10 text-white">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold drop-shadow-md">
                    {fullName}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 font-medium drop-shadow-sm mt-0.5">
                    {age ? `${age} years` : ''} {profile.gender ? `• ${profile.gender === 'male' ? 'Groom' : 'Bride'}` : ''} • {profile.civil_status || 'Never Married'} • {cleanLocation}
                  </p>
                </div>
              </div>

              {/* Profile Attributes Grid */}
              <div className="p-6 sm:p-8">
                <h3 className="font-serif text-lg font-bold text-[#1C1412] mb-4">
                  Profile Details & Compatibility
                </h3>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <ProfileDetailCard icon={MapPin} label="Location" value={cleanLocation} />
                  <ProfileDetailCard icon={Heart} label="Marital Status" value={profile.civil_status || 'Never Married'} />
                  <ProfileDetailCard icon={Ruler} label="Height" value={profile.height || "5'6\""} />
                  <ProfileDetailCard icon={Briefcase} label="Profession" value={profile.profession || 'Professional'} />
                  <ProfileDetailCard icon={GraduationCap} label="Education" value={profile.education || 'Graduate'} />
                  <ProfileDetailCard icon={Users} label="Religion" value={profile.religion || 'Buddhist'} />
                  <ProfileDetailCard icon={User} label="Caste / Sect" value={profile.ethnicity || 'Not specified'} />
                  <ProfileDetailCard icon={Calendar} label="Date of Birth" value={[profile.birth_day, profile.birth_month, profile.birth_year].filter(Boolean).join('/') || 'Not provided'} />
                  <ProfileDetailCard icon={Phone} label="Mobile Phone" value={profile.phone || 'Not provided'} />
                  <ProfileDetailCard icon={Mail} label="Email Address" value={profile.email || 'Not provided'} />
                </div>
              </div>
            </div>

            {/* About Myself Card */}
            <div className="rounded-3xl border border-[#EADFCF] bg-white p-6 sm:p-8 shadow-card">
              <h3 className="font-serif text-lg font-bold text-[#1C1412] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E5A93C]" />
                <span>About Myself & Partner Expectations</span>
              </h3>
              <p className="text-sm text-[#1C1412]/80 leading-relaxed whitespace-pre-line">
                {profile.description || 'No description provided yet. Click "Edit Profile" to tell potential matches about your background and preferences.'}
              </p>
            </div>

          </div>

          {/* Right Column (4 cols): Horoscope & Photos */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Horoscope & Astrology Card */}
            <div className="rounded-3xl border border-[#E5A93C]/35 bg-white p-6 shadow-card relative overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#F7D878] to-[#E5A93C] absolute top-0 left-0 right-0" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-[#E5A93C]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1C1412]">
                    Astrology & Horoscope
                  </h3>
                  <p className="text-xs text-[#1C1412]/60 font-medium">
                    Porondam Compatibility
                  </p>
                </div>
              </div>

              {profile.horoscope_required ? (
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-between">
                    <span className="text-[#1C1412]/70 font-medium">Matching Required:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Enabled
                    </span>
                  </div>

                  {profile.birth_time && (
                    <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-between">
                      <span className="text-[#1C1412]/70 font-medium">Birth Time:</span>
                      <span className="font-bold text-[#1C1412]">{profile.birth_time}</span>
                    </div>
                  )}

                  {profile.birth_city && (
                    <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-between">
                      <span className="text-[#1C1412]/70 font-medium">Birth City:</span>
                      <span className="font-bold text-[#1C1412]">{profile.birth_city}</span>
                    </div>
                  )}

                  {horoscopeFileUrl ? (
                    <a
                      href={horoscopeFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full py-2.5 rounded-xl bg-[#E5A93C]/15 hover:bg-[#E5A93C]/25 text-[#9B6B15] text-xs font-bold flex items-center justify-center gap-2 border border-[#E5A93C]/40 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Horoscope Chart</span>
                    </a>
                  ) : (
                    <p className="text-xs text-gray-500 italic mt-1">
                      No horoscope document uploaded. Click Edit Profile to add one.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] text-center">
                  <p className="text-xs text-[#1C1412]/70">
                    Horoscope matching is currently not required. You can enable it anytime in edit settings.
                  </p>
                </div>
              )}
            </div>

            {/* Profile Photos Card */}
            <div className="rounded-3xl border border-[#EADFCF] bg-white p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-base font-bold text-[#1C1412] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#E5A93C]" />
                  <span>Profile Photos</span>
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-bold text-[#E5A93C] hover:underline"
                >
                  Change Photo
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#EADFCF] relative group">
                <img
                  src={displayPhoto}
                  alt={fullName}
                  className="w-full h-52 object-cover"
                />
                {!primaryPhoto && (
                  <div className="p-3 bg-[#FAF6F0] border-t border-[#EADFCF] flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Default Avatar</span>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-[#E5A93C] font-bold hover:underline flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Real Photo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={(updated) => setProfile(updated)}
      />

    </div>
  )
}