import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'
import { queryOptions } from '@tanstack/react-query'
import {
  EventContractSchema,
  EventResponseSchema,
  EventState,
  UpdateEventContractSchema,
} from '@events.comp-soc.com/shared'
import { z } from 'zod'
import { auth } from '@clerk/tanstack-react-start/server'
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
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    try {
      const { data: event } = await axios.get<Event>(
        `${baseUrl}/v1/events/${data.eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return EventResponseSchema.parse(event)
    } catch (err) {
      console.error(err)

      throw new Error('Failed to load an event')
    }
  })

const eventsFilterSchema = z
  .object({
    state: z.enum(EventState).optional(),
    includePast: z.boolean().optional(),
  })
  .optional()

export const fetchEvents = createServerFn({ method: 'GET' })
  .inputValidator((data) => eventsFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    try {
      const { data: events } = await axios.get<Array<Event>>(
        `${baseUrl}/v1/events`,
        {
          params: {
            state: data?.state,
            ...(data?.includePast && { includePast: 'true' }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return events.map((event) => EventResponseSchema.parse(event))
    } catch (err) {
      console.error(err)

      throw new Error('Failed to load events')
    }
  })

export const createEvent = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateEventRequest) => EventContractSchema.parse(data))
  .handler(async ({ data }) => {
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    const { data: event } = await axios.post<Event>(
      `${baseUrl}/v1/events`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return EventResponseSchema.parse(event)
  })

export const updateEvent = createServerFn({ method: 'POST' })
  .inputValidator((data: UpdateEventRequest & Pick<Event, 'id'>) => {
    return UpdateEventContractSchema.extend({
      id: z.string(),
    }).parse(data)
  })
  .handler(async ({ data }) => {
    const eventId = data.id
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    const { data: event } = await axios.put<Event>(
      `${baseUrl}/v1/events/${eventId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return EventResponseSchema.parse(event)
  })

export const deleteEvent = createServerFn({ method: 'POST' })
  .inputValidator(eventIDSchema)
  .handler(async ({ data }) => {
    const eventId = data.eventId
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    const { data: event } = await axios.delete<Event>(
      `${baseUrl}/v1/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return EventResponseSchema.parse(event)
  })

export const eventsQueryOptions = (
  state?: 'draft' | 'published',
  includePast?: boolean,
) =>
  queryOptions({
    queryKey: ['events', { state, includePast }],
    queryFn: () => fetchEvents({ data: { state, includePast } }),
  })

export const eventQueryOption = (eventId: string) =>
  queryOptions({
    queryKey: ['events', eventId],
    queryFn: () => fetchEvent({ data: { eventId } }),
  })
