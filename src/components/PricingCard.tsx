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
      className={`relative rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 ${
        featured
          ? 'bg-white border-2 border-gold shadow-gold scale-100 md:scale-105 z-10'
          : 'bg-white border border-light-border shadow-md hover:shadow-gold'
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold text-dark-bg text-xs font-bold shadow-md">
            <Crown className="w-3.5 h-3.5" />
            {t('pricingCard.mostPopular')}
          </div>
        </div>
      )}

      <div className="pt-2">
        {/* Plan Name */}
        <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{duration}</p>

        {/* Price */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-foreground">{price}</span>
          <span className="text-sm text-muted-foreground"> {t('pricingCard.perMonth')}</span>
        </div>
        <p className="text-sm font-medium text-gold mb-6">{total}</p>

        {/* Divider */}
        <div className="h-px bg-light-border mb-6" />

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-gold" />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            featured
              ? 'bg-gold text-dark-bg hover:bg-gold-dark hover:shadow-gold-lg'
              : 'border-2 border-gold text-gold hover:bg-gold hover:text-dark-bg'
          }`}
        >
          {ctaText ?? t('pricingCard.subscribeNow')}
        </button>
      </div>
    </div>
  )
}
