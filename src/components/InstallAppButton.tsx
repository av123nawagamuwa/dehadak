import { useState } from 'react'
import { Download, CheckCircle2 } from 'lucide-react'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import InstallInstructionsModal from './InstallInstructionsModal'

interface InstallAppButtonProps {
  variant?: 'navbar' | 'hero' | 'card' | 'outline'
  className?: string
  label?: string
  showIcon?: boolean
}

export default function InstallAppButton({
  variant = 'navbar',
  className = '',
  label,
  showIcon = true,
}: InstallAppButtonProps) {
  const {
    isInstalled,
    isIOS,
    installApp,
    showInstructionsModal,
    setShowInstructionsModal,
  } = usePWAInstall()

  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await installApp()
    } finally {
      setLoading(false)
    }
  }

  if (isInstalled && variant === 'navbar') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4A72C]/15 border border-[#D4A72C]/30 text-xs font-semibold text-[#F3D77A]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#F3D77A]" />
        <span>App Installed</span>
      </div>
    )
  }

  // Choose style according to variant
  let styleClasses = ''
  if (variant === 'navbar') {
    styleClasses =
      'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F3D77A] via-[#E5A93C] to-[#D4A72C] text-[#241A17] hover:brightness-105 border border-[#D4A72C]/50 shadow-gold transition-all duration-200 transform hover:scale-[1.02] active:scale-95'
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

  const defaultText = isInstalled
    ? 'App Installed'
    : label || (variant === 'navbar' ? 'Install App' : 'Install Dehadak App')

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`${styleClasses} ${className} cursor-pointer`}
      >
        {showIcon && (
          isInstalled ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <Download className="w-4 h-4 shrink-0 animate-bounce" />
          )
        )}
        <span>{defaultText}</span>
      </button>

      {/* Modal */}
      <InstallInstructionsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        initialPlatform={isIOS ? 'ios' : 'android'}
      />
    </>
  )
}
