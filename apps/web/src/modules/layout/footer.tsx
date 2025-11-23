import Link from "../../components/link.tsx";
import { LINKS, SOCIAL_LINKS } from "../../lib/const.ts";

function Footer() {
  return (
    <footer className="border-t border-neutral-700 text-neutral-500 text-sm px-3 py-4 flex flex-col gap-4 mt-20 max-w-2xl mx-auto">
      <div className="flex flex-row justify-between items-start sm:items-center gap-0">
        <nav className="flex gap-4 sm:gap-6 flex-wrap">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex gap-4 items-center">
          {SOCIAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              icon={<link.icon className="w-5 h-5" />}
              ariaLabel={link.label}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
