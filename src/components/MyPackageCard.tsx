import { useEffect, useState } from 'react'
import { Sparkles, AlertTriangle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { Link } from 'react-router'
import { API_BASE_URL } from '@/config'
import PackageBadge from './PackageBadge'

export interface SubscriptionData {
  subscriptionId: number
  package: {
    id: number
    code: string
    name: string
    price: number
    currency: string
    durationMonths: number
    badgeStyle: string
  }
  status: string
  startsAt: string
  expiresAt: string | null
  daysRemaining: number | null
  usage: {
    interestsSent: { used: number; limit: number; remaining: number }
    interestsAccepted: { used: number; limit: number; remaining: number }
    connectionsUnlocked: { used: number; limit: number; remaining: number }
  }
  features: {
    matchPercentage: boolean
    contactReveal: boolean
  }
}

export default function MyPackageCard() {
  const [data, setData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const auth = localStorage.getItem('dehadak_auth')
      if (!auth) return
      let token = auth
      try {
        const parsed = JSON.parse(auth)
        if (parsed?.token) token = parsed.token
      } catch {
        // Raw token string
      }

      const res = await fetch(`${API_BASE_URL}/api/subscriptions/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error('Failed to load subscription details', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#EADFCF] bg-white p-6 shadow-card animate-pulse space-y-4">
        <div className="h-6 w-32 bg-[#FAF7F0] rounded-xl" />
        <div className="h-20 bg-[#FAF7F0] rounded-2xl" />
      </div>
    )
  }

  if (!data) return null

  const isFree = data.package.code === 'FREE'
  const isExpiringSoon = data.daysRemaining !== null && data.daysRemaining <= 7
  const isSentNearLimit = data.usage.interestsSent.remaining <= 1
  const isAcceptedNearLimit = data.usage.interestsAccepted.remaining <= 1
  const isConnectionNearLimit = data.usage.connectionsUnlocked.remaining <= 1

  const renderProgressBar = (label: string, used: number, limit: number, color: string = 'from-[#D4A72C] to-[#E5A93C]') => {
    const percentage = Math.min(100, Math.round((used / Math.max(1, limit)) * 100))
    const isExhausted = used >= limit

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1C1412]">{label}</span>
          <span className={`font-bold ${isExhausted ? 'text-rose-600' : 'text-[#9B6B15]'}`}>
            {used} / {limit} used ({limit - used} left)
          </span>
        </div>
        <div className="w-full bg-[#EADFCF]/60 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
              isExhausted ? 'from-rose-500 to-rose-600' : color
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-[#EADFCF] bg-white p-6 sm:p-7 shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADFCF]/70">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#9B6B15] block mb-1">
            Active Membership
          </span>
          <div className="flex items-center gap-2.5">
            <h3 className="font-serif text-2xl font-bold text-[#1C1412]">
              {data.package.name}
            </h3>
            <PackageBadge code={data.package.code} name={data.package.name} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              data.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {data.status === 'ACTIVE' ? 'Active Plan' : data.status}
          </span>
        </div>
      </div>

      {/* Expiration warning banner if expiring soon */}
      {isExpiringSoon && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Package Expiring Soon: </span>
            Your {data.package.name} subscription will conclude in {data.daysRemaining} days. Renew now to schedule your next cycle without losing access.
          </div>
        </div>
      )}

      {/* Quota Progress Bars */}
      <div className="space-y-4 bg-[#FAF7F0] p-4 sm:p-5 rounded-2xl border border-[#EADFCF]">
        <h4 className="font-serif text-sm font-bold text-[#1C1412] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#D4A72C]" />
          <span>Subscription Usage Quotas</span>
        </h4>

        {renderProgressBar('Interest Requests Sent', data.usage.interestsSent.used, data.usage.interestsSent.limit)}
        {renderProgressBar('Interest Requests Accepted', data.usage.interestsAccepted.used, data.usage.interestsAccepted.limit)}
        {renderProgressBar('Connections Unlocked & Messaged', data.usage.connectionsUnlocked.used, data.usage.connectionsUnlocked.limit, 'from-[#3B82F6] to-[#60A5FA]')}

        {(isSentNearLimit || isAcceptedNearLimit || isConnectionNearLimit) && (
          <p className="text-[11px] text-[#5C4B47] italic pt-1">
            Tip: One unlocked connection permits unlimited chat messages while your package is active.
          </p>
        )}
      </div>

      {/* Features Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFCF]">
          {data.features.matchPercentage ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-[#1C1412]/40 shrink-0" />
          )}
          <span className={data.features.matchPercentage ? 'font-bold text-[#1C1412]' : 'text-[#1C1412]/60'}>
            Match Compatibility % {data.features.matchPercentage ? 'Unlocked' : '(Silver+)'}
          </span>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFCF]">
          {data.features.contactReveal ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-[#1C1412]/40 shrink-0" />
          )}
          <span className={data.features.contactReveal ? 'font-bold text-[#1C1412]' : 'text-[#1C1412]/60'}>
            Verified Phone Number Reveal {data.features.contactReveal ? 'Unlocked' : '(Royal Platinum)'}
          </span>
        </div>
      </div>

      {/* Plan Details & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="text-xs text-[#5C4B47] space-y-0.5">
          <p>
            Duration: <span className="font-semibold text-[#1C1412]">{isFree ? 'Lifetime' : `${data.package.durationMonths} Months`}</span>
          </p>
          {data.expiresAt ? (
            <p>
              Expires: <span className="font-semibold text-[#1C1412]">{new Date(data.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span> ({data.daysRemaining} days remaining)
            </p>
          ) : (
            <p className="text-emerald-700 font-medium">Never expires. Always free to browse and maintain account.</p>
          )}
        </div>

        <Link
          to="/pricing"
          className="btn-gold px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-gold transition-all"
        >
          <span>{isFree ? 'Upgrade Package' : 'Renew / Upgrade'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
