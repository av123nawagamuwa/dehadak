import { useEffect, useState } from 'react'
import {
  BadgeCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  X,
  AlertCircle,
  Loader2,
  FileText,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { API_BASE_URL } from '@/config'

interface NicSubmission {
  id: number
  user_id: number
  nic_number?: string
  front_image_path: string
  back_image_path: string
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  rejection_reason?: string
  reviewed_by?: number
  reviewed_at?: string
  created_at: string
  first_name: string
  last_name: string
  user_email: string
  user_phone: string
  gender: string
  ad_id?: string
  birth_year?: string
  district?: string
  country?: string
}

export default function AdminVerifications() {
  const [submissions, setSubmissions] = useState<NicSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'VERIFIED' | 'REJECTED' | 'ALL'>('PENDING')
  const [searchQuery, setSearchQuery] = useState('')

  // Active Inspector Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<NicSubmission | null>(null)
  const [frontBlobUrl, setFrontBlobUrl] = useState<string | null>(null)
  const [backBlobUrl, setBackBlobUrl] = useState<string | null>(null)
  const [docsLoading, setDocsLoading] = useState(false)

  // Review Action State
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')

  const token = localStorage.getItem('dehadak_admin_auth') || ''

  const fetchSubmissions = async () => {
    setLoading(true)
    setError('')
    try {
      const url = statusFilter === 'ALL'
        ? `${API_BASE_URL}/api/admin/verifications`
        : `${API_BASE_URL}/api/admin/verifications?status=${statusFilter}`

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load verifications')
      setSubmissions(data.submissions || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchSubmissions()
  }, [statusFilter, token])

  // Securely load document blobs into memory for inspection
  const openInspector = async (sub: NicSubmission) => {
    setSelectedSubmission(sub)
    setFrontBlobUrl(null)
    setBackBlobUrl(null)
    setDocsLoading(true)
    setReviewMessage('')

    try {
      const [frontRes, backRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/verifications/${sub.id}/document/front`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/admin/verifications/${sub.id}/document/back`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (frontRes.ok) {
        const frontBlob = await frontRes.blob()
        setFrontBlobUrl(URL.createObjectURL(frontBlob))
      }

      if (backRes.ok) {
        const backBlob = await backRes.blob()
        setBackBlobUrl(URL.createObjectURL(backBlob))
      }
    } catch (err) {
      console.error('Error streaming documents:', err)
    } finally {
      setDocsLoading(false)
    }
  }

  const closeInspector = () => {
    if (frontBlobUrl) URL.revokeObjectURL(frontBlobUrl)
    if (backBlobUrl) URL.revokeObjectURL(backBlobUrl)
    setSelectedSubmission(null)
    setFrontBlobUrl(null)
    setBackBlobUrl(null)
    setRejectModalOpen(false)
    setRejectionReason('')
  }

  const handleApprove = async () => {
    if (!selectedSubmission) return
    setActionLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/verifications/${selectedSubmission.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          decision: 'APPROVE',
          status: 'VERIFIED',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to approve verification')

      setReviewMessage('Verification approved! The profile has been granted the Verified badge.')
      // Update in list
      setSubmissions((prev) =>
        prev.map((s) => (s.id === selectedSubmission.id ? { ...s, status: 'VERIFIED' } : s))
      )
      setSelectedSubmission((prev) => (prev ? { ...prev, status: 'VERIFIED' } : null))
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedSubmission) return
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejecting this verification.')
      return
    }

    setActionLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/verifications/${selectedSubmission.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          decision: 'REJECT',
          status: 'REJECTED',
          reason: rejectionReason.trim(),
          rejectionReason: rejectionReason.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reject verification')

      setReviewMessage('Verification rejected and candidate notified.')
      setRejectModalOpen(false)
      // Update in list
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id
            ? { ...s, status: 'REJECTED', rejection_reason: rejectionReason.trim() }
            : s
        )
      )
      setSelectedSubmission((prev) =>
        prev ? { ...prev, status: 'REJECTED', rejection_reason: rejectionReason.trim() } : null
      )
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter !== 'ALL' && sub.status !== statusFilter) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const fullName = `${sub.first_name || ''} ${sub.last_name || ''}`.toLowerCase()
    return (
      fullName.includes(q) ||
      (sub.user_email && sub.user_email.toLowerCase().includes(q)) ||
      (sub.user_phone && sub.user_phone.includes(q)) ||
      (sub.nic_number && sub.nic_number.toLowerCase().includes(q)) ||
      (sub.ad_id && sub.ad_id.toLowerCase().includes(q))
    )
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412] tracking-tight">
              NIC Verifications
            </h1>
            <p className="text-xs sm:text-sm text-[#1C1412]/70 mt-1">
              Review and audit submitted identity documents before awarding Verified badges.
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#EADFCF] shadow-xs">
            {(['PENDING', 'VERIFIED', 'REJECTED', 'ALL'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#1C1412] text-[#F7D878] shadow-sm'
                    : 'text-[#1C1412]/70 hover:text-[#1C1412]'
                }`}
              >
                {tab === 'ALL' ? 'All Submissions' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#1C1412]/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, email, phone, NIC number, or Ad ID..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#EADFCF] focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-xs sm:text-sm outline-none shadow-xs transition-all placeholder:text-gray-400"
          />
        </div>

        {/* List Content */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#E5A93C] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#1C1412]/70">Loading verification submissions...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs">
            {error}
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFCF] shadow-sm">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#1C1412]">
              No {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} submissions found
            </h3>
            <p className="text-xs text-[#1C1412]/60 mt-1">
              There are currently no identity documents waiting in this filter category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredSubmissions.map((sub) => {
              const fullName = `${sub.first_name || ''} ${sub.last_name || ''}`.trim() || 'Candidate'
              const dateStr = sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'Recent'

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl p-5 border border-[#EADFCF] shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-center text-[#9B6B15] font-serif font-bold text-lg shrink-0">
                      {sub.first_name ? sub.first_name.charAt(0) : 'U'}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-base font-bold text-[#1C1412] truncate">
                          {fullName}
                        </h3>
                        {sub.ad_id && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF6F0] border border-[#EADFCF] text-[#1C1412]/80">
                            {sub.ad_id}
                          </span>
                        )}
                        {sub.status === 'PENDING' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                        {sub.status === 'VERIFIED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified Badge
                          </span>
                        )}
                        {sub.status === 'REJECTED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-900 border border-red-300 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#1C1412]/70 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#E5A93C]" />
                          {sub.user_email}
                        </span>
                        {sub.user_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
                            {sub.user_phone}
                          </span>
                        )}
                        {sub.nic_number && (
                          <span className="font-mono text-[11px] bg-neutral-100 px-1.5 py-0.5 rounded">
                            NIC: {sub.nic_number}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Calendar className="w-3 h-3" />
                          Submitted {dateStr}
                        </span>
                      </div>

                      {sub.status === 'REJECTED' && sub.rejection_reason && (
                        <p className="text-xs text-red-700 bg-red-50 p-2 rounded-xl border border-red-200 mt-1">
                          <strong>Rejection reason:</strong> {sub.rejection_reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => openInspector(sub)}
                      className="px-4 py-2.5 rounded-xl bg-[#1C1412] hover:bg-[#2E201D] text-[#F7D878] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Documents</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal: Document Inspector & Reviewer */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-[#FAF7F0] rounded-3xl border border-[#E5A93C]/40 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="bg-[#1C1412] text-white px-6 py-4 border-b border-[#E5A93C]/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="w-5 h-5 text-[#F7D878]" />
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                      Identity Document Inspection
                    </h3>
                    <p className="text-xs text-[#F7D878]/80">
                      {selectedSubmission.first_name} {selectedSubmission.last_name} ({selectedSubmission.user_email})
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeInspector}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scroll">
                {reviewMessage && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{reviewMessage}</span>
                  </div>
                )}

                {/* Candidate Summary Panel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-[#EADFCF] text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Candidate Name</span>
                    <span className="font-bold text-[#1C1412]">
                      {selectedSubmission.first_name} {selectedSubmission.last_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">NIC Number</span>
                    <span className="font-mono font-bold text-[#1C1412]">
                      {selectedSubmission.nic_number || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact Phone</span>
                    <span className="font-semibold text-[#1C1412]">
                      {selectedSubmission.user_phone || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Current Status</span>
                    <span className="font-bold text-[#1C1412]">
                      {selectedSubmission.status}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Document Photos */}
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#1C1412] mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#9B6B15]" />
                    <span>Confidential Identity Images</span>
                    <span className="text-[10px] font-sans font-normal text-gray-500">
                      (Streamed securely from private storage)
                    </span>
                  </h4>

                  {docsLoading ? (
                    <div className="py-20 text-center bg-white rounded-2xl border border-[#EADFCF]">
                      <Loader2 className="w-6 h-6 animate-spin text-[#E5A93C] mx-auto mb-2" />
                      <span className="text-xs text-gray-500">Decrypting & loading document images...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Front Image */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-[#1C1412]">
                          <span>Front Side</span>
                          {frontBlobUrl && (
                            <a
                              href={frontBlobUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#9B6B15] hover:underline flex items-center gap-1"
                            >
                              <span>Open full size</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="relative aspect-[4/3] rounded-2xl bg-neutral-900 overflow-hidden border border-[#EADFCF] flex items-center justify-center">
                          {frontBlobUrl ? (
                            <img
                              src={frontBlobUrl}
                              alt="NIC Front"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">Front image unavailable</span>
                          )}
                        </div>
                      </div>

                      {/* Back Image */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-[#1C1412]">
                          <span>Back Side</span>
                          {backBlobUrl && (
                            <a
                              href={backBlobUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#9B6B15] hover:underline flex items-center gap-1"
                            >
                              <span>Open full size</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="relative aspect-[4/3] rounded-2xl bg-neutral-900 overflow-hidden border border-[#EADFCF] flex items-center justify-center">
                          {backBlobUrl ? (
                            <img
                              src={backBlobUrl}
                              alt="NIC Back"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">Back image unavailable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reject Input Sub-Panel */}
                {rejectModalOpen && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                    <h5 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>Rejection Reason (will be shown to candidate for resubmission)</span>
                    </h5>

                    <div className="flex flex-wrap gap-2">
                      {[
                        'Blurry or unreadable photo',
                        'Front or back of card is cut off',
                        'Document details do not match profile name/DOB',
                        'National Identity Card appears expired or invalid',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setRejectionReason(preset)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-red-200 text-[11px] text-red-900 hover:bg-red-100 transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Type reason here..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-red-300 text-xs text-red-950 outline-none"
                    />

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setRejectModalOpen(false)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={actionLoading}
                        className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                      >
                        {actionLoading ? 'Saving...' : 'Confirm Rejection'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 bg-white border-t border-[#EADFCF] flex items-center justify-between gap-3 shrink-0">
                <button
                  onClick={closeInspector}
                  className="px-5 py-2.5 rounded-xl bg-[#FAF6F0] hover:bg-gray-100 text-xs font-bold text-[#1C1412]/80 border border-[#EADFCF] transition-all"
                >
                  Close
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    disabled={actionLoading || selectedSubmission.status === 'REJECTED'}
                    className="px-5 py-2.5 rounded-xl bg-white border border-red-300 hover:bg-red-50 text-red-700 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Reject Verification
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={actionLoading || selectedSubmission.status === 'VERIFIED'}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                    <span>Approve & Award Badge</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
