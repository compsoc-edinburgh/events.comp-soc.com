import { createServerFn } from '@tanstack/react-start'
import { RegistrationResponseSchema } from '@events.comp-soc.com/shared'
import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'
import { apiRequest } from './api-client.ts'
import type { Nullable, Registration } from '@events.comp-soc.com/shared'

const userRegistrationsFilterSchema = z
  .object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  })
  .optional()

export interface UserRegistrationsParams {
  dateFrom?: string
  dateTo?: string
}

export const fetchUserRegistrations = createServerFn({ method: 'GET' })
  .inputValidator((data) => userRegistrationsFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: registrations, status } = await apiRequest<
      Nullable<Array<Registration>>
    >(`/v1/users/registrations`, {
      params: {
        dateFrom: data?.dateFrom,
        dateTo: data?.dateTo,
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
    dateFrom: params?.dateFrom,
    dateTo: params?.dateTo,
  }
  return queryOptions({
    queryKey: ['users', 'registrations', normalised],
    queryFn: () => fetchUserRegistrations({ data: normalised }),
  })
}
