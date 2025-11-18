export function TimelineRail() {
  return (
    <div className="absolute left-[3px] top-0 bottom-0 w-px pointer-events-none">
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
  );
}
