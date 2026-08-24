import { Helmet } from 'react-helmet-async';
import { AisbPage, SimpleNav, LineFooter } from '../components/aisb/Layout';

/**
 * Where the unsubscribe link in the emails lands.
 *
 * The logo and nothing else: they have just stepped away from the emails, so
 * this is not the moment to put the whole site and a Join button in front of
 * them. Say it is done, say they are welcome back, stop talking.
 */
export default function Unsubscribe() {
  return (
    <AisbPage>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>You are all set | AI for Service Businesses</title>
      </Helmet>

      <SimpleNav />

      {/* Centred in what is left of the viewport, so a page this short does not
          leave its footer stranded halfway up the screen. */}
      <div
        className="wrap-narrow"
        style={{ display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 230px)' }}
      >
        <section className="optin" style={{ width: '100%', padding: '40px 0 60px' }}>
          <div className="kick pill">Preferences updated</div>
          <h1 className="serif">
            You are <em>all set.</em>
          </h1>
          <p className="lead">
            You will not receive any more emails about AI for Service Businesses. You will still stay on the list for
            other updates, insights, tips and resources that could support your business.
          </p>
          <p className="lead" style={{ marginTop: '20px' }}>
            If you ever change your mind or want to explore AI for Service Businesses in the future, you will be more
            than welcome back. In the meantime, thanks for sticking around. I appreciate you.
          </p>
          <p className="finenote" style={{ marginTop: '38px' }}>
            <b style={{ color: 'var(--ink)' }}>Toni</b>
            <br />
            Creator of AI for Service Businesses &middot; Founder of Ascendz
          </p>
        </section>
      </div>

      <LineFooter />
    </AisbPage>
  );
}
