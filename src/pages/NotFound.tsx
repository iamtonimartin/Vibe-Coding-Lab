import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AisbPage, TopNav, LineFooter } from '../components/aisb/Layout';

/**
 * The catch-all 404.
 *
 * noindex, follow: the page itself has no business in search, but the links on
 * it lead somewhere real, so crawlers are welcome to follow them.
 *
 * TopNav rather than the bare logo: someone who has landed here is already
 * lost, and the whole site in the corner is the fastest way out. LineFooter
 * because the page is short, and a forest footer band halfway up a cream page
 * looks like the page failed to load.
 */
export default function NotFound() {
  return (
    <AisbPage>
      <Helmet>
        <title>Page not found | AI for Service Businesses</title>
        <meta name="description" content="That page does not exist." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <TopNav />

      {/* Centred in what is left of the viewport, so a page this short does not
          leave its footer stranded halfway up the screen. */}
      <div
        className="wrap-narrow"
        style={{ display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 230px)' }}
      >
        <section className="optin" style={{ width: '100%', padding: '40px 0 60px' }}>
          <div className="kick pill">404 &middot; Page not found</div>
          <h1 className="serif">
            Lost the <em>thread?</em>
          </h1>
          <p className="lead">That page does not exist, or it has moved somewhere else. Here is the way back.</p>
          <div className="cta-row" style={{ marginTop: '34px' }}>
            <Link to="/" className="btn">
              Back to home
            </Link>
            <Link to="/resources" className="btn-ghost">
              Browse the free resources
            </Link>
          </div>
        </section>
      </div>

      <LineFooter />
    </AisbPage>
  );
}
