import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Check,
  User,
  BadgeCheck,
} from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
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

interface FilterState {
  gender: string
  ageMin: number
  ageMax: number
  countries: string[]
  religions: string[]
  ethnicities: string[]
  civilStatuses: string[]
  professions: string[]
  education: string[]
  drinking: string[]
  smoking: string[]
  food: string[]
  differentlyAbled: string | null
  verifiedOnly: boolean
}

const profiles = [
  {
    name: 'Rukmal S.',
    age: 31,
    location: 'Digana, Sri Lanka',
    religion: 'Buddhist',
    ethnicity: 'Sinhalese',
    height: "5' 10\"",
    profession: 'Engineer',
    image: '/profile-male-1.jpg',
    verified: true,
    premium: false,
  },
  {
    name: 'Dilini P.',
    age: 28,
    location: 'Kandy, Sri Lanka',
    religion: 'Buddhist',
    ethnicity: 'Sinhalese',
    height: "5' 4\"",
    profession: 'Teacher',
    image: '/profile-female-1.jpg',
    verified: true,
    premium: true,
  },
  {
    name: 'Kasun M.',
    age: 33,
    location: 'Colombo, Sri Lanka',
    religion: 'Buddhist',
    ethnicity: 'Sinhalese',
    height: "5' 11\"",
    profession: 'Manager',
    image: '/profile-male-2.jpg',
    verified: true,
    premium: false,
  },
  {
    name: 'Nadeesha W.',
    age: 26,
    location: 'Galle, Sri Lanka',
    religion: 'Buddhist',
    ethnicity: 'Sinhalese',
    height: "5' 3\"",
    profession: 'Doctor',
    image: '/profile-female-2.jpg',
    verified: true,
    premium: true,
  },
  {
    name: 'Tharindu R.',
    age: 29,
    location: 'Negombo, Sri Lanka',
    religion: 'Catholic',
    ethnicity: 'Sinhalese',
    height: "5' 8\"",
    profession: 'IT Professional',
    image: '/profile-male-3.jpg',
    verified: true,
    premium: false,
  },
  {
    name: 'Isuri K.',
    age: 27,
    location: 'Kurunegala, Sri Lanka',
    religion: 'Buddhist',
    ethnicity: 'Sinhalese',
    height: "5' 5\"",
    profession: 'Accountant',
    image: '/profile-female-3.jpg',
    verified: true,
    premium: true,
  },
]

const filterOptions = {
  religion: ['Buddhist', 'Hindu', 'Catholic', 'Christian', 'Islam', 'Other'],
  ethnicity: ['Sinhalese', 'Tamil', 'Muslim', 'Burgher', 'Malay', 'Other'],
  civilStatus: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
  education: [
    'Up to O/L', 'Up to A/L', 'Diploma', "Bachelor's Degree",
    "Master's Degree", 'PhD', 'Professional Qualification',
  ],
  profession: [
    'IT Professional', 'Engineer', 'Doctor', 'Teacher', 'Manager',
    'Accountant', 'Lawyer', 'Business Owner', 'Student', 'Government Employee',
  ],
  country: ['Sri Lanka', 'United States', 'United Kingdom', 'Australia', 'Canada', 'Singapore'],
}

