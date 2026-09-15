import React, { createContext, useContext, useState, useEffect } from 'react'

interface RegisterModalContextType {
  isOpen: boolean
  openRegisterModal: () => void
  closeRegisterModal: () => void
}

const RegisterModalContext = createContext<RegisterModalContextType | undefined>(undefined)

export function RegisterModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openRegisterModal = () => setIsOpen(true)
  const closeRegisterModal = () => setIsOpen(false)

  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true)
    const handleCloseEvent = () => setIsOpen(false)

    window.addEventListener('open-register-modal', handleOpenEvent)
    window.addEventListener('close-register-modal', handleCloseEvent)

    return () => {
      window.removeEventListener('open-register-modal', handleOpenEvent)
      window.removeEventListener('close-register-modal', handleCloseEvent)
    }
  }, [])

  return (
    <RegisterModalContext.Provider value={{ isOpen, openRegisterModal, closeRegisterModal }}>
      {children}
    </RegisterModalContext.Provider>
  )
}

export function useRegisterModal() {
  const context = useContext(RegisterModalContext)
  if (!context) {
    // Fallback if used outside provider
    return {
      isOpen: false,
      openRegisterModal: () => window.dispatchEvent(new CustomEvent('open-register-modal')),
      closeRegisterModal: () => window.dispatchEvent(new CustomEvent('close-register-modal')),
    }
  }
  return context
}
