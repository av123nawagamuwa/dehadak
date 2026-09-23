import { useEffect, useState } from 'react'
import {
  Users,
  Search,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  Unlock,
  BadgeCheck,
  Crown,
  Edit3,
  X,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { API_BASE_URL } from '@/config'
import PackageBadge from '@/components/PackageBadge'

interface ProfileItem {
  id: number
  user_id: number
  first_name: string
  last_name: string
  gender: string
  birth_year: string
  religion: string
  caste?: string
  caste_other?: string
  ethnicity?: string
  district?: string
  country?: string
  profession?: string
  education?: string
  verification_status?: string
  is_disabled: boolean | number
  disable_reason?: string
  disabled_at?: string
  ad_id?: string
  email: string
  phone: string
  package_code?: string
  package_name?: string
  package_expires_at?: string | null
  photos?: any[]
  created_at?: string
}

export default function AdminProfiles() {
  const [profiles, setProfiles] = useState<ProfileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DISABLED' | 'VERIFIED'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Disable Modal State
  const [targetProfile, setTargetProfile] = useState<ProfileItem | null>(null)
  const [disableReason, setDisableReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [modalType, setModalType] = useState<'DISABLE' | 'ENABLE' | null>(null)

  // Package Change State
  const [packageModalOpen, setPackageModalOpen] = useState(false)
  const [selectedPackageProfile, setSelectedPackageProfile] = useState<ProfileItem | null>(null)
  const [newPackageCode, setNewPackageCode] = useState<string>('FREE')
  const [packageReason, setPackageReason] = useState<string>('')
  const [packageLoading, setPackageLoading] = useState(false)

  const token = localStorage.getItem('dehadak_admin_auth') || ''

  const fetchProfiles = async () => {
    setLoading(true)
    setError('')
    try {
      const url = statusFilter === 'ALL'
        ? `${API_BASE_URL}/api/admin/profiles`
        : `${API_BASE_URL}/api/admin/profiles?status=${statusFilter}`

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load profiles')
      setProfiles(data.profiles || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchProfiles()
  }, [statusFilter, token])

  const openDisableModal = (p: ProfileItem) => {
    setTargetProfile(p)
    setDisableReason('')
    setModalType('DISABLE')
  }

  const openEnableModal = (p: ProfileItem) => {
    setTargetProfile(p)
    setModalType('ENABLE')
  }

  const closeModal = () => {
    setTargetProfile(null)
    setDisableReason('')
    setModalType(null)
  }

  const handleConfirmDisable = async () => {
    if (!targetProfile) return
    if (!disableReason.trim()) {
      alert('Please state a reason for disabling this profile.')
      return
    }

    setActionLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/profiles/${targetProfile.id}/disable`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: disableReason.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to disable profile')

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === targetProfile.id
            ? { ...p, is_disabled: 1, disable_reason: disableReason.trim() }
            : p
        )
      )
      closeModal()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmEnable = async () => {
    if (!targetProfile) return
    setActionLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/profiles/${targetProfile.id}/enable`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to enable profile')

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === targetProfile.id
            ? { ...p, is_disabled: 0, disable_reason: undefined }
            : p
        )
      )
      closeModal()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const openPackageModal = (p: ProfileItem) => {
    setSelectedPackageProfile(p)
    const raw = (p.package_code || 'FREE').toUpperCase()
    const canonical = raw === 'SILVER_MATCH' ? 'SILVER' : raw === 'GOLD_VIP' ? 'GOLD' : raw === 'ROYAL_PLATINUM' ? 'PLATINUM' : raw
    setNewPackageCode(canonical)
    setPackageReason('')
    setPackageModalOpen(true)
  }

  const closePackageModal = () => {
    setSelectedPackageProfile(null)
    setPackageModalOpen(false)
    setPackageReason('')
  }

  const handleSavePackageChange = async () => {
    if (!selectedPackageProfile) return
    setPackageLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/profiles/${selectedPackageProfile.id}/package`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageCode: newPackageCode,
          reason: packageReason.trim() || 'Manual package change via Admin Portal',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update package')

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === selectedPackageProfile.id
            ? {
                ...p,
                package_code: data.package_code,
                package_name: data.package_name,
                package_expires_at: data.package_expires_at,
              }
            : p
        )
      )
      closePackageModal()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setPackageLoading(false)
    }
  }

  const filteredProfiles = profiles.filter((p) => {
    // 1. Status tab filter
    if (statusFilter === 'ACTIVE') {
      if (p.is_disabled === 1 || p.is_disabled === true) return false
    } else if (statusFilter === 'DISABLED') {
      if (p.is_disabled !== 1 && p.is_disabled !== true) return false
    } else if (statusFilter === 'VERIFIED') {
      if (p.verification_status !== 'VERIFIED') return false
    }

    // 2. Search query filter
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase()
    return (
      fullName.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q)) ||
      (p.ad_id && p.ad_id.toLowerCase().includes(q)) ||
      (p.district && p.district.toLowerCase().includes(q)) ||
      (p.profession && p.profession.toLowerCase().includes(q))
    )
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Title & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412] tracking-tight">
              Profile Management & Moderation
            </h1>
            <p className="text-xs sm:text-sm text-[#1C1412]/70 mt-1">
              Directory of candidate profiles with non-destructive soft disabling and audit logging.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#EADFCF] shadow-xs">
            {(['ALL', 'ACTIVE', 'DISABLED', 'VERIFIED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#1C1412] text-[#F7D878] shadow-sm'
                    : 'text-[#1C1412]/70 hover:text-[#1C1412]'
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#1C1412]/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, email, phone number, Ad ID, or district..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#EADFCF] focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-xs sm:text-sm outline-none shadow-xs transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Profiles Table */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#E5A93C] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#1C1412]/70">Loading profile directory...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs">
            {error}
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFCF] shadow-sm">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#1C1412]">No profiles found</h3>
            <p className="text-xs text-[#1C1412]/60 mt-1">
              No profiles match your current search or status filter.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#EADFCF] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6F0] border-b border-[#EADFCF] text-[#1C1412]/70 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Candidate</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Cultural & Caste</th>
                    <th className="py-3.5 px-4">Verification</th>
                    <th className="py-3.5 px-4">Package</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADFCF]/60">
                  {filteredProfiles.map((p) => {
                    const isDisabled = Boolean(p.is_disabled === 1 || p.is_disabled === true)
                    const isVerified = p.verification_status === 'VERIFIED'
                    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Candidate'

                    return (
                      <tr key={p.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                        {/* Candidate */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-center font-serif font-bold text-sm text-[#9B6B15] shrink-0">
                              {p.first_name ? p.first_name.charAt(0) : 'C'}
                            </div>
                            <div>
                              <div className="font-bold text-[#1C1412] text-sm flex items-center gap-1.5">
                                <span>{fullName}</span>
                                {isVerified && (
                                  <BadgeCheck className="w-4 h-4 text-emerald-600 inline-block" />
                                )}
                              </div>
                              <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                                <span>{p.gender || 'N/A'}</span>
                                <span>•</span>
                                <span>{p.district || p.country || 'Sri Lanka'}</span>
                                {p.ad_id && (
                                  <span className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.2 rounded">
                                    {p.ad_id}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-4 px-4 text-[#1C1412]/80">
                          <div className="space-y-0.5">
                            <p className="font-medium truncate max-w-xs">{p.email}</p>
                            <p className="text-gray-500 font-mono text-[11px]">{p.phone || 'N/A'}</p>
                          </div>
                        </td>

                        {/* Caste & Culture */}
                        <td className="py-4 px-4 text-[#1C1412]/80">
                          <div className="space-y-0.5">
                            <p className="font-semibold">{p.religion || 'Buddhist'}</p>
                            <p className="text-gray-500 capitalize">
                              {p.caste && p.caste !== 'prefer_not_to_say' && p.caste !== 'not_applicable'
                                ? `Caste: ${p.caste === 'other' ? (p.caste_other || 'Other') : p.caste.replace('_', ' ')}`
                                : (p.ethnicity || 'Sinhalese')}
                            </p>
                          </div>
                        </td>

                        {/* Verification */}
                        <td className="py-4 px-4">
                          {p.verification_status === 'VERIFIED' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          )}
                          {p.verification_status === 'PENDING' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                              Pending Review
                            </span>
                          )}
                          {p.verification_status === 'REJECTED' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
                              Rejected
                            </span>
                          )}
                          {(!p.verification_status || p.verification_status === 'NOT_SUBMITTED') && (
                            <span className="text-[11px] text-gray-400 font-medium">
                              Not submitted
                            </span>
                          )}
                        </td>

                        {/* Package */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-1.5">
                              <PackageBadge code={p.package_code || 'FREE'} name={p.package_name || 'Free Explorer'} size="sm" />
                              <button
                                type="button"
                                onClick={() => openPackageModal(p)}
                                className="p-1 rounded-lg hover:bg-[#FAF6F0] text-gray-400 hover:text-[#9B6B15] transition-colors cursor-pointer"
                                title="Change Package"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {p.package_expires_at ? `Exp: ${new Date(p.package_expires_at).toLocaleDateString()}` : 'Lifetime'}
                            </span>
                          </div>
                        </td>

                        {/* Active / Disabled Status */}
                        <td className="py-4 px-4">
                          {isDisabled ? (
                            <div>
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300 inline-flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Disabled
                              </span>
                              {p.disable_reason && (
                                <p className="text-[10px] text-red-700 mt-1 truncate max-w-[180px]" title={p.disable_reason}>
                                  {p.disable_reason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openPackageModal(p)}
                              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Change Subscription Package"
                            >
                              <Crown className="w-3.5 h-3.5 text-amber-600" />
                              <span>Plan</span>
                            </button>

                            {isDisabled ? (
                              <button
                                type="button"
                                onClick={() => openEnableModal(p)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Unlock className="w-3 h-3" />
                                <span>Enable</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openDisableModal(p)}
                                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Lock className="w-3 h-3" />
                                <span>Disable</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Change Candidate Subscription Package */}
        {packageModalOpen && selectedPackageProfile && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border border-amber-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1C1412]">
                      Change Account Package
                    </h3>
                    <p className="text-xs text-[#1C1412]/70 mt-0.5">
                      Candidate:{' '}
                      <span className="font-bold text-[#1C1412]">
                        {selectedPackageProfile.first_name} {selectedPackageProfile.last_name}
                      </span>
                      {selectedPackageProfile.ad_id && (
                        <span className="ml-2 font-mono text-[11px] bg-neutral-100 px-2 py-0.5 rounded">
                          {selectedPackageProfile.ad_id}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePackageModal}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Active Plan */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 text-[11px] block">Current Assigned Package:</span>
                  <span className="font-bold text-[#1C1412]">
                    {selectedPackageProfile.package_name || 'Free Explorer'}
                  </span>
                </div>
                <PackageBadge
                  code={selectedPackageProfile.package_code || 'FREE'}
                  name={selectedPackageProfile.package_name || 'Free Explorer'}
                  size="sm"
                />
              </div>

              {/* Package Selection Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1412]/80">
                  Select New Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Free Explorer */}
                  <div
                    onClick={() => setNewPackageCode('FREE')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      newPackageCode === 'FREE'
                        ? 'border-[#9B6B15] bg-[#FAF6F0] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-[#1C1412]">Free Explorer</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        Free
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-2">Lifetime duration</p>
                    <ul className="text-[11px] text-gray-600 space-y-1 font-medium">
                      <li>• 3 Interest Requests</li>
                      <li>• 3 Acceptances</li>
                      <li>• 3 Chat Connections</li>
                    </ul>
                  </div>

                  {/* Silver Match */}
                  <div
                    onClick={() => setNewPackageCode('SILVER')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      newPackageCode === 'SILVER'
                        ? 'border-slate-500 bg-slate-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-slate-800">Silver Match</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                        Rs. 1,500
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-2">3 Months duration</p>
                    <ul className="text-[11px] text-slate-700 space-y-1 font-medium">
                      <li>• 30 Interest Requests</li>
                      <li>• 30 Acceptances</li>
                      <li>• 30 Chat Connections</li>
                      <li>• Horoscope Match %</li>
                    </ul>
                  </div>

                  {/* Gold VIP */}
                  <div
                    onClick={() => setNewPackageCode('GOLD')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      newPackageCode === 'GOLD'
                        ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-amber-900">Gold VIP</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        Rs. 2,400
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-700 mb-2">4 Months duration</p>
                    <ul className="text-[11px] text-amber-800 space-y-1 font-medium">
                      <li>• 50 Interest Requests</li>
                      <li>• 50 Acceptances</li>
                      <li>• 50 Chat Connections</li>
                      <li>• Horoscope Match %</li>
                    </ul>
                  </div>

                  {/* Royal Platinum */}
                  <div
                    onClick={() => setNewPackageCode('PLATINUM')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      newPackageCode === 'PLATINUM'
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-purple-950">Royal Platinum</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                        Rs. 4,800
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-700 mb-2">6 Months duration</p>
                    <ul className="text-[11px] text-purple-900 space-y-1 font-medium">
                      <li>• 150 Interest Requests</li>
                      <li>• 150 Acceptances</li>
                      <li>• 150 Chat Connections</li>
                      <li>• Match % & Contact Phone</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Admin Reason Note */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1412]/80">
                  Reason / Audit Log Note
                </label>
                <input
                  type="text"
                  value={packageReason}
                  onChange={(e) => setPackageReason(e.target.value)}
                  placeholder="e.g. Bank slip payment verified or promotion upgrade"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9B6B15] text-xs"
                />
                <p className="text-[11px] text-gray-500">
                  This action is logged into the audit ledger and will immediately activate quota entitlements.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closePackageModal}
                  disabled={packageLoading}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePackageChange}
                  disabled={packageLoading}
                  className="px-5 py-2 rounded-xl bg-[#9B6B15] hover:bg-[#855B12] text-white text-xs font-bold transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-sm"
                >
                  {packageLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Package...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-3.5 h-3.5" />
                      <span>Confirm Package Change</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Disable Profile Reason */}
        {modalType === 'DISABLE' && targetProfile && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-red-200 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1412]">
                    Disable Candidate Profile
                  </h3>
                  <p className="text-xs text-[#1C1412]/70 mt-0.5">
                    Disabling {targetProfile.first_name} {targetProfile.last_name} ({targetProfile.email}) will immediately hide their profile from all search and public discovery. This action is reversible.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                  Disable Reason (Audit Logged)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'User request to pause profile',
                    'Suspicious or fraudulent details',
                    'Terms of service violation',
                    'Duplicate profile found',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDisableReason(preset)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] text-[#1C1412]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                  placeholder="Provide detailed reason..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-red-500 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDisable}
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Disabling...' : 'Confirm Disable'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Enable Profile Confirmation */}
        {modalType === 'ENABLE' && targetProfile && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-emerald-200 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1412]">
                    Restore Profile
                  </h3>
                  <p className="text-xs text-[#1C1412]/70 mt-0.5">
                    Are you sure you want to re-enable the profile for {targetProfile.first_name} {targetProfile.last_name}? It will immediately become visible in search results again.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEnable}
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Restoring...' : 'Confirm Enable'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