export default function SearchPage() {
  const [filters, setFilters] = useState<FilterState>({
    gender: '',
    ageMin: 18,
    ageMax: 60,
    countries: [],
    religions: [],
    ethnicities: [],
    civilStatuses: [],
    professions: [],
    education: [],
    drinking: [],
    smoking: [],
    food: [],
    differentlyAbled: null,
    verifiedOnly: false,
  })

  const [sortBy, setSortBy] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const current = prev[key] as string[]
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
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
      religions: [],
      ethnicities: [],
      civilStatuses: [],
      professions: [],
      education: [],
      drinking: [],
      smoking: [],
      food: [],
      differentlyAbled: null,
      verifiedOnly: false,
    })
  }

  const activeFilterCount = Object.values(filters).filter((v) => {
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'boolean') return v
    if (typeof v === 'string') return v !== '' && v !== '18' && v !== '60'
    if (typeof v === 'number') return v !== 18 && v !== 60
    return false
  }).length

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <AccordionItem value={title}>
      <AccordionTrigger className="text-sm font-medium hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  )

  const FilterSidebar = ({ inSheet = false }: { inSheet?: boolean }) => (
    <div className="space-y-4">
      {!inSheet && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Filters</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gold hover:text-gold-dark transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      <Accordion type="multiple" defaultValue={['I\'m Looking For']} className="space-y-2">
        {/* Gender */}
        <FilterSection title="I'm Looking For">
          <div className="flex gap-3">
            {['Male', 'Female'].map((g) => (
              <button
                key={g}
                onClick={() => setFilters((prev) => ({ ...prev, gender: prev.gender === g ? '' : g }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  filters.gender === g
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-light-border hover:border-gold/50'
                }`}
              >
                <User className="w-4 h-4" />
                {g}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Age Range */}
        <FilterSection title="Age Range">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">From</label>
                <Input
                  type="number"
                  value={filters.ageMin}
                  onChange={(e) => setFilters((prev) => ({ ...prev, ageMin: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <span className="text-muted-foreground mt-5">-</span>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">To</label>
                <Input
                  type="number"
                  value={filters.ageMax}
                  onChange={(e) => setFilters((prev) => ({ ...prev, ageMax: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
            <input
              type="range"
              min={18}
              max={60}
              value={filters.ageMax}
              onChange={(e) => setFilters((prev) => ({ ...prev, ageMax: Number(e.target.value) }))}
              className="w-full accent-gold"
            />
          </div>
        </FilterSection>

        {/* Religion */}
        <FilterSection title="Religion">
          <div className="space-y-2">
            {filterOptions.religion.map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.religions.includes(r)}
                  onCheckedChange={() => toggleArrayFilter('religions', r)}
                />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Ethnicity */}
        <FilterSection title="Ethnicity">
          <div className="space-y-2">
            {filterOptions.ethnicity.map((e) => (
              <label key={e} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.ethnicities.includes(e)}
                  onCheckedChange={() => toggleArrayFilter('ethnicities', e)}
                />
                <span className="text-sm">{e}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Education */}
        <FilterSection title="Education">
          <div className="space-y-2">
            {filterOptions.education.map((e) => (
              <label key={e} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.education.includes(e)}
                  onCheckedChange={() => toggleArrayFilter('education', e)}
                />
                <span className="text-sm">{e}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Profession */}
        <FilterSection title="Profession">
          <div className="space-y-2">
            {filterOptions.profession.map((p) => (
              <label key={p} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.professions.includes(p)}
                  onCheckedChange={() => toggleArrayFilter('professions', p)}
                />
                <span className="text-sm">{p}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Civil Status */}
        <FilterSection title="Civil Status">
          <div className="space-y-2">
            {filterOptions.civilStatus.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.civilStatuses.includes(s)}
                  onCheckedChange={() => toggleArrayFilter('civilStatuses', s)}
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Differently Abled */}
        <FilterSection title="Differently Abled">
          <div className="flex gap-3">
            {['Yes', 'No'].map((val) => (
              <button
                key={val}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    differentlyAbled: prev.differentlyAbled === val ? null : val,
                  }))
                }
                className={`flex-1 py-2 rounded-lg border-2 text-sm transition-all ${
                  filters.differentlyAbled === val
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-light-border'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Verified Only */}
        <AccordionItem value="verified">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium">Verified Only</span>
            </div>
            <Switch
              checked={filters.verifiedOnly}
              onCheckedChange={(v) => setFilters((prev) => ({ ...prev, verifiedOnly: v }))}
            />
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <div className="min-h-screen bg-light-bg pt-[72px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">Find Your Match</h1>
          <p className="text-muted-foreground">
            Showing {profiles.length} verified profiles
          </p>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, profession, location..."
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-light-border bg-white hover:bg-light-bg transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-gold text-dark-bg text-xs font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[340px] p-4 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterSidebar inSheet={true} />
                <div className="sticky bottom-0 mt-4 pt-4 border-t border-light-border bg-white flex gap-3">
                  <button
                    onClick={() => {
                      clearFilters()
                      setFilterSheetOpen(false)
                    }}
                    className="flex-1 py-3 rounded-xl border border-light-border text-sm font-medium"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setFilterSheetOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-gold text-dark-bg font-semibold text-sm"
                  >
                    Apply
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-light-border bg-white hover:bg-light-bg transition-colors text-sm">
                Sort: {sortBy === 'latest' ? 'Latest' : sortBy === 'popular' ? 'Popular' : 'Near Me'}
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-light-border overflow-hidden hidden group-hover:block z-10">
                {[
                  { value: 'latest', label: 'Latest First' },
                  { value: 'popular', label: 'Popular' },
                  { value: 'near', label: 'Near Me' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-light-bg transition-colors flex items-center justify-between ${
                      sortBy === opt.value ? 'text-gold' : ''
                    }`}
                  >
                    {opt.label}
                    {sortBy === opt.value && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-light-border sticky top-[88px]">
              <FilterSidebar />
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {profiles.map((profile, index) => (
                  <motion.div
                    key={profile.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProfileCard {...profile} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            <div className="mt-10 text-center">
              <button className="px-8 py-3 rounded-xl border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-dark-bg transition-colors">
                Load More Profiles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
