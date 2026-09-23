import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  CreditCard,
  MessageCircle,
  Crown,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  Bell,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRegisterModal } from '@/context/RegisterModalContext'
import { API_BASE_URL } from '@/config'
import InstallAppButton from '@/components/InstallAppButton'
import NotificationDropdown from '@/components/NotificationDropdown'
import { detachPushOnLogout } from '@/utils/pushManager'

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [totalUnread, setTotalUnread] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadInterests, setUnreadInterests] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [userName, setUserName] = useState('Member')
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [isUserPremium, setIsUserPremium] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { openRegisterModal } = useRegisterModal()

  const hasHeroHeader = ['/', '/how-it-works', '/success-stories', '/pricing'].includes(location.pathname)
  const isTransparent = transparent && hasHeroHeader && !scrolled

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('dehadak_language', lang)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchNotificationSummary = () => {
    const auth = localStorage.getItem('dehadak_auth')
    setIsAuthenticated(!!auth)

    if (auth) {
      const storedUser = localStorage.getItem('dehadak_user')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          if (parsed.first_name) {
            setUserName(`${parsed.first_name} ${parsed.last_name || ''}`.trim())
          } else if (parsed.name) {
            setUserName(parsed.name)
          } else if (parsed.email) {
            setUserName(parsed.email.split('@')[0])
          }
          setIsUserVerified(parsed.verification_status === 'VERIFIED' || parsed.is_verified === true)
          setIsUserPremium((parsed.plan || '').toLowerCase() === 'premium' || (parsed.plan || '').toLowerCase() === 'vip')
        } catch (e) {}
      }

      fetch(`${API_BASE_URL}/api/messages/notifications/summary`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setUnreadMessages(data.unreadMessages || 0)
            setUnreadInterests(data.pendingInterests || 0)
            setUnreadNotifications(data.unreadNotifications || 0)
            setTotalUnread(data.totalUnread || 0)
          }
        })
        .catch(() => {})
    } else {
      setTotalUnread(0)
      setUnreadMessages(0)
      setUnreadInterests(0)
      setUnreadNotifications(0)
    }
  }

  useEffect(() => {
    fetchNotificationSummary()
    setMobileMenuOpen(false)
    const interval = setInterval(fetchNotificationSummary, 10000)
    return () => clearInterval(interval)
  }, [location])

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/search', label: t('nav.search') },
    { path: '/how-it-works', label: t('nav.howItWorks') },
    { path: '/success-stories', label: t('nav.successStories') },
    { path: '/pricing', label: t('nav.pricing') },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent py-4'
          : 'bg-[#241A17]/90 backdrop-blur-xl border-b border-[#D4A72C]/20 shadow-luxury py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#E5A93C]/60 shadow-gold group-hover:scale-105 group-hover:border-[#F7D878] transition-all duration-300 bg-[#1C1412] flex items-center justify-center p-0.5">
              <img
                src="/logo.png"
                alt="Dehadak Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wide text-white group-hover:text-[#F7D878] transition-colors leading-tight">
                Dehadak
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-[#F7D878]/90 font-sans">
                {t('nav.brandTagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#D4A72C]/20">
            {navLinks.map((link) => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'text-[#F3D77A] bg-[#D4A72C]/15 font-semibold'
                      : 'text-[#FAF7F0]/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="activeNavGoldDot"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4A72C] shadow-[0_0_8px_#D4A72C]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions: Language, Primary CTA, Login/User */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Install App Quick CTA */}
            <InstallAppButton variant="navbar" className="hidden lg:inline-flex" />

            {/* Language Switch */}
            <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full p-1 border border-[#D4A72C]/25 text-xs">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded-full font-semibold transition-all duration-200 ${
                  i18n.language === 'en'
                    ? 'bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] shadow-sm'
                    : 'text-[#FAF7F0]/70 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('si')}
                className={`px-3 py-1 rounded-full font-semibold transition-all duration-200 ${
                  i18n.language === 'si'
                    ? 'bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] shadow-sm'
                    : 'text-[#FAF7F0]/70 hover:text-white'
                }`}
              >
                සිංහල
              </button>
            </div>

            {isAuthenticated && (
              <NotificationDropdown
                unreadCount={unreadNotifications}
                onRefreshSummary={fetchNotificationSummary}
              />
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-black/30 border border-[#D4A72C]/30 hover:border-[#D4A72C] transition-colors text-white">
                    <div className="w-7 h-7 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#F3D77A]" />
                    </div>
                    {totalUnread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                        {totalUnread}
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-[#F3D77A]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-[#241A17]/95 backdrop-blur-xl border border-[#D4A72C]/30 shadow-luxury text-[#FAF7F0]"
                >
                  <div className="px-3 py-2 border-b border-[#D4A72C]/20">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white truncate">{userName}</p>
                      {isUserVerified && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                    {isUserPremium ? (
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D4A72C]/20 text-[#F3D77A] border border-[#D4A72C]/30">
                        <Crown className="w-3 h-3 mr-1 text-[#F3D77A]" />
                        {isUserVerified ? 'Verified Premium' : 'Premium Member'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-[#FAF7F0]/80 border border-white/15">
                        {isUserVerified ? 'Verified Member' : 'Member'}
                      </span>
                    )}
                  </div>
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="text-[#FAF7F0]/90 hover:text-[#F3D77A] hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2"
                  >
                    <User className="w-4 h-4 mr-2 text-[#D4A72C]" />
                    {t('nav.viewMyProfile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/messages')}
                    className="text-[#FAF7F0]/90 hover:text-[#F3D77A] hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-[#D4A72C]" />
                      <span>{t('nav.connections')}</span>
                    </div>
                    {totalUnread > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse shadow-sm">
                        {unreadMessages > 0 && unreadInterests > 0
                          ? `${unreadMessages} msg, ${unreadInterests} req`
                          : `${totalUnread} new`}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/pricing')}
                    className="text-[#FAF7F0]/90 hover:text-[#F3D77A] hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2"
                  >
                    <CreditCard className="w-4 h-4 mr-2 text-[#D4A72C]" />
                    {t('nav.billing')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/matching-preferences')}
                    className="text-[#FAF7F0]/90 hover:text-[#F3D77A] hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2 text-[#D4A72C]" />
                    Matching Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#D4A72C]/20" />
                  <DropdownMenuItem
                    onClick={() => {
                      detachPushOnLogout().catch(() => {})
                      localStorage.removeItem('dehadak_auth')
                      window.dispatchEvent(new Event('dehadak:logout'))
                      setIsAuthenticated(false)
                      navigate('/')
                    }}
                    className="text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 focus:bg-rose-500/10 cursor-pointer py-2"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-rose-400" />
                    {t('nav.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#FAF7F0] hover:text-[#F3D77A] transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <button
                  onClick={openRegisterModal}
                  className="btn-gold px-5 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-gold hover:shadow-gold-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('nav.createProfile')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-black/30 border border-[#D4A72C]/30 text-[#FAF7F0] hover:text-[#F3D77A]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#241A17]/95 backdrop-blur-2xl border-b border-[#D4A72C]/30 px-5 pt-3 pb-6 shadow-2xl"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#D4A72C]/20 text-[#F3D77A] font-semibold border border-[#D4A72C]/30'
                      : 'text-[#FAF7F0] hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-[#D4A72C]/20 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FAF7F0]/60">
                  {t('nav.language')}
                </span>
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-[#D4A72C]/20">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      i18n.language === 'en'
                        ? 'bg-[#D4A72C] text-[#241A17]'
                        : 'text-[#FAF7F0]/70'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('si')}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      i18n.language === 'si'
                        ? 'bg-[#D4A72C] text-[#241A17]'
                        : 'text-[#FAF7F0]/70'
                    }`}
                  >
                    සිංහල
                  </button>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2.5">
                <InstallAppButton variant="card" className="py-3 text-sm" />

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl border border-[#D4A72C]/40 text-[#F3D77A] font-semibold text-center hover:bg-[#D4A72C]/10 flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4 text-[#D4A72C]" />
                      <span>Notifications</span>
                      {unreadNotifications > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                          {unreadNotifications}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/matching-preferences"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl border border-[#D4A72C]/40 text-[#F3D77A] font-semibold text-center hover:bg-[#D4A72C]/10 flex items-center justify-center gap-2"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#D4A72C]" />
                      Matching Preferences
                    </Link>
                    <button
                      onClick={() => {
                        detachPushOnLogout().catch(() => {})
                        localStorage.removeItem('dehadak_auth')
                        window.dispatchEvent(new Event('dehadak:logout'))
                        setIsAuthenticated(false)
                        setMobileMenuOpen(false)
                        navigate('/')
                      }}
                      className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-300 font-semibold text-center hover:bg-rose-500/10"
                    >
                      {t('nav.signOut')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        openRegisterModal()
                      }}
                      className="btn-gold w-full py-3 rounded-xl text-center font-bold text-base"
                    >
                      {t('nav.createProfile')}
                    </button>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl border border-[#D4A72C] text-[#F3D77A] text-center font-semibold hover:bg-[#D4A72C]/10"
                    >
                      {t('nav.login')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
