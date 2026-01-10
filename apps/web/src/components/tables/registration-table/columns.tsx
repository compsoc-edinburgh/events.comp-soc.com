'use client'

import { Check, Clock, MoreHorizontal, X } from 'lucide-react'
import type {
  CustomField,
  Registration,
  RegistrationStatus,
} from '@events.comp-soc.com/shared'
import type { ColumnDef } from '@tanstack/react-table'
import { RegistrationStatusBadge } from '@/components/registration-status-badge.tsx'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function getColumns(
  questions: Array<CustomField>,
  onStatusChange?: (id: string, newStatus: RegistrationStatus) => void,
): Array<ColumnDef<Registration>> {
  const checkboxColumn: ColumnDef<Registration> = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mr-5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mr-5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }

  const staticColumns: Array<ColumnDef<Registration>> = [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status')
        return (
          <RegistrationStatusBadge
            status={status as RegistrationStatus}
            size="sm"
          />
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'firstName',
      header: 'First name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last name',
    },
  ]

  const dynamicColumns: Array<ColumnDef<Registration>> = questions.map(
    (question) => ({
      id: question.id,
      header: question.label,
      accessorFn: (row) => {
        const answer = row.answers[question.id]
        if (Array.isArray(answer)) {
          return answer.join(', ')
        }
        return answer
      },
    }),
  )

  const actionsColumn: ColumnDef<Registration> = {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const registration = row.original
      const currentStatus = registration.status

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onStatusChange?.(registration.userId, 'accepted')}
              disabled={currentStatus === 'accepted'}
              className="cursor-pointer"
            >
              <Check className="mr-2 h-4 w-4 text-status-accepted" />
              Accept
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange?.(registration.userId, 'rejected')}
              disabled={currentStatus === 'rejected'}
              className="cursor-pointer"
            >
              <X className="mr-2 h-4 w-4 text-status-rejected" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange?.(registration.userId, 'waitlist')}
              disabled={currentStatus === 'waitlist'}
              className="cursor-pointer"
            >
              <Clock className="mr-2 h-4 w-4 text-status-waitlist" />
              Waitlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }

  return [checkboxColumn, ...staticColumns, ...dynamicColumns, actionsColumn]
}
