import { Helmet } from 'react-helmet-async';
import { AisbPage, SimpleNav, LineFooter } from '../../components/aisb/Layout';
import { Shot, Bullets } from '../../components/aisb/ui';
import OptInForm from '../../components/aisb/OptInForm';

/**
 * The 70-ideas lead magnet. Distinct from the app idea quiz: this one hands
 * over a browsable list, the quiz gives you one personalised idea. They feed
 * different Kit forms so subscribers land in the right sequence.
 */
export default function OptInIdeas() {
  return (
    <AisbPage>
      <Helmet>
        <title>70 AI Tools You Could Build and Monetise | AI for Service Businesses</title>
        <meta
          name="description"
          content="Browse 70 AI tool ideas across 14 industries, filtered by niche and tool type, each with a clear monetisation angle. Free."
        />
        <link rel="canonical" href="https://aiforservicebusinesses.co/ideas" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiforservicebusinesses.co/ideas" />
        <meta property="og:title" content="70 AI Tools You Could Build and Monetise" />
        <meta property="og:image" content="https://aiforservicebusinesses.co/og-image.jpg" />
      </Helmet>

      <SimpleNav />

      <div className="wrap-mid">
        <section className="optin">
          <div className="kick pill">Free resource</div>
          <h1 className="serif wide">
            70 AI tools you could build and monetise this week. <em>No code required.</em>
          </h1>
          <p className="lead">
            Browse 70 ideas across 14 industries, filtered by niche and tool type, each with a clear monetisation
            angle. Find your idea in minutes.
          </p>
        </section>

        <div className="preview">
          <Shot src="/ideas-thumbnail.jpg" alt="The 70 AI tool ideas list" loading="eager" />
        </div>

        <Bullets
          items={[
            <>
              <b>70 ideas across 14 industries</b>, so there is something for your kind of business.
            </>,
            <>
              <b>Filter by niche and tool type</b>, and stop scrolling past things you would never build.
            </>,
            <>
              <b>A clear monetisation angle</b> on every one, not just a nice thought.
            </>,
            <>
              <b>Browsable in minutes</b>, and yours to come back to whenever the well runs dry.
            </>,
          ]}
        />

        <OptInForm
          endpoint="/api/subscribe-ideas"
          heading="Get the 70 ideas, free."
          sub="Pop your details in and I'll take you straight to the list."
          submitLabel="Show me the ideas"
          redirectTo="/ideas-access"
          finePrint="You'll also get occasional emails about building with AI and what I'm working on inside AI for Service Businesses. No spam, unsubscribe any time."
        />
      </div>

      <LineFooter />
    </AisbPage>
  );
}
