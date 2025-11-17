import SectionHeader from "./section-header";

interface LocationProps {
  locationName: string;
  description: string;
  mapEmbedUrl: string;
  mapTitle?: string;
}

function Location({
  locationName,
  description,
  mapEmbedUrl,
  mapTitle = "Location Map"
}: LocationProps) {
  return (
    <section className="mt-8 sm:mt-10">
      <SectionHeader title="Location" />
      <p className="text-neutral-200 leading-relaxed mb-1 text-sm sm:text-base">{locationName}</p>
      <p className="text-neutral-500 leading-relaxed mb-4 sm:mb-5 text-xs sm:text-sm">
        {description}
      </p>
      <div className="w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden border border-neutral-800 shadow-md">
        <iframe
          title={mapTitle}
          width="100%"
          height="100%"
          style={{ border: 0, pointerEvents: "none" }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`${mapEmbedUrl}&gestureHandling=none&scrollwheel=0`}
        />
      </div>
    </section>
  );
}

export default Location;
