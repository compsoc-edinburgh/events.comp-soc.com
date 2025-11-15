"use client";

import { Sigs } from "@monorepo/types";
import { formatDateHeader } from "../../lib/utils";
import SearchEventCard from "../../modules/search-event-card";

const mockEvents = [
  {
    id: "1",
    organizer: { sig: Sigs.TypeSig },
    hero: {
      title: "MathSoc x TypeSig: Lean Sesh",
      tags: ["Mathematics", "Proof Assistants", "Lean", "Logic"],
    },
    description:
      "Join us for a collaborative session with MathSoc! Try out the Lean proof assistant and solve logic puzzles.",
    date: "2025-11-20",
    startTime: "18:00",
    endTime: "20:00",
    location: "Informatics Forum, Room G.07",
    image: "/sigs/typesig.webp",
  },
  {
    id: "2",
    organizer: { sig: Sigs.GameDevSig },
    hero: {
      title: "Game Dev Workshop: Unity Basics",
      tags: ["Game Development", "Unity", "C#", "Workshop"],
    },
    description:
      "Learn the basics of Unity game development in this hands-on workshop. Perfect for beginners!",
    date: "2025-11-20",
    startTime: "19:30",
    endTime: "21:30",
    location: "Appleton Tower, Room 2.14",
    image: "/sigs/gamedev.webp",
  },
  {
    id: "3",
    organizer: { sig: Sigs.EdinburghAI },
    hero: {
      title: "AI Ethics Discussion Panel",
      tags: ["AI", "Ethics", "Panel Discussion", "Machine Learning"],
    },
    description:
      "Join industry experts and academics discussing the ethical implications of AI technology.",
    date: "2025-11-22",
    startTime: "19:00",
    endTime: "21:00",
    location: "Informatics Forum, Atrium",
    image: "/sigs/ai.webp",
  },
  {
    id: "4",
    organizer: { sig: Sigs.CloudSig },
    hero: {
      title: "AWS Certification Study Group",
      tags: ["Cloud", "AWS", "Certification", "Study"],
    },
    description:
      "Prepare for AWS certification exams with fellow students. Share resources and study tips.",
    date: "2025-11-25",
    startTime: "16:00",
    endTime: "18:00",
    location: "Bayes Centre, Room 5.02",
    image: "/sigs/cloud.png",
  },
  {
    id: "5",
    organizer: { sig: Sigs.SigInt },
    hero: {
      title: "CTF Night: Capture The Flag",
      tags: ["Security", "CTF", "Hacking", "Competition"],
    },
    description:
      "Test your cybersecurity skills in our monthly Capture The Flag competition. All levels welcome!",
    date: "2025-11-27",
    startTime: "18:30",
    endTime: "22:00",
    location: "Informatics Forum, Room G.03",
    image: "/sigs/sigint.webp",
  },
  {
    id: "6",
    organizer: { sig: Sigs.QuantSig },
    hero: {
      title: "Quantitative Finance Workshop",
      tags: ["Finance", "Algorithms", "Trading", "Math"],
    },
    description:
      "Explore algorithmic trading strategies and quantitative finance concepts with guest speakers from top firms.",
    date: "2025-11-27",
    startTime: "17:00",
    endTime: "19:00",
    location: "Business School, Lecture Theatre",
    image: "/sigs/quant.svg",
  },
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
      <main className="flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <div className="mb-6 sm:mb-8 md:mb-12">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-3 sm:mb-4">
              Events
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base md:text-lg">
              Explore upcoming events from CompSoc and our special interest
              groups
            </p>
          </div>

          {Object.keys(groupedEvents).length > 0 ? (
            <div className="space-y-6 sm:space-y-8">
              {Object.entries(groupedEvents).map(([date, events]) => (
                <div key={date} className="relative">
                  <div className="flex items-center gap-3 sm:gap-5 mb-3 sm:mb-4">
                    <div className="shrink-0 w-2 h-2 rounded-full bg-neutral-500" />
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold flex flex-col sm:flex-row gap-1 sm:gap-3 items-center">
                      <span>{formatDateHeader(date)}</span>
                    </h2>
                  </div>

                  <div className="absolute left-[3px] top-7 sm:top-8 bottom-0 w-0.5 bg-neutral-800" />

                  <div className="space-y-3 sm:space-y-4 ml-6 sm:ml-8">
                    {events.map((event) => (
                      <SearchEventCard event={event} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-neutral-400 text-base sm:text-lg">
                No events available
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Search;
