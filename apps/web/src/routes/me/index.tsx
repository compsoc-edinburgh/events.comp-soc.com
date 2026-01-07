import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { userRegistrationQueryOption } from '@/lib/data/users.ts'
import Window from '@/components/layout/window/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import { RegistrationCard } from '@/components/registration-card.tsx'

export const Route = createFileRoute('/me/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(userRegistrationQueryOption())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: registrations } = useSuspenseQuery(
    userRegistrationQueryOption(),
  )

  console.log(registrations)

  return (
    <ProtectedRoute activeTab="/me">
      <Window activeTab="/me">
        <Sheet>
          <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
            My events
          </div>

          <Separator className="mt-2 mb-5" />

          <div className="bg-neutral-900/50 p-3 sm:p-4 rounded border-neutral-800 border text-neutral-400 text-xs sm:text-sm leading-relaxed">
            <span className="text-neutral-200 font-medium">Your schedule.</span>{' '}
            Manage your event sign-ups and track your status.
          </div>

          {registrations !== null && registrations.length === 0 && (
            <div className="h-[62vh] md:h-[57vh] flex items-center justify-center">
              <div className="text-xl font-bold text-neutral-700 pb-32">
                Nothing Found
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-4">
            {registrations !== null &&
              registrations.length > 0 &&
              registrations.map((registration) => (
                <RegistrationCard
                  key={registration.eventId}
                  registration={registration}
                />
              ))}
          </div>
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
