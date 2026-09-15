import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Upload,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Heart,
  Moon,
  Sparkles,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'
import { useRegisterModal } from '@/context/RegisterModalContext'

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

export default function RegisterModal() {
  const { isOpen, closeRegisterModal } = useRegisterModal()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [gender, setGender] = useState('male') // male = Groom, female = Bride
  const [civilStatus, setCivilStatus] = useState('Never Married')
  const [age, setAge] = useState('24')
  const [dob, setDob] = useState('2000-01-01')
  const [height, setHeight] = useState("5'6\"")
  const [education, setEducation] = useState("Bachelor's Degree")
  const [caste, setCaste] = useState('')
  const [religion, setReligion] = useState('Buddhist')
  const [district, setDistrict] = useState('Colombo')
  const [occupation, setOccupation] = useState('Software & IT')
  const [locationType, setLocationType] = useState('local') // local | foreign
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

  // Handle DOB change to calculate Age automatically
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDob(val)
    if (val) {
      const birthYear = new Date(val).getFullYear()
      const currentYear = new Date().getFullYear()
      if (birthYear > 1940 && birthYear <= currentYear) {
        setAge(String(currentYear - birthYear))
      }
    }
  }

  // Handle Photo selection
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

  // Handle Horoscope file selection
  const handleHoroscopeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setHoroscopeFile(file)
      setHoroscopeFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validations
    if (!fullName.trim() || !email.trim() || !password || !phone.trim()) {
      setError('Please fill in all required fields (Full Name, Email, Phone, Password).')
      setLoading(false)
      return
    }

    try {
      // 1. Register User in Auth
      const registerRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          phone: phone.trim(),
          verificationToken: 'skip-phone-verification',
        }),
      })

      const registerData = await registerRes.json()
      if (!registerRes.ok) {
        throw new Error(registerData.error || 'Registration failed. Please check your details.')
      }

      const token = registerData.token
      localStorage.setItem('dehadak_auth', token)
      localStorage.setItem('dehadak_user', JSON.stringify(registerData.user || {}))

      // 2. Split Name
      const nameParts = fullName.trim().split(' ')
      const firstName = nameParts[0] || 'Member'
      const lastName = nameParts.slice(1).join(' ') || ''

      const birthDateObj = dob ? new Date(dob) : new Date()

      // 3. Create Full Profile
      const profileRes = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
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
          drinking: 'Never',
          smoking: 'Never',
          food: 'Non-Vegetarian',
          differentlyAbled: false,
          horoscopeRequired,
          birthTime: horoscopeRequired ? birthTime : '',
          birthCountry: locationType === 'foreign' ? jobCountry : 'Sri Lanka',
          birthCity: horoscopeRequired ? birthCity : district,
          description: description || `Hello, my name is ${fullName}. Looking for a compatible and sincere life partner with mutual respect and family values.`,
          plan: 'standard',
          horoscopeBirthYear: String(birthDateObj.getFullYear()),
          horoscopeBirthMonth: String(birthDateObj.getMonth() + 1),
          horoscopeBirthDay: String(birthDateObj.getDate()),
          horoscopePrivacy: !publicPhoto,
          photos: [],
        }),
      })

      if (!profileRes.ok) {
        const profileData = await profileRes.json()
        throw new Error(profileData.error || 'Profile creation failed.')
      }

      // 4. Upload Photo now that profile is created
      if (photoFile) {
        try {
          const photoFormData = new FormData()
          photoFormData.append('photos', photoFile)
          await fetch(`${API_BASE_URL}/api/profile/photos`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: photoFormData,
          })
        } catch (uploadErr) {
          console.warn('Photo upload note:', uploadErr)
        }
      }

      // 5. Upload Horoscope PDF now that profile is created
      if (horoscopeFile) {
        try {
          const pdfFormData = new FormData()
          pdfFormData.append('pdf', horoscopeFile)
          await fetch(`${API_BASE_URL}/api/profile/horoscope-pdf`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: pdfFormData,
          })
        } catch (pdfErr) {
          console.warn('Horoscope upload note:', pdfErr)
        }
      }

      setSuccess(true)
      setTimeout(() => {
        closeRegisterModal()
        window.location.href = '/profile'
      }, 1200)
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6">
        
        {/* Modal Overlay Click-off */}
        <div
          className="fixed inset-0"
          onClick={closeRegisterModal}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-[#FFFFFF] rounded-3xl shadow-2xl overflow-hidden border border-[#E5A93C]/40 z-10 my-auto text-[#1C1412]"
        >
          {/* Decorative Top Gold Shimmer Line */}
          <div className="h-1.5 bg-gradient-to-r from-[#F7D878] via-[#E5A93C] to-[#9B6B15]" />

          {/* Header Banner in Luxury Velvet Espresso & Champagne Gold */}
          <div className="bg-[#1C1412] text-[#FAF6F0] p-5 sm:p-6 relative border-b border-[#E5A93C]/25">
            <div className="flex items-center justify-between">
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
                    <span>Register Free Profile</span>
                    <Sparkles className="w-4 h-4 text-[#F7D878]" />
                  </h2>
                  <p className="text-xs text-[#F7D878]/90 font-medium tracking-wide mt-0.5">
                    Dehadak – Two Hearts, One Journey
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeRegisterModal}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E5A93C] hover:text-[#1C1412] border border-[#E5A93C]/30 flex items-center justify-center text-[#FAF6F0] transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader Intro */}
          <div className="bg-[#FAF6F0] px-6 py-3.5 border-b border-[#EADFCF] text-xs sm:text-sm text-[#1C1412]/80 font-medium">
            Please enter your complete details to set up your matrimony account. All verified profiles gain instant visibility.
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto custom-scroll">
            
            {/* Error Notification */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Notification */}
            {success && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">Profile registered successfully! Redirecting to your dashboard...</span>
              </div>
            )}

            {/* Grid Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Full Name <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Avishka Nawagamuwa"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Email Address <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Grid Row 2: Phone & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Phone Number <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0768913695"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Password <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Row 3: Gender, Marital Status, Age & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Gender <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
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
                  placeholder="24"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Grid Row 4: Height & Education Qualification (Dropdown) */}
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Education Qualification <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                >
                  {educations.map((ed) => (
                    <option key={ed} value={ed}>{ed}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid Row 5: Caste (Optional) & Religion */}
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Religion <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                >
                  {religions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid Row 6: District & Occupation / Profession (Dropdown) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  District <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                >
                  {professions.map((prof) => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid Row 7: Job / Residence Location Type & Job Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Job / Residence Location Type <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <select
                  value={locationType}
                  onChange={(e) => {
                    const val = e.target.value
                    setLocationType(val)
                    if (val === 'local') {
                      setJobCountry('Sri Lanka')
                    } else if (jobCountry === 'Sri Lanka') {
                      setJobCountry('United Arab Emirates')
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                >
                  <option value="local">Local (Living in Sri Lanka)</option>
                  <option value="foreign">Foreign (Working Abroad)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Job Country <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jobCountry}
                  onChange={(e) => setJobCountry(e.target.value)}
                  placeholder="e.g. Sri Lanka, United Arab Emirates, UK, Australia"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] space-y-3">
              <label className="block text-xs font-bold text-[#1C1412]">
                Upload Profile Photo
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
                  <span>Choose Photo</span>
                </button>

                {photoPreview ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#E5A93C] shadow-sm"
                    />
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Photo selected
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">
                    JPG, PNG format (Max 5MB)
                  </span>
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
                      If enabled, everyone can see your profile photo. If disabled, users must request permission to view your photo.
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

            {/* Horoscope Details & Matching (Optional Section) */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E5A93C]/40 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <Moon className="w-5 h-5 text-[#E5A93C] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#1C1412]">
                      Horoscope Matching Required (Optional)
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

              {/* Expandable Horoscope Form */}
              {horoscopeRequired && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-3 border-t border-[#E5A93C]/25 space-y-3"
                >
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

                  {/* Upload Horoscope PDF */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1412] mb-1">
                      Upload Horoscope / Porondam Chart (PDF or Image)
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
                </motion.div>
              )}
            </div>

            {/* About Myself Textarea */}
            <div>
              <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                About Myself (A brief description) <span className="text-[#E5A93C] font-bold">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your background, hobbies, values, and what kind of partner you are searching for..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
              />
            </div>

            {/* Action Footer Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeRegisterModal}
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
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-current text-[#1C1412]" />
                    <span>Register Account</span>
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
