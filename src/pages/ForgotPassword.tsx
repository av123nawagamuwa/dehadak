import { useState } from 'react'
import { Link } from 'react-router'
import { Input } from '@/components/ui/input'
import { API_BASE_URL } from '@/config'

export default function ForgotPassword() {
    const [identifier, setIdentifier] = useState('')
    const [channel, setChannel] = useState<'email' | 'sms'>('email')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [resetStage, setResetStage] = useState<'request' | 'reset'>('request')

    const requestReset = async () => {
        setLoading(true)
        setMessage('Sending reset code...')

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, channel }),
            })

            const data = await response.json()
            if (!response.ok) {
                setMessage(data.error || 'Unable to send reset code')
                return
            }

            setResetStage('reset')
            setMessage('Reset code sent. Enter it below with your new password.')
        } catch {
            setMessage('Unable to send reset code. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const resetPassword = async () => {
        setLoading(true)
        setMessage('Resetting password...')

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, code, newPassword, channel }),
            })

            const data = await response.json()
            if (!response.ok) {
                setMessage(data.error || 'Unable to reset password')
                return
            }

            setMessage('Password updated successfully. You can log in now.')
            setResetStage('request')
            setCode('')
            setNewPassword('')
        } catch {
            setMessage('Unable to reset password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-light-bg pt-[72px] flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-light-border">
                <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                    Choose email or SMS to receive your reset code.
                </p>

                {message && <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4 text-sm">{message}</div>}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email or Phone</label>
                        <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Enter your email or +94 phone" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Delivery Method</label>
                        <select
                            value={channel}
                            onChange={(e) => setChannel(e.target.value as 'email' | 'sms')}
                            className="w-full rounded-xl border border-light-border px-3 py-2.5 bg-white"
                        >
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                        </select>
                    </div>

                    {resetStage === 'reset' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Reset Code</label>
                                <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter the 6-digit code" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter a new password" />
                            </div>
                        </>
                    )}

                    <button
                        type="button"
                        disabled={loading}
                        onClick={resetStage === 'request' ? requestReset : resetPassword}
                        className="w-full bg-gold text-dark-bg py-2 rounded-xl font-semibold hover:bg-gold-light transition disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : resetStage === 'request' ? 'Send Reset Code' : 'Reset Password'}
                    </button>
                </div>

                <div className="mt-4 text-center text-sm">
                    <Link to="/login" className="text-gold font-medium hover:underline">Back to login</Link>
                </div>
            </div>
        </div>
    )
}