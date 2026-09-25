import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router'
import {
  Search,
  SlidersHorizontal,
  User,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
} from 'lucide-react'
import ProfileCard, { type PreferenceMatchData } from '@/components/ProfileCard'
import ProfileDetailModal, { formatCandidatePrivacyName } from '@/components/ProfileDetailModal'
import MatchingPreferencesModal from '@/components/MatchingPreferencesModal'
import QuotaUpgradeModal from '@/components/QuotaUpgradeModal'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { API_BASE_URL } from '@/config'
import FinalCTASection from '@/components/home/FinalCTASection'

import { cleanPhotoUrl } from '@/utils/imageUrl'

interface FilterState {
  gender: string
  ageMin: number
  ageMax: number
  countries: string[]
  districts: string[]
  religions: string[]
  ethnicities: string[]
  civilStatuses: string[]
  professions: string[]
  education: string[]
  dietaryHabits: string[]
  drinkingHabits: string[]
  smokingHabits: string[]
  verifiedOnly: boolean
}

interface SearchProfile {
  id: number
  name: string
  age: number
  location: string
  religion: string
  ethnicity: string
  caste?: string
  casteOther?: string
  height: string
  profession: string
  education?: string
  civilStatus?: string
  image: string
  gender?: string
  verified: boolean
  premium: boolean
  packageCode?: string
  packageName?: string
  phoneRevealed?: boolean
  privacyMode: boolean
  interestStatus: 'idle' | 'sending' | 'pending' | 'accepted' | 'declined'
  preferenceMatch?: PreferenceMatchData | null
}

const filterOptions = {
  districts: [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ],
  religion: ['Buddhist', 'Hindu', 'Christian', 'Roman Catholic', 'Islam', 'Other'],
  ethnicity: ['Sinhalese', 'Tamil', 'Muslim', 'Burgher', 'Malay', 'Other'],
  civilStatus: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
  education: [
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate / PhD",
    "Diploma",
    "Professional Qualification",
    "Advanced Level (A/L)",
    "Ordinary Level (O/L)",
    "Other"
  ],
  profession: [
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
  ],
  country: ['Sri Lanka', 'United Arab Emirates', 'United Kingdom', 'Australia', 'United States', 'Canada', 'Qatar', 'Italy'],
  dietaryHabits: [
    'Vegetarian',
    'Vegan',
    'Pescatarian (fish, no other meat)',
    'Non-vegetarian',
    'Other',
    'Prefer not to say',
  ],
  drinkingHabits: [
    'Never drink',
    'Occasionally / Socially',
    'Regularly',
    'Previously drank, now stopped',
    'Prefer not to say',
  ],
  smokingHabits: [
    'Never smoke',
    'Occasionally / Socially',
    'Regularly',
    'Previously smoked, now stopped',
    'Prefer not to say',
  ],
}

// Stable Filter Sidebar Component outside SearchPage to prevent accordion collapse/unmount on checkbox click
interface FilterSidebarProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  toggleArrayFilter: (key: keyof FilterState, value: string) => void
  clearFilters: () => void
  activeFilterCount: number
  inSheet?: boolean
}

function FilterSidebar({
  filters,
  setFilters,
  toggleArrayFilter,
  clearFilters,
  activeFilterCount,
  inSheet = false,
}: FilterSidebarProps) {
  return (
    <div className="space-y-4">
      {!inSheet && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif font-bold text-lg text-[#1C1412]">Refine Search</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-[#E5A93C] hover:underline"
            >
              Clear All ({activeFilterCount})
            </button>
          )}
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={[
          'Looking For',
          'Marital Status',
          'Age Range',
          'District / Location',
          'Religion',
          'Education',
          'Profession',
        ]}
        className="space-y-1"
      >
        {/* Looking For */}
        <AccordionItem value="Looking For" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            Looking For
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="flex gap-2">
              {[
                { key: 'female', label: 'Bride' },
                { key: 'male', label: 'Groom' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      gender: prev.gender === key ? '' : key,
                    }))
                  }
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    filters.gender === key
                      ? 'border-[#E5A93C] bg-[#E5A93C] text-[#1C1412] shadow-sm'
                      : 'border-[#EADFCF] bg-white text-[#1C1412]/80 hover:border-[#E5A93C]/50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Marital Status */}
        <AccordionItem value="Marital Status" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            Marital Status
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-2">
              {filterOptions.civilStatus.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2.5 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                >
                  <input
                    type="checkbox"
                    checked={filters.civilStatuses.includes(status)}
                    onChange={() => toggleArrayFilter('civilStatuses', status)}
                    className="w-4 h-4 rounded accent-[#E5A93C] text-[#E5A93C] focus:ring-[#E5A93C]"
                  />
                  <span className="font-medium">{status}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Age Range */}
        <AccordionItem value="Age Range" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            Age Range
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-[#1C1412]/60 mb-1 block">
                    From
                  </label>
                  <Input
                    type="number"
                    min="18"
                    max="80"
                    value={filters.ageMin}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        ageMin: Number(e.target.value),
                      }))
                    }
                    className="h-8 text-xs rounded-lg"
                  />
                </div>
                <span className="text-gray-400 mt-4">-</span>
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-[#1C1412]/60 mb-1 block">
                    To
                  </label>
                  <Input
                    type="number"
                    min="18"
                    max="80"
                    value={filters.ageMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        ageMax: Number(e.target.value),
                      }))
                    }
                    className="h-8 text-xs rounded-lg"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* District / Location */}
        <AccordionItem value="District / Location" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            District / Location
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scroll pr-1">
              {filterOptions.districts.map((dist) => (
                <label
                  key={dist}
                  className="flex items-center gap-2.5 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                >
                  <input
                    type="checkbox"
                    checked={filters.districts.includes(dist)}
                    onChange={() => toggleArrayFilter('districts', dist)}
                    className="w-4 h-4 rounded accent-[#E5A93C] text-[#E5A93C] focus:ring-[#E5A93C]"
                  />
                  <span className="font-medium">{dist}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Religion */}
        <AccordionItem value="Religion" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            Religion
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-2">
              {filterOptions.religion.map((rel) => (
                <label
                  key={rel}
                  className="flex items-center gap-2.5 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                >
                  <input
                    type="checkbox"
                    checked={filters.religions.includes(rel)}
                    onChange={() => toggleArrayFilter('religions', rel)}
                    className="w-4 h-4 rounded accent-[#E5A93C] text-[#E5A93C] focus:ring-[#E5A93C]"
                  />
                  <span className="font-medium">{rel}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="Education" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            Education
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scroll pr-1">
              {filterOptions.education.map((edu) => (
                <label
                  key={edu}
                  className="flex items-center gap-2.5 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                >
                  <input
                    type="checkbox"
                    checked={filters.education.includes(edu)}
                    onChange={() => toggleArrayFilter('education', edu)}
                    className="w-4 h-4 rounded accent-[#E5A93C] text-[#E5A93C] focus:ring-[#E5A93C]"
                  />
                  <span className="font-medium">{edu}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Profession */}
        <AccordionItem value="Profession" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            Profession
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scroll pr-1">
              {filterOptions.profession.map((prof) => (
                <label
                  key={prof}
                  className="flex items-center gap-2.5 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                >
                  <input
                    type="checkbox"
                    checked={filters.professions.includes(prof)}
                    onChange={() => toggleArrayFilter('professions', prof)}
                    className="w-4 h-4 rounded accent-[#E5A93C] text-[#E5A93C] focus:ring-[#E5A93C]"
                  />
                  <span className="font-medium">{prof}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dietary Habits */}
        <AccordionItem value="Dietary Habits" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            Dietary Habits (Optional)
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-2">
              {filterOptions.dietaryHabits.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2.5 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                >
                  <input
                    type="checkbox"
                    checked={filters.dietaryHabits.includes(item)}
                    onChange={() => toggleArrayFilter('dietaryHabits', item)}
                    className="w-4 h-4 rounded accent-[#E5A93C] text-[#E5A93C] focus:ring-[#E5A93C]"
                  />
                  <span className="font-medium">{item}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Drinking Habits */}
        <AccordionItem value="Drinking Habits" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            Drinking Habits (Optional)
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-2">
              {filterOptions.drinkingHabits.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2.5 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                >
                  <input
                    type="checkbox"
                    checked={filters.drinkingHabits.includes(item)}
                    onChange={() => toggleArrayFilter('drinkingHabits', item)}
                    className="w-4 h-4 rounded accent-[#E5A93C] text-[#E5A93C] focus:ring-[#E5A93C]"
                  />
                  <span className="font-medium">{item}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Smoking Habits */}
        <AccordionItem value="Smoking Habits" className="border-b border-[#EADFCF]/60">
          <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[#1C1412] hover:no-underline py-3">
            Smoking Habits (Optional)
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-2">
              {filterOptions.smokingHabits.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2.5 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                >
                  <input
                    type="checkbox"
                    checked={filters.smokingHabits.includes(item)}
                    onChange={() => toggleArrayFilter('smokingHabits', item)}
                    className="w-4 h-4 rounded accent-[#E5A93C] text-[#E5A93C] focus:ring-[#E5A93C]"
                  />
                  <span className="font-medium">{item}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedProfileId, setSelectedProfileId] = useState<string | number | null>(() => {
    return searchParams.get('profileId')
  })

  useEffect(() => {
    const pId = searchParams.get('profileId')
    if (pId) {
      setSelectedProfileId(pId)
    }
  }, [searchParams])

  const handleOpenProfileModal = (id: string | number) => {
    setSelectedProfileId(id)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('profileId', String(id))
        return next
      },
      { replace: true }
    )
  }

  const handleCloseProfileModal = () => {
    setSelectedProfileId(null)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('profileId')
        return next
      },
      { replace: true }
    )
  }

  const [filters, setFilters] = useState<FilterState>(() => {
    const genderParam = searchParams.get('gender') || ''
    const minAgeParam = searchParams.get('minAge') || searchParams.get('ageMin') || '18'
    const maxAgeParam = searchParams.get('maxAge') || searchParams.get('ageMax') || '60'
    const districtParam = searchParams.get('district')
    const religionParam = searchParams.get('religion')
    const civilStatusParam = searchParams.get('civilStatus')
    const educationParam = searchParams.get('education')
    const professionParam = searchParams.get('profession')
    const countryParam = searchParams.get('country')
    const dietaryParam = searchParams.get('dietaryHabits') || searchParams.get('dietary')
    const drinkingParam = searchParams.get('drinkingHabits') || searchParams.get('drinking')
    const smokingParam = searchParams.get('smokingHabits') || searchParams.get('smoking')

    return {
      gender: genderParam,
      ageMin: Number(minAgeParam) || 18,
      ageMax: Number(maxAgeParam) || 60,
      countries: countryParam ? [countryParam] : [],
      districts: districtParam ? [districtParam] : [],
      religions: religionParam ? [religionParam] : [],
      ethnicities: [],
      civilStatuses: civilStatusParam ? [civilStatusParam] : [],
      professions: professionParam ? [professionParam] : [],
      education: educationParam ? [educationParam] : [],
      dietaryHabits: dietaryParam ? dietaryParam.split(',') : [],
      drinkingHabits: drinkingParam ? drinkingParam.split(',') : [],
      smokingHabits: smokingParam ? smokingParam.split(',') : [],
      verifiedOnly: false,
    }
  })

  const [viewerMatchContext, setViewerMatchContext] = useState<any>(null)
  const [prefModalOpen, setPrefModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState(() => searchParams.get('sortBy') || (localStorage.getItem('dehadak_auth') ? 'recommended' : 'latest'))
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [profiles, setProfiles] = useState<SearchProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [quotaModal, setQuotaModal] = useState<{
    isOpen: boolean
    feature?: 'SEND_INTEREST' | 'ACCEPT_INTEREST' | 'MESSAGING_CONNECTION' | 'PREFERENCE_MATCH' | 'CONTACT_REVEAL'
    message?: string
  }>({ isOpen: false })
  const PROFILES_PER_PAGE = 9

  // Immediate cleanup on logout
  useEffect(() => {
    const handleLogout = () => {
      setViewerMatchContext(null)
      setProfiles((prev) =>
        prev.map((p) => ({
          ...p,
          preferenceMatch: null,
        }))
      )
      setSortBy('latest')
    }
    window.addEventListener('dehadak:logout', handleLogout)
    return () => {
      window.removeEventListener('dehadak:logout', handleLogout)
    }
  }, [])

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.gender) queryParams.append('gender', filters.gender)
      if (filters.ageMin) queryParams.append('ageMin', filters.ageMin.toString())
      if (filters.ageMax) queryParams.append('ageMax', filters.ageMax.toString())
      if (filters.districts.length > 0) queryParams.append('districts', filters.districts.join(','))
      if (filters.religions.length > 0) queryParams.append('religions', filters.religions.join(','))
      if (filters.civilStatuses.length > 0) queryParams.append('civilStatuses', filters.civilStatuses.join(','))
      if (filters.countries.length > 0) queryParams.append('countries', filters.countries.join(','))
      if (filters.education.length > 0) queryParams.append('education', filters.education.join(','))
      if (filters.professions.length > 0) queryParams.append('professions', filters.professions.join(','))
      if (filters.dietaryHabits.length > 0) queryParams.append('dietaryHabits', filters.dietaryHabits.join(','))
      if (filters.drinkingHabits.length > 0) queryParams.append('drinkingHabits', filters.drinkingHabits.join(','))
      if (filters.smokingHabits.length > 0) queryParams.append('smokingHabits', filters.smokingHabits.join(','))
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim())
      if (sortBy) queryParams.append('sortBy', sortBy)

      const token = localStorage.getItem('dehadak_auth')
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`${API_BASE_URL}/api/search?${queryParams.toString()}`, { headers })
      const data = await res.json()

      if (res.ok && data.profiles && Array.isArray(data.profiles)) {
        setViewerMatchContext(data.viewerMatchContext || null)
        const mappedProfiles: SearchProfile[] = data.profiles.map((p: any) => {
          const isPhotoPrivate = Boolean(p.photo_private || p.photo_privacy === 0 || p.photo_privacy === false)
          const rawPhoto = p.photos && p.photos.length > 0 ? (p.photos[0]?.url || p.photos[0]) : (p.avatar_url || '')
          const cleanedPhoto = cleanPhotoUrl(rawPhoto)
          const finalPhotoUrl = (!isPhotoPrivate && cleanedPhoto) ? cleanedPhoto : ''

          let loc = 'Sri Lanka'
          if (p.country && p.country !== 'Sri Lanka') {
            loc = p.city && p.city !== p.country ? `${p.city}, ${p.country}` : p.country
          } else if (p.district && p.district !== 'Overseas') {
            loc = `${p.district}, Sri Lanka`
          }

          const currentYear = new Date().getFullYear()
          const birthYear = p.birth_year ? Number(p.birth_year) : 1998
          const calculatedAge = currentYear - birthYear

          return {
            id: p.id,
            name: formatCandidatePrivacyName(p.first_name, p.last_name, p.name),
            age: calculatedAge > 18 ? calculatedAge : 24,
            location: loc,
            religion: p.religion || 'Buddhist',
            ethnicity: p.ethnicity || 'Sinhalese',
            caste: p.caste || '',
            casteOther: p.caste_other || '',
            height: p.height || "5'6\"",
            profession: p.profession || 'Professional',
            education: p.education || 'Graduate',
            civilStatus: p.civil_status || 'Never Married',
            gender: p.gender || 'female',
            image: finalPhotoUrl,
            verified: p.verification_status === 'VERIFIED',
            premium: (p.plan || '').toLowerCase() === 'premium' || (p.plan || '').toLowerCase() === 'vip',
            packageCode: p.package_code,
            packageName: p.package_badge,
            phoneRevealed: Boolean(p.phone_revealed),
            privacyMode: isPhotoPrivate,
            interestStatus: (p.interest_status as any) || 'idle',
            preferenceMatch: p.preference_match || null,
          }
        })
        setProfiles(mappedProfiles)
      } else {
        setProfiles([])
      }
    } catch (err) {
      console.error('Fetch search error:', err)
      setProfiles([])
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, searchQuery])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy, searchQuery])

  const totalPages = Math.ceil(profiles.length / PROFILES_PER_PAGE)
  const startIndex = (currentPage - 1) * PROFILES_PER_PAGE
  const currentProfiles = profiles.slice(startIndex, startIndex + PROFILES_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
    const el = document.getElementById('search-results-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const current = prev[key] as string[]
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
      return { ...prev, [key]: updated }
    })
  }

  const clearFilters = () => {
    setFilters({
      gender: '',
      ageMin: 18,
      ageMax: 60,
      countries: [],
      districts: [],
      religions: [],
      ethnicities: [],
      civilStatuses: [],
      professions: [],
      education: [],
      dietaryHabits: [],
      drinkingHabits: [],
      smokingHabits: [],
      verifiedOnly: false,
    })
    setSearchQuery('')
  }

  const activeFilterCount = Object.values(filters).filter((v) => {
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'boolean') return v
    if (typeof v === 'string') return v !== ''
    if (typeof v === 'number') return v !== 18 && v !== 60
    return false
  }).length

  const getAuthToken = () => localStorage.getItem('dehadak_auth')

  const handleSendInterest = async (profile: SearchProfile) => {
    const token = getAuthToken()
    if (!token) {
      window.dispatchEvent(
        new CustomEvent('open-auth-prompt', {
          detail: { memberName: profile.name, profileId: profile.id },
        })
      )
      return
    }

    if (profile.interestStatus !== 'idle') {
      return
    }

    setProfiles((current) =>
      current.map((item) =>
        item.id === profile.id ? { ...item, interestStatus: 'sending' } : item
      )
    )

    try {
      const response = await fetch(`${API_BASE_URL}/api/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: profile.id }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401) {
        localStorage.removeItem('dehadak_auth')
        window.dispatchEvent(new CustomEvent('open-register-modal'))
        throw new Error('Please log in again')
      }

      if (response.status === 409) {
        setProfiles((current) =>
          current.map((item) =>
            item.id === profile.id
              ? {
                  ...item,
                  interestStatus: (data.status || 'pending') as SearchProfile['interestStatus'],
                }
              : item
          )
        )
        return
      }

      if (response.status === 403 && data.code === 'PACKAGE_LIMIT_REACHED') {
        setQuotaModal({
          isOpen: true,
          feature: 'SEND_INTEREST',
          message: data.message || data.error || 'You have reached your sent interest limit. Upgrade your package to send more interest requests.',
        })
        setProfiles((current) =>
          current.map((item) =>
            item.id === profile.id ? { ...item, interestStatus: 'idle' } : item
          )
        )
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Unable to send interest')
      }

      setProfiles((current) =>
        current.map((item) =>
          item.id === profile.id ? { ...item, interestStatus: 'pending' } : item
        )
      )
    } catch (error) {
      console.error(error)
      setProfiles((current) =>
        current.map((item) =>
          item.id === profile.id ? { ...item, interestStatus: 'idle' } : item
        )
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-32 selection:bg-[#E5A93C]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCF] shadow-card mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-xs font-bold uppercase tracking-wider text-[#9B6B15] mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Sri Lanka's Verified Matrimonial Database</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1412] tracking-tight">
                Find Your <span className="text-[#9B6B15]">Life Partner</span>
              </h1>
              <p className="text-sm text-[#1C1412]/70 mt-1 max-w-xl">
                Browse verified proposals from all 25 districts of Sri Lanka and global expat communities.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, district, job..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] text-xs sm:text-sm text-[#1C1412] focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 outline-none shadow-xs"
                />
              </div>

              {/* Mobile Filter Sheet Trigger */}
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden px-4 py-2.5 rounded-2xl bg-[#E5A93C] text-[#1C1412] flex items-center gap-1.5 text-xs font-bold shadow-gold">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto bg-white p-6">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-lg font-bold text-[#1C1412]">
                      Search Filters
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <FilterSidebar
                      filters={filters}
                      setFilters={setFilters}
                      toggleArrayFilter={toggleArrayFilter}
                      clearFilters={clearFilters}
                      activeFilterCount={activeFilterCount}
                      inSheet
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="mt-6 pt-5 border-t border-[#EADFCF]/60 flex items-center gap-2 overflow-x-auto custom-scroll pb-1">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, gender: '' }))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filters.gender === ''
                  ? 'bg-[#1C1412] text-white shadow-sm'
                  : 'bg-[#FAF6F0] text-[#1C1412]/80 hover:bg-[#EADFCF]/50 border border-[#EADFCF]'
              }`}
            >
              All Profiles
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, gender: 'female' }))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                filters.gender === 'female'
                  ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                  : 'bg-[#FAF6F0] text-[#1C1412]/80 hover:bg-[#EADFCF]/50 border border-[#EADFCF]'
              }`}
            >
              <span>Brides</span>
              <span>👰</span>
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, gender: 'male' }))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                filters.gender === 'male'
                  ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                  : 'bg-[#FAF6F0] text-[#1C1412]/80 hover:bg-[#EADFCF]/50 border border-[#EADFCF]'
              }`}
            >
              <span>Grooms</span>
              <span>🤵</span>
            </button>
            <button
              onClick={() => toggleArrayFilter('districts', 'Colombo')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filters.districts.includes('Colombo')
                  ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                  : 'bg-[#FAF6F0] text-[#1C1412]/80 hover:bg-[#EADFCF]/50 border border-[#EADFCF]'
              }`}
            >
              Colombo 🏙️
            </button>
            <button
              onClick={() => toggleArrayFilter('districts', 'Kandy')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filters.districts.includes('Kandy')
                  ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                  : 'bg-[#FAF6F0] text-[#1C1412]/80 hover:bg-[#EADFCF]/50 border border-[#EADFCF]'
              }`}
            >
              Kandy ⛰️
            </button>
            <button
              onClick={() => toggleArrayFilter('religions', 'Buddhist')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filters.religions.includes('Buddhist')
                  ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                  : 'bg-[#FAF6F0] text-[#1C1412]/80 hover:bg-[#EADFCF]/50 border border-[#EADFCF]'
              }`}
            >
              Buddhist ☸️
            </button>
            <button
              onClick={() => toggleArrayFilter('education', 'Degree')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filters.education.includes('Degree')
                  ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                  : 'bg-[#FAF6F0] text-[#1C1412]/80 hover:bg-[#EADFCF]/50 border border-[#EADFCF]'
              }`}
            >
              Degree Holders 🎓
            </button>
            <button
              onClick={() => toggleArrayFilter('countries', 'United Arab Emirates')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filters.countries.includes('United Arab Emirates')
                  ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                  : 'bg-[#FAF6F0] text-[#1C1412]/80 hover:bg-[#EADFCF]/50 border border-[#EADFCF]'
              }`}
            >
              Overseas Expats 🌍
            </button>
            <button
              onClick={() => toggleArrayFilter('civilStatuses', 'Never Married')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filters.civilStatuses.includes('Never Married')
                  ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                  : 'bg-[#FAF6F0] text-[#1C1412]/80 hover:bg-[#EADFCF]/50 border border-[#EADFCF]'
              }`}
            >
              Never Married 💍
            </button>
          </div>
        </div>

        {/* Layout: Sidebar (3 cols) + Results (9 cols) */}
        <div id="search-results-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Desktop Left Sidebar - Equal Height with 3 Rows of Profiles */}
          <div className="hidden lg:flex flex-col h-full lg:col-span-3 bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-card">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#EADFCF]/60 shrink-0">
              <h3 className="font-serif font-bold text-lg text-[#1C1412]">Refine Search</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-[#E5A93C] hover:underline cursor-pointer"
                >
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto pr-1.5 custom-scroll">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                toggleArrayFilter={toggleArrayFilter}
                clearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
                inSheet={true}
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-9 flex flex-col justify-between space-y-6">
            {/* Guest / Incomplete Profile Notice Banner */}
            {!getAuthToken() ? (
              <div className="bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 rounded-2xl p-4 border border-[#EADFCF] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-[#E5A93C]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#1C1412] text-sm">
                      Log in or create an account to see your matches
                    </h4>
                    <p className="text-xs text-[#1C1412]/70">
                      Personalized preference match scores and custom matching criteria are exclusively available for registered members.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-register-modal'))}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                >
                  Sign In / Register
                </button>
              </div>
            ) : viewerMatchContext && !viewerMatchContext.canMatch ? (
              <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#1C1412] text-sm">
                      Complete your profile to see your matches
                    </h4>
                    <p className="text-xs text-amber-800/80">
                      Please provide your missing profile information (Age, Height, Religion, or Marital Status) so we can accurately calculate preference matches.
                    </p>
                  </div>
                </div>
                <a
                  href="/profile"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold shrink-0 transition-colors shadow-xs"
                >
                  Complete Profile
                </a>
              </div>
            ) : null}

            {/* Sort & Count Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#EADFCF] shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1C1412] text-sm">
                    {loading
                      ? 'Searching profiles...'
                      : `${profiles.length} Profiles Found ${
                          totalPages > 1 ? `• Page ${currentPage} of ${totalPages}` : ''
                        }`}
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#9B6B15] font-bold text-[10px]">
                      {activeFilterCount} active filters
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {getAuthToken() && viewerMatchContext?.canMatch && (
                    <button
                      onClick={() => setPrefModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5A93C]/40 bg-[#E5A93C]/10 text-[#9B6B15] hover:bg-[#E5A93C]/20 font-bold text-xs transition-all cursor-pointer shadow-xs"
                      title="Customize your matching preferences"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Matching Preferences</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-[#1C1412]/60 font-medium">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="font-bold text-[#1C1412] bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#EADFCF] outline-none cursor-pointer text-xs"
                    >
                      {getAuthToken() && viewerMatchContext?.canMatch && (
                        <option value="recommended">Recommended for You</option>
                      )}
                      <option value="latest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="age_asc">Age: Low to High</option>
                      <option value="age_desc">Age: High to Low</option>
                      <option value="height_asc">Height: Low to High</option>
                      <option value="height_desc">Height: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filter Tags with Instant Remove Pills */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EADFCF]/50">
                  <span className="text-[11px] text-[#1C1412]/60 font-medium mr-1">Active:</span>

                  {filters.gender && (
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, gender: '' }))}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#9B6B15] hover:bg-[#E5A93C]/25 transition-colors"
                    >
                      <span>Gender: {filters.gender === 'female' ? 'Bride' : 'Groom'}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}

                  {filters.districts.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleArrayFilter('districts', d)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#9B6B15] hover:bg-[#E5A93C]/25 transition-colors"
                    >
                      <span>District: {d}</span>
                      <X className="w-3 h-3" />
                    </button>
                  ))}

                  {filters.religions.map((r) => (
                    <button
                      key={r}
                      onClick={() => toggleArrayFilter('religions', r)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#9B6B15] hover:bg-[#E5A93C]/25 transition-colors"
                    >
                      <span>Religion: {r}</span>
                      <X className="w-3 h-3" />
                    </button>
                  ))}

                  {filters.education.map((e) => (
                    <button
                      key={e}
                      onClick={() => toggleArrayFilter('education', e)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#9B6B15] hover:bg-[#E5A93C]/25 transition-colors"
                    >
                      <span>Edu: {e}</span>
                      <X className="w-3 h-3" />
                    </button>
                  ))}

                  {filters.professions.map((p) => (
                    <button
                      key={p}
                      onClick={() => toggleArrayFilter('professions', p)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#9B6B15] hover:bg-[#E5A93C]/25 transition-colors"
                    >
                      <span>Job: {p}</span>
                      <X className="w-3 h-3" />
                    </button>
                  ))}

                  {filters.civilStatuses.map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleArrayFilter('civilStatuses', c)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#9B6B15] hover:bg-[#E5A93C]/25 transition-colors"
                    >
                      <span>Status: {c}</span>
                      <X className="w-3 h-3" />
                    </button>
                  ))}

                  {filters.dietaryHabits.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleArrayFilter('dietaryHabits', item)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#9B6B15] hover:bg-[#E5A93C]/25 transition-colors"
                    >
                      <span>Diet: {item}</span>
                      <X className="w-3 h-3" />
                    </button>
                  ))}

                  {filters.drinkingHabits.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleArrayFilter('drinkingHabits', item)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#9B6B15] hover:bg-[#E5A93C]/25 transition-colors"
                    >
                      <span>Drink: {item}</span>
                      <X className="w-3 h-3" />
                    </button>
                  ))}

                  {filters.smokingHabits.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleArrayFilter('smokingHabits', item)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#9B6B15] hover:bg-[#E5A93C]/25 transition-colors"
                    >
                      <span>Smoke: {item}</span>
                      <X className="w-3 h-3" />
                    </button>
                  ))}

                  <button
                    onClick={clearFilters}
                    className="text-[11px] font-bold text-[#E5A93C] hover:underline ml-1"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Profile Cards Grid (9 profiles max = 3 rows) */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-4 border-[#E5A93C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-[#1C1412]/70">Finding matching profiles...</p>
              </div>
            ) : currentProfiles.length > 0 ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      id={profile.id}
                      name={profile.name}
                      age={profile.age}
                      location={profile.location}
                      religion={profile.religion}
                      ethnicity={profile.ethnicity}
                      caste={profile.caste}
                      height={profile.height}
                      profession={profile.profession}
                      education={profile.education}
                      gender={profile.gender}
                      image={profile.image}
                      verified={profile.verified}
                      premium={profile.premium}
                      packageCode={profile.packageCode}
                      packageName={profile.packageName}
                      privacyMode={profile.privacyMode}
                      interestStatus={profile.interestStatus}
                      preferenceMatch={profile.preferenceMatch}
                      onViewProfile={() => handleOpenProfileModal(profile.id)}
                      onSendInterest={() => handleSendInterest(profile)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-2xl p-4 border border-[#EADFCF] shadow-xs flex flex-wrap items-center justify-between gap-4 mt-6">
                    <div className="text-xs text-[#1C1412]/70 font-medium">
                      Showing <span className="font-bold text-[#1C1412]">{startIndex + 1}</span> -{' '}
                      <span className="font-bold text-[#1C1412]">
                        {Math.min(startIndex + PROFILES_PER_PAGE, profiles.length)}
                      </span>{' '}
                      of <span className="font-bold text-[#1C1412]">{profiles.length}</span> profiles
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-xl border border-[#EADFCF] text-xs font-bold text-[#1C1412] hover:bg-[#FAF6F0] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Prev</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              currentPage === page
                                ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                                : 'border border-[#EADFCF] bg-white text-[#1C1412]/80 hover:bg-[#FAF6F0]'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-xl border border-[#EADFCF] text-xs font-bold text-[#1C1412] hover:bg-[#FAF6F0] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFCF] shadow-card">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#1C1412]">No Profiles Found</h3>
                <p className="text-xs text-[#1C1412]/70 mt-1 max-w-md mx-auto">
                  We couldn't find any profiles matching your exact filter criteria. Try broadening your filters or clearing search keywords.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-5 btn-gold px-6 py-2.5 rounded-xl text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profileId={selectedProfileId}
        isOpen={!!selectedProfileId}
        onClose={handleCloseProfileModal}
        interestStatus={
          profiles.find((p) => String(p.id) === String(selectedProfileId))?.interestStatus || 'idle'
        }
        onSendInterest={(prof) => {
          const found = profiles.find((p) => String(p.id) === String(prof.id))
          if (found) {
            handleSendInterest(found)
          } else {
            handleSendInterest(prof)
          }
        }}
      />

      {/* Matching Preferences Modal */}
      <MatchingPreferencesModal
        isOpen={prefModalOpen}
        onClose={() => setPrefModalOpen(false)}
        onSaved={() => fetchProfiles()}
      />

      {/* Quota Upgrade Modal */}
      <QuotaUpgradeModal
        isOpen={quotaModal.isOpen}
        onClose={() => setQuotaModal({ isOpen: false })}
        feature={quotaModal.feature}
        message={quotaModal.message}
      />

      {/* Video Call to Action Section */}
      <FinalCTASection />
    </div>
  )
}
