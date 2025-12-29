import { createFileRoute } from '@tanstack/react-router'
import { PlusCircleIcon } from 'lucide-react'
import Window from '@/components/module/layout/window/window.tsx'
import Sheet from '@/components/module/layout/sheet.tsx'

export const Route = createFileRoute('/events/create')({
  component: CreateRoute,
})

function CreateRoute() {
  return (
    <Window activeTab="/events/create">
      <Sheet>
        <div className="text-2xl font-bold gap-2 items-center flex text-white">
          Create Event
        </div>
        <div>
          <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
            <PlusCircleIcon className="w-4 h-4" strokeWidth={1.5} /> New event
          </div>
        </div>

        <div className="h-px bg-neutral-800 my-5" />

        <div className="bg-neutral-900/50 p-4 rounded border-neutral-800 border text-neutral-400 text-sm leading-relaxed">
          <span className="text-neutral-200 font-medium">
            Create a new event.
          </span>{' '}
          Fill in the details below to create a new event for the Compsoc
          community.
        </div>

        <div className="mt-6 flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-300 font-medium">
              Event Title
            </label>
            <input
              type="text"
              placeholder="Enter event title..."
              className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-300 font-medium">
              Description
            </label>
            <textarea
              placeholder="Describe your event..."
              rows={4}
              className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-300 font-medium">
                Date
              </label>
              <input
                type="date"
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-300 font-medium">
                Time
              </label>
              <input
                type="time"
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-300 font-medium">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter location..."
              className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button className="bg-red-900 rounded-sm p-0 cursor-pointer group">
              <span className="block px-4 py-2 rounded-sm text-sm bg-red-600 text-white -translate-y-1 transition-transform group-active:-translate-y-0.5">
                Create Event
              </span>
            </button>
            <button className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors border border-neutral-700 rounded hover:border-neutral-500">
              Save as Draft
            </button>
          </div>
        </div>
      </Sheet>
    </Window>
  )
}
