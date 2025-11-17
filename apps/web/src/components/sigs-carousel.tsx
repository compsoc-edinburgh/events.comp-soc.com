import { Sigs } from "@monorepo/types/const";
import { ALL_SIGS, getSigColors } from "../lib/sigs";
import { useEffect, useRef, useState } from "react";

interface SIGsCarouselProps {
  organizer?: Sigs;
}

export const SIGsCarousel = ({ organizer = Sigs.Compsoc }: SIGsCarouselProps) => {
  const organizerColors = getSigColors(organizer);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const organizerRef = useRef<HTMLDivElement>(null);
  const [orderedSigs, setOrderedSigs] = useState<typeof ALL_SIGS>([]);

  useEffect(() => {
    // Shuffle all SIGs
    const shuffled = [...ALL_SIGS].sort(() => Math.random() - 0.5);

    // Find the organizer and remove it from the shuffled array
    const organizerIndex = shuffled.findIndex((sig) => sig.id === organizer);
    let organizerSig;
    if (organizerIndex !== -1) {
      organizerSig = shuffled.splice(organizerIndex, 1)[0];
    } else {
      organizerSig = ALL_SIGS.find((sig) => sig.id === organizer) || ALL_SIGS[0];
    }

    // Insert organizer in the middle
    const middleIndex = Math.floor(shuffled.length / 2);
    shuffled.splice(middleIndex, 0, organizerSig as (typeof ALL_SIGS)[number]);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedSigs(shuffled);
  }, [organizer]);

  useEffect(() => {
    if (scrollContainerRef.current && organizerRef.current && orderedSigs.length > 0) {
      const container = scrollContainerRef.current;
      const organizerElement = organizerRef.current;

      const containerWidth = container.offsetWidth;
      const organizerLeft = organizerElement.offsetLeft;
      const organizerWidth = organizerElement.offsetWidth;

      const scrollPosition = organizerLeft - containerWidth / 2 + organizerWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth"
      });
    }
  }, [orderedSigs]);

  return (
    <div className="mb-6 sm:mb-8 w-full">
      <div className="relative">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-linear-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />

        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-linear-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollContainerRef}
          className="flex justify-start overflow-x-hidden pb-2 scrollbar-hide"
        >
          <div className="flex items-center gap-2 sm:gap-4">
            {orderedSigs.map((sig) => {
              const isOrganizer = sig.id === organizer;
              return (
                <div
                  key={sig.id}
                  ref={isOrganizer ? organizerRef : null}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all whitespace-nowrap ${
                    isOrganizer
                      ? ""
                      : "opacity-30 hover:opacity-50 bg-neutral-800 border border-neutral-700"
                  }`}
                  style={
                    isOrganizer
                      ? {
                          backgroundColor: organizerColors.background,
                          borderColor: organizerColors.border,
                          borderWidth: "1px",
                          borderStyle: "solid"
                        }
                      : undefined
                  }
                >
                  <img
                    src={sig.logo}
                    alt={`${sig.name} logo`}
                    className="h-4 w-4 sm:h-5 sm:w-5 object-contain shrink-0"
                  />
                  <span
                    className="text-xs sm:text-sm font-medium"
                    style={isOrganizer ? { color: organizerColors.text } : { color: "#a3a3a3" }}
                  >
                    {sig.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
