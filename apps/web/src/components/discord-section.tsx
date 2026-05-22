const DiscordMascotImage = () => (
  <img
    src="/mascot-discord.png"
    alt="CompSoc mascot"
    draggable={false}
    onContextMenu={(e) => e.preventDefault()}
    onDragStart={(e) => e.preventDefault()}
    className="w-64 h-64 md:w-56 md:h-56 object-contain shrink-0 mx-auto md:mx-0 mt-6 md:mt-0 select-none pointer-events-auto [-webkit-user-drag:none] [-webkit-touch-callout:none]"
  />
)

function DiscordSection() {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_260px] gap-6 md:gap-8">
      <div className="hidden md:block" />
      <div className="space-y-24 min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 leading-tight mb-6">
              Looks like you reached the bottom of the events
            </h2>
            <p className="text-neutral-400 mb-4 max-w-xl">
              CompSoc and our Special Interest Groups have plenty more in the
              pipeline. New hackathons, talks, workshops and socials are added
              all the time.
            </p>
            <p className="text-neutral-400 max-w-xl mb-6">
              Join our Discord to keep up with what's happening, hear about
              events before they go live, and meet the people building things
              with you.
            </p>

            <a
              href="https://discord.gg/compsoc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button className="bg-[#4752c4] rounded-sm p-0 cursor-pointer group mt-2">
                <span className="block px-3 py-1 rounded-sm text-base bg-[#5865f2] text-white -translate-y-1 transition-transform group-active:-translate-y-0.5">
                  Discord
                </span>
              </button>
            </a>
          </div>

          <DiscordMascotImage />
        </div>
      </div>
      <div className="hidden lg:block" />
    </div>
  )
}

export default DiscordSection
