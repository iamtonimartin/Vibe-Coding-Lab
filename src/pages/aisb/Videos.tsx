import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AisbPage, TopNav, SiteFooter } from '../../components/aisb/Layout';
import { PRICE_DISPLAY, PRICE_CHARGED_NOTE } from '../../config/external';

/**
 * Where the free video series is delivered, straight after the opt-in on
 * /resources/build-in-a-week.
 *
 * noindex: it is the thing people hand over an email address for, so it has no
 * business turning up in search.
 */

/**
 * One video row. `flip` puts the player on the left, so the three rows
 * alternate down the page.
 *
 * The players are lazy: three Vimeo embeds load a lot of script between them,
 * and nobody watches all three at once.
 */
function VideoRow({
  kick,
  title,
  children,
  vimeoId,
  flip = false,
}: {
  kick: string;
  title: ReactNode;
  children: ReactNode;
  vimeoId: string;
  flip?: boolean;
}) {
  const player = (
    <div className="vidframe">
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        title={kick}
        loading="lazy"
      />
    </div>
  );
  const words = (
    <div>
      <div className="kick">{kick}</div>
      <h2 className="serif">{title}</h2>
      {children}
    </div>
  );

  return (
    <section className={flip ? 'split flip' : 'split'}>
      {flip ? player : words}
      {flip ? words : player}
    </section>
  );
}

export default function Videos() {
  return (
    <AisbPage>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>How I Built My First AI App in a Week | AI for Service Businesses</title>
      </Helmet>

      <TopNav />

      <div className="wrap">
        <section className="rhero">
          <div className="kick pill">You're in. Here's everything.</div>
          <h1 className="serif">
            Three videos. Twenty minutes. <em>Everything changes.</em>
          </h1>
          <p>Watch the series, find your app idea, then come and build with&nbsp;us.</p>
        </section>
      </div>

      <div className="wrap">
        <VideoRow kick="Video one" title={<>Why I'm so excited <em>about this.</em></>} vimeoId="1173833089">
          <p>
            Start here. This is why building with AI changes everything for service business owners and why right now
            is the moment to pay attention.
          </p>
        </VideoRow>
      </div>

      {/* A plain div, not a section: the row inside is the section, and two
          nested sections would stack two lots of vertical padding. */}
      <div className="soft">
        <div className="wrap">
          <VideoRow kick="Video two" title={<>The tools you need <em>to get started.</em></>} vimeoId="1173842937" flip>
            <p>
              No fluff. Just the exact stack I use to build real AI-powered products. What each tool does, why I chose
              it and how they work together.
            </p>
            <p>
              <b>You'll finish this one knowing exactly what to download and where to start.</b>
            </p>
          </VideoRow>
        </div>
      </div>

      <div className="wrap">
        <VideoRow kick="Video three" title={<>Behind the scenes <em>of two real apps.</em></>} vimeoId="1173970978">
          <p>
            A look inside Relavo and Zenitro, two fully working SaaS products built with Google AI Studio, Antigravity
            and Claude Code, so you can see how it all comes together for yourself.
          </p>
          <p>
            <b>Not demos. Not mock-ups. Real software, live on the internet.</b>
          </p>
        </VideoRow>
      </div>

      <div className="wrap panelwrap">
        <section className="panel cream stepbox">
          <div>
            <div className="k">Your next step</div>
            <h2 className="serif">
              Now find your <span className="hl">app idea</span>
            </h2>
            <p>
              You've seen the method and you've seen the proof. Six quick questions and you'll know what your business
              should build first.
            </p>
            <p className="bestfor">Best if you want to build but aren't sure what yet.</p>
          </div>
          <div className="stepact">
            <Link to="/app-idea" className="btn forest">
              Find my app idea &rarr;
            </Link>
            <div className="note">Free, no sign up, sixty seconds.</div>
          </div>
        </section>

        <section className="panel center">
          <div className="k">Ready to actually build?</div>
          <h2 className="serif">The free resources get you started. The community gets you finished.</h2>
          <p>
            The method, the tools, the sprints and a room of service owners building alongside you. One payment, and
            you're in.
          </p>
          <Link to="/join" className="btn">
            Join AI for Service Businesses
          </Link>
          <div className="note">
            {PRICE_DISPLAY} one-time, {PRICE_CHARGED_NOTE}. Founding price, it only goes up from here.
          </div>
        </section>
      </div>

      <SiteFooter />
    </AisbPage>
  );
}
