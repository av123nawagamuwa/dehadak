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
  BadgeCheck,
  FileCheck,
  Trash2,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'
import { getGenderAvatar } from '@/utils/avatar'
import { cleanPhotoUrl } from '@/utils/imageUrl'

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

export const dietaryHabitsOptions = [
  'Vegetarian',
  'Vegan',
  'Pescatarian (fish, no other meat)',
  'Non-vegetarian',
  'Other',
  'Prefer not to say',
]

export const drinkingHabitsOptions = [
  'Never drink',
  'Occasionally / Socially',
  'Regularly',
  'Previously drank, now stopped',
  'Prefer not to say',
]

export const smokingHabitsOptions = [
  'Never smoke',
  'Occasionally / Socially',
  'Regularly',
  'Previously smoked, now stopped',
  'Prefer not to say',
]


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

  // Habits State
  const [dietaryHabits, setDietaryHabits] = useState('')
  const [dietaryHabitsOther, setDietaryHabitsOther] = useState('')
  const [drinkingHabits, setDrinkingHabits] = useState('')
  const [smokingHabits, setSmokingHabits] = useState('')

  const [caste, setCaste] = useState('')
  const [casteOther, setCasteOther] = useState('')
  const [casteOptions, setCasteOptions] = useState<Array<{ code: string; name_en: string; name_si: string }>>([
    { code: 'prefer_not_to_say', name_en: 'Prefer not to say', name_si: 'ප්‍රකාශ කිරීමට අකමැතිය' },
    { code: 'not_applicable', name_en: 'Not applicable', name_si: 'අදාළ නොවේ' },
    { code: 'bathgama', name_en: 'Bathgama', name_si: 'බත්ගම' },
    { code: 'berava', name_en: 'Berava', name_si: 'බෙරව' },
    { code: 'durava', name_en: 'Durava', name_si: 'දුරාව' },
    { code: 'govigama', name_en: 'Govigama (Goyigama)', name_si: 'ගොවිගම (ගොයිගම)' },
    { code: 'karaiyar', name_en: 'Karaiyar', name_si: 'කරයියාර්' },
    { code: 'karava', name_en: 'Karava', name_si: 'කරාව' },
    { code: 'koviyar', name_en: 'Koviyar', name_si: 'කොවියර්' },
    { code: 'mukkuvar', name_en: 'Mukkuvar', name_si: 'මුක්කුවර්' },
    { code: 'nalavar', name_en: 'Nalavar', name_si: 'නලවර්' },
    { code: 'navandanna', name_en: 'Navandanna', name_si: 'නවන්දන්න' },
    { code: 'pallar', name_en: 'Pallar', name_si: 'පල්ලර්' },
    { code: 'paraiyar', name_en: 'Paraiyar', name_si: 'පරයියාර්' },
    { code: 'radala', name_en: 'Radala', name_si: 'රදළ' },
    { code: 'rada', name_en: 'Rada', name_si: 'රදාව' },
    { code: 'salagama', name_en: 'Salagama', name_si: 'සලාගම' },
    { code: 'vahumpura', name_en: 'Vahumpura', name_si: 'වහුම්පුර' },
    { code: 'vellalar', name_en: 'Vellalar', name_si: 'වෙල්ලාලර්' },
    { code: 'other', name_en: 'Other — please specify', name_si: 'වෙනත් — කරුණාකර සඳහන් කරන්න' },
  ])

  // Identity Verification
  const [verificationStatus, setVerificationStatus] = useState<string>('NOT_SUBMITTED')
  const [rejectionReason, setRejectionReason] = useState('')
  const [nicNumber, setNicNumber] = useState('')
  const [nicFrontFile, setNicFrontFile] = useState<File | null>(null)
  const [nicFrontPreview, setNicFrontPreview] = useState<string | null>(null)
  const [nicBackFile, setNicBackFile] = useState<File | null>(null)
  const [nicBackPreview, setNicBackPreview] = useState<string | null>(null)
  const [nicError, setNicError] = useState<string | null>(null)

  const nicFrontInputRef = useRef<HTMLInputElement>(null)
  const nicBackInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lookup/caste-options`)
      .then((res) => res.json())
      .then((data) => {
        if (data.casteOptions && data.casteOptions.length > 0) {
          setCasteOptions(data.casteOptions)
        }
      })
      .catch(() => {})
  }, [])

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
      setCaste(profile.caste || profile.ethnicity || '')
      setCasteOther(profile.caste_other || '')
      setDietaryHabits(profile.dietary_habits || profile.food || '')
      setDietaryHabitsOther(profile.dietary_habits_other || '')
      setDrinkingHabits(profile.drinking_habits || profile.drinking || '')
      setSmokingHabits(profile.smoking_habits || profile.smoking || '')
      setVerificationStatus(profile.verification_status || 'NOT_SUBMITTED')
      setRejectionReason(profile.verification_rejection_reason || '')
      setReligion(profile.religion || 'Buddhist')
      setDistrict(profile.district && profile.district !== 'Overseas' && profile.district !== 'Living Abroad' ? profile.district : 'Colombo')
      setOccupation(profile.profession || 'Software & IT')
      
      const isAbroad = profile.country && profile.country !== 'Sri Lanka'
      setLocationType(isAbroad ? 'foreign' : 'local')
      setJobCountry(profile.country || (isAbroad ? profile.city : 'Sri Lanka'))

      // Photo preview
      const fallbackPortrait = getGenderAvatar(profile.gender)

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

  const handleNicSelect = (side: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    setNicError(null)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setNicError('Each document image must be under 5MB in size.')
        return
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setNicError('Please upload a valid JPG, PNG, or WEBP image.')
        return
      }
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (side === 'front') {
          setNicFrontFile(file)
          setNicFrontPreview(ev.target?.result as string)
        } else {
          setNicBackFile(file)
          setNicBackPreview(ev.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const clearNic = (side: 'front' | 'back') => {
    if (side === 'front') {
      setNicFrontFile(null)
      setNicFrontPreview(null)
      if (nicFrontInputRef.current) nicFrontInputRef.current.value = ''
    } else {
      setNicBackFile(null)
      setNicBackPreview(null)
      if (nicBackInputRef.current) nicBackInputRef.current.value = ''
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
          caste: caste || null,
          casteOther: caste === 'other' ? casteOther.trim() : null,
          ethnicity: profile?.ethnicity && profile.ethnicity !== caste ? profile.ethnicity : 'Sinhalese',
          height: height || "5'6\"",
          civilStatus: civilStatus || 'Never Married',
          country: locationType === 'foreign' ? (jobCountry || 'Abroad') : 'Sri Lanka',
          district: locationType === 'foreign' ? 'Overseas' : district,
          city: locationType === 'foreign' ? (jobCountry || 'Abroad') : district,
          visaType: locationType === 'foreign' ? 'Work Visa / PR' : 'Citizen',
          education: education || "Bachelor's Degree",
          profession: occupation || 'Software & IT',
          drinking: drinkingHabits || 'Prefer not to say',
          smoking: smokingHabits || 'Prefer not to say',
          food: dietaryHabits === 'Other' && dietaryHabitsOther ? dietaryHabitsOther.trim() : (dietaryHabits || 'Prefer not to say'),
          dietaryHabits,
          dietaryHabitsOther: dietaryHabits === 'Other' ? dietaryHabitsOther.trim() : '',
          drinkingHabits,
          smokingHabits,
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

      // 4. Upload Optional NIC Verification documents if provided
      if (nicFrontFile && nicBackFile) {
        try {
          const nicFormData = new FormData()
          if (nicNumber.trim()) nicFormData.append('nicNumber', nicNumber.trim())
          nicFormData.append('front', nicFrontFile)
          nicFormData.append('frontImage', nicFrontFile)
          nicFormData.append('back', nicBackFile)
          nicFormData.append('backImage', nicBackFile)
          const nicRes = await fetch(`${API_BASE_URL}/api/profile/nic-verification`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: nicFormData,
          })
          if (!nicRes.ok) {
            const errData = await nicRes.json().catch(() => ({}))
            console.error('NIC verification upload failed:', errData)
          }
        } catch (nicErr) {
          console.warn('NIC upload note:', nicErr)
        }
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
                  Caste (Optional)
                </label>
                <select
                  value={caste}
                  onChange={(e) => {
                    setCaste(e.target.value)
                    if (e.target.value !== 'other') {
                      setCasteOther('')
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white transition-all"
                >
                  <option value="">Select caste (optional)</option>
                  {casteOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.name_en}
                    </option>
                  ))}
                </select>

                {caste === 'other' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <input
                      type="text"
                      maxLength={100}
                      value={casteOther}
                      onChange={(e) => setCasteOther(e.target.value)}
                      placeholder="Please specify your caste..."
                      className="w-full px-4 py-2 rounded-xl border border-[#E5A93C]/60 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-xs bg-amber-50/40 outline-none transition-all"
                    />
                  </motion.div>
                )}
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

            {/* Row 7: Dietary Habits, Drinking Habits & Smoking Habits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Dietary Habits (Optional)
                </label>
                <select
                  value={dietaryHabits}
                  onChange={(e) => {
                    setDietaryHabits(e.target.value)
                    if (e.target.value !== 'Other') {
                      setDietaryHabitsOther('')
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white transition-all"
                >
                  <option value="">Select dietary habits (optional)</option>
                  {dietaryHabitsOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                {dietaryHabits === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <input
                      type="text"
                      maxLength={100}
                      value={dietaryHabitsOther}
                      onChange={(e) => setDietaryHabitsOther(e.target.value)}
                      placeholder="Please specify dietary habit..."
                      className="w-full px-4 py-2 rounded-xl border border-[#E5A93C]/60 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-xs bg-amber-50/40 outline-none transition-all"
                    />
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Drinking Habits (Optional)
                </label>
                <select
                  value={drinkingHabits}
                  onChange={(e) => setDrinkingHabits(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white transition-all"
                >
                  <option value="">Select drinking habits (optional)</option>
                  {drinkingHabitsOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Smoking Habits (Optional)
                </label>
                <select
                  value={smokingHabits}
                  onChange={(e) => setSmokingHabits(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm outline-none bg-white transition-all"
                >
                  <option value="">Select smoking habits (optional)</option>
                  {smokingHabitsOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
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
                      src={publicPhoto ? photoPreview : getGenderAvatar(gender)}
                      alt="Profile preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#E5A93C] shadow-sm bg-white"
                    />
                    <div>
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {publicPhoto ? 'Photo Public' : 'Avatar Mode (Photo Hidden)'}
                      </span>
                      {!publicPhoto && (
                        <p className="text-[10px] text-gray-500">
                          Public visitors see your {gender === 'female' ? 'female' : 'male'} avatar.
                        </p>
                      )}
                    </div>
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

            {/* Identity Verification (Optional NIC Section) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6F0] border border-[#E5A93C]/40 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center shrink-0 text-[#9B6B15]">
                  <BadgeCheck className="w-5 h-5 text-[#9B6B15]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-[#1C1412]">
                      Identity Verification
                    </h3>
                    {verificationStatus === 'VERIFIED' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Member
                      </span>
                    )}
                    {verificationStatus === 'PENDING' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                        Under Review
                      </span>
                    )}
                    {verificationStatus === 'REJECTED' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
                        Requires Resubmission
                      </span>
                    )}
                    {verificationStatus === 'NOT_SUBMITTED' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-300">
                        Not Submitted
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#1C1412]/75 mt-0.5 leading-relaxed">
                    Identity verification is optional. Upload your National Identity Card (NIC) to receive a verified trust badge. Documents are stored in secure private storage and never shown to the public.
                  </p>
                </div>
              </div>

              {/* Status Specific Notices */}
              {verificationStatus === 'VERIFIED' && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your profile is verified. Your documents have been reviewed and approved.</span>
                </div>
              )}

              {verificationStatus === 'PENDING' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                  <span>Your submission is currently being reviewed by our team.</span>
                </div>
              )}

              {verificationStatus === 'REJECTED' && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Verification was not approved</p>
                    <p className="mt-0.5">{rejectionReason || 'Documents were unclear or did not match profile details.'}</p>
                    <p className="mt-1 font-medium text-red-700">You can upload clear replacement photos below to reapply.</p>
                  </div>
                </div>
              )}

              {/* Upload controls (visible if NOT_SUBMITTED, REJECTED, or user wants to re-upload) */}
              {verificationStatus !== 'VERIFIED' && (
                <div className="space-y-3 pt-2 border-t border-[#E5A93C]/20">
                  {nicError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{nicError}</span>
                    </div>
                  )}

                  {/* Optional NIC Number */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1412] mb-1">
                      NIC Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={nicNumber}
                      onChange={(e) => setNicNumber(e.target.value)}
                      placeholder="e.g. 199512345678 or 951234567V"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Front & Back Document Upload Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* NIC Front */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#EADFCF] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1C1412] flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
                          NIC Front Side
                        </span>
                        {nicFrontFile && (
                          <button
                            type="button"
                            onClick={() => clearNic('front')}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        ref={nicFrontInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleNicSelect('front', e)}
                        className="hidden"
                      />

                      {nicFrontPreview ? (
                        <div className="space-y-2">
                          <div className="relative rounded-lg overflow-hidden border border-[#E5A93C]/50 h-28 bg-[#1C1412]/5">
                            <img
                              src={nicFrontPreview}
                              alt="NIC Front Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Front selected
                            </span>
                            <button
                              type="button"
                              onClick={() => nicFrontInputRef.current?.click()}
                              className="text-[11px] text-[#9B6B15] hover:underline font-semibold"
                            >
                              Replace
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => nicFrontInputRef.current?.click()}
                          className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#E5A93C] flex flex-col items-center justify-center gap-1 bg-[#FAF6F0]/50 hover:bg-amber-50/50 transition-all text-gray-600"
                        >
                          <Upload className="w-4 h-4 text-[#E5A93C]" />
                          <span className="text-xs font-semibold text-[#1C1412]">Upload Front Image</span>
                          <span className="text-[10px] text-gray-500">JPG, PNG (max 5MB)</span>
                        </button>
                      )}
                    </div>

                    {/* NIC Back */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#EADFCF] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1C1412] flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
                          NIC Back Side
                        </span>
                        {nicBackFile && (
                          <button
                            type="button"
                            onClick={() => clearNic('back')}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        ref={nicBackInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleNicSelect('back', e)}
                        className="hidden"
                      />

                      {nicBackPreview ? (
                        <div className="space-y-2">
                          <div className="relative rounded-lg overflow-hidden border border-[#E5A93C]/50 h-28 bg-[#1C1412]/5">
                            <img
                              src={nicBackPreview}
                              alt="NIC Back Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Back selected
                            </span>
                            <button
                              type="button"
                              onClick={() => nicBackInputRef.current?.click()}
                              className="text-[11px] text-[#9B6B15] hover:underline font-semibold"
                            >
                              Replace
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => nicBackInputRef.current?.click()}
                          className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#E5A93C] flex flex-col items-center justify-center gap-1 bg-[#FAF6F0]/50 hover:bg-amber-50/50 transition-all text-gray-600"
                        >
                          <Upload className="w-4 h-4 text-[#E5A93C]" />
                          <span className="text-xs font-semibold text-[#1C1412]">Upload Back Image</span>
                          <span className="text-[10px] text-gray-500">JPG, PNG (max 5MB)</span>
                        </button>
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
