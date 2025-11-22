import { type Event } from "@monorepo/types/models";
import SectionHeader from "./section-header";

function Location({ name, description, mapUrl, mapTitle = "Location Map" }: Event["location"]) {
  const mapSrc =
    mapUrl && mapUrl.length > 0
      ? `${mapUrl}${mapUrl.includes("?") ? "&" : "?"}gestureHandling=none&scrollwheel=0`
      : null;

  return (
    <section className="mt-8 sm:mt-10">
      <SectionHeader title="Location" />
      <p className="text-neutral-200 leading-relaxed mb-1 text-sm sm:text-base">{name}</p>
      {description && (
        <p className="text-neutral-500 leading-relaxed mb-4 sm:mb-5 text-xs sm:text-sm">
          {description}
        </p>
      )}
      {mapSrc ? (
        <div className="w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden border border-neutral-800 shadow-md">
          <iframe
            title={mapTitle || "Location Map"}
            width="100%"
            height="100%"
            style={{ border: 0, pointerEvents: "none" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
          />
        </div>
      ) : (
        <div className="w-full rounded-lg border border-dashed border-neutral-800 text-neutral-500 text-sm sm:text-base px-4 py-6 text-center">
          Map information coming soon.
        </div>
      )}
    </section>
  );
}

export default Location;
