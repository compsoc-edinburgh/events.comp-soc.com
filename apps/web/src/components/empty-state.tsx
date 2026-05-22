import type { ReactNode } from 'react'

interface EmptyStateProps {
  /** Path to an image in `public/`, e.g. `/no-events.png`. Omit for text-only. */
  image?: string
  imageAlt?: string
  title?: string
  description?: string
  /** Extra actions (buttons, links) rendered below the description. */
  children?: ReactNode
  className?: string
}

/**
 * Centered illustration + caption for empty lists / "nothing here yet" states.
 * Lives inside an existing scroll container — call sites control the height.
 */
function EmptyState({
  image,
  imageAlt = '',
  title,
  description,
  children,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center text-center px-4 ${className}`}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className="w-48 h-48 sm:w-60 sm:h-60 object-contain select-none [-webkit-user-drag:none] [-webkit-touch-callout:none]"
        />
      )}
      {title && (
        <p className="mt-4 text-md font-semibold text-neutral-700">{title}</p>
      )}
      {description && (
        <p className="mt-2 text-sm text-neutral-500 max-w-md">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

export default EmptyState
