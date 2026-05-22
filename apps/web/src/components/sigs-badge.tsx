import type { Sigs } from '@events.comp-soc.com/shared'
import { Badge } from '@/components/ui/badge.tsx'
import { getSigById, getSigColors } from '@/config/sigs.ts'

interface SigBadgeProps {
  sig: Sigs
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// SIG names aren't uppercased and use a slightly different scale than the
// other status badges, so we override Badge's variant classes per-size here.
const sizeOverrides = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-sm',
} as const

const logoSize = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5 sm:h-4 sm:w-4',
  lg: 'h-4 w-4 sm:h-5 sm:w-5',
} as const

export const SigBadge = ({
  sig,
  size = 'md',
  className = '',
}: SigBadgeProps) => {
  const colors = getSigColors(sig)
  const info = getSigById(sig)

  return (
    <Badge
      className={`font-medium normal-case tracking-normal ${sizeOverrides[size]} ${className}`}
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      <img
        src={info?.logo}
        alt={`${info?.name} logo`}
        className={`${logoSize[size]} object-contain shrink-0`}
      />
      <span className="truncate">{info?.name}</span>
    </Badge>
  )
}
