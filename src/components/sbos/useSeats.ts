import { useState, useEffect } from 'react';
import { SEATS_ENDPOINT, SEATS_TOTAL } from './config';

/**
 * Live founding-seat count, shared by the sales page and the checkout page.
 *
 * Returns null unless the endpoint reports `live: true`. That check matters:
 * when Redis is not configured the endpoint answers `{remaining: 40, sold: 0,
 * live: false}`, and rendering "40 of 40 seats left" off the back of that would
 * be presenting a fallback as a live number. Null means the page quotes the
 * flat cap instead, which is honest either way.
 *
 * Polls every 30 seconds so a page left open reflects sales as they land.
 */
export const useSeats = () => {
  const [seats, setSeats] = useState<number | null>(null);

  useEffect(() => {
    if (!SEATS_ENDPOINT) return;
    let cancelled = false;

    const read = () => {
      fetch(SEATS_ENDPOINT)
        .then((r) => r.json())
        .then((d) => {
          if (cancelled) return;
          if (d?.live === true && typeof d.remaining === 'number') {
            setSeats(Math.max(0, Math.min(SEATS_TOTAL, d.remaining)));
          }
        })
        .catch(() => {});
    };

    read();
    const id = setInterval(read, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return seats;
};

/**
 * How the seat count reads on the page.
 *
 * Before anything sells, "40 of 40 seats left" is technically true but limp,
 * so a full house falls back to the flat claim. The countdown carries the
 * urgency until the count starts telling a story of its own.
 */
export const seatLabel = (seats: number | null) =>
  seats === null || seats >= SEATS_TOTAL
    ? `Only ${SEATS_TOTAL} founding seats`
    : `${seats} of ${SEATS_TOTAL} seats left`;
