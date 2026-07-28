import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ShieldCheck, Lock, Flame, Clock, Mail } from 'lucide-react';
import {
  FOUNDING_PRICE,
  MONTHLY,
  SEATS_TOTAL,
  DEADLINE_LONG,
  SOLD_OUT,
  PLANS,
  GUARANTEE,
  MONTHLY_URL,
  ROLLOUT,
  SUPPORT_EMAIL,
  WIDGET_ORIGIN,
  CHECKOUT_ORIGIN,
  WIDGET_SCRIPT,
} from '../components/sbos/config';
import { useCountdown, pad } from '../components/sbos/useCountdown';
import { useSeats, seatLabel } from '../components/sbos/useSeats';
import Checkout from '../components/sbos/Checkout';

/* ------------------------------------------------------------------ *
 * Service Business OS · checkout
 *
 * The ThriveCart embed renders at a fixed shape that fights a narrow
 * column, so it gets its own page and the full width of it. Everything
 * else here exists to hold the sale together at the last step: what you
 * are buying, what it costs, the guarantee and the deadline.
 * ------------------------------------------------------------------ */

export default function SbosJoin() {
  const { days, hours, mins, secs, expired } = useCountdown();
  const seats = useSeats();

  const closed = SOLD_OUT || expired || seats === 0;
  const hasGuarantee = GUARANTEE.days > 0;

  const seatLine = seatLabel(seats);

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green overflow-x-hidden selection:bg-terracotta selection:text-white">
      <Helmet>
        <title>Join Service Business OS · Founding access</title>
        <meta
          name="description"
          content={`Secure checkout for founding lifetime access to Service Business OS. £${FOUNDING_PRICE} once, or spread it over 3 or 10 payments.`}
        />
        <link rel="canonical" href="https://thevibecodinglab.co/sbos-join" />
        {/* preload, not prefetch: on this page the script is needed now, so
            it should download in parallel with the app bundle instead of
            waiting for hydration to append the tag. */}
        <link rel="preconnect" href={WIDGET_ORIGIN} />
        <link rel="preconnect" href={CHECKOUT_ORIGIN} />
        <link rel="dns-prefetch" href={CHECKOUT_ORIGIN} />
        <link rel="preload" as="script" href={WIDGET_SCRIPT} />
        {/* A checkout has nothing to offer search. Keep it out of the index. */}
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Top bar */}
      <div className="bg-forest-green text-white border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <Link
            to="/sbos"
            className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={14} /> Back to the details
          </Link>
          <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-70">
            <Lock size={12} className="text-terracotta" /> Secure checkout
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-forest-green text-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[460px] h-[460px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 relative">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            {closed ? 'Founding access has closed' : 'Founding access'}
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold leading-tight tracking-tight mb-5">
            {closed ? (
              <>
                Join the full suite at{' '}
                <span className="text-terracotta">£{MONTHLY} a month.</span>
              </>
            ) : (
              <>
                You are joining{' '}
                <span className="text-terracotta">Service Business OS.</span>
              </>
            )}
          </h1>

          {!closed && (
            <>
              <p className="text-base md:text-xl opacity-80 leading-relaxed max-w-2xl mb-8">
                Founding lifetime access to the whole growing suite, for a one off £
                {FOUNDING_PRICE}, or spread over 3 or 10 payments. Pick your option in the checkout
                below.
              </p>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest">
                <span className="inline-flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-full">
                  <Flame size={12} /> {seatLine}
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full tabular-nums">
                  <Clock size={12} className="text-terracotta" /> Closes in {pad(days)}d{' '}
                  {pad(hours)}:{pad(mins)}:{pad(secs)}
                </span>
                {hasGuarantee && (
                  <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full">
                    <ShieldCheck size={12} className="text-terracotta" /> {GUARANTEE.days}-day
                    guarantee
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {closed ? (
          <div className="bg-white border border-forest-green/10 rounded-[2rem] p-8 md:p-12 text-center max-w-2xl mx-auto">
            <p className="text-base md:text-lg leading-relaxed opacity-75 mb-8">
              The {SEATS_TOTAL} founding lifetime seats have gone. You can still join the full suite
              on the monthly membership, with every tool included as it launches.
            </p>
            <a
              href={MONTHLY_URL || '#'}
              className="inline-block bg-terracotta hover:bg-burnt-orange text-white px-8 md:px-10 py-5 md:py-6 rounded-2xl font-extrabold text-lg md:text-2xl shadow-2xl shadow-terracotta/40 hover:scale-105 transition-all"
            >
              Join at £{MONTHLY} / month →
            </a>
          </div>
        ) : (
          <>
            {/* Payment options, so the choice is clear before the form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
              {PLANS.map((plan) => (
                <div
                  key={plan.value}
                  className={`rounded-2xl px-5 py-5 text-center border ${
                    plan.best
                      ? 'border-terracotta bg-terracotta/5'
                      : 'border-forest-green/10 bg-white'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                      plan.best ? 'text-terracotta' : 'opacity-50'
                    }`}
                  >
                    {plan.label}
                  </div>
                  <div className="font-display font-black text-2xl md:text-3xl leading-none">
                    {plan.value}
                  </div>
                  <div className="text-xs opacity-60 mt-2">{plan.sub}</div>
                </div>
              ))}
            </div>

            {/* The checkout, given the full width of the page */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <Checkout />
            </motion.div>

            {/* What you are buying, recapped under the form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
              <div className="bg-white border border-forest-green/10 rounded-[2rem] p-7 md:p-8">
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-5">
                  What is included
                </div>
                <ul className="space-y-3 mb-6">
                  {ROLLOUT.map((tool) => (
                    <li key={tool.name} className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          tool.live
                            ? 'bg-terracotta'
                            : 'bg-transparent border-[1.5px] border-forest-green/30'
                        }`}
                      />
                      <span className="font-display font-extrabold text-base md:text-lg">
                        {tool.name}
                      </span>
                      <span
                        className={`ml-auto text-[10px] md:text-xs font-bold uppercase tracking-widest ${
                          tool.live ? 'text-terracotta' : 'opacity-50'
                        }`}
                      >
                        {tool.short}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-5 border-t border-forest-green/10 space-y-2.5 text-sm md:text-base">
                  {[
                    'Every future tool included as it launches',
                    'Pay once, no renewal, no monthly fee',
                    `One of only ${SEATS_TOTAL} founding seats`,
                  ].map((line) => (
                    <div key={line} className="flex gap-3 leading-relaxed opacity-80">
                      <Check size={18} className="text-terracotta shrink-0 mt-1" strokeWidth={3} />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {hasGuarantee && (
                <div className="bg-forest-green text-white rounded-[2rem] p-7 md:p-8 relative overflow-hidden">
                  <div className="absolute -top-20 -right-16 w-[300px] h-[300px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-terracotta/20 text-terracotta flex items-center justify-center mb-5">
                      <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-display font-extrabold leading-tight mb-4">
                      {GUARANTEE.days}-day money-back guarantee
                    </h2>
                    <ul className="space-y-2.5">
                      {GUARANTEE.conditions.map((line) => (
                        <li
                          key={line}
                          className="flex gap-3 text-sm md:text-base leading-relaxed opacity-90"
                        >
                          <Check size={18} className="text-terracotta shrink-0 mt-1" strokeWidth={3} />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs opacity-50 mt-5 leading-relaxed">
                      Full detail in our{' '}
                      <Link to="/terms" className="underline hover:text-terracotta">
                        terms and conditions
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-10 text-xs md:text-sm opacity-60 leading-relaxed">
              <p>Founding access closes {DEADLINE_LONG} UK, or when the {SEATS_TOTAL} seats are gone.</p>
              <p className="mt-2">
                Questions before you buy?{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="underline hover:text-terracotta">
                  <Mail size={13} className="inline mb-0.5 mr-1" />
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
