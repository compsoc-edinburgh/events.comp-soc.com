import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteEvent } from '@/lib/data/event.ts'
import { formatErrorMessage } from '@/lib/utils.ts'

export function useDeleteEvent(eventId: string) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      deleteEvent({
        data: { eventId },
      }),
    onSuccess: (event) => {
      void queryClient.invalidateQueries({ queryKey: ['events', eventId] })
      toast.success(event.title, {
        description: 'Event has been deleted',
      })
    },
    onError: (error: Error) => {
      toast.error('Delete failed', {
        description: formatErrorMessage(error.message),
      })
    },
  })

  return {
    deleteEvent: mutate,
    isDeleting: isPending,
  }
}
