import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AisbPage, TopNav, SiteFooter } from '../../components/aisb/Layout';
import { Shot, resourceIcons } from '../../components/aisb/ui';
import { PRICE_DISPLAY, PRICE_CHARGED_NOTE } from '../../config/external';

export default function ResourcesHub() {
  return (
    <AisbPage>
      <Helmet>
        <title>Free Resources for Building With AI | AI for Service Businesses</title>
        <meta
          name="description"
          content="Free and low-cost resources to get you building with AI. Start with the idea generator, the video series or the AI Build Playbook."
        />
        <link rel="canonical" href="https://aiforservicebusinesses.co/resources" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiforservicebusinesses.co/resources" />
        <meta property="og:title" content="Free Resources for Building With AI" />
        <meta property="og:image" content="https://aiforservicebusinesses.co/og-image.jpg" />
      </Helmet>

      <TopNav />

      <div className="wrap">
        <section className="rhero">
          <div className="kick">Free, no commitment</div>
          <h1 className="serif">
            Resources to get you <em>building.</em>
          </h1>
          <p>
            Pick the one that fits where you are right now, from your very first idea to shipping something real and
            secure.
          </p>
        </section>
      </div>

      <div className="wrap">
        <section>
          <div className="seclabel serif">Start free</div>
          <div className="seclabel-sub">Four ways in. Grab whichever fits, no commitment.</div>

          <div className="rgrid">
            <div className="rcard">
              <div className="rtop">
                <div className="ricon">{resourceIcons.book}</div>
                <div className="rbadge">Free guide &middot; Start here</div>
              </div>
              <h3 className="serif">The AI Build Playbook</h3>
              <p className="desc">
                The language, tools and models behind building with AI, explained in plain English. Glossary, file
                types, the current AI models and the toolkit, all in one reference you'll keep coming back to.
              </p>
              <div className="bestfor">Best if you want to understand how all of this actually works.</div>
              <div className="ract">
                <Link to="/resources/ai-build-playbook" className="btn small">
                  Get the playbook &rarr;
                </Link>
              </div>
            </div>

            <div className="rcard">
              <div className="rtop">
                <div className="ricon">{resourceIcons.bulb}</div>
                <div className="rbadge">Free tool</div>
              </div>
              <h3 className="serif">Find Your App Idea</h3>
              <p className="desc">
                Answer a few quick questions and get an idea for the first thing your business should build with AI,
                tailored to your work and goals.
              </p>
              <div className="bestfor">Best if you want to build but aren't sure what yet.</div>
              <div className="ract">
                <Link to="/resources/find-your-app-idea" className="btn small">
                  Generate my idea &rarr;
                </Link>
              </div>
            </div>

            <div className="rcard">
              <div className="rtop">
                <div className="ricon">{resourceIcons.list}</div>
                <div className="rbadge">Free list</div>
              </div>
              <h3 className="serif">70 AI Tools You Could Build</h3>
              <p className="desc">
                Seventy ideas across fourteen industries, filtered by niche and tool type, each with a clear
                monetisation angle.
              </p>
              <div className="bestfor">Best if you want to browse until something clicks.</div>
              <div className="ract">
                <Link to="/ideas" className="btn small">
                  Browse the ideas &rarr;
                </Link>
              </div>
            </div>

            <div className="rcard">
              <div className="rtop">
                <div className="ricon">{resourceIcons.play}</div>
                <div className="rbadge">Free video series</div>
              </div>
              <h3 className="serif">How I Built My First AI App in a Week</h3>
              <p className="desc">
                A short series showing the exact tools, stack and process behind real, deployed products like Relavo and
                Kestry.
              </p>
              <div className="bestfor">Best if you want to see what's actually possible before you start.</div>
              <div className="ract">
                <Link to="/resources/build-in-a-week" className="btn small">
                  Watch free &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="further">
        <div className="seclabel serif">Go further</div>
        <div className="seclabel-sub">Two ways to take it further, whenever you are ready.</div>

        <div className="panel cream stepbox">
          <div>
            <div className="k">&pound;9 one-off</div>
            <h2 className="serif">The AI Build Standards</h2>
            <p>
              Nineteen standards and twenty-six copy-paste prompts, built on the ICI framework, to build and audit
              websites, apps and digital products properly. Security, privacy, data, accessibility, SEO and more.
            </p>
            <p className="bestfor">Best if you have built something and want it to hold up properly.</p>
          </div>
          <div className="stepact">
            <Link to="/build-standards" className="btn forest">
              Get the guide &pound;9
            </Link>
            <div className="note">Sent to your inbox, yours to keep.</div>
          </div>
        </div>

        <div className="panel center">
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
        </div>
        </section>
      </div>

      <SiteFooter />
    </AisbPage>
  );
}
