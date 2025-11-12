import type { ReactNode } from "react";

interface LinkProps {
  href: string;
  icon: ReactNode;
  ariaLabel?: string;
}

function Link({ href, icon, ariaLabel }: LinkProps) {
  return (
    <a
      href={href}
      className="hover:text-white transition-colors duration-200"
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}

export default Link;
