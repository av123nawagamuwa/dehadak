import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  Crop as CropIcon,
  Sparkles,
  Eye,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'

interface ImageCropModalProps {
  isOpen: boolean
  imageSrc: string | null
  onClose: () => void
  onSave: (croppedFile: File, croppedPreviewUrl: string) => void
  userName?: string
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onSave,
  userName = 'Your Profile',
}: ImageCropModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  // Transform states
  const [zoom, setZoom] = useState(1.0)
  const [rotation, setRotation] = useState(0) // 0, 90, 180, 270
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [guideMode, setGuideMode] = useState<'both' | 'circle' | 'card'>('both')

  // Live real-time preview data URL
  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null)

  // Drag & Touch interaction tracking
  const viewportRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const pinchStartDistRef = useRef<number | null>(null)
  const pinchStartZoomRef = useRef<number>(1.0)
  const imageElementRef = useRef<HTMLImageElement | null>(null)

  // Reset transforms whenever a new image source is supplied
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1.0)
      setRotation(0)
      setPan({ x: 0, y: 0 })
      setImageLoaded(false)
      setLoadError(null)
      setLivePreviewUrl(null)

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
        imageElementRef.current = img
        setImageLoaded(true)
      }
      img.onerror = () => {
        setLoadError('Failed to load image. Please select a valid JPG, PNG, or WEBP photo.')
      }
      img.src = imageSrc
    }
  }, [isOpen, imageSrc])

  // Prevent background body scrolling while crop editor is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Calculate scales and bounds
  const { renderW, renderH } = useMemo(() => {
    const swapped = rotation % 180 !== 0
    const w = swapped ? naturalSize.height : naturalSize.width
    const h = swapped ? naturalSize.width : naturalSize.height
    const viewportSize = 320 // Reference size of viewport container

    let scale = 1
    if (w > 0 && h > 0) {
      scale = Math.max(viewportSize / w, viewportSize / h)
    }

    return {
      isSwapped: swapped,
      imgW: w,
      imgH: h,
      baseScale: scale,
      renderW: naturalSize.width * scale * zoom,
      renderH: naturalSize.height * scale * zoom,
    }
  }, [naturalSize, rotation, zoom])

  // Clamp translation so user cannot drag the image completely out of frame
  const clampPan = useCallback(
    (newX: number, newY: number, currentZoom: number, currentRot: number) => {
      if (!naturalSize.width || !naturalSize.height) {
        return { x: newX, y: newY }
      }
      const viewportSize = viewportRef.current?.clientWidth || 320
      const swapped = currentRot % 180 !== 0
      const w = swapped ? naturalSize.height : naturalSize.width
      const h = swapped ? naturalSize.width : naturalSize.height

      const scale = Math.max(viewportSize / w, viewportSize / h)
      const visualW = w * scale * currentZoom
      const visualH = h * scale * currentZoom

      const maxPanX = Math.max(0, (visualW - viewportSize) / 2)
      const maxPanY = Math.max(0, (visualH - viewportSize) / 2)

      // Generous buffer so user has full freedom to center their chin & space above head
      const buffer = 60
      const clampedX = Math.max(-maxPanX - buffer, Math.min(maxPanX + buffer, newX))
      const clampedY = Math.max(-maxPanY - buffer, Math.min(maxPanY + buffer, newY))

      return { x: clampedX, y: clampedY }
    },
    [naturalSize]
  )

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    panStartRef.current = { ...pan }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      const nextX = panStartRef.current.x + dx
      const nextY = panStartRef.current.y + dy
      setPan(clampPan(nextX, nextY, zoom, rotation))
    },
    [clampPan, zoom, rotation]
  )

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // Attach native non-passive touch listeners to viewportRef for ultra-smooth mobile & PWA gestures
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        panStartRef.current = { ...pan }
        pinchStartDistRef.current = null
      } else if (e.touches.length === 2) {
        isDraggingRef.current = false
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        pinchStartDistRef.current = dist
        pinchStartZoomRef.current = zoom
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      // Prevent browser default pull-to-refresh or page scroll on iOS Safari and Android Chrome
      e.preventDefault()

      if (e.touches.length === 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - dragStartRef.current.x
        const dy = e.touches[0].clientY - dragStartRef.current.y
        const nextX = panStartRef.current.x + dx
        const nextY = panStartRef.current.y + dy
        setPan(clampPan(nextX, nextY, zoom, rotation))
      } else if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const factor = currentDist / pinchStartDistRef.current
        const newZoom = Math.min(3.5, Math.max(0.8, pinchStartZoomRef.current * factor))
        setZoom(newZoom)
        setPan((prev) => clampPan(prev.x, prev.y, newZoom, rotation))
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isDraggingRef.current = false
        pinchStartDistRef.current = null
      } else if (e.touches.length === 1) {
        // Returned to single finger
        isDraggingRef.current = true
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        panStartRef.current = { ...pan }
        pinchStartDistRef.current = null
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: false })
    el.addEventListener('touchcancel', onTouchEnd, { passive: false })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [pan, zoom, rotation, clampPan])

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY * -0.002
    const nextZoom = Math.min(3.5, Math.max(0.8, zoom + delta))
    setZoom(nextZoom)
    setPan((prev) => clampPan(prev.x, prev.y, nextZoom, rotation))
  }

  // Rotate 90 degrees
  const handleRotate = (clockwise = true) => {
    setRotation((prev) => (clockwise ? (prev + 90) % 360 : (prev + 270) % 360))
    setPan({ x: 0, y: 0 })
  }

  // Reset to default
  const handleReset = () => {
    setZoom(1.0)
    setRotation(0)
    setPan({ x: 0, y: 0 })
  }

  // Generate cropped output canvas with 1080x1080 high-res output
  const generateCroppedCanvas = useCallback((): HTMLCanvasElement | null => {
    if (!imageElementRef.current || !naturalSize.width || !naturalSize.height) {
      return null
    }

    const img = imageElementRef.current
    const viewportSize = viewportRef.current?.clientWidth || 320
    const outputSize = 1080 // High-resolution export for ultra-crisp faces across all screens

    const canvas = document.createElement('canvas')
    canvas.width = outputSize
    canvas.height = outputSize
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // High quality bicubic interpolation
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Clean background
    ctx.fillStyle = '#FAF7F0'
    ctx.fillRect(0, 0, outputSize, outputSize)

    // Calculate mapping between viewport and output canvas
    const scaleFactor = outputSize / viewportSize

    ctx.save()
    // Move to canvas center
    ctx.translate(outputSize / 2, outputSize / 2)

    // Apply pan translated to output resolution
    ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor)

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180)

    // Calculate scale identical to on-screen CSS
    const swapped = rotation % 180 !== 0
    const w = swapped ? naturalSize.height : naturalSize.width
    const h = swapped ? naturalSize.width : naturalSize.height
    const currentBaseScale = Math.max(viewportSize / w, viewportSize / h)

    const drawW = naturalSize.width * currentBaseScale * zoom * scaleFactor
    const drawH = naturalSize.height * currentBaseScale * zoom * scaleFactor

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
    ctx.restore()

    return canvas
  }, [naturalSize, pan, rotation, zoom])

  // Update live preview thumbnail whenever adjustments change
  useEffect(() => {
    if (!imageLoaded) return
    const timer = setTimeout(() => {
      const canvas = generateCroppedCanvas()
      if (canvas) {
        setLivePreviewUrl(canvas.toDataURL('image/jpeg', 0.85))
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [imageLoaded, pan, zoom, rotation, generateCroppedCanvas])

  // Handle Save Photo
  const handleSave = () => {
    const canvas = generateCroppedCanvas()
    if (!canvas) {
      alert('Unable to process photo crop. Please try selecting the photo again.')
      return
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert('Crop rendering error.')
          return
        }
        const croppedFile = new File([blob], `profile-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        })
        const previewUrl = canvas.toDataURL('image/jpeg', 0.92)
        onSave(croppedFile, previewUrl)
        onClose()
      },
      'image/jpeg',
      0.92
    )
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-[#FAF7F0] border border-[#E5A93C]/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[95vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#1C1412] text-white border-b border-[#E5A93C]/30 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center text-[#F5C768]">
                <CropIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
                  Adjust Profile Photo
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Cancel and close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
            {loadError ? (
              <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-200">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-500" />
                <p className="font-semibold text-sm">{loadError}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 px-4 py-2 rounded-xl bg-white border border-red-300 text-xs font-bold text-red-700 hover:bg-red-50"
                >
                  Close & Choose Another Photo
                </button>
              </div>
            ) : (
              <>
                {/* Framing Guidance & Guide Selectors */}
                <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] text-xs text-[#1C1412]/80">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E5A93C] shrink-0" />
                    <span className="text-[11px] sm:text-xs font-medium">
                      Drag to frame your face. Leave room above the head.
                    </span>
                  </div>
                  {/* Guide Toggle */}
                  <div className="flex items-center gap-1 shrink-0 bg-white p-0.5 rounded-lg border border-[#EADFCF]">
                    <button
                      type="button"
                      onClick={() => setGuideMode('both')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        guideMode === 'both' ? 'bg-[#E5A93C] text-[#1C1412]' : 'text-gray-500 hover:text-[#1C1412]'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuideMode('circle')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        guideMode === 'circle' ? 'bg-[#E5A93C] text-[#1C1412]' : 'text-gray-500 hover:text-[#1C1412]'
                      }`}
                    >
                      Avatar
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuideMode('card')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        guideMode === 'card' ? 'bg-[#E5A93C] text-[#1C1412]' : 'text-gray-500 hover:text-[#1C1412]'
                      }`}
                    >
                      Card
                    </button>
                  </div>
                </div>

                {/* Main Interactive Crop Area */}
                <div className="flex flex-col items-center justify-center">
                  <div
                    ref={viewportRef}
                    onMouseDown={handleMouseDown}
                    onWheel={handleWheel}
                    className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden bg-[#1C1412] shadow-inner cursor-grab active:cursor-grabbing select-none border-2 border-[#E5A93C]/60"
                    style={{ touchAction: 'none' }}
                  >
                    {/* Rendered Transformable Image */}
                    {imageLoaded && (
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{
                          transform: `translate(${pan.x}px, ${pan.y}px)`,
                          transition: isDraggingRef.current ? 'none' : 'transform 0.05s ease-out',
                        }}
                      >
                        <img
                          src={imageSrc || ''}
                          alt="Crop Target"
                          className="max-w-none pointer-events-none"
                          style={{
                            width: `${renderW}px`,
                            height: `${renderH}px`,
                            transform: `rotate(${rotation}deg)`,
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    )}

                    {/* Framing Overlay Guide */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <mask id="dehadakCropMask">
                            <rect width="100" height="100" fill="white" />
                            {/* Circle Avatar Cutout */}
                            {(guideMode === 'circle' || guideMode === 'both') && (
                              <circle cx="50" cy="50" r="42" fill="black" />
                            )}
                            {/* Rectangular Profile Card Cutout (matches 4:5 aspect ratio) */}
                            {guideMode === 'card' && (
                              <rect x="12" y="6" width="76" height="88" rx="6" fill="black" />
                            )}
                          </mask>
                        </defs>

                        {/* Dark Vignette outside guide */}
                        <rect
                          width="100"
                          height="100"
                          fill="rgba(28, 20, 18, 0.65)"
                          mask="url(#dehadakCropMask)"
                        />

                        {/* Circular Avatar Guide Outline */}
                        {(guideMode === 'circle' || guideMode === 'both') && (
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="#E5A93C"
                            strokeWidth="0.8"
                            strokeDasharray="2.5, 1.5"
                          />
                        )}

                        {/* Rectangular Profile Card Guide Outline */}
                        {(guideMode === 'card' || guideMode === 'both') && (
                          <rect
                            x="12"
                            y="6"
                            width="76"
                            height="88"
                            rx="6"
                            fill="none"
                            stroke={guideMode === 'both' ? 'rgba(255, 255, 255, 0.45)' : '#E5A93C'}
                            strokeWidth="0.6"
                          />
                        )}

                        {/* Subtle Center / Head Reference Crosshairs */}
                        <line x1="50" y1="46" x2="50" y2="54" stroke="rgba(229, 169, 60, 0.45)" strokeWidth="0.5" />
                        <line x1="46" y1="50" x2="54" y2="50" stroke="rgba(229, 169, 60, 0.45)" strokeWidth="0.5" />
                      </svg>
                    </div>

                    {/* Touch / Pinch prompt indicator */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white/75 text-[10px] pointer-events-none">
                      Drag to position • Pinch to zoom
                    </div>
                  </div>
                </div>

                {/* Facebook-style Zoom Slider & Rotation Bar */}
                <div className="bg-white rounded-2xl p-3 border border-[#EADFCF] space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const newZoom = Math.max(0.8, zoom - 0.15)
                        setZoom(newZoom)
                        setPan((prev) => clampPan(prev.x, prev.y, newZoom, rotation))
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#1C1412] hover:bg-[#FAF6F0] transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>

                    <input
                      type="range"
                      min="0.8"
                      max="3.0"
                      step="0.01"
                      value={zoom}
                      onChange={(e) => {
                        const newZoom = parseFloat(e.target.value)
                        setZoom(newZoom)
                        setPan((prev) => clampPan(prev.x, prev.y, newZoom, rotation))
                      }}
                      className="flex-1 accent-[#E5A93C] h-2 bg-gray-200 rounded-lg cursor-pointer"
                      aria-label="Zoom level"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const newZoom = Math.min(3.0, zoom + 0.15)
                        setZoom(newZoom)
                        setPan((prev) => clampPan(prev.x, prev.y, newZoom, rotation))
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#1C1412] hover:bg-[#FAF6F0] transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-gray-200" />

                    {/* Rotate button */}
                    <button
                      type="button"
                      onClick={() => handleRotate(true)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#1C1412] hover:bg-[#FAF6F0] transition-colors"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    {/* Reset button */}
                    <button
                      type="button"
                      onClick={handleReset}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#1C1412] hover:bg-[#FAF6F0] transition-colors"
                      title="Reset Position & Zoom"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Live Real-World Previews (Dual Avatar & Card Preview) */}
                {livePreviewUrl && (
                  <div className="bg-white rounded-2xl p-3 border border-[#EADFCF] space-y-2">
                    <p className="text-[11px] font-bold text-[#1C1412]/80 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span>Live Preview (How others see you)</span>
                    </p>

                    <div className="flex items-center justify-around gap-4 pt-1">
                      {/* 1. Circular Avatar Preview */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#E5A93C] shadow-sm bg-[#FAF7F0]">
                          <img src={livePreviewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-medium text-[#1C1412]/60">Circular Avatar</span>
                      </div>

                      {/* 2. Rectangular Profile Card Preview */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="relative w-20 h-24 sm:w-22 sm:h-28 rounded-xl overflow-hidden border border-[#EADFCF] shadow-xs bg-[#1C1412] flex flex-col justify-end">
                          <img src={livePreviewUrl} alt="Card preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="relative p-1.5 text-[9px] text-white font-bold truncate flex items-center gap-1">
                            <span className="truncate">{userName}</span>
                            <ShieldCheck className="w-2.5 h-2.5 text-[#E5A93C] shrink-0" />
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-[#1C1412]/60">Search Card</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Controls */}
          <div className="px-5 py-3.5 bg-white border-t border-[#EADFCF] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 hover:border-gray-400 text-xs font-semibold text-[#1C1412] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!imageLoaded || Boolean(loadError)}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Photo</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
