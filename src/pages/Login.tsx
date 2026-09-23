import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { Input } from '@/components/ui/input'
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react'
import { useRegisterModal } from '@/context/RegisterModalContext'
import { API_BASE_URL } from '@/config'
import { syncPushSubscriptionOnLogin } from '@/utils/pushManager'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { openRegisterModal } = useRegisterModal()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('dehadak_auth', data.token)
        localStorage.setItem('dehadak_user', JSON.stringify(data.user || {}))
        syncPushSubscriptionOnLogin(data.token).catch(() => {})
        const destination = (location.state as any)?.from || '/'
        navigate(destination, { replace: true })
      } else {
        setError(data.error || 'Login failed. Please check your email and password.')
      }
    } catch (err) {
      setError('An error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-32 pb-20 flex items-center justify-center px-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md border border-[#EADFCF] relative overflow-hidden">
        
        {/* Decorative Top Gold Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F7D878] via-[#E5A93C] to-[#9B6B15]" />

        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E5A93C]/60 shadow-gold mx-auto mb-3 bg-[#1C1412] flex items-center justify-center p-0.5">
          <img
            src="/logo.png"
            alt="Dehadak Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center text-[#1C1412] mb-1">
          Welcome Back
        </h2>
        <p className="text-xs text-center text-[#1C1412]/65 mb-6">
          Sign in to your Dehadak matrimonial account
        </p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl mb-5 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
              Email or Mobile Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. yourname@gmail.com"
                className="pl-10 h-11 rounded-xl border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="pl-10 h-11 rounded-xl border-gray-200 focus:border-[#E5A93C] focus:ring-2 focus:ring-[#E5A93C]/20 text-sm"
              />
            </div>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-[#E5A93C] hover:text-[#9B6B15] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-lg transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-[#1C1412]/75">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={openRegisterModal}
            className="font-bold text-[#E5A93C] hover:underline"
          >
            Register Free Profile
          </button>
        </div>

      </div>
    </div>
  )
}
