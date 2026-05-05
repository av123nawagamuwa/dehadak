import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CreditCard,
  HelpCircle,
  FileText,
  MessageCircle,
  Crown,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const isHomePage = location.pathname === '/'
  const shouldBeTransparent = transparent && isHomePage && !scrolled

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('dehadak_language', lang)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const auth = localStorage.getItem('dehadak_auth')
    setIsAuthenticated(!!auth)
  }, [location])

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/search', label: t('nav.search') },
    { path: '/pricing', label: t('nav.pricing') },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldBeTransparent
          ? 'bg-transparent'
          : 'bg-dark-bg/95 backdrop-blur-md border-b border-dark-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <Heart
                className={`w-7 h-7 transition-colors duration-300 ${
                  shouldBeTransparent ? 'text-gold' : 'text-gold'
                } group-hover:scale-110 transition-transform`}
                fill="currentColor"
                strokeWidth={0}
              />
              <Heart
                className="absolute w-4 h-4 text-gold-light -bottom-0.5 -right-0.5"
                fill="currentColor"
                strokeWidth={0}
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-xl font-semibold tracking-tight transition-colors ${
                  shouldBeTransparent ? 'text-white' : 'text-white'
                }`}
              >
                Dehadak
              </span>
              <span className="text-[10px] -mt-1 text-gold/80 tracking-wide">
                {t('nav.brandTagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-gold bg-gold/10'
                    : shouldBeTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle - Desktop */}
            <div className="hidden md:flex items-center bg-dark-surface rounded-full p-0.5 border border-dark-border">
              <button 
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  i18n.language === 'en'
                    ? 'bg-gold text-dark-bg'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {t('common.english')}
              </button>
              <button 
                onClick={() => changeLanguage('si')}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  i18n.language === 'si'
                    ? 'bg-gold text-dark-bg'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {t('common.sinhala')}
              </button>
            </div>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-dark-surface border border-dark-border hover:border-gold/50 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-gold" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-dark-surface border-dark-border"
                >
                  <div className="px-3 py-2 border-b border-dark-border">
                    <p className="text-sm font-medium text-white">Avishka N.</p>
                    <p className="text-xs text-white/50">Ad ID: DH-1165397708</p>
                    <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gold/20 text-gold">
                      <Crown className="w-3 h-3 mr-1" />
                      {t('profileCard.premium')}
                    </span>
                  </div>
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t('nav.viewMyProfile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/messages')}
                    className="text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('nav.connections')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/pricing')}
                    className="text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('nav.billing')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t('nav.accountSettings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-dark-border" />
                  <DropdownMenuItem
                    onClick={() => navigate('/profile-creation')}
                    className="text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t('nav.editAd')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/help')}
                    className="text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {t('nav.helpCenter')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-dark-border" />
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem('dehadak_auth')
                      setIsAuthenticated(false)
                      navigate('/')
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/search"
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </Link>
                <Link
                  to="/profile-creation"
                  className="px-5 py-2 rounded-full bg-gold text-dark-bg font-semibold text-sm hover:bg-gold-light transition-colors"
                >
                  {t('nav.createProfile')}
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-dark-bg border-dark-border p-0"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-dark-border">
                    <div className="flex items-center gap-2">
                      <Heart className="w-6 h-6 text-gold" fill="currentColor" />
                      <span className="text-lg font-semibold text-white">
                        Dehadak
                      </span>
                    </div>
                    <SheetClose asChild>
                      <button className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </SheetClose>
                  </div>

                  <nav className="flex-1 p-4">
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.path}>
                          <Link
                            to={link.path}
                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                              isActive(link.path)
                                ? 'text-gold bg-gold/10'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                      <SheetClose asChild>
                        <Link
                          to="/messages"
                          className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                            isActive('/messages')
                              ? 'text-gold bg-gold/10'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {t('nav.connections')}
                        </Link>
                      </SheetClose>
                    </div>

                    <div className="mt-6 pt-6 border-t border-dark-border">
                      <p className="px-4 text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                        {t('nav.language')}
                      </p>
                      <div className="flex items-center gap-2 px-4">
                        <button 
                          onClick={() => changeLanguage('en')}
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                            i18n.language === 'en'
                              ? 'bg-gold text-dark-bg'
                              : 'bg-dark-surface text-white/60 border border-dark-border hover:text-white'
                          }`}
                        >
                          {t('common.english')}
                        </button>
                        <button 
                          onClick={() => changeLanguage('si')}
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                            i18n.language === 'si'
                              ? 'bg-gold text-dark-bg'
                              : 'bg-dark-surface text-white/60 border border-dark-border hover:text-white'
                          }`}
                        >
                          {t('common.sinhala')}
                        </button>
                      </div>
                    </div>
                  </nav>

                  <div className="p-4 border-t border-dark-border">
                    {isAuthenticated ? (
                      <SheetClose asChild>
                        <button
                          onClick={() => {
                            localStorage.removeItem('dehadak_auth')
                            setIsAuthenticated(false)
                            navigate('/')
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">{t('nav.signOut')}</span>
                        </button>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          to="/profile-creation"
                          className="block w-full text-center px-4 py-3 rounded-xl bg-gold text-dark-bg font-semibold text-sm hover:bg-gold-light transition-colors"
                        >
                          {t('nav.createYourProfile')}
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
