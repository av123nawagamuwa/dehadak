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
      name: 'Free Explorer',
      tagline: 'Essential Access',
      packLabel: 'Lifetime Access',
      monthlyPrice: 'Free',
      totalCost: 'Free',
      period: 'Lifetime Access',
      durationMonths: 0,
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
      name: 'Gold VIP',
      tagline: 'Most Popular for Serious Seekers',
      packLabel: '4 Months VIP',
      monthlyPrice: 'Rs. 600',
      totalCost: 'Rs. 2,400',
      period: '4 Months Access',
      durationMonths: 4,
      description: 'The premier choice for serious marriage seekers and families across Sri Lanka.',
      features: [
        'Send up to 50 interest requests',
        'Accept up to 50 received interests',
        'Message up to 50 connections (unlimited chat)',
        'Full 8-point astrological & lifestyle match %',
        'Gold VIP luxury gold profile badge',
        'Priority placement in Search Results',
      ],
      popular: true,
      cta: 'Upgrade to Gold VIP',
      ctaLink: '/pricing',
      badge: 'Most Popular',
    },
    {
      name: 'Royal Platinum',
      tagline: 'Elite Distinction & Direct Contact',
      packLabel: '6 Months Elite',
      monthlyPrice: 'Rs. 800',
      totalCost: 'Rs. 4,800',
      period: '6 Months Access',
      durationMonths: 6,
      description: 'Personalized matrimonial service with direct verified phone numbers and top search rank.',
      features: [
        'Top of the page search priority (Ranked #1 on Search page)',
        'Direct verified contact phone number reveal',
        'Send & accept up to 150 interest requests',
        'Message up to 150 connections (unlimited chat)',
        'Full 8-point astrological & lifestyle match %',
        'Royal Platinum regal badge & priority styling',
      ],
      popular: false,
      cta: 'Join Royal Platinum',
      ctaLink: '/pricing',
      badge: 'Elite Distinction',
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

                {/* Poruwa-style Monthly Price & Total Cost */}
                <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-[#D4A72C]/30 text-white">
                  <div className="mb-1">
                    <span className="text-[11px] font-semibold text-[#F3D77A] tracking-wide">
                      {plan.packLabel}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-shimmer">
                      {plan.monthlyPrice}
                    </span>
                    {plan.durationMonths > 0 && (
                      <span className="text-xs text-[#FAF7F0]/70 font-semibold">
                        /month
                      </span>
                    )}
                  </div>
                  <div className="pt-2.5 border-t border-white/10 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#FAF7F0]/70">Total cost</span>
                      <span className="font-bold text-[#F3D77A]">{plan.totalCost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FAF7F0]/70">Duration</span>
                      <span className="font-semibold text-white">{plan.period}</span>
                    </div>
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
                {plan.name === 'Free Explorer' ? (
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
