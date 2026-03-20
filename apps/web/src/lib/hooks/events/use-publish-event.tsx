import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { EventState } from '@events.comp-soc.com/shared'
import { updateEvent } from '@/lib/data/event.ts'
import { formatErrorMessage } from '@/lib/utils.ts'

export function usePublishEvent(eventId: string) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateEvent({
        data: { id: eventId, state: EventState.Published },
      }),
    onSuccess: (event) => {
      void queryClient.invalidateQueries({ queryKey: ['events', eventId] })
      toast.success(event.title, {
        description: 'Event has been published',
      })
    },
    onError: (error: Error) => {
      toast.error('Publish failed', {
        description: formatErrorMessage(error.message),
      })
    },
  })

  return {
    publishEvent: mutate,
    isPublishing: isPending,
  }
}
