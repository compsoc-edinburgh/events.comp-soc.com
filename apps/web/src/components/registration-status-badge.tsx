import React from 'react'
import type { RegistrationStatus } from '@events.comp-soc.com/shared'

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-950 text-yellow-400 border-yellow-800',
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-green-950 text-green-400 border-green-800',
  },
  waitlist: {
    label: 'Waitlist',
    className: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-950 text-red-400 border-red-800',
  },
}

interface StatusBadgeProps {
  status: RegistrationStatus
  size?: 'sm' | 'md'
}

export const RegistrationStatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const config = statusConfig[status]

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider',
    md: 'text-sm md:text-base px-6.5 py-2 rounded-md',
  }

  return (
    <span
      className={`inline-flex items-center font-bold border transition-colors ${sizeClasses[size]} ${config.className}`}
    >
      {config.label}
    </span>
  )
}
