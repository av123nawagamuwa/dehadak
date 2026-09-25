import { useState, useRef, useEffect } from 'react'
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
  FileCheck,
  Trash2,
  BadgeCheck,
  Crown,
  ArrowRight,
  CreditCard,
  Building,
  PhoneCall,
  Crop,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'
import { useRegisterModal } from '@/context/RegisterModalContext'
import ImageCropModal from './ImageCropModal'

export interface PackageConfig {
  code: string
  name: string
  priceLKR: number
  priceDisplay: string
  durationMonths: number
  durationDisplay: string
  interests: number
  acceptInterests: number
  messageConnections: number
  matchPercent: boolean
  contactReveal: boolean
  topPriority: boolean
  badge: string
}

export const PACKAGE_CONFIGS: Record<string, PackageConfig> = {
  FREE: {
    code: 'FREE',
    name: 'Free Explorer',
    priceLKR: 0,
    priceDisplay: 'Free',
    durationMonths: 0,
    durationDisplay: 'Lifetime Access',
    interests: 3,
    acceptInterests: 3,
    messageConnections: 3,
    matchPercent: false,
    contactReveal: false,
    topPriority: false,
    badge: 'Basic',
  },
  SILVER: {
    code: 'SILVER',
    name: 'Silver Match',
    priceLKR: 1500,
    priceDisplay: 'Rs. 1,500',
    durationMonths: 3,
    durationDisplay: '3 Months',
    interests: 30,
    acceptInterests: 30,
    messageConnections: 30,
    matchPercent: true,
    contactReveal: false,
    topPriority: false,
    badge: 'Value Pack',
  },
  GOLD: {
    code: 'GOLD',
    name: 'Gold VIP',
    priceLKR: 1800,
    priceDisplay: 'Rs. 1,800',
    durationMonths: 3,
    durationDisplay: '3 Months',
    interests: 100,
    acceptInterests: 100,
    messageConnections: 100,
    matchPercent: true,
    contactReveal: false,
    topPriority: false,
    badge: 'Most Popular',
  },
  PLATINUM: {
    code: 'PLATINUM',
    name: 'Royal Platinum',
    priceLKR: 3000,
    priceDisplay: 'Rs. 3,000',
    durationMonths: 3,
    durationDisplay: '3 Months',
    interests: 150,
    acceptInterests: 150,
    messageConnections: 150,
    matchPercent: true,
    contactReveal: true,
    topPriority: true,
    badge: 'VIP Elite Distinction',
  },
}

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

