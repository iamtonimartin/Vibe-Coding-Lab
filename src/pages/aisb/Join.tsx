import { Helmet } from 'react-helmet-async';
import { AisbPage, SalesNav, SimpleFooter } from '../../components/aisb/Layout';
import { Shot, BrowserShot } from '../../components/aisb/ui';
import { SKOOL_URL, PRICE_DISPLAY, PRICE_CHARGED_NOTE } from '../../config/external';

/**
 * The $47 community offer.
 *
 * Joining happens on Skool, which takes the payment, so the buy buttons go
 * straight there. The nav and hero buttons deliberately do not: they scroll to
 * the pricing card so people read the offer before they are sent off-site.
 */

const INSIDE = [
  {
    em: 'The method',
    title: 'Claude OS',
    body: 'My system for turning AI into your build partner. The backbone of everything you’ll build.',
  },
  {
    em: 'Build properly',
    title: 'The AI Build Standards',
    body: 'The eighteen prompts that hold a build to a professional standard. Sold separately, included here.',
  },
  {
    em: 'Win work',
    title: 'The Art of the Audit',
    body: 'The exact process I use to win consulting work with AI, ready for you to use.',
  },
  {
    em: 'Build fast',
    title: 'Site Sprint & Ship Sprint',
    body: 'Build and launch real things fast, step by step, from idea to live.',
  },
  {
    em: 'Grows with you',
    title: 'A growing classroom',
    body: 'Courses, tutorials and step-by-step resources that grow as the community does.',
  },
  {
    em: 'Weekly',
    title: 'Stuck? Let’s Fix It!',
    body: 'A weekly session to get you unstuck. Bring what you’re wrestling with and leave moving again.',
  },
  {
    em: 'From time to time',
    title: 'Timely workshops',
    body: 'Occasional workshops on what matters right now, like using AI for seasonal offers.',
  },
  {
    em: 'Built in',
    title: 'Safe & ethical building',
    body: 'How to build in a way that protects your data, your clients and your reputation.',
  },
  {
    em: 'You’re not alone',
    title: 'A community that gets it',
    body: 'Other service owners building the same things, plus direct support from me.',
  },
  {
    em: 'Yours to keep',
    title: 'One payment, for life',
    body: 'Pay once and you’re in. Everything now, and everything I add as it grows.',
  },
];

const TESTIMONIALS = [
  {
    lead: '"I built a new booking system to replace Acuity."',
    body: 'It reflects my brand, and it does all the tasks I need without paying an assistant, and without the constant errors that were costing me time and money.',
    who: 'Claire Schrader',
  },
  {
    lead: '"I deployed a private client portal for my business."',
    body: 'It starts with a diagnostic and builds a business plan, pitch deck and quarterly plans, with a personalised dashboard the client feeds into. I’m so chuffed and excited.',
    who: 'Caron Pollard',
  },
  {
    lead: '"A sales page I’m really proud of, live and linked to Stripe."',
    body: 'Built and imported to my website with sales email automation running, all in the spaces between client calls, work, family and life. It would have taken me hours and countless headaches before.',
    who: 'Clare Flaxen',
  },
];

const FAQS = [
  {
    q: 'I’ve never built anything technical before.',
    a: 'Perfect. Most people here started exactly there. The whole method is built for non-technical service owners, step by step, no code.',
    open: true,
  },
  {
    q: 'I don’t have much time.',
    a: 'You don’t need much. The sprints are built to get you from idea to shipped fast, and you go at your own pace.',
  },
  {
    q: 'How much does it cost to use the tools?',
    a: 'The method uses AI tools that are low cost or free to start, and I show you exactly what you need. No agency budgets, no expensive software.',
  },
  {
    q: 'Is this really a one-time payment?',
    a: 'Yes. Pay once and you’re in. No subscription, no surprise renewal. The price will rise for future members, but what you pay to join is what you pay, full stop.',
  },
  {
    q: 'Will this still be relevant in six months?',
    a: 'More than ever. The community grows as AI does, with new content added regularly, and your one payment covers all of it.',
  },
  {
    q: 'What if I miss a session?',
    a: 'Sessions are recorded and land in the community, so you never lose out.',
  },
];

