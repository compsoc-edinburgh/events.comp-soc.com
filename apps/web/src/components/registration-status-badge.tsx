import type { RegistrationStatus } from '@events.comp-soc.com/shared'
import type { BadgeProps } from '@/components/ui/badge.tsx'
import { Badge } from '@/components/ui/badge.tsx'

const statusConfig: Record<
  RegistrationStatus,
  { label: string; variant: NonNullable<BadgeProps['variant']> }
> = {
  pending: { label: 'Pending', variant: 'pending' },
  accepted: { label: 'Accepted', variant: 'accepted' },
  waitlist: { label: 'Waitlist', variant: 'waitlist' },
  rejected: { label: 'Rejected', variant: 'rejected' },
}

interface RegistrationStatusBadgeProps {
  status: RegistrationStatus
  size?: 'sm' | 'md'
}

export function RegistrationStatusBadge({
  status,
  size = 'md',
}: RegistrationStatusBadgeProps) {
  const { label, variant } = statusConfig[status]
  return (
    <Badge variant={variant} size={size === 'md' ? 'lg' : 'sm'}>
      {label}
    </Badge>
  )
}
