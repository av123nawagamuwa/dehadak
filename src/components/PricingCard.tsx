import { Check, Crown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PricingCardProps {
  name: string
  price: string
  duration: string
  total: string
  features: string[]
  featured?: boolean
  ctaText?: string
}

export default function PricingCard({
  name,
  price,
  duration,
  total,
  features,
  featured = false,
  ctaText,
}: PricingCardProps) {
  const { t } = useTranslation()

  return (
    <div
      className={`relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
        featured
          ? 'bg-[#FFFFFF] border-2 border-[#D4A72C] shadow-gold-lg scale-100 md:scale-105 z-10'
          : 'bg-[#FAF7F0] border border-[#EEE6D8] shadow-card hover:shadow-xl'
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#F3D77A] to-[#D4A72C] text-[#241A17] text-xs font-bold shadow-md">
            <Crown className="w-3.5 h-3.5" />
            {t('pricingCard.mostPopular')}
          </div>
        </div>
      )}

      <div>
        {/* Plan Name */}
        <h3 className="font-serif text-2xl font-bold text-[#241A17] mb-1">{name}</h3>
        <p className="text-xs text-[#241A17]/60 font-medium mb-4">{duration}</p>

        {/* Price */}
        <div className="mb-2">
          <span className="font-serif text-3xl font-extrabold text-[#241A17]">{price}</span>
          <span className="text-xs text-[#241A17]/60 font-medium"> {t('pricingCard.perMonth')}</span>
        </div>
        <p className="text-xs font-bold text-[#996F16] mb-6">{total}</p>

        {/* Divider */}
        <div className="h-px bg-[#EEE6D8] mb-6" />

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#D4A72C]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-[#996F16]" />
              </div>
              <span className="text-xs sm:text-sm text-[#241A17]/80">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm ${
          featured
            ? 'btn-gold shadow-gold hover:shadow-gold-lg'
            : 'bg-[#241A17] text-[#FAF7F0] hover:bg-[#33221D]'
        }`}
      >
        {ctaText ?? t('pricingCard.subscribeNow')}
      </button>
    </div>
  )
}
