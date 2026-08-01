import { useState, useEffect, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ChevronDown } from 'lucide-react';

/* ------------------------------------------------------------------ *
 * Terms and Conditions
 *
 * Reproduced from the copy supplied by Ascendz Digital Limited. Two
 * typographical corrections were made and nothing else: a stray full
 * stop after the company name in clause 1, and a trailing full stop on
 * the clause 6 heading. All wording is otherwise verbatim, because the
 * substance of a legal document is not ours to edit.
 *
 * Linked from the ThriveCart checkouts, so the URL must stay stable.
 * ------------------------------------------------------------------ */

const LAST_UPDATED = '28 July 2026';
const SUPPORT_EMAIL = 'clientsupport@ascendz.co';

/**
 * Published here because the Companies Act 2006 and the E-Commerce Regulations
 * 2002 require a UK limited company to show its registered identity online.
 */
const COMPANY = {
  name: 'Ascendz Digital Limited',
  registeredIn: 'England and Wales',
  number: '17079053',
  office: 'Tudor House, Newport Road, Eccleshall ST21 6BG',
};

const SECTIONS = [
  { id: 'introduction', n: '1.0', title: 'Introduction' },
  { id: 'license', n: '2.0', title: 'Licence and Use of Products' },
  { id: 'intellectual-property', n: '3.0', title: 'Intellectual Property' },
  { id: 'refunds', n: '4.0', title: 'Digital Products Refunds and Chargebacks' },
  { id: 'subscriptions', n: '5.0', title: 'Subscriptions to Services and Memberships' },
  { id: 'fair-use', n: '6.0', title: 'Fair Use Clause for Unlimited Tech Support Services' },
  { id: 'user-accounts', n: '7.0', title: 'User Accounts' },
  { id: 'warranties', n: '8.0', title: 'Warranties and Liability' },
  { id: 'disclaimers', n: '9.0', title: 'Disclaimers' },
  { id: 'confidential', n: '10.0', title: 'Confidential Information' },
  { id: 'general', n: '11.0', title: 'General' },
];

const Clause = ({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: ReactNode;
}) => (
  <section id={id} className="scroll-mt-28 pt-10 md:pt-14 first:pt-0">
    <div className="text-xs font-bold uppercase tracking-widest text-terracotta mb-3">
      Clause {n}
    </div>
    <h2 className="text-2xl md:text-4xl font-display font-extrabold leading-tight mb-5 text-balance">
      {title}
    </h2>
    <div className="space-y-5 text-base md:text-lg leading-relaxed opacity-80">{children}</div>
  </section>
);

const SubHeading = ({ children }: { children: ReactNode }) => (
  <h3 className="text-lg md:text-xl font-display font-extrabold opacity-100 pt-3">{children}</h3>
);

