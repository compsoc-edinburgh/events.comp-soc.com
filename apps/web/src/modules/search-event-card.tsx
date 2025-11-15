import { Sigs } from "@monorepo/types";
import { DrawingPinFilledIcon } from "@radix-ui/react-icons";

interface SIGColors {
  border: string;
  background: string;
  text: string;
}

const SIG_COLORS: Record<string, SIGColors> = {
  [Sigs.ProjectShare]: {
    border: "#ffffff",
    background: "#7a16f5",
    text: "#ffffff",
  },
  [Sigs.SigInt]: { border: "#666666", background: "#000000", text: "#ffffff" },
  [Sigs.CCSig]: { border: "#3b6d8f", background: "#153d59", text: "#ffffff" },
  [Sigs.CloudSig]: {
    border: "#f2a530",
    background: "#ff9900",
    text: "#ffffff",
  },
  [Sigs.EdinburghAI]: {
    border: "#e37f2d",
    background: "#cc640e",
    text: "#ffffff",
  },
  [Sigs.TypeSig]: { border: "#60a5fa", background: "#008ee0", text: "#ffffff" },
  [Sigs.Tardis]: { border: "#5a8fc7", background: "#2a5085", text: "#ffffff" },
  [Sigs.GameDevSig]: {
    border: "#3cab98",
    background: "#000000",
    text: "#ffffff",
  },
  [Sigs.Evp]: { border: "#ffffff", background: "#3333f5", text: "#ffffff" },
  [Sigs.QuantSig]: {
    border: "#ffffff",
    background: "#0a182e",
    text: "#ffffff",
  },
  [Sigs.BitSig]: { border: "#ff0000", background: "#ffffff", text: "#000000" },
};

const SIG_INFO: Record<string, { name: string; logo: string }> = {
  [Sigs.ProjectShare]: { name: "ProjectShare", logo: "/sigs/projectshare.png" },
  [Sigs.Tardis]: { name: "TARDIS", logo: "/sigs/tardis.webp" },
  [Sigs.TypeSig]: { name: "TypeSIG", logo: "/sigs/typesig.webp" },
  [Sigs.SigInt]: { name: "SIGINT", logo: "/sigs/sigint.webp" },
  [Sigs.QuantSig]: { name: "QuantSIG", logo: "/sigs/quant.svg" },
  [Sigs.GameDevSig]: { name: "GameDevSIG", logo: "/sigs/gamedev.webp" },
  [Sigs.EdinburghAI]: { name: "Edinburgh AI", logo: "/sigs/ai.webp" },
  [Sigs.Evp]: { name: "EVP", logo: "/sigs/evp.png" },
  [Sigs.BitSig]: { name: "BitSIG", logo: "/sigs/bitsig.png" },
  [Sigs.CloudSig]: { name: "CloudSIG", logo: "/sigs/cloud.png" },
  [Sigs.CCSig]: { name: "CCSIG", logo: "/sigs/ccsig.webp" },
};

function SearchEventCard({
  event,
}: {
  event: {
    id: string;
    organizer: {
      sig: Sigs;
    };
    hero: {
      title: string;
      tags: string[];
    };
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    image: string;
  };
}) {
  const sigColors = SIG_COLORS[event.organizer.sig];
  const sigInfo = SIG_INFO[event.organizer.sig];

  return (
    <div
      key={event.id}
      className="bg-neutral-800 border border-neutral-700 rounded-lg sm:rounded-xl hover:border-neutral-600 active:scale-[0.99] cursor-pointer group p-3 sm:p-4 md:p-5 transition-all touch-manipulation"
      onClick={() => {
        console.log("Navigate to event:", event.id);
      }}
    >
      <div className="text-neutral-400 text-xs sm:text-sm mb-2 sm:mb-3">
        <span className="font-medium">{event.startTime}</span>
        {" · "}
        <span>{event.endTime} GMT+1</span>
      </div>
      <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 group-hover:text-white leading-snug">
        {event.hero.title}
      </h3>
      <div className="mb-2 sm:mb-3 inline-flex">
        <div
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md sm:rounded-lg"
          style={{
            backgroundColor: sigColors?.background,
            borderColor: sigColors?.border,
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <img
            src={sigInfo?.logo}
            alt={`${sigInfo?.name} logo`}
            className="h-3 w-3 sm:h-3.5 sm:w-3.5 object-contain shrink-0"
          />
          <span
            className="text-xs font-medium"
            style={{ color: sigColors?.text }}
          >
            {sigInfo?.name}
          </span>
        </div>
      </div>
      <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm text-neutral-400">
        <DrawingPinFilledIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 sm:mt-0" />
        <span className="leading-snug">{event.location}</span>
      </div>
    </div>
  );
}

export default SearchEventCard;
