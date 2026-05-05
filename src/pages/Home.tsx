import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import {
  Shield,
  BadgeCheck,
  Heart,
  Search,
  MessageCircle,
  UserPlus,
  Star,
  ChevronDown,
} from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import PricingCard from '@/components/PricingCard'

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const { t } = useTranslation()

  useEffect(() => {
    // Auto-authenticate for demo
    localStorage.setItem('dehadak_auth', 'demo-token')
  }, [])

  const featuredProfiles = [
    {
      name: 'Rukmal S.',
      age: 31,
      location: 'Digana, Sri Lanka',
      religion: 'Buddhist',
      ethnicity: 'Sinhalese',
      height: "5' 10\"",
      profession: 'Engineer',
      image: '/profile-male-1.jpg',
      verified: true,
      premium: false,
    },
    {
      name: 'Dilini P.',
      age: 28,
      location: 'Kandy, Sri Lanka',
      religion: 'Buddhist',
      ethnicity: 'Sinhalese',
      height: "5' 4\"",
      profession: 'Teacher',
      image: '/profile-female-1.jpg',
      verified: true,
      premium: true,
    },
    {
      name: 'Kasun M.',
      age: 33,
      location: 'Colombo, Sri Lanka',
      religion: 'Buddhist',
      ethnicity: 'Sinhalese',
      height: "5' 11\"",
      profession: 'Manager',
      image: '/profile-male-2.jpg',
      verified: true,
      premium: false,
    },
    {
      name: 'Nadeesha W.',
      age: 26,
      location: 'Galle, Sri Lanka',
      religion: 'Buddhist',
      ethnicity: 'Sinhalese',
      height: "5' 3\"",
      profession: 'Doctor',
      image: '/profile-female-2.jpg',
      verified: true,
      premium: true,
    },
  ]

  const trustCards = [
    {
      icon: Shield,
      title: t('home.trust.privacyFirstTitle'),
      description: t('home.trust.privacyFirstDesc'),
    },
    {
      icon: BadgeCheck,
      title: t('home.trust.verifiedAccountsTitle'),
      description: t('home.trust.verifiedAccountsDesc'),
    },
    {
      icon: Heart,
      title: t('home.trust.genuineConnectionsTitle'),
      description: t('home.trust.genuineConnectionsDesc'),
    },
  ]

  const steps = [
    {
      icon: UserPlus,
      title: t('home.steps.createProfileTitle'),
      description: t('home.steps.createProfileDesc'),
    },
    {
      icon: Search,
      title: t('home.steps.discoverMatchesTitle'),
      description: t('home.steps.discoverMatchesDesc'),
    },
    {
      icon: Heart,
      title: t('home.steps.showInterestTitle'),
      description: t('home.steps.showInterestDesc'),
    },
    {
      icon: MessageCircle,
      title: t('home.steps.connectTitle'),
      description: t('home.steps.connectDesc'),
    },
  ]

  const testimonials = [
    {
      quote:
        "Dehadak made finding my life partner so dignified. The privacy controls gave my family peace of mind.",
      names: 'Amali & Sajith',
      location: 'Married in 2024',
      stars: 5,
    },
    {
      quote:
        "After trying many platforms, Dehadak was the only one that felt truly Sri Lankan and respectful.",
      names: 'Ruwani & Chaminda',
      location: 'Married in 2024',
      stars: 5,
    },
    {
      quote:
        "The verification process and privacy features made our family feel completely safe.",
      names: 'Tharushi & Praveen',
      location: 'Married in 2023',
      stars: 5,
    },
  ]

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'LKR 1,500',
      duration: '2 Months',
      total: 'LKR 3,000 total',
      features: [
        'Create full profile',
        'Browse all profiles',
        'Send 5 interests/month',
        'Basic search filters',
        'Email support',
      ],
    },
    {
      name: 'Standard',
      price: 'LKR 1,667',
      duration: '3 Months',
      total: 'LKR 5,000 total',
      features: [
        'Everything in Basic',
        'Unlimited interests',
        'View contact details',
        'Priority listing',
        'Email support',
      ],
      featured: true,
    },
    {
      name: 'Premium',
      price: 'LKR 2,667',
      duration: '3 Months',
      total: 'LKR 8,000 total',
      features: [
        'Everything in Standard',
        'Horoscope matching',
        'Profile highlighting',
        'Personal match suggestions',
        'Phone support',
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-dark-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/50 via-transparent to-dark-bg/50" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20">
          <FadeUp>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              {t('home.heroTitlePrefix')}{' '}
              <span className="text-gradient-gold">{t('home.heroTitleHighlight')}</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('home.heroSubtitle')}
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/profile-creation"
                className="px-8 py-4 rounded-full bg-gold text-dark-bg font-semibold text-base hover:bg-gold-light transition-colors shadow-gold hover:shadow-gold-lg w-full sm:w-auto"
              >
                {t('home.createYourProfile')}
              </Link>
              <Link
                to="/search"
                className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                {t('home.searchProfiles')}
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-gold" /> {t('home.verifiedProfiles')}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-gold" /> {t('home.privacyProtected')}
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-gold" /> {t('home.successStories')}
              </span>
            </div>
          </FadeUp>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-white/40" />
          </motion.div>
        </div>
      </section>

      {/* Trust / Privacy Section */}
      <section className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                {t('home.privacyPromiseTitle')}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t('home.privacyPromiseSubtitle')}
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustCards.map((card, index) => (
              <FadeUp key={card.title} delay={index * 0.1}>
                <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow text-center">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                    <card.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                {t('home.steps.title')}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t('home.steps.subtitle')}
              </p>
            </div>
          </FadeUp>

          <div className="relative">
            {/* Connecting Line - Desktop */}
            <div className="hidden lg:block absolute top-[60px] left-[12.5%] right-[12.5%] h-0.5 bg-light-border">
              <div className="absolute inset-0 bg-gold/30" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <FadeUp key={step.title} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="relative z-10 w-16 h-16 rounded-full bg-gold flex items-center justify-center mx-auto mb-5 shadow-gold">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-light-bg border border-light-border text-sm font-bold text-gold mb-3">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-semibold text-foreground mb-2">
                  {t('home.recentlyJoined')}
                </h2>
                <p className="text-muted-foreground">
                  {t('home.recentlyJoinedSubtitle')}
                </p>
              </div>
              <Link
                to="/search"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-dark transition-colors"
              >
                {t('home.viewAll')}
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Link>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProfiles.map((profile, index) => (
              <FadeUp key={profile.name} delay={index * 0.1}>
                <ProfileCard {...profile} />
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4}>
            <div className="mt-10 text-center sm:hidden">
              <Link
                to="/search"
                className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-dark transition-colors"
              >
                {t('home.viewAllProfiles')}
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                {t('home.storiesTitle')}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t('home.storiesSubtitle')}
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <FadeUp key={t.names} delay={index * 0.1}>
                <div className="bg-light-bg rounded-xl p-6 border-l-4 border-gold">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-foreground italic mb-4 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-sm">{t.names}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 gradient-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-semibold text-white mb-4">
                {t('home.choosePlanTitle')}
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                {t('home.choosePlanSubtitle')}
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <FadeUp key={plan.name} delay={index * 0.1}>
                <PricingCard {...plan} />
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4}>
            <div className="text-center mt-10">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-light transition-colors"
              >
                {t('home.viewFullPricing')}
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 gradient-hero">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('home.ctaTitle')}
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              {t('home.ctaSubtitle')}
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Link
              to="/profile-creation"
              className="inline-block px-10 py-4 rounded-full bg-dark-bg text-white font-semibold text-base hover:bg-dark-surface transition-colors shadow-xl"
            >
              {t('home.ctaButton')}
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
