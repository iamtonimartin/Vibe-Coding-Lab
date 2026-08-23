import { Helmet } from 'react-helmet-async';
import { AisbPage, SimpleNav, LineFooter } from '../../components/aisb/Layout';
import { Shot, Bullets } from '../../components/aisb/ui';
import OptInForm from '../../components/aisb/OptInForm';

export default function OptInVideo() {
  return (
    <AisbPage>
      <Helmet>
        <title>How I Built My First AI App in a Week: Free Video Series | AI for Service Businesses</title>
        <meta
          name="description"
          content="A free video series showing the exact tools, stack and process behind real, deployed AI products."
        />
        <link rel="canonical" href="https://aiforservicebusinesses.co/resources/build-in-a-week" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiforservicebusinesses.co/resources/build-in-a-week" />
        <meta property="og:title" content="How I Built My First AI App in a Week" />
        <meta property="og:image" content="https://aiforservicebusinesses.co/og-video-series.jpg" />
      </Helmet>

      <SimpleNav />

      <div className="wrap-mid">
        <section className="optin">
          <div className="kick pill">Free video series</div>
          <h1 className="serif">
            How I built my first AI app <em>in a week.</em>
          </h1>
          <p className="lead">
            A short, no-fluff video series showing the exact tools, stack and process behind real, deployed products
            like Relavo and Kestry. See what's genuinely possible before you start.
          </p>
        </section>

        <div className="preview">
          <Shot src="/video-thumbnail.jpg" alt="How I built my first AI app in a week" loading="eager" />
        </div>

        <Bullets
          items={[
            <>
              <b>The exact tools and stack</b> behind real, working AI products.
            </>,
            <>
              <b>The full process</b>, from first idea to something deployed and live.
            </>,
            <>
              <b>Built with no code</b>, the same method taught inside the community.
            </>,
            <>
              <b>Short and practical</b>, watch it in an evening.
            </>,
          ]}
        />

        <OptInForm
          endpoint="/api/subscribe"
          heading="Watch the series, free."
          sub="Pop your details in and I'll send you the first video."
          submitLabel="Send me the series"
          redirectTo="/videos"
          finePrint="You'll also get occasional emails about building with AI and what I'm working on inside AI for Service Businesses. No spam, unsubscribe any time."
        />
      </div>

      <LineFooter />
    </AisbPage>
  );
}
