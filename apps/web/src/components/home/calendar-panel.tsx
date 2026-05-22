import { Calendar } from '@/components/ui/calendar.tsx'

interface CalendarPanelProps {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
}

function CalendarPanel({ selected, onSelect }: CalendarPanelProps) {
  return (
    <div className="w-full rounded-sm bg-card border border-card-border overflow-hidden">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
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
        }}
      />
    </div>
  )
}

export default CalendarPanel
