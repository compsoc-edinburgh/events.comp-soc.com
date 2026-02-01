import { useAuth, useUser } from '@clerk/tanstack-react-start'
import {
  UserRole,
  canManageSig,
  isEventManager,
} from '@events.comp-soc.com/shared'
import type { Sigs } from '@events.comp-soc.com/shared'

interface PublicMetadata {
  role?: UserRole
  sigs?: Array<Sigs>
}

export function useCommitteeAuth() {
  const { userId, isLoaded: isAuthLoaded } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()

  const isLoaded = isAuthLoaded && isUserLoaded
  const isAuthenticated = !!userId
  const metadata = user?.publicMetadata as PublicMetadata | undefined
  const isCommittee = metadata?.role === UserRole.Committee

  return {
    isLoaded,
    isAuthenticated,
    isCommittee,
    hasAccess: isAuthenticated && isCommittee,
    user,
  }
}

export function useEventManagerAuth() {
  const { userId, isLoaded: isAuthLoaded } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()

  const isLoaded = isAuthLoaded && isUserLoaded
  const isAuthenticated = !!userId
  const metadata = user?.publicMetadata as PublicMetadata | undefined
  const role = metadata?.role ?? UserRole.Member
  const sigs = metadata?.sigs

  const isCommittee = role === UserRole.Committee
  const isSigExecutive = role === UserRole.SigExecutive
  const canManageEvents = isEventManager(role)

  const canManage = (targetSig: Sigs): boolean => {
    return canManageSig(role, sigs, targetSig)
  }

  const getManageableSigs = (): Array<Sigs> | null => {
    if (isCommittee) return null
    if (isSigExecutive && sigs) return sigs
    return []
  }

  return {
    isLoaded,
    isAuthenticated,
    isCommittee,
    isSigExecutive,
    canManageEvents,
    hasAccess: isAuthenticated && canManageEvents,
    role,
    sigs,
    canManage,
    getManageableSigs,
    user,
  }
}

export { canManageSig, isEventManager }
