import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

import SectionHeader from "./section-header";
import type { ReactNode } from "react";

interface AboutSectionProps {
  content: string;
}

const COMPONENTS = {
  p: ({ children }: { children: ReactNode }) => (
    <p className="text-neutral-200 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">{children}</p>
  ),
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{children}</h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{children}</h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-base sm:text-lg font-medium text-white mb-2">{children}</h3>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc list-inside text-neutral-200 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="list-decimal list-inside text-neutral-200 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="text-neutral-200">{children}</li>
  ),
  strong: ({ children }: { children: ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }: { children: ReactNode }) => (
    <em className="italic text-neutral-300">{children}</em>
  ),
  a: ({ href, children }: { href: string; children: ReactNode }) => (
    <a
      href={href}
      className="text-blue-400 hover:text-blue-300 underline wrap-break-word"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ children }: { children: ReactNode }) => (
    <code className="bg-neutral-800 text-neutral-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm wrap-break-word">
      {children}
    </code>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-2 sm:border-l-4 border-neutral-700 pl-3 sm:pl-4 italic text-neutral-300 my-3 sm:my-4 text-sm sm:text-base">
      {children}
    </blockquote>
  )
};

function AboutMarkdown({ content }: AboutSectionProps) {
  return (
    <section className="mt-8 sm:mt-10">
      <SectionHeader title="About" />
      <div className="prose prose-invert prose-neutral max-w-none">
        <ReactMarkdown components={COMPONENTS as Components}>{content}</ReactMarkdown>
      </div>
    </section>
  );
}

export default AboutMarkdown;
