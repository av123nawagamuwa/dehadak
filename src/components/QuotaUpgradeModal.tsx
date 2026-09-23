import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router'
import PackageBadge from './PackageBadge'

export interface QuotaModalData {
  isOpen: boolean
  title?: string
  message: string
  feature?: string
  currentPlan?: string
  used?: number
  limit?: number
  suggestedPackage?: 'SILVER' | 'GOLD' | 'PLATINUM'
}

interface QuotaUpgradeModalProps {
  isOpen?: boolean
  feature?: string
  packageCode?: string
  message?: string
  title?: string
  data?: QuotaModalData | null
  onClose: () => void
}

export default function QuotaUpgradeModal({
  isOpen,
  feature,
  packageCode,
  message,
  title,
  data,
  onClose,
}: QuotaUpgradeModalProps) {
  const navigate = useNavigate()

  const isModalOpen = isOpen !== undefined ? isOpen : Boolean(data?.isOpen)
  if (!isModalOpen) return null

  const displayTitle =
    title ||
    data?.title ||
    (feature === 'CONTACT_REVEAL'
      ? 'Royal Platinum Exclusive'
      : feature === 'PREFERENCE_MATCH'
        ? 'Compatibility Match Score'
        : feature === 'MESSAGING_CONNECTION'
          ? 'Connection Limit Reached'
          : 'Upgrade Your Package')

  const displayMessage =
    message ||
    data?.message ||
    'You have reached your allowance for this subscription cycle. Upgrade to continue exploring and connecting with verified candidates.'

  const displayPlan = packageCode || data?.currentPlan

  const handleUpgradeNow = () => {
    onClose()
    navigate('/pricing')
  }

  const handleViewPackages = () => {
    onClose()
    navigate('/pricing')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFFFFF] to-[#FAF7F0] p-6 sm:p-8 shadow-2xl border border-[#EADFCF] z-10 text-[#1C1412]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#1C1412]/50 hover:text-[#1C1412] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Crown Icon */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F7D878] via-[#E5A93C] to-[#D4A72C] flex items-center justify-center text-[#1C1412] shadow-gold mb-4 ring-4 ring-[#F3D77A]/20">
              <Crown className="w-7 h-7" />
            </div>

            {displayPlan && (
              <div className="mb-2">
                <PackageBadge code={displayPlan} size="sm" />
              </div>
            )}

            <h3 className="font-serif text-2xl font-bold text-[#1C1412] tracking-tight mb-2">
              {displayTitle}
            </h3>

            <p className="text-sm text-[#5C4B47] leading-relaxed mb-6">
              {displayMessage}
            </p>

            {/* Quota Indicator if provided */}
            {data?.used !== undefined && data?.limit !== undefined && (
              <div className="w-full bg-[#FAF6F0] border border-[#EADFCF] rounded-2xl p-3 mb-6 flex items-center justify-between text-xs font-semibold text-[#1C1412]">
                <span className="text-[#5C4B47]">Usage Counter:</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#EADFCF]/60 text-[#9B6B15] font-bold">
                  {data.used} / {data.limit} used
                </span>
              </div>
            )}

            {/* Value Props Reminder */}
            <div className="w-full bg-gradient-to-r from-[#FAF7F0] via-white to-[#FAF7F0] border border-[#EADFCF]/70 rounded-2xl p-3.5 mb-6 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-[#1C1412]">
                <Sparkles className="w-4 h-4 text-[#D4A72C] shrink-0" />
                <span>Up to 150 requests & connections with paid packages</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#1C1412]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All connections & conversation histories are permanently preserved</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2.5">
              <button
                type="button"
                onClick={handleUpgradeNow}
                className="w-full py-3.5 px-6 rounded-2xl btn-gold text-sm font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-lg transition-all cursor-pointer"
              >
                <span>Upgrade Now / View Packages</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleViewPackages}
                className="w-full py-2.5 px-6 rounded-2xl bg-white border border-[#EADFCF] text-xs font-bold text-[#1C1412] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              >
                Explore Pricing Plans
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-1.5 text-xs font-medium text-[#5C4B47] hover:text-[#1C1412] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
