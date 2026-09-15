import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Upload,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Heart,
  Moon,
  Sparkles,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'

const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
]

const religions = [
  'Buddhist', 'Hindu', 'Christian', 'Roman Catholic', 'Islam', 'Other'
]

const civilStatuses = [
  'Never Married',
  'Divorced',
  'Widowed',
  'Separated'
]

const educations = [
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate / PhD",
  "Diploma",
  "Professional Qualification",
  "Advanced Level (A/L)",
  "Ordinary Level (O/L)",
  "Other"
]

const professions = [
  "Software & IT",
  "Engineer",
  "Doctor / Medical",
  "Banking & Finance",
  "Teacher / Academic",
  "Business / Entrepreneur",
  "Accountant",
  "Lawyer / Legal",
  "Government Employee",
  "Nurse / Healthcare",
  "Marketing & Sales",
  "Armed Forces / Police",
  "Student",
  "Self-Employed",
  "Other"
]

const zodiacSigns = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Kataka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Thula (Libra)', 'Vrischika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
]

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

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: any
  onProfileUpdated: (updatedProfile: any) => void
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Form State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('male')
  const [civilStatus, setCivilStatus] = useState('Never Married')
  const [age, setAge] = useState('24')
  const [dob, setDob] = useState('2000-01-01')
  const [height, setHeight] = useState("5'6\"")
  const [education, setEducation] = useState("Bachelor's Degree")
  const [caste, setCaste] = useState('')
  const [religion, setReligion] = useState('Buddhist')
  const [district, setDistrict] = useState('Colombo')
  const [occupation, setOccupation] = useState('Software & IT')
  const [locationType, setLocationType] = useState('local')
  const [jobCountry, setJobCountry] = useState('Sri Lanka')

  // Photo
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [publicPhoto, setPublicPhoto] = useState(true)

  // Horoscope
  const [horoscopeRequired, setHoroscopeRequired] = useState(false)
  const [zodiacSign, setZodiacSign] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthCity, setBirthCity] = useState('')
  const [horoscopeFile, setHoroscopeFile] = useState<File | null>(null)
  const [horoscopeFileName, setHoroscopeFileName] = useState('')

  // Bio
  const [description, setDescription] = useState('')

  const photoInputRef = useRef<HTMLInputElement>(null)
  const horoscopeInputRef = useRef<HTMLInputElement>(null)

  // Populate form with existing profile data
  useEffect(() => {
    if (profile && isOpen) {
      setFirstName(profile.first_name || '')
      setLastName(profile.last_name || '')
      setGender(profile.gender || 'male')
      setCivilStatus(profile.civil_status || 'Never Married')
      
      const currentYear = new Date().getFullYear()
      const birthYear = profile.birth_year ? Number(profile.birth_year) : 2000
      setAge(String(currentYear - birthYear))

      const y = profile.birth_year ? String(profile.birth_year).padStart(4, '0') : '2000'
      const m = profile.birth_month ? String(profile.birth_month).padStart(2, '0') : '01'
      const d = profile.birth_day ? String(profile.birth_day).padStart(2, '0') : '01'
      setDob(`${y}-${m}-${d}`)

      setHeight(profile.height || "5'6\"")
      setEducation(profile.education || "Bachelor's Degree")
      setCaste(profile.ethnicity || '')
      setReligion(profile.religion || 'Buddhist')
      setDistrict(profile.district && profile.district !== 'Overseas' && profile.district !== 'Living Abroad' ? profile.district : 'Colombo')
      setOccupation(profile.profession || 'Software & IT')
      
      const isAbroad = profile.country && profile.country !== 'Sri Lanka'
      setLocationType(isAbroad ? 'foreign' : 'local')
      setJobCountry(profile.country || (isAbroad ? profile.city : 'Sri Lanka'))

      // Photo preview
      const idNum = typeof profile.id === 'number' ? profile.id : parseInt(String(profile.id || '1'), 10) || 1
      const isMale = String(profile.gender || '').toLowerCase() === 'male' || String(profile.gender || '').toLowerCase() === 'groom'
      const malePortraits = ['/profile-male-1.jpg', '/profile-male-2.jpg', '/profile-male-3.jpg']
      const femalePortraits = ['/profile-female-1.jpg', '/profile-female-2.jpg', '/profile-female-3.jpg']
      const defaultPortraits = isMale ? malePortraits : femalePortraits
      const fallbackPortrait = defaultPortraits[Math.abs(idNum) % defaultPortraits.length]

      if (profile.photos && profile.photos.length > 0) {
        const rawUrl = cleanPhotoUrl(profile.photos[0]?.url || profile.photos[0])
        if (rawUrl) {
          setPhotoPreview(rawUrl.startsWith('http') ? rawUrl : `${API_BASE_URL}${rawUrl}`)
        } else {
          setPhotoPreview(fallbackPortrait)
        }
      } else {
        setPhotoPreview(fallbackPortrait)
      }
      if (profile.photo_privacy !== undefined && profile.photo_privacy !== null) {
        setPublicPhoto(profile.photo_privacy === 1 || profile.photo_privacy === true)
      } else if (profile.horoscope?.privacy !== undefined) {
        setPublicPhoto(profile.horoscope.privacy !== true)
      } else {
        setPublicPhoto(true)
      }

      // Horoscope
      const hasHoroscope = Boolean(profile.horoscope_required)
      setHoroscopeRequired(hasHoroscope)
      setBirthTime(profile.birth_time || profile.horoscope?.birth_time || '')
      setBirthCity(profile.birth_city || profile.horoscope?.birth_city || '')
      if (profile.horoscope?.pdf_url) {
        setHoroscopeFileName('Existing Horoscope File')
      }

      setDescription(profile.description || '')
      setError('')
      setSuccess(false)
    }
  }, [profile, isOpen])

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDob(val)
    if (val) {
      const bYear = new Date(val).getFullYear()
      const currentYear = new Date().getFullYear()
      if (bYear > 1940 && bYear <= currentYear) {
        setAge(String(currentYear - bYear))
      }
    }
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotoPreview(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHoroscopeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setHoroscopeFile(file)
      setHoroscopeFileName(file.name)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const token = localStorage.getItem('dehadak_auth')
    if (!token) {
      setError('You must be logged in to update your profile.')
      setLoading(false)
      return
    }

    try {
      // 1. Upload new photo if selected
      let uploadedPhotoUrl = cleanPhotoUrl(profile.photos?.[0]?.url || profile.photos?.[0] || '')
      if (photoFile) {
        const photoFormData = new FormData()
        photoFormData.append('photos', photoFile)
        const uploadRes = await fetch(`${API_BASE_URL}/api/profile/photos`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: photoFormData,
        })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          if (uploadData.photos && uploadData.photos.length > 0) {
            uploadedPhotoUrl = cleanPhotoUrl(uploadData.photos[0]?.url || uploadData.photos[0])
          }
        }
      }

      // 2. Upload horoscope if selected
      let horoscopePdfUrl = profile.horoscope?.pdf_url || ''
      if (horoscopeFile) {
        const pdfFormData = new FormData()
        pdfFormData.append('pdf', horoscopeFile)
        const pdfRes = await fetch(`${API_BASE_URL}/api/profile/horoscope-pdf`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: pdfFormData,
        })
        if (pdfRes.ok) {
          const pdfData = await pdfRes.json()
          horoscopePdfUrl = pdfData.pdfUrl || pdfData.url || horoscopePdfUrl
        }
      }

      const birthDateObj = dob ? new Date(dob) : new Date()

      // 3. Send PUT request
      const updateRes = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          displayFormat: 'fullName',
          gender,
          birthYear: String(birthDateObj.getFullYear()),
          birthMonth: String(birthDateObj.getMonth() + 1),
          birthDay: String(birthDateObj.getDate()),
          religion,
          ethnicity: caste || 'Sinhalese',
          height: height || "5'6\"",
          civilStatus: civilStatus || 'Never Married',
          country: locationType === 'foreign' ? (jobCountry || 'Abroad') : 'Sri Lanka',
          district: locationType === 'foreign' ? 'Overseas' : district,
          city: locationType === 'foreign' ? (jobCountry || 'Abroad') : district,
          visaType: locationType === 'foreign' ? 'Work Visa / PR' : 'Citizen',
          education: education || "Bachelor's Degree",
          profession: occupation || 'Software & IT',
          drinking: profile.drinking || 'Never',
          smoking: profile.smoking || 'Never',
          food: profile.food || 'Non-Vegetarian',
          differentlyAbled: false,
          horoscopeRequired,
          birthTime: horoscopeRequired ? birthTime : '',
          birthCountry: locationType === 'foreign' ? jobCountry : 'Sri Lanka',
          birthCity: horoscopeRequired ? birthCity : district,
          description: description || `Hello, my name is ${firstName} ${lastName}.`,
          plan: profile.plan || 'standard',
          horoscopeBirthYear: String(birthDateObj.getFullYear()),
          horoscopeBirthMonth: String(birthDateObj.getMonth() + 1),
          horoscopeBirthDay: String(birthDateObj.getDate()),
          horoscopePdfUrl,
          photoPrivacy: publicPhoto,
          photo_privacy: publicPhoto ? 1 : 0,
          horoscopePrivacy: !publicPhoto,
          photos: uploadedPhotoUrl ? [uploadedPhotoUrl] : [],
        }),
      })

      if (!updateRes.ok) {
        const data = await updateRes.json()
        throw new Error(data.error || 'Failed to update profile.')
      }

      setSuccess(true)

      // Fetch fresh profile data
      const refreshRes = await fetch(`${API_BASE_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (refreshRes.ok) {
        const freshData = await refreshRes.json()
        onProfileUpdated(freshData)
      }

      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'Error updating profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5A93C]/40 z-10 my-auto text-[#1C1412]"
        >
          {/* Top Gold Shimmer Line */}
          <div className="h-1.5 bg-gradient-to-r from-[#F7D878] via-[#E5A93C] to-[#9B6B15]" />

          {/* Header Banner */}
          <div className="bg-[#1C1412] text-[#FAF6F0] p-5 sm:p-6 relative border-b border-[#E5A93C]/25 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E5A93C]/60 shadow-gold bg-[#1C1412] flex items-center justify-center p-0.5 shrink-0">
                <img
                  src="/logo.png"
                  alt="Dehadak Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Edit Profile Details</span>
                  <Sparkles className="w-4 h-4 text-[#F7D878]" />
                </h2>
                <p className="text-xs text-[#F7D878]/90 font-medium mt-0.5">
                  Update your matrimonial account details
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E5A93C] hover:text-[#1C1412] border border-[#E5A93C]/30 flex items-center justify-center text-[#FAF6F0] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="p-5 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto custom-scroll">
            {error && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">Profile updated successfully!</span>
              </div>
            )}

            {/* Row 1: First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  First Name <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                />
              </div>
            </div>

            {/* Row 2: Gender, Marital Status, Age & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Gender <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                >
                  <option value="male">Groom (Male)</option>
                  <option value="female">Bride (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Marital Status <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={civilStatus}
                  onChange={(e) => setCivilStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                >
                  {civilStatuses.map((cs) => (
                    <option key={cs} value={cs}>{cs}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Age <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                />
              </div>
            </div>

            {/* Row 3: Height & Education Qualification (Dropdown) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Height
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 5' 6&quot;"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Education Qualification <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                >
                  {educations.map((ed) => (
                    <option key={ed} value={ed}>{ed}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Caste & Religion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Caste / Sect (Optional)
                </label>
                <input
                  type="text"
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  placeholder="e.g. Govi, Karawa"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Religion <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                >
                  {religions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 5: District & Occupation / Profession (Dropdown) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  District <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Occupation / Profession <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                >
                  {professions.map((prof) => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 6: Location Type & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Job / Residence Location Type
                </label>
                <select
                  value={locationType}
                  onChange={(e) => {
                    const val = e.target.value
                    setLocationType(val)
                    if (val === 'local') setJobCountry('Sri Lanka')
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                >
                  <option value="local">Local (Living in Sri Lanka)</option>
                  <option value="foreign">Foreign (Working Abroad)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Country of Residence
                </label>
                <input
                  type="text"
                  value={jobCountry}
                  onChange={(e) => setJobCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white"
                />
              </div>
            </div>

            {/* Photo Section */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] space-y-3">
              <label className="block text-xs font-bold text-[#1C1412]">
                Profile Photo
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-[#E5A93C] text-xs font-bold text-[#1C1412] flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Upload className="w-4 h-4 text-[#E5A93C]" />
                  <span>Change Photo</span>
                </button>

                {photoPreview && (
                  <div className="flex items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#E5A93C] shadow-sm"
                    />
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Photo
                    </span>
                  </div>
                )}
              </div>

              {/* Public Photo Visibility Switch */}
              <div className="pt-3 border-t border-[#EADFCF]/70 flex items-start justify-between gap-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#E5A93C] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1C1412]">
                      Public Photo Visibility
                    </p>
                    <p className="text-[11px] text-[#1C1412]/65 mt-0.5">
                      Enable to show your photo publicly. If disabled, users must request permission.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={publicPhoto}
                    onChange={(e) => setPublicPhoto(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E5A93C]" />
                </label>
              </div>
            </div>

            {/* Horoscope Section */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E5A93C]/40 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <Moon className="w-5 h-5 text-[#E5A93C] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#1C1412]">
                      Horoscope Matching Required
                    </h3>
                    <p className="text-[11px] text-[#1C1412]/70 mt-0.5">
                      Enable if you want horoscope-based matching and Porondam compatibility.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={horoscopeRequired}
                    onChange={(e) => setHoroscopeRequired(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E5A93C]" />
                </label>
              </div>

              {horoscopeRequired && (
                <div className="pt-3 border-t border-[#E5A93C]/25 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#1C1412] mb-1">
                        Zodiac Sign / Rashi (Lagna)
                      </label>
                      <select
                        value={zodiacSign}
                        onChange={(e) => setZodiacSign(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#E5A93C] outline-none"
                      >
                        <option value="">Select Zodiac Sign</option>
                        {zodiacSigns.map((z) => (
                          <option key={z} value={z}>{z}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1C1412] mb-1">
                        Birth Time
                      </label>
                      <input
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#E5A93C] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1C1412] mb-1">
                        Birth City / Place
                      </label>
                      <input
                        type="text"
                        value={birthCity}
                        onChange={(e) => setBirthCity(e.target.value)}
                        placeholder="e.g. Kandy"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#E5A93C] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1412] mb-1">
                      Horoscope / Porondam Chart (PDF or Image)
                    </label>
                    <input
                      ref={horoscopeInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleHoroscopeSelect}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => horoscopeInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-300 hover:border-[#E5A93C] text-xs font-semibold text-[#1C1412] flex items-center gap-2 transition-all"
                      >
                        <FileText className="w-4 h-4 text-[#E5A93C]" />
                        <span>Choose Horoscope File</span>
                      </button>
                      {horoscopeFileName && (
                        <span className="text-xs text-[#1C1412]/80 truncate max-w-xs font-medium">
                          {horoscopeFileName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                About Myself (A brief description)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your background, hobbies, values, and what kind of partner you are searching for..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
              />
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-[#FAF6F0] hover:bg-[#F3ECE2] text-[#1C1412]/80 border border-[#EADFCF] text-xs sm:text-sm font-bold transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold px-8 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-gold hover:shadow-gold-lg transition-all flex items-center gap-2 text-[#1C1412]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1C1412]" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-current text-[#1C1412]" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
