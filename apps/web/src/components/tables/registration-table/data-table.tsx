'use client'

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Check, Clock, Settings2, X } from 'lucide-react'
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  VisibilityState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import AcceptUntilCapacityButton from '@/components/controlls/accept-unitll-capacity-button.tsx'

// Define a minimal interface for data that supports bulk actions
interface WithId {
  userId: string
}

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>
  data: Array<TData>
  onBulkStatusChange?: (userIds: Array<string>, newStatus: string) => void
  eventId: string
  title: string
  isAddingDisabled: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onBulkStatusChange,
  eventId,
  title,
  isAddingDisabled,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [wholeWord, setWholeWord] = useState(false)

  const customGlobalFilterFn = (
    row: Row<TData>,
    columnId: string,
    filterValue: string,
  ) => {
    const value = row.getValue(columnId)
    if (value == null) return false

    const stringValue = String(value).toLowerCase()
    const searchValue = filterValue.toLowerCase()

    if (wholeWord) {
      const regex = new RegExp(`\\b${searchValue}\\b`, 'i')
      return regex.test(stringValue)
    } else {
      return stringValue.includes(searchValue)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: customGlobalFilterFn,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length
  const hasSelection = selectedRowCount > 0

  const handleBulkAction = (status: string) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const ids = selectedRows.map(
      (row) => (row.original as unknown as WithId).userId,
    )

    if (onBulkStatusChange) {
      onBulkStatusChange(ids, status)
    }

    setRowSelection({})
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="relative flex-1 max-w-sm flex items-center gap-2">
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="h-8 text-sm"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={wholeWord ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setWholeWord(!wholeWord)}
                    aria-label="Toggle whole word search"
                    className="h-8 px-2"
                  >
                    <span className="font-semibold text-sm">W</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Whole word search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full md:max-w-fit justify-end">
          {hasSelection ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleBulkAction('accepted')}
                    className="cursor-pointer"
                  >
                    <Check className="mr-2 h-4 w-4 text-status-accepted" />
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkAction('rejected')}
                    className="cursor-pointer"
                  >
                    <X className="mr-2 h-4 w-4 text-status-rejected" />
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkAction('waitlist')}
                    className="cursor-pointer"
                  >
                    <Clock className="mr-2 h-4 w-4 text-status-waitlist" />
                    Waitlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <AcceptUntilCapacityButton
              eventId={eventId}
              title={title}
              disabled={isAddingDisabled}
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-50">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) total
        </div>
        {selectedRowCount > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedRowCount} Selected
          </div>
        )}
      </div>
    </div>
  )
}
