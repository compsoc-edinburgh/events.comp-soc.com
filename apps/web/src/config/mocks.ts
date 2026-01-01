import type { EventCardData } from '@/components/event-card.tsx'
import { Sigs } from '@/config/sigs.ts'

const today = new Date()

export const SEARCH_EVENTS: Array<EventCardData> = [
  {
    id: 1,
    title: 'Annual General Meeting',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    time: '18:00',
    location: 'Appleton Tower, LT1',
    type: 'Meeting',
    sig: Sigs.Compsoc,
  },
  {
    id: 2,
    title: 'Hackathon: FinTech Challenge',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
    time: '09:00',
    location: 'Bayes Centre',
    type: 'Hackathon',
    sig: Sigs.Compsoc,
  },
  {
    id: 3,
    title: 'Intro to Rust Workshop',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    time: '18:00',
    location: 'Appleton Tower, 5.05',
    sig: Sigs.TypeSig,
    type: 'Workshop',
  },
  {
    id: 4,
    title: 'Guest Speaker: AI Ethics',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    time: '17:30',
    location: 'Gordon Airman Theatre',
    sig: Sigs.EdinburghAI,
    type: 'Talk',
  },
  {
    id: 5,
    title: 'Pub Quiz Night',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
    time: '20:00',
    location: 'The Library Bar',
    sig: Sigs.Tardis,
    type: 'Social',
  },
  {
    id: 6,
    title: 'Machine Learning Study Group',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
    time: '16:00',
    location: 'Informatics Forum, G.07',
    sig: Sigs.EdinburghAI,
    type: 'Study Group',
  },
  {
    id: 7,
    title: 'Game Dev Showcase',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
    time: '19:00',
    location: 'Teviot Row House',
    sig: Sigs.GameDevSig,
    type: 'Showcase',
  },
  {
    id: 8,
    title: 'CV Workshop with Industry Partners',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
    time: '14:00',
    location: 'Appleton Tower, 2.14',
    sig: Sigs.ProjectShare,
    type: 'Career',
  },
]

export const DRAFT_EVENTS: Array<EventCardData> = [
  {
    id: 101,
    title: 'Machine Learning Workshop',
    date: new Date(),
    time: 'TBD',
    location: 'TBD',
    sig: Sigs.TypeSig,
    type: 'Workshop',
  },
  {
    id: 102,
    title: 'Networking Event',
    date: new Date(),
    time: 'Evening',
    location: 'Teviot',
    sig: Sigs.Compsoc,
    type: 'Social',
  },
]
