import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface CarouselSlide {
  src: string
  alt?: string
  badge?: string
  caption?: string
}

interface HeroBackgroundCarouselProps {
  slides: CarouselSlide[]
  intervalMs?: number
  overlayClassName?: string
  className?: string
  showControls?: boolean
  showIndicators?: boolean
  showParticles?: boolean
  children?: React.ReactNode
}

export default function HeroBackgroundCarousel({
  slides,
  intervalMs = 6000,
  overlayClassName = 'bg-gradient-to-b from-[#1C1412]/85 via-[#1C1412]/75 to-[#1C1412]/95',
  className = '',
  showControls = true,
  showIndicators = true,
  showParticles = true,
  children,
}: HeroBackgroundCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [slides.length, intervalMs])

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Floating Romantic Particles
  const particles = [
    { id: 1, left: '10%', delay: 0, duration: 7, size: 6 },
    { id: 2, left: '30%', delay: 2, duration: 8.5, size: 8 },
    { id: 3, left: '55%', delay: 1, duration: 6.5, size: 6 },
    { id: 4, left: '75%', delay: 3, duration: 9, size: 9 },
    { id: 5, left: '90%', delay: 1.5, duration: 7.5, size: 7 },
  ]

  return (
    <div className={`relative w-full min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Slides Crossfade with Ken Burns zoom effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentSlide].src}
              alt={slides[currentSlide].alt || `Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Dark Espresso & Gold Vignette Overlay */}
        <div className={`absolute inset-0 ${overlayClassName}`} />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1C1412]/40 to-[#1C1412] pointer-events-none" />

        {/* Floating Particles */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '-10%', opacity: [0, 0.4, 0] }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                style={{
                  left: p.left,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                className="absolute rounded-full bg-gradient-to-tr from-[#E5A93C] to-[#F7D878] blur-[0.5px]"
              />
            ))}
          </div>
        )}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full flex items-center justify-center pt-24 pb-16 lg:py-0">{children}</div>

      {/* Carousel Navigation Arrows */}
      {showControls && slides.length > 1 && (
        <div className="absolute inset-y-0 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 hover:bg-[#E5A93C] text-white/80 hover:text-[#1C1412] backdrop-blur-md border border-white/10 hover:border-[#E5A93C] flex items-center justify-center transition-all duration-300 transform -translate-y-2 hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 hover:bg-[#E5A93C] text-white/80 hover:text-[#1C1412] backdrop-blur-md border border-white/10 hover:border-[#E5A93C] flex items-center justify-center transition-all duration-300 transform -translate-y-2 hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Carousel Bottom Dots Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentSlide === idx
                  ? 'w-6 bg-gradient-to-r from-[#E5A93C] to-[#F7D878]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
