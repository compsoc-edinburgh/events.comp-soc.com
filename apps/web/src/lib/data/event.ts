import { createServerFn } from '@tanstack/react-start'
import { queryOptions } from '@tanstack/react-query'
import {
  EventContractSchema,
  EventResponseSchema,
  UpdateEventContractSchema,
} from '@events.comp-soc.com/shared'
import { z } from 'zod'
import { apiRequest } from './api-client.ts'
import type {
  CreateEventRequest,
  Event,
  UpdateEventRequest,
} from '@events.comp-soc.com/shared'

export const eventIDSchema = z.object({
  eventId: z.string().min(1, 'EventId is required'),
})

export const fetchEvent = createServerFn({ method: 'GET' })
  .inputValidator(eventIDSchema)
  .handler(async ({ data }) => {
    const { data: event } = await apiRequest<Event>(
      `/v1/events/${data.eventId}`,
      { errorMessage: 'Failed to load an event' },
    )
    return EventResponseSchema.parse(event)
  })

/**
 * Web-side input shape for `fetchEvents`. Mirrors the shared
 * `EventsQueryFilter` shape but with typed inputs (array for `sigs`,
 * boolean for `includePast`). Encoded to the wire format inside the
 * server fn below.
 */
const eventsFilterInputSchema = z
  .object({
    state: z.enum(['draft', 'published']).optional(),
    includePast: z.boolean().optional(),
    search: z.string().optional(),
    sigs: z.array(z.string()).optional(),
    date: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  })
  .optional()

export const fetchEvents = createServerFn({ method: 'GET' })
  .inputValidator((data) => eventsFilterInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: events } = await apiRequest<Array<Event>>(`/v1/events`, {
      params: {
        state: data?.state,
        includePast: data?.includePast ? 'true' : undefined,
        search:
          data?.search && data.search.trim() !== ''
            ? data.search.trim()
            : undefined,
        sigs:
          data?.sigs && data.sigs.length > 0 ? data.sigs.join(',') : undefined,
        date: data?.date,
        dateFrom: data?.dateFrom,
        dateTo: data?.dateTo,
      },
      errorMessage: 'Failed to load events',
    })
    return events.map((event) => EventResponseSchema.parse(event))
  })

export const createEvent = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateEventRequest) => EventContractSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: event } = await apiRequest<Event>(`/v1/events`, {
      method: 'POST',
      body: data,
      errorMessage: 'Failed to create event',
    })
    return EventResponseSchema.parse(event)
  })

export const updateEvent = createServerFn({ method: 'POST' })
  .inputValidator((data: UpdateEventRequest & Pick<Event, 'id'>) => {
    return UpdateEventContractSchema.extend({
      id: z.string(),
    }).parse(data)
  })
  .handler(async ({ data }) => {
    const { data: event } = await apiRequest<Event>(`/v1/events/${data.id}`, {
      method: 'PUT',
      body: data,
      errorMessage: 'Failed to update event',
    })
    return EventResponseSchema.parse(event)
  })

export const deleteEvent = createServerFn({ method: 'POST' })
  .inputValidator(eventIDSchema)
  .handler(async ({ data }) => {
    const { data: event } = await apiRequest<Event>(
      `/v1/events/${data.eventId}`,
      { method: 'DELETE', errorMessage: 'Failed to delete event' },
    )
    return EventResponseSchema.parse(event)
  })

export interface EventsQueryParams {
  state?: 'draft' | 'published'
  includePast?: boolean
  search?: string
  sigs?: Array<string>
  date?: string
  dateFrom?: string
  dateTo?: string
}

export const eventsQueryOptions = (
  stateOrParams?: 'draft' | 'published' | EventsQueryParams,
  includePast?: boolean,
) => {
  const params: EventsQueryParams =
    typeof stateOrParams === 'object'
      ? stateOrParams
      : { state: stateOrParams, includePast }

  const normalised = {
    state: params.state,
    includePast: params.includePast,
    search: params.search?.trim() ? params.search.trim() : undefined,
    sigs:
      params.sigs && params.sigs.length > 0
        ? [...params.sigs].sort()
        : undefined,
    date: params.date,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  }

  return queryOptions({
    queryKey: ['events', normalised],
    queryFn: () => fetchEvents({ data: normalised }),
  })
}

export const eventQueryOption = (eventId: string) =>
  queryOptions({
    queryKey: ['events', eventId],
    queryFn: () => fetchEvent({ data: { eventId } }),
  })
