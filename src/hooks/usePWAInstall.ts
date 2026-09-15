import { useState, useEffect, useCallback } from 'react'

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

// Module-level global store for beforeinstallprompt
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
    console.log('beforeinstallprompt fired')
    window.dispatchEvent(new CustomEvent('dehadak:pwa-prompt-available'))
  })

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null
    window.__DEHADAK_DEFERRED_PROMPT__ = null
    console.log('Dehadak Installed successfully!')
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
  const [isAndroid, setIsAndroid] = useState<boolean>(false)
  const [isStandalone, setIsStandalone] = useState<boolean>(false)
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false)

  useEffect(() => {
    // 1. Detect Standalone mode (already installed & running as PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://')

      setIsStandalone(isStandaloneMode)
      if (isStandaloneMode) {
        setIsInstalled(true)
      }
      return isStandaloneMode
    }

    const currentStandalone = checkStandalone()

    // 2. Detect Device Platform
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
    const isAndroidDevice = /android/.test(userAgent)

    setIsIOS(isIOSDevice)
    setIsAndroid(isAndroidDevice)

    // 3. Synchronize with global prompt if available
    const promptAvailable = globalDeferredPrompt || window.__DEHADAK_DEFERRED_PROMPT__ || null
    if (promptAvailable) {
      setDeferredPrompt(promptAvailable)
      setIsInstallable(true)
    }

    // 4. Debug Console Logs (as requested)
    console.log('Native PWA install available:', !!promptAvailable)
    console.log('Installed:', currentStandalone)
    console.log('Standalone:', currentStandalone)
    console.log('iOS:', isIOSDevice)
    console.log('Android:', isAndroidDevice)

    // 5. Event Listeners
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      globalDeferredPrompt = e
      window.__DEHADAK_DEFERRED_PROMPT__ = e
      setDeferredPrompt(e)
      setIsInstallable(true)
      console.log('beforeinstallprompt fired')
      console.log('Native PWA install available:', true)
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
      console.log('Installed: true')
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
        console.log('Standalone: true')
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
  }, [])

  const installApp = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual-instructions' | 'already-installed'> => {
    const activePrompt = deferredPrompt || globalDeferredPrompt || window.__DEHADAK_DEFERRED_PROMPT__

    // 1. If already installed or running standalone
    if (isInstalled || isStandalone) {
      console.log('App is already installed.')
      return 'already-installed'
    }

    // 2. If native beforeinstallprompt is available -> trigger native prompt
    if (activePrompt) {
      try {
        console.log('Triggering native browser PWA install prompt...')
        await activePrompt.prompt()
        const choiceResult = await activePrompt.userChoice
        console.log('User response to install prompt:', choiceResult.outcome)

        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true)
          setIsInstallable(false)
          setDeferredPrompt(null)
          globalDeferredPrompt = null
          window.__DEHADAK_DEFERRED_PROMPT__ = null
        }
        return choiceResult.outcome
      } catch (err) {
        console.warn('[PWA] Error launching native install prompt:', err)
        setShowInstructionsModal(true)
        return 'manual-instructions'
      }
    }

    // 3. If iOS / iPadOS Safari -> open iOS installation instructions modal
    if (isIOS) {
      console.log('Opening iOS manual installation guide modal.')
      setShowInstructionsModal(true)
      return 'manual-instructions'
    }

    // 4. Fallback (Android/Desktop when native prompt not ready) -> open instructions modal
    console.log('Native prompt not available. Opening fallback installation modal.')
    setShowInstructionsModal(true)
    return 'manual-instructions'
  }, [deferredPrompt, isInstalled, isStandalone, isIOS])

  return {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isStandalone,
    showInstructionsModal,
    setShowInstructionsModal,
    installApp,
    deferredPrompt,
  }
}
