import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

export type EventsTab = 'upcoming' | 'drafts' | 'archive'

interface UpcomingTabsProps {
  value: EventsTab
  onChange: (value: EventsTab) => void
  canManageEvents: boolean
  isAuthLoaded: boolean
}

function UpcomingTabs({
  value,
  onChange,
  canManageEvents,
  isAuthLoaded,
}: UpcomingTabsProps) {
  // While we don't know yet if the user is committee, render a placeholder so
  // the Drafts tab doesn't pop in after the rest of the strip has rendered.
  if (!isAuthLoaded) {
    return <Skeleton className="mt-4 h-9 w-full" />
  }

  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as EventsTab)}
      className="mt-4"
    >
      <TabsList className="w-full">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        {canManageEvents && <TabsTrigger value="drafts">Drafts</TabsTrigger>}
        <TabsTrigger value="archive">Archive</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default UpcomingTabs
