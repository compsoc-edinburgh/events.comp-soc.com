import { createFileRoute } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getColumns } from '@/components/tables/registration-table/columns.tsx'
import Window from '@/components/layout/window/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import { eventQueryOption } from '@/lib/data/event.ts'
import RegistrationByStatus from '@/components/charts/registrations-by-status-chart.tsx'
import RegistrationsByDateChart from '@/components/charts/registrations-by-date-chart.tsx'
import { SelectAnalyticsBarChart } from '@/components/charts/form-select-chart.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { DataTable } from '@/components/tables/registration-table/data-table.tsx'
import {
  registrationAnalyticsQueryOption,
  registrationQueryOption,
} from '@/lib/data/registration.ts'
import { useUpdateRegistration } from '@/lib/hooks/registrations/use-update-registration.tsx'
import { useBatchUpdateRegistrations } from '@/lib/hooks/registrations/use-batch-update-registrations.tsx'

export const Route = createFileRoute('/events/$eventId/analytics')({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(eventQueryOption(params.eventId)),
      context.queryClient.ensureQueryData(
        registrationQueryOption(params.eventId),
      ),
      context.queryClient.ensureQueryData(
        registrationAnalyticsQueryOption(params.eventId),
      ),
    ])
  },
  component: AnalyticsRoute,
})

function AnalyticsRoute() {
  const { eventId } = Route.useParams()

  const { data: event } = useSuspenseQuery(eventQueryOption(eventId))
  const { data: registrations } = useSuspenseQuery(
    registrationQueryOption(eventId),
  )
  const { data: analytics } = useSuspenseQuery(
    registrationAnalyticsQueryOption(eventId),
  )

  const { updateRegistration, isUpdating } = useUpdateRegistration(
    eventId,
    event.title,
  )
  const { batchUpdate, isBatchUpdating } = useBatchUpdateRegistrations(
    eventId,
    event.title,
  )

  const isAcceptanceDisabled =
    event.capacity == analytics.countByStatus['accepted'] ||
    event.capacity === null

  const columns = getColumns(event.form ?? [], (id, newStatus) => {
    updateRegistration({
      status: newStatus,
      userId: id,
    })
  })
  return (
    <ProtectedRoute activeTab="/events">
      <Window activeTab="/events">
        <Sheet>
          <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
            Event Analytics
          </div>
          <div>
            <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
              <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
              Analytics for {event.title}
            </div>
          </div>

          <Separator className="my-5" />

          <div className="flex flex-col gap-5">
            <RegistrationByStatus
              data={analytics.countByStatus}
              totalCount={analytics.totalCount}
            />
            <RegistrationsByDateChart data={analytics.countByDate} />
          </div>

          <div className="my-5">
            <div className="text-base text-neutral-400">Form breakdown</div>
            <Separator className="mb-5" />
            <div className="flex flex-col gap-5">
              {Object.entries(analytics.countByAnswers).map(
                ([id, answerData]) => (
                  <SelectAnalyticsBarChart
                    key={id}
                    title={answerData.label}
                    data={answerData.data}
                  />
                ),
              )}

              {Object.keys(analytics.countByAnswers).length === 0 && (
                <div className="col-span-full py-10 text-center text-neutral-500 border border-dashed rounded-lg border-neutral-800">
                  No multiple-choice questions found in this event form.
                </div>
              )}
            </div>
          </div>

          <div className="my-5">
            <div className="text-base text-neutral-400">Registrations</div>
            <Separator className="mb-5" />
            <DataTable
              columns={columns}
              data={registrations}
              isAddingDisabled={isAcceptanceDisabled}
              eventId={eventId}
              title={event.title}
              isActionsDisabled={isUpdating || isBatchUpdating}
              onBulkStatusChange={(userIds, newStatus) => {
                batchUpdate({
                  data: {
                    userIds,
                    status: newStatus,
                  },
                })
              }}
            />
          </div>
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
