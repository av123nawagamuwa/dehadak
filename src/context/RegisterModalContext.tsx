import React, { createContext, useContext, useState, useEffect } from 'react'

interface RegisterModalContextType {
  isOpen: boolean
  selectedPackage: string // 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  openRegisterModal: (packageCode?: any) => void
  closeRegisterModal: () => void
  setSelectedPackage: (code: string) => void
}

const RegisterModalContext = createContext<RegisterModalContextType | undefined>(undefined)

export function RegisterModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string>('FREE')

  const openRegisterModal = (packageCode?: any) => {
    if (typeof packageCode === 'string') {
      const code = packageCode.toUpperCase()
      if (code.includes('PLATINUM')) setSelectedPackage('PLATINUM')
      else if (code.includes('GOLD')) setSelectedPackage('GOLD')
      else if (code.includes('SILVER')) setSelectedPackage('SILVER')
      else setSelectedPackage('FREE')
    } else {
      setSelectedPackage('FREE')
    }
    setIsOpen(true)
  }

  const closeRegisterModal = () => {
    setIsOpen(false)
    setSelectedPackage('FREE')
  }

  useEffect(() => {
    const handleOpenEvent = (e: any) => {
      openRegisterModal(e.detail?.packageCode)
    }
    const handleCloseEvent = () => closeRegisterModal()

    window.addEventListener('open-register-modal', handleOpenEvent)
    window.addEventListener('close-register-modal', handleCloseEvent)

    return () => {
      window.removeEventListener('open-register-modal', handleOpenEvent)
      window.removeEventListener('close-register-modal', handleCloseEvent)
    }
  }, [])

  return (
    <RegisterModalContext.Provider
      value={{ isOpen, selectedPackage, openRegisterModal, closeRegisterModal, setSelectedPackage }}
    >
      {children}
    </RegisterModalContext.Provider>
  )
}

export function useRegisterModal() {
  const context = useContext(RegisterModalContext)
  if (!context) {
    return {
      isOpen: false,
      selectedPackage: 'FREE',
      openRegisterModal: (packageCode?: any) => {
        const code = typeof packageCode === 'string' ? packageCode : undefined
        window.dispatchEvent(new CustomEvent('open-register-modal', { detail: { packageCode: code } }))
      },
      closeRegisterModal: () => {
        window.dispatchEvent(new CustomEvent('close-register-modal'))
      },
      setSelectedPackage: () => {},
    }
  }
  return context
}
