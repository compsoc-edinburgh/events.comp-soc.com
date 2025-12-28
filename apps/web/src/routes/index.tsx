import { createFileRoute } from '@tanstack/react-router'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowUpRight,
  Bold,
  CalendarIcon,
  ChevronDown,
  CircleUserRound,
  Filter,
  Italic,
  IterationCcw,
  IterationCw,
  MapPin,
  Minimize2,
  MinusIcon,
  Settings,
  XIcon,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

// Mock data for the events
const events = [
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
      {/* Top Navbar */}
      <nav className="flex h-11 items-center justify-between px-3 bg-surface border-b border-neutral-800">
        <div className="flex gap-5 justify-center items-center">
          <img src="/comp-soc-logo.svg" alt="My Logo" className="w-6 h-6" />
          <div className="text-sm cursor-pointer hover:text-white transition-colors">
            CompSoc
          </div>
          <div className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer">
            About
          </div>
          <div className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer">
            Team
          </div>
          <div className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer">
            News
          </div>
          <div className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer">
            Discord
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-xs font-medium text-neutral-500 tabular-nums">
            <span>
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </span>
            <span>
              {new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
          </div>

          <CircleUserRound
            className="w-5.5 h-5.5 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
            strokeWidth={1.5}
          />
        </div>
      </nav>
      <nav className="sticky top-0 z-30 flex h-9 items-center justify-between px-3 bg-window border-b border-neutral-800 w-full">
        <div className="flex gap-2 items-center w-20 h-full">
          <XIcon className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
          <MinusIcon className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
          <Minimize2 className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
        </div>
        <div className="flex gap-1 items-center text-sm font-bold text-neutral-200">
          Events - Compsoc <ChevronDown className="w-4 h-4 text-neutral-500" />
        </div>
        <div className="w-20" />
      </nav>
      <nav className="sticky top-9 z-30 flex h-12 items-center justify-between px-3 py-1 bg-subnavbar border-b border-neutral-800 w-full shadow-2xl">
        <div className="border-neutral-700 border p-1 w-full h-full rounded-sm items-center flex px-3">
          <div className="flex items-center">
            <div className="flex gap-3 items-center">
              <IterationCw className="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
              <IterationCcw className="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
            </div>

            <div className="w-px h-4 bg-neutral-700 mx-4" />

            <div className="flex items-center justify-between bg-neutral-800/50 border border-neutral-700 px-2 py-1 rounded gap-2 cursor-not-allowed opacity-60 min-w-30">
              <span className="text-[11px] font-medium text-neutral-300 truncate">
                IBM Plex Mono
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </div>

            <div className="w-px h-4 bg-neutral-700 mx-4" />

            <div className="flex gap-1 items-center">
              <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
                <Bold className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </button>
              <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
                <Italic className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </button>
            </div>

            <div className="w-px h-4 bg-neutral-700 mx-4" />

            <div className="flex gap-1 items-center">
              <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
                <AlignLeft className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </button>
              <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
                <AlignCenter className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </button>
              <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
                <AlignRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </button>
            </div>

            <div className="w-px h-4 bg-neutral-700 mx-4" />

            <div className="flex items-center justify-between bg-neutral-800 border border-neutral-600 px-2 py-1 rounded gap-2 cursor-pointer hover:border-neutral-500 transition-colors min-w-27.5">
              <span className="text-[11px] font-medium text-neutral-200">
                Find event
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>

            <div className="ml-2 flex items-center gap-2 px-2 py-1 hover:bg-neutral-800 rounded cursor-pointer transition-colors group">
              <Filter className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-200" />
              <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-200">
                Filter by SIG
              </span>
            </div>
          </div>

          <div className="grow" />

          <div className="flex items-center">
            <div className="w-px h-4 bg-neutral-700 mx-4" />
            <button className="p-1.5 hover:bg-neutral-800 rounded transition-colors group">
              <Settings className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </button>
          </div>
        </div>
      </nav>
      <div className="bg-background min-h-screen flex items-center justify-center flex-col">
        <div className="flex gap-5 text-sm w-1/2 mb-px mt-5 justify-center">
          <div className="py-1 px-3 text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors">
            Create
          </div>
          <div className="py-1 px-3 text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors">
            Event
          </div>
          <div className="relative z-20 translate-y-px py-1 px-4 bg-surface border border-neutral-800 border-b-surface rounded-t-md font-medium text-neutral-200">
            Search
          </div>
        </div>

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
                <div
                  key={event.id}
                  className="group relative bg-surface border border-neutral-800 hover:border-neutral-600 rounded-md p-5 transition-all duration-200 hover:shadow-lg hover:bg-neutral-800/30 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 border border-neutral-800 px-1.5 py-0.5 rounded">
                          {event.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-100 group-hover:text-white mb-1">
                        {event.title}
                      </h3>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5 mt-3 text-sm text-neutral-400">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>
                        {event.date} •{' '}
                        <span className="text-neutral-500">{event.time}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-neutral-500 line-clamp-2 group-hover:text-neutral-400 transition-colors">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
