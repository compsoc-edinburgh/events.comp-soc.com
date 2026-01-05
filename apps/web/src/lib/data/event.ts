import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'
import { queryOptions } from '@tanstack/react-query'
import { EventResponseSchema, EventState } from '@events.comp-soc.com/shared'
import { z } from 'zod'
import { auth } from '@clerk/tanstack-react-start/server'
import type { Event } from '@events.comp-soc.com/shared'

const eventIDSchema = z.object({
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

export const eventsQueryOptions = (state?: 'draft' | 'published') =>
  queryOptions({
    queryKey: ['events', { state }],
    queryFn: () => fetchEvents({ data: { state } }),
  })

export const eventQueryOption = (eventId: string) =>
  queryOptions({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent({ data: { eventId } }),
  })
