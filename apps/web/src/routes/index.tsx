import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronDown,
  CircleUserRound,
  Minimize2,
  MinusIcon,
  XIcon,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <nav className="sticky top-0 z-50 flex h-11 items-center justify-between px-3 bg-surface border-b border-neutral-800">
        <div className="flex gap-5 justify-center items-center">
          <img src="/comp-soc-logo.svg" alt="My Logo" className="w-6 h-6" />
          <div className="text-sm">CompSoc OS</div>
          <div className="text-sm">About</div>
          <div className="text-sm">Team</div>
          <div className="text-sm">News</div>
          <div className="text-sm">More</div>
        </div>
        <div>
          <CircleUserRound
            className="w-5.5 h-5.5 text-neutral-300"
            strokeWidth={1.5}
          />
        </div>
      </nav>
      <nav className="flex h-9 items-center justify-between px-3 bg-window border-b border-neutral-800 w-full">
        <div className="flex gap-2 items-center w-20 h-full">
          <XIcon className="w-4 h-4 text-neutral-300" />
          <MinusIcon className="w-4 h-4 text-neutral-300" />
          <Minimize2 className="w-4 h-4 text-neutral-300" />
        </div>
        <div className="flex gap-1 items-center text-sm font-bold">
          Events - Compsoc <ChevronDown className="w-4 h-4 text-neutral-300" />
        </div>
        <div className="w-20" />
      </nav>
      <div className="bg-background h-screen flex items-center justify-center flex-col">
        <div className="flex gap-5 text-sm">
          <div className="py-1 px-2">Create</div>
          <div className="py-1 px-2">Event</div>
          <div className="relative z-10 translate-y-px py-1 px-2 bg-surface border border-neutral-800 border-b-surface rounded-t-sm">
            Search
          </div>
        </div>
        <div className="bg-surface p-8 h-[95%] w-1/2 border-neutral-800 border rounded-sm">
          Hello
        </div>
      </div>
    </>
  )
}
