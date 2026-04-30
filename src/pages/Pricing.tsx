import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, HelpCircle } from 'lucide-react'
import PricingCard from '@/components/PricingCard'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const plans = [
  {
    name: 'Basic',
    price: 'LKR 1,500',
    duration: '2 Months',
    total: 'LKR 3,000 total',
    features: [
      'Create full profile',
      'Browse all profiles',
      'Send 5 interests/month',
      'Basic search filters',
      'Email support',
    ],
  },
  {
    name: 'Standard',
    price: 'LKR 1,667',
    duration: '3 Months',
    total: 'LKR 5,000 total',
    features: [
      'Everything in Basic',
      'Unlimited interests',
      'View contact details',
      'Priority listing',
      'Email support',
    ],
    featured: true,
  },
  {
    name: 'Premium',
    price: 'LKR 2,667',
    duration: '3 Months',
    total: 'LKR 8,000 total',
    features: [
      'Everything in Standard',
      'Horoscope matching',
      'Profile highlighting',
      'Personal match suggestions',
      'Phone support',
    ],
  },
]

const comparisonFeatures = [
  { feature: 'Create full profile', basic: true, standard: true, premium: true },
  { feature: 'Browse all profiles', basic: true, standard: true, premium: true },
  { feature: 'Send interests', basic: '5/month', standard: 'Unlimited', premium: 'Unlimited' },
  { feature: 'Advanced search filters', basic: false, standard: true, premium: true },
  { feature: 'View contact details', basic: false, standard: true, premium: true },
  { feature: 'Priority listing', basic: false, standard: true, premium: true },
  { feature: 'Horoscope matching', basic: false, standard: false, premium: true },
  { feature: 'Profile highlighting', basic: false, standard: false, premium: true },
  { feature: 'Personal match suggestions', basic: false, standard: false, premium: true },
  { feature: 'Email support', basic: true, standard: true, premium: true },
  { feature: 'Phone support', basic: false, standard: false, premium: true },
]

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your account will remain active until the end of your billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, bank transfers, and popular mobile payment methods in Sri Lanka including eZ Cash and mCash.',
  },
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Absolutely! You can upgrade your plan at any time. The price difference will be prorated for the remaining period.',
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'We offer a 7-day satisfaction guarantee. If you are not satisfied, contact our support team for a refund.',
  },
  {
    question: 'What happens when my subscription expires?',
    answer: 'Your profile remains visible but with limited features. You can renew anytime to restore full access.',
  },
]

export default function PricingPage() {
  const [country, setCountry] = useState('lk')

  const countryPricing: Record<string, typeof plans> = {
    lk: plans,
    us: plans.map((p) => ({
      ...p,
      price: p.price.replace('LKR', '$').replace(/[\d,]+/, (n) => String(Math.round(Number(n.replace(/,/g, '')) / 300))),
      total: p.total.replace('LKR', '$').replace(/[\d,]+/, (n) => String(Math.round(Number(n.replace(/,/g, '')) / 300))),
    })),
    uk: plans.map((p) => ({
      ...p,
      price: p.price.replace('LKR', '£').replace(/[\d,]+/, (n) => String(Math.round(Number(n.replace(/,/g, '')) / 400))),
      total: p.total.replace('LKR', '£').replace(/[\d,]+/, (n) => String(Math.round(Number(n.replace(/,/g, '')) / 400))),
    })),
    au: plans.map((p) => ({
      ...p,
      price: p.price.replace('LKR', 'A$').replace(/[\d,]+/, (n) => String(Math.round(Number(n.replace(/,/g, '')) / 200))),
      total: p.total.replace('LKR', 'A$').replace(/[\d,]+/, (n) => String(Math.round(Number(n.replace(/,/g, '')) / 200))),
    })),
  }

  const currentPlans = countryPricing[country] || plans

  return (
    <div className="min-h-screen bg-light-bg pt-[72px]">
      {/* Hero */}
      <section className="py-16 md:py-20 gradient-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 max-w-xl mx-auto"
          >
            Invest in finding your life partner. No hidden fees, no surprises.
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10">
        {/* Country Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-4 mb-10 max-w-xs mx-auto border border-light-border"
        >
          <label className="block text-sm font-medium mb-2">Where do you live?</label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lk">Sri Lanka</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {currentPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PricingCard {...plan} />
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-center mb-8">
            Compare Plans
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-light-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-light-border bg-light-bg">
                    <th className="text-left px-6 py-4 text-sm font-semibold">Feature</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold">Basic</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gold bg-gold/5">
                      <span className="flex items-center justify-center gap-1">
                        <Crown className="w-4 h-4" />
                        Standard
                      </span>
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <tr key={i} className="border-b border-light-border last:border-0">
                      <td className="px-6 py-4 text-sm">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.basic === 'boolean' ? (
                          row.basic ? (
                            <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-light-border">—</span>
                          )
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.basic}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-gold/5">
                        {typeof row.standard === 'boolean' ? (
                          row.standard ? (
                            <Check className="w-5 h-5 text-gold mx-auto" />
                          ) : (
                            <span className="text-light-border">—</span>
                          )
                        ) : (
                          <span className="text-sm font-medium text-foreground">{row.standard}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.premium === 'boolean' ? (
                          row.premium ? (
                            <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-light-border">—</span>
                          )
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white rounded-xl border border-light-border px-6"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-16"
        >
          <div className="bg-gold/10 rounded-xl p-8 max-w-xl mx-auto">
            <HelpCircle className="w-10 h-10 text-gold mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Have Questions?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is here to help you choose the right plan.
            </p>
            <button className="px-6 py-2.5 rounded-xl bg-gold text-dark-bg font-semibold text-sm hover:bg-gold-light transition-colors">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
