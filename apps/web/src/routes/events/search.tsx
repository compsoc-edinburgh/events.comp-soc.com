import { Sigs } from "@monorepo/types/const";
import { formatDateHeader } from "../../lib/utils";
import SearchEventCard from "../../modules/search-event-card";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";

const mockEvents = [
  {
    id: "1",
    organizer: { sig: Sigs.TypeSig },
    hero: {
      title: "MathSoc x TypeSig: Lean Sesh",
      tags: ["Mathematics", "Proof Assistants", "Lean", "Logic"]
    },
    description:
      "Join us for a collaborative session with MathSoc! Try out the Lean proof assistant and solve logic puzzles.",
    date: "2025-11-20",
    startTime: "18:00",
    endTime: "20:00",
    location: "Informatics Forum, Room G.07",
    image: "/sigs/typesig.webp"
  },
  {
    id: "2",
    organizer: { sig: Sigs.GameDevSig },
    hero: {
      title: "Game Dev Workshop: Unity Basics",
      tags: ["Game Development", "Unity", "C#", "Workshop"]
    },
    description:
      "Learn the basics of Unity game development in this hands-on workshop. Perfect for beginners!",
    date: "2025-11-20",
    startTime: "19:30",
    endTime: "21:30",
    location: "Appleton Tower, Room 2.14",
    image: "/sigs/gamedev.webp"
  },
  {
    id: "3",
    organizer: { sig: Sigs.EdinburghAI },
    hero: {
      title: "AI Ethics Discussion Panel",
      tags: ["AI", "Ethics", "Panel Discussion", "Machine Learning"]
    },
    description:
      "Join industry experts and academics discussing the ethical implications of AI technology.",
    date: "2025-11-22",
    startTime: "19:00",
    endTime: "21:00",
    location: "Informatics Forum, Atrium",
    image: "/sigs/ai.webp"
  },
  {
    id: "4",
    organizer: { sig: Sigs.CloudSig },
    hero: {
      title: "AWS Certification Study Group",
      tags: ["Cloud", "AWS", "Certification", "Study"]
    },
    description:
      "Prepare for AWS certification exams with fellow students. Share resources and study tips.",
    date: "2025-11-25",
    startTime: "16:00",
    endTime: "18:00",
    location: "Bayes Centre, Room 5.02",
    image: "/sigs/cloud.png"
  },
  {
    id: "5",
    organizer: { sig: Sigs.SigInt },
    hero: {
      title: "CTF Night: Capture The Flag",
      tags: ["Security", "CTF", "Hacking", "Competition"]
    },
    description:
      "Test your cybersecurity skills in our monthly Capture The Flag competition. All levels welcome!",
    date: "2025-11-27",
    startTime: "18:30",
    endTime: "22:00",
    location: "Informatics Forum, Room G.03",
    image: "/sigs/sigint.webp"
  },
  {
    id: "6",
    organizer: { sig: Sigs.QuantSig },
    hero: {
      title: "Quantitative Finance Workshop",
      tags: ["Finance", "Algorithms", "Trading", "Math"]
    },
    description:
      "Explore algorithmic trading strategies and quantitative finance concepts with guest speakers from top firms.",
    date: "2025-11-27",
    startTime: "17:00",
    endTime: "19:00",
    location: "Business School, Lecture Theatre",
    image: "/sigs/quant.svg"
  }
];

function Search() {
  const groupedEvents = mockEvents.reduce((groups, event) => {
    const date = event.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, typeof mockEvents>);

  return (
    <div className="relative min-h-screen text-white bg-neutral-900">
      <main className="flex flex-col items-center relative">
        <div className="max-w-4xl w-full">
<div
  className="sticky top-0 z-20 flex justify-between items-center
  py-4 mb-6
  backdrop-blur-md bg-neutral-900/50
  mask-gradient"
>

  <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl leading-tight">
    Events
  </h1>

  <div className="flex items-center gap-2">
    <button className="flex items-center text-sm sm:text-xs md:text-sm font-medium bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors px-2 gap-2 py-2">
      <PlusIcon className="w-5 h-5" /> Create Event
    </button>

    <button className="flex items-center text-sm sm:text-xs md:text-sm font-medium bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors px-2 gap-2 py-2">
      <MagnifyingGlassIcon className="w-5 h-5" />
    </button>
  </div>
</div>

          {Object.keys(groupedEvents).length > 0
            ? <div className="relative pl-6 sm:pl-8">
                <div className="absolute left-[3px] top-0 bottom-0 w-px">
                  <div
                    className="h-full w-full bg-linear-to-b from-neutral-700 to-transparent"
                    style={{
                      maskImage:
                        "repeating-linear-gradient(to bottom, black 0px, black 5px, transparent 5px, transparent 10px)",
                      WebkitMaskImage:
                        "repeating-linear-gradient(to bottom, black 0px, black 5px, transparent 5px, transparent 10px)"
                    }}
                  />
                </div>

                {Object.entries(groupedEvents).map(([date, events]) => {
                  const formattedDate = formatDateHeader(date);
                  return (
                    <div key={date} className="relative mb-10 sm:mb-12">
                      <div className="absolute -left-6 sm:-left-8 top-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      </div>

                      <h2 className="mb-3 sm:mb-4">
                        <span className="text-sm sm:text-base md:text-lg font-semibold">
                          {formattedDate.main}
                        </span>
                        {formattedDate.weekday &&
                          <span className="text-sm sm:text-base md:text-lg text-neutral-500 ml-2">
                            {formattedDate.weekday}
                          </span>}
                      </h2>

                      <div className="space-y-3 sm:space-y-4">
                        {events.map(event =>
                          <SearchEventCard key={event.id} event={event} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            : <div className="text-center py-12 sm:py-16">
                <p className="text-neutral-400 text-base sm:text-lg">
                  No events available
                </p>
              </div>}
        </div>
      </main>
    </div>
  );
}

export default Search;
