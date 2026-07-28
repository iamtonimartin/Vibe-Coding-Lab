import { useRef, useEffect, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'motion/react';
import {
  Check,
  Award,
  LifeBuoy,
  Mail,
  ArrowRight,
  AlertCircle,
  Lock,
  Infinity as InfinityIcon,
} from 'lucide-react';
import {
  ROLLOUT,
  COMMUNITY_URL,
  SUPPORT_EMAIL,
  SEATS_TOTAL,
  MONTHLY,
} from '../components/sbos/config';
import Confetti from '../components/sbos/Confetti';
import Brand from '../components/sbos/Brand';

/* ------------------------------------------------------------------ *
 * Service Business OS · post-purchase page
 *
 * Set this as the Bumpsale campaign's success URL:
 *   https://thevibecodinglab.co/sbos-success
 *
 * Rollout dates and the community link come from the shared config, so
 * this page and the sales page can never quote different dates.
 * ------------------------------------------------------------------ */

const Section = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`py-14 md:py-20 px-4 md:px-6 relative ${className}`}
    >
      {children}
    </motion.section>
  );
};

const GrainOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

const CONFIRMATIONS = [
  { label: 'Founding rate locked', value: 'for life' },
  { label: 'Lifetime access granted', value: 'no renewal' },
  { label: 'Every future tool included', value: 'automatically' },
];

