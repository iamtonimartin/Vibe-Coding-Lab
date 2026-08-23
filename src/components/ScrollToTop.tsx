import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * React Router keeps the scroll position when you move between routes, so
 * clicking a link near the bottom of a long page drops you into the middle of
 * the next one. This puts every navigation back at the top.
 *
 * Three cases it deliberately does not flatten:
 *
 *  - A hash in the URL (#join, #get) means the visitor asked for a specific
 *    section, so we scroll there instead of to the top.
 *  - Back and forward (POP) leave the browser's own scroll restoration alone,
 *    because losing your place when you go back is worse than the bug above.
 *  - The jump is instant, not smooth. The new page is already rendered, so
 *    animating a scroll through content the visitor never asked to see just
 *    makes navigation feel slow.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;

    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash, navigationType]);

  return null;
}
