import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Users,
  BadgeCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { API_BASE_URL } from '@/config'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('dehadak_admin_auth')
    if (!token) return

    fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dashboard metrics')
        return res.json()
      })
      .then((data) => {
        setStats(data.stats || {})
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title & Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412] tracking-tight">
              Administration Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#1C1412]/70 mt-1">
              System overview, verification requests, and profile activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/verifications"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F7D878] via-[#E5A93C] to-[#9B6B15] text-[#1C1412] font-bold text-xs shadow-gold hover:shadow-gold-lg transition-all flex items-center gap-2"
            >
              <BadgeCheck className="w-4 h-4 text-[#1C1412]" />
              <span>Review Submissions</span>
              {stats?.pending_verifications > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {stats.pending_verifications}
                </span>
              )}
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#E5A93C] mb-2" />
            <span className="text-xs font-semibold text-[#1C1412]/70">Loading metrics...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs">
            {error}
          </div>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Profiles */}
              <div className="bg-white rounded-3xl p-5 border border-[#EADFCF] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1C1412]/60">
                    Total Profiles
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-center text-[#9B6B15]">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-serif text-[#1C1412]">
                    {stats?.total_profiles || 0}
                  </div>
                  <p className="text-[11px] text-[#1C1412]/60 mt-1">
                    {stats?.total_users || 0} registered user accounts
                  </p>
                </div>
              </div>

              {/* Pending Verifications */}
              <div className={`rounded-3xl p-5 border shadow-sm flex flex-col justify-between ${
                stats?.pending_verifications > 0
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-white border-[#EADFCF]'
              }`}>
                <div className="flex items-center justify-between text-neutral-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Pending Review
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-serif text-amber-950 flex items-center gap-2">
                    <span>{stats?.pending_verifications || 0}</span>
                    {stats?.pending_verifications > 0 && (
                      <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold uppercase tracking-wider">
                        Action needed
                      </span>
                    )}
                  </div>
                  <Link
                    to="/admin/verifications"
                    className="text-[11px] text-amber-800 hover:text-amber-950 font-bold mt-2 flex items-center gap-1 group"
                  >
                    <span>Inspect documents</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Verified Profiles */}
              <div className="bg-white rounded-3xl p-5 border border-[#EADFCF] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1C1412]/60">
                    Verified Badges
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-serif text-emerald-900">
                    {stats?.verified_profiles || 0}
                  </div>
                  <p className="text-[11px] text-emerald-700/80 mt-1">
                    Awarded trusted green badge
                  </p>
                </div>
              </div>

              {/* Disabled Profiles */}
              <div className="bg-white rounded-3xl p-5 border border-[#EADFCF] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1C1412]/60">
                    Disabled Profiles
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-serif text-red-900">
                    {stats?.disabled_profiles || 0}
                  </div>
                  <p className="text-[11px] text-red-700/80 mt-1">
                    Hidden from search & discovery
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <Link
                to="/admin/verifications"
                className="group p-6 rounded-3xl bg-white border border-[#EADFCF] shadow-sm hover:shadow-md hover:border-[#E5A93C] transition-all flex items-start justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#E5A93C]/15 text-[#9B6B15] flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1412] group-hover:text-[#9B6B15] transition-colors">
                    National Identity Card (NIC) Verifications
                  </h3>
                  <p className="text-xs text-[#1C1412]/70 leading-relaxed max-w-md">
                    Review sensitive front and back identity documents in a secure sandbox, verify government ID legitimacy, and award or reject verification with clear notes.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#1C1412]/60 group-hover:text-[#1C1412] group-hover:bg-[#E5A93C] transition-all shrink-0 mt-2">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>

              <Link
                to="/admin/profiles"
                className="group p-6 rounded-3xl bg-white border border-[#EADFCF] shadow-sm hover:shadow-md hover:border-[#E5A93C] transition-all flex items-start justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#1C1412]/10 text-[#1C1412] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1412] group-hover:text-[#9B6B15] transition-colors">
                    Profile Directory & Moderation
                  </h3>
                  <p className="text-xs text-[#1C1412]/70 leading-relaxed max-w-md">
                    Search through all candidate profiles, inspect details, and perform non-destructive soft disabling or restoration with full audit logging.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#1C1412]/60 group-hover:text-[#1C1412] group-hover:bg-[#E5A93C] transition-all shrink-0 mt-2">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
