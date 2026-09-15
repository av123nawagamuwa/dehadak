import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router'
import {
  Heart,
  Lock,
  X,
  Sparkles,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  LogIn,
} from 'lucide-react'
import { useRegisterModal } from '@/context/RegisterModalContext'

interface AuthPromptDetail {
  memberName?: string
  profileId?: number | string
}

export default function AuthPromptModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [promptData, setPromptData] = useState<AuthPromptDetail>({})
  const navigate = useNavigate()
  const { openRegisterModal } = useRegisterModal()

  useEffect(() => {
    const handleOpenPrompt = (e: CustomEvent<AuthPromptDetail>) => {
      setPromptData(e.detail || {})
      setIsOpen(true)
    }

    window.addEventListener('open-auth-prompt' as any, handleOpenPrompt)
    return () => {
      window.removeEventListener('open-auth-prompt' as any, handleOpenPrompt)
    }
  }, [])

  const handleGoToLogin = () => {
    setIsOpen(false)
    navigate('/login')
  }

  const handleGoToRegister = () => {
    setIsOpen(false)
    openRegisterModal()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5A93C]/40 z-10 p-6 sm:p-8 text-[#1C1412]"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Luxury Top Emblem */}
          <div className="text-center mb-6">
            <div className="relative w-18 h-18 mx-auto mb-4 flex items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#F7D878] via-[#E5A93C] to-[#9B6B15] flex items-center justify-center shadow-gold">
                <Heart className="w-8 h-8 text-[#1C1412] fill-current" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1C1412] border-2 border-white flex items-center justify-center text-[#F7D878]">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-bold uppercase tracking-wider text-[#9B6B15] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Dignified Connection Security</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#1C1412] tracking-tight">
              Sign In to Send Interest
            </h3>

            <p className="text-xs sm:text-sm text-[#1C1412]/75 mt-2 leading-relaxed font-sans max-w-xs mx-auto">
              You must be logged in to send an interest request to{' '}
              <span className="font-bold text-[#9B6B15]">
                {promptData.memberName || 'this verified member'}
              </span>
              .
            </p>
          </div>

          {/* Verified Protection Points */}
          <div className="bg-[#FAF6F0] rounded-2xl p-4 border border-[#EADFCF] mb-6 space-y-2.5 text-xs text-[#1C1412]/80 font-sans">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#9B6B15] shrink-0" />
              <span>100% Privacy Control & Verified Sri Lankan Community</span>
            </div>
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-[#9B6B15] shrink-0" />
              <span>Direct contact details unlocked upon mutual acceptance</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#9B6B15] shrink-0" />
              <span>Free registration in less than 2 minutes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoToLogin}
              className="btn-gold w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-gold hover:shadow-gold-lg flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Password</span>
            </button>

            <button
              onClick={handleGoToRegister}
              className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#FAF6F0] hover:bg-[#EADFCF]/50 border border-[#EADFCF] text-[#1C1412] flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#9B6B15]" />
              <span>Create a New Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
