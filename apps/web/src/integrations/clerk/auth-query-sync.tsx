import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/tanstack-react-start'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Keeps the React Query cache in sync with the Clerk session.
 */
export function AuthQuerySync() {
  const { userId, isLoaded } = useAuth()
  const queryClient = useQueryClient()
  const previousUserIdRef = useRef<string | null | undefined>(userId)

  useEffect(() => {
    if (!isLoaded) return

    const previous = previousUserIdRef.current
    if (previous === userId) return

    previousUserIdRef.current = userId

    if (!userId) {
      // Signed out — drop cached data.
      queryClient.clear()
    } else {
      // Signed in or switched accounts — refetch under the new identity.
      void queryClient.invalidateQueries()
    }
  }, [isLoaded, userId, queryClient])

  return null
}