export default function SbosSuccess() {
  /**
   * On desktop the Bumpsale checkout runs inside a full-screen overlay iframe
   * on /sbos, so this page first loads inside that frame. Same origin, so we
   * can promote it to the top window: the buyer gets a real URL they can
   * bookmark or reload rather than a page trapped in a dead overlay.
   */
  useEffect(() => {
    try {
      if (window.top && window.self !== window.top) {
        window.top.location.href = window.location.href;
      }
    } catch {
      /* Cross-origin parent. Leave the page where it is. */
    }
  }, []);

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green overflow-x-hidden selection:bg-terracotta selection:text-white">
      <Confetti />

      <Helmet>
        <title>You&apos;re in · Service Business OS</title>
        <meta
          name="description"
          content="Your founding membership is confirmed. Here is exactly what happens next."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Status bar */}
      <div className="bg-forest-green text-white border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest">
          <Brand />
          <span className="flex items-center gap-2 text-white/70">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            Access granted
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-green text-white">
        <GrainOverlay />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24 relative text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-terracotta bg-terracotta/10 flex items-center justify-center mx-auto mb-8"
          >
            <Check size={40} strokeWidth={3} className="text-terracotta" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="inline-flex items-center gap-2 bg-terracotta/20 border border-terracotta/40 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-7">
              <Check size={12} className="text-terracotta" strokeWidth={3} /> Payment confirmed
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-[1.05] tracking-tight mb-6">
              You&apos;re a <span className="text-terracotta">founding member.</span>
            </h1>

            <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed max-w-2xl mx-auto mb-10">
              You have locked in lifetime access to the whole growing suite, at the founding rate,
              owned once and never expiring. Welcome in. Here is exactly what happens next.
            </p>

            {/* Confirmation readout */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 md:px-8 py-5 md:py-6 max-w-md mx-auto text-left">
              {CONFIRMATIONS.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.12 }}
                  className="flex items-center gap-3 py-2.5"
                >
                  <Check size={16} strokeWidth={3} className="text-terracotta shrink-0" />
                  <span className="text-sm md:text-base font-medium">{row.label}</span>
                  <span className="ml-auto font-mono text-[11px] md:text-xs uppercase tracking-wider text-sand/70">
                    {row.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEXT STEPS */}
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-3xl mx-auto relative">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            Your next moves
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight mb-4">
            Three things, then you&apos;re
            <span className="block text-terracotta">up and running.</span>
          </h2>
          <p className="text-base md:text-xl opacity-70 leading-relaxed mb-10 md:mb-12 max-w-2xl">
            Nothing complicated. Do the first one now, the rest will fall into place.
          </p>

          <div className="border-t border-forest-green/15">
            {/* 01 */}
            <div className="grid grid-cols-[auto_1fr] gap-4 md:gap-7 py-7 md:py-8 border-b border-forest-green/15">
              <div className="font-mono text-sm font-bold text-terracotta tracking-widest pt-1">
                01
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-extrabold mb-3">
                  Check your inbox
                </h3>
                <p className="text-sm md:text-lg opacity-70 leading-relaxed">
                  Your receipt and confirmation are on their way to the email you used at checkout.
                  If it is not there in a few minutes, have a quick look in spam or promotions and
                  drag it across so nothing important gets missed later.
                </p>
              </div>
            </div>

            {/* 02 */}
            <div className="grid grid-cols-[auto_1fr] gap-4 md:gap-7 py-7 md:py-8 border-b border-forest-green/15">
              <div className="font-mono text-sm font-bold text-terracotta tracking-widest pt-1">
                02
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-extrabold mb-3">
                  Get into your community and tools
                </h3>
                <p className="text-sm md:text-lg opacity-70 leading-relaxed">
                  Your founding access is being set up right now. Within 24 hours you will get a
                  second email with your login and everything you need to start using Relavo and
                  Kestry straight away. The community is where each tool lives, with walkthroughs,
                  access details and a room full of other founding members.
                </p>

                <div className="mt-5">
                  {COMMUNITY_URL ? (
                    <>
                      {/* Skool access is request-based. Miss this and the request
                          gets rejected, so it sits above the button, not below. */}
                      <div className="flex items-start gap-3 bg-terracotta/10 border border-terracotta/30 rounded-2xl px-5 py-4 mb-5">
                        <AlertCircle size={18} className="text-terracotta shrink-0 mt-0.5" />
                        <p className="text-sm md:text-base leading-relaxed">
                          <span className="font-bold">
                            Use the email address you paid with.
                          </span>{' '}
                          <span className="opacity-70">
                            Skool asks a couple of questions when you request to join. Answer with
                            your purchase email so we can match you to your order, otherwise we
                            cannot approve you.
                          </span>
                        </p>
                      </div>
                      <a
                        href={COMMUNITY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-terracotta text-white hover:bg-burnt-orange px-7 py-4 rounded-2xl font-extrabold text-base md:text-lg shadow-xl shadow-terracotta/30 hover:scale-105 transition-all"
                      >
                        Request to join the community <ArrowRight size={18} />
                      </a>
                    </>
                  ) : (
                    <div className="inline-flex items-start gap-3 bg-sand border border-forest-green/10 rounded-2xl px-5 py-4">
                      <Mail size={18} className="text-terracotta shrink-0 mt-0.5" />
                      <p className="text-sm md:text-base font-bold leading-relaxed">
                        Your community invite lands in your inbox within 24 hours.
                        <span className="block font-medium opacity-60 mt-1">
                          Nothing to do here, just keep an eye out for it.
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 03 */}
            <div className="grid grid-cols-[auto_1fr] gap-4 md:gap-7 py-7 md:py-8 border-b border-forest-green/15">
              <div className="font-mono text-sm font-bold text-terracotta tracking-widest pt-1">
                03
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-extrabold mb-3">
                  Watch the suite roll out
                </h3>
                <p className="text-sm md:text-lg opacity-70 leading-relaxed mb-5">
                  Two tools are live the moment your access opens. The rest arrive over the coming
                  weeks and your seat covers every one of them without you lifting a finger.
                </p>

                <div className="bg-white border border-forest-green/10 rounded-2xl px-5 md:px-6 py-2">
                  {ROLLOUT.map((tool, i) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-3 py-3 border-b border-dashed border-forest-green/10 last:border-b-0"
                    >
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
                        className={`ml-auto font-mono text-[11px] md:text-xs uppercase tracking-widest ${
                          tool.live ? 'text-terracotta font-bold' : 'opacity-50'
                        }`}
                      >
                        {tool.short}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FOUNDING REINFORCE */}
      <Section className="bg-terracotta text-white overflow-hidden">
        <GrainOverlay />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative text-center">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight mb-6">
            You got in at the right time.
          </h2>
          <p className="text-base md:text-xl opacity-90 leading-relaxed max-w-2xl mx-auto mb-8">
            You took one of only {SEATS_TOTAL} founding seats. Everyone after this joins at £
            {MONTHLY} a month, so founding members are the only people who will ever own this suite
            outright.
          </p>
          <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/25 rounded-full px-5 py-3 font-mono text-[11px] md:text-xs uppercase tracking-widest">
            <Award size={14} />
            One of {SEATS_TOTAL} founding seats · yours for life
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 mt-8 text-xs md:text-sm font-bold opacity-90">
            <span className="inline-flex items-center gap-2">
              <InfinityIcon size={14} /> Pay once, no renewal
            </span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span className="inline-flex items-center gap-2">
              <Lock size={14} /> Every future tool included
            </span>
          </div>
        </div>
      </Section>

      {/* SUPPORT */}
      <Section className="bg-forest-green text-white overflow-hidden">
        <GrainOverlay />
        <div className="absolute -bottom-32 right-0 w-[420px] h-[420px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto relative text-center">
          <div className="w-12 h-12 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center mx-auto mb-6">
            <LifeBuoy size={24} />
          </div>
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            You are never on your own
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight mb-5">
            Stuck on anything? We have you.
          </h2>
          <p className="text-base md:text-lg opacity-75 leading-relaxed mb-9">
            Every tool has a support desk built in, with a response within 24 hours. And the
            community is there whenever you want a faster answer from someone who has already
            solved the same thing.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 hover:bg-white/5 px-7 py-4 rounded-2xl font-extrabold text-base md:text-lg transition-all"
          >
            <Mail size={18} /> Email support any time
          </a>
          <div className="font-mono text-[11px] md:text-xs opacity-50 mt-4 tracking-wider">
            {SUPPORT_EMAIL}
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-forest-green text-white/50 border-t border-white/10 py-7 px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] md:text-xs uppercase tracking-widest">
          <span>Service Business OS</span>
          <span>Founding member · Welcome in</span>
        </div>
      </footer>
    </div>
  );
}
