import { z } from "zod";
import { Sigs } from "../core/constants.js";
import { UserRole } from "./constants.js";

export const UserContractSchema = z.object({
  email: z.email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
export const UpdateUserContractSchema = UserContractSchema.partial();

export const UserResponseSchema = UserContractSchema.extend({
  id: z.string().min(1, "ID is required"),
  email: z.email().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export function canManageSig(
  role: UserRole,
  userSigs: Sigs[] | undefined,
  targetSig: Sigs
): boolean {
  if (role === UserRole.Committee) return true;
  return !!(role === UserRole.SigExecutive && userSigs?.includes(targetSig));
}

export function isEventManager(role: UserRole): boolean {
  return role === UserRole.Committee || role === UserRole.SigExecutive;
}
