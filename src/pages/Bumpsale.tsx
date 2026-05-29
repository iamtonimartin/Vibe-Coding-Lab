import { useState, useRef, useEffect, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Plus,
  Minus,
  ArrowRight,
  Zap,
  Check,
  X,
  Flame,
  Clock,
  Sparkles,
  Lock,
  Layers,
  Wrench,
  Code,
  Globe,
} from 'lucide-react';

const BUMPSALE_ID = '5VfAevuDxziJBFH98VAnWzdC';
// Standalone price displays (not on widget buttons) still need manual updates.
const CURRENT_PRICE = 12;
const PRICE_CAP = 99;
const TOTAL_VALUE = 1715;
const DEADLINE = new Date('2026-06-03T23:59:00+01:00');

const useCountdown = () => {
  const [diff, setDiff] = useState(() => DEADLINE.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(DEADLINE.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const safe = Math.max(0, diff);
  const totalSec = Math.floor(safe / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    mins: Math.floor((totalSec % 3600) / 60),
    secs: totalSec % 60,
    expired: diff <= 0,
  };
};

const Section = ({
  children,
  className = '',
  id = '',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`py-14 md:py-24 px-4 md:px-6 relative ${className}`}
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

const FAQItem = ({ question, answer }: { question: string; answer: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-forest-green/10 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <h3 className="text-base md:text-xl font-bold group-hover:text-terracotta transition-colors pr-4">
          {question}
        </h3>
        <div className="text-terracotta">{isOpen ? <Minus size={24} /> : <Plus size={24} />}</div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 text-forest-green/80 leading-relaxed text-sm md:text-lg">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BuyButton = ({
  size = 'lg',
  className = '',
  variant = 'terracotta',
  label = 'Buy now — _PRICE_',
}: {
  size?: 'lg' | 'xl';
  className?: string;
  variant?: 'terracotta' | 'white';
  label?: string;
}) => {
  const sizing =
    size === 'xl'
      ? 'px-10 py-6 text-lg md:text-2xl'
      : 'px-8 py-5 text-base md:text-xl';
  const colors =
    variant === 'white'
      ? 'bg-white text-terracotta hover:bg-warm-cream shadow-2xl'
      : 'bg-terracotta text-white hover:bg-burnt-orange shadow-2xl shadow-terracotta/40';
  return (
    <a
      href="#"
      data-bumpsale={BUMPSALE_ID}
      data-bumpsale-text={label}
      className={`bumpsale_button inline-block text-center ${colors} ${sizing} rounded-2xl font-extrabold hover:scale-105 transition-all ${className}`}
    />
  );
};

type BundleItem = {
  index: string;
  title: string;
  tag: string;
  worth: string;
  paragraphs: string[];
  cta?: string;
  icon: ReactNode;
  accent: 'terracotta' | 'sand' | 'forest';
  modal?: { title: string; body: ReactNode };
};

const BUNDLE: BundleItem[] = [
  {
    index: '01',
    title: 'Relavo',
    tag: 'Lifetime access',
    worth: '£497',
    icon: <Layers />,
    accent: 'terracotta',
    paragraphs: [
      "Relavo helps you manage AI conversations across your business. Whether you're running client work, customer support, or building your own AI-powered service, Relavo gives you a single place to handle conversations, track usage, and bill for credits. Stripe is built in, so you can charge for access from day one.",
      'You get lifetime access at the tier locked in for this bundle. No monthly fees, no renewal, no surprises.',
    ],
    cta: 'See Relavo in action',
    modal: {
      title: 'Relavo',
      body: (
        <>
          <p>
            Relavo helps you manage AI conversations across your business — client work, customer
            support, or your own AI-powered service. A single place to handle conversations, track
            usage, and bill for credits. Stripe built in.
          </p>
          <p className="mt-4 text-sm opacity-70">Full product walkthrough coming soon.</p>
        </>
      ),
    },
  },
  {
    index: '02',
    title: 'Zenitro',
    tag: 'Lifetime access at launch',
    worth: '£497',
    icon: <Sparkles />,
    accent: 'sand',
    paragraphs: [
      "Zenitro turns your expertise into a diagnostic tool. Build interactive quizzes and assessments that score people, qualify leads, or deliver personalised results, all driven by AI. The moment it ships, you're in for life. Locked in at the bundle tier, never billed again.",
    ],
    cta: 'See Zenitro in action',
    modal: {
      title: 'Zenitro',
      body: (
        <>
          <p>
            Turn your expertise into an AI-powered diagnostic. Build quizzes and assessments that
            score people, qualify leads, or deliver personalised results — all driven by AI.
          </p>
          <p className="mt-4 text-sm opacity-70">Launching soon. Preview coming inside VCL.</p>
        </>
      ),
    },
  },
  {
    index: '03',
    title: 'Vibe Coding Lab Premium',
    tag: 'Lifetime access',
    worth: '£180/year',
    icon: <Lock />,
    accent: 'forest',
    paragraphs: [
      "VCL is the community for founders building with AI. Premium is normally $19/month, you'll get lifetime access at this tier as part of the bundle.",
      "Inside Premium you'll get everything in the free Standard tier, plus the Vibe Lab (hands-on training for Antigravity, Claude Code and more), Vibe Tribe (weekly co-working sessions where you build alongside the community), and Stuck? Let's Fix It (weekly support for your blockers, bugs and automations).",
    ],
    cta: 'See inside VCL',
    modal: {
      title: 'Vibe Coding Lab Premium',
      body: (
        <>
          <p>
            The community for founders building with AI. Vibe Lab training, weekly Vibe Tribe
            co-working, Stuck? Let's Fix It weekly support — all yours, lifetime.
          </p>
          <p className="mt-4 text-sm opacity-70">Tour of the community coming soon.</p>
        </>
      ),
    },
  },
  {
    index: '04',
    title: 'Zero to Deployed',
    tag: 'Live workshop series',
    worth: '£297',
    icon: <Code />,
    accent: 'terracotta',
    paragraphs: [
      "Two live workshops in July, hosted inside VCL. You'll learn the exact tools and workflow Toni uses to build the products clients have paid premium rates to commission.",
      "You'll learn how to plan a build with AI, build it out with Claude Code, connect a database with Supabase, and deploy to Vercel. By the end, you'll have a working, deployed web app and a repeatable process you can use on every project after this one.",
      'Live with Toni, recordings included in your VCL access.',
    ],
  },
  {
    index: '05',
    title: 'The Build Your Website Workshop',
    tag: 'Live session',
    worth: '£147',
    icon: <Globe />,
    accent: 'sand',
    paragraphs: [
      'One live session in July, hosted inside VCL. Build and deploy a real website with AI, from blank page to live URL. Recording included in your VCL access.',
    ],
  },
  {
    index: '06',
    title: 'The ICI Framework',
    tag: 'Documented edition',
    worth: '£97',
    icon: <Wrench />,
    accent: 'forest',
    paragraphs: [
      'The proprietary prompt engineering framework behind every product Toni builds. Identity, Capability, Interaction. Packaged as a working document you can use immediately.',
    ],
  },
];

const accentClasses = {
  terracotta: {
    card: 'bg-white border-terracotta/20',
    badge: 'bg-terracotta text-white',
    iconWrap: 'bg-terracotta/10 text-terracotta',
  },
  sand: {
    card: 'bg-sand border-forest-green/10',
    badge: 'bg-forest-green text-white',
    iconWrap: 'bg-forest-green/10 text-forest-green',
  },
  forest: {
    card: 'bg-forest-green text-white border-forest-green',
    badge: 'bg-terracotta text-white',
    iconWrap: 'bg-white/10 text-white',
  },
};

export default function Bumpsale() {
  const [modal, setModal] = useState<{ title: string; body: ReactNode } | null>(null);
  const { days, hours, mins, secs, expired } = useCountdown();

  const TimeCell = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 md:px-5 py-2 md:py-3 min-w-[60px] md:min-w-[80px]">
        <div className="text-2xl md:text-4xl font-display font-black tabular-nums">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-70 mt-2">
        {label}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green overflow-x-hidden selection:bg-terracotta selection:text-white scroll-smooth">
      <Helmet>
        <title>Build with AI Bundle — Lifetime Access from £1 | Vibe Coding Lab</title>
        <meta
          name="description"
          content="Lifetime access to two AI products, lifetime VCL Premium, live workshops, and the ICI Framework. Bumpsale starts at £1, caps at £99. Ends 11:59pm Wednesday 3 June."
        />
        <link rel="canonical" href="https://thevibecodinglab.co/bumpsale" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Toni Martin" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thevibecodinglab.co/bumpsale" />
        <meta property="og:site_name" content="Vibe Coding Lab" />
        <meta property="og:title" content="Build with AI Bundle — Lifetime Access from £1" />
        <meta
          property="og:description"
          content="Worth £1,715. Yours from £1. The price goes up £1 with every sale, capped at £99. Ends 3 June."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Build with AI Bundle — Lifetime Access from £1" />
        <meta
          name="twitter:description"
          content="Worth £1,715. Yours from £1. The price goes up £1 with every sale, capped at £99. Ends 3 June."
        />
        <script src="https://widgets.bumpsale.co/button.js"></script>
      </Helmet>

      {/* Sticky urgency bar */}
      <div className="sticky top-0 z-40 bg-forest-green text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <Flame className="text-terracotta shrink-0 animate-pulse" size={18} />
            <div className="text-[11px] md:text-sm font-bold truncate">
              <span className="opacity-70">Current price</span>{' '}
              <span
                data-bumpsale={BUMPSALE_ID}
                data-bumpsale-text="£_PRICE_"
                className="text-terracotta cursor-pointer"
              >
                £{CURRENT_PRICE}
              </span>
              <span className="opacity-50 hidden md:inline"> · climbs to £{PRICE_CAP}</span>
            </div>
          </div>
          <a
            href="#"
            data-bumpsale={BUMPSALE_ID}
            data-bumpsale-text="Buy for _PRICE_"
            className="bumpsale_button bg-terracotta text-white px-4 md:px-6 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-burnt-orange hover:scale-105 transition-all shadow-lg shadow-terracotta/30 whitespace-nowrap"
          />
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-green text-white">
        <GrainOverlay />
        {/* Glow */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-terracotta/20 border border-terracotta/40 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8">
              <Flame size={12} className="text-terracotta" /> Bumpsale live
            </div>

            <h1 className="text-5xl md:text-8xl font-display font-extrabold leading-[0.95] tracking-tight mb-6">
              Build with AI
              <span className="block text-terracotta">Bundle.</span>
            </h1>

            <p className="text-lg md:text-2xl font-medium opacity-80 leading-relaxed max-w-3xl mx-auto mb-10">
              Lifetime access to two AI products, lifetime VCL Premium, live workshops, and the ICI
              Framework. Starting from £1.
            </p>

            {/* Value stack */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-10">
              <div className="flex items-baseline gap-3">
                <span className="text-base md:text-xl font-bold opacity-50 line-through">
                  Worth £{TOTAL_VALUE.toLocaleString()}.
                </span>
              </div>
              <div className="text-2xl md:text-4xl font-display font-black text-terracotta">
                Yours from £1.
              </div>
            </div>

            {/* Live price card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl px-8 md:px-12 py-8 md:py-10 mb-10"
            >
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                Live price right now
              </div>
              <div
                data-bumpsale={BUMPSALE_ID}
                data-bumpsale-text="£_PRICE_"
                className="text-7xl md:text-9xl font-display font-black text-terracotta tabular-nums leading-none cursor-pointer"
              >
                £{CURRENT_PRICE}
              </div>
              <div className="text-xs md:text-sm font-medium opacity-60 mt-3">
                Price climbs by £1 with every sale
              </div>
            </motion.div>

            <div className="flex justify-center mb-10">
              <BuyButton size="xl" />
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm opacity-70 mb-4">
              <Clock size={14} />
              <span className="font-bold uppercase tracking-widest">
                {expired ? 'Campaign ended' : 'Ends 11:59pm Wed 3 June'}
              </span>
            </div>
            {!expired && (
              <div className="flex items-start justify-center gap-2 md:gap-4">
                <TimeCell value={days} label="Days" />
                <TimeCell value={hours} label="Hours" />
                <TimeCell value={mins} label="Mins" />
                <TimeCell value={secs} label="Secs" />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* HERE'S WHAT'S HAPPENING */}
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-4xl mx-auto relative text-center">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            Here's what's happening
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight mb-8">
            Every time someone buys this bundle,
            <span className="block text-terracotta">the price goes up by £1.</span>
          </h2>
          <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-3xl mx-auto mb-12">
            The first buyer paid £1. The second paid £2. The price climbs with every sale until it
            caps at £99, or until 11:59pm on Wednesday 3 June, whichever comes first.
          </p>

          {/* Price ladder */}
          <div className="flex items-center justify-center flex-wrap gap-2 md:gap-3 mb-12">
            {[1, 2, 3].map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-forest-green/10 rounded-xl px-4 md:px-6 py-3 md:py-4 font-display font-black text-xl md:text-3xl"
              >
                £{p}
              </motion.div>
            ))}
            <span className="text-2xl opacity-40 mx-2">···</span>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-terracotta text-white rounded-xl px-4 md:px-6 py-3 md:py-4 font-display font-black text-xl md:text-3xl shadow-lg shadow-terracotta/30"
            >
              £{PRICE_CAP}
            </motion.div>
          </div>

          <div
            data-bumpsale-progress={BUMPSALE_ID}
            className="max-w-2xl mx-auto mb-10"
          />

          <BuyButton />
        </div>
      </Section>

      {/* WHAT YOU'RE GETTING */}
      <Section className="bg-sand overflow-hidden">
        <GrainOverlay />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              What you're getting
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
              Six things. One bundle.
              <span className="block">
                Worth <span className="text-terracotta">£{TOTAL_VALUE.toLocaleString()}.</span>
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {BUNDLE.map((item, i) => {
              const a = accentClasses[item.accent];
              return (
                <motion.div
                  key={item.index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className={`relative rounded-[2rem] border p-7 md:p-9 flex flex-col ${a.card}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.iconWrap}`}>
                        {item.icon}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-50">
                        {item.index}
                      </div>
                    </div>
                    <div className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${a.badge}`}>
                      Worth {item.worth}
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-extrabold leading-tight mb-1">
                    {item.title}
                  </h3>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-60 mb-5">
                    {item.tag}
                  </div>

                  <div className="space-y-4 mb-6 flex-1">
                    {item.paragraphs.map((p, idx) => (
                      <p key={idx} className="text-sm md:text-base leading-relaxed opacity-90">
                        {p}
                      </p>
                    ))}
                  </div>

                  {item.cta && item.modal && (
                    <button
                      onClick={() => setModal(item.modal!)}
                      className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest self-start transition-colors ${
                        item.accent === 'forest'
                          ? 'text-terracotta hover:text-white'
                          : 'text-terracotta hover:text-burnt-orange'
                      }`}
                    >
                      {item.cta} <ArrowRight size={16} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* VALUE STACK REVEAL */}
      <Section className="bg-forest-green text-white overflow-hidden">
        <GrainOverlay />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-12">
            <div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-60 mb-3">
                Total face value
              </div>
              <div className="text-5xl md:text-7xl font-display font-black line-through opacity-60">
                £{TOTAL_VALUE.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-3">
                Top price in this campaign
              </div>
              <div className="text-5xl md:text-7xl font-display font-black text-terracotta">
                £{PRICE_CAP}
              </div>
            </div>
          </div>

          <p className="text-lg md:text-2xl font-medium opacity-90 leading-relaxed max-w-3xl mx-auto">
            That's the entire bundle for{' '}
            <span className="text-terracotta font-bold">less than 6% of its value</span>, even if
            you're the last one through the door.
          </p>
        </div>
      </Section>

      {/* WHO THIS IS FOR / ISN'T FOR */}
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white border border-forest-green/10 rounded-[2rem] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                  <Check size={20} strokeWidth={3} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold">
                  Who this is for
                </h3>
              </div>
              <p className="text-base md:text-lg leading-relaxed opacity-80">
                Non-technical founders who want to build with AI without learning to code the
                traditional way. People who've watched the vibe coding movement happen and want a
                way in. Anyone who wants lifetime access to two AI products and the VCL community
                locked in at this bundle's tier.
              </p>
            </div>

            <div className="bg-forest-green text-white rounded-[2rem] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                  <X size={20} strokeWidth={3} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold">
                  Who this isn't for
                </h3>
              </div>
              <p className="text-base md:text-lg leading-relaxed opacity-80">
                People looking for done-for-you services. People who don't want to actually build
                anything. VCL VIP lifetime deal holders, who already have access to Relavo and
                Zenitro through their LTD.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* HOW THE PRICE WORKS */}
      <Section className="bg-terracotta text-white overflow-hidden">
        <GrainOverlay />
        <div className="max-w-4xl mx-auto relative text-center">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-80 mb-4">
            How the price works
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight mb-8">
            This is a Bumpsale.
            <span className="block">The price increases by £1 with every purchase.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            {[
              { label: 'Buyer #1 paid', price: '£1' },
              { label: 'Buyer #50 will pay', price: '£50' },
              { label: 'Buyer #99 will pay', price: '£99' },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
              >
                <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">
                  {b.label}
                </div>
                <div className="text-4xl md:text-5xl font-display font-black">{b.price}</div>
              </motion.div>
            ))}
          </div>

          <p className="text-base md:text-lg opacity-90 mb-2 leading-relaxed">
            And that's where it stops. The campaign ends when 99 bundles have sold or at 11:59pm on
            Wednesday 3 June 2026, whichever comes first.
          </p>
          <p className="text-base md:text-lg font-bold mb-10">
            Whatever you pay, you get exactly the same bundle.
          </p>

          <BuyButton size="xl" variant="white" />
        </div>
      </Section>

      {/* DELIVERY */}
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-3xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              Delivery
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight">
              How and when you'll get everything.
            </h2>
          </div>

          <div className="bg-white border border-forest-green/10 rounded-[2rem] p-8 md:p-10">
            <ul className="space-y-5">
              {[
                { label: 'Relavo access', detail: 'emailed within 48 hours of purchase.' },
                { label: 'Zenitro access', detail: 'emailed when the product launches.' },
                { label: 'VCL Premium access', detail: 'emailed within 48 hours of purchase.' },
                { label: 'Workshops', detail: 'dates announced inside VCL in early July.' },
                { label: 'ICI Framework', detail: 'delivered immediately on purchase.' },
              ].map((d, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0 mt-0.5">
                    <Zap size={16} fill="currentColor" />
                  </div>
                  <div className="text-base md:text-lg leading-relaxed">
                    <span className="font-extrabold">{d.label}:</span>{' '}
                    <span className="opacity-80">{d.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* QUESTIONS */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              Questions
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
              Got something on your mind?
            </h2>
          </div>
          <div className="space-y-2">
            <FAQItem
              question='What does "lifetime" mean?'
              answer="Lifetime access to the product at the tier specified. If the product is sunset or fundamentally changes, we'll honour the spirit of the deal."
            />
            <FAQItem
              question="Can I miss the workshops and still get value?"
              answer="Yes. Every workshop is recorded and available inside VCL."
            />
            <FAQItem
              question="Can I get a refund?"
              answer="No. The Bumpsale model relies on every sale counting toward the price for the next buyer. By buying, you're locking in your spot in the sequence."
            />
            <FAQItem
              question="I'm already in VCL. Should I still buy this?"
              answer="If you're a VCL VIP lifetime member, you already have access to Relavo and Zenitro, so this isn't for you. If you're on a paid monthly plan or you're a free Standard member, this is a way to lock in lifetime Premium access plus both SaaS products at one shot."
            />
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="bg-forest-green text-white text-center overflow-hidden">
        <GrainOverlay />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-terracotta/20 border border-terracotta/40 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8">
            <Flame size={12} className="text-terracotta" /> Price climbs with every sale
          </div>

          <h2 className="text-4xl md:text-7xl font-display font-extrabold leading-[0.95] tracking-tight mb-8">
            Every second you wait
            <span className="block text-terracotta">costs you £1.</span>
          </h2>

          <div className="text-2xl md:text-4xl font-display font-black mb-10">
            Live price:{' '}
            <span
              data-bumpsale={BUMPSALE_ID}
              data-bumpsale-text="£_PRICE_"
              className="text-terracotta cursor-pointer"
            >
              £{CURRENT_PRICE}
            </span>
          </div>

          <BuyButton size="xl" />

          <div className="mt-12 text-xs md:text-sm opacity-50 font-medium">
            Built and hosted by Vibe Coding Lab.
          </div>
        </div>
      </Section>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
            className="fixed inset-0 z-[100] bg-forest-green/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="relative bg-warm-cream text-forest-green rounded-[2rem] p-8 md:p-12 max-w-2xl w-full cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-forest-green/5 hover:bg-forest-green hover:text-white text-forest-green flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X size={18} strokeWidth={3} />
              </button>
              <div className="text-xs font-bold uppercase tracking-widest text-terracotta mb-3">
                Inside the bundle
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold mb-6 leading-tight">
                {modal.title}
              </h3>
              <div className="text-base md:text-lg leading-relaxed opacity-90 space-y-4">
                {modal.body}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
