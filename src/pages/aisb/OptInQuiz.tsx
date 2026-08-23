import { Helmet } from 'react-helmet-async';
import { AisbPage, SimpleNav, LineFooter } from '../../components/aisb/Layout';
import { Shot, Bullets } from '../../components/aisb/ui';
import OptInForm from '../../components/aisb/OptInForm';

export default function OptInQuiz() {
  return (
    <AisbPage>
      <Helmet>
        <title>Find Your App Idea: Free Quiz | AI for Service Businesses</title>
        <meta
          name="description"
          content="A free quiz that gives you a personalised idea for the first thing your service business should build with AI."
        />
        <link rel="canonical" href="https://aiforservicebusinesses.co/resources/find-your-app-idea" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiforservicebusinesses.co/resources/find-your-app-idea" />
        <meta property="og:title" content="Find Your App Idea: Free Quiz" />
        <meta property="og:image" content="https://aiforservicebusinesses.co/og-image.jpg" />
      </Helmet>

      <SimpleNav />

      <div className="wrap-mid">
        <section className="optin">
          <div className="kick pill">Free tool</div>
          <h1 className="serif">
            Find your <em>app idea.</em>
          </h1>
          <p className="lead">
            Not sure what to build first? Answer a few quick questions and get a personalised idea for the first thing
            your business should build with AI, matched to your work and your goals.
          </p>
        </section>

        <div className="preview">
          <Shot src="/ideas-thumbnail.jpg" alt="Find your app idea" loading="eager" />
        </div>

        <Bullets
          items={[
            <>
              <b>A personalised app idea</b>, tailored to your business, not a generic list.
            </>,
            <>
              <b>Matched to your actual work</b>, so it's something you'd genuinely use.
            </>,
            <>
              <b>A clear first step</b>, so you stop wondering and start building.
            </>,
            <>
              <b>Takes two minutes</b>, and the result is yours straight away.
            </>,
          ]}
        />

        <OptInForm
          endpoint="/api/subscribe-ideas"
          heading="Get your app idea."
          sub="Pop your details in and start the quiz."
          submitLabel="Find my app idea"
          redirectTo="/app-idea"
          finePrint="You'll also get occasional emails about building with AI and what I'm working on inside AI for Service Businesses. No spam, unsubscribe any time."
        />
      </div>

      <LineFooter />
    </AisbPage>
  );
}
