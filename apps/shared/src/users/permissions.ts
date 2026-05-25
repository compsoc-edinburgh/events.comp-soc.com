import { Sigs } from "../core/constants.js";
import { UserRole } from "./constants.js";

// Can `role` (with optional `userSigs`) manage resources owned by `targetSig`
export function canManageSig(
  role: UserRole,
  userSigs: Sigs[] | undefined,
  targetSig: Sigs
): boolean {
  if (role === UserRole.Committee) return true;
  return !!(role === UserRole.SigExecutive && userSigs?.includes(targetSig));
}

// Used by route pre-handlers to decide whether the caller
// is allowed to take any event-management action at all.
export function isEventManager(role: UserRole): boolean {
  return role === UserRole.Committee || role === UserRole.SigExecutive;
}
