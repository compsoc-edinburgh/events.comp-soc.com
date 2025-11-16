import { Sigs } from "@monorepo/types/const";
import { formatTime } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { SigBadge } from "../components/sig-badge";

function SearchEventCard({
  event
}: {
  event: {
    id: string;
    organizer: { sig: Sigs };
    hero: { title: string; tags: string[] };
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    image: string;
  };
}) {
  const navigate = useNavigate();
  const time = formatTime(event.startTime);

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div
      key={event.id}
      className="relative bg-neutral-800 border border-neutral-700 rounded-lg sm:rounded-xl hover:border-neutral-600 hover:bg-neutral-750 transition-all cursor-pointer group p-4 sm:p-5 touch-manipulation"
      style={{
        transitionTimingFunction: "ease-out"
      }}
      onClick={handleClick}
    >
      <div className="text-neutral-400 text-xs sm:text-sm mb-1 sm:mb-2">
        <span className="font-medium">
          {time}
        </span>
      </div>

      <h3 className="font-semibold text-base sm:text-lg md:text-xl leading-tight group-hover:text-white mb-2">
        {event.hero.title}
      </h3>

      <div className="mb-3">
        <SigBadge sig={event.organizer.sig} size="md" />
      </div>

      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 pt-2">
        <span className="leading-snug truncate">
          {event.location}
        </span>
      </div>
    </div>
  );
}

export default SearchEventCard;
