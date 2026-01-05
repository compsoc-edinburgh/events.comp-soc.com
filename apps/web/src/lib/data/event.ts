import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'
import { queryOptions } from '@tanstack/react-query'
import { EventResponseSchema, EventState } from '@events.comp-soc.com/shared'
import { z } from 'zod'
import type { Event } from '@events.comp-soc.com/shared'

const eventIDSchema = z.object({
  eventId: z.string().min(1, 'EventId is required'),
  authToken: z.string().optional(),
})

export const fetchEvent = createServerFn({ method: 'GET' })
  .inputValidator(eventIDSchema)
  .handler(async ({ data }) => {
    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    try {
      const headers: Record<string, string> = {}
      if (data.authToken) {
        headers['Authorization'] = `Bearer ${data.authToken}`
      }

      const { data: event } = await axios.get<Event>(
        `${baseUrl}/v1/events/${data.eventId}`,
        { headers },
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
    authToken: z.string().optional(),
  })
  .optional()

export const fetchEvents = createServerFn({ method: 'GET' })
  .inputValidator((data) => eventsFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    try {
      const headers: Record<string, string> = {}
      if (data?.authToken) {
        headers['Authorization'] = `Bearer ${data.authToken}`
      }

      const { data: events } = await axios.get<Array<Event>>(
        `${baseUrl}/v1/events`,
        {
          params: {
            state: data?.state,
          },
          headers,
        },
      )
      return events.map((event) => EventResponseSchema.parse(event))
    } catch (err) {
      console.error(err)
      throw new Error('Failed to load events')
    }
  })

// Query options for public events (no auth needed)
export const eventsQueryOptions = (state?: 'draft' | 'published') =>
  queryOptions({
    queryKey: ['events', { state }],
    queryFn: () => fetchEvents({ data: { state } }),
  })

// Query options for authenticated requests (pass token)
export const eventsQueryOptionsWithAuth = (
  state: 'draft' | 'published' | undefined,
  authToken: string | null,
) =>
  queryOptions({
    queryKey: ['events', { state, authenticated: !!authToken }],
    queryFn: () =>
      fetchEvents({ data: { state, authToken: authToken ?? undefined } }),
    enabled: !!authToken, // Only run when we have a token
  })

export const eventQueryOption = (eventId: string, authToken?: string | null) =>
  queryOptions({
    queryKey: ['event', eventId, { authenticated: !!authToken }],
    queryFn: () =>
      fetchEvent({ data: { eventId, authToken: authToken ?? undefined } }),
  })
