import { formatTime } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { SigBadge } from "../components/sig-badge";
import type { SearchEvent } from "@monorepo/types";
import { EventState } from "@monorepo/types/const";

function SearchEventCard({ event }: { event: SearchEvent }) {
  const navigate = useNavigate();
  const time = formatTime(event.time.start);

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
      <div className="flex items-center justify-between text-neutral-400 text-xs sm:text-sm mb-1 sm:mb-2">
        <span className="font-medium">{time}</span>
        {event.state === EventState.Draft && (
          <span className="ml-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-200">
            Draft
          </span>
        )}
      </div>

      <h3 className="font-semibold text-base sm:text-lg md:text-xl leading-tight group-hover:text-white mb-2">
        {event.heroTitle}
      </h3>

      <div className="mb-3">
        <SigBadge sig={event.organizerSig} size="md" />
      </div>

      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 pt-2">
        <span className="leading-snug truncate">{event.locationName}</span>
      </div>
    </div>
  );
}

export default SearchEventCard;
