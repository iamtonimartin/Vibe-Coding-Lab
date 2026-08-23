import { Helmet } from 'react-helmet-async';
import { AisbPage, SimpleNav, LineFooter } from '../../components/aisb/Layout';
import { Shot, Bullets } from '../../components/aisb/ui';
import OptInForm from '../../components/aisb/OptInForm';

export default function OptInPlaybook() {
  return (
    <AisbPage>
      <Helmet>
        <title>The AI Build Playbook: Free Reference Guide | AI for Service Businesses</title>
        <meta
          name="description"
          content="A free plain-English reference to the language, tools and models behind building with AI. Glossary, file types, AI models and toolkit."
        />
        <link rel="canonical" href="https://aiforservicebusinesses.co/resources/ai-build-playbook" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiforservicebusinesses.co/resources/ai-build-playbook" />
        <meta property="og:title" content="The AI Build Playbook: Free Reference Guide" />
        <meta property="og:image" content="https://aiforservicebusinesses.co/og-image.jpg" />
      </Helmet>

      <SimpleNav />

      <div className="wrap-mid">
        <section className="optin">
          <div className="kick pill">Free resource</div>
          <h1 className="serif">
            The AI Build <em>Playbook.</em>
          </h1>
          <p className="lead">
            Everything you need to understand the language, tools and models behind building with AI. All in one place.
            All in plain English.
          </p>
        </section>

        <div className="preview">
          <Shot src="/vibe-playbook-cover.jpg" alt="The AI Build Playbook" loading="eager" />
        </div>

        <Bullets
          items={[
            <>
              <b>A searchable glossary of over 50 terms</b>, explained in plain English with real examples.
            </>,
            <>
              <b>A complete file types reference</b>, so nothing in your project feels mysterious.
            </>,
            <>
              <b>A breakdown of every major AI model</b>, what each is good for and how to choose between them.
            </>,
            <>
              <b>A curated toolkit</b> of the tools that power modern AI builds.
            </>,
          ]}
        />

        <OptInForm
          endpoint="/api/subscribe-playbook"
          heading="Get the playbook, free."
          sub="Pop your details in and I'll send it straight over."
          submitLabel="Send me the playbook"
          redirectTo="/vibeplaybook"
          finePrint="You'll also get occasional emails about building with AI and what I'm working on inside AI for Service Businesses. No spam, unsubscribe any time."
        />
      </div>

      <LineFooter />
    </AisbPage>
  );
}
