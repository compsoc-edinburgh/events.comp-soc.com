import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UpdateEventRequest } from '@events.comp-soc.com/shared'
import { updateEvent } from '@/lib/data/event.ts'

export function useUpdateEvent(eventId: string) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateEventRequest) =>
      updateEvent({
        data: { id: eventId, ...data },
      }),
    onSuccess: (event) => {
      void queryClient.invalidateQueries({ queryKey: ['events', eventId] })
      toast.success(event.title, {
        description: 'Event has been updated',
      })
    },
    onError: (error: Error) => {
      toast.error('Update failed', {
        description: error.message || 'Something went wrong',
      })
    },
  })

  return {
    updateEvent: mutate,
    isUpdating: isPending,
  }
}
