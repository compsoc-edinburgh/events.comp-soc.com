import { createFileRoute } from '@tanstack/react-router'
import { CalendarIcon } from 'lucide-react'
import {
  EventCard,
  TabNavigation,
  ToolBar,
  TopNavbar,
  WindowBar,
} from '../components'
import type { Event } from '../components'

export const Route = createFileRoute('/')({ component: App })

const events: Array<Event> = [
  {
    id: 1,
    title: 'Intro to Rust Workshop',
    date: 'Tue, 14 Oct',
    time: '18:00',
    location: 'Appleton Tower, 5.05',
    description:
      "Join us for a hands-on introduction to Rust. We'll cover ownership, borrowing, and basic syntax. Pizza provided!",
    type: 'Workshop',
  },
  {
    id: 2,
    title: 'Guest Speaker: AI Ethics',
    date: 'Thu, 16 Oct',
    time: '17:30',
    location: 'Gordon Airman Theatre',
    description:
      'Dr. Sarah Miller discusses the implications of LLMs in modern software engineering and the ethical boundaries we face.',
    type: 'Talk',
  },
  {
    id: 3,
    title: 'Pub Quiz Night',
    date: 'Fri, 17 Oct',
    time: '20:00',
    location: 'The Library Bar',
    description:
      'The legendary Compsoc Pub Quiz returns. Teams of 6 max. Prizes for the winners and the best team name.',
    type: 'Social',
  },
  {
    id: 4,
    title: 'Hackathon: FinTech',
    date: 'Sat, 25 Oct',
    time: '09:00',
    location: 'Bayes Centre',
    description:
      'A 24-hour hackathon sponsored by BlackRock. Build the future of finance and win cash prizes.',
    type: 'Hackathon',
  },
]

function App() {
  return (
    <>
      <TopNavbar />
      <WindowBar />
      <ToolBar />

      <div className="bg-background min-h-screen flex items-center justify-center flex-col">
        <TabNavigation />

        <div className="relative z-10 -mt-px bg-surface flex flex-col w-1/2 border-neutral-800 border rounded-md mb-20">
          <div className="p-8 h-full">
            <div className="text-2xl font-bold gap-2 items-center flex text-white">
              Search Events
            </div>
            <div>
              <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
                <CalendarIcon className="w-4 h-4" strokeWidth={1.5} /> 21
                Upcoming Events
              </div>
            </div>

            <div className="h-px bg-neutral-800 my-5" />

            <div className="bg-neutral-900/50 p-4 rounded border-neutral-800 border text-neutral-400 text-sm leading-relaxed">
              <span className="text-neutral-200 font-medium">
                Welcome to the Compsoc Events Hub.
              </span>{' '}
              This is your central destination for all activities organised by
              the Society and our Special Interest Groups (SIGs).
            </div>

            <div className="mt-8 grid gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
