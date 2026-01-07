import React from 'react'
import type { Registration } from '@events.comp-soc.com/shared'
import { formatEventDate } from '@/lib/utils.ts'
import { RegistrationStatusBadge } from '@/components/registration-status-badge.tsx'

interface RegistrationBlockProps {
  registration: Registration
}

export const RegistrationBlock: React.FC<RegistrationBlockProps> = ({
  registration,
}) => {
  const { full: date } = formatEventDate(registration.createdAt)

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 mb-6 my-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm md:text-md font-medium text-nutral-400">
            Your Registration
          </h3>
          <span className="text-xs md:text-sm text-neutral-500">
            Registered {date}
          </span>
        </div>
        <div className="flex flex-col items-end gap-2 min-w-fit">
          <RegistrationStatusBadge status={registration.status} />
        </div>
      </div>
    </div>
  )
}
