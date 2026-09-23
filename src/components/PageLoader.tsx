import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function PageLoader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [canEnter, setCanEnter] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Show "Click anywhere to enter" after 1.8 seconds
    const enterTimer = setTimeout(() => {
      setCanEnter(true)
    }, 1800)

    // Smooth, calm progression over ~4.5 seconds (matching the 4.45s video duration)
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.duration) {
        const vid = videoRef.current
        const percent = Math.min(100, Math.round((vid.currentTime / vid.duration) * 100))
        setProgress((prev) => Math.max(prev, percent))
      } else {
        // Fallback smooth incremental counter (~4.5s total)
        setProgress((prev) => {
          if (prev >= 100) return 100
          const increment = prev < 80 ? 1.1 : 0.8
          return Math.min(100, Math.round(prev + increment))
        })
      }
    }, 50)

    return () => {
      clearTimeout(enterTimer)
      clearInterval(interval)
    }
  }, [])

  // When progress reaches 100, automatically fade out smoothly after a brief pause
  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setLoading(false)
      }, 450)
      return () => clearTimeout(exitTimer)
    }
  }, [progress])

  // Sync when video ends
  const handleVideoEnded = () => {
    setProgress(100)
  }

  // Click anywhere to skip instantly with smooth fade-out
  const handleSkip = () => {
    setProgress(100)
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleSkip}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0304] text-[#FAF6F0] overflow-hidden select-none cursor-pointer px-4"
        >
          {/* Ambient Royal Gold Radial Glow Background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(229, 169, 60, 0.15) 0%, rgba(19, 7, 6, 0.88) 55%, rgba(13, 3, 4, 0.98) 90%)',
            }}
          />

          {/* Decorative soft blurred ambient golden spheres */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E5A93C]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9B6B15]/12 rounded-full blur-3xl pointer-events-none" />

          {/* Center Content Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center text-center max-w-lg w-full"
          >
            {/* Square Video Container (Inspired by Only Kithul) */}
            <div className="relative w-[280px] sm:w-[360px] md:w-[410px] aspect-square overflow-hidden rounded-[28px] sm:rounded-[36px] mb-6 shadow-[0_0_60px_rgba(229,169,60,0.22),0_25px_50px_rgba(0,0,0,0.85)] bg-black border border-[#E5A93C]/40">
              {/* Subtle top gold shimmer line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#F7D878] to-transparent z-10 opacity-80" />

              {/* Video Player cropped to square */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover object-center pointer-events-none scale-105"
              >
                <source src="/videos/page-loader.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Glowing Golden Progress Bar */}
            <div className="w-60 sm:w-72 md:w-80 h-[2.5px] bg-white/15 rounded-full overflow-hidden relative mb-3 backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-[#F7D878] via-[#E5A93C] to-[#9B6B15] shadow-[0_0_15px_rgba(229,169,60,0.95)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              />
            </div>

            {/* Subtitle & Live Percentage Row */}
            <div className="flex items-center justify-between w-60 sm:w-72 md:w-80 text-[10px] sm:text-[11px] font-sans tracking-widest text-[#FAF6F0]/80 uppercase">
              <span className="text-[#F7D878] font-medium tracking-[0.2em] truncate flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#F7D878] shrink-0 inline" />
                <span>Sri Lankan Royal Matrimony</span>
              </span>
              <span className="font-mono font-bold text-[#F7D878] shrink-0 text-xs">
                {progress}%
              </span>
            </div>

            {/* Brand Signature Divider */}
            <div className="mt-4 flex items-center gap-2.5 text-[9px] sm:text-[10px] font-sans tracking-[0.3em] text-[#F7D878]/85 uppercase font-medium">
              <span className="w-5 sm:w-7 h-px bg-[#E5A93C]/40" />
              <span>Dehadak • Two Hearts, One Journey</span>
              <span className="w-5 sm:w-7 h-px bg-[#E5A93C]/40" />
            </div>
          </motion.div>

          {/* Bottom "Click anywhere to enter" CTA */}
          <AnimatePresence>
            {canEnter && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-7 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#FAF6F0]/50 font-sans hover:text-[#F7D878] transition-colors animate-pulse"
              >
                Click anywhere to enter
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
