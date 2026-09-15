import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share, PlusSquare, ShieldCheck, Download } from 'lucide-react'

interface InstallInstructionsModalProps {
  isOpen: boolean
  onClose: () => void
  initialPlatform?: 'ios' | 'android'
}

export default function InstallInstructionsModal({
  isOpen,
  onClose,
  initialPlatform = 'ios',
}: InstallInstructionsModalProps) {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(initialPlatform)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialPlatform)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, initialPlatform])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#241A17] border border-[#D4A72C]/40 rounded-3xl shadow-2xl overflow-hidden text-white z-10 p-6 sm:p-8 my-auto"
          >
            {/* Subtle Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D4A72C] flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center shrink-0 shadow-gold">
                <img src="/logo.png" alt="Dehadak" className="w-8 h-8 object-cover rounded-full" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/30 text-[10px] font-bold text-[#F3D77A] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3 h-3" />
                  Instant PWA Install
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Install Dehadak App
                </h3>
              </div>
            </div>

            {/* Platform Tab Switcher */}
            <div className="flex rounded-2xl bg-black/40 border border-[#D4A72C]/25 p-1 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] shadow-md'
                    : 'text-[#FAF7F0]/70 hover:text-white'
                }`}
              >
                <span>iPhone & iPad (Safari)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] shadow-md'
                    : 'text-[#FAF7F0]/70 hover:text-white'
                }`}
              >
                <span>Android & Chrome</span>
              </button>
            </div>

            {/* Instructions Content */}
            {activeTab === 'ios' ? (
              <div className="space-y-3.5 mb-8">
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Tap the <span className="text-[#F3D77A] inline-flex items-center gap-1 font-bold"><Share className="w-3.5 h-3.5 inline" /> Share</span> icon
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#FAF7F0]/70 mt-0.5">
                      Located in Safari's bottom toolbar (or top bar on iPad).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Select <span className="text-[#F3D77A] inline-flex items-center gap-1 font-bold"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</span>
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#FAF7F0]/70 mt-0.5">
                      Scroll down the sharing sheet options and tap this choice.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Tap <span className="text-[#F3D77A] font-bold">"Add"</span> in the top-right
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#FAF7F0]/70 mt-0.5">
                      Dehadak will now appear as a full standalone app on your device.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 mb-8">
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Open <span className="text-[#F3D77A] font-bold">Browser Menu (⋮)</span>
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#FAF7F0]/70 mt-0.5">
                      Tap the 3 dots in the top or bottom corner of Chrome/Edge.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Tap <span className="text-[#F3D77A] inline-flex items-center gap-1 font-bold"><Download className="w-3.5 h-3.5 inline" /> Install App</span>
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#FAF7F0]/70 mt-0.5">
                      Or select "Add to Home screen" if prompted.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Confirm & Launch
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#FAF7F0]/70 mt-0.5">
                      Enjoy instantaneous full-screen access to matches and chats.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl font-serif font-bold text-base text-[#241A17] bg-gradient-to-r from-[#F3D77A] via-[#E5A93C] to-[#D4A72C] hover:brightness-105 transition-all shadow-gold cursor-pointer"
            >
              Got It, Thanks!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
