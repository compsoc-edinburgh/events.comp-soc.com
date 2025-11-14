"use client";

import React from "react";

interface SIGsCarouselProps {
  organizer?: string;
}

interface SIGColors {
  border: string;
  background: string;
  text: string;
}

const SIG_COLORS: Record<string, SIGColors> = {
  projectshare: { border: "#ffffff", background: "#7a16f5", text: "#ffffff" },
  sigint: { border: "#666666", background: "#000000", text: "#ffffff" },
  ccsig: { border: "#3b6d8f", background: "#153d59", text: "#ffffff" },
  cloudsig: { border: "#f2a530", background: "#ff9900", text: "#ffffff" },
  edinburghai: { border: "#e37f2d", background: "#cc640e", text: "#ffffff" },
  typesig: { border: "#60a5fa", background: "#008ee0", text: "#ffffff" },
  tardis: { border: "#5a8fc7", background: "#2a5085", text: "#ffffff" },
  gamedevsig: { border: "#3cab98", background: "#000000", text: "#ffffff" },
  evp: { border: "#ffffff", background: "#3333f5", text: "#ffffff" },
  quantsig: { border: "#ffffff", background: "#0a182e", text: "#ffffff" },
  bitsig: { border: "#ff0000", background: "#ffffff", text: "#000000" },
  compsoc: { border: "#737373", background: "#262626", text: "#ffffff" },
};

const ALL_SIGS = [
  { id: "compsoc", name: "CompSoc", logo: "/SIGs/compsoc-short.png" },
  { id: "projectshare", name: "ProjectShare", logo: "/SIGs/projectshare.png" },
  { id: "tardis", name: "TARDIS", logo: "/SIGs/tardis.webp" },
  { id: "typesig", name: "TypeSIG", logo: "/SIGs/typesig.webp" },
  { id: "sigint", name: "SIGINT", logo: "/SIGs/sigint.webp" },
  { id: "quantsig", name: "QuantSIG", logo: "/SIGs/quantsig.svg" },
  { id: "gamedevsig", name: "GameDevSIG", logo: "/SIGs/gamedevsig.webp" },
  { id: "edinburghai", name: "Edinburgh AI", logo: "/SIGs/edinburghai.webp" },
  { id: "evp", name: "EVP", logo: "/SIGs/evp.png" },
  { id: "bitsig", name: "BitSIG", logo: "/SIGs/bitsig.png" },
  { id: "cloudsig", name: "CloudSIG", logo: "/SIGs/CloudSIGLogo.png" },
  { id: "ccsig", name: "CCSIG", logo: "/SIGs/ccsig.webp" },
];

export const SIGsCarousel = ({ organizer = "compsoc" }: SIGsCarouselProps) => {
  const organizerLower = organizer.toLowerCase();
  const organizerColors = SIG_COLORS[organizerLower] || SIG_COLORS.compsoc;
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const organizerRef = React.useRef<HTMLDivElement>(null);
  const [orderedSigs, setOrderedSigs] = React.useState<typeof ALL_SIGS>([]);
  const [isClient, setIsClient] = React.useState(false);

  // Randomize and reorder SIGs with organizer in the center (client-side only)
  React.useEffect(() => {
    setIsClient(true);

    // Shuffle all SIGs
    const shuffled = [...ALL_SIGS].sort(() => Math.random() - 0.5);

    // Find the organizer and remove it from the shuffled array
    const organizerIndex = shuffled.findIndex(
      (sig) => sig.id === organizerLower
    );
    let organizerSig;
    if (organizerIndex !== -1) {
      organizerSig = shuffled.splice(organizerIndex, 1)[0];
    } else {
      organizerSig =
        ALL_SIGS.find((sig) => sig.id === organizerLower) || ALL_SIGS[0];
    }

    // Insert organizer in the middle
    const middleIndex = Math.floor(shuffled.length / 2);
    shuffled.splice(middleIndex, 0, organizerSig);

    setOrderedSigs(shuffled);
  }, [organizerLower]);

  // Scroll to center the organizer badge after order is set
  React.useEffect(() => {
    if (
      isClient &&
      scrollContainerRef.current &&
      organizerRef.current &&
      orderedSigs.length > 0
    ) {
      const container = scrollContainerRef.current;
      const organizerElement = organizerRef.current;

      const containerWidth = container.offsetWidth;
      const organizerLeft = organizerElement.offsetLeft;
      const organizerWidth = organizerElement.offsetWidth;

      const scrollPosition =
        organizerLeft - containerWidth / 2 + organizerWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [orderedSigs, isClient]);

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
              const isOrganizer = sig.id === organizerLower;
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
                          borderStyle: "solid",
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
                    style={
                      isOrganizer
                        ? { color: organizerColors.text }
                        : { color: "#a3a3a3" }
                    }
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
