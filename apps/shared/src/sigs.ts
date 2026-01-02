/**
 * SIG (Special Interest Group) identifiers
 * These are the organizers of events
 */
export const SigId = {
  Compsoc: "compsoc",
  ProjectShare: "projectShare",
  BitSig: "bitSig",
  Evp: "evp",
  CloudSig: "cloudSig",
  Tardis: "tardis",
  CCSig: "CCSig",
  TypeSig: "typeSig",
  SigInt: "sigInt",
  GameDevSig: "gameDevSig",
  EdinburghAI: "edinburghAI",
  QuantSig: "quantSig",
} as const;

export type SigId = (typeof SigId)[keyof typeof SigId];

/**
 * List of all valid SIG IDs
 */
export const ALL_SIG_IDS = Object.values(SigId);
