import parse, { Element, domToReact } from 'html-react-parser'
import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Nullable } from '@events.comp-soc.com/shared'
import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser'
import type { MarkdownResult } from '@/lib/markdown.ts'
import { renderMarkdown } from '@/lib/markdown.ts'

type MarkdownProps = {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  const [result, setResult] = useState<Nullable<MarkdownResult>>(null)

  useEffect(() => {
    renderMarkdown(content).then(setResult)
  }, [content])

  if (!result) {
    return (
      <div className={`prose-event animate-pulse ${className ?? ''}`}>
        <div className="h-4 bg-neutral-800 rounded w-3/4 mb-4" />
        <div className="h-4 bg-neutral-800 rounded w-full mb-4" />
        <div className="h-4 bg-neutral-800 rounded w-5/6 mb-4" />
      </div>
    )
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === 'a') {
          const href = domNode.attribs.href
          if (href.startsWith('/')) {
            return (
              <Link to={href} className="hover:opacity-80 transition-opacity">
                {domToReact(domNode.children as Array<DOMNode>, options)}
              </Link>
            )
          }
        }

        if (domNode.name === 'img') {
          return (
            <span className="block my-8 group">
              <img
                {...domNode.attribs}
                loading="lazy"
                className="rounded-lg border border-neutral-800 shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                alt={domNode.attribs.alt || 'markdown-img'}
              />
              {domNode.attribs.alt && (
                <span className="block text-center text-xs text-neutral-500 mt-3 font-mono">
                  {domNode.attribs.alt}
                </span>
              )}
            </span>
          )
        }
      }
    },
  }

  return (
    <div className={`prose-event ${className ?? ''}`}>
      {parse(result.markup, options)}
    </div>
  )
}
