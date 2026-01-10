import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { RegistrationUpdateStatusBatch } from '@events.comp-soc.com/shared'
import { batchUpdateStatus } from '@/lib/data/registration.ts'

export function useBatchUpdateRegistrations(eventId: string, title: string) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: ({ data }: { data: RegistrationUpdateStatusBatch }) =>
      batchUpdateStatus({
        data: {
          eventId,
          ...data,
        },
      }),
    onSuccess: ({ updatedCount }) => {
      toast.success(title, {
        description: `${updatedCount} Students are updated`,
      })
      void queryClient.invalidateQueries({
        queryKey: ['registrations'],
      })
    },
    onError: (error) => {
      toast.error('Failed to accept students', {
        description: error.message || 'Something went wrong',
      })
    },
  })

  return {
    batchUpdate: mutate,
    isBatchUpdating: isPending,
  }
}
