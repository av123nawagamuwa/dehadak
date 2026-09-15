import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { UserPlus, Search, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

export default function HowItWorksSection() {
  const { t } = useTranslation()

  const steps = [
    {
      step: '01',
      icon: UserPlus,
      title: t('home.howItWorks.step1Title'),
      desc: t('home.howItWorks.step1Desc'),
    },
    {
      step: '02',
      icon: Search,
      title: t('home.howItWorks.step2Title'),
      desc: t('home.howItWorks.step2Desc'),
    },
    {
      step: '03',
      icon: HeartHandshake,
      title: t('home.howItWorks.step3Title'),
      desc: t('home.howItWorks.step3Desc'),
    },
    {
      step: '04',
      icon: Sparkles,
      title: t('home.howItWorks.step4Title'),
      desc: t('home.howItWorks.step4Desc'),
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-[#FAF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEE6D8] border border-[#D4A72C]/30 text-xs font-semibold text-[#996F16] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>Simple, Dignified Process</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A17] tracking-tight">
            {t('home.howItWorks.heading')}
          </h2>
          <p className="text-sm sm:text-base text-[#241A17]/70 mt-3">
            {t('home.howItWorks.subtitle')}
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          
          {/* Desktop Connected Gold Line */}
          <div className="hidden lg:block absolute top-[46px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#D4A72C]/20 via-[#D4A72C] to-[#D4A72C]/20 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="group flex flex-col items-center text-center"
              >
                {/* Step Icon Badge */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-[#FFFFFF] border-2 border-[#D4A72C] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-[#F3D77A] group-hover:shadow-gold transition-all duration-300">
                    <item.icon className="w-9 h-9 text-[#D4A72C] group-hover:text-[#996F16] transition-colors" />
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#241A17] text-[#F3D77A] text-[11px] font-extrabold shadow-sm border border-[#D4A72C]/30">
                    {item.step}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="font-serif text-xl font-bold text-[#241A17] mb-2.5 group-hover:text-[#996F16] transition-colors">
                  {item.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-[#241A17]/70 leading-relaxed font-sans max-w-xs">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Link */}
        <div className="text-center mt-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/how-it-works"
            className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold shadow-gold hover:shadow-gold-lg"
          >
            <span>Explore Complete 5-Step Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold bg-white border border-[#EEE6D8] text-[#241A17] hover:bg-gray-50 transition-all"
          >
            <span>Search Compatible Matches</span>
          </Link>
        </div>

      </div>
    </section>
  )
}
