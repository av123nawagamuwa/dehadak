import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Check, Crown, Sparkles, ArrowRight } from 'lucide-react'
import { useRegisterModal } from '@/context/RegisterModalContext'

export default function PricingSection() {
  const { t } = useTranslation()
  const { openRegisterModal } = useRegisterModal()

  const plans = [
    {
      name: 'Free',
      tagline: 'Essential Access',
      price: 'LKR 0',
      period: 'Forever Free',
      description: 'Ideal for creating your profile and exploring verified matches across Sri Lanka.',
      features: [
        'Create a full verified profile',
        'Browse all public profiles',
        'Basic search filters (Age, District)',
        'Receive interest requests',
        'Standard customer support',
      ],
      popular: false,
      cta: 'Get Started Free',
      ctaLink: '/profile-creation',
      badge: 'Free Tier',
    },
    {
      name: 'Premium',
      tagline: 'Most Popular for Serious Seekers',
      price: 'LKR 2,500',
      period: 'per month',
      description: 'Comprehensive features and priority visibility to connect with ideal matches faster.',
      features: [
        'Everything in Free',
        'Unlimited interest requests',
        'View contact details upon mutual approval',
        'Horoscope & astrological matching',
        'Priority search ranking & badge',
        'Advanced multi-criteria filters',
      ],
      popular: true,
      cta: 'Upgrade to Premium',
      ctaLink: '/pricing',
      badge: 'Most Popular',
    },
    {
      name: 'Premium Plus',
      tagline: 'VIP Personalized Experience',
      price: 'LKR 5,000',
      period: 'per month',
      description: 'Exclusive matrimonial support with tailored match recommendations and VIP discretion.',
      features: [
        'Everything in Premium',
        'Dedicated relationship consultant',
        'Custom hand-picked match alerts',
        'Maximum privacy controls & photo blur',
        'Direct phone & WhatsApp support',
        'VIP highlight across Sri Lanka & Overseas',
      ],
      popular: false,
      cta: 'Choose Premium Plus',
      ctaLink: '/pricing',
      badge: 'VIP Elite',
    },
  ]

  return (
    <section className="py-24 bg-[#241A17] relative overflow-hidden text-white border-t border-[#D4A72C]/20 shadow-luxury">
      
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 border border-[#D4A72C]/30 text-xs font-semibold text-[#F3D77A] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>Investment in Your Future</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF7F0] tracking-tight">
            {t('home.pricingSection.heading')}
          </h2>
          <p className="text-sm sm:text-base text-[#FAF7F0]/70 mt-3">
            {t('home.pricingSection.subtitle')}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#2F2320] to-[#1A1210] border-2 border-[#D4A72C] shadow-gold-lg scale-100 lg:-translate-y-2'
                  : 'bg-black/35 border border-[#D4A72C]/20 hover:border-[#D4A72C]/40 backdrop-blur-md'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#F3D77A]/80 font-medium mt-0.5">
                      {plan.tagline}
                    </p>
                  </div>
                  {!plan.popular && (
                    <span className="text-[11px] font-bold text-[#FAF7F0]/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#FAF7F0]/70 mb-6 leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-[#D4A72C]/20">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-4xl font-extrabold text-gold-shimmer">
                      {plan.price}
                    </span>
                    <span className="text-xs text-[#FAF7F0]/60 font-medium">
                      / {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#FAF7F0]/85">
                      <div className="w-4 h-4 rounded-full bg-[#D4A72C]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#F3D77A]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action CTA */}
              <div>
                {plan.name === 'Free' ? (
                  <button
                    onClick={openRegisterModal}
                    className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all bg-white/10 hover:bg-white/15 text-[#FAF7F0] border border-[#D4A72C]/30"
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to={plan.ctaLink}
                    className={`w-full py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? 'btn-gold shadow-gold'
                        : 'bg-white/10 hover:bg-white/15 text-[#FAF7F0] border border-[#D4A72C]/30'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

            </motion.div>
          ))}
        </div>

        {/* View Full Comparison Link */}
        <div className="text-center mt-12">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#F3D77A] hover:underline"
          >
            <span>View Full Plan Comparison & FAQs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
