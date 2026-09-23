import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Input } from '@/components/ui/input'
import {
    Mail,
    Lock,
    KeyRound,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Eye,
    EyeOff,
    AlertCircle,
    RefreshCw
} from 'lucide-react'
import { API_BASE_URL } from '@/config'

type Step = 1 | 2 | 3 | 4

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [step, setStep] = useState<Step>(1)
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [error, setError] = useState('')
    const [infoMessage, setInfoMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const [redirectCountdown, setRedirectCountdown] = useState(4)

    // Cooldown timer for Resend Code
    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [resendCooldown])

    // Auto-redirect timer on success (Step 4)
    useEffect(() => {
        if (step !== 4) return
        if (redirectCountdown <= 0) {
            navigate('/login')
            return
        }
        const timer = setInterval(() => {
            setRedirectCountdown((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [step, redirectCountdown, navigate])

    // Step 1: Send 6-digit OTP code to Gmail
    const handleSendCode = async (e?: React.FormEvent, isResend = false) => {
        if (e) e.preventDefault()
        setError('')
        setInfoMessage('')

        const cleanEmail = email.trim().toLowerCase()
        if (!cleanEmail) {
            setError('Please enter your email address.')
            return
        }

        // Basic email syntax check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(cleanEmail)) {
            setError('Please enter a valid email address (e.g., example@gmail.com).')
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: cleanEmail, channel: 'email' }),
            })

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 404) {
                    setError('No account found with this email address. Please check your spelling or register for a new account.')
                } else {
                    setError(data.error || 'Failed to send verification code. Please try again.')
                }
                return
            }

            setResendCooldown(60)
            if (isResend) {
                setInfoMessage('A fresh 6-digit verification code has been sent to your Gmail!')
            } else {
                setStep(2)
                setInfoMessage('A 6-digit verification code has been sent to your Gmail inbox.')
            }
        } catch {
            setError('Unable to connect to the server. Please check your internet connection and try again.')
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Verify the 6-digit code
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setInfoMessage('')

        const cleanCode = code.trim().replace(/\s+/g, '')
        if (!cleanCode || cleanCode.length !== 6) {
            setError('Please enter the complete 6-digit verification code.')
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: email.trim().toLowerCase(), code: cleanCode }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Invalid or expired verification code. Please check and try again.')
                return
            }

            setStep(3)
        } catch {
            setError('Failed to verify code. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Step 3: Double-check and save new password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setInfoMessage('')

        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters long.')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match. Please verify both password fields.')
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: email.trim().toLowerCase(),
                    code: code.trim(),
                    newPassword,
                    confirmPassword,
                    channel: 'email',
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to reset password. Please try again.')
                return
            }

            setStep(4)
        } catch {
            setError('Unable to reset password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword
    const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

    return (
        <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-16 flex items-center justify-center px-4">
            <div className="bg-white p-7 sm:p-10 rounded-3xl shadow-xl w-full max-w-md border border-[#EADFCF] relative overflow-hidden">
                {/* Decorative Top Gold Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F7D878] via-[#E5A93C] to-[#9B6B15]" />

                {/* Brand Logo & Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E5A93C]/60 shadow-md mx-auto mb-3 bg-[#1C1412] flex items-center justify-center p-1">
                        <img
                            src="/logo.png"
                            alt="Dehadak Logo"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>

                    {/* Step Indicators */}
                    {step < 4 && (
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                                    step >= 1
                                        ? 'bg-[#1C1412] text-[#E5A93C] ring-2 ring-[#E5A93C]/40'
                                        : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                                1
                            </span>
                            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-[#E5A93C]' : 'bg-gray-200'}`} />
                            <span
                                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                                    step >= 2
                                        ? 'bg-[#1C1412] text-[#E5A93C] ring-2 ring-[#E5A93C]/40'
                                        : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                                2
                            </span>
                            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-[#E5A93C]' : 'bg-gray-200'}`} />
                            <span
                                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                                    step >= 3
                                        ? 'bg-[#1C1412] text-[#E5A93C] ring-2 ring-[#E5A93C]/40'
                                        : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                                3
                            </span>
                        </div>
                    )}

                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-center text-[#1C1412] mt-1">
                        {step === 1 && 'Reset Password'}
                        {step === 2 && 'Enter Verification Code'}
                        {step === 3 && 'Create New Password'}
                        {step === 4 && 'Password Reset Complete'}
                    </h1>
                    <p className="text-xs text-center text-[#1C1412]/70 mt-1 max-w-xs">
                        {step === 1 && 'Enter your registered Gmail to receive a 6-digit verification code.'}
                        {step === 2 && (
                            <>
                                We sent a 6-digit code to{' '}
                                <span className="font-semibold text-[#1C1412]">{email}</span>
                            </>
                        )}
                        {step === 3 && 'Enter and double-check your new password below.'}
                        {step === 4 && 'Your password has been reset successfully.'}
                    </p>
                </div>

                {/* Notifications & Error messages */}
                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl mb-4 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>{error}</div>
                    </div>
                )}
                {infoMessage && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-2xl mb-4 text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>{infoMessage}</div>
                    </div>
                )}

                {/* STEP 1: Enter Gmail / Email */}
                {step === 1 && (
                    <form onSubmit={(e) => handleSendCode(e)} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                                Registered Gmail / Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@gmail.com"
                                    required
                                    autoFocus
                                    className="pl-10 h-11 rounded-2xl border-[#EADFCF] focus:border-[#E5A93C] focus:ring-[#E5A93C]/20 bg-[#FAF6F0]/30 text-sm"
                                />
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
                                A 6-digit code will be sent to your Gmail inbox.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#9B6B15] via-[#E5A93C] to-[#9B6B15] text-[#1C1412] hover:opacity-95 h-11 rounded-2xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Checking & Sending Code...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Verification Code</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* STEP 2: Enter 6-digit Verification Code */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-[#1C1412]">
                                    6-Digit Verification Code
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1)
                                        setError('')
                                        setInfoMessage('')
                                    }}
                                    className="text-[11px] text-[#9B6B15] hover:underline"
                                >
                                    Change email
                                </button>
                            </div>
                            <div className="relative">
                                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="123456"
                                    required
                                    autoFocus
                                    className="pl-10 h-12 text-center text-xl font-mono tracking-[0.4em] font-bold rounded-2xl border-[#EADFCF] focus:border-[#E5A93C] focus:ring-[#E5A93C]/20 bg-[#FAF6F0]/30"
                                />
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1.5 text-center">
                                Code expires in 10 minutes. Please check your Spam folder if needed.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || code.trim().length !== 6}
                            className="w-full bg-gradient-to-r from-[#9B6B15] via-[#E5A93C] to-[#9B6B15] text-[#1C1412] hover:opacity-95 h-11 rounded-2xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Verifying Code...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Verify & Continue</span>
                                </>
                            )}
                        </button>

                        {/* Resend button */}
                        <div className="pt-2 text-center">
                            <button
                                type="button"
                                disabled={loading || resendCooldown > 0}
                                onClick={() => handleSendCode(undefined, true)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9B6B15] hover:text-[#7A530E] disabled:text-gray-400 disabled:cursor-not-allowed transition"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                                {resendCooldown > 0
                                    ? `Resend Code in ${resendCooldown}s`
                                    : 'Did not receive code? Resend Code'}
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 3: Double-Check New Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-bold text-[#1C1412] mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min. 6 characters)"
                                    required
                                    autoFocus
                                    className="pl-10 pr-10 h-11 rounded-2xl border-[#EADFCF] focus:border-[#E5A93C] focus:ring-[#E5A93C]/20 bg-[#FAF6F0]/30 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password (Double Checking) */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-[#1C1412]">
                                    Confirm New Password
                                </label>
                                {passwordsMatch && (
                                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords Match
                                    </span>
                                )}
                                {passwordsMismatch && (
                                    <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> Passwords Do Not Match
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    required
                                    className={`pl-10 pr-10 h-11 rounded-2xl border-[#EADFCF] focus:ring-[#E5A93C]/20 bg-[#FAF6F0]/30 text-sm ${
                                        passwordsMatch
                                            ? 'border-emerald-400 focus:border-emerald-500'
                                            : passwordsMismatch
                                            ? 'border-amber-400 focus:border-amber-500'
                                            : 'focus:border-[#E5A93C]'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !passwordsMatch || newPassword.length < 6}
                            className="w-full bg-gradient-to-r from-[#9B6B15] via-[#E5A93C] to-[#9B6B15] text-[#1C1412] hover:opacity-95 h-11 rounded-2xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Updating Password...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Reset Password & Save</span>
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* STEP 4: Success & Redirect */}
                {step === 4 && (
                    <div className="text-center py-4 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-[#1C1412]">
                                Your Password Has Been Updated!
                            </h2>
                            <p className="text-xs text-gray-600 mt-1">
                                You can now sign in using your registered Gmail address and new password.
                            </p>
                        </div>

                        <div className="bg-amber-50 border border-[#EADFCF] rounded-2xl p-3 text-xs text-[#1C1412]/80">
                            Redirecting to login in <span className="font-bold text-[#9B6B15]">{redirectCountdown}</span> seconds...
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full bg-gradient-to-r from-[#9B6B15] via-[#E5A93C] to-[#9B6B15] text-[#1C1412] hover:opacity-95 h-11 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Go to Login Now</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Footer Link */}
                <div className="mt-6 pt-5 border-t border-[#EADFCF]/60 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1412]/70 hover:text-[#9B6B15] transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Return to Sign In</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}