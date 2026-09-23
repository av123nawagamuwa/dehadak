import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import {
  SlidersHorizontal,
  Check,
  Info,
  ChevronRight,
  RotateCcw,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { API_BASE_URL } from '@/config'

const religionList = ['Buddhist', 'Hindu', 'Christian', 'Roman Catholic', 'Islam', 'Other']
const civilStatusList = ['Never Married', 'Divorced', 'Widowed', 'Separated']

export default function MatchingPreferences() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [viewerContext, setViewerContext] = useState<any>(null)

  // Matching Preferences Form State
  const [lookingFor, setLookingFor] = useState('all')
  const [agePrefType, setAgePrefType] = useState('default')
  const [ageMin, setAgeMin] = useState(18)
  const [ageMax, setAgeMax] = useState(50)

  const [heightPrefType, setHeightPrefType] = useState('default')
  const [heightMinCm, setHeightMinCm] = useState(150)
  const [heightMaxCm, setHeightMaxCm] = useState(190)

  const [religionPrefType, setReligionPrefType] = useState('default')
  const [selectedReligions, setSelectedReligions] = useState<string[]>([])

  const [maritalStatusPrefType, setMaritalStatusPrefType] = useState('default')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('dehadak_auth')
      if (!token) {
        navigate('/login')
        return
      }

      const res = await fetch(`${API_BASE_URL}/api/matching/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (res.ok && data) {
        setViewerContext(data)
        const prefs = data.preferences || {}
        setLookingFor(prefs.lookingFor || 'all')

        if (prefs.age) {
          setAgePrefType(prefs.age.type || 'default')
          setAgeMin(prefs.age.min || 18)
          setAgeMax(prefs.age.max || 50)
        }

        if (prefs.height) {
          setHeightPrefType(prefs.height.type || 'default')
          setHeightMinCm(prefs.height.minCm || 150)
          setHeightMaxCm(prefs.height.maxCm || 190)
        }

        if (prefs.religion) {
          setReligionPrefType(prefs.religion.type || 'default')
          setSelectedReligions(prefs.religion.selected || [])
        }

        if (prefs.maritalStatus) {
          setMaritalStatusPrefType(prefs.maritalStatus.type || 'default')
          setSelectedStatuses(prefs.maritalStatus.selected || [])
        }
      } else {
        setError(data.error || 'Failed to load your matching preferences.')
      }
    } catch (err) {
      console.error(err)
      setError('Unable to reach server. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccessMessage('')

    try {
      const token = localStorage.getItem('dehadak_auth')
      if (!token) {
        navigate('/login')
        return
      }

      const payload = {
        lookingFor,
        age: {
          type: agePrefType,
          min: ageMin,
          max: ageMax,
        },
        height: {
          type: heightPrefType,
          minCm: heightMinCm,
          maxCm: heightMaxCm,
        },
        religion: {
          type: religionPrefType,
          selected: selectedReligions,
        },
        maritalStatus: {
          type: maritalStatusPrefType,
          selected: selectedStatuses,
        },
      }

      const res = await fetch(`${API_BASE_URL}/api/matching/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccessMessage('Matching preferences saved successfully!')
        setViewerContext(data)
        setTimeout(() => setSuccessMessage(''), 4000)
      } else {
        setError(data.error || 'Failed to save preferences.')
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while saving your preferences.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    const viewerGender = (viewerContext?.viewerProfile?.gender || '').toLowerCase()
    const isFemale = viewerGender === 'female'
    setLookingFor(isFemale ? 'male' : 'female')
    setAgePrefType(isFemale ? 'older' : 'younger')
    setHeightPrefType(isFemale ? 'taller' : 'shorter')
    setReligionPrefType('same')
    setSelectedReligions([])
    setMaritalStatusPrefType('same')
    setSelectedStatuses([])
  }

  const viewerProfile = viewerContext?.viewerProfile || {}
  const viewerGender = (viewerProfile.gender || '').toLowerCase()
  const isFemale = viewerGender === 'female'
  const isMale = viewerGender === 'male'
  const viewerAge = viewerProfile.age || 26
  const viewerHeightCm = viewerProfile.heightCm || 168
  const viewerReligion = viewerProfile.religion || 'Buddhist'
  const viewerCivilStatus = viewerProfile.civilStatus || 'Never Married'

  const defaultLookingFor = isFemale ? 'male' : 'female'
  const defaultAgePrefType = isFemale ? 'older' : 'younger'
  const defaultHeightPrefType = isFemale ? 'taller' : 'shorter'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#E5A93C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-[#1C1412]/70">Loading matching preferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-32 pb-20 selection:bg-[#E5A93C]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#1C1412]/60">
          <Link to="/" className="hover:text-[#9B6B15] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/profile" className="hover:text-[#9B6B15] transition-colors">
            My Profile
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-[#1C1412]">Matching Preferences</span>
        </nav>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCF] shadow-card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-xs font-bold uppercase tracking-wider text-[#9B6B15] mb-3">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Personalized Algorithm Settings</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1412] tracking-tight">
                Matching <span className="text-[#9B6B15]">Preferences</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#1C1412]/70 mt-1 max-w-xl leading-relaxed">
                Customize the criteria used to calculate your personalized Preference Match scores and Recommended sorting in Search.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#EADFCF] bg-white text-xs font-bold text-[#1C1412] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <Link
                to="/search?sortBy=recommended"
                className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>View Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Active Profile Context Banner */}
          <div className="mt-6 pt-5 border-t border-[#EADFCF]/60 flex flex-wrap items-center gap-2.5 text-xs text-[#5C4B47]">
            <span className="font-semibold text-[#1C1412] mr-1">Your Profile Baseline:</span>
            <span className="px-2.5 py-1 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] font-bold text-[#1C1412]">
              {isFemale ? 'Bride (Female)' : isMale ? 'Groom (Male)' : 'Member'}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] font-bold text-[#1C1412]">
              Age: {viewerAge} yrs
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] font-bold text-[#1C1412]">
              Height: {viewerHeightCm} cm
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] font-bold text-[#1C1412]">
              Religion: {viewerReligion}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] font-bold text-[#1C1412]">
              Status: {viewerCivilStatus}
            </span>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-4 rounded-2xl">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. Seeking Partner (Looking For) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCF] shadow-card space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C1412]">
              1. Seeking Partner (Looking For)
            </h3>
            <p className="text-xs text-[#1C1412]/60 mt-0.5">
              Select which candidates should be prioritized in search results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'female', label: 'Bride (Female)', desc: 'Seeking female partner' },
              { id: 'male', label: 'Groom (Male)', desc: 'Seeking male partner' },
              { id: 'all', label: 'Any / All', desc: 'No gender restriction' },
            ].map((opt) => {
              const selected = lookingFor === opt.id || (lookingFor === 'default' && opt.id === defaultLookingFor)
              return (
                <div
                  key={opt.id}
                  onClick={() => setLookingFor(opt.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selected
                      ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                      : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1C1412]">{opt.label}</span>
                    {selected && <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />}
                  </div>
                  <p className="text-xs text-[#1C1412]/60 mt-1">{opt.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 2. Age Preference (Weight: 55%) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCF] shadow-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#1C1412]">
                  2. Age Preference
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#9B6B15] font-bold text-[11px]">
                  Priority Weight: 55%
                </span>
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-0.5">
                Evaluated against your completed age ({viewerAge} yrs).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Default preference based on profile */}
            <div
              onClick={() => setAgePrefType(defaultAgePrefType)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                agePrefType === defaultAgePrefType || agePrefType === 'default'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">
                  {isFemale ? `Older than me (Over ${viewerAge} yrs)` : `Younger than me (Under ${viewerAge} yrs)`}
                </span>
                {(agePrefType === defaultAgePrefType || agePrefType === 'default') && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Recommended cultural default ({isFemale ? 'older male' : 'younger female'})
              </p>
            </div>

            {/* Reverse preference */}
            <div
              onClick={() => setAgePrefType(isFemale ? 'younger' : 'older')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                agePrefType === (isFemale ? 'younger' : 'older')
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">
                  {isFemale ? `Younger than me (Under ${viewerAge} yrs)` : `Older than me (Over ${viewerAge} yrs)`}
                </span>
                {agePrefType === (isFemale ? 'younger' : 'older') && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Candidate is {isFemale ? 'younger' : 'older'} than you
              </p>
            </div>

            {/* Custom Age Range */}
            <div
              onClick={() => setAgePrefType('range')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                agePrefType === 'range'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">Custom Age Range</span>
                {agePrefType === 'range' && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Between {ageMin} and {ageMax} years old
              </p>
            </div>

            {/* No Restriction */}
            <div
              onClick={() => setAgePrefType('no_preference')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                agePrefType === 'no_preference'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">No Restriction</span>
                {agePrefType === 'no_preference' && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Any adult age receives full 55% points
              </p>
            </div>
          </div>

          {agePrefType === 'range' && (
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] space-y-3">
              <span className="text-xs font-bold text-[#1C1412]">Set Custom Age Range (Years):</span>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-[11px] text-[#1C1412]/60">Minimum Age</label>
                  <Input
                    type="number"
                    min={18}
                    max={ageMax}
                    value={ageMin}
                    onChange={(e) => setAgeMin(Math.max(18, Number(e.target.value)))}
                    className="mt-1 bg-white font-bold"
                  />
                </div>
                <div className="text-[#1C1412]/40 font-bold text-sm mt-5">to</div>
                <div className="flex-1">
                  <label className="text-[11px] text-[#1C1412]/60">Maximum Age</label>
                  <Input
                    type="number"
                    min={ageMin}
                    max={80}
                    value={ageMax}
                    onChange={(e) => setAgeMax(Math.min(80, Number(e.target.value)))}
                    className="mt-1 bg-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Height Preference (Weight: 25%) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCF] shadow-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#1C1412]">
                  3. Height Preference
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#9B6B15] font-bold text-[11px]">
                  Priority Weight: 25%
                </span>
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-0.5">
                Strictly compares candidate height in centimetres against your height ({viewerHeightCm} cm).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Default preference based on profile */}
            <div
              onClick={() => setHeightPrefType(defaultHeightPrefType)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                heightPrefType === defaultHeightPrefType || heightPrefType === 'default'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">
                  {isFemale ? `Taller than me (Taller than ${viewerHeightCm} cm)` : `Shorter than me (Shorter than ${viewerHeightCm} cm)`}
                </span>
                {(heightPrefType === defaultHeightPrefType || heightPrefType === 'default') && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Recommended cultural default ({isFemale ? 'taller male' : 'shorter female'})
              </p>
            </div>

            {/* Reverse preference */}
            <div
              onClick={() => setHeightPrefType(isFemale ? 'shorter' : 'taller')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                heightPrefType === (isFemale ? 'shorter' : 'taller')
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">
                  {isFemale ? `Shorter than me (Under ${viewerHeightCm} cm)` : `Taller than me (Over ${viewerHeightCm} cm)`}
                </span>
                {heightPrefType === (isFemale ? 'shorter' : 'taller') && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Candidate is {isFemale ? 'shorter' : 'taller'} than you
              </p>
            </div>

            {/* Custom Height Range */}
            <div
              onClick={() => setHeightPrefType('range')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                heightPrefType === 'range'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">Custom Height Range</span>
                {heightPrefType === 'range' && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Between {heightMinCm} cm and {heightMaxCm} cm
              </p>
            </div>

            {/* No Restriction */}
            <div
              onClick={() => setHeightPrefType('no_preference')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                heightPrefType === 'no_preference'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">No Restriction</span>
                {heightPrefType === 'no_preference' && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Any height receives full 25% points
              </p>
            </div>
          </div>

          {heightPrefType === 'range' && (
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] space-y-3">
              <span className="text-xs font-bold text-[#1C1412]">Set Custom Height Range (Centimetres):</span>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-[11px] text-[#1C1412]/60">Minimum Height (cm)</label>
                  <Input
                    type="number"
                    min={120}
                    max={heightMaxCm}
                    value={heightMinCm}
                    onChange={(e) => setHeightMinCm(Math.max(120, Number(e.target.value)))}
                    className="mt-1 bg-white font-bold"
                  />
                </div>
                <div className="text-[#1C1412]/40 font-bold text-sm mt-5">to</div>
                <div className="flex-1">
                  <label className="text-[11px] text-[#1C1412]/60">Maximum Height (cm)</label>
                  <Input
                    type="number"
                    min={heightMinCm}
                    max={220}
                    value={heightMaxCm}
                    onChange={(e) => setHeightMaxCm(Math.min(220, Number(e.target.value)))}
                    className="mt-1 bg-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Religion Preference (Weight: 15%) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCF] shadow-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#1C1412]">
                  4. Religion Preference
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#9B6B15] font-bold text-[11px]">
                  Priority Weight: 15%
                </span>
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-0.5">
                Matches candidate's religion against your preference.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Same Religion */}
            <div
              onClick={() => setReligionPrefType('same')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                religionPrefType === 'same' || religionPrefType === 'default'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">Same as Mine</span>
                {(religionPrefType === 'same' || religionPrefType === 'default') && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                {viewerReligion} candidates only
              </p>
            </div>

            {/* Selected Religions */}
            <div
              onClick={() => setReligionPrefType('selected')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                religionPrefType === 'selected'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">Specific Religions</span>
                {religionPrefType === 'selected' && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Choose multiple allowed religions
              </p>
            </div>

            {/* No Restriction */}
            <div
              onClick={() => setReligionPrefType('no_preference')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                religionPrefType === 'no_preference'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">No Restriction</span>
                {religionPrefType === 'no_preference' && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Any religion receives full 15% points
              </p>
            </div>
          </div>

          {religionPrefType === 'selected' && (
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] space-y-2">
              <span className="text-xs font-bold text-[#1C1412]">Select Allowed Religions:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {religionList.map((rel) => {
                  const isChecked = selectedReligions.includes(rel)
                  return (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => {
                        setSelectedReligions((prev) =>
                          isChecked ? prev.filter((r) => r !== rel) : [...prev, rel]
                        )
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#E5A93C] text-[#1C1412] shadow-xs'
                          : 'bg-white border border-[#EADFCF] text-[#1C1412]/70 hover:border-[#E5A93C]/60'
                      }`}
                    >
                      {rel}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Marital Status Preference (Weight: 5%) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCF] shadow-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#1C1412]">
                  5. Marital Status Preference
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#9B6B15] font-bold text-[11px]">
                  Priority Weight: 5%
                </span>
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-0.5">
                Matches candidate's marital status against your preference.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Same Status */}
            <div
              onClick={() => setMaritalStatusPrefType('same')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                maritalStatusPrefType === 'same' || maritalStatusPrefType === 'default'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">Same as Mine</span>
                {(maritalStatusPrefType === 'same' || maritalStatusPrefType === 'default') && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                {viewerCivilStatus} only
              </p>
            </div>

            {/* Selected Statuses */}
            <div
              onClick={() => setMaritalStatusPrefType('selected')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                maritalStatusPrefType === 'selected'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">Specific Statuses</span>
                {maritalStatusPrefType === 'selected' && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Choose multiple allowed statuses
              </p>
            </div>

            {/* No Restriction */}
            <div
              onClick={() => setMaritalStatusPrefType('no_preference')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                maritalStatusPrefType === 'no_preference'
                  ? 'border-[#E5A93C] bg-[#FAF6F0] shadow-xs'
                  : 'border-[#EADFCF]/70 hover:border-[#E5A93C]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C1412]">No Restriction</span>
                {maritalStatusPrefType === 'no_preference' && (
                  <Check className="w-4 h-4 text-[#9B6B15] stroke-[3]" />
                )}
              </div>
              <p className="text-xs text-[#1C1412]/60 mt-1">
                Any status receives full 5% points
              </p>
            </div>
          </div>

          {maritalStatusPrefType === 'selected' && (
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] space-y-2">
              <span className="text-xs font-bold text-[#1C1412]">Select Allowed Statuses:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {civilStatusList.map((st) => {
                  const isChecked = selectedStatuses.includes(st)
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setSelectedStatuses((prev) =>
                          isChecked ? prev.filter((s) => s !== st) : [...prev, st]
                        )
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#E5A93C] text-[#1C1412] shadow-xs'
                          : 'bg-white border border-[#EADFCF] text-[#1C1412]/70 hover:border-[#E5A93C]/60'
                      }`}
                    >
                      {st}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Save Bar */}
        <div className="bg-white rounded-3xl p-6 border border-[#EADFCF] shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#1C1412]/70">
            <Info className="w-4 h-4 text-[#9B6B15] shrink-0" />
            <span>Changes take effect immediately in search recommendations and match calculations.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl border border-[#EADFCF] text-xs font-bold text-[#1C1412] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none btn-gold px-8 py-3 rounded-2xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save Matching Preferences</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
