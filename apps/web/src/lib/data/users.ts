import { createServerFn } from '@tanstack/react-start'
import { RegistrationResponseSchema } from '@events.comp-soc.com/shared'
import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'
import { apiRequest } from './api-client.ts'
import type { Nullable, Registration } from '@events.comp-soc.com/shared'

const userRegistrationsFilterSchema = z
  .object({
    from: z.string().optional(),
    until: z.string().optional(),
  })
  .optional()

export interface UserRegistrationsParams {
  from?: string
  until?: string
}

export const fetchUserRegistrations = createServerFn({ method: 'GET' })
  .inputValidator((data) => userRegistrationsFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: registrations, status } = await apiRequest<
      Nullable<Array<Registration>>
    >(`/v1/users/registrations`, {
      params: {
        from: data?.from,
        until: data?.until,
      },
      errorMessage: 'Failed to load list of registrations',
    })

    if (!registrations || status === 204) {
      return null
    }

    return registrations.map((registration) =>
      RegistrationResponseSchema.parse(registration),
    )
  })

export const userRegistrationQueryOption = (
  params?: UserRegistrationsParams,
) => {
  const normalised = {
    from: params?.from,
    until: params?.until,
  }
  return queryOptions({
    queryKey: ['users', 'registrations', normalised],
    queryFn: () => fetchUserRegistrations({ data: normalised }),
  })
}