export default function Terms() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  // Highlight the clause currently in view in the contents list.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-100px 0px -60% 0px' },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const contents = (
    <nav>
      <ul className="space-y-1 border-l border-forest-green/15">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block py-2 pl-4 -ml-px border-l text-sm leading-snug transition-colors ${
                activeId === s.id
                  ? 'border-terracotta text-terracotta font-bold'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:text-terracotta'
              }`}
            >
              <span className="tabular-nums opacity-60 mr-1.5">{s.n}</span>
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green overflow-x-hidden selection:bg-terracotta selection:text-white scroll-smooth">
      <Helmet>
        <title>Terms and Conditions | Ascendz Digital Limited</title>
        <meta
          name="description"
          content="The terms and conditions governing the use of our website and the purchase of our digital products, services and subscriptions."
        />
        <link rel="canonical" href="https://thevibecodinglab.co/terms" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* HEADER */}
      <header className="bg-forest-green text-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-10"
          >
            <ArrowLeft size={14} /> Back to site
          </Link>

          <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-[1.05] tracking-tight mb-5 text-balance">
            Terms <span className="text-terracotta">and Conditions</span>
          </h1>
          <p className="text-base md:text-xl opacity-75 leading-relaxed max-w-2xl">
            Please read these terms and conditions carefully before purchasing any of our digital
            products, services or subscriptions.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2">
              Ascendz Digital Limited
            </span>
            <span className="bg-terracotta text-white rounded-full px-4 py-2">
              Last updated {LAST_UPDATED}
            </span>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
          {/* Contents.
              On mobile this list is eleven items tall, a full screen of
              navigation standing between the reader and clause 1, so it
              collapses. On desktop it is a sticky sidebar in its own column
              and costs the reader nothing, so it stays open. */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <details className="lg:hidden bg-white border border-forest-green/10 rounded-2xl px-5 py-4">
              <summary className="cursor-pointer list-none flex items-center justify-between text-xs font-bold uppercase tracking-widest text-terracotta">
                Contents
                <ChevronDown size={16} className="shrink-0" />
              </summary>
              <div className="pt-4">{contents}</div>
            </details>

            <div className="hidden lg:block">
              <div className="text-[10px] font-bold uppercase tracking-widest text-terracotta mb-4">
                Contents
              </div>
              {contents}
            </div>
          </aside>

          {/* Clauses */}
          <main className="min-w-0 divide-y divide-forest-green/10">
            <Clause id="introduction" n="1.0" title="Introduction">
              <p>
                These terms and conditions set out the terms and conditions between You, the
                customer, and Ascendz Digital Limited (&ldquo;us&rdquo;, &ldquo;we&rdquo;),
                governing the use of our website and our downloadable digital recordings including
                the content therein (the &ldquo;products&rdquo;) and our done for you solutions (the
                &ldquo;services&rdquo;). Your use of our website, and purchase, download and use of
                our products and services, constitutes your full acceptance of these terms and
                conditions. If you do not agree with these terms and conditions, you should not use
                our website or purchase, download or use any of our products or services.
              </p>

              <SubHeading>Definitions</SubHeading>
              <p>
                In these terms and conditions: &ldquo;We&rdquo;, &ldquo;Us&rdquo;,
                &ldquo;Our&rdquo; and &ldquo;the Company&rdquo; mean Ascendz Digital Limited.
                &ldquo;You&rdquo; and &ldquo;Your&rdquo; mean the customer. &ldquo;Products&rdquo;
                means our digital products, including downloadable resources, templates, recordings,
                software and the content within them. &ldquo;Services&rdquo; means our done for you
                solutions and any other service we provide to You. &ldquo;Subscription&rdquo; means
                any recurring paid plan. These defined terms carry the same meaning throughout this
                document whether or not they appear capitalised.
              </p>
            </Clause>

            <Clause id="license" n="2.0" title="Licence and Use of Products">
              <p>
                Your purchase of one of our products constitutes our granting to you of a
                non-exclusive, non-sublicensable, non-transferable licence to download and access
                that product for the purpose of your own personal use and reference, (the
                &ldquo;purpose&rdquo;). You agree that under no circumstances shall you use, or
                permit to be used, any product other than for the aforesaid purpose. For the
                avoidance of doubt, you shall not copy, re-sell, sublicense, rent out, share or
                otherwise distribute any of our products, whether modified or not, to any third
                party. You agree not to use any of our products in a way which might be detrimental
                to us or damage our reputation.
              </p>
            </Clause>

            <Clause id="intellectual-property" n="3.0" title="Intellectual Property">
              <p>
                The products, whether modified or not, and all intellectual property and copyright
                contained therein, are and shall at all times remain our sole and exclusive
                property. You agree that under no circumstances, whether the product has been
                modified or not, shall you have or attempt to claim ownership of any intellectual
                property rights or copyright in the product.
              </p>
            </Clause>

            <Clause id="refunds" n="4.0" title="Digital Products Refunds and Chargebacks">
              <p>
                This section applies to digital products sold by the Company, including but not
                limited to downloadable resources, templates, video tutorials, digital subscriptions
                and lifetime access plans.
              </p>

              <SubHeading>Where You are buying as a business</SubHeading>
              <p>
                Where You are buying in the course of a business, the cancellation rights given to
                consumers by the Consumer Contracts Regulations 2013 do not apply. Due to the nature
                of digital products, such sales are final once the product has been purchased and
                access has been granted.
              </p>

              <SubHeading>Where You are buying as a consumer</SubHeading>
              <p>
                Where You are buying as a consumer, You have a statutory right under the Consumer
                Contracts Regulations 2013 to cancel within 14 days. That right does not apply to
                digital content once You have expressly consented to immediate access and
                acknowledged that You lose the right to cancel by doing so. We ask for that consent
                at the point of purchase. Nothing in these terms and conditions affects Your
                statutory rights.
              </p>

              <SubHeading>Money-back guarantees</SubHeading>
              <p>
                Where We expressly offer a money-back guarantee on a particular product or service,
                the terms of that guarantee apply to that purchase and take precedence over this
                clause. Any such guarantee, including its length and any conditions, will be stated
                at the point of purchase.
              </p>

              <SubHeading>Discretionary refunds</SubHeading>
              <p>
                Refund requests may be reviewed on a case-by-case basis and granted at the sole
                discretion of the Company. Where a refund is approved, access to the digital product
                will be revoked.
              </p>

              <SubHeading>Chargebacks</SubHeading>
              <p>
                If something is wrong with Your purchase, You agree to contact Us first so that We
                have a fair opportunity to put it right. Raising a chargeback or payment dispute
                without first contacting Us may be treated as a breach of these terms and may result
                in termination of Your access. This does not affect Your right to dispute a
                genuinely unauthorised transaction.
              </p>

              <SubHeading>Pricing</SubHeading>
              <p>
                The Company reserves the right to update pricing for its products at any time. A
                change in price never affects a purchase You have already made. Customers with an
                active Subscription retain their original pricing for as long as that Subscription
                remains active, unless they cancel and rejoin at a later date.
              </p>
            </Clause>

            <Clause id="subscriptions" n="5.0" title="Subscriptions to Services and Memberships">
              <SubHeading>Subscription Period</SubHeading>
              <p>
                The Service or some parts of the Service are available only with a paid
                Subscription. You will be billed in advance on a recurring and periodic basis (such
                as daily, weekly, monthly or annually), depending on the type of Subscription plan
                you select when purchasing the Subscription.
              </p>
              <p>
                At the end of each period, Your Subscription will automatically renew under the
                exact same conditions unless You cancel it or the Company cancels it.
              </p>

              <SubHeading>Subscription Cancellation</SubHeading>
              <p>
                You may cancel Your Subscription renewal either through Your Account settings page,
                Your Customer Portal or by contacting the Company.
              </p>
              <p>
                You will not receive a refund for the fees You already paid for Your current
                Subscription period and You will be able to access the Service until the end of Your
                current Subscription period.
              </p>

              <SubHeading>Billing</SubHeading>
              <p>
                You shall provide the Company with accurate and complete billing information
                including full name, address, state, postal/zip code, telephone number and valid
                payment method information.
              </p>
              <p>
                Payments are taken by Our third-party payment providers. We do not store Your full
                card details.
              </p>
              <p>
                Should automatic billing fail to occur for any reason, the Company will issue an
                electronic invoice indicating that you must proceed manually, within a certain
                deadline date, with the full payment corresponding to the billing period as
                indicated on the invoice.
              </p>

              <SubHeading>Fee Changes</SubHeading>
              <p>
                The Company may modify its Subscription fees at any time. A new fee applies to new
                Subscriptions, and applies to You only if You cancel and later rejoin. For as long
                as Your Subscription remains active and uninterrupted, You will continue to pay the
                fee that applied when You joined.
              </p>
              <p>
                If We ever need to change the fee on an active Subscription, We will give You at
                least 30 days notice and You may cancel before the change takes effect.
              </p>

              <SubHeading>Subscription Refunds</SubHeading>
              <p>Except when required by law, paid Subscription fees are non-refundable.</p>
              <p>
                Certain refund requests for Subscriptions may be considered by the Company on a
                case-by-case basis and granted at the sole discretion of the Company.
              </p>

              <SubHeading>Free Trials</SubHeading>
              <p>
                The Company may, at its sole discretion, offer a Subscription with a Free trial for
                a limited period of time.
              </p>
              <p>You may be required to enter Your billing information in order to sign up for the Free trial.</p>
              <p>
                If You do enter Your billing information when signing up for a Free Trial, You will
                not be charged by the Company until the Free trial has expired. On the last day of
                the Free Trial period, unless You cancelled Your Subscription, You will be
                automatically charged the applicable Subscription fees for the type of Subscription
                You have selected.
              </p>
              <p>At any time and without notice, the Company reserves the right to</p>
              <p className="pl-5">(i) modify the terms and conditions of the Free Trial offer, or</p>
              <p className="pl-5">(ii) cancel such Free trial offer.</p>

              <SubHeading>Paid Trials</SubHeading>
              <p>
                The Company may, at its sole discretion, offer a Subscription with a Paid trial for
                a limited period of time.
              </p>
              <p>
                As part of such Paid trial, the nature of the core service may be modified to
                accommodate for the reduced cost of the Service during that Paid trial period. For
                example, instead of an unlimited service, the Company may limit the number of
                requests you can make, or otherwise alter the Service.
              </p>

              <SubHeading>Lifetime Access Plans</SubHeading>
              <p>
                The Company may, from time to time, offer access to certain digital products or
                services under a one-time payment model described as &ldquo;Lifetime
                Access&rdquo;. This means You pay once and receive ongoing access to that product
                or service, with no recurring subscription, no renewal and no further payment.
                Lifetime Access does not expire on a fixed date.
              </p>
              <p>
                Lifetime Access lasts for as long as the Company continues to offer that product or
                service, and in any event for a minimum of 30 months from the date of purchase. That
                30 month period is a guaranteed minimum, not a limit on Your access.
              </p>
              <p>
                If the Company discontinues a product or service covered by Lifetime Access, or
                alters it significantly, We will make reasonable efforts to notify You in advance
                and to provide a suitable alternative or a transition period.
              </p>
              <p>
                Lifetime Access covers the software or product itself. Where a product depends on
                usage that costs Us money to provide, such as AI generation or email sending, that
                usage may be charged separately. Any such charge will be made clear at the point of
                purchase.
              </p>
              <p>
                Except where a money-back guarantee is expressly offered at the point of purchase,
                or where required by law, no refunds are available on Lifetime Access purchases.
              </p>

              <SubHeading>Add-on Services and Loyalty Discounts</SubHeading>
              <p>
                You may require support that falls outside the scope of your Subscription. The
                Company may provide chargeable Add-on Services for your convenience. Such Services
                are covered by these terms and conditions, unless otherwise indicated. The Company
                may also offer a loyalty discount applicable to said Add-on Services to reduce the
                cost, these loyalty discounts can be revoked at the Company&rsquo;s discretion.
              </p>
            </Clause>

            <Clause
              id="fair-use"
              n="6.0"
              title="Fair Use Clause for Unlimited Tech Support Services"
            >
              <SubHeading>Fair Use</SubHeading>
              <p>
                The Company acknowledges the intention of providing You with unrestricted access to
                the Service. However, the Company reserves the right to monitor and assess the usage
                patterns and practices of the Service to ensure its fair use by You.
              </p>

              <SubHeading>Exploitative Use</SubHeading>
              <p>
                If the Company reasonably believes that You are engaging in exploitative use of the
                Service, which includes but is not limited to, excessive usage beyond what is
                reasonably expected for normal technical support needs or utilising the Service on
                behalf of a third-party, the Company may take action in accordance with this Clause.
              </p>

              <SubHeading>Company&rsquo;s Rights</SubHeading>
              <p>
                In cases of suspected exploitative use, the Company reserves the right to take
                appropriate actions, which may include:
              </p>
              <ul className="space-y-3 pl-5 list-disc marker:text-terracotta">
                <li>
                  Issuing a warning to You, informing You of the potential violation of fair use.
                </li>
                <li>
                  Imposing limits on the frequency, duration, or scope of technical support provided
                  to You.
                </li>
                <li>
                  Requesting You to modify Your usage behaviour to align with fair use principles.
                </li>
                <li>
                  Terminating or suspending the Subscription and the provision of the Service, if
                  the Company reasonably believes that Your behaviour is intentionally or
                  systematically exploiting the Service for any unauthorised purposes.
                </li>
              </ul>

              <SubHeading>Notification and Remedies</SubHeading>
              <p>
                Before taking any action as described in this clause, the Company shall make
                reasonable efforts to notify You of Your suspected exploitative use of the Service.
                You will be given the opportunity to explain Your usage patterns and make necessary
                adjustments.
              </p>
            </Clause>

            <Clause id="user-accounts" n="7.0" title="User Accounts">
              <p>
                When You create an account with Us, You must provide Us information that is
                accurate, complete, and current at all times. Failure to do so constitutes a breach
                of the Terms, which may result in immediate termination of Your account on Our
                Service.
              </p>
              <p>
                You are responsible for safeguarding the password that You use to access the Service
                and for any activities or actions under Your password, whether Your password is with
                Our Service or a Third-Party Social Media Service.
              </p>
              <p>
                You agree not to disclose Your password to any third party. You must notify Us
                immediately upon becoming aware of any breach of security or unauthorised use of
                Your account.
              </p>
              <p>
                You may not use as a username the name of another person or entity or that is not
                lawfully available for use, a name or trademark that is subject to any rights of
                another person or entity other than You without appropriate authorisation, or a name
                that is otherwise offensive, vulgar or obscene.
              </p>
            </Clause>

            <Clause id="warranties" n="8.0" title="Warranties and Liability">
              <p>
                We make every effort to ensure that our products are accurate, authoritative and fit
                for the use of our customers. However, we take no responsibility whatsoever for the
                suitability of the product, and we provide no warranties as to the function or use
                of the product, whether express, implied or statutory, including without limitation
                any warranties of merchantability or fitness for particular purpose. You agree to
                indemnify us against all liabilities, claims, demands, expenses, actions, costs,
                damages, or loss arising out of your breach of these terms and conditions.
                Furthermore, we shall not be liable to you or any party for consequential, indirect,
                special or exemplary damages including but not limited to damages for loss of
                profits, business or anticipated benefits whether arising under tort, contract,
                negligence or otherwise whether or not foreseen, reasonably foreseeable or advised
                of the possibility of such damages.
              </p>
            </Clause>

            <Clause id="disclaimers" n="9.0" title="Disclaimers">
              <p>
                You understand the Company is not an agent, publicist, accountant, financial
                planner, lawyer, therapist, or any other licensed or registered professional.
                Services may include setting priorities, establishing goals, identifying resources,
                brainstorming, creating action plans, strategising, asking clarifying questions,
                providing models, examples, in-the-moment skills training, tech implementation and
                consulting. The Company promises that all information provided by You will be kept
                strictly confidential, as permissible by law.
              </p>
              <p>
                In relation to the delivery of Services, You understand that the Company cannot be
                held liable for any malfunction, underperformance or failure of any third-party
                applications/platforms, providing the Company has taken reasonable steps and due
                care to set up such applications/platforms in accordance with their guidelines.
              </p>
            </Clause>

            <Clause id="confidential" n="10.0" title="Confidential Information">
              <p>
                In relation to the exchange of information for the execution of any Service, both
                You and the Company shall at all times keep confidential (and take reasonable steps
                to procure that its employees and agents shall keep confidential) and shall not at
                any time for any reason disclose or permit to be disclosed to any person or
                otherwise make use of or permit to be made use of any information relating to the
                other&rsquo;s business methods, plans, systems, finances, projects, trade secrets or
                provision of products or services to which it attaches confidentiality or in respect
                of which it holds an obligation to a third party.
              </p>
              <p>
                Upon termination of this Agreement for whatever reason both Parties shall deliver to
                the other Party all working papers or other material and copies provided to him
                pursuant to this Agreement or prepared by him either in pursuance of this Agreement
                or previously.
              </p>
            </Clause>

            <Clause id="general" n="11.0" title="General">
              <p>
                These terms and conditions constitute the entire agreement and understanding between
                You and Us for the supply of downloadable digital products and/or the delivery of
                services, and shall supersede any prior agreements whether made in writing, orally,
                implied or otherwise. The failure by us to exercise or enforce any right(s) under
                these terms and conditions shall not be deemed to be a waiver of any such right(s)
                or operate so as to bar the exercise or enforcement thereof at any time(s)
                thereafter, as a waiver of another or constitute a continuing waiver. You agree that
                monetary damages may not be a sufficient remedy for the damage which may accrue to
                us by reason of your breach of these terms and conditions, therefore we shall be
                entitled to seek injunctive relief to enforce the obligations contained herein.
              </p>
              <p>
                The un-enforceability of any single provision within these terms and conditions
                shall not affect any other provision hereof. These terms and conditions, your
                acceptance thereof, and our relationship with you shall be governed by and construed
                in accordance with English law and both us and you irrevocably submit to the
                exclusive jurisdiction of the English courts over any claim, dispute or matter
                arising under or in connection with these terms and conditions or our relationship
                with you.
              </p>
            </Clause>

            {/* CONTACT */}
            <section className="pt-10 md:pt-14">
              <div className="bg-forest-green text-white rounded-[2rem] p-8 md:p-10">
                <div className="text-xs font-bold uppercase tracking-widest text-terracotta mb-3">
                  Contact
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold leading-tight mb-4 text-balance">
                  Questions about these terms?
                </h2>
                <p className="text-base md:text-lg opacity-75 leading-relaxed mb-6">
                  If you have any questions about these Terms and Conditions, You can contact us:
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex items-center gap-2 bg-terracotta hover:bg-burnt-orange text-white px-6 py-4 rounded-2xl font-extrabold transition-colors"
                >
                  <Mail size={18} /> {SUPPORT_EMAIL}
                </a>
              </div>

              {/* Company details: required online by the Companies Act 2006 and the
                  E-Commerce Regulations 2002. */}
              <div className="mt-8 bg-white border border-forest-green/10 rounded-[1.5rem] p-7 md:p-8">
                <div className="text-xs font-bold uppercase tracking-widest text-terracotta mb-4">
                  Company details
                </div>
                <dl className="text-sm md:text-base leading-relaxed space-y-2">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-bold">Registered name:</dt>
                    <dd className="opacity-80">{COMPANY.name}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-bold">Registered in:</dt>
                    <dd className="opacity-80">{COMPANY.registeredIn}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-bold">Company number:</dt>
                    <dd className="opacity-80 tabular-nums">{COMPANY.number}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-bold">Registered office:</dt>
                    <dd className="opacity-80">{COMPANY.office}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 text-sm opacity-60 leading-relaxed space-y-1">
                <p>Updated: 3 September 2023 to include Clause 6.</p>
                <p>
                  Updated: 4 May 2025 to include Lifetime Access Plans under clause 5 and revised
                  clause 4 to reflect Consumer Contracts Regulations 2013 instead of Consumer
                  Protection (Distance Selling) Regulations 2000.
                </p>
                <p>
                  Last updated: {LAST_UPDATED} to add definitions and company details, to separate
                  consumer and business rights under clause 4, to allow product-specific money-back
                  guarantees, and to clarify Lifetime Access and fee changes under clause 5.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
