import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Heart, Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('dehadak_language', lang)
  }

  return (
    <footer className="bg-dark-bg border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-gold" fill="currentColor" />
              <span className="text-xl font-semibold text-white">Dehadak</span>
            </div>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/50 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/50 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/50 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {[
                { label: t('nav.home'), path: '/' },
                { label: t('footer.searchProfiles'), path: '/search' },
                { label: t('footer.pricingPlans'), path: '/pricing' },
                { label: t('footer.createProfile'), path: '/profile-creation' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/50 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('footer.support')}
            </h3>
            <ul className="space-y-3">
              {[
                t('nav.helpCenter'),
                t('footer.privacyPolicy'),
                t('footer.termsOfService'),
                t('footer.safetyGuidelines'),
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/50 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-sm text-white/50">+94 76 123 4567</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-sm text-white/50">
                  hello@dehadak.lk
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-sm text-white/50">
                  Colombo, Sri Lanka
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i18n.language === 'en'
                  ? 'bg-gold text-dark-bg'
                  : 'bg-dark-surface text-white/50 border border-dark-border'
              }`}
            >
              {t('common.english')}
            </button>
            <button
              onClick={() => changeLanguage('si')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i18n.language === 'si'
                  ? 'bg-gold text-dark-bg'
                  : 'bg-dark-surface text-white/50 border border-dark-border'
              }`}
            >
              {t('common.sinhala')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
