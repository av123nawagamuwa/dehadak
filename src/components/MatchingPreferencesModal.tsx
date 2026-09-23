import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  SlidersHorizontal,
  Sparkles,
  Check,
  RotateCcw,
  Loader2,
  Info,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'

interface MatchingPreferencesModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

const religionList = ['Buddhist', 'Hindu', 'Christian', 'Roman Catholic', 'Islam', 'Other']
const civilStatusList = ['Never Married', 'Divorced', 'Widowed', 'Separated']

export default function MatchingPreferencesModal({
  isOpen,
  onClose,
  onSaved,
}: MatchingPreferencesModalProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [viewerContext, setViewerContext] = useState<any>(null)

  // Form State
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
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      fetchPreferences()
    } else {
      document.body.style.overflow = 'unset'
      setError('')
      setSuccess('')
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const fetchPreferences = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('dehadak_auth')
      if (!token) {
        setError('Please log in to edit your matching preferences.')
        setLoading(false)
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
        setError(data.error || 'Unable to load preferences')
      }
    } catch (err) {
      setError('Network error while fetching preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const token = localStorage.getItem('dehadak_auth')
      if (!token) throw new Error('Not authenticated')

      const payload = {
        looking_for: lookingFor,
        age_preference_type: agePrefType,
        age_min: ageMin,
        age_max: ageMax,
        height_preference_type: heightPrefType,
        height_min_cm: heightMinCm,
        height_max_cm: heightMaxCm,
        religion_preference_type: religionPrefType,
        religions: selectedReligions,
        marital_status_preference_type: maritalStatusPrefType,
        marital_statuses: selectedStatuses,
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
        setSuccess('Preferences saved successfully!')
        setTimeout(() => {
          onSaved()
          onClose()
        }, 800)
      } else {
        setError(data.error || 'Failed to save preferences')
      }
    } catch (err: any) {
      setError(err.message || 'Error saving preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = () => {
    const isFemale = viewerContext?.viewerProfile?.gender === 'female'
    setLookingFor(isFemale ? 'male' : 'female')
    setAgePrefType(isFemale ? 'older' : 'younger')
    setHeightPrefType(isFemale ? 'taller' : 'shorter')
    setReligionPrefType('same')
    setMaritalStatusPrefType('same')
    setSelectedReligions([])
    setSelectedStatuses([])
  }

  const toggleReligion = (rel: string) => {
    setSelectedReligions((prev) =>
      prev.includes(rel) ? prev.filter((r) => r !== rel) : [...prev, rel]
    )
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  if (!mounted) return null

  const viewerProfile = viewerContext?.viewerProfile || {}
  const viewerAge = viewerProfile.age
  const viewerHeight = viewerProfile.heightCm
  const viewerReligion = viewerProfile.religion || 'Not provided'
  const viewerCivilStatus = viewerProfile.civilStatus || 'Not provided'

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EADFCF] overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1C1412] text-white border-b border-[#D4A72C]/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center text-[#F5C768]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                    Matching Preferences
                  </h2>
                  <p className="text-[11px] text-[#EADFCF]/70">
                    Customize your 4 priority criteria weights & rules
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-[#1C1412]">
              {loading ? (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-[#D4A72C]">
                  <Loader2 className="w-7 h-7 animate-spin" />
                  <p className="text-xs font-semibold text-[#5C4B47]">Loading your saved preferences...</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}

                  {/* Info Notice */}
                  <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] flex items-start gap-3 text-xs text-[#5C4B47]">
                    <Sparkles className="w-4 h-4 text-[#D4A72C] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1C1412] mb-0.5">Preference Match System</p>
                      <p className="text-[11px] leading-relaxed">
                        Matches are calculated from your saved profile details using fixed binary weights:
                        <strong> Age (55%) → Height (25%) → Religion (15%) → Marital Status (5%)</strong>.
                        Setting &quot;No restriction&quot; gives full points for that criterion to all candidates.
                      </p>
                    </div>
                  </div>

                  {/* 0. Looking For */}
                  <div className="space-y-2 pb-4 border-b border-[#EADFCF]">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C4B47] block">
                      Looking For (Candidate Gender)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'female', label: 'Bride (Female)' },
                        { id: 'male', label: 'Groom (Male)' },
                        { id: 'all', label: 'Any / All' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLookingFor(item.id)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                            lookingFor === item.id
                              ? 'bg-[#E5A93C] text-[#1C1412] border-[#E5A93C] shadow-xs'
                              : 'bg-[#FAF6F0] text-[#1C1412]/80 border-[#EADFCF] hover:border-[#E5A93C]/50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1. Age Preference (Weight: 55%) */}
                  <div className="space-y-3 pb-4 border-b border-[#EADFCF]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1412] flex items-center gap-1.5">
                        <span>1. Age Preference</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#9B6B15] text-[10px] font-bold">
                          Weight: 55%
                        </span>
                      </label>
                      {viewerAge && (
                        <span className="text-[11px] text-[#5C4B47]">
                          Your Age: <strong>{viewerAge} yrs</strong>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setAgePrefType('younger')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          agePrefType === 'younger'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Younger than me (18+)</p>
                        <p className="text-[11px] text-[#5C4B47]">Candidate age &lt; {viewerAge || 30}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAgePrefType('older')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          agePrefType === 'older'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Older than me</p>
                        <p className="text-[11px] text-[#5C4B47]">Candidate age &gt; {viewerAge || 25}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAgePrefType('range')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          agePrefType === 'range'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Custom age range</p>
                        <p className="text-[11px] text-[#5C4B47]">Specific min and max age</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAgePrefType('no_preference')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          agePrefType === 'no_preference'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">No restriction</p>
                        <p className="text-[11px] text-[#5C4B47]">Full 55 points for any age</p>
                      </button>
                    </div>

                    {agePrefType === 'range' && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF6F0] border border-[#EADFCF]">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-[#5C4B47] uppercase block mb-1">
                            Min Age (18+)
                          </label>
                          <input
                            type="number"
                            min="18"
                            max="80"
                            value={ageMin}
                            onChange={(e) => setAgeMin(Number(e.target.value))}
                            className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#EADFCF] bg-white"
                          />
                        </div>
                        <span className="text-[#5C4B47] mt-4">-</span>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-[#5C4B47] uppercase block mb-1">
                            Max Age
                          </label>
                          <input
                            type="number"
                            min="18"
                            max="80"
                            value={ageMax}
                            onChange={(e) => setAgeMax(Number(e.target.value))}
                            className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#EADFCF] bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Height Preference (Weight: 25%) */}
                  <div className="space-y-3 pb-4 border-b border-[#EADFCF]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1412] flex items-center gap-1.5">
                        <span>2. Height Preference</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#9B6B15] text-[10px] font-bold">
                          Weight: 25%
                        </span>
                      </label>
                      {viewerHeight && (
                        <span className="text-[11px] text-[#5C4B47]">
                          Your Height: <strong>{viewerHeight} cm</strong>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setHeightPrefType('shorter')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          heightPrefType === 'shorter'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Shorter than me</p>
                        <p className="text-[11px] text-[#5C4B47]">Candidate height &lt; {viewerHeight || 175} cm</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeightPrefType('taller')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          heightPrefType === 'taller'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Taller than me</p>
                        <p className="text-[11px] text-[#5C4B47]">Candidate height &gt; {viewerHeight || 160} cm</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeightPrefType('range')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          heightPrefType === 'range'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Custom height range</p>
                        <p className="text-[11px] text-[#5C4B47]">Specific min and max cm</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeightPrefType('no_preference')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          heightPrefType === 'no_preference'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">No restriction</p>
                        <p className="text-[11px] text-[#5C4B47]">Full 25 points for any height</p>
                      </button>
                    </div>

                    {heightPrefType === 'range' && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF6F0] border border-[#EADFCF]">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-[#5C4B47] uppercase block mb-1">
                            Min Height (cm)
                          </label>
                          <input
                            type="number"
                            min="100"
                            max="230"
                            value={heightMinCm}
                            onChange={(e) => setHeightMinCm(Number(e.target.value))}
                            className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#EADFCF] bg-white"
                          />
                        </div>
                        <span className="text-[#5C4B47] mt-4">-</span>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-[#5C4B47] uppercase block mb-1">
                            Max Height (cm)
                          </label>
                          <input
                            type="number"
                            min="100"
                            max="230"
                            value={heightMaxCm}
                            onChange={(e) => setHeightMaxCm(Number(e.target.value))}
                            className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#EADFCF] bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Religion Preference (Weight: 15%) */}
                  <div className="space-y-3 pb-4 border-b border-[#EADFCF]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1412] flex items-center gap-1.5">
                        <span>3. Religion Preference</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#9B6B15] text-[10px] font-bold">
                          Weight: 15%
                        </span>
                      </label>
                      <span className="text-[11px] text-[#5C4B47]">
                        Your Religion: <strong>{viewerReligion}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setReligionPrefType('same')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          religionPrefType === 'same'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Same as mine</p>
                        <p className="text-[11px] text-[#5C4B47]">{viewerReligion}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReligionPrefType('selected')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          religionPrefType === 'selected'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Select specific</p>
                        <p className="text-[11px] text-[#5C4B47]">{selectedReligions.length} selected</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReligionPrefType('no_preference')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          religionPrefType === 'no_preference'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">No restriction</p>
                        <p className="text-[11px] text-[#5C4B47]">Full 15 points for any</p>
                      </button>
                    </div>

                    {religionPrefType === 'selected' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-[#FAF6F0] border border-[#EADFCF]">
                        {religionList.map((rel) => (
                          <label
                            key={rel}
                            className="flex items-center gap-2 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                          >
                            <input
                              type="checkbox"
                              checked={selectedReligions.includes(rel)}
                              onChange={() => toggleReligion(rel)}
                              className="w-4 h-4 rounded accent-[#E5A93C]"
                            />
                            <span>{rel}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Marital Status Preference (Weight: 5%) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1412] flex items-center gap-1.5">
                        <span>4. Marital Status</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#9B6B15] text-[10px] font-bold">
                          Weight: 5%
                        </span>
                      </label>
                      <span className="text-[11px] text-[#5C4B47]">
                        Your Status: <strong>{viewerCivilStatus}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setMaritalStatusPrefType('same')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          maritalStatusPrefType === 'same'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Same as mine</p>
                        <p className="text-[11px] text-[#5C4B47]">{viewerCivilStatus}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMaritalStatusPrefType('selected')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          maritalStatusPrefType === 'selected'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">Select specific</p>
                        <p className="text-[11px] text-[#5C4B47]">{selectedStatuses.length} selected</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMaritalStatusPrefType('no_preference')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          maritalStatusPrefType === 'no_preference'
                            ? 'border-[#E5A93C] bg-[#FAF6F0] ring-1 ring-[#E5A93C]'
                            : 'border-[#EADFCF] bg-white hover:border-[#E5A93C]/50'
                        }`}
                      >
                        <p className="font-bold text-[#1C1412]">No restriction</p>
                        <p className="text-[11px] text-[#5C4B47]">Full 5 points for any</p>
                      </button>
                    </div>

                    {maritalStatusPrefType === 'selected' && (
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#FAF6F0] border border-[#EADFCF]">
                        {civilStatusList.map((status) => (
                          <label
                            key={status}
                            className="flex items-center gap-2 text-xs text-[#1C1412] cursor-pointer hover:text-[#9B6B15]"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStatuses.includes(status)}
                              onChange={() => toggleStatus(status)}
                              className="w-4 h-4 rounded accent-[#E5A93C]"
                            />
                            <span>{status}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-[#FAF6F0] border-t border-[#EADFCF] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleResetDefaults}
                disabled={loading || saving}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#5C4B47] hover:text-[#1C1412] hover:bg-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl border border-[#EADFCF] text-xs font-bold text-[#1C1412] hover:bg-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading || saving}
                  className="btn-gold px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
