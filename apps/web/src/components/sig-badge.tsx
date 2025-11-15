import type { Sigs } from "@monorepo/types";
import { getSigById, getSigColors } from "../lib/sigs";

interface SigBadgeProps {
  sig: Sigs;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const SigBadge = ({
  sig,
  size = "md",
  className = ""
}: SigBadgeProps) => {
  const sizeClasses = {
    sm: {
      container: "px-2 py-0.5",
      logo: "h-3 w-3",
      text: "text-xs"
    },
    md: {
      container: "px-2 py-0.5",
      logo: "h-3.5 w-3.5 sm:h-4 sm:w-4",
      text: "text-xs"
    },
    lg: {
      container: "px-3 sm:px-4 py-2 sm:py-3",
      logo: "h-4 w-4 sm:h-5 sm:w-5",
      text: "text-xs sm:text-sm"
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-md border ${sizes.container} ${className}`}
      style={{
        backgroundColor: getSigColors(sig).background,
        borderColor: getSigColors(sig).border
      }}
    >
      <img
        src={getSigById(sig)?.logo}
        alt={`${getSigById(sig)?.name} logo`}
        className={`${sizes.logo} object-contain shrink-0`}
      />
      <span
        className={`${sizes.text} font-medium truncate`}
        style={{ color: getSigColors(sig).text }}
      >
        {getSigById(sig)?.name}
      </span>
    </div>
  );
};
