import { ALL_SIGS } from '@/config/sigs.ts'

interface SigsFilterProps {
  selectedSigs: Array<string>
  onToggle: (id: string) => void
}

function SigsFilter({ selectedSigs, onToggle }: SigsFilterProps) {
  return (
    <div className="relative -mx-4 md:mx-0">
      <ul
        className="
          flex flex-row gap-2 overflow-x-auto px-4 pb-2
          md:flex-col md:gap-0.5 md:overflow-visible md:px-0 md:pb-0
          [scrollbar-width:none] [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {ALL_SIGS.map((sig) => {
          const isSelected = selectedSigs.includes(sig.id)
          return (
            <li key={sig.id} className="shrink-0 md:shrink">
              <button
                type="button"
                onClick={() => onToggle(sig.id)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors
                  md:w-full md:gap-3 md:px-2.5 md:py-2 md:rounded-sm
                  ${
                    isSelected
                      ? 'bg-card-hover border-neutral-500 text-white shadow-sm'
                      : 'bg-card border-card-border md:bg-transparent md:border-transparent hover:bg-card md:hover:border-card-border'
                  }
                `}
              >
                <img
                  src={sig.logo}
                  alt={`${sig.name} logo`}
                  className="h-4 w-4 md:h-5 md:w-5 object-contain shrink-0"
                />
                <span className="text-sm md:text-[15px] text-neutral-200 whitespace-nowrap md:truncate">
                  {sig.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div
        aria-hidden="true"
        className="md:hidden pointer-events-none absolute left-0 top-0 bottom-2 w-6 bg-linear-to-r from-surface to-transparent"
      />
      <div
        aria-hidden="true"
        className="md:hidden pointer-events-none absolute right-0 top-0 bottom-2 w-6 bg-linear-to-l from-surface to-transparent"
      />
    </div>
  )
}

export default SigsFilter
