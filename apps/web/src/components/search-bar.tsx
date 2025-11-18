import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <label className="relative w-full">
      <span className="sr-only">Search events</span>
      <MagnifyingGlassIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search events..."
        className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg py-2 pl-9 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
      />
    </label>
  );
}
