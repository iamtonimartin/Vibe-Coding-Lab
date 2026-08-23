import type { ReactNode } from 'react';

/**
 * An image slot. Pass `src` for artwork we have, or `placeholder` for one Toni
 * still needs to supply. Placeholders render dashed and obviously unfinished so
 * they can never be mistaken for the real thing on a live page.
 */
export function Shot({
  src,
  alt,
  placeholder,
  className = '',
  loading = 'lazy',
}: {
  src?: string;
  alt?: string;
  placeholder?: ReactNode;
  className?: string;
  loading?: 'lazy' | 'eager';
}) {
  if (src) {
    return (
      <div className={`shot ${className}`.trim()}>
        <img src={src} alt={alt ?? ''} loading={loading} />
      </div>
    );
  }
  return (
    <div className={`shot ph ${className}`.trim()} role="img" aria-label={alt ?? 'Image to be supplied'}>
      <span>{placeholder}</span>
    </div>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** The ticked "what's inside" list used on all three opt-in pages. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <div className="bullets">
      <div className="bgrid">
        {items.map((item, i) => (
          <div className="bitem" key={i}>
            <span className="tick">
              <TickIcon />
            </span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Line icons for the resource cards. Stroke and sizing come from .ricon svg. */
export const resourceIcons = {
  book: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  bulb: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.6.6 1 1.4 1 2h6c0-.6.4-1.4 1-2a7 7 0 0 0-4-12z" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

/**
 * A screenshot in a browser frame. Used where the point is "this is a real,
 * working product", which a bare screenshot on a cream page does not quite
 * say on its own.
 */
export function BrowserShot({
  src,
  alt,
  placeholder,
  loading = 'lazy',
}: {
  src?: string;
  alt?: string;
  placeholder?: ReactNode;
  loading?: 'lazy' | 'eager';
}) {
  return (
    <div className={src ? 'browser' : 'browser ph'}>
      <div className="bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      {src ? (
        <img src={src} alt={alt ?? ''} loading={loading} />
      ) : (
        <div className="phbody" role="img" aria-label={alt ?? 'Screenshot to be supplied'}>
          <span>{placeholder}</span>
        </div>
      )}
    </div>
  );
}
