import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Share,
  PlusSquare,
  ShieldCheck,
  Compass,
  AlertCircle,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  Download,
  Menu,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePWAInstall } from '@/hooks/usePWAInstall'

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
  const { i18n } = useTranslation()
  const lang = i18n.language === 'si' || i18n.language === 'ta' ? i18n.language : 'en'

  const { isIOS, isIPad, isIOSNonSafari } = usePWAInstall()
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(initialPlatform)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setActiveTab(isIOS ? 'ios' : initialPlatform)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, initialPlatform, isIOS])

  if (!mounted) return null

  // Trilingual Translations
  const t = {
    en: {
      badge: 'Instant PWA Install',
      titleIOS: isIPad ? 'Install Dehadak on iPad' : 'Install Dehadak on iPhone/iPad',
      titleAndroid: 'Install Dehadak on Android & Desktop',
      tabIOS: 'iPhone & iPad (Safari)',
      tabAndroid: 'Android & Chrome',
      gotIt: 'Got It, Thanks!',
      nonSafariNotice: 'You are currently using a third-party or in-app browser on iOS. Apple requires Safari to install Home Screen web apps. Please open dehadak.lk in Safari.',
      openInSafariAction: 'Open in Safari',
      step1Title: 'Open dehadak.lk in Safari',
      step1Desc: 'Launch the official Safari browser to access genuine Apple Home Screen installation.',
      step2Title: 'Tap the Share button',
      step2Desc: isIPad ? "Located in Safari's top toolbar on iPad." : "Located in Safari's bottom toolbar on iPhone.",
      step3Title: 'Scroll & select "Add to Home Screen"',
      step3Desc: 'Look down the action list in the sharing sheet for the plus icon.',
      step4Title: 'Enable "Open as Web App" if displayed',
      step4Desc: 'On iOS 16.4+, toggle this option to ensure full standalone experience.',
      step5Title: 'Tap "Add"',
      step5Desc: 'Tap the gold or blue Add button in the top-right corner.',
      step6Title: 'Open Dehadak from your Home Screen',
      step6Desc: 'Enjoy instant, full-screen matrimonial access with push notifications and zero app store delays.',
      // Android
      androidStep1Title: 'Open Browser Menu (⋮)',
      androidStep1Desc: 'Tap the 3 dots in the top or bottom corner of Chrome/Edge.',
      androidStep2Title: 'Tap "Install App" or "Add to Home screen"',
      androidStep2Desc: 'Confirm the genuine installation prompt shown by your browser.',
      androidStep3Title: 'Launch Dehadak Standalone',
      androidStep3Desc: 'The app icon is added to your home screen and drawer, functioning just like a native app.',
    },
    si: {
      badge: 'ක්ෂණික PWA ස්ථාපනය',
      titleIOS: isIPad ? 'iPad හි Dehadak ස්ථාපනය කරන්න' : 'iPhone/iPad හි Dehadak ස්ථාපනය කරන්න',
      titleAndroid: 'Android සහ පරිගණකයේ ස්ථාපනය කරන්න',
      tabIOS: 'iPhone සහ iPad (Safari)',
      tabAndroid: 'Android සහ Chrome',
      gotIt: 'තේරුණා, ස්තූතියි!',
      nonSafariNotice: 'ඔබ මේ වන විට වෙනත් බ්‍රවුසරයක සිටී. Apple දුරකථනවල හෝම් ස්ක්‍රීනයට එක් කිරීමට කරුණාකර Safari බ්‍රවුසරය භාවිතා කරන්න.',
      openInSafariAction: 'Safari හි විවෘත කරන්න',
      step1Title: 'Safari බ්‍රවුසරයෙන් dehadak.lk විවෘත කරන්න',
      step1Desc: 'නිල Safari බ්‍රවුසරය හරහා වෙබ් අඩවියට පිවිසෙන්න.',
      step2Title: 'Share (බෙදාගැනීමේ) අයිකනය තට්ටු කරන්න',
      step2Desc: isIPad ? 'Safari හි ඉහළ තීරුවේ ඇත.' : 'Safari හි පහළ තීරුවේ ඇත.',
      step3Title: '"Add to Home Screen" තෝරන්න',
      step3Desc: 'පහළට ගොස් හෝම් ස්ක්‍රීනයට එක් කිරීමේ විකල්පය තෝරන්න.',
      step4Title: '"Open as Web App" සක්‍රිය කරන්න',
      step4Desc: 'එම විකල්පය පෙන්වන්නේ නම් එය සක්‍රිය කර තබන්න.',
      step5Title: '"Add" තට්ටු කරන්න',
      step5Desc: 'ඉහළ දකුණු කෙළවරේ ඇති Add බොත්තම ඔබන්න.',
      step6Title: 'හෝම් ස්ක්‍රීනයෙන් Dehadak විවෘත කරන්න',
      step6Desc: 'දැන් කිසිදු බාධාවකින් තොරව සම්පූර්ණ තිරයෙන් යෙදුම භාවිතා කරන්න.',
      // Android
      androidStep1Title: 'බ්‍රවුසර් මෙනුව (⋮) විවෘත කරන්න',
      androidStep1Desc: 'Chrome හෝ Edge හි තිත් තුන ඔබන්න.',
      androidStep2Title: '"Install App" තෝරන්න',
      androidStep2Desc: 'ස්ථාපනය තහවුරු කිරීමේ දැනුම්දීම පිළිගන්න.',
      androidStep3Title: 'යෙදුම විවෘත කරන්න',
      androidStep3Desc: 'දැන් ඔබේ දුරකථනයේ වෙනම යෙදුමක් ලෙස ඩෙහදක් ක්‍රියා කරයි.',
    },
    ta: {
      badge: 'உடனடி PWA நிறுவல்',
      titleIOS: isIPad ? 'iPad இல் Dehadak நிறுவுக' : 'iPhone/iPad இல் Dehadak நிறுவுக',
      titleAndroid: 'Android & கணினியில் நிறுவுக',
      tabIOS: 'iPhone & iPad (Safari)',
      tabAndroid: 'Android & Chrome',
      gotIt: 'புரிந்தது, நன்றி!',
      nonSafariNotice: 'Apple சாதனங்களில் முகப்புத் திரையில் நிறுவ தயவுசெய்து Safari உலாவியைப் பயன்படுத்தவும்.',
      openInSafariAction: 'Safari இல் திறக்கவும்',
      step1Title: 'Safari இல் dehadak.lk ஐ திறக்கவும்',
      step1Desc: 'உத்தியோகபூர்வ Safari உலாவி மூலம் தளத்தை அணுகவும்.',
      step2Title: 'Share பொத்தானைத் தட்டவும்',
      step2Desc: isIPad ? 'iPad இன் மேல் பட்டியில் உள்ளது.' : 'iPhone இன் கீழ் பட்டியில் உள்ளது.',
      step3Title: '"Add to Home Screen" என்பதைத் தேர்ந்தெடுக்கவும்',
      step3Desc: 'பட்டியலில் கீழே சென்று முகப்புத் திரையில் சேர்க்கவும்.',
      step4Title: '"Open as Web App" இருப்பின் இயக்குக',
      step4Desc: 'iOS 16.4+ இல் இந்த விருப்பம் தோன்றினால் இயக்கவும்.',
      step5Title: '"Add" என்பதைத் தட்டவும்',
      step5Desc: 'மேல் வலது மூலையில் உள்ள Add பொத்தானை அழுத்தவும்.',
      step6Title: 'முகப்புத் திரையிலிருந்து Dehadak ஐ திறக்கவும்',
      step6Desc: 'முழுத்திரை பயன்பாடாக உடனடியாகப் பயன்படுத்தவும்.',
      // Android
      androidStep1Title: 'உலாவி மெனுவைத் திறக்கவும் (⋮)',
      androidStep1Desc: 'Chrome அல்லது Edge இல் 3 புள்ளிகளைத் தட்டவும்.',
      androidStep2Title: '"Install App" என்பதைத் தட்டவும்',
      androidStep2Desc: 'உலாவி காட்டும் நிறுவல் உறுதிப்படுத்தலை ஏற்கவும்.',
      androidStep3Title: 'செயலியைத் திறக்கவும்',
      androidStep3Desc: 'இப்போது உங்கள் சாதனத்தில் Dehadak தனிப் பயன்பாடாக இயங்கும்.',
    },
  }[lang]

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#1C1412] border border-[#D4A72C]/40 rounded-3xl shadow-2xl overflow-hidden text-white z-10 p-5 sm:p-7 my-auto max-h-[90vh] flex flex-col"
          >
            {/* Subtle Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D4A72C] flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center shrink-0 shadow-gold">
                <img src="/logo.png" alt="Dehadak" className="w-8 h-8 object-cover rounded-full" />
              </div>
              <div className="pr-8">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/30 text-[10px] font-bold text-[#F3D77A] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3 h-3" />
                  {t.badge}
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                  {activeTab === 'ios' ? t.titleIOS : t.titleAndroid}
                </h3>
              </div>
            </div>

            {/* Platform Tab Switcher */}
            <div className="flex rounded-2xl bg-black/40 border border-[#D4A72C]/25 p-1 mb-4 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] shadow-md'
                    : 'text-[#FAF7F0]/70 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{t.tabIOS}</span>
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
                <Download className="w-3.5 h-3.5" />
                <span>{t.tabAndroid}</span>
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto pr-1 space-y-3 mb-5 flex-1 custom-modal-scroll">
              {activeTab === 'ios' ? (
                <>
                  {/* Non-Safari Warning Callout */}
                  {isIOSNonSafari && (
                    <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-start gap-2.5 text-xs text-amber-200 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-300">Notice for iOS Users</p>
                        <p className="text-[11px] text-amber-200/90 mt-0.5">
                          {t.nonSafariNotice}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 1. Open Safari */}
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#F3D77A]" />
                        <span>{t.step1Title}</span>
                      </p>
                      <p className="text-[11px] text-[#FAF7F0]/70 mt-0.5">
                        {t.step1Desc}
                      </p>
                    </div>
                  </div>

                  {/* 2. Tap Share */}
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <Share className="w-3.5 h-3.5 text-[#F3D77A]" />
                        <span>{t.step2Title}</span>
                      </p>
                      <p className="text-[11px] text-[#FAF7F0]/70 mt-0.5">
                        {t.step2Desc}
                      </p>
                    </div>
                  </div>

                  {/* 3. Add to Home Screen */}
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <PlusSquare className="w-3.5 h-3.5 text-[#F3D77A]" />
                        <span>{t.step3Title}</span>
                      </p>
                      <p className="text-[11px] text-[#FAF7F0]/70 mt-0.5">
                        {t.step3Desc}
                      </p>
                    </div>
                  </div>

                  {/* 4. Open as Web App (iOS 16.4+) */}
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                      4
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-[#F3D77A]" />
                        <span>{t.step4Title}</span>
                      </p>
                      <p className="text-[11px] text-[#FAF7F0]/70 mt-0.5">
                        {t.step4Desc}
                      </p>
                    </div>
                  </div>

                  {/* 5. Tap Add */}
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                      5
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F3D77A]" />
                        <span>{t.step5Title}</span>
                      </p>
                      <p className="text-[11px] text-[#FAF7F0]/70 mt-0.5">
                        {t.step5Desc}
                      </p>
                    </div>
                  </div>

                  {/* 6. Open from Home Screen */}
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                      6
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-[#F3D77A]" />
                        <span>{t.step6Title}</span>
                      </p>
                      <p className="text-[11px] text-[#FAF7F0]/70 mt-0.5">
                        {t.step6Desc}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Android Step 1 */}
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <Menu className="w-3.5 h-3.5 text-[#F3D77A]" />
                        <span>{t.androidStep1Title}</span>
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#FAF7F0]/70 mt-0.5">
                        {t.androidStep1Desc}
                      </p>
                    </div>
                  </div>

                  {/* Android Step 2 */}
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-[#F3D77A]" />
                        <span>{t.androidStep2Title}</span>
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#FAF7F0]/70 mt-0.5">
                        {t.androidStep2Desc}
                      </p>
                    </div>
                  </div>

                  {/* Android Step 3 */}
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#F3D77A] font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F3D77A]" />
                        <span>{t.androidStep3Title}</span>
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#FAF7F0]/70 mt-0.5">
                        {t.androidStep3Desc}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-serif font-bold text-sm sm:text-base text-[#241A17] bg-gradient-to-r from-[#F3D77A] via-[#E5A93C] to-[#D4A72C] hover:brightness-105 transition-all shadow-gold cursor-pointer shrink-0"
            >
              {t.gotIt}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
