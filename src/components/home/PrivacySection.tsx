import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, EyeOff, ShieldAlert, Sparkles } from 'lucide-react'

export default function PrivacySection() {
  const { t } = useTranslation()

  const items = [
    {
      icon: EyeOff,
      title: t('home.privacySection.item1Title'),
      desc: t('home.privacySection.item1Desc'),
    },
    {
      icon: Lock,
      title: t('home.privacySection.item2Title'),
      desc: t('home.privacySection.item2Desc'),
    },
    {
      icon: ShieldCheck,
      title: t('home.privacySection.item3Title'),
      desc: t('home.privacySection.item3Desc'),
    },
    {
      icon: ShieldAlert,
      title: t('home.privacySection.item4Title'),
      desc: t('home.privacySection.item4Desc'),
    },
  ]

  return (
    <section className="py-24 bg-[#FAF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEE6D8] border border-[#D4A72C]/30 text-xs font-semibold text-[#996F16] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>Matrimonial Privacy Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A17] tracking-tight">
            {t('home.privacySection.heading')}
          </h2>
          <p className="text-sm sm:text-base text-[#241A17]/70 mt-3">
            {t('home.privacySection.subtitle')}
          </p>
        </div>

        {/* 2x2 Grid with Elegant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#EEE6D8] hover:border-[#D4A72C]/40 hover:shadow-xl transition-all duration-300 flex items-start gap-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F3D77A]/20 to-[#D4A72C]/10 border border-[#D4A72C]/30 flex items-center justify-center shrink-0 shadow-sm">
                <item.icon className="w-7 h-7 text-[#D4A72C]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-[#241A17]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#241A17]/70 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
