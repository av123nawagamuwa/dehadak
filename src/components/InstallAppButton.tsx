import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import InstallInstructionsModal from './InstallInstructionsModal'

interface InstallAppButtonProps {
  variant?: 'navbar' | 'hero' | 'card' | 'outline'
  className?: string
  label?: string
  showIcon?: boolean
}

// Trilingual dictionaries for button state labels
const BUTTON_LABELS = {
  en: {
    install: 'Install App',
    installIPhone: 'Install on iPhone',
    installIPad: 'Install on iPad',
    preparing: 'Preparing…',
    howToInstall: 'How to Install',
  },
  si: {
    install: 'යෙදුම ස්ථාපනය කරන්න',
    installIPhone: 'iPhone හි ස්ථාපනය කරන්න',
    installIPad: 'iPad හි ස්ථාපනය කරන්න',
    preparing: 'සූදානම් වෙමින්…',
    howToInstall: 'ස්ථාපනය කරන අයුරු',
  },
  ta: {
    install: 'செயலியை நிறுவுக',
    installIPhone: 'iPhone இல் நிறுவுக',
    installIPad: 'iPad இல் நிறுவுக',
    preparing: 'தயாராகிறது…',
    howToInstall: 'எவ்வாறு நிறுவுவது',
  },
}

export default function InstallAppButton({
  variant = 'navbar',
  className = '',
  label,
  showIcon = true,
}: InstallAppButtonProps) {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'si' || i18n.language === 'ta' ? i18n.language : 'en') as keyof typeof BUTTON_LABELS
  const tLabels = BUTTON_LABELS[lang] || BUTTON_LABELS.en

  const {
    isInstalled,
    isStandalone,
    isInstallable,
    isIOS,
    isIPad,
    isPreparing,
    installApp,
    showInstructionsModal,
    setShowInstructionsModal,
  } = usePWAInstall()

  const [loading, setLoading] = useState(false)

  // REQUIREMENT 3, 6, 10: Hide the Install App button completely when already installed or in standalone mode
  if (isInstalled || isStandalone) {
    return null
  }

  const handleClick = async () => {
    if (loading || isPreparing) return
    setLoading(true)
    try {
      await installApp()
    } finally {
      setLoading(false)
    }
  }

  // Determine button label based on platform, state, and requirements
  let buttonText = label
  if (!buttonText) {
    if (loading || isPreparing) {
      buttonText = tLabels.preparing
    } else if (isIPad) {
      buttonText = tLabels.installIPad
    } else if (isIOS) {
      buttonText = tLabels.installIPhone
    } else if (isInstallable) {
      buttonText = tLabels.install
    } else {
      buttonText = variant === 'hero' ? tLabels.install : tLabels.howToInstall
    }
  }

  // Choose style according to variant
  let styleClasses = ''
  if (variant === 'navbar') {
    styleClasses =
      'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F3D77A] via-[#E5A93C] to-[#D4A72C] text-[#241A17] hover:brightness-105 border border-[#D4A72C]/50 shadow-gold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shrink-0'
  } else if (variant === 'hero') {
    styleClasses =
      'inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-serif font-bold bg-gradient-to-r from-[#F3D77A] via-[#E5A93C] to-[#D4A72C] text-[#241A17] hover:brightness-110 border border-[#D4A72C] shadow-gold transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95'
  } else if (variant === 'card') {
    styleClasses =
      'inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-serif font-bold bg-gradient-to-r from-[#F3D77A] via-[#E5A93C] to-[#D4A72C] text-[#241A17] hover:brightness-105 shadow-gold transition-all active:scale-98'
  } else if (variant === 'outline') {
    styleClasses =
      'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-[#F3D77A] bg-[#241A17]/60 hover:bg-[#241A17] border border-[#D4A72C]/40 hover:border-[#D4A72C] backdrop-blur-md transition-all'
  }

  const isBusy = loading || isPreparing

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isBusy}
        aria-label={buttonText}
        className={`${styleClasses} ${className} ${isBusy ? 'opacity-80 cursor-wait' : 'cursor-pointer'}`}
      >
        {showIcon && (
          isBusy ? (
            <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-[#241A17]" />
          ) : (
            <Download className="w-3.5 h-3.5 shrink-0" />
          )
        )}
        <span>{buttonText}</span>
      </button>

      {/* Manual Instructions Modal */}
      <InstallInstructionsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        initialPlatform={isIOS ? 'ios' : 'android'}
      />
    </>
  )
}
