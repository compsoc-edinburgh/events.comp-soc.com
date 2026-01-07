import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import axios from 'redaxios'
import { RegistrationResponseSchema } from '@events.comp-soc.com/shared'
import { queryOptions } from '@tanstack/react-query'
import type { Nullable, Registration } from '@events.comp-soc.com/shared'

export const fetchUserRegistrations = createServerFn({ method: 'GET' }).handler(
  async () => {
    const authObj = await auth()
    const token = await authObj.getToken()

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined')
    }

    try {
      const { data: registrations, status } = await axios.get<
        Nullable<Array<Registration>>
      >(`${baseUrl}/v1/users/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!registrations || status === 204) {
        return null
      }

      return registrations.map((registration) =>
        RegistrationResponseSchema.parse(registration),
      )
    } catch (err) {
      console.error(err)

      throw new Error('Failed to load list of registrations')
    }
  },
)

export const userRegistrationQueryOption = () =>
  queryOptions({
    queryKey: ['users', 'registrations'],
    queryFn: () => fetchUserRegistrations(),
  })
