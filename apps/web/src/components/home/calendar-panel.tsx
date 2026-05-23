import { useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar.tsx'

interface CalendarPanelProps {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  mode?: 'upcoming' | 'archive'
}

function CalendarPanel({
  selected,
  onSelect,
  mode = 'upcoming',
}: CalendarPanelProps) {
  const bounds = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const startOfCurrentMonth = new Date(today)
    startOfCurrentMonth.setDate(1)

    const startOfCurrentYear = new Date(today.getFullYear(), 0, 1)

    const archiveEndMonth =
      yesterday.getTime() >= startOfCurrentYear.getTime()
        ? yesterday
        : startOfCurrentYear

    return {
      today,
      yesterday,
      startOfCurrentMonth,
      startOfCurrentYear,
      archiveEndMonth,
    }
  }, [])

  const isArchive = mode === 'archive'

  return (
    <div className="w-full rounded-sm bg-card border border-card-border overflow-hidden">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={
          isArchive
            ? [
                { before: bounds.startOfCurrentYear },
                { after: bounds.yesterday },
              ]
            : { before: bounds.today }
        }
        startMonth={
          isArchive ? bounds.startOfCurrentYear : bounds.startOfCurrentMonth
        }
        endMonth={isArchive ? bounds.archiveEndMonth : undefined}
        className="mx-auto bg-transparent p-2 [--cell-size:--spacing(8)]"
        classNames={{
          root: 'w-fit',
          month_caption:
            'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) bg-card-muted/60 rounded-sm',
          caption_label: 'select-none text-sm font-medium text-neutral-400',
          week: 'flex w-full mt-1',
          button_previous:
            'size-(--cell-size) p-0 select-none text-white hover:bg-card-hover hover:text-white aria-disabled:opacity-50 inline-flex items-center justify-center rounded-md [&_svg]:!text-white [&_svg]:!fill-white [&_svg]:!w-3 [&_svg]:!h-3',
          button_next:
            'size-(--cell-size) p-0 select-none text-white hover:bg-card-hover hover:text-white aria-disabled:opacity-50 inline-flex items-center justify-center rounded-md [&_svg]:!text-white [&_svg]:!fill-white [&_svg]:!w-3 [&_svg]:!h-3',
          today:
            'bg-card-hover text-neutral-200 rounded-md data-[selected=true]:rounded-none',
          disabled:
            '[&_button]:!text-neutral-500 [&_button]:!opacity-100 pointer-events-none',
        }}
      />
    </div>
  )
}

export default CalendarPanel