export default function Join() {
  return (
    <AisbPage>
      <Helmet>
        <title>Join AI for Service Businesses: Build What Your Business Needs, With AI</title>
        <meta
          name="description"
          content="Join the community where service business owners learn to build the apps, sites and systems they need with AI. One payment, everything included."
        />
        <link rel="canonical" href="https://aiforservicebusinesses.co/join" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiforservicebusinesses.co/join" />
        <meta property="og:title" content="Join AI for Service Businesses" />
        <meta property="og:image" content="https://aiforservicebusinesses.co/og-image.jpg" />
      </Helmet>

      <SalesNav cta={`Join for ${PRICE_DISPLAY}`} ctaHref="#join" />

      <div className="wrap-mid">
        <section className="hero">
          <div>
            <div className="kick pill">For service business owners</div>
            <h1 className="serif">
              Build the apps, sites and systems your business needs. <em>With AI.</em>
            </h1>
            <p className="lead">
              No code. No developer. No agency budget. Join the community where service business owners learn to build
              what they actually need with AI, safely, properly, and faster than you'd think.
            </p>
            <div className="cta-row">
              <a href="#join" className="btn">
                Join for {PRICE_DISPLAY}
              </a>
            </div>
            <div className="pricetag">
              One-time payment, {PRICE_CHARGED_NOTE}. The price only rises from here.
            </div>
          </div>
          {/* Deliberately not Toni: her photo does its real work further down,
              next to the "I don't teach things I haven't done" claim. Up here
              the job is proof of the outcome, and the Assistants grid is the
              one Relavo screen that stays legible at hero size while showing
              assistants a service business would recognise as its own. */}
          <BrowserShot
            src="/relavo-assistants.png"
            alt="Relavo, showing AI assistants built for a retreat, a studio and a nutrition programme"
            loading="eager"
          />
        </section>
      </div>

      <section className="pain-sec">
        <div className="wrap-mid">
          <div className="pain">
            <h2 className="serif">
              You didn't start a business to become the tech department. <em>But here you are.</em>
            </h2>
            <p className="intro">
              Somewhere between winning the work and doing the work, a second job appeared. Nobody hired for it. It just
              landed on you.
            </p>
            <ul className="painlist">
              <li>You need a simple tool to handle a job, and the quotes to build it start at four figures.</li>
              <li>You've got the ideas. You just can't turn them into anything that actually works.</li>
              <li>You're paying for six tools to do five jobs, and you're not sure two of them earn their keep.</li>
              <li>You know AI could change how you work. You just don't know where to start, or who to trust.</li>
            </ul>
            <p className="painline serif">
              None of this is a skills problem. You're good at the work. You've just never been shown{' '}
              <b>how to make AI build the rest.</b>
            </p>
          </div>
        </div>
      </section>

      <div className="wrap-mid">
        <section className="stmt">
          <h2 className="serif">
            The people building are not smarter than you. <b>They just started.</b>
          </h2>
          <p>
            Building with AI isn't a secret skill reserved for developers. It's a method. A repeatable way of directing
            AI to build real, working things, without writing a line of traditional code. Anyone can learn it. Most
            people just haven't been shown how yet. You're about to be.
          </p>
        </section>
      </div>

      <div className="wrap-mid panelwrap">
        <section className="panel">
          <div className="tag">The part nobody else teaches</div>
          <h2 className="serif">
            Build safely. Build ethically. <em>Build like it matters.</em>
          </h2>
          <p>
            Here's what most people teaching AI won't tell you. Moving fast with AI is easy. Moving fast without landing
            yourself or your clients in trouble is the part that actually takes skill, and almost nobody is teaching it.
          </p>
          <p>
            When you build with AI you're handling real things. Client data. Private information. Your reputation. Get
            it wrong and a clever tool becomes a genuine liability: a leak, a breach, a client relationship damaged,
            work you can't stand behind.
          </p>
          <p>
            I care about this deeply, and it's built into everything here. You'll learn to build things that aren't just
            impressive but safe, secure and ethical. How to protect data, handle sensitive information properly, and use
            AI in a way you can be proud of and your clients can trust.
          </p>
          <p className="kicker">
            Building something that works is one thing. Building something you can stand behind is what actually
            protects your business.
          </p>
        </section>
      </div>

      <section className="inside-sec">
        <div className="wrap-mid">
          <div className="sec-head">
            <h2 className="serif">Everything inside the community.</h2>
            <p>
              It's all included for one payment. No subscription, no catch. Take what moves the dial for your business,
              leave the rest.
            </p>
          </div>
          <div className="inside-grid">
            {INSIDE.map((card) => (
              <div className="icard" key={card.title}>
                <span className="em">{card.em}</span>
                <h3 className="serif">{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap-mid">
        <section className="split">
          <Shot className="ratio-4-5" src="/ToniMartin.jpg" alt="Toni Martin" />
          <div>
            <h2 className="serif">I don't teach things I haven't done.</h2>
            <p>
              Hi, I'm Toni. I've spent years in the engine room of service businesses. Thousands of support tickets,
              hundreds of tools, systems and launches. Then I discovered I could build and sell real AI apps and systems
              myself, without a developer or an agency budget.
            </p>
            <p>
              <b>Relavo, my AI assistant platform, and Kestry, my customer support desk, are fully working products</b>{' '}
              I built with the exact method I teach here. Not demos. Not mock-ups. Real software, running real
              businesses. That's the method. It's what you'll be building with, and I build alongside you.
            </p>
          </div>
        </section>
      </div>

      <div className="wrap-mid">
        <section className="split flip">
          <div>
            <h2 className="serif">
              Take a look <em>inside.</em>
            </h2>
            <p>
              This isn't a lonely course you start and abandon. It's a living community of service owners building real
              things, sharing wins, and getting unstuck together.
            </p>
            <p>
              The classroom, the sprints, the weekly sessions and the support all live in one place, and it grows every
              week.
            </p>
          </div>
          <Shot className="ratio-16-10" src="/aisb-skool.jpg" alt="Inside the AI for Service Businesses community" />
        </section>
      </div>

      <section className="proof">
        <div className="wrap-mid">
          <div className="sec-head">
            <h2 className="serif">
              Real people. <em>Real things, shipped.</em>
            </h2>
            <p>Not screenshots of demos. Actual builds by members, running in their actual businesses.</p>
          </div>
          <div className="tgrid">
            {TESTIMONIALS.map((t) => (
              <div className="tcard" key={t.who}>
                <div className="tlead serif">{t.lead}</div>
                <div className="tbody">{t.body}</div>
                <div className="who">{t.who}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <span id="join" />
      <section className="pricing">
        <div className="wrap-mid">
          <h2 className="serif">Join the community. Build something real.</h2>
          <p className="sub">Everything included, one payment. No subscription.</p>
          <div className="pcard">
            <div className="priceline">
              <span className="n serif">{PRICE_DISPLAY}</span>
              <span className="once">one-time</span>
            </div>
            <div className="psub">
              Everything inside, for life. No monthly fee, no renewal.
              <br />
              <span className="charged">{PRICE_CHARGED_NOTE}</span>
            </div>
            <ul>
              <li>Claude OS, the build-with-AI method</li>
              <li>The AI Build Standards, sold separately at &pound;9</li>
              <li>The Art of the Audit</li>
              <li>Site Sprint and Ship Sprint</li>
              <li>A growing classroom, new content added regularly</li>
              <li>Weekly "Stuck? Let's Fix It!" sessions</li>
              <li>Occasional timely workshops</li>
              <li>Safe and ethical building, built in</li>
              <li>Community and direct support from me</li>
            </ul>
            <a href={SKOOL_URL} className="btn" rel="noopener">
              Join for {PRICE_DISPLAY}
            </a>
            <div className="note">Founding price. As the community grows and I add more, it only goes up.</div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap-narrow">
          <div className="sec-head">
            <h2 className="serif">Still on the fence? Let's sort that.</h2>
          </div>
          <div className="faq">
            {FAQS.map((f) => (
              <details key={f.q} open={f.open}>
                <summary>{f.q}</summary>
                <div className="ans">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final">
        <div className="wrap-mid">
          <h2 className="serif">Build something that changes your&nbsp;business this&nbsp;week.</h2>
          <p>
            You've had the ideas. Now you get the method, the tools and a community that builds properly. One payment,
            and you're in.
          </p>
          <a href={SKOOL_URL} className="btn" rel="noopener">
            Join for {PRICE_DISPLAY}
          </a>
          <div className="price">Founding price. It only goes up from here.</div>
        </div>
      </section>

      <SimpleFooter />
    </AisbPage>
  );
}
