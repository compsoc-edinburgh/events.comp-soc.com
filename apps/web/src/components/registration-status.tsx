import { RegistrationStatus } from '@events.comp-soc.com/shared'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'

/** Human-readable label for each registration status. */
export const STATUS_LABEL: Record<RegistrationStatus, string> = {
  [RegistrationStatus.Accepted]: 'Accepted',
  [RegistrationStatus.Pending]: 'Pending',
  [RegistrationStatus.Waitlist]: 'Waitlist',
  [RegistrationStatus.Rejected]: 'Rejected',
}

/** Tailwind background class for the small colored dot. */
export const STATUS_DOT_CLASS: Record<RegistrationStatus, string> = {
  [RegistrationStatus.Accepted]: 'bg-status-accepted',
  [RegistrationStatus.Pending]: 'bg-status-pending',
  [RegistrationStatus.Waitlist]: 'bg-status-waitlist',
  [RegistrationStatus.Rejected]: 'bg-status-rejected',
}

interface RegistrationStatusDotProps extends ComponentProps<'span'> {
  status: RegistrationStatus
}

/** A small colored dot — for use in lists, card meta rows, etc. */
export function RegistrationStatusDot({
  status,
  className,
  ...props
}: RegistrationStatusDotProps) {
  return (
    <span
      aria-label={STATUS_LABEL[status]}
      className={cn(
        'w-2 h-2 rounded-full shrink-0',
        STATUS_DOT_CLASS[status],
        className,
      )}
      {...props}
    />
  )
}

export { RegistrationStatusBadge } from './registration-status-badge.tsx'
