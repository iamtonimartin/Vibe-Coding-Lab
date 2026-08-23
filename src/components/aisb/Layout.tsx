import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_URL } from '../../config/external';

/**
 * Shared furniture for the AI for Service Businesses pages.
 *
 * Everything renders inside <div className="aisb">, which is what scopes
 * src/styles/aisb.css away from the older deck pages. If you build a new page
 * in this system, wrap it in <AisbPage> or the styling will not apply.
 */

const LOGO_SRC = '/aisb-logo-lightbg.png';

export function AisbPage({ children }: { children: ReactNode }) {
  return <div className="aisb">{children}</div>;
}

/** Full navigation, used on the pages people browse. */
export function TopNav({ cta = 'Join', ctaHref = '/join' }: { cta?: string; ctaHref?: string }) {
  return (
    <nav className="topnav">
      <div className="wrap">
        <Link to="/" className="brand">
          <img src={LOGO_SRC} alt="AI for Service Businesses" className="logo" width={1938} height={263} />
        </Link>
        <div className="navlinks">
          <Link to="/">Home</Link>
          <Link to="/resources">Resources</Link>
          <a href={BLOG_URL} target="_blank" rel="noopener noreferrer">
            Blog
          </a>
          <Link className="joinbtn" to={ctaHref}>
            {cta}
          </Link>
        </div>
      </div>
    </nav>
  );
}

/**
 * Sales-page nav: logo plus a single buy button. Deliberately has no way to
 * wander off to the rest of the site.
 */
export function SalesNav({ cta, ctaHref }: { cta: string; ctaHref: string }) {
  return (
    <nav className="topnav">
      <div className="wrap-mid">
        <Link to="/" className="brand">
          <img src={LOGO_SRC} alt="AI for Service Businesses" className="logo" width={1938} height={263} />
        </Link>
        <a className="joinbtn" href={ctaHref}>
          {cta}
        </a>
      </div>
    </nav>
  );
}

/** Opt-in nav: the logo and nothing else. */
export function SimpleNav() {
  return (
    <nav className="snav">
      <div className="wrap-mid">
        <Link to="/" className="brand">
          <img src={LOGO_SRC} alt="AI for Service Businesses" className="logo" width={1938} height={263} />
        </Link>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="sitefoot">
      <div className="wrap">
        <div>AI for Service Businesses &middot; aiforservicebusinesses.co</div>
        <div className="flinks">
          <Link to="/">Home</Link>
          <Link to="/resources">Resources</Link>
          <a href={BLOG_URL} target="_blank" rel="noopener noreferrer">
            Blog
          </a>
          <Link to="/join">Join</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

export function SimpleFooter() {
  return <footer className="simplefoot">AI for Service Businesses &middot; aiforservicebusinesses.co</footer>;
}

/** Hairline footer for pages that sit on paper rather than ending on forest. */
export function LineFooter() {
  return (
    <footer className="linefoot">
      <div className="wrap-mid">
        &copy; {new Date().getFullYear()} AI for Service Businesses by Ascendz &middot;{' '}
        <Link to="/">aiforservicebusinesses.co</Link>
      </div>
    </footer>
  );
}
