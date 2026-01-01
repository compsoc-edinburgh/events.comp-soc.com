import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'
import { queryOptions } from '@tanstack/react-query'
import type { Event } from '@events.comp-soc.com/shared'

export type { Event } from '@events.comp-soc.com/shared'

export const fetchEvents = createServerFn({ method: 'GET' }).handler(
  async () => {
    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    const { data } = await axios.get<Array<Event>>(`${baseUrl}/v1/events`)
    return data
  },
)

export const eventsQueryOptions = () =>
  queryOptions({
    queryKey: ['events'],
    queryFn: () => fetchEvents(),
  })
