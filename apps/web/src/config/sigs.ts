import { Sigs } from '@events.comp-soc.com/shared'
import type { Nullable } from '@events.comp-soc.com/shared'

export interface SIGColors {
  border: string
  background: string
  text: string
}

export interface SIGInfo {
  id: string
  name: string
  logo: string
  colors: SIGColors
}

export const SIG_COLORS: Record<Sigs, SIGColors> = {
  [Sigs.ProjectShare]: {
    border: '#ffffff',
    background: '#7a16f5',
    text: '#ffffff',
  },
  [Sigs.SigInt]: { border: '#666666', background: '#000000', text: '#ffffff' },
  [Sigs.CCSig]: { border: '#3b6d8f', background: '#153d59', text: '#ffffff' },
  [Sigs.CloudSig]: {
    border: '#f2a530',
    background: '#ff9900',
    text: '#ffffff',
  },
  [Sigs.EdinburghAI]: {
    border: '#e37f2d',
    background: '#cc640e',
    text: '#ffffff',
  },
  [Sigs.TypeSig]: { border: '#60a5fa', background: '#008ee0', text: '#ffffff' },
  [Sigs.Tardis]: { border: '#5a8fc7', background: '#2a5085', text: '#ffffff' },
  [Sigs.GameDevSig]: {
    border: '#3cab98',
    background: '#000000',
    text: '#ffffff',
  },
  [Sigs.Evp]: { border: '#ffffff', background: '#3333f5', text: '#ffffff' },
  [Sigs.QuantSig]: {
    border: '#ffffff',
    background: '#0a182e',
    text: '#ffffff',
  },
  [Sigs.BitSig]: { border: '#ff0000', background: '#ffffff', text: '#000000' },
  [Sigs.Compsoc]: { border: '#737373', background: '#262626', text: '#ffffff' },
  [Sigs.NeuroTechSig]: {
    border: '#ae4f94',
    background: '#242324',
    text: '#ffffff',
  },
}

export const ALL_SIGS: Array<SIGInfo> = [
  {
    id: Sigs.Compsoc,
    name: 'CompSoc',
    logo: '/sigs/comp-soc.png',
    colors: SIG_COLORS[Sigs.Compsoc],
  },
  {
    id: Sigs.ProjectShare,
    name: 'Project Share',
    logo: '/sigs/projectshare.png',
    colors: SIG_COLORS[Sigs.ProjectShare],
  },
  {
    id: Sigs.Tardis,
    name: 'TARDIS',
    logo: '/sigs/tardis.webp',
    colors: SIG_COLORS[Sigs.Tardis],
  },
  {
    id: Sigs.TypeSig,
    name: 'TypeSIG',
    logo: '/sigs/typesig.webp',
    colors: SIG_COLORS[Sigs.TypeSig],
  },
  {
    id: Sigs.SigInt,
    name: 'SIGINT',
    logo: '/sigs/sigint.webp',
    colors: SIG_COLORS[Sigs.SigInt],
  },
  {
    id: Sigs.QuantSig,
    name: 'QuantSIG',
    logo: '/sigs/quant.svg',
    colors: SIG_COLORS[Sigs.QuantSig],
  },
  {
    id: Sigs.GameDevSig,
    name: 'GameDevSIG',
    logo: '/sigs/gamedev.webp',
    colors: SIG_COLORS[Sigs.GameDevSig],
  },
  {
    id: Sigs.EdinburghAI,
    name: 'Edinburgh AI',
    logo: '/sigs/ai.webp',
    colors: SIG_COLORS[Sigs.EdinburghAI],
  },
  {
    id: Sigs.Evp,
    name: 'EVP',
    logo: '/sigs/evp.png',
    colors: SIG_COLORS[Sigs.Evp],
  },
  {
    id: Sigs.BitSig,
    name: 'BitSIG',
    logo: '/sigs/bitsig.png',
    colors: SIG_COLORS[Sigs.BitSig],
  },
  {
    id: Sigs.CloudSig,
    name: 'CloudSIG',
    logo: '/sigs/cloud.png',
    colors: SIG_COLORS[Sigs.CloudSig],
  },
  {
    id: Sigs.CCSig,
    name: 'CCSIG',
    logo: '/sigs/ccsig.webp',
    colors: SIG_COLORS[Sigs.CCSig],
  },
  {
    id: Sigs.NeuroTechSig,
    name: 'Edinburgh Neurotech',
    logo: '/sigs/neurotech.webp',
    colors: SIG_COLORS[Sigs.NeuroTechSig],
  },
]

export const getSigById = (sigId: string): Nullable<SIGInfo> => {
  return ALL_SIGS.find((sig) => sig.id === sigId) ?? null
}

export const getSigColors = (sigId: Sigs): SIGColors => {
  return SIG_COLORS[sigId]
}
