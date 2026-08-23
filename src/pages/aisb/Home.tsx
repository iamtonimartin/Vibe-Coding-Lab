import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BLOG_URL, PRICE_GBP_APPROX } from '../../config/external';
import { AisbPage, TopNav, SiteFooter } from '../../components/aisb/Layout';
import { Shot } from '../../components/aisb/ui';


export default function Home() {
  return (
    <AisbPage>
      <Helmet>
        <title>AI for Service Businesses: Build What Your Business Needs, With AI</title>
        <meta
          name="description"
          content="Learn to build the apps, sites and systems your service business needs with AI. No code, no developer. Free resources and a community for service business owners."
        />
        <link rel="canonical" href="https://aiforservicebusinesses.co/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AI for Service Businesses" />
        <meta property="og:url" content="https://aiforservicebusinesses.co/" />
        <meta property="og:title" content="AI for Service Businesses: Build What Your Business Needs, With AI" />
        <meta
          property="og:description"
          content="Learn to build the apps, sites and systems your service business needs with AI. No code, no developer."
        />
        <meta property="og:image" content="https://aiforservicebusinesses.co/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://aiforservicebusinesses.co/og-image.jpg" />
      </Helmet>

      <TopNav />

      <div className="wrap">
        <section className="hero">
          <div>
            <div className="kick">For service business owners</div>
            <h1 className="serif">
              Build what your business needs. <em>With AI.</em>
            </h1>
            <p className="lead">
              No code. No developer. No agency budget. This is where service business owners learn to build the apps,
              sites and systems they actually need, safely and properly, with AI.
            </p>
            <div className="cta-row">
              <Link to="/join" className="btn">
                Join the community
              </Link>
              <Link to="/resources" className="btn-ghost">
                Start free
              </Link>
            </div>
            <div className="underline-note">
              One-time payment. Free resources to start with, no commitment.
            </div>
          </div>
          <Shot
            className="heroimg ratio-4-5 frame"
            src="https://ascendz.co/wp-content/uploads/2026/03/Toni-Martin-The-Vibe-Coding-Lab.jpg"
            alt="Toni Martin, founder of AI for Service Businesses"
            loading="eager"
          />
        </section>
      </div>

      <section className="band">
        <div className="wrap">
          <h2 className="serif">
            The people building are not smarter than you. <b>They just started.</b>
          </h2>
          <p>
            Building with AI isn't a secret skill reserved for developers. It's a method, a repeatable way of directing
            AI to build real, working things, without a line of traditional code. Anyone can learn it. Most people just
            haven't been shown how. That's what this is for.
          </p>
        </div>
      </section>

      <div className="wrap">
        <section>
          <div className="routes">
            <div className="route">
              <div className="k">Start free</div>
              <h3 className="serif">Free resources</h3>
              <p>
                Get a feel for how this works, no commitment. Start with the idea generator that tells you exactly what to
                build first.
              </p>
              <Link to="/resources">Explore resources &rarr;</Link>
            </div>
            <div className="route">
              <div className="k">Go deeper</div>
              <h3 className="serif">Join the community</h3>
              <p>
                The method, the tools, the sprints and the support, plus a room of service owners building alongside
                you.
              </p>
              <Link to="/join">See what's inside &rarr;</Link>
            </div>
            <div className="route">
              <div className="k">Read</div>
              <h3 className="serif">The Vibed</h3>
              <p>
                Writing for founders building with AI. Ideas, walkthroughs and what's actually working right now.
              </p>
              <a href={BLOG_URL} target="_blank" rel="noopener noreferrer">
                Read the blog &rarr;
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap panelwrap">
        <section className="panel">
          <div className="tag">The part nobody else teaches</div>
          <h2 className="serif">
            Build safely. Build ethically. <em>Build like it matters.</em>
          </h2>
          <p>
            Moving fast with AI is easy. Moving fast without landing yourself or your clients in trouble is the part
            that takes skill, and almost nobody is teaching it. When you build with AI you're handling real things:
            client data, private information, your reputation.
          </p>
          <p>
            That's built into everything here. You'll learn to build things that aren't just impressive but safe,
            secure and ethical, work you can stand behind and your clients can trust.
          </p>
          <Link className="inline" to="/join">
            This matters to me. Here's why &rarr;
          </Link>
        </section>
      </div>

      <div className="wrap divide">
        <section className="pstrip">
          <div className="q serif">
            "A sales page I'm really proud of, live and linked to Stripe, all in the spaces between client calls, work,
            family and life."
          </div>
          <div className="who">
            Clare Flaxen <span>&middot; member</span>
          </div>
          <div className="more">
            <Link to="/join">Read what members have built &rarr;</Link>
          </div>
        </section>
      </div>

      <div className="wrap panelwrap">
        <section className="panel center">
          <div className="k">Join the community</div>
          <h2 className="serif">Build something that changes your business this&nbsp;week.</h2>
          <p>The method, the tools and a community that builds properly. One payment, and you're in.</p>
          <div className="price">$47 one-time, roughly {PRICE_GBP_APPROX}</div>
          <Link to="/join" className="btn">
            See the full details
          </Link>
          <div className="note">Founding price. It only goes up from here.</div>
        </section>
      </div>

      <SiteFooter />
    </AisbPage>
  );
}
