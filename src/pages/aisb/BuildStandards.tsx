import { Helmet } from 'react-helmet-async';
import { AisbPage, SalesNav, SimpleFooter } from '../../components/aisb/Layout';
import { Shot } from '../../components/aisb/ui';
import { STRIPE_BUILD_STANDARDS_URL, hasStripeLink, SKOOL_URL, PRICE_GBP_APPROX } from '../../config/external';

/**
 * The £9 prompt library, sold through a Stripe payment link.
 *
 * Until STRIPE_BUILD_STANDARDS_URL is filled in, the buy button scrolls to the
 * pricing card instead of dead-ending, and the card says so plainly rather than
 * looking purchasable when it is not.
 */

const INSIDE = [
  {
    title: 'Security, privacy & data',
    body: 'The part most people skip. Exposed keys, customer data, GDPR, database integrity. Catch it before it bites.',
  },
  {
    title: 'Forms, errors & dependencies',
    body: 'Inputs that fail, missing error handling, risky third-party packages. The things that quietly break.',
  },
  {
    title: 'Accessibility, performance & responsive',
    body: 'Works for everyone, loads fast, and looks right on every screen. A proper once-over.',
  },
  {
    title: 'SEO, AEO & discoverability',
    body: 'For public pages: search, AI answer engines, structured data and trust signals, so you actually get found.',
  },
];

export default function BuildStandards() {
  return (
    <AisbPage>
      <Helmet>
        <title>The AI Build Standards: Build Websites, Apps and Tools Properly With AI</title>
        <meta
          name="description"
          content="A copy-paste prompt library, built on the ICI framework, to build and audit websites, apps and digital products with AI, properly. Security, privacy, data, accessibility, SEO and more."
        />
        <link rel="canonical" href="https://aiforservicebusinesses.co/build-standards" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiforservicebusinesses.co/build-standards" />
        <meta property="og:title" content="The AI Build Standards" />
        <meta property="og:image" content="https://aiforservicebusinesses.co/og-image.jpg" />
      </Helmet>

      <SalesNav cta="Get it for £9" ctaHref="#get" />

      <div className="wrap-mid">
        <section className="optin">
          <div className="kick pill">&pound;9 &middot; Instant access</div>
          <h1 className="serif wide">
            AI makes it look finished. <em>This makes sure it actually is.</em>
          </h1>
          <p className="lead">
            A copy-paste prompt library for building websites, apps, tools and digital products with AI, without
            skipping the things that matter. Security, privacy, data, accessibility and more, checked properly. No
            guesswork, no dev needed.
          </p>
          <div className="cta-row" style={{ marginTop: '34px' }}>
            <a href="#get" className="btn">
              Get the guide <span className="p">&pound;9</span>
            </a>
          </div>
          <div className="pricetag">One-off payment. Instant access, yours to keep.</div>
        </section>

        <div className="preview">
          <Shot
            className="ratio-16-10"
            placeholder={
              <>
                Guide preview image goes here
                <br />
                (a shot of the guide or a sample prompt &middot; ~16:10)
              </>
            }
            alt="The AI Build Standards preview"
          />
        </div>
      </div>

      <section className="prob">
        <div className="wrap-mid">
          <h2 className="serif">
            AI is brilliant at making something look finished.{' '}
            <em>Long before everything underneath has been considered.</em>
          </h2>
          <p>
            A tool can work beautifully while quietly hiding a security hole, an exposed API key, poor handling of
            customer data, forms that fail, no error handling, or accessibility and performance problems. When you build
            fast with AI, it's easy to ship something that looks done but falls short where it counts.
          </p>
          <p>
            None of that means you shouldn't build with AI. Quite the opposite. It means getting better at telling AI
            what "built properly" actually means. That's what The AI Build Standards are for: eighteen focused prompts
            that hold your build to a professional standard, one area at a time, in plain English.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <h2 className="serif">What's inside.</h2>
            <p>
              Eighteen copy-paste prompts, each built on my ICI framework, each holding one part of your build to a
              proper standard and telling you exactly what to improve. Use the ones that fit what you're building.
            </p>
          </div>
          <div className="igrid2">
            {INSIDE.map((c) => (
              <div className="icard" key={c.title}>
                <h3 className="serif">{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap-mid panelwrap">
        <section className="panel center">
          <div className="tag">Built on the ICI framework</div>
          <h2 className="serif">These aren't random prompts off the internet.</h2>
          <p>
            Every prompt in the guide is built on my ICI framework, the same structured method I use across everything I
            build. That's why they give you clear, reliable, professional feedback instead of the vague, hit-and-miss
            results you get from a one-line request.
          </p>
        </section>
      </div>

      <section className="soft">
        <div className="wrap-mid">
          <div className="split">
            <Shot className="ratio-4-5" src="/ToniMartin.jpg" alt="Toni Martin" />
            <div>
              <h2 className="serif">Hi, I'm Toni.</h2>
              <p>
                I've spent years in the engine room of service businesses, thousands of support tickets, hundreds of
                tools, systems and launches. Then I started building and selling real AI apps and systems myself,
                without a developer or an agency budget.
              </p>
              <p>
                Along the way I built the <b>ICI framework</b>, the structured prompting method behind everything I
                create, and the backbone of every prompt in this guide. It's the same method I teach inside AI for
                Service Businesses.
              </p>
              <p>
                These standards aren't theory. They're the questions I actually ask of the things I build, turned into
                prompts you can use on yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <span id="get" />
      <section>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div className="sec-head">
            <h2 className="serif">Two ways to get it.</h2>
            <p>
              Buy the standards on their own, or get them as part of the community along with the method behind them.
            </p>
          </div>

          <div className="ptable">
            <div className="pcard light">
              <div className="priceline">
                <span className="n serif">&pound;9</span>
                <span className="once">one-off</span>
              </div>
              <div className="psub">The standards, on their own.</div>
              <ul>
                <li>Eighteen copy-paste build-and-audit prompts</li>
                <li>Security, privacy, data, forms, accessibility, SEO and more</li>
                <li>Built on the ICI framework for reliable results</li>
                <li>Plain English, no jargon, no dev needed</li>
                <li>Yours to keep, use it on everything you build</li>
              </ul>
              <a href={hasStripeLink ? STRIPE_BUILD_STANDARDS_URL : '#get'} className="btn forest" rel="noopener">
                Get the guide for &pound;9
              </a>
              <div className="note">
                {hasStripeLink ? 'One-off payment. Instant access.' : 'Stripe payment link not connected yet.'}
              </div>
            </div>

            <div className="pcard">
              <span className="best">Best value</span>
              <div className="priceline">
                <span className="n serif">$47</span>
                <span className="once">one-time</span>
              </div>
              <div className="psub">
                Everything, for life. Roughly {PRICE_GBP_APPROX}, as Skool bills in US dollars.
              </div>
              <ul>
                <li className="included">The AI Build Standards, included</li>
                <li>Claude OS, the build-with-AI method</li>
                <li>The Art of the Audit</li>
                <li>Site Sprint and Ship Sprint</li>
                <li>A growing classroom and weekly sessions</li>
                <li>Community and direct support from me</li>
              </ul>
              <a href={SKOOL_URL} className="btn" rel="noopener">
                Join the community
              </a>
              <div className="note">Founding price. It only goes up from here.</div>
            </div>
          </div>

          <p className="pricetag" style={{ maxWidth: '52ch', margin: '26px auto 0' }}>
            The standards keep a build honest. The community teaches you the method behind them, so you know why each
            prompt asks what it asks.
          </p>
        </div>
      </section>

      <SimpleFooter />
    </AisbPage>
  );
}
