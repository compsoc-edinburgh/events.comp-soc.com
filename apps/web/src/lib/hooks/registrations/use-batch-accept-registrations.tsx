import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { batchAcceptRegistration } from '@/lib/data/registration.ts'

export function useBatchAcceptRegistrations(eventId: string, title: string) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      batchAcceptRegistration({
        data: {
          eventId,
        },
      }),
    onSuccess: ({ acceptedCount }) => {
      toast.success(title, {
        description: `${acceptedCount} Students are accepted`,
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
    batchAccept: mutate,
    isBatchAccepting: isPending,
  }
}
