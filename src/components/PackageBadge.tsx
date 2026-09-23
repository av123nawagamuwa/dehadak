import { Crown, Sparkles, Compass } from 'lucide-react'

export type PackageCode = 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM' | string

interface PackageBadgeProps {
  code?: PackageCode
  name?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function PackageBadge({
  code = 'FREE',
  name,
  className = '',
  size = 'md',
}: PackageBadgeProps) {
  const normalizedCode = (code || 'FREE').toUpperCase()

  const displayName = name || (
    normalizedCode === 'PLATINUM' ? 'Royal Platinum' :
    normalizedCode === 'GOLD' ? 'Gold VIP' :
    normalizedCode === 'SILVER' ? 'Silver Match' :
    'Free Explorer'
  )

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2',
  }[size]

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }[size]

  // Distinct elegant styles
  let badgeStyle = ''
  let Icon = Compass

  switch (normalizedCode) {
    case 'PLATINUM':
      // Dark Luxury Obsidian & Platinum style with silver-white glow
      badgeStyle = 'bg-gradient-to-r from-[#171312] via-[#2A2321] to-[#171312] text-[#F3F4F6] border border-[#E5E7EB]/40 shadow-md ring-1 ring-white/10'
      Icon = Crown
      break
    case 'GOLD':
      // Rich metallic Gold gradient
      badgeStyle = 'bg-gradient-to-r from-[#F6D565] via-[#E5A93C] to-[#C99726] text-[#1C1412] font-extrabold shadow-gold border border-[#F3D77A]/50'
      Icon = Crown
      break
    case 'SILVER':
      // Refined Silver gradient with soft metallic sheen
      badgeStyle = 'bg-gradient-to-r from-[#F1F5F9] via-[#CBD5E1] to-[#94A3B8] text-[#1E293B] font-bold shadow-sm border border-[#94A3B8]/40'
      Icon = Sparkles
      break
    case 'FREE':
    default:
      // Soft neutral/slate-grey styling
      badgeStyle = 'bg-[#FAF7F0] text-[#5C4B47] border border-[#D6C7B2] font-semibold shadow-xs'
      Icon = Compass
      break
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-sans tracking-wide backdrop-blur-sm transition-all select-none ${sizeClasses} ${badgeStyle} ${className}`}
      title={`Member Subscription: ${displayName}`}
    >
      <Icon className={`${iconSizes} shrink-0`} />
      <span className="truncate">{displayName}</span>
    </span>
  )
}
