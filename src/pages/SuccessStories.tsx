import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Sparkles,
  Star,
  MapPin,
  Calendar,
  Quote,
  ArrowRight,
  Upload,
  CheckCircle2,
  X,
  Send,
  Camera,
} from 'lucide-react'
import { useRegisterModal } from '@/context/RegisterModalContext'
import HeroBackgroundCarousel from '@/components/HeroBackgroundCarousel'
import FinalCTASection from '@/components/home/FinalCTASection'

interface Story {
  id: string
  couple: string
  location: string
  weddingDate: string
  category: string
  porondamScore: string
  image: string
  quote: string
  story: string
  profession: string
}

export default function SuccessStoriesPage() {
  const { openRegisterModal } = useRegisterModal()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Submit Story Form State
  const [groomName, setGroomName] = useState('')
  const [brideName, setBrideName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [weddingVenue, setWeddingVenue] = useState('')
  const [storyContent, setStoryContent] = useState('')

  const categories = [
    'All',
    'Kandyan Traditional',
    'Western & Southern',
    'Medical & Engineering',
    'Expat & Overseas',
  ]

  const stories: Story[] = [
    {
      id: '1',
      couple: 'Kasun & Dinithi',
      location: 'Cinnamon Grand, Colombo',
      weddingDate: 'January 2026',
      category: 'Medical & Engineering',
      porondamScore: '19 / 20 Porondams',
      image: '/sri_lankan_couple_story_1_1788162388721.jpg',
      profession: 'Software Architect & Medical Doctor',
      quote: 'Dehadak gave us a dignified, private platform where our parents could connect with complete trust. Finding someone with matching values made our journey truly effortless.',
      story: 'Dinithi was completing her medical internship in Colombo while Kasun was working as a lead software architect. Both families were looking for a genuine proposal that honored Sri Lankan Buddhist values. When Kasun sent an interest request on Dehadak, their horoscopes were matched within 24 hours with an outstanding 19/20 score. After four months of heartfelt family conversations, they celebrated their dream wedding at Cinnamon Grand Colombo.',
    },
    {
      id: '2',
      couple: 'Nuwan & Sachini',
      location: 'The Grand Kandyan, Kandy',
      weddingDate: 'November 2025',
      category: 'Kandyan Traditional',
      porondamScore: '18 / 20 Porondams',
      image: '/sri_lankan_couple_story_2_1788162400523.jpg',
      profession: 'Civil Engineer & University Lecturer',
      quote: 'After trying various avenues, Dehadak was the only platform that felt genuinely Sri Lankan, dignified, and authentic. Today we are celebrating our dream wedding.',
      story: 'Sachini and Nuwan both grew up in the Central Province with strong respect for Kandyan heritage. Their parents created their profiles on Dehadak seeking a traditional yet modern partner. From their first video call facilitated through Dehadak to the sacred Poruwa ceremony in Kandy, their journey blossomed into a lifetime of shared laughter and mutual respect.',
    },
    {
      id: '3',
      couple: 'Dhanushka & Chamari',
      location: 'Jetwing Lighthouse, Galle',
      weddingDate: 'August 2025',
      category: 'Western & Southern',
      porondamScore: '20 / 20 Porondams (Purna)',
      image: '/sri_lankan_couple_story_3_1788162422005.jpg',
      profession: 'Chartered Accountant & Corporate Lawyer',
      quote: 'The photo privacy and verified credentials made us feel safe from day one. We found our soulmate and best friend.',
      story: 'Chamari was working in legal advisory in Galle while Dhanushka was a senior finance manager in Colombo. Having busy professional lives, they appreciated Dehadak’s refined filters and privacy controls. Their astrological compatibility was a flawless 20/20 Purna Porondama. Surrounded by the serene southern ocean breeze, they tied the knot in front of 300 delighted family members.',
    },
    {
      id: '4',
      couple: 'Suresh & Sanduni',
      location: 'Dubai & Colombo',
      weddingDate: 'December 2025',
      category: 'Expat & Overseas',
      porondamScore: '18.5 / 20 Porondams',
      image: '/sri_lankan_wedding_hero_1788162365933.jpg',
      profession: 'Aviation Specialist & Marketing Director',
      quote: 'Being overseas in Dubai, finding a Sri Lankan partner who truly understands our culture was difficult until we joined Dehadak. Best decision of our lives.',
      story: 'Suresh was residing in Dubai and Sanduni was in Colombo preparing for her master’s abroad. Through Dehadak’s overseas filter, Suresh connected with Sanduni. Both families met in Sri Lanka during the holiday season and instantly bonded over shared traditions and aspirations.',
    },
  ]

  const filteredStories = selectedCategory === 'All'
    ? stories
    : stories.filter((s) => s.category === selectedCategory)

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitSuccess(true)
    setTimeout(() => {
      setSubmitSuccess(false)
      setModalOpen(false)
      setGroomName('')
      setBrideName('')
      setWeddingDate('')
      setWeddingVenue('')
      setStoryContent('')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C1412] selection:bg-[#E5A93C]/30">
      
      {/* 1. Hero Banner with Background Carousel */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1C1412] text-white">
        <HeroBackgroundCarousel
          slides={[
            { src: '/images/story-1.jpg', alt: 'Kasun & Dinithi - Kandyan Grand Wedding' },
            { src: '/images/story-2.jpg', alt: 'Pradeep & Hiruni - Beachfront Matrimonial Bliss' },
            { src: '/images/story-3.jpg', alt: 'Suresh & Sanduni - Expat Love Story' },
            { src: '/images/carousel-couple-2.jpg', alt: 'Authentic Sri Lankan Couples' },
            { src: '/images/carousel-couple-7.jpg', alt: 'Sacred Knot & Family Harmony' },
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
              <Heart className="w-4 h-4 text-[#F7D878] fill-current" />
              <span>Sri Lankan Love Stories</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight"
            >
              Two Hearts That Found Their <span className="text-gradient-gold">Forever Destiny</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-[#FAF6F0]/90 max-w-2xl mx-auto font-sans leading-relaxed"
            >
              Celebrate the authentic, heartwarming journeys of Sri Lankan couples who met, connected, and tied the sacred knot through Dehadak.
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
                <span>Write Your Own Love Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3.5 rounded-full text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-[#E5A93C]/40 transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                <Upload className="w-4 h-4 text-[#F7D878]" />
                <span>Share Your Story</span>
              </button>
            </motion.div>
          </div>
        </HeroBackgroundCarousel>
      </section>

      {/* 2. Key Numbers Ribbon */}
      <section className="bg-[#FAF6F0] py-10 border-b border-[#EADFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white rounded-2xl border border-[#EADFCF] shadow-xs">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#9B6B15]">1,200+</p>
              <p className="text-xs text-[#1C1412]/70 font-semibold mt-1">Weddings Celebrated</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#EADFCF] shadow-xs">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#9B6B15]">99.2%</p>
              <p className="text-xs text-[#1C1412]/70 font-semibold mt-1">Family Satisfaction</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#EADFCF] shadow-xs">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#9B6B15]">25 / 25</p>
              <p className="text-xs text-[#1C1412]/70 font-semibold mt-1">Districts Represented</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#EADFCF] shadow-xs">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#9B6B15]">15+ Countries</p>
              <p className="text-xs text-[#1C1412]/70 font-semibold mt-1">Global Sri Lankan Expats</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="flex items-center justify-center flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1C1412] text-[#F7D878] border border-[#E5A93C] shadow-md'
                  : 'bg-white text-[#1C1412]/75 hover:bg-[#F3ECE2] border border-[#EADFCF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Stories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-16">
          {filteredStories.map((item, idx) => {
            const isEven = idx % 2 === 1

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-stretch bg-white rounded-3xl overflow-hidden border border-[#EADFCF] shadow-xl hover:shadow-2xl transition-all`}
              >
                {/* Story Image */}
                <div className="w-full lg:w-1/2 relative min-h-[340px] sm:min-h-[420px]">
                  <img
                    src={item.image}
                    alt={item.couple}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
                  
                  {/* Floating Porondam Badge */}
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#1C1412]/90 backdrop-blur-md border border-[#E5A93C]/50 text-xs font-bold text-[#F7D878] flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>{item.porondamScore}</span>
                  </div>

                  {/* Floating Date Badge */}
                  <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white">
                    <h3 className="font-serif text-2xl font-bold">{item.couple}</h3>
                    <p className="text-xs text-[#F7D878] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </p>
                  </div>
                </div>

                {/* Story Text */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="hidden lg:flex items-center justify-between gap-4 mb-3">
                      <span className="px-3.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E5A93C]/30 text-xs font-bold text-[#9B6B15]">
                        {item.category}
                      </span>
                      <span className="text-xs text-[#1C1412]/60 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span>{item.weddingDate}</span>
                      </span>
                    </div>

                    <h3 className="hidden lg:block font-serif text-3xl font-bold text-[#1C1412] mb-1">
                      {item.couple}
                    </h3>
                    <p className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[#9B6B15] mb-4">
                      <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span>{item.location}</span> • <span>{item.profession}</span>
                    </p>

                    {/* Quote Box */}
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] relative my-4">
                      <Quote className="w-5 h-5 text-[#E5A93C]/40 absolute top-3 right-3" />
                      <p className="text-xs sm:text-sm font-serif italic text-[#1C1412]/90 leading-relaxed">
                        "{item.quote}"
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#1C1412]/75 leading-relaxed font-sans mt-3">
                      {item.story}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="text-xs font-bold text-[#1C1412] ml-2">Verified Wedding</span>
                    </div>

                    <button
                      onClick={openRegisterModal}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9B6B15] hover:text-[#1C1412] transition-colors"
                    >
                      <span>Find Your Match</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* 5. Submit Your Wedding Story Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5A93C]/40 z-10 p-6 sm:p-8 text-[#1C1412]"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-[#9B6B15]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1C1412]">
                      Share Your Story
                    </h3>
                    <p className="text-xs text-[#1C1412]/60 font-sans">
                      Inspire future couples on Dehadak
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                  <h4 className="font-serif text-xl font-bold text-[#1C1412]">
                    Thank You & Ayubowan!
                  </h4>
                  <p className="text-xs text-[#1C1412]/70 max-w-sm mx-auto">
                    Your beautiful story has been submitted for editorial review. We wish you both lifelong joy and harmony!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleStorySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1412] mb-1">
                        Groom's Name
                      </label>
                      <input
                        type="text"
                        required
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        placeholder="e.g. Kasun"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#E5A93C] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1C1412] mb-1">
                        Bride's Name
                      </label>
                      <input
                        type="text"
                        required
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        placeholder="e.g. Dinithi"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#E5A93C] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1412] mb-1">
                        Wedding Date
                      </label>
                      <input
                        type="date"
                        required
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#E5A93C] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1C1412] mb-1">
                        Wedding Venue / City
                      </label>
                      <input
                        type="text"
                        required
                        value={weddingVenue}
                        onChange={(e) => setWeddingVenue(e.target.value)}
                        placeholder="e.g. Kandy"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#E5A93C] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C1412] mb-1">
                      Your Story / Advice for Singles
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={storyContent}
                      onChange={(e) => setStoryContent(e.target.value)}
                      placeholder="Tell us how you connected on Dehadak and what made your journey special..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#E5A93C] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-[#1C1412]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Story</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Bottom Video Call to Action */}
      <FinalCTASection />

    </div>
  )
}
