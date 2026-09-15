import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChangeEvent, ElementType, ReactNode } from 'react'
import {
  User,
  MapPin,
  GraduationCap,
  Heart,
  Star,
  FileText,
  Lock,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Camera,
  AlertCircle,
} from 'lucide-react'
import Stepper from '@/components/Stepper'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import PricingCard from '@/components/PricingCard'
import { API_BASE_URL } from '@/config'

const steps = [
  { key: 'personalInfo' },
  { key: 'parentsInfo' },
  { key: 'private' },
  { key: 'payment' },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

interface FormData {
  firstName: string
  lastName: string
  displayFormat: string
  gender: string
  birthYear: string
  birthMonth: string
  birthDay: string
  religion: string
  ethnicity: string
  height: string
  civilStatus: string
  country: string
  district: string
  city: string
  visaType: string
  education: string
  profession: string
  drinking: string
  smoking: string
  food: string
  differentlyAbled: boolean
  horoscopeRequired: boolean
  horoscopeBirthYear: string
  horoscopeBirthMonth: string
  horoscopeBirthDay: string
  birthTime: string
  birthCountry: string
  birthCity: string
  description: string
  fatherReligion: string
  fatherEthnicity: string
  fatherCaste: string
  fatherCountry: string
  fatherProfession: string
  fatherInfo: string
  motherReligion: string
  motherEthnicity: string
  motherCaste: string
  motherCountry: string
  motherProfession: string
  motherInfo: string
  photos: string[]
  horoscopePrivacy: boolean
  horoscopePdfUrl: string
  horoscopePdfName: string
  plan: string
  phone: string
  email?: string
  password?: string
}

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  displayFormat: '',
  gender: '',
  birthYear: '',
  birthMonth: '',
  birthDay: '',
  religion: '',
  ethnicity: '',
  height: '',
  civilStatus: '',
  country: '',
  district: '',
  city: '',
  visaType: '',
  education: '',
  profession: '',
  drinking: '',
  smoking: '',
  food: '',
  differentlyAbled: false,
  horoscopeRequired: false,
  horoscopeBirthYear: '',
  horoscopeBirthMonth: '',
  horoscopeBirthDay: '',
  birthTime: '',
  birthCountry: '',
  birthCity: '',
  description: '',
  fatherReligion: '',
  fatherEthnicity: '',
  fatherCaste: '',
  fatherCountry: '',
  fatherProfession: '',
  fatherInfo: '',
  motherReligion: '',
  motherEthnicity: '',
  motherCaste: '',
  motherCountry: '',
  motherProfession: '',
  motherInfo: '',
  photos: [],
  horoscopePrivacy: true,
  horoscopePdfUrl: '',
  horoscopePdfName: '',
  plan: 'standard',
  phone: '',
  email: '',
  password: '',
}

function mapProfileToFormData(profile: Record<string, any>): FormData {
  return {
    ...initialForm,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    displayFormat: profile.display_format || '',
    gender: profile.gender || '',
    birthYear: profile.birth_year || '',
    birthMonth: profile.birth_month || '',
    birthDay: profile.birth_day || '',
    religion: profile.religion || '',
    ethnicity: profile.ethnicity || '',
    height: profile.height || '',
    civilStatus: profile.civil_status || '',
    country: profile.country || '',
    district: profile.district || '',
    city: profile.city || '',
    visaType: profile.visa_type || '',
    education: profile.education || '',
    profession: profile.profession || '',
    drinking: profile.drinking || '',
    smoking: profile.smoking || '',
    food: profile.food || '',
    differentlyAbled: Boolean(profile.differently_abled),
    horoscopeRequired: Boolean(profile.horoscope_required),
    birthTime: profile.birth_time || '',
    birthCountry: profile.birth_country || '',
    birthCity: profile.birth_city || '',
    description: profile.description || '',
    plan: profile.plan || 'standard',
    fatherReligion: profile.parent_info?.father_religion || '',
    fatherEthnicity: profile.parent_info?.father_ethnicity || '',
    fatherCaste: profile.parent_info?.father_caste || '',
    fatherCountry: profile.parent_info?.father_country || '',
    fatherProfession: profile.parent_info?.father_profession || '',
    fatherInfo: profile.parent_info?.father_info || '',
    motherReligion: profile.parent_info?.mother_religion || '',
    motherEthnicity: profile.parent_info?.mother_ethnicity || '',
    motherCaste: profile.parent_info?.mother_caste || '',
    motherCountry: profile.parent_info?.mother_country || '',
    motherProfession: profile.parent_info?.mother_profession || '',
    motherInfo: profile.parent_info?.mother_info || '',
    horoscopeBirthYear: profile.horoscope?.birth_year || '',
    horoscopeBirthMonth: profile.horoscope?.birth_month || '',
    horoscopeBirthDay: profile.horoscope?.birth_day || '',
    horoscopePrivacy: profile.horoscope?.privacy !== false,
    horoscopePdfUrl: profile.horoscope?.pdf_url || '',
    horoscopePdfName: profile.horoscope?.pdf_url ? 'Existing horoscope PDF' : '',
    photos: Array.isArray(profile.photos) ? profile.photos.map((photo: any) => photo.url).filter(Boolean) : [],
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read file'))
    reader.readAsDataURL(file)
  })
}

