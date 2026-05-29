import { z } from "zod";

// Canonical shape of every entity id on the wire.
export const IdSchema = z.string().min(1, "ID is required");

export type Id = z.infer<typeof IdSchema>;
