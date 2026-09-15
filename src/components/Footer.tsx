import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('dehadak_language', lang)
  }

  return (
    <footer className="hidden md:block bg-[#1A1210] border-t border-[#D4A72C]/20 text-[#FAF7F0] relative overflow-hidden">
      
      {/* Subtle Top Golden Glow Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#D4A72C] to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & About (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E5A93C]/60 shadow-gold group-hover:scale-105 group-hover:border-[#F7D878] transition-all bg-[#1C1412] flex items-center justify-center p-0.5">
                <img
                  src="/logo.png"
                  alt="Dehadak Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-white tracking-wide group-hover:text-[#F7D878] transition-colors leading-tight">
                  Dehadak
                </span>
                <span className="text-[10px] tracking-widest uppercase font-medium text-[#F7D878]/90 font-sans">
                  {t('nav.brandTagline')}
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#FAF7F0]/70 max-w-sm leading-relaxed font-sans">
              {t('footer.description')}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-black/40 border border-[#D4A72C]/25 flex items-center justify-center text-[#FAF7F0]/70 hover:text-[#F3D77A] hover:border-[#D4A72C] transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-black/40 border border-[#D4A72C]/25 flex items-center justify-center text-[#FAF7F0]/70 hover:text-[#F3D77A] hover:border-[#D4A72C] transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/94761234567"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-black/40 border border-[#D4A72C]/25 flex items-center justify-center text-[#FAF7F0]/70 hover:text-[#10B981] hover:border-[#10B981] transition-all"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F3D77A]">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/" className="text-[#FAF7F0]/70 hover:text-[#F3D77A] transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-[#FAF7F0]/70 hover:text-[#F3D77A] transition-colors">
                  {t('nav.search')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-[#FAF7F0]/70 hover:text-[#F3D77A] transition-colors">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-[#FAF7F0]/70 hover:text-[#F3D77A] transition-colors">
                  {t('nav.successStories')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[#FAF7F0]/70 hover:text-[#F3D77A] transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-[#F3D77A] hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                  Dehadak App (PWA)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F3D77A]">
              {t('footer.support')}
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#" className="text-[#FAF7F0]/70 hover:text-[#F3D77A] transition-colors">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#FAF7F0]/70 hover:text-[#F3D77A] transition-colors">
                  {t('footer.termsOfService')}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#FAF7F0]/70 hover:text-[#F3D77A] transition-colors">
                  {t('footer.safetyGuidelines')}
                </a>
              </li>
              <li>
                <Link to="/pricing#faq" className="text-[#FAF7F0]/70 hover:text-[#F3D77A] transition-colors">
                  {t('nav.helpCenter')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F3D77A]">
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-3 text-sm text-[#FAF7F0]/75">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D4A72C] mt-0.5 shrink-0" />
                <span>+94 76 123 4567 / +94 11 234 5678</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D4A72C] mt-0.5 shrink-0" />
                <span>support@dehadak.lk</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4A72C] mt-0.5 shrink-0" />
                <span>World Trade Center, Colombo 01, Sri Lanka</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Language Switch */}
        <div className="py-8 border-t border-[#D4A72C]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#FAF7F0]/60 text-center sm:text-left">
            {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#FAF7F0]/50 mr-1">Language:</span>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                i18n.language === 'en'
                  ? 'bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] shadow-sm'
                  : 'bg-black/30 text-[#FAF7F0]/70 hover:text-white border border-[#D4A72C]/20'
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('si')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                i18n.language === 'si'
                  ? 'bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] shadow-sm'
                  : 'bg-black/30 text-[#FAF7F0]/70 hover:text-white border border-[#D4A72C]/20'
              }`}
            >
              සිංහල
            </button>
          </div>
        </div>

      </div>
    </footer>
  )
}
