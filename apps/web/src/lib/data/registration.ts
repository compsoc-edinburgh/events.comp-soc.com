import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import axios from 'redaxios'
import {
  RegistrationContractSchema,
  RegistrationResponseSchema,
} from '@events.comp-soc.com/shared'
import { z } from 'zod'
import { queryOptions } from '@tanstack/react-query'
import type {
  CreateRegistrationRequest,
  Nullable,
  Registration,
} from '@events.comp-soc.com/shared'

export const registrationIDSchema = z.object({
  eventId: z.string().min(1, 'EventId is required'),
})

export const fetchRegistrationByAuth = createServerFn({ method: 'GET' })
  .inputValidator(registrationIDSchema)
  .handler(async ({ data }) => {
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    try {
      const { data: registration } = await axios.get<Nullable<Registration>>(
        `${baseUrl}/v1/events/${data.eventId}/registrations/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!registration) {
        return null
      }

      return RegistrationResponseSchema.parse(registration)
    } catch (err) {
      console.error(err)

      throw new Error('Failed to load an event')
    }
  })

export const createRegistration = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateRegistrationRequest & { eventId: string }) => {
    return RegistrationContractSchema.extend({
      eventId: z.string(),
    }).parse(data)
  })
  .handler(async ({ data }) => {
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    const { eventId, ...registrationData } = data

    try {
      const { data: registration } = await axios.post<Registration>(
        `${baseUrl}/v1/events/${eventId}/registrations`,
        registrationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      return RegistrationContractSchema.parse(registration)
    } catch (err) {
      console.error(err)

      throw new Error('Failed to load an event')
    }
  })

export const registrationQueryByAuthOption = (eventId: string) =>
  queryOptions({
    queryKey: ['registrations', eventId],
    queryFn: () => fetchRegistrationByAuth({ data: { eventId } }),
  })
