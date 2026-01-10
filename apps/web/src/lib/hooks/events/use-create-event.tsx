import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CreateEventRequest } from '@events.comp-soc.com/shared'
import { createEvent } from '@/lib/data/event.ts'

export function useCreateEvent() {
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateEventRequest) => createEvent({ data }),
    onSuccess: (event) => {
      toast.success(event.title, {
        description: 'Event has been created',
      })
    },
    onError: (error) => {
      toast.error('Failed to create event', {
        description: error.message || 'Something went wrong',
      })
    },
  })

  return {
    createEvent: mutate,
    isCreating: isPending,
  }
}
