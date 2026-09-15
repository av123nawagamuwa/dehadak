import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import {
  Sparkles,
  UserCheck,
  Search,
  Moon,
  Heart,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Flame,
  Star,
  Users,
  Compass,
} from 'lucide-react'
import { useRegisterModal } from '@/context/RegisterModalContext'
import HeroBackgroundCarousel from '@/components/HeroBackgroundCarousel'
import FinalCTASection from '@/components/home/FinalCTASection'

export default function HowItWorksPage() {
  const { openRegisterModal } = useRegisterModal()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const steps = [
    {
      number: '01',
      title: 'Create Your Dignified Profile',
      subtitle: 'Simple, secure & 100% free registration',
      desc: 'Set up your matrimonial profile in less than 2 minutes. Enter your background, educational qualifications, profession, and family values. Upload high-quality photos with strict privacy controls—you choose who can see your picture.',
      icon: UserCheck,
      badge: 'Privacy First',
      image: '/images/how-it-works-1.jpg',
      highlights: ['Custom Photo Privacy', 'ID & Phone Verification', 'Verified Member Badge'],
    },
    {
      number: '02',
      title: 'Discover Compatible Matches',
      subtitle: 'Refined filters across all 25 Sri Lankan districts',
      desc: 'Explore thousands of verified Sri Lankan brides and grooms living locally and abroad. Filter effortlessly by district, profession, education level, religion, civil status, and lifestyle preferences with instantaneous results.',
      icon: Search,
      badge: 'Smart Discovery',
      image: '/images/how-it-works-2.jpg',
      highlights: ['Islandwide & Expat Filters', 'Profession & Degree Matching', 'Real-Time Updates'],
    },
    {
      number: '03',
      title: 'Horoscope (Porondam) Harmony',
      subtitle: 'Traditional 20 Porondam astrological analysis',
      desc: 'Sri Lankan marriage traditions honor cosmic harmony. Easily upload your birth chart (Nekatha / Lagna) or birth time for automated or astrologer-assisted Porondam evaluations (Gana, Dina, Rashi, Rajju, and Yoni matching).',
      icon: Moon,
      badge: 'Cultural Heritage',
      image: '/images/how-it-works-3.jpg',
      highlights: ['20 Porondam Breakdown', 'Lagna & Rashi Compatibility', 'Optional & Confidential'],
    },
    {
      number: '04',
      title: 'Express Interest with Respect',
      subtitle: 'Direct, dignified and private family communication',
      desc: 'Found someone special? Send a respectful Interest request with one click. When both parties accept, phone numbers and contact details are securely unlocked, enabling families or individuals to converse with confidence.',
      icon: Heart,
      badge: 'Mutual Consent',
      image: '/images/how-it-works-4.jpg',
      highlights: ['Encrypted Connections', 'Zero Spam / Harassment', 'Family-Friendly Format'],
    },
    {
      number: '05',
      title: 'The Sacred Poruwa & Lifelong Joy',
      subtitle: 'Two hearts unite into one beautiful family',
      desc: 'Celebrate the holy union surrounded by loved ones, cultural blessings, and lifelong happiness. Dehadak stands proudly beside every couple that embarks on this sacred journey together.',
      icon: Flame,
      badge: 'Two Hearts, One Journey',
      image: '/images/how-it-works-5.jpg',
      highlights: ['1,200+ Happy Marriages', 'Dedicated Marriage Concierge', 'Lifelong Memories'],
    },
  ]

  const porondamList = [
    { name: 'Dina Porondama', desc: 'Determines health, vitality and overall physical compatibility.' },
    { name: 'Gana Porondama', desc: 'Checks temperament, mindset and spiritual harmony between partners.' },
    { name: 'Yoni Porondama', desc: 'Ensures mutual attraction, affection and emotional bonding.' },
    { name: 'Rashi Porondama', desc: 'Evaluates longevity, mental peace and shared prosperity.' },
    { name: 'Rajju Porondama', desc: 'Most auspicious match for lifelong marital bliss and longevity.' },
    { name: 'Vedha Porondama', desc: 'Examines planetary peace and absence of cosmic afflictions.' },
  ]

  const faqs = [
    {
      q: 'Is registration on Dehadak completely free?',
      a: 'Yes! Creating a profile, browsing verified members, and receiving interest requests is 100% free. Optional premium memberships are available for priority listing and direct contact reveals.',
    },
    {
      q: 'How does Dehadak protect my privacy and photos?',
      a: 'We provide strict Photo Privacy mode where your photo is blurred to the public and only shown to verified members whom you explicitly approve. Your phone number and email remain hidden until you mutually accept an interest.',
    },
    {
      q: 'Is Horoscope (Porondam) matching mandatory?',
      a: 'No, Horoscope matching is completely optional. If you or your family value traditional astrological matching, you can upload your horoscope chart or birth details; otherwise, you can connect purely based on mutual values and background.',
    },
    {
      q: 'Can Sri Lankans living abroad (Expats) register on Dehadak?',
      a: 'Absolutely. A large percentage of our members are Sri Lankan professionals living in the UAE, UK, Australia, USA, Canada, Qatar, New Zealand, and Italy seeking a partner with genuine Sri Lankan roots.',
    },
    {
      q: 'How are profiles verified to prevent fake accounts?',
      a: 'Every profile undergoes a mandatory phone verification step and manual editorial review. We check photo authenticity and profile details before granting the Gold Verified badge.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C1412] selection:bg-[#E5A93C]/30">
      
      {/* 1. Hero Banner with Background Carousel */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1C1412] text-white">
        <HeroBackgroundCarousel
          slides={[
            { src: '/images/how-it-works-1.jpg', alt: 'Traditional Sri Lankan Poruwa Ceremony' },
            { src: '/images/how-it-works-2.jpg', alt: 'Sacred Knot & Family Blessings' },
            { src: '/images/how-it-works-3.jpg', alt: 'Sri Lankan Bride and Groom Traditions' },
            { src: '/images/how-it-works-4.jpg', alt: 'Two Hearts United in Marriage' },
            { src: '/images/how-it-works-5.jpg', alt: 'Lifelong Matrimonial Happiness' },
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
              <Sparkles className="w-4 h-4 text-[#F7D878]" />
              <span>Sri Lanka's Premier Matrimonial Journey</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight"
            >
              How Dehadak Unites <span className="text-gradient-gold">Two Hearts</span> into One
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-[#FAF6F0]/90 max-w-2xl mx-auto font-sans leading-relaxed"
            >
              Combining respected Sri Lankan traditions with state-of-the-art matchmaking technology. Experience a refined, confidential, and heartfelt journey to marriage.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={openRegisterModal}
                className="btn-gold px-8 py-3.5 rounded-full text-sm font-bold shadow-gold hover:shadow-gold-lg flex items-center gap-2 transition-all"
              >
                <span>Begin Your Journey Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/search"
                className="px-8 py-3.5 rounded-full text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-[#E5A93C]/40 transition-all backdrop-blur-sm"
              >
                Browse Verified Profiles
              </Link>
            </motion.div>
          </div>
        </HeroBackgroundCarousel>
      </section>

      {/* 2. Step-by-Step Interactive Timeline */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E5A93C]/30 text-xs font-semibold text-[#9B6B15] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>The 5 Simple Steps</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1412] tracking-tight">
            Your Seamless Path to Matrimonial Harmony
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#1C1412]/70 leading-relaxed">
            Every feature on Dehadak is crafted to make your search enjoyable, respectful, and genuine.
          </p>
        </div>

        <div className="space-y-12 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const isEven = idx % 2 === 1

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-8 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFCF] shadow-lg hover:shadow-xl transition-all relative overflow-hidden`}
              >
                {/* Decorative Step Number Watermark */}
                <div className="absolute -top-6 -right-6 text-8xl sm:text-9xl font-serif font-extrabold text-[#E5A93C]/10 select-none pointer-events-none">
                  {step.number}
                </div>

                {/* Left/Right Visual Card with Background Image */}
                <div className="w-full lg:w-5/12">
                  <div className="relative rounded-2xl overflow-hidden p-8 text-white border border-[#E5A93C]/40 shadow-xl min-h-[250px] flex flex-col justify-between group">
                    {/* Background Image with Ken Burns subtle zoom on hover */}
                    <img
                      src={step.image}
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    {/* Dark Espresso & Gold Multi-Layer Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/80 to-[#1C1412]/60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1C1412]/80 via-transparent to-[#1C1412]/40" />

                    {/* Content overlay */}
                    <div className="relative z-10">
                      <div className="w-13 h-13 rounded-2xl bg-[#E5A93C]/25 backdrop-blur-md border border-[#E5A93C]/60 flex items-center justify-center mb-4 shadow-gold p-3 inline-flex">
                        <Icon className="w-6 h-6 text-[#F7D878]" />
                      </div>
                      <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#E5A93C]/40 text-xs font-semibold text-[#F7D878] mb-2.5 shadow-xs">
                          {step.badge}
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-white mb-1.5 leading-snug drop-shadow-md">
                          {step.title}
                        </h3>
                        <p className="text-xs text-[#FAF6F0]/85 font-sans leading-relaxed">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right/Left Explanation & Highlights */}
                <div className="w-full lg:w-7/12 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#E5A93C] text-[#1C1412] font-bold text-sm flex items-center justify-center shadow-gold">
                      {step.number}
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1412]">
                      {step.title}
                    </h4>
                  </div>

                  <p className="text-sm sm:text-base text-[#1C1412]/75 leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {step.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] text-xs font-semibold text-[#1C1412]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* 3. Horoscope (Porondam) Breakdown Section */}
      <section className="py-16 bg-[#F5ECE1] border-y border-[#EADFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E5A93C]/30 text-xs font-semibold text-[#9B6B15] mb-3 shadow-xs">
              <Moon className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Sri Lankan Astrological Heritage</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1412]">
              Understanding Porondam Compatibility
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-[#1C1412]/75 leading-relaxed">
              In traditional Sri Lankan culture, the 20 Porondams help assess mutual longevity, family prosperity, and harmonious living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {porondamList.map((p, idx) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-[#EADFCF] shadow-sm hover:shadow-md hover:border-[#E5A93C]/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center">
                    <Star className="w-4 h-4 text-[#E5A93C] fill-current" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1C1412]">
                    {p.name}
                  </h3>
                </div>
                <p className="text-xs text-[#1C1412]/70 leading-relaxed font-sans">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <div className="inline-block p-4 rounded-2xl bg-white border border-[#E5A93C]/40 max-w-xl text-xs sm:text-sm text-[#1C1412]/80 shadow-sm">
              <span className="font-bold text-[#9B6B15]">Astrology Note:</span> Horoscope matching is completely optional on Dehadak. You can choose whether to include your birth chart or proceed purely based on modern mutual compatibility.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust & Security Pillar */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-16 lg:p-20 min-h-[480px] sm:min-h-[540px] text-white border border-[#E5A93C]/30 shadow-2xl relative overflow-hidden flex items-center">
          {/* Background Video (section A.mp4) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105"
            src="/videos/section-a.mp4"
          />

          {/* Cinematic Dark & Gold Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C1412]/85 via-[#241A17]/70 to-[#1C1412]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E5A93C]/15 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5A93C]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E5A93C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10 w-full">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E5A93C]/40 text-xs font-semibold text-[#F7D878] mb-5 backdrop-blur-sm shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#F7D878]" />
                <span>Uncompromising Safety</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
                Why Thousands of Sri Lankan Families Trust Dehadak
              </h2>
              <p className="text-sm sm:text-base text-[#FAF6F0]/85 font-sans leading-relaxed mb-8">
                Unlike casual dating applications, Dehadak is designed specifically for marriage with high family values, authentic verification, and zero tolerance for fake profiles.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#F7D878]" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#FAF6F0]/95 font-medium leading-normal">
                    100% Verified Phone Numbers & Manual Profile Auditing
                  </p>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Lock className="w-4 h-4 text-[#F7D878]" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#FAF6F0]/95 font-medium leading-normal">
                    Strict Photo Blur & Request-Only Viewing Permissions
                  </p>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Users className="w-4 h-4 text-[#F7D878]" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#FAF6F0]/95 font-medium leading-normal">
                    Family-Oriented Architecture with Sincere Life Partners
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-[#241A17]/65 hover:bg-[#241A17]/80 border border-[#E5A93C]/30 hover:border-[#E5A93C]/60 rounded-3xl p-6 sm:p-8 text-center backdrop-blur-md shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gold-shimmer">1,200+</p>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-2 font-sans font-medium uppercase tracking-wider">Celebrated Marriages</p>
              </div>
              <div className="bg-[#241A17]/65 hover:bg-[#241A17]/80 border border-[#E5A93C]/30 hover:border-[#E5A93C]/60 rounded-3xl p-6 sm:p-8 text-center backdrop-blur-md shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gold-shimmer">100%</p>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-2 font-sans font-medium uppercase tracking-wider">Verified Contact Info</p>
              </div>
              <div className="bg-[#241A17]/65 hover:bg-[#241A17]/80 border border-[#E5A93C]/30 hover:border-[#E5A93C]/60 rounded-3xl p-6 sm:p-8 text-center backdrop-blur-md shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gold-shimmer">25</p>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-2 font-sans font-medium uppercase tracking-wider">Districts Covered</p>
              </div>
              <div className="bg-[#241A17]/65 hover:bg-[#241A17]/80 border border-[#E5A93C]/30 hover:border-[#E5A93C]/60 rounded-3xl p-6 sm:p-8 text-center backdrop-blur-md shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gold-shimmer">4.9 / 5</p>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-2 font-sans font-medium uppercase tracking-wider">Member Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#1C1412]/70 font-sans">
            Clear answers to common questions about Dehadak matrimonial services.
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

      {/* 6. Bottom Video Call to Action */}
      <FinalCTASection />

    </div>
  )
}
