import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import axios from 'redaxios'
import {
  RegistrationAnalyticsResponseSchema,
  RegistrationBatchAcceptResponseSchema,
  RegistrationBatchUpdateResponseSchema,
  RegistrationContractSchema,
  RegistrationResponseSchema,
  RegistrationStatusBatchUpdateSchema,
  RegistrationUpdateContractSchema,
} from '@events.comp-soc.com/shared'
import { z } from 'zod'
import { queryOptions } from '@tanstack/react-query'
import type {
  CreateRegistrationRequest,
  Nullable,
  Registration,
  RegistrationAnalyticsResponse,
  RegistrationBatchAcceptResponse,
  RegistrationBatchUpdateResponse,
  RegistrationUpdateStatusBatch,
  UpdateRegistrationRequest,
} from '@events.comp-soc.com/shared'

export const registrationIDSchema = z.object({
  eventId: z.string().min(1, 'EventId is required'),
})

export const batchAcceptRegistration = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ eventId: z.string() }))
  .handler(async ({ data }) => {
    const authObj = await auth()
    const token = await authObj.getToken()
    const baseUrl = process.env.API_BASE_URL

    if (!baseUrl) throw new Error('API_BASE_URL is not defined')

    try {
      const { data: acceptedCount } =
        await axios.post<RegistrationBatchAcceptResponse>(
          `${baseUrl}/v1/events/${data.eventId}/registrations/batch-accept`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

      return RegistrationBatchAcceptResponseSchema.parse(acceptedCount)
    } catch (err) {
      console.error('Batch accept failed', err)
      throw new Error('Failed to batch accept registrations')
    }
  })

export const batchUpdateStatus = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: RegistrationUpdateStatusBatch & { eventId: string }) => {
      return RegistrationStatusBatchUpdateSchema.extend({
        eventId: z.string(),
      }).parse(data)
    },
  )
  .handler(async ({ data }) => {
    const authObj = await auth()
    const token = await authObj.getToken()
    const baseUrl = process.env.API_BASE_URL

    if (!baseUrl) throw new Error('API_BASE_URL is not defined')

    const { eventId, ...payload } = data

    try {
      const { data: updatedCount } =
        await axios.post<RegistrationBatchUpdateResponse>(
          `${baseUrl}/v1/events/${eventId}/registrations/batch-update-status`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

      return RegistrationBatchUpdateResponseSchema.parse(updatedCount)
    } catch (err) {
      console.error('Batch update status failed', err)
      throw new Error('Failed to update registration statuses')
    }
  })

export const fetchRegistrationByUser = createServerFn({ method: 'GET' })
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

export const fetchRegistrations = createServerFn({ method: 'GET' })
  .inputValidator(registrationIDSchema)
  .handler(async ({ data }) => {
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    try {
      const { data: registrations } = await axios.get<Array<Registration>>(
        `${baseUrl}/v1/events/${data.eventId}/registrations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return registrations.map((registration) =>
        RegistrationResponseSchema.parse(registration),
      )
    } catch (err) {
      console.error(err)

      throw new Error('Failed to load an event')
    }
  })

export const fetchRegistrationAnalytics = createServerFn({ method: 'GET' })
  .inputValidator(registrationIDSchema)
  .handler(async ({ data }) => {
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    try {
      const { data: analytics } =
        await axios.get<RegistrationAnalyticsResponse>(
          `${baseUrl}/v1/events/${data.eventId}/registrations/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

      return RegistrationAnalyticsResponseSchema.parse(analytics)
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

export const updateRegistration = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: UpdateRegistrationRequest & { eventId: string; userId: string }) => {
      return RegistrationUpdateContractSchema.extend({
        eventId: z.string(),
        userId: z.string(),
      }).parse(data)
    },
  )
  .handler(async ({ data }) => {
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    const { eventId, userId, ...registrationData } = data

    try {
      const { data: registration } = await axios.put<Registration>(
        `${baseUrl}/v1/events/${eventId}/registrations/${userId}`,
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

export const registrationQueryByUserOption = (eventId: string) =>
  queryOptions({
    queryKey: ['registrations', eventId, 'me'],
    queryFn: () => fetchRegistrationByUser({ data: { eventId } }),
  })

export const registrationQueryOption = (eventId: string) =>
  queryOptions({
    queryKey: ['registrations', eventId],
    queryFn: () => fetchRegistrations({ data: { eventId } }),
  })
export const registrationAnalyticsQueryOption = (eventId: string) =>
  queryOptions({
    queryKey: ['registrations', eventId, 'analytics'],
    queryFn: () => fetchRegistrationAnalytics({ data: { eventId } }),
  })
