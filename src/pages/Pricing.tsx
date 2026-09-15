import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crown,
  CheckCircle2,
  XCircle,
  Shield,
  CreditCard,
  Building,
  PhoneCall,
  ChevronDown,
  ArrowRight,
  Check,
} from 'lucide-react'
import { useRegisterModal } from '@/context/RegisterModalContext'
import HeroBackgroundCarousel from '@/components/HeroBackgroundCarousel'
import FinalCTASection from '@/components/home/FinalCTASection'

export default function PricingPage() {
  const { openRegisterModal } = useRegisterModal()
  const [currency, setCurrency] = useState<'lkr' | 'usd'>('lkr')
  const [billingPeriod, setBillingPeriod] = useState<'3months' | '6months'>('3months')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [paymentModalPlan, setPaymentModalPlan] = useState<any | null>(null)

  const plans = [
    {
      id: 'free',
      name: 'Free Explorer',
      badge: 'Always Free',
      description: 'Ideal for creating your presence and receiving interest requests.',
      priceLKR: 'Free',
      priceUSD: 'Free',
      period: 'Lifetime Access',
      featured: false,
      buttonText: 'Create Free Account',
      features: [
        { text: 'Create complete matrimony profile', included: true },
        { text: 'Browse verified member directory', included: true },
        { text: 'Receive unlimited interest requests', included: true },
        { text: 'Send up to 3 interest requests/mo', included: true },
        { text: 'Photo privacy protection controls', included: true },
        { text: 'Direct contact details access', included: false },
        { text: 'Horoscope compatibility analysis', included: false },
        { text: 'Priority search ranking badge', included: false },
        { text: 'Dedicated relationship manager', included: false },
      ],
    },
    {
      id: 'silver',
      name: 'Silver Match',
      badge: 'Value Pack',
      description: 'Connect directly with sincere matches across Sri Lanka.',
      priceLKR: billingPeriod === '3months' ? 'Rs. 4,500' : 'Rs. 7,500',
      priceUSD: billingPeriod === '3months' ? '$18' : '$29',
      period: billingPeriod === '3months' ? '3 Months Access' : '6 Months Access',
      featured: false,
      buttonText: 'Get Silver Match',
      features: [
        { text: 'Create complete matrimony profile', included: true },
        { text: 'Browse verified member directory', included: true },
        { text: 'Send up to 30 interest requests/mo', included: true },
        { text: 'View 15 verified phone numbers', included: true },
        { text: 'Photo privacy protection controls', included: true },
        { text: 'Basic Porondam matching check', included: true },
        { text: 'Standard email & chat support', included: true },
        { text: 'Top featured profile highlight', included: false },
        { text: 'Dedicated relationship manager', included: false },
      ],
    },
    {
      id: 'gold',
      name: 'Gold VIP',
      badge: 'Most Popular',
      description: 'The premier choice for serious marriage seekers and families.',
      priceLKR: billingPeriod === '3months' ? 'Rs. 7,500' : 'Rs. 12,000',
      priceUSD: billingPeriod === '3months' ? '$29' : '$49',
      period: billingPeriod === '3months' ? '3 Months Access' : '6 Months Access',
      featured: true,
      buttonText: 'Upgrade to Gold VIP',
      features: [
        { text: 'Create complete matrimony profile', included: true },
        { text: 'Browse verified member directory', included: true },
        { text: 'Unlimited interest requests', included: true },
        { text: 'View 50 verified phone numbers', included: true },
        { text: 'Full 20 Porondam Horoscope Reports', included: true },
        { text: 'Gold Verified & VIP Profile Badge', included: true },
        { text: 'Priority placement in Search Results', included: true },
        { text: 'Direct SMS & WhatsApp alerts', included: true },
        { text: 'Dedicated relationship manager', included: false },
      ],
    },
    {
      id: 'platinum',
      name: 'Royal Platinum',
      badge: 'Elite Concierge',
      description: 'Personalized matchmaking service with an astrologer & relationship manager.',
      priceLKR: billingPeriod === '3months' ? 'Rs. 18,000' : 'Rs. 30,000',
      priceUSD: billingPeriod === '3months' ? '$69' : '$110',
      period: billingPeriod === '3months' ? '3 Months Access' : '6 Months Access',
      featured: false,
      buttonText: 'Join Royal Platinum',
      features: [
        { text: 'All Gold VIP features included', included: true },
        { text: 'Unlimited phone numbers reveal', included: true },
        { text: 'Dedicated Senior Relationship Manager', included: true },
        { text: 'Handpicked weekly match proposals', included: true },
        { text: 'Professional Astrologer Consultation', included: true },
        { text: 'Parent-to-Parent meeting coordination', included: true },
        { text: 'Complete background check reports', included: true },
        { text: 'Confidential VIP matchmaking tier', included: true },
        { text: '100% Guaranteed family introductions', included: true },
      ],
    },
  ]

  const faqs = [
    {
      q: 'How do I pay from Sri Lanka or Overseas?',
      a: 'We accept Sri Lankan Visa / Mastercard, PayHere, Genie, Frimi, direct Commercial Bank / Sampath Bank transfers, as well as international cards in USD, GBP, AUD, and AED.',
    },
    {
      q: 'When does my membership activate after payment?',
      a: 'Card payments via PayHere or Stripe activate instantly within seconds. If you choose direct bank transfer, simply send us the deposit slip via WhatsApp or email for instant activation within 15 minutes.',
    },
    {
      q: 'Can I cancel or change my plan anytime?',
      a: 'Yes, there are zero recurring automatic lock-ins. You pay one-time for your chosen duration (3 or 6 months) and have full control over renewals.',
    },
    {
      q: 'What is the 100% Satisfaction & Money-Back Policy?',
      a: 'If you do not find suitable verified profiles matching your criteria within your first 7 days, contact our support team for a hassle-free full refund.',
    },
    {
      q: 'Are phone numbers and personal contact details safe?',
      a: 'Yes. Contact numbers are never exposed to public crawlers. Only paid, verified members who have mutually accepted interests can view contact credentials.',
    },
  ]

  const handleSelectPlan = (plan: any) => {
    if (plan.id === 'free') {
      openRegisterModal()
    } else {
      setPaymentModalPlan(plan)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C1412] selection:bg-[#E5A93C]/30">
      
      {/* 1. Hero Banner with Background Carousel */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1C1412] text-white">
        <HeroBackgroundCarousel
          slides={[
            { src: '/images/cta-luxury.jpg', alt: 'Dignified Sri Lankan Royal Matrimony' },
            { src: '/images/carousel-couple-1.jpg', alt: 'Lifelong Partnership Plans' },
            { src: '/images/carousel-couple-5.jpg', alt: 'Gold VIP Matrimonial Introductions' },
            { src: '/images/carousel-couple-9.jpg', alt: 'Two Hearts One Journey' },
            { src: '/images/hero-luxury.jpg', alt: 'Sacred Traditional Marriage' },
          ]}
          intervalMs={6500}
        >
          <div className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6F0]/10 border border-[#E5A93C]/40 text-xs font-semibold text-[#F7D878] mb-5 backdrop-blur-md"
            >
              <Crown className="w-4 h-4 text-[#F7D878]" />
              <span>Dignified Sri Lankan Matrimony Plans</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight"
            >
              Invest in Your <span className="text-gradient-gold">Lifelong Partnership</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-[#FAF6F0]/90 max-w-2xl mx-auto font-sans leading-relaxed"
            >
              Transparent, one-time pricing with no hidden recurring charges. Unlock verified contact details, full 20 Porondam astrological analysis, and VIP matchmaking.
            </motion.p>

            {/* Controls: Currency & Billing Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              {/* Currency Selector */}
              <div className="inline-flex p-1 rounded-full bg-black/40 border border-white/15 backdrop-blur-md shadow-lg">
                <button
                  type="button"
                  onClick={() => setCurrency('lkr')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    currency === 'lkr' ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  🇱🇰 LKR (Sri Lanka)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('usd')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    currency === 'usd' ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  🌐 USD (Expat / Global)
                </button>
              </div>

              {/* Billing Duration */}
              <div className="inline-flex p-1 rounded-full bg-black/40 border border-white/15 backdrop-blur-md shadow-lg">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('3months')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    billingPeriod === '3months' ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  3 Months
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('6months')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingPeriod === '6months' ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>6 Months</span>
                  <span className="text-[10px] uppercase font-extrabold bg-[#10B981] text-white px-1.5 py-0.5 rounded-full">
                    Save 35%
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </HeroBackgroundCarousel>
      </section>

      {/* 2. Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => {
            const isGold = plan.featured

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  isGold
                    ? 'bg-gradient-to-b from-[#1C1412] via-[#281D1A] to-[#1C1412] text-white border-2 border-[#E5A93C] shadow-2xl scale-105 z-10'
                    : 'bg-white text-[#1C1412] border border-[#EADFCF] shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase shadow-md ${
                      isGold
                        ? 'bg-[#E5A93C] text-[#1C1412]'
                        : 'bg-[#FAF6F0] text-[#9B6B15] border border-[#E5A93C]/40'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="mt-2">
                    <h3 className={`font-serif text-xl font-bold ${isGold ? 'text-white' : 'text-[#1C1412]'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${isGold ? 'text-[#FAF6F0]/70' : 'text-[#1C1412]/65'}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="my-6 pb-6 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-serif text-3xl sm:text-4xl font-extrabold ${isGold ? 'text-[#F7D878]' : 'text-[#1C1412]'}`}>
                        {currency === 'lkr' ? plan.priceLKR : plan.priceUSD}
                      </span>
                    </div>
                    <p className={`text-[11px] font-semibold mt-1 ${isGold ? 'text-[#F7D878]/80' : 'text-[#9B6B15]'}`}>
                      {plan.period}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat.text} className="flex items-start gap-2.5 text-xs">
                        {feat.included ? (
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isGold ? 'text-[#F7D878]' : 'text-emerald-600'}`} />
                        ) : (
                          <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-gray-300 dark:text-gray-600" />
                        )}
                        <span className={feat.included ? (isGold ? 'text-white' : 'text-[#1C1412]') : 'text-gray-400'}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                    isGold
                      ? 'btn-gold shadow-gold hover:shadow-gold-lg text-[#1C1412]'
                      : 'bg-[#FAF6F0] hover:bg-[#F3ECE2] border border-[#EADFCF] text-[#1C1412]'
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </motion.div>
            )
          })}
        </div>
      </section>

      {/* 3. Payment Methods & Assurance */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-8 border border-[#EADFCF] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6 text-[#9B6B15]" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#1C1412]">Secure Instant Payment</h4>
            <p className="text-xs text-[#1C1412]/65 mt-1 font-sans">
              Visa, Mastercard, PayHere, Genie & Frimi 256-bit encrypted checkout.
            </p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center mb-3">
              <Building className="w-6 h-6 text-[#9B6B15]" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#1C1412]">Direct Bank Deposit</h4>
            <p className="text-xs text-[#1C1412]/65 mt-1 font-sans">
              Deposit to Commercial, Sampath or BOC bank accounts with instant slip verification.
            </p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-[#9B6B15]" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#1C1412]">7-Day Money-Back</h4>
            <p className="text-xs text-[#1C1412]/65 mt-1 font-sans">
              100% satisfaction guarantee. Full refund if not completely satisfied.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412]">
            Membership FAQ
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#1C1412]/70 font-sans">
            Everything you need to know before joining.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-[#EADFCF] overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-[#1C1412] hover:text-[#9B6B15] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#E5A93C] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 text-xs sm:text-sm text-[#1C1412]/75 leading-relaxed font-sans border-t border-gray-100 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. Bottom Video Call to Action */}
      <FinalCTASection />

      {/* 6. Payment Modal / Bank Transfer Details */}
      <AnimatePresence>
        {paymentModalPlan && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setPaymentModalPlan(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5A93C]/40 z-10 p-6 text-[#1C1412]"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#9B6B15]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C1412]">
                      {paymentModalPlan.name} Membership
                    </h3>
                    <p className="text-xs text-[#9B6B15] font-semibold">
                      {currency === 'lkr' ? paymentModalPlan.priceLKR : paymentModalPlan.priceUSD} • {paymentModalPlan.period}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setPaymentModalPlan(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#1C1412]/80">
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] space-y-2">
                  <p className="font-bold text-[#1C1412] flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#9B6B15]" />
                    <span>Direct Bank Deposit Details:</span>
                  </p>
                  <div className="text-xs space-y-1 font-mono text-[#1C1412]/90">
                    <p><span className="font-semibold text-gray-500">Bank:</span> Commercial Bank PLC</p>
                    <p><span className="font-semibold text-gray-500">Account Name:</span> Dehadak Matrimonial Services</p>
                    <p><span className="font-semibold text-gray-500">Account Number:</span> 8009124456</p>
                    <p><span className="font-semibold text-gray-500">Branch:</span> Colombo Super Grade</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] space-y-2">
                  <p className="font-bold text-[#1C1412] flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-[#9B6B15]" />
                    <span>Instant WhatsApp Activation:</span>
                  </p>
                  <p className="text-xs text-[#1C1412]/75">
                    After completing payment, please WhatsApp your receipt/slip to <span className="font-bold text-[#9B6B15]">+94 77 123 4567</span> with your registered email for instant activation within 10 minutes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentModalPlan(null)
                    openRegisterModal()
                  }}
                  className="btn-gold w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-[#1C1412] shadow-gold hover:shadow-gold-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Register Profile & Proceed</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
