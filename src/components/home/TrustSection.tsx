import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, HeartHandshake, Users, Sparkles } from 'lucide-react'

export default function TrustSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: ShieldCheck,
      title: t('home.trustSection.verifiedProfilesTitle'),
      desc: t('home.trustSection.verifiedProfilesDesc'),
      badge: '100% Verified',
    },
    {
      icon: Lock,
      title: t('home.trustSection.privacyFirstTitle'),
      desc: t('home.trustSection.privacyFirstDesc'),
      badge: 'Privacy Shield',
    },
    {
      icon: HeartHandshake,
      title: t('home.trustSection.genuineConnectionsTitle'),
      desc: t('home.trustSection.genuineConnectionsDesc'),
      badge: 'Serious Seekers',
    },
    {
      icon: Users,
      title: t('home.trustSection.familyFriendlyTitle'),
      desc: t('home.trustSection.familyFriendlyDesc'),
      badge: 'Cultural Respect',
    },
  ]

  return (
    <section className="py-24 bg-[#FFFFFF] relative overflow-hidden border-y border-[#EEE6D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF7F0] border border-[#D4A72C]/30 text-xs font-semibold text-[#996F16] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>Our Uncompromising Promise</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A17] tracking-tight">
            {t('home.trustSection.heading')}
          </h2>
          <p className="text-sm sm:text-base text-[#241A17]/70 mt-3">
            {t('home.trustSection.subtitle')}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group bg-[#FAF7F0] rounded-3xl p-7 border border-[#EEE6D8] hover:border-[#D4A72C]/40 hover:bg-[#FFFFFF] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F3D77A]/20 to-[#D4A72C]/10 border border-[#D4A72C]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <item.icon className="w-7 h-7 text-[#D4A72C]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#996F16] bg-[#D4A72C]/10 px-2.5 py-1 rounded-full border border-[#D4A72C]/20">
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-[#241A17] mb-3 group-hover:text-[#996F16] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#241A17]/70 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-6 pt-4 border-t border-[#EEE6D8] flex items-center gap-1.5 text-xs font-semibold text-[#D4A72C]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4A72C]" />
                <span>Guaranteed Standard</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
