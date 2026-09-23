import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react'
import { API_BASE_URL } from '@/config'
import PackageBadge from '@/components/PackageBadge'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timer: any = null
    let pollCount = 0

    const fetchStatus = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('dehadak_auth')
        const headers: Record<string, string> = {}
        if (token) headers['Authorization'] = `Bearer ${token}`

        const res = await fetch(`${API_BASE_URL}/api/payments/${encodeURIComponent(orderId)}/status`, {
          headers
        })

        if (res.ok) {
          const data = await res.json()
          setOrder(data)

          // If still pending, poll a couple of times for iPay webhook to arrive
          if (data.status === 'PENDING' && pollCount < 4) {
            pollCount++
            timer = setTimeout(fetchStatus, 3000)
            return
          }
        } else {
          setError('Unable to verify payment status at this moment.')
        }
      } catch (err: any) {
        console.error('Payment status fetch error:', err)
        setError('Network error while checking status.')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [orderId])

  const isSuccess = order?.status === 'SUCCESS' || (!orderId && !error)

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C1412] pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCF] shadow-2xl text-center relative overflow-hidden"
      >
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F7D878] via-[#E5A93C] to-[#9B6B15]" />

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-[#D4A72C]">
            <Loader2 className="w-10 h-10 animate-spin" />
            <h3 className="font-serif text-lg font-bold text-[#1C1412]">Verifying Your Payment...</h3>
            <p className="text-xs text-[#735A51]">Connecting with iPay Payment Gateway. Please wait a moment.</p>
          </div>
        ) : isSuccess ? (
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4E6] text-[#A67C1E] text-xs font-semibold border border-[#EADFCF] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Payment Confirmed & Verified</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412]">
                Welcome to Premium!
              </h2>
              <p className="text-xs sm:text-sm text-[#735A51] mt-2 leading-relaxed">
                Your payment has been successfully processed by iPay. Your enhanced matrimonial package is now officially active.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#EADFCF] text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADFCF]/60">
                <span className="text-xs font-semibold text-[#735A51]">Membership Package</span>
                <PackageBadge
                  code={order?.packageCode || 'PLATINUM'}
                  name={order?.packageName || 'Royal Platinum'}
                  size="md"
                />
              </div>

              {order?.orderReference && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#735A51]">Order ID</span>
                  <span className="font-mono font-bold text-[#1C1412]">{order.orderReference}</span>
                </div>
              )}

              {order?.amount && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#735A51]">Amount Paid</span>
                  <span className="font-bold text-emerald-700">Rs. {order.amount.toLocaleString()} LKR</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#735A51]">Payment Method</span>
                <span className="font-semibold text-[#1C1412]">iPay Payment Gateway</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#735A51]">Status</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  Active & Unlocked
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/search"
                className="btn-gold flex-1 py-3 rounded-2xl font-bold text-xs sm:text-sm text-[#1C1412] shadow-gold flex items-center justify-center gap-2"
              >
                <span>Browse Verified Matches</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/profile"
                className="px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm bg-white hover:bg-[#FAF7F0] border border-[#EADFCF] text-[#1C1412] transition-colors flex items-center justify-center"
              >
                View My Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1412]">Payment Status: Pending</h2>
              <p className="text-xs sm:text-sm text-[#735A51] mt-2">
                Your transaction is being confirmed by your bank. Your membership will automatically activate once verified.
              </p>
            </div>

            {order?.orderReference && (
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#EADFCF] text-xs font-mono text-[#735A51]">
                Reference: {order.orderReference}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/pricing"
                className="btn-gold w-full py-3 rounded-2xl font-bold text-xs text-[#1C1412] shadow-gold flex items-center justify-center"
              >
                Return to Pricing
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
