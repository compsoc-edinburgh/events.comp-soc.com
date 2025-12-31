import { createFileRoute } from '@tanstack/react-router'
import { ClockIcon, MapPin } from 'lucide-react'
import Window from '@/components/module/layout/window/window.tsx'
import Sheet from '@/components/module/layout/sheet.tsx'
import { Markdown } from '@/components/markdown.tsx'
import GoogleMapsCard from '@/components/module/google-maps-card.tsx'

export const Route = createFileRoute('/events/$eventId')({
  component: EventRoute,
})

function EventRoute() {
  const { eventId } = Route.useParams()

  console.log(eventId)

  return (
    <Window activeTab="/events">
      <Sheet>
        <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
          Intro to Rust Workshop
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 border border-neutral-800 px-1.5 py-0.5 rounded">
            Workshop
          </span>
        </div>

        <div className="my-6 sm:my-8 flex flex-col sm:flex-row gap-4 sm:gap-10">
          <div className="flex-1 sm:flex-none">
            <div className="flex gap-2 items-center text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              Location
            </div>
            <div className="font-bold mt-1 sm:mt-2 ml-6 sm:ml-7 text-sm sm:text-base">Remote</div>
          </div>
          <div className="flex-1 sm:flex-none">
            <div className="flex gap-2 items-center text-sm sm:text-base">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Date
            </div>
            <div className="font-bold mt-1 sm:mt-2 ml-6 sm:ml-7 text-sm sm:text-base">Mon 29 Dec 14:30</div>
          </div>
        </div>

        <div className="my-5">
          <div className="text-base text-neutral-400">About</div>
          <div className="h-px bg-neutral-800" />
          <Markdown
            className="mt-4"
            content={`
Join us for an **introductory workshop on Rust**, the systems programming language that's taking the world by storm!

## What you'll learn

- Setting up your Rust development environment
- Understanding ownership and borrowing
- Writing your first Rust program
- Common patterns and best practices

## Prerequisites

- Basic programming knowledge (any language)
- A laptop with internet access

## Who should attend?

This workshop is perfect for developers who want to:

1. Learn a modern systems language
2. Write safer, more performant code
3. Explore WebAssembly and embedded development

> "Rust is the most loved programming language for 8 years in a row!" — Stack Overflow Survey

See you there! 🦀
            `}
          />
        </div>

        <div className="my-5">
          <div className="text-base text-neutral-400">Location</div>
          <div className="h-px bg-neutral-800" />
          <GoogleMapsCard
            locationURL="https://www.google.com/maps/place/University+of+Birmingham"
            locationName="University of Birmingham"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button className="bg-primary-dark rounded-sm p-0 cursor-pointer group w-full sm:w-auto">
            <span className="block px-4 py-2 rounded-sm text-sm bg-primary text-primary-foreground -translate-y-1 transition-transform group-active:-translate-y-0.5 text-center">
              Register Now
            </span>
          </button>
          <button className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors border border-neutral-700 rounded hover:border-neutral-500 w-full sm:w-auto">
            Add to Calendar
          </button>
        </div>
      </Sheet>
    </Window>
  )
}