export default function RegisterModal() {
  const { isOpen, closeRegisterModal, selectedPackage, setSelectedPackage } = useRegisterModal()

  const [step, setStep] = useState<1 | 2>(1)
  const [registeredAuthToken, setRegisteredAuthToken] = useState<string>('')
  const [ipayLoading, setIpayLoading] = useState(false)
  const [paymentTab, setPaymentTab] = useState<'ipay' | 'bank'>('ipay')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const activePlanCode = selectedPackage || 'FREE'
  const currentPlan = PACKAGE_CONFIGS[activePlanCode] || PACKAGE_CONFIGS.FREE

  // Validation State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setError('')
      setFieldErrors({})
      setTouched({})
      setSuccess(false)
      setIpayLoading(false)
    }
  }, [isOpen])

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Habits State
  const [dietaryHabits, setDietaryHabits] = useState('')
  const [dietaryHabitsOther, setDietaryHabitsOther] = useState('')
  const [drinkingHabits, setDrinkingHabits] = useState('')
  const [smokingHabits, setSmokingHabits] = useState('')

  const [gender, setGender] = useState('male') // male = Groom, female = Bride
  const [civilStatus, setCivilStatus] = useState('Never Married')
  const [age, setAge] = useState('24')
  const [dob, setDob] = useState('2000-01-01')
  const [height, setHeight] = useState("5'6\"")
  const [education, setEducation] = useState("Bachelor's Degree")
  
  // Caste State
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
  const [locationType, setLocationType] = useState('local') // local | foreign
  const [jobCountry, setJobCountry] = useState('Sri Lanka')

  // Photo
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [publicPhoto, setPublicPhoto] = useState(true)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropRawSrc, setCropRawSrc] = useState<string | null>(null)

  // Identity Verification (Optional NIC)
  const [nicNumber, setNicNumber] = useState('')
  const [nicFrontFile, setNicFrontFile] = useState<File | null>(null)
  const [nicFrontPreview, setNicFrontPreview] = useState<string | null>(null)
  const [nicBackFile, setNicBackFile] = useState<File | null>(null)
  const [nicBackPreview, setNicBackPreview] = useState<string | null>(null)
  const [nicError, setNicError] = useState<string | null>(null)

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
  const nicFrontInputRef = useRef<HTMLInputElement>(null)
  const nicBackInputRef = useRef<HTMLInputElement>(null)

  // Validation Functions
  const validateFullName = (name: string): string => {
    const trimmed = (name || '').trim()
    if (!trimmed) return 'Full name is required.'
    if (trimmed.length < 2) return 'Full name must be at least 2 characters long.'
    if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Full name should only contain letters and spaces.'
    return ''
  }

  const validateEmail = (val: string): string => {
    const trimmed = (val || '').trim()
    if (!trimmed) return 'Email address is required.'
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g. yourname@gmail.com).'
    return ''
  }

  const validatePhone = (val: string, locType: string): string => {
    const cleaned = (val || '').trim().replace(/[\s\-()]+/g, '')
    if (!cleaned) return 'Phone number is required.'

    const isSLFormat = /^(?:\+94|94|0)?7[0-9]{8}$/.test(cleaned)
    if (locType === 'local') {
      if (!isSLFormat) {
        return 'Please enter a valid Sri Lankan mobile number (e.g. 0771234567 or +94771234567).'
      }
    } else {
      // Foreign residence
      if (!isSLFormat && !/^\+?[1-9]\d{7,14}$/.test(cleaned)) {
        return 'Please enter a valid phone number with country code (e.g. +971501234567).'
      }
    }
    return ''
  }

  const validatePassword = (pass: string): string => {
    if (!pass) return 'Password is required.'
    if (pass.length < 6) return 'Password must be at least 6 characters long.'
    return ''
  }

  const validateAge = (val: string): string => {
    if (!val) return 'Age is required.'
    const num = parseInt(val, 10)
    if (isNaN(num) || num < 18 || num > 80) return 'Age must be between 18 and 80 years.'
    return ''
  }

  const validateJobCountry = (country: string, locType: string): string => {
    if (locType === 'foreign' && !country.trim()) return 'Job country / residence is required.'
    return ''
  }

  const validateCasteOther = (val: string, currentCaste: string): string => {
    if (currentCaste === 'other' && !val.trim()) return 'Please specify your caste.'
    return ''
  }

  const validateDietaryOther = (val: string, currentDiet: string): string => {
    if (currentDiet === 'Other' && !val.trim()) return 'Please specify your dietary habit.'
    return ''
  }

  const validateNicNumber = (val: string): string => {
    const trimmed = (val || '').trim().toUpperCase()
    if (!trimmed) return '' // Optional
    const oldNic = /^[0-9]{9}[VX]$/
    const newNic = /^[0-9]{12}$/
    if (!oldNic.test(trimmed) && !newNic.test(trimmed)) {
      return 'Invalid NIC format. Format: 9 digits + V/X (e.g. 951234567V) or 12 digits (e.g. 199512345678).'
    }
    return ''
  }

  const validateDescription = (desc: string): string => {
    const trimmed = (desc || '').trim()
    if (!trimmed) return 'Please provide a brief description about yourself.'
    if (trimmed.length < 15) return 'Description should be at least 15 characters long.'
    return ''
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    let err = ''
    if (field === 'fullName') err = validateFullName(fullName)
    else if (field === 'email') err = validateEmail(email)
    else if (field === 'phone') err = validatePhone(phone, locationType)
    else if (field === 'password') err = validatePassword(password)
    else if (field === 'age') err = validateAge(age)
    else if (field === 'jobCountry') err = validateJobCountry(jobCountry, locationType)
    else if (field === 'casteOther') err = validateCasteOther(casteOther, caste)
    else if (field === 'dietaryHabitsOther') err = validateDietaryOther(dietaryHabitsOther, dietaryHabits)
    else if (field === 'nicNumber') err = validateNicNumber(nicNumber)
    else if (field === 'description') err = validateDescription(description)

    setFieldErrors(prev => ({ ...prev, [field]: err }))
  }

  const handleAutoFillBio = () => {
    const introName = fullName.trim() || 'A matrimonial member'
    const prof = occupation || 'Professional'
    const rel = religion ? `${religion}` : 'traditional'
    const suggested = `Hello, my name is ${introName}. I am a ${prof} from a ${rel} background. Looking for an educated, understanding, and caring life partner with mutual respect and genuine family values.`
    setDescription(suggested)
    setTouched(prev => ({ ...prev, description: true }))
    setFieldErrors(prev => ({ ...prev, description: '' }))
  }

  const validateAll = (): boolean => {
    const errs: Record<string, string> = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      phone: validatePhone(phone, locationType),
      password: validatePassword(password),
      age: validateAge(age),
      jobCountry: validateJobCountry(jobCountry, locationType),
      casteOther: validateCasteOther(casteOther, caste),
      dietaryHabitsOther: validateDietaryOther(dietaryHabitsOther, dietaryHabits),
      nicNumber: validateNicNumber(nicNumber),
      description: validateDescription(description),
    }

    const activeErrors: Record<string, string> = {}
    Object.entries(errs).forEach(([k, v]) => {
      if (v) activeErrors[k] = v
    })

    setFieldErrors(activeErrors)

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      age: true,
      jobCountry: true,
      casteOther: true,
      dietaryHabitsOther: true,
      nicNumber: true,
      description: true,
    })

    if (Object.keys(activeErrors).length > 0) {
      const firstField = Object.keys(activeErrors)[0]
      const el = document.getElementById(`reg_field_${firstField}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.focus()
      }
      setError('Please check and correct the highlighted fields before proceeding.')
      return false
    }

    return true
  }

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

  // Handle Photo selection with responsive crop editor
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, or WEBP).')
        e.target.value = ''
        return
      }
      if (file.size > 15 * 1024 * 1024) {
        alert('Photo must be less than 15MB.')
        e.target.value = ''
        return
      }

      const reader = new FileReader()
      reader.onload = (ev) => {
        const rawDataUrl = ev.target?.result as string
        setCropRawSrc(rawDataUrl)
        setCropModalOpen(true)
      }
      reader.readAsDataURL(file)
      e.target.value = ''
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

  // Handle NIC file selection
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Run complete custom validation
    const isValid = validateAll()
    if (!isValid) {
      return
    }

    setLoading(true)

    try {
      const cleanEmail = email.trim().toLowerCase()
      const cleanPhone = phone.trim().replace(/[\s\-()]+/g, '')

      // 1. Register User in Auth
      const registerRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          phone: cleanPhone,
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
          caste: caste || null,
          casteOther: caste === 'other' ? casteOther.trim() : null,
          ethnicity: 'Sinhalese',
          height: height || "5'6\"",
          civilStatus: civilStatus || 'Never Married',
          country: locationType === 'foreign' ? (jobCountry || 'Abroad') : 'Sri Lanka',
          district: locationType === 'foreign' ? 'Overseas' : district,
          city: locationType === 'foreign' ? (jobCountry || 'Abroad') : district,
          visaType: locationType === 'foreign' ? 'Work Visa / PR' : 'Citizen',
          education: education || "Bachelor's Degree",
          profession: occupation || "Software & IT",
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
          description: description || `Hello, my name is ${fullName}. Looking for a compatible and sincere life partner with mutual respect and family values.`,
          plan: 'standard',
          horoscopeBirthYear: String(birthDateObj.getFullYear()),
          horoscopeBirthMonth: String(birthDateObj.getMonth() + 1),
          horoscopeBirthDay: String(birthDateObj.getDate()),
          photoPrivacy: publicPhoto,
          photo_privacy: publicPhoto ? 1 : 0,
          horoscopePrivacy: false,
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

      // 6. Upload Optional NIC Verification documents if provided
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
          console.warn('NIC verification upload note:', nicErr)
        }
      }

      if (selectedPackage && selectedPackage !== 'FREE') {
        setRegisteredAuthToken(token)
        setStep(2)
        setError('')
      } else {
        setSuccess(true)
        setTimeout(() => {
          closeRegisterModal()
          window.location.href = '/profile'
        }, 1200)
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleIpayPayment = async () => {
    setIpayLoading(true)
    setError('')
    try {
      const token = registeredAuthToken || localStorage.getItem('dehadak_auth')
      if (!token) {
        throw new Error('Please login or register to complete payment.')
      }

      const res = await fetch(`${API_BASE_URL}/api/payments/ipay/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageCode: selectedPackage || 'SILVER',
          returnUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.formFields || !data.checkoutUrl) {
        throw new Error(data.error || 'Failed to initialize iPay payment gateway.')
      }

      // Build hidden HTML form and submit to iPay checkout URL
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.checkoutUrl
      form.style.display = 'none'

      Object.entries(data.formFields).forEach(([key, val]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = String(val ?? '')
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (err: any) {
      console.error('iPay payment initiation error:', err)
      setError(err.message || 'Could not connect to iPay payment gateway.')
      setIpayLoading(false)
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
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                      <span>
                        {step === 2
                          ? 'Complete Payment & Activation'
                          : selectedPackage !== 'FREE'
                          ? `Register & Activate ${currentPlan.name}`
                          : 'Register Free Profile'}
                      </span>
                      <Sparkles className="w-4 h-4 text-[#F7D878]" />
                    </h2>
                    {selectedPackage !== 'FREE' && (
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-full border ${
                        step === 2 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-[#E5A93C]/20 text-[#F7D878] border-[#E5A93C]/40'
                      }`}>
                        Step {step} of 2
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#F7D878]/90 font-medium tracking-wide mt-0.5">
                    {step === 2
                      ? `Account details saved! Activate your ${currentPlan.name} membership below.`
                      : selectedPackage !== 'FREE'
                      ? `${currentPlan.priceDisplay} • ${currentPlan.durationDisplay} • Complete profile to proceed to payment`
                      : 'Dehadak – Two Hearts, One Journey'}
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
          {step === 1 ? (
            selectedPackage !== 'FREE' ? (
              <div className="bg-[#FAF6F0] px-6 py-3 border-b border-[#EADFCF] flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-[#1C1412]">
                  <Crown className="w-4 h-4 text-[#9B6B15] shrink-0" />
                  <span>
                    Selected Package: <strong className="text-[#9B6B15] font-bold">{currentPlan.name}</strong> ({currentPlan.priceDisplay} for {currentPlan.durationDisplay})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-500 font-semibold">Switch Plan:</span>
                  {(['SILVER', 'GOLD', 'PLATINUM'] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setSelectedPackage(code)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        selectedPackage === code
                          ? 'bg-[#E5A93C] text-[#1C1412]'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-[#E5A93C]'
                      }`}
                    >
                      {PACKAGE_CONFIGS[code].name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#FAF6F0] px-6 py-3.5 border-b border-[#EADFCF] text-xs sm:text-sm text-[#1C1412]/80 font-medium">
                Please enter your complete details to set up your matrimony account. Identity verification is optional and unlocks a verified trust badge after manual review.
              </div>
            )
          ) : (
            <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-200 text-xs sm:text-sm text-emerald-900 font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your profile has been created successfully. Now complete payment to activate.</span>
              </div>
            </div>
          )}

          {step === 1 ? (
            /* Form Content */
            <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto custom-scroll">
            
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
                <label htmlFor="reg_field_fullName" className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Full Name <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  id="reg_field_fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (touched.fullName) {
                      setFieldErrors(prev => ({ ...prev, fullName: validateFullName(e.target.value) }))
                    }
                  }}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="e.g. Avishka Nawagamuwa"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    touched.fullName && fieldErrors.fullName
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/15 text-[#1C1412]'
                      : 'border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 bg-white text-[#1C1412]'
                  }`}
                />
                {touched.fullName && fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reg_field_email" className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Email Address <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  id="reg_field_email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (touched.email) {
                      setFieldErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }))
                    }
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="e.g. yourname@gmail.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    touched.email && fieldErrors.email
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/15 text-[#1C1412]'
                      : 'border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 bg-white text-[#1C1412]'
                  }`}
                />
                {touched.email && fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Grid Row 2: Phone & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="reg_field_phone" className="block text-xs font-bold text-[#1C1412]">
                    Phone Number <span className="text-[#E5A93C] font-bold">*</span>
                  </label>
                  {phone.trim() && /^(?:\+94|94|0)?7[0-9]{8}$/.test(phone.trim().replace(/[\s\-()]+/g, '')) && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      SL Mobile Verified Format
                    </span>
                  )}
                </div>
                <input
                  id="reg_field_phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (touched.phone) {
                      setFieldErrors(prev => ({ ...prev, phone: validatePhone(e.target.value, locationType) }))
                    }
                  }}
                  onBlur={() => handleBlur('phone')}
                  placeholder="e.g. 0768913695 or +94768913695"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    touched.phone && fieldErrors.phone
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/15 text-[#1C1412]'
                      : 'border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 bg-white text-[#1C1412]'
                  }`}
                />
                {touched.phone && fieldErrors.phone ? (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.phone}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-gray-500">
                    {locationType === 'local'
                      ? 'Local: 10 digits starting with 07X (e.g. 0771234567 or +94771234567)'
                      : 'International format with country code (e.g. +971501234567)'}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reg_field_password" className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Password <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg_field_password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (touched.password) {
                        setFieldErrors(prev => ({ ...prev, password: validatePassword(e.target.value) }))
                      }
                    }}
                    onBlur={() => handleBlur('password')}
                    placeholder="•••••••• (minimum 6 characters)"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all pr-10 ${
                      touched.password && fieldErrors.password
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/15 text-[#1C1412]'
                        : 'border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 bg-white text-[#1C1412]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
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
                <label htmlFor="reg_field_age" className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Age <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  id="reg_field_age"
                  type="number"
                  min="18"
                  max="80"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value)
                    if (touched.age) {
                      setFieldErrors(prev => ({ ...prev, age: validateAge(e.target.value) }))
                    }
                  }}
                  onBlur={() => handleBlur('age')}
                  placeholder="24"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    touched.age && fieldErrors.age
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/15 text-[#1C1412]'
                      : 'border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 bg-white text-[#1C1412]'
                  }`}
                />
                {touched.age && fieldErrors.age && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.age}</span>
                  </p>
                )}
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
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
                      id="reg_field_casteOther"
                      type="text"
                      maxLength={100}
                      value={casteOther}
                      onChange={(e) => {
                        setCasteOther(e.target.value)
                        if (touched.casteOther) {
                          setFieldErrors(prev => ({ ...prev, casteOther: validateCasteOther(e.target.value, caste) }))
                        }
                      }}
                      onBlur={() => handleBlur('casteOther')}
                      placeholder="Please specify your caste..."
                      className={`w-full px-4 py-2 rounded-xl border text-xs outline-none transition-all ${
                        touched.casteOther && fieldErrors.casteOther
                          ? 'border-red-400 bg-red-50/20 text-[#1C1412]'
                          : 'border-[#E5A93C]/60 bg-amber-50/40 text-[#1C1412]'
                      }`}
                    />
                    {touched.casteOther && fieldErrors.casteOther && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.casteOther}</span>
                      </p>
                    )}
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
                <label htmlFor="reg_field_jobCountry" className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Job Country / Residence <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <input
                  id="reg_field_jobCountry"
                  type="text"
                  value={jobCountry}
                  onChange={(e) => {
                    setJobCountry(e.target.value)
                    if (touched.jobCountry) {
                      setFieldErrors(prev => ({ ...prev, jobCountry: validateJobCountry(e.target.value, locationType) }))
                    }
                  }}
                  onBlur={() => handleBlur('jobCountry')}
                  placeholder="e.g. Sri Lanka, United Arab Emirates, UK, Australia"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    touched.jobCountry && fieldErrors.jobCountry
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/15 text-[#1C1412]'
                      : 'border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 bg-white text-[#1C1412]'
                  }`}
                />
                {touched.jobCountry && fieldErrors.jobCountry && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.jobCountry}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Grid Row 8: Dietary Habits, Drinking Habits & Smoking Habits */}
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
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
                      id="reg_field_dietaryHabitsOther"
                      type="text"
                      maxLength={100}
                      value={dietaryHabitsOther}
                      onChange={(e) => {
                        setDietaryHabitsOther(e.target.value)
                        if (touched.dietaryHabitsOther) {
                          setFieldErrors(prev => ({ ...prev, dietaryHabitsOther: validateDietaryOther(e.target.value, dietaryHabits) }))
                        }
                      }}
                      onBlur={() => handleBlur('dietaryHabitsOther')}
                      placeholder="Please specify dietary habit..."
                      className={`w-full px-4 py-2 rounded-xl border text-xs outline-none transition-all ${
                        touched.dietaryHabitsOther && fieldErrors.dietaryHabitsOther
                          ? 'border-red-400 bg-red-50/20 text-[#1C1412]'
                          : 'border-[#E5A93C]/60 bg-amber-50/40 text-[#1C1412]'
                      }`}
                    />
                    {touched.dietaryHabitsOther && fieldErrors.dietaryHabitsOther && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.dietaryHabitsOther}</span>
                      </p>
                    )}
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm bg-white outline-none transition-all"
                >
                  <option value="">Select smoking habits (optional)</option>
                  {smokingHabitsOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
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
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-[#E5A93C] text-xs font-bold text-[#1C1412] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#E5A93C]" />
                  <span>{photoPreview ? 'Change Photo' : 'Choose Photo'}</span>
                </button>

                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => setCropModalOpen(true)}
                    className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E5A93C]/70 hover:bg-[#F5EEDB] text-xs font-bold text-[#1C1412] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Reposition face and adjust zoom"
                  >
                    <Crop className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>Adjust Crop</span>
                  </button>
                )}

                {photoPreview ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#E5A93C] shadow-sm bg-white"
                    />
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Photo ready
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">
                    JPG, PNG format (Max 15MB)
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

            {/* Identity Verification (Optional NIC Section) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6F0] border border-[#E5A93C]/40 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center shrink-0 text-[#9B6B15]">
                  <BadgeCheck className="w-5 h-5 text-[#9B6B15]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-[#1C1412]">
                      Identity Verification (Optional)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Earn Badge
                    </span>
                  </div>
                  <p className="text-[11px] text-[#1C1412]/75 mt-0.5 leading-relaxed">
                    Upload clear front and back photos of your National Identity Card (NIC). Our team will manually review your documents and award your profile a trusted <strong>Verified Badge</strong>. Documents are stored in secure encrypted private storage and are strictly confidential.
                  </p>
                </div>
              </div>

              {nicError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{nicError}</span>
                </div>
              )}

              {/* Optional NIC Number */}
              <div>
                <label htmlFor="reg_field_nicNumber" className="block text-[11px] font-bold text-[#1C1412] mb-1">
                  NIC Number (Optional)
                </label>
                <input
                  id="reg_field_nicNumber"
                  type="text"
                  value={nicNumber}
                  onChange={(e) => {
                    setNicNumber(e.target.value)
                    if (touched.nicNumber) {
                      setFieldErrors(prev => ({ ...prev, nicNumber: validateNicNumber(e.target.value) }))
                    }
                  }}
                  onBlur={() => handleBlur('nicNumber')}
                  placeholder="e.g. 199512345678 or 951234567V"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none transition-all ${
                    touched.nicNumber && fieldErrors.nicNumber
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/15 text-[#1C1412]'
                      : 'border-gray-200 text-xs bg-white focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-[#1C1412]'
                  }`}
                />
                {touched.nicNumber && fieldErrors.nicNumber && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.nicNumber}</span>
                  </p>
                )}
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

            {/* About Myself Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="reg_field_description" className="block text-xs font-bold text-[#1C1412]">
                  About Myself (A brief description) <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillBio}
                  className="text-[11px] text-[#9B6B15] hover:text-[#7A530E] hover:underline font-bold flex items-center gap-1 transition-colors"
                  title="Generate a polite, respectful matrimonial bio"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Auto-fill friendly bio</span>
                </button>
              </div>
              <textarea
                id="reg_field_description"
                rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (touched.description) {
                    setFieldErrors(prev => ({ ...prev, description: validateDescription(e.target.value) }))
                  }
                }}
                onBlur={() => handleBlur('description')}
                placeholder="Tell us about your background, hobbies, values, and what kind of partner you are searching for..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  touched.description && fieldErrors.description
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/15 text-[#1C1412]'
                    : 'border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 bg-white text-[#1C1412]'
                }`}
              />
              {touched.description && fieldErrors.description && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.description}</span>
                </p>
              )}
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
                    <span>Saving Profile...</span>
                  </>
                ) : selectedPackage !== 'FREE' ? (
                  <>
                    <span>Continue to Payment (Step 1 of 2)</span>
                    <ArrowRight className="w-4 h-4 text-[#1C1412]" />
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
          ) : (
            /* Step 2: Dedicated Payment & Activation Page */
            <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto custom-scroll bg-[#FAF7F2]">
              {/* Error Notification */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Plan Switcher Pills */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-[#EADFCF]">
                <span className="text-xs font-bold text-[#1C1412] flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-[#9B6B15]" />
                  <span>Selected Membership:</span>
                </span>
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {(['SILVER', 'GOLD', 'PLATINUM'] as const).map((code) => {
                    const cfg = PACKAGE_CONFIGS[code]
                    const isSel = selectedPackage === code
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedPackage(code)}
                        className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSel
                            ? 'bg-[#1C1412] text-[#F7D878] border-[#E5A93C] shadow-sm'
                            : 'bg-white text-[#1C1412]/80 border-gray-200 hover:border-[#E5A93C]'
                        }`}
                      >
                        {cfg.name} ({cfg.priceDisplay})
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Selected Plan Details Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1412] via-[#2A1E1A] to-[#1C1412] text-white p-5 sm:p-6 border border-[#E5A93C]/50 shadow-xl">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-[#E5A93C]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 text-[11px] font-bold text-[#F7D878] uppercase tracking-wider mb-2">
                      <Crown className="w-3.5 h-3.5 text-[#F7D878]" />
                      <span>{currentPlan.badge}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{currentPlan.name}</h3>
                    <p className="text-xs text-[#FAF6F0]/80 mt-0.5">{currentPlan.durationDisplay} Comprehensive Access</p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-3xl font-serif font-bold text-[#F7D878]">{currentPlan.priceDisplay}</div>
                    <div className="text-[11px] text-[#FAF6F0]/70">One-time payment • No auto-charge</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 text-xs">
                  <div className="flex items-center gap-2 text-[#FAF6F0]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#F7D878] shrink-0" />
                    <span>Send up to <strong>{currentPlan.interests}</strong> interest requests</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#FAF6F0]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#F7D878] shrink-0" />
                    <span>Accept up to <strong>{currentPlan.acceptInterests}</strong> received interests</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#FAF6F0]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#F7D878] shrink-0" />
                    <span>Message up to <strong>{currentPlan.messageConnections}</strong> connections (Unlimited chat)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#FAF6F0]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#F7D878] shrink-0" />
                    <span>Full 8-point astrological & lifestyle match %</span>
                  </div>
                  {currentPlan.code === 'PLATINUM' && (
                    <>
                      <div className="flex items-center gap-2 text-[#F7D878] font-bold">
                        <Sparkles className="w-4 h-4 text-[#F7D878] shrink-0" />
                        <span>Ranked #1 Top of Search Page</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#F7D878] font-bold">
                        <CheckCircle2 className="w-4 h-4 text-[#F7D878] shrink-0" />
                        <span>Direct verified contact phone number reveal</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div>
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl mb-4 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setPaymentTab('ipay')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentTab === 'ipay'
                        ? 'bg-[#1C1412] text-[#F7D878] shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>iPay Online Gateway (Instant)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab('bank')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentTab === 'bank'
                        ? 'bg-[#1C1412] text-[#F7D878] shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Bank Deposit / WhatsApp</span>
                  </button>
                </div>

                {/* Tab 1: iPay Gateway */}
                {paymentTab === 'ipay' && (
                  <div className="p-5 rounded-3xl bg-white border border-[#E5A93C]/40 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#1C1412] flex items-center gap-2">
                          <span>iPay Payment Gateway by LOLC</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Instant Activation
                          </span>
                        </h4>
                        <p className="text-xs text-[#1C1412]/70 mt-0.5">
                          Pay securely with Visa, Mastercard, LankaQR, or iPay wallet app.
                        </p>
                      </div>

                      {/* Payment brand badges */}
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                          VISA
                        </span>
                        <span className="px-2 py-1 rounded bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold">
                          Mastercard
                        </span>
                        <span className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                          LankaQR
                        </span>
                        <span className="px-2 py-1 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
                          iPay
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] text-xs text-[#1C1412]/80 space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-[#1C1412]">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span>Certified Central Bank of Sri Lanka IPG Standard</span>
                      </div>
                      <p className="text-[11px] text-gray-600 pl-6">
                        You will be redirected to the secure iPay checkout page to authenticate your payment. Your Dehadak subscription activates automatically upon completion.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleIpayPayment}
                      disabled={ipayLoading}
                      className="w-full btn-gold py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-[#1C1412] shadow-gold hover:shadow-gold-lg transition-all flex items-center justify-center gap-2"
                    >
                      {ipayLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-[#1C1412]" />
                          <span>Connecting to iPay Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 text-[#1C1412]" />
                          <span>Pay {currentPlan.priceDisplay} with iPay</span>
                          <ArrowRight className="w-4 h-4 ml-1 text-[#1C1412]" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Tab 2: Bank Deposit */}
                {paymentTab === 'bank' && (
                  <div className="p-5 rounded-3xl bg-white border border-[#EADFCF] shadow-sm space-y-4">
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] space-y-2">
                      <p className="font-bold text-[#1C1412] flex items-center gap-1.5 text-xs sm:text-sm">
                        <Building className="w-4 h-4 text-[#9B6B15]" />
                        <span>Commercial Bank of Ceylon PLC</span>
                      </p>
                      <div className="text-xs space-y-1 font-mono text-[#1C1412]/90 bg-white p-3 rounded-xl border border-[#EADFCF]">
                        <p><span className="font-sans font-semibold text-gray-500">Account Name:</span> Dehadak Matrimonial Services</p>
                        <p><span className="font-sans font-semibold text-gray-500">Account Number:</span> 8009124456</p>
                        <p><span className="font-sans font-semibold text-gray-500">Branch:</span> Colombo Super Grade</p>
                        <p><span className="font-sans font-semibold text-gray-500">Amount:</span> <strong className="text-[#9B6B15]">{currentPlan.priceDisplay}</strong></p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-amber-700" />
                        <span>Instant WhatsApp Activation</span>
                      </p>
                      <p className="text-[11px] text-amber-800">
                        Please transfer {currentPlan.priceDisplay} to the account above and WhatsApp your deposit receipt/screenshot to our support team for manual verification within 15 minutes.
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/94771234567?text=${encodeURIComponent(
                        `Hello Dehadak Support, I have registered my profile (${email || fullName}) and would like to activate ${currentPlan.name} (${currentPlan.priceDisplay}) via bank deposit.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Send Slip via WhatsApp (+94 77 123 4567)</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Footer Alternative Options */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-800 font-semibold"
                >
                  ← Edit Profile Information
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeRegisterModal()
                    window.location.href = '/profile'
                  }}
                  className="text-[#9B6B15] hover:text-[#7A530F] font-bold underline"
                >
                  Skip for now & use Free Explorer
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>

      {/* Profile Photo Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={cropRawSrc || photoPreview}
        onClose={() => setCropModalOpen(false)}
        onSave={(croppedFile, croppedPreviewUrl) => {
          setPhotoFile(croppedFile)
          setPhotoPreview(croppedPreviewUrl)
        }}
        userName={fullName || 'Your Profile'}
      />
    </AnimatePresence>
  )
}