const years = Array.from({ length: 46 }, (_, i) => 1980 + i)
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const days = Array.from({ length: 31 }, (_, i) => i + 1)

type FormSectionProps = {
  icon: ElementType
  title: string
  children: ReactNode
  isFirst?: boolean
  isLast?: boolean
}

function FormSection({
  icon: Icon,
  title,
  children,
  isFirst = false,
  isLast = false,
}: FormSectionProps) {
  return (
    <div className="relative pl-8 md:pl-10 pb-8 last:pb-0">
      {!isFirst && (
        <div className="absolute left-[19px] md:left-[23px] top-0 w-0.5 h-8 bg-gold/30" />
      )}
      {!isLast && (
        <div className="absolute left-[19px] md:left-[23px] top-12 bottom-0 w-0.5 border-l-2 border-dashed border-gold/30" />
      )}

      <div className="absolute left-0 top-2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold flex items-center justify-center shadow-gold z-10">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-light-border">
        <h3 className="text-xl font-semibold mb-6">{title}</h3>
        {children}
      </div>
    </div>
  )
}

export default function ProfileCreation() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const isEditMode = location.pathname === '/profile-edit'
  const skipPhoneVerification = true
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [phoneOtp, setPhoneOtp] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(skipPhoneVerification)
  const [verificationToken, setVerificationToken] = useState(skipPhoneVerification ? 'skip-phone-verification' : '')
  const [verificationMessage, setVerificationMessage] = useState('')
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(isEditMode)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [horoscopePdfFile, setHoroscopePdfFile] = useState<File | null>(null)
  const photoInputRef = useRef<HTMLInputElement | null>(null)
  const horoscopeInputRef = useRef<HTMLInputElement | null>(null)
  const translatedSteps = steps.map((step) => ({ label: t(`profileCreation.steps.${step.key}`) }))

  useEffect(() => {
    if (!isEditMode) {
      return
    }

    const loadProfile = async () => {
      const token = localStorage.getItem('dehadak_auth')
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 400 || response.status === 401) {
            localStorage.removeItem('dehadak_auth')
            navigate('/login', { replace: true })
            return
          }

          throw new Error(data.error || 'Unable to load your profile')
        }

        setFormData(mapProfileToFormData(data))
        setPhoneVerified(true)
      } catch (error) {
        console.error(error)
        setVerificationMessage('Unable to load your profile for editing.')
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [isEditMode, navigate])

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => {
      if (field === 'phone') {
        if (!skipPhoneVerification) {
          setPhoneVerified(false)
          setVerificationToken('')
          setVerificationMessage('')
          setPhoneOtp('')
        }
      }

      return { ...prev, [field]: value }
    })
  }

  const buildProfilePayload = () => {
    const { photos, horoscopePdfUrl, horoscopePdfName, ...payload } = formData
    return payload
  }

  const nextStep = () => {
    if (!skipPhoneVerification && !phoneVerified) {
      setVerificationMessage('Verify your phone number before continuing.')
      return
    }

    if (currentStep < 4) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else if (currentStep === 4) {
      submitProfile()
    }
  }

  const submitProfile = async () => {
    if (isEditMode) {
      try {
        const token = localStorage.getItem('dehadak_auth')
        if (!token) {
          navigate('/login')
          return
        }

        const profileRes = await fetch(`${API_BASE_URL}/api/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(buildProfilePayload()),
        })

        const profileData = await profileRes.json()

        if (profileRes.ok) {
          await uploadSelectedFiles(token)
          alert(profileData.message || 'Profile updated successfully')
          navigate('/profile')
        } else {
          alert(profileData.error || 'Failed to update profile')
        }
      } catch (err) {
        console.error(err)
        alert('An error occurred while updating your profile')
      }
      return
    }

    if (!skipPhoneVerification && (!phoneVerified || !verificationToken)) {
      alert('Please verify your phone number before registering')
      return
    }

    try {
      // 1. Register user
      const authRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          phone: skipPhoneVerification ? (formData.phone.trim() || null) : formData.phone,
          verificationToken,
        })
      })
      const authData = await authRes.json()

      if (!authRes.ok) {
        alert(authData.error || 'Registration failed')
        return
      }

      localStorage.setItem('dehadak_auth', authData.token)

      // 2. Create profile
      const profileRes = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`
        },
        body: JSON.stringify(buildProfilePayload())
      })

      if (profileRes.ok) {
        await uploadSelectedFiles(authData.token)
        alert(`Registration successful! Your Ad ID is: ${authData.adId || 'DH-NEW'}`)
        navigate('/')
      } else {
        const errorData = await profileRes.json()
        alert(errorData.error || 'Failed to create profile')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred during registration')
    }
  }

  const uploadSelectedFiles = async (token: string) => {
    const uploadTasks: Promise<Response>[] = []

    if (photoFiles.length > 0) {
      const photoFormData = new FormData()
      photoFiles.slice(0, 6).forEach((file) => {
        photoFormData.append('photos', file)
      })

      uploadTasks.push(fetch(`${API_BASE_URL}/api/profile/photos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: photoFormData,
      }))
    }

    if (horoscopePdfFile) {
      const horoscopeFormData = new FormData()
      horoscopeFormData.append('pdf', horoscopePdfFile)

      uploadTasks.push(fetch(`${API_BASE_URL}/api/profile/horoscope-pdf`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: horoscopeFormData,
      }))
    }

    if (uploadTasks.length === 0) {
      return
    }

    const results = await Promise.all(uploadTasks)
    const failedUpload = results.find((response) => !response.ok)
    if (failedUpload) {
      const errorText = await failedUpload.text()
      throw new Error(errorText || 'File upload failed')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const requestPhoneOtp = async () => {
    const phone = formData.phone.trim()

    if (!phone) {
      setVerificationMessage('Enter your phone number first.')
      return
    }

    const normalizedPhone = phone.replace(/\s+/g, '')
    const normalizedForBackend = normalizedPhone.startsWith('0')
      ? `+94${normalizedPhone.slice(1)}`
      : normalizedPhone.startsWith('94')
        ? `+${normalizedPhone}`
        : normalizedPhone
    const validSriLankanMobile = /^(\+947\d{8}|07\d{8})$/.test(normalizedPhone)
    if (!validSriLankanMobile) {
      setVerificationMessage('Enter a valid Sri Lankan mobile number like 0771234567 or +94771234567.')
      return
    }

    setVerificationLoading(true)
    setVerificationMessage('Sending code...')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/request-phone-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedForBackend }),
      })

      const data = await response.json()

      if (!response.ok) {
        setVerificationMessage(data.error || 'Unable to send verification code')
        return
      }

      setVerificationMessage(`Code sent to ${data.phone}. Check your SMS inbox.`)
    } catch {
      setVerificationMessage('Unable to send verification code. Please try again.')
    } finally {
      setVerificationLoading(false)
    }
  }

  const verifyPhoneOtp = async () => {
    const phone = formData.phone.trim()
    const normalizedPhone = phone.replace(/\s+/g, '')
    const normalizedForBackend = normalizedPhone.startsWith('0')
      ? `+94${normalizedPhone.slice(1)}`
      : normalizedPhone.startsWith('94')
        ? `+${normalizedPhone}`
        : normalizedPhone

    if (!phone || phoneOtp.trim().length !== 6) {
      setVerificationMessage('Enter the 6-digit code sent to your phone.')
      return
    }

    setVerificationLoading(true)
    setVerificationMessage('Verifying code...')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-phone-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedForBackend, code: phoneOtp }),
      })

      const data = await response.json()

      if (!response.ok) {
        setVerificationMessage(data.error || 'Invalid verification code')
        return
      }

      setPhoneVerified(true)
      setVerificationToken(data.verificationToken)
      setVerificationMessage('Phone verified successfully. You can continue with your account details.')
    } catch {
      setVerificationMessage('Phone verification failed. Please try again.')
    } finally {
      setVerificationLoading(false)
    }
  }

  const handlePhotoUpload = () => {
    photoInputRef.current?.click()
  }

  const handlePhotoFilesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''

    if (files.length === 0) {
      return
    }

    const availableSlots = Math.max(0, 6 - formData.photos.length)
    const selectedFiles = files.slice(0, availableSlots)

    try {
      const uploadedPhotos = await Promise.all(selectedFiles.map((file) => readFileAsDataUrl(file)))
      setPhotoFiles((prev) => [...prev, ...selectedFiles])
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedPhotos],
      }))
    } catch (error) {
      console.error(error)
      alert('Unable to load one or more photos from your device.')
    }
  }

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const handleHoroscopePdfUpload = () => {
    horoscopeInputRef.current?.click()
  }

  const handleHoroscopePdfSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file for the horoscope upload.')
      return
    }

    try {
      const pdfDataUrl = await readFileAsDataUrl(file)
      setHoroscopePdfFile(file)
      setFormData((prev) => ({
        ...prev,
        horoscopePdfUrl: pdfDataUrl,
        horoscopePdfName: file.name,
      }))
    } catch (error) {
      console.error(error)
      alert('Unable to load the PDF from your device.')
    }
  }

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'LKR 1,500',
      duration: '2 Months',
      total: 'LKR 3,000 total',
      features: [
        'Create full profile',
        'Browse all profiles',
        'Send 5 interests/month',
        'Basic search filters',
      ],
    },
    {
      name: 'Standard',
      price: 'LKR 1,667',
      duration: '3 Months',
      total: 'LKR 5,000 total',
      features: [
        'Everything in Basic',
        'Unlimited interests',
        'View contact details',
        'Priority listing',
        'Email support',
      ],
      featured: true,
    },
    {
      name: 'Premium',
      price: 'LKR 2,667',
      duration: '3 Months',
      total: 'LKR 8,000 total',
      features: [
        'Everything in Standard',
        'Horoscope matching',
        'Profile highlighting',
        'Personal match suggestions',
        'Phone support',
      ],
    },
  ]

  const renderStep1 = () => (
    <div className="space-y-2">
      <FormSection icon={User} title="Basic Information" isFirst={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <Input
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <Input
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Display Name Format</label>
            <Select onValueChange={(v) => updateField('displayFormat', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Name only</SelectItem>
                <SelectItem value="last">Last Name only</SelectItem>
                <SelectItem value="full">Full Name</SelectItem>
                <SelectItem value="first-initial">First Name + Initial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <Select onValueChange={(v) => updateField('gender', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Birth Year</label>
            <Select onValueChange={(v) => updateField('birthYear', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Birth Month</label>
            <Select onValueChange={(v) => updateField('birthMonth', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Birth Day</label>
            <Select onValueChange={(v) => updateField('birthDay', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {days.map((d) => (
                  <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Religion</label>
            <Select onValueChange={(v) => updateField('religion', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buddhist">Buddhist</SelectItem>
                <SelectItem value="hindu">Hindu</SelectItem>
                <SelectItem value="catholic">Catholic</SelectItem>
                <SelectItem value="christian">Christian</SelectItem>
                <SelectItem value="islam">Islam</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ethnicity</label>
            <Select onValueChange={(v) => updateField('ethnicity', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sinhalese">Sinhalese</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="muslim">Muslim</SelectItem>
                <SelectItem value="burgher">Burgher</SelectItem>
                <SelectItem value="malay">Malay</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Height</label>
            <Select onValueChange={(v) => updateField('height', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select height" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {Array.from({ length: 36 }, (_, i) => {
                  const ft = Math.floor((48 + i) / 12)
                  const inches = (48 + i) % 12
                  return (
                    <SelectItem key={i} value={`${ft}'${inches}"`}>
                      {ft}' {inches}"
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Civil Status</label>
            <Select onValueChange={(v) => updateField('civilStatus', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never-married">Never Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Privacy Info Box */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Only your first name, last initial, and age will be publicly displayed.
            Full details are only shown to mutual matches.
          </p>
        </div>
      </FormSection>

      <FormSection icon={MapPin} title="Residency">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Country of Residence</label>
            <Select onValueChange={(v) => updateField('country', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lk">Sri Lanka</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="sg">Singapore</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">District / State</label>
            <Select onValueChange={(v) => updateField('district', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="colombo">Colombo</SelectItem>
                <SelectItem value="kandy">Kandy</SelectItem>
                <SelectItem value="galle">Galle</SelectItem>
                <SelectItem value="kurunegala">Kurunegala</SelectItem>
                <SelectItem value="anuradhapura">Anuradhapura</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <Input
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Visa Type</label>
            <Select onValueChange={(v) => updateField('visaType', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select visa type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citizen">Citizen</SelectItem>
                <SelectItem value="pr">Permanent Resident</SelectItem>
                <SelectItem value="work">Work Visa</SelectItem>
                <SelectItem value="student">Student Visa</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection icon={GraduationCap} title="Education & Profession">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Education Level</label>
            <Select onValueChange={(v) => updateField('education', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ol">Up to O/L</SelectItem>
                <SelectItem value="al">Up to A/L</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="master">Master's Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="professional">Professional Qualification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Profession</label>
            <Select onValueChange={(v) => updateField('profession', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT Professional</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
                <SelectItem value="lawyer">Lawyer</SelectItem>
                <SelectItem value="business">Business Owner</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="government">Government Employee</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection icon={Heart} title="Habits & Lifestyle">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Drinking</label>
            <Select onValueChange={(v) => updateField('drinking', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="occasionally">Occasionally</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Smoking</label>
            <Select onValueChange={(v) => updateField('smoking', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="occasionally">Occasionally</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Food Preference</label>
            <Select onValueChange={(v) => updateField('food', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between bg-light-bg rounded-lg px-4 py-3">
            <div>
              <label className="block text-sm font-medium">Differently Abled</label>
              <p className="text-xs text-muted-foreground">Any physical disability</p>
            </div>
            <Switch
              checked={formData.differentlyAbled}
              onCheckedChange={(v) => updateField('differentlyAbled', v)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection icon={Star} title="Horoscope Details">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-light-bg rounded-lg px-4 py-3">
            <div>
              <label className="block text-sm font-medium">Horoscope Matching Required</label>
              <p className="text-xs text-muted-foreground">Enable if you want horoscope-based matching</p>
            </div>
            <Switch
              checked={formData.horoscopeRequired}
              onCheckedChange={(v) => updateField('horoscopeRequired', v)}
            />
          </div>

          {formData.horoscopeRequired && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium mb-2">Birth Year</label>
                <Select onValueChange={(v) => updateField('horoscopeBirthYear', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Birth Month</label>
                <Select onValueChange={(v) => updateField('horoscopeBirthMonth', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m, i) => (
                      <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Birth Day</label>
                <Select onValueChange={(v) => updateField('horoscopeBirthDay', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {days.map((d) => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Birth Time</label>
                <Input
                  value={formData.birthTime}
                  onChange={(e) => updateField('birthTime', e.target.value)}
                  placeholder="e.g. 6:30 AM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Birth Country</label>
                <Select onValueChange={(v) => updateField('birthCountry', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lk">Sri Lanka</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Birth City</label>
                <Input
                  value={formData.birthCity}
                  onChange={(e) => updateField('birthCity', e.target.value)}
                  placeholder="Enter birth city"
                />
              </div>
            </div>
          )}
        </div>
      </FormSection>

      <FormSection icon={FileText} title="About Yourself" isLast={true}>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Tell about yourself, your values, family, future plans and expectations..."
            className="min-h-[150px]"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {formData.description.length}/500 characters
          </p>
        </div>
        <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            This description will be visible on your public profile. Be genuine and concise.
          </p>
        </div>
      </FormSection>
    </div>
  )

  const renderStep2 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Father Card */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-light-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
            <User className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Father</h3>
            <p className="text-sm text-muted-foreground">Family background details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Religion</label>
            <Select onValueChange={(v) => updateField('fatherReligion', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buddhist">Buddhist</SelectItem>
                <SelectItem value="hindu">Hindu</SelectItem>
                <SelectItem value="catholic">Catholic</SelectItem>
                <SelectItem value="christian">Christian</SelectItem>
                <SelectItem value="islam">Islam</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ethnicity</label>
            <Select onValueChange={(v) => updateField('fatherEthnicity', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sinhalese">Sinhalese</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="muslim">Muslim</SelectItem>
                <SelectItem value="burgher">Burgher</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Caste (Optional)</label>
            <Input
              value={formData.fatherCaste}
              onChange={(e) => updateField('fatherCaste', e.target.value)}
              placeholder="Enter caste if applicable"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country of Residence</label>
            <Select onValueChange={(v) => updateField('fatherCountry', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lk">Sri Lanka</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Profession</label>
            <Select onValueChange={(v) => updateField('fatherProfession', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Additional Info (Optional)</label>
            <Textarea
              value={formData.fatherInfo}
              onChange={(e) => updateField('fatherInfo', e.target.value)}
              placeholder="Any other relevant family information..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Mother Card */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-light-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
            <User className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Mother</h3>
            <p className="text-sm text-muted-foreground">Family background details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Religion</label>
            <Select onValueChange={(v) => updateField('motherReligion', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buddhist">Buddhist</SelectItem>
                <SelectItem value="hindu">Hindu</SelectItem>
                <SelectItem value="catholic">Catholic</SelectItem>
                <SelectItem value="christian">Christian</SelectItem>
                <SelectItem value="islam">Islam</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ethnicity</label>
            <Select onValueChange={(v) => updateField('motherEthnicity', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sinhalese">Sinhalese</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="muslim">Muslim</SelectItem>
                <SelectItem value="burgher">Burgher</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Caste (Optional)</label>
            <Input
              value={formData.motherCaste}
              onChange={(e) => updateField('motherCaste', e.target.value)}
              placeholder="Enter caste if applicable"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country of Residence</label>
            <Select onValueChange={(v) => updateField('motherCountry', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lk">Sri Lanka</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Profession</label>
            <Select onValueChange={(v) => updateField('motherProfession', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Additional Info (Optional)</label>
            <Textarea
              value={formData.motherInfo}
              onChange={(e) => updateField('motherInfo', e.target.value)}
              placeholder="Any other relevant family information..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Privacy Banner */}
      <div className="bg-gold/10 border border-gold/20 rounded-xl p-5 flex items-start gap-3">
        <Lock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Your Privacy is Protected
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Photos are only visible after mutual interest is established.
            Your photos are securely stored and never publicly accessible.
          </p>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-light-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
            <Camera className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Upload Photos</h3>
            <p className="text-sm text-muted-foreground">
              Add 3-6 photos to increase your chances
            </p>
          </div>
        </div>

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoFilesSelected}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {formData.photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-gold shadow-md group"
            >
              <img
                src={photo}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark-bg/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {formData.photos.length < 6 && (
            <button
              onClick={handlePhotoUpload}
              className="aspect-square rounded-xl border-2 border-dashed border-light-border hover:border-gold hover:bg-gold/5 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Upload</span>
            </button>
          )}
          {Array.from({ length: Math.max(0, 3 - formData.photos.length - 1) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square rounded-xl border-2 border-dashed border-light-border/50 flex flex-col items-center justify-center gap-2"
            >
              <Camera className="w-8 h-8 text-light-border" />
              <span className="text-sm text-light-border">Photo Slot</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 bg-amber-50 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Upload pictures to view pictures of your matches. Photos should be clear, recent, and appropriate.
          </p>
        </div>
      </div>

      {/* Horoscope Privacy */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-light-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
            <Star className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Horoscope Privacy</h3>
            <p className="text-sm text-muted-foreground">
              Control how your horoscope is shared
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Your horoscope details are only accessible to your mutual matches.
            This ensures your sensitive birth time information remains private.
          </p>
        </div>

        <div className="flex items-center justify-between bg-light-bg rounded-lg px-4 py-3">
          <div>
            <label className="block text-sm font-medium">I want horoscope matching</label>
            <p className="text-xs text-muted-foreground">
              Enable to allow horoscope-based compatibility matching
            </p>
          </div>
          <Switch
            checked={formData.horoscopePrivacy}
            onCheckedChange={(v) => updateField('horoscopePrivacy', v)}
          />
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-light-border p-4 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Upload Horoscope PDF</p>
              <p className="text-xs text-muted-foreground">Select a PDF from your device to attach your horoscope document.</p>
            </div>
            <button
              type="button"
              onClick={handleHoroscopePdfUpload}
              className="px-4 py-2 rounded-xl border border-dark-bg text-dark-bg font-medium hover:bg-light-bg transition"
            >
              Choose PDF
            </button>
          </div>

          <input
            ref={horoscopeInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleHoroscopePdfSelected}
          />

          <div className="mt-3 rounded-lg bg-light-bg px-3 py-2 text-sm text-muted-foreground">
            {formData.horoscopePdfName || 'No PDF selected yet'}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-8">
      {/* Ad ID */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">Your Ad ID</p>
          <p className="text-lg font-bold text-blue-900 mt-1">DH-1165397708</p>
          <p className="text-xs text-blue-600 mt-1">
            Save this ID for future reference and payments
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            onClick={() => updateField('plan', plan.name.toLowerCase())}
            className={`cursor-pointer ${formData.plan === plan.name.toLowerCase() ? 'ring-2 ring-gold rounded-xl' : ''}`}
          >
            <PricingCard {...plan} />
          </div>
        ))}
      </div>

      {/* Account Creation */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-light-border">
        <h3 className="text-xl font-semibold mb-6">Create Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Note */}
      <div className="text-center text-sm text-muted-foreground">
        <p>All plans auto-renew. Cancel anytime.</p>
        <p>One-time payment options also available.</p>
      </div>
    </div>
  )

  const renderPhoneVerification = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-light-border">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Verify Your Phone First</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We send a one-time SMS code before you can create the account and continue with the profile.
            </p>
          </div>
        </div>

        {skipPhoneVerification ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+9476XXXXXXX"
              />
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Phone verification is temporarily skipped for testing. Enter the number and continue.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!formData.phone.trim()) {
                  setVerificationMessage('Enter your phone number before continuing.')
                  return
                }

                setPhoneVerified(true)
                setVerificationToken('skip-phone-verification')
                setDirection(1)
                setCurrentStep(2)
              }}
              className="w-full px-5 py-3 rounded-xl bg-dark-bg text-white font-semibold hover:bg-dark-bg/90 transition"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+9476XXXXXXX"
              />
            </div>
            <button
              type="button"
              onClick={requestPhoneOtp}
              disabled={verificationLoading}
              className="px-5 py-3 rounded-xl bg-gold text-dark-bg font-semibold hover:bg-gold-light transition disabled:opacity-50"
            >
              {verificationLoading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        )}

        {!skipPhoneVerification && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Verification Code</label>
              <InputOTP value={phoneOtp} onChange={setPhoneOtp} maxLength={6}>
                <InputOTPGroup className="gap-2 flex-wrap justify-center md:justify-start">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <button
              type="button"
              onClick={verifyPhoneOtp}
              disabled={verificationLoading}
              className="w-full px-5 py-3 rounded-xl bg-dark-bg text-white font-semibold hover:bg-dark-bg/90 transition disabled:opacity-50"
            >
              {verificationLoading ? 'Verifying...' : 'Verify Phone & Continue'}
            </button>

            {verificationMessage && (
              <div className={`text-sm rounded-lg px-4 py-3 ${phoneVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                {verificationMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-light-bg pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg pt-[72px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold mb-2">
            {isEditMode ? 'Edit Your Profile' : t('profileCreation.title')}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update your details and save the latest version of your profile.' : t('profileCreation.subtitle')}
          </p>
        </div>

        {!isEditMode && !phoneVerified ? (
          renderPhoneVerification()
        ) : (
          <>
            <div className="mb-10">
              <Stepper steps={translatedSteps} currentStep={currentStep} />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
              >
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </motion.div>
            </AnimatePresence>

            <div className="sticky bottom-0 left-0 right-0 mt-10 bg-white/80 backdrop-blur-md border-t border-light-border p-4 -mx-4 sm:-mx-6 md:mx-0 md:rounded-xl md:border md:shadow-lg">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentStep === 1
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-foreground hover:bg-light-bg border border-light-border'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('profileCreation.back')}
                </button>

                <div className="text-sm text-muted-foreground hidden sm:block">
                  {t('profileCreation.stepOf', { current: currentStep, total: 4 })}
                </div>

                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold text-dark-bg font-semibold text-sm hover:bg-gold-light transition-colors shadow-gold hover:shadow-gold-lg"
                >
                  {currentStep === 4
                    ? (isEditMode ? 'Save Changes' : t('profileCreation.completeRegistration'))
                    : t('profileCreation.saveContinue')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
