import { useAuth, useUser } from '@clerk/tanstack-react-start'
import { UserRole } from '@events.comp-soc.com/shared'

export function useCommitteeAuth() {
  const { userId, isLoaded: isAuthLoaded } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()

  const isLoaded = isAuthLoaded && isUserLoaded
  const isAuthenticated = !!userId
  const isCommittee = user?.publicMetadata.role === UserRole.Committee

  return {
    isLoaded,
    isAuthenticated,
    isCommittee,
    hasAccess: isAuthenticated && isCommittee,
    user,
  }
}
