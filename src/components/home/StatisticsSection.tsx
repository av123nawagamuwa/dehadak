import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { Users, ShieldCheck, Heart, Lock } from 'lucide-react'

function Counter({ endValue, suffix = '', duration = 2000 }: { endValue: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOutQuad = 1 - (1 - progress) * (1 - progress)
      setCount(Math.floor(easeOutQuad * endValue))

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(step)
  }, [isInView, endValue, duration])

  return (
    <span ref={ref} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gold-shimmer tracking-tight">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function StatisticsSection() {
  const { t } = useTranslation()

  const stats = [
    {
      icon: Users,
      value: 5000,
      suffix: '+',
      label: t('home.statistics.stat1Label'),
    },
    {
      icon: ShieldCheck,
      value: 2500,
      suffix: '+',
      label: t('home.statistics.stat2Label'),
    },
    {
      icon: Heart,
      value: 1000,
      suffix: '+',
      label: t('home.statistics.stat3Label'),
    },
    {
      icon: Lock,
      value: 100,
      suffix: '%',
      label: t('home.statistics.stat4Label'),
    },
  ]

  return (
    <section className="relative overflow-hidden text-white border-y border-[#D4A72C]/30 shadow-luxury py-24 sm:py-32 lg:py-36 min-h-[480px] sm:min-h-[540px] flex items-center justify-center">
      
      {/* Background Video (section A.mp4) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
        src="/videos/section-a.mp4"
      />

      {/* Cinematic Dark & Gold Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C1412]/85 via-[#241A17]/65 to-[#1C1412]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4A72C]/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="text-center p-6 sm:p-8 rounded-3xl bg-[#241A17]/70 hover:bg-[#241A17]/85 border border-[#D4A72C]/30 hover:border-[#D4A72C]/70 shadow-2xl backdrop-blur-md transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4A72C]/25 to-[#D4A72C]/10 border border-[#D4A72C]/40 flex items-center justify-center mx-auto mb-5 shadow-gold group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-7 h-7 text-[#F3D77A]" />
              </div>

              <div className="mb-2">
                <Counter endValue={stat.value} suffix={stat.suffix} />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#FAF7F0]/90 uppercase tracking-widest font-sans mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
