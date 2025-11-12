import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "../components/link";
import { LINKS, SOCIAL_LINKS } from "../lib/const";

const MadeBy = () => (
  <p className="text-xs text-neutral-600 text-center select-none mt-4 flex gap-1 items-center justify-center flex-wrap">
    Made by{" "}
    <a
      href="https://danyilbutov.com"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition-colors duration-200 flex items-center gap-1"
    >
      Danyil Butov
      <ArrowTopRightIcon className="w-3 h-3" />
    </a>
  </p>
);

function Footer() {
  return (
    <footer className="border-t border-neutral-700 text-neutral-500 text-sm px-3 py-6 flex flex-col gap-4 mt-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
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
          {SOCIAL_LINKS.map((socialLink) => (
            <Link
              key={socialLink.href}
              href={socialLink.href}
              icon={<socialLink.icon className="w-5 h-5" />}
              ariaLabel={socialLink.label}
            />
          ))}
        </div>
      </div>

      <MadeBy />
    </footer>
  );
}

export default Footer;
