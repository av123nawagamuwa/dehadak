import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
    appinstalled: Event
  }
  interface Window {
    __DEHADAK_DEFERRED_PROMPT__?: BeforeInstallPromptEvent | null
  }
  interface Navigator {
    standalone?: boolean
  }
}

// Module-level global store for beforeinstallprompt so early events are never lost
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null

// Listen at the earliest possible window lifecycle
if (typeof window !== 'undefined') {
  if (window.__DEHADAK_DEFERRED_PROMPT__) {
    globalDeferredPrompt = window.__DEHADAK_DEFERRED_PROMPT__
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    globalDeferredPrompt = e as BeforeInstallPromptEvent
    window.__DEHADAK_DEFERRED_PROMPT__ = e as BeforeInstallPromptEvent
    window.dispatchEvent(new CustomEvent('dehadak:pwa-prompt-available'))
  })

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null
    window.__DEHADAK_DEFERRED_PROMPT__ = null
    window.dispatchEvent(new CustomEvent('dehadak:pwa-installed'))
  })
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => globalDeferredPrompt || (typeof window !== 'undefined' ? window.__DEHADAK_DEFERRED_PROMPT__ || null : null)
  )
  const [isInstallable, setIsInstallable] = useState<boolean>(() => !!deferredPrompt)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)
  const [isIOS, setIsIOS] = useState<boolean>(false)
  const [isIPad, setIsIPad] = useState<boolean>(false)
  const [isAndroid, setIsAndroid] = useState<boolean>(false)
  const [isSafari, setIsSafari] = useState<boolean>(false)
  const [isIOSNonSafari, setIsIOSNonSafari] = useState<boolean>(false)
  const [isStandalone, setIsStandalone] = useState<boolean>(false)
  const [isPreparing, setIsPreparing] = useState<boolean>(false)
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false)

  // 1. Detect Standalone mode (already installed & running as PWA)
  const checkStandalone = useCallback(() => {
    if (typeof window === 'undefined') return false

    const isStandaloneDisplay = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = window.navigator.standalone === true
    const isAndroidAppReferrer = typeof document !== 'undefined' && document.referrer.includes('android-app://')

    const standaloneActive = isStandaloneDisplay || isIOSStandalone || isAndroidAppReferrer

    setIsStandalone(standaloneActive)
    if (standaloneActive) {
      setIsInstalled(true)
    }
    return standaloneActive
  }, [])

  useEffect(() => {
    checkStandalone()

    if (typeof window === 'undefined') return

    // 2. Detect Device Platform and Browser specifics
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIPadDevice = /ipad/.test(userAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || isIPadDevice
    const isAndroidDevice = /android/.test(userAgent)

    // Safari detection (excluding Chrome iOS 'crios', Firefox iOS 'fxios', Edge iOS 'edgios', Opera iOS 'opios', and webviews)
    const isSafariBrowser = /safari/.test(userAgent) && !/crios|crmo|fxios|edgios|edg|opr|opios|ucbrowser/.test(userAgent)
    const isIOSNonSafariBrowser = isIOSDevice && !isSafariBrowser

    setIsIOS(isIOSDevice)
    setIsIPad(isIPadDevice)
    setIsAndroid(isAndroidDevice)
    setIsSafari(isSafariBrowser)
    setIsIOSNonSafari(isIOSNonSafariBrowser)

    // 3. Synchronize with global prompt if available
    const promptAvailable = globalDeferredPrompt || window.__DEHADAK_DEFERRED_PROMPT__ || null
    if (promptAvailable) {
      setDeferredPrompt(promptAvailable)
      setIsInstallable(true)
    }

    // 4. Event Listeners
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      globalDeferredPrompt = e
      window.__DEHADAK_DEFERRED_PROMPT__ = e
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handlePromptCustomEvent = () => {
      if (globalDeferredPrompt) {
        setDeferredPrompt(globalDeferredPrompt)
        setIsInstallable(true)
      }
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      globalDeferredPrompt = null
      window.__DEHADAK_DEFERRED_PROMPT__ = null
      setShowInstructionsModal(false)
      toast.success('Dehadak has been added to your device.')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('dehadak:pwa-prompt-available', handlePromptCustomEvent)
    window.addEventListener('dehadak:pwa-installed', handleAppInstalled)

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true)
        setIsStandalone(true)
      }
    }
    mediaQuery.addEventListener('change', handleDisplayModeChange)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('dehadak:pwa-prompt-available', handlePromptCustomEvent)
      window.removeEventListener('dehadak:pwa-installed', handleAppInstalled)
      mediaQuery.removeEventListener('change', handleDisplayModeChange)
    }
  }, [checkStandalone])

  const installApp = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual-instructions' | 'already-installed' | 'unavailable'> => {
    // 1. If already installed or running standalone
    if (isInstalled || isStandalone) {
      return 'already-installed'
    }

    setIsPreparing(true)

    try {
      const activePrompt = deferredPrompt || globalDeferredPrompt || window.__DEHADAK_DEFERRED_PROMPT__

      // 2. If native beforeinstallprompt is available -> trigger native prompt
      if (activePrompt) {
        try {
          await activePrompt.prompt()
          const choiceResult = await activePrompt.userChoice

          if (choiceResult.outcome === 'accepted') {
            setIsInstalled(true)
            setIsInstallable(false)
            setDeferredPrompt(null)
            globalDeferredPrompt = null
            window.__DEHADAK_DEFERRED_PROMPT__ = null
            toast.success('Dehadak has been added to your device.')
          } else {
            toast.info('Installation was cancelled. You can install Dehadak later.')
          }

          return choiceResult.outcome
        } catch (err) {
          console.warn('[PWA] Error launching native install prompt:', err)
          setShowInstructionsModal(true)
          return 'manual-instructions'
        }
      }

      // 3. If iOS / iPadOS -> open Apple installation instructions modal
      if (isIOS) {
        setShowInstructionsModal(true)
        return 'manual-instructions'
      }

      // 4. Android or Desktop when native prompt has not fired or is unsupported
      setShowInstructionsModal(true)
      return 'manual-instructions'
    } finally {
      setIsPreparing(false)
    }
  }, [deferredPrompt, isInstalled, isStandalone, isIOS])

  return {
    isInstallable,
    isInstalled,
    isIOS,
    isIPad,
    isAndroid,
    isSafari,
    isIOSNonSafari,
    isStandalone,
    isPreparing,
    showInstructionsModal,
    setShowInstructionsModal,
    installApp,
    deferredPrompt,
  }
}
