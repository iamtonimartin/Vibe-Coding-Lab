import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AisbPage, SimpleNav, LineFooter } from '../../components/aisb/Layout';

/**
 * Where Stripe sends people after they pay for The AI Build Standards.
 *
 * Set this as the "After payment" redirect on the Stripe payment link, or
 * buyers land on Stripe's own generic confirmation and never learn that the
 * guide arrives by email.
 *
 * noindex: it is a post-purchase page, so it has no business in search, and an
 * indexed thank-you page is a classic way to leak a paid product.
 */
const SUPPORT_EMAIL = 'clientsupport@ascendz.co';

export default function StandardsThankYou() {
  return (
    <AisbPage>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Thank you | The AI Build Standards</title>
      </Helmet>

      <SimpleNav />

      <div className="wrap-narrow">
        <section className="optin">
          <div className="kick pill">Order complete</div>
          <h1 className="serif">
            Thank you. Your guide is <em>on its way.</em>
          </h1>
          <p className="lead">
            Your payment went through and The AI Build Standards is being sent to the email address you used at
            checkout. It usually lands within a few minutes.
          </p>
        </section>

        <div className="formwrap formwrap-mid">
          <h2 className="serif">While you wait</h2>
          <div className="fsub">Two things worth doing now, so it does not go astray.</div>
          <ul className="painlist" style={{ marginTop: 0 }}>
            <li>
              If it has not arrived in ten minutes, check your spam or promotions folder. It is the most common place
              for it to end up.
            </li>
            <li>
              Add the sender to your contacts, so the rest of what I send you comes straight to your inbox.
            </li>
          </ul>
          <p className="finenote">
            Still nothing after that? Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and I will get it to
            you directly.
          </p>
        </div>
      </div>

      <div className="wrap-narrow panelwrap">
        <section className="panel center">
          <div className="k">While you are here</div>
          <h2 className="serif">The standards keep your builds honest. The community teaches you the rest.</h2>
          <p>
            You now have the prompts that hold a build to a proper standard. If you want the method behind them, that is
            what the community is for.
          </p>
          <Link to="/join" className="btn">
            See what's inside
          </Link>
        </section>
      </div>

      <div className="wrap-narrow" style={{ textAlign: 'center', paddingBottom: '40px' }}>
        <Link to="/resources" className="btn-ghost">
          Back to the free resources
        </Link>
      </div>

      <LineFooter />
    </AisbPage>
  );
}
