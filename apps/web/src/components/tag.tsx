import type { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  onClick?: () => void;
  append?: ReactNode;
}

function Tag({ children, onClick, append }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium text-neutral-300 bg-neutral-800 rounded-full whitespace-nowrap" +
        (onClick ? " cursor-pointer hover:bg-neutral-700 transition" : "")
      }>
      {children}

      {append && (
        <span
          onClick={(e) => e.stopPropagation()}
          className="flex items-center text-neutral-400 hover:text-white transition">
          {append}
        </span>
      )}
    </span>
  );
}

export default Tag;
