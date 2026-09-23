import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { ShieldCheck, Mail, AlertCircle, Loader2, KeyRound } from 'lucide-react'
import { API_BASE_URL } from '@/config'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Invalid admin credentials.')
      }

      localStorage.setItem('dehadak_admin_auth', data.token)
      localStorage.setItem('dehadak_admin_user', JSON.stringify(data.admin || {}))

      navigate('/admin/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Login error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#140F0E] flex flex-col items-center justify-center p-4 sm:p-6 text-white font-sans relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#E5A93C]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#E5A93C]/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md bg-[#1C1412] rounded-3xl border border-[#E5A93C]/40 p-7 sm:p-9 shadow-2xl z-10"
      >
        {/* Top Gold Shimmer Line */}
        <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#E5A93C] to-transparent rounded-t-3xl" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-[#E5A93C]/70 shadow-gold bg-[#140F0E] mx-auto flex items-center justify-center p-1 mb-4">
            <img src="/logo.png" alt="Dehadak" className="w-full h-full object-cover rounded-full" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Dehadak Admin</span>
          </h1>
          <p className="text-xs text-[#F7D878]/80 mt-1 font-medium">
            Administrative Access & Verification Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#FAF6F0] mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#E5A93C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dehadak.lk"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#281D1A] border border-[#E5A93C]/30 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-xs sm:text-sm text-white outline-none transition-all placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FAF6F0] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#E5A93C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#281D1A] border border-[#E5A93C]/30 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-xs sm:text-sm text-white outline-none transition-all placeholder:text-neutral-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F7D878] via-[#E5A93C] to-[#9B6B15] text-[#1C1412] font-bold text-xs sm:text-sm shadow-gold hover:shadow-gold-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#1C1412]" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-[#1C1412]" />
                <span>Sign In to Admin Console</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/50">
            Strictly authorized personnel only. All access attempts are logged and monitored.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
