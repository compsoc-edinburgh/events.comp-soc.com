export const Sigs = {
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
  NeuroTechSig: "neuroTechSig",
  QuantSig: "quantSig",
} as const;

export type Sigs = (typeof Sigs)[keyof typeof Sigs];
