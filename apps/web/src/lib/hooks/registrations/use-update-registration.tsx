import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UpdateRegistrationRequest } from '@events.comp-soc.com/shared'
import { updateRegistration } from '@/lib/data/registration.ts'

export function useUpdateRegistration(eventId: string, title: string) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateRegistrationRequest & { userId: string }) =>
      updateRegistration({
        data: {
          eventId,
          ...data,
        },
      }),
    onSuccess: () => {
      toast.success(`Registration for ${title}`, {
        description: 'Registration has been updated',
      })
      void queryClient.invalidateQueries({
        queryKey: ['registrations'],
      })
    },
    onError: (error) => {
      toast.error('Failed to update registration', {
        description: error.message || 'Something went wrong',
      })
    },
  })

  return {
    updateRegistration: mutate,
    isUpdating: isPending,
  }
}
