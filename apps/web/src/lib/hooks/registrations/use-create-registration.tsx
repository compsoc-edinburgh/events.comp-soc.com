import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CreateRegistrationRequest } from '@events.comp-soc.com/shared'
import { createRegistration } from '@/lib/data/registration.ts'

export function useCreateRegistration(eventId: string, title: string) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateRegistrationRequest) =>
      createRegistration({
        data: {
          eventId,
          ...data,
        },
      }),
    onSuccess: () => {
      toast.success(`Registration for ${title}`, {
        description: 'Registration has been created',
      })
      void queryClient.invalidateQueries({
        queryKey: ['registrations'],
      })
    },
    onError: (error) => {
      toast.error('Failed to create registration', {
        description: error.message || 'Something went wrong',
      })
    },
  })

  return {
    createRegistration: mutate,
    isCreating: isPending,
  }
}
