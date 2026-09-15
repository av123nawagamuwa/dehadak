import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Star, Heart, Quote, Sparkles } from 'lucide-react'
import { Link } from 'react-router'

export default function SuccessStoriesSection() {
  const { t } = useTranslation()

  const stories = [
    {
      id: 1,
      names: 'Ruwani & Chaminda',
      location: 'Colombo & Kandy',
      year: 'Married in 2024',
      image: '/images/story-1.jpg',
      quote:
        'Dehadak gave us a dignified, private platform where our parents could connect with complete trust. Finding someone with matching values made our journey truly effortless.',
      profession: 'Software Architect & Doctor',
    },
    {
      id: 2,
      names: 'Amali & Sajith',
      location: 'Galle & Kurunegala',
      year: 'Married in 2024',
      image: '/images/story-2.jpg',
      quote:
        'The photo privacy controls gave my family complete peace of mind. We exchanged details only after mutual respect and discovered we were meant for each other.',
      profession: 'Attorney & Bank Manager',
    },
    {
      id: 3,
      names: 'Tharushi & Praveen',
      location: 'Matara & Gampaha',
      year: 'Married in 2023',
      image: '/images/story-3.jpg',
      quote:
        'After trying various avenues, Dehadak was the only platform that felt genuinely Sri Lankan, dignified, and authentic. Today we are celebrating our dream wedding.',
      profession: 'Lecturer & Civil Engineer',
    },
  ]

  return (
    <section id="success-stories" className="py-24 bg-[#FFFFFF] relative overflow-hidden border-t border-[#EEE6D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF7F0] border border-[#D4A72C]/30 text-xs font-semibold text-[#996F16] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>Sri Lankan Couples on Dehadak</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A17] tracking-tight">
            {t('home.testimonials.heading')}
          </h2>
          <p className="text-sm sm:text-base text-[#241A17]/70 mt-3">
            {t('home.testimonials.subtitle')}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group bg-[#FAF7F0] rounded-3xl overflow-hidden border border-[#EEE6D8] hover:border-[#D4A72C]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Couple Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.names}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                {/* Year Badge */}
                <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#241A17]/80 backdrop-blur-md border border-[#D4A72C]/30 text-[11px] font-bold text-[#F3D77A]">
                  {story.year}
                </div>

                {/* Couple Names over Image */}
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl font-bold text-white drop-shadow-sm">
                    {story.names}
                  </h3>
                  <p className="text-xs text-white/80 font-medium">
                    {story.location} • {story.profession}
                  </p>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#D4A72C] fill-[#D4A72C]" />
                  ))}
                </div>

                {/* Testimonial Quote */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-[#D4A72C]/20 absolute -top-3 -left-2 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-[#241A17]/80 italic leading-relaxed pl-3 font-serif">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EEE6D8] flex items-center justify-between text-xs text-[#996F16] font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                    Happily Married
                  </span>
                  <span className="text-[11px] text-[#241A17]/50 font-normal">Verified Match</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Stories CTA */}
        <div className="text-center mt-14">
          <Link
            to="/success-stories"
            className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold shadow-gold hover:shadow-gold-lg"
          >
            <span>Explore All Sri Lankan Love Stories</span>
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
