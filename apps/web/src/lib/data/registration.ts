import { createServerFn } from '@tanstack/react-start'
import {
  RegistrationAnalyticsResponseSchema,
  RegistrationBatchAcceptResponseSchema,
  RegistrationBatchUpdateResponseSchema,
  RegistrationContractSchema,
  RegistrationResponseSchema,
  UpdateRegistrationContractSchema,
  UpdateRegistrationStatusBatchSchema,
} from '@events.comp-soc.com/shared'
import { z } from 'zod'
import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from './api-client.ts'
import type {
  CreateRegistrationRequest,
  Nullable,
  Registration,
  RegistrationAnalyticsResponse,
  RegistrationBatchAcceptResponse,
  RegistrationBatchUpdateResponse,
  UpdateRegistrationRequest,
  UpdateRegistrationStatusBatch,
} from '@events.comp-soc.com/shared'

export const registrationIDSchema = z.object({
  eventId: z.string().min(1, 'EventId is required'),
})

export const batchAcceptRegistration = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ eventId: z.string() }))
  .handler(async ({ data }) => {
    const { data: acceptedCount } =
      await apiRequest<RegistrationBatchAcceptResponse>(
        `/v1/events/${data.eventId}/registrations/batch-accept`,
        {
          method: 'POST',
          body: {},
          errorMessage: 'Failed to batch accept registrations',
        },
      )
    return RegistrationBatchAcceptResponseSchema.parse(acceptedCount)
  })

export const batchUpdateStatus = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: UpdateRegistrationStatusBatch & { eventId: string }) => {
      return UpdateRegistrationStatusBatchSchema.extend({
        eventId: z.string(),
      }).parse(data)
    },
  )
  .handler(async ({ data }) => {
    const { eventId, ...payload } = data
    const { data: updatedCount } =
      await apiRequest<RegistrationBatchUpdateResponse>(
        `/v1/events/${eventId}/registrations/batch-update-status`,
        {
          method: 'POST',
          body: payload,
          errorMessage: 'Failed to update registration statuses',
        },
      )
    return RegistrationBatchUpdateResponseSchema.parse(updatedCount)
  })

export const fetchRegistrationByUser = createServerFn({ method: 'GET' })
  .inputValidator(registrationIDSchema)
  .handler(async ({ data }) => {
    const { data: registration } = await apiRequest<Nullable<Registration>>(
      `/v1/events/${data.eventId}/registrations/me`,
      { errorMessage: 'Failed to load registration' },
    )
    if (!registration) return null
    return RegistrationResponseSchema.parse(registration)
  })

export const fetchRegistrations = createServerFn({ method: 'GET' })
  .inputValidator(registrationIDSchema)
  .handler(async ({ data }) => {
    const { data: registrations } = await apiRequest<Array<Registration>>(
      `/v1/events/${data.eventId}/registrations`,
      { errorMessage: 'Failed to load registrations' },
    )
    return registrations.map((registration) =>
      RegistrationResponseSchema.parse(registration),
    )
  })

export const fetchRegistrationAnalytics = createServerFn({ method: 'GET' })
  .inputValidator(registrationIDSchema)
  .handler(async ({ data }) => {
    const { data: analytics } = await apiRequest<RegistrationAnalyticsResponse>(
      `/v1/events/${data.eventId}/registrations/analytics`,
      { errorMessage: 'Failed to load registration analytics' },
    )
    return RegistrationAnalyticsResponseSchema.parse(analytics)
  })

export const createRegistration = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateRegistrationRequest & { eventId: string }) => {
    return RegistrationContractSchema.extend({
      eventId: z.string(),
    }).parse(data)
  })
  .handler(async ({ data }) => {
    const { eventId, ...payload } = data
    const { data: registration } = await apiRequest<Registration>(
      `/v1/events/${eventId}/registrations`,
      {
        method: 'POST',
        body: payload,
        errorMessage: 'Failed to create registration',
      },
    )
    return RegistrationContractSchema.parse(registration)
  })

export const updateRegistration = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: UpdateRegistrationRequest & { eventId: string; userId: string }) => {
      return UpdateRegistrationContractSchema.extend({
        eventId: z.string(),
        userId: z.string(),
      }).parse(data)
    },
  )
  .handler(async ({ data }) => {
    const { eventId, userId, ...payload } = data
    const { data: registration } = await apiRequest<Registration>(
      `/v1/events/${eventId}/registrations/${userId}`,
      {
        method: 'PUT',
        body: payload,
        errorMessage: 'Failed to update registration',
      },
    )
    return RegistrationContractSchema.parse(registration)
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
