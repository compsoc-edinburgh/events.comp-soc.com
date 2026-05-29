import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Registration } from '@events.comp-soc.com/shared'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  RegistrationStatusDot,
  STATUS_LABEL,
} from '@/components/registration-status.tsx'
import { formatEventDate } from '@/lib/utils.ts'

const PREVIEW_COUNT = 5

interface MyEventsListProps {
  registrations: ReadonlyArray<Registration>
  isSignedIn: boolean
  isPending: boolean
}

function MyEventsList({
  registrations,
  isSignedIn,
  isPending,
}: MyEventsListProps) {
  const [expanded, setExpanded] = useState(false)

  if (isSignedIn && isPending) {
    return (
      <div className="mt-6">
        <h2 className="text-lg text-neutral-500 mb-3">Your events</h2>
        <div className="flex flex-col gap-1">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-13.5 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (registrations.length === 0) return null

  const visible = expanded
    ? registrations
    : registrations.slice(0, PREVIEW_COUNT)

  return (
    <div className="mt-6">
      <h2 className="text-lg text-neutral-500 mb-3">Your events</h2>
      <ul className="flex flex-col gap-1">
        {visible.map((reg) => {
          const { full: when } = formatEventDate(reg.eventDate)
          return (
            <li key={reg.eventId}>
              <Link
                to="/events/$eventId"
                params={{ eventId: reg.eventId }}
                className="flex flex-col gap-0.5 px-2.5 py-2 rounded-sm hover:bg-card transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <RegistrationStatusDot status={reg.status} />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      {STATUS_LABEL[reg.status]}
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-[15px] text-neutral-200 truncate">
                    {reg.eventTitle ?? 'Untitled event'}
                  </span>
                </div>
                <span className="text-sm text-neutral-500 pl-4">{when}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      {registrations.length > PREVIEW_COUNT && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 justify-start w-full text-xs text-neutral-500 hover:text-neutral-200"
        >
          {expanded ? 'Show less' : `Show all (${registrations.length})`}
        </Button>
      )}
    </div>
  )
}

export default MyEventsList
