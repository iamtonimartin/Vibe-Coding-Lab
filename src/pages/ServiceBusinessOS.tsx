import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Plus,
  Minus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Flame,
  Lock,
  Clock,
  MessageSquare,
  LifeBuoy,
  Gauge,
  FileText,
  Megaphone,
  Users,
  ShieldCheck,
  Infinity as InfinityIcon,
} from 'lucide-react';
import {
  FOUNDING_PRICE,
  MONTHLY,
  SEATS_TOTAL,
  JOIN_PATH,
  DEADLINE_SHORT,
  SOLD_OUT,
  PLANS,
  GUARANTEE,
  MONTHLY_URL,
  STATUS,
  OG_IMAGE,
  WIDGET_ORIGIN,
  CHECKOUT_ORIGIN,
  WIDGET_SCRIPT,
} from '../components/sbos/config';
import { useCountdown, pad } from '../components/sbos/useCountdown';
import { useSeats, seatLabel } from '../components/sbos/useSeats';

/* ------------------------------------------------------------------ *
 * Service Business OS · founding launch
 *
 * A flat one off founding price for a capped cohort, sold through a
 * single ThriveCart checkout that carries all three payment options.
 *
 * Founding access closes on whichever comes first: the deadline, the
 * seats running out, or the SOLD_OUT switch in config. When it does,
 * every price display and CTA on the page flips to the monthly offer.
 * ------------------------------------------------------------------ */

const YEAR_ONE = MONTHLY * 12;

/* ------------------------------------------------------------------ *
 * Shared bits, matching the house style used on /bundle
 * ------------------------------------------------------------------ */

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
        <div className="text-terracotta shrink-0">
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </div>
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

/**
 * Holding panel for a tool that has not been built yet.
 *
 * Built as a component rather than an exported image so it stays sharp at any
 * size, picks up the palette directly and needs no asset to maintain. Matches
 * the screenshot aspect ratio so the grid stays even beside real shots.
 */
const ComingSoon = ({ name, when }: { name: string; when: string }) => (
  <div className="aspect-[2880/1559] rounded-2xl bg-forest-green text-white relative overflow-hidden flex items-center justify-center text-center px-6 border border-forest-green">
    <GrainOverlay />
    <div
      className="absolute inset-0 opacity-[0.06] pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(#f5f5f0 1px, transparent 1px), linear-gradient(90deg, #f5f5f0 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
    <div className="absolute -top-16 -right-16 w-[280px] h-[280px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl bg-terracotta/20 text-terracotta flex items-center justify-center mx-auto mb-5">
        <Megaphone size={26} />
      </div>
      <div className="text-3xl md:text-4xl font-display font-extrabold leading-none mb-4">
        {name}
      </div>
      <div className="inline-flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
        <Clock size={12} /> {when}
      </div>
      <p className="text-xs md:text-sm opacity-60 mt-5 max-w-[22rem] mx-auto leading-relaxed">
        In build. Your founding seat covers it the day it lands, at no extra cost.
      </p>
    </div>
  </div>
);

/**
 * Screenshot with a navigable portal lightbox.
 *
 * Once open, the whole set for that tool is browsable in place: arrows,
 * left/right keys, swipe on touch and a counter. Nobody has to close and
 * reopen to see the next screen. `compact` drops the thumbnail strip for the
 * smaller cards, where the lightbox is the only way through the set.
 */
const Shots = ({
  images,
  title,
  compact = false,
}: {
  images: string[];
  title: string;
  compact?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const open = lightboxIndex !== null;
  const multiple = images.length > 1;

  useEffect(() => setMounted(true), []);

  const step = (delta: number) =>
    setLightboxIndex((i) => (i === null ? i : (i + delta + images.length) % images.length));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, images.length]);

  // Keep the inline preview in sync, so closing the lightbox leaves the card
  // showing whichever screen was last looked at.
  useEffect(() => {
    if (lightboxIndex !== null) setActive(lightboxIndex);
  }, [lightboxIndex]);

  const NavButton = ({ dir }: { dir: -1 | 1 }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        step(dir);
      }}
      className={`absolute top-1/2 -translate-y-1/2 ${
        dir === -1 ? 'left-2 md:left-5' : 'right-2 md:right-5'
      } w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 hover:bg-white text-forest-green flex items-center justify-center shadow-2xl transition-all hover:scale-105`}
      aria-label={dir === -1 ? 'Previous screen' : 'Next screen'}
    >
      {dir === -1 ? <ChevronLeft size={26} strokeWidth={2.5} /> : <ChevronRight size={26} strokeWidth={2.5} />}
    </button>
  );

  const lightboxNode = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[2147483646] flex items-center justify-center p-4 md:p-16 cursor-zoom-out"
          style={{ backgroundColor: '#0e1f16' }}
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={images[lightboxIndex!]}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              src={images[lightboxIndex!]}
              alt={`${title} screen ${lightboxIndex! + 1}`}
              className="rounded-xl shadow-2xl bg-white max-w-full max-h-full object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>

          {multiple && (
            <>
              <NavButton dir={-1} />
              <NavButton dir={1} />
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <div className="bg-white/10 border border-white/20 backdrop-blur-sm text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full tabular-nums">
                  {lightboxIndex! + 1} / {images.length}
                </div>
                <div className="hidden md:flex items-center gap-1.5">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex(i);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        i === lightboxIndex ? 'w-6 bg-terracotta' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to screen ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white text-forest-green hover:bg-warm-cream flex items-center justify-center shadow-2xl transition-all"
            aria-label="Close enlarged image"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxIndex(active)}
        className="group relative block w-full rounded-2xl overflow-hidden border border-forest-green/10 bg-white shadow-sm cursor-zoom-in"
        aria-label={`Enlarge ${title} screen ${active + 1}`}
      >
        <img
          src={images[active]}
          alt={`${title} screen ${active + 1}`}
          loading="lazy"
          className="w-full h-auto block bg-white"
        />
        {multiple && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-forest-green/85 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full opacity-90 group-hover:opacity-100 transition-opacity">
            <Maximize2 size={11} /> {images.length} screens
          </span>
        )}
      </button>

      {multiple && !compact && (
        <div className="flex gap-2 mt-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`flex-1 rounded-lg overflow-hidden border transition-all ${
                i === active
                  ? 'border-terracotta ring-2 ring-terracotta/30'
                  : 'border-forest-green/10 opacity-60 hover:opacity-100'
              }`}
              aria-label={`${title} screen ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" className="w-full h-auto block bg-white" />
            </button>
          ))}
        </div>
      )}

      {mounted && createPortal(lightboxNode, document.body)}
    </>
  );
};

/* ------------------------------------------------------------------ *
 * The tools
 * ------------------------------------------------------------------ */

type Tool = {
  name: string;
  status: string;
  strap: string;
  paragraphs: string[];
  icon: ReactNode;
  images?: string[];
  /** No product to screenshot yet. Renders the designed holding panel. */
  comingSoon?: string;
};

const LIVE_TOOLS: Tool[] = [
  {
    name: 'Relavo',
    status: STATUS.Relavo,
    strap: 'AI assistants that handle your conversations for you.',
    paragraphs: [
      'Capture enquiries, answer the questions you get asked a hundred times, qualify leads and keep things moving while you get on with the actual work.',
      'Less time glued to the inbox, more conversations handled without you.',
    ],
    icon: <MessageSquare />,
    // The arc of the copy: a conversation handled, the assistants behind it,
    // what the visitor actually sees, and the lead that falls out the end.
    images: [
      '/relavo/relavo-inbox.png',
      '/relavo/relavo-assistants.png',
      '/relavo/relavo-standalone.png',
      '/relavo/relavo-leads.png',
    ],
  },
  {
    name: 'Kestry',
    status: STATUS.Kestry,
    strap: 'Your customer support desk in one clean place.',
    paragraphs: [
      'Every client request, question and ticket handled properly, with AI that drafts the reply, live chat for your site and a branded help centre per product.',
      'Nothing slips, nobody gets forgotten and the monthly bill for a support platform goes away.',
    ],
    icon: <LifeBuoy />,
    // Tickets, the AI drafting a reply, the branded help centre, the reporting.
    // The AI shot earns its place: nothing else proves that line of the copy.
    images: [
      '/kestry/kestry-inbox.png',
      '/kestry/kestry-ai-response.png',
      '/kestry/kestry-help-centre-view.png',
      '/kestry/kestry-report-example.png',
    ],
  },
];

const SOON_TOOLS: Tool[] = [
  {
    name: 'Zenitro',
    status: STATUS.Zenitro,
    strap: 'Quizzes, scorecards and diagnostics that turn curious visitors into qualified leads.',
    paragraphs: [
      'Let people find out where they stand and hand yourself a warm lead who already knows they need you.',
    ],
    icon: <Gauge />,
    // Scored leads first, because that is what the buyer is buying.
    images: [
      '/zenitro/zenitro-leads.png',
      '/zenitro/zenitro-results-pdf.png',
      '/zenitro/zenitro-question.png',
      '/zenitro/zenitro-disgnostic-type.png',
    ],
  },
  {
    name: 'Draftd',
    status: STATUS.Draftd,
    strap: 'Proposals, written for you.',
    paragraphs: [
      'Turn a conversation into a polished, client ready proposal in minutes rather than an evening. Faster from interested to signed.',
    ],
    icon: <FileText />,
    images: [
      '/draftd/draftd-proposal-example.png',
      '/draftd/draftd-new-proposal.png',
      '/draftd/draftd-dashboard.png',
      '/draftd/draftd-analytics.png',
    ],
  },
  {
    name: 'Vysbl',
    status: STATUS.Vysbl,
    strap: 'Your content, everywhere, without living on the socials.',
    paragraphs: [
      'Repurpose what you have already made and get it posted across your channels, so you stay visible while you run the business.',
    ],
    icon: <Megaphone />,
    comingSoon: 'Coming October 2026',
  },
];

/* ------------------------------------------------------------------ */

export default function ServiceBusinessOS() {
  const { days, hours, mins, secs, expired } = useCountdown();
  const seats = useSeats();

  const closed = SOLD_OUT || expired || seats === 0;
  const hasGuarantee = GUARANTEE.days > 0;

  const seatLine = `${seatLabel(seats)} · then £${MONTHLY}/month`;

  /** Every CTA on the page. Flips to the monthly offer once founding closes. */
  const CTA = ({
    label,
    size = 'lg',
    variant = 'terracotta',
    className = '',
    anchor,
  }: {
    label: string;
    size?: 'lg' | 'xl';
    variant?: 'terracotta' | 'white';
    className?: string;
    /** Scroll to a section on this page instead of going to the checkout. */
    anchor?: string;
  }) => {
    const sizing =
      size === 'xl'
        ? 'px-8 md:px-10 py-5 md:py-6 text-lg md:text-2xl'
        : 'px-8 py-5 text-base md:text-xl';
    const colors =
      variant === 'white'
        ? 'bg-white text-terracotta hover:bg-warm-cream shadow-2xl'
        : 'bg-terracotta text-white hover:bg-burnt-orange shadow-2xl shadow-terracotta/40';
    const classes = `inline-block text-center ${colors} ${sizing} rounded-2xl font-extrabold hover:scale-105 transition-all ${className}`;
    const text = `${closed ? `Join at £${MONTHLY} / month` : label} →`;

    if (anchor && !closed) {
      return (
        <a href={anchor} className={classes}>
          {text}
        </a>
      );
    }
    if (closed) {
      return (
        <a href={MONTHLY_URL || '#'} className={classes}>
          {text}
        </a>
      );
    }
    return (
      <Link to={JOIN_PATH} className={classes}>
        {text}
      </Link>
    );
  };

  const TimeCell = ({ value, label }: { value: number | null; label: string }) => (
    <div className="flex-1 max-w-[74px]">
      <div className="bg-white/5 border border-white/15 rounded-xl py-2.5 px-1">
        <div className="text-2xl md:text-3xl font-display font-black text-center tabular-nums leading-none">
          {pad(value)}
        </div>
      </div>
      <div className="text-[9px] font-bold uppercase tracking-widest opacity-50 text-center mt-2">
        {label}
      </div>
    </div>
  );

  /** The founding price card. Open state, or the monthly offer once closed. */
  const PriceCard = () => (
    <div className="bg-forest-green/60 backdrop-blur-sm border border-white/15 rounded-[1.5rem] p-6 md:p-8">
      <div className="flex items-center justify-between pb-4 border-b border-dashed border-white/20 text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
        <span className="opacity-60">Founding lifetime</span>
        <span className={`flex items-center gap-2 ${closed ? 'opacity-50' : 'text-terracotta'}`}>
          {!closed && <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />}
          {closed ? 'Closed' : 'Open'}
        </span>
      </div>

      {closed ? (
        <div className="pt-6 text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-50 mb-5">
            Founding access has closed
          </div>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-2xl md:text-3xl font-display font-bold text-sand">£</span>
            <span className="text-6xl md:text-7xl font-display font-black tabular-nums leading-none">
              {MONTHLY}
            </span>
            <span className="text-sm font-medium opacity-60">/ month</span>
          </div>
          <p className="text-sm opacity-70 leading-relaxed mt-5 mb-6">
            The founding lifetime seats have gone. You can still join the full suite on the monthly
            membership.
          </p>
          <CTA label="" className="w-full" />
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-4">
            The whole suite, cancel any time
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 pt-6 pb-1">
            <span className="text-3xl md:text-4xl font-display font-bold text-sand">£</span>
            <span className="text-6xl md:text-7xl font-display font-black tabular-nums leading-none">
              {FOUNDING_PRICE}
            </span>
            <span className="text-sm font-bold text-terracotta uppercase tracking-widest">once</span>
          </div>
          <p className="text-sm opacity-70 leading-relaxed mb-5">
            Not per month. Lifetime access to the whole growing suite.
          </p>

          {/* Countdown */}
          <div className="pt-4 border-t border-dashed border-white/20">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 text-center mb-3">
              Founding access closes in
            </div>
            <div className="flex justify-center gap-2 mb-6">
              <TimeCell value={days} label="Days" />
              <TimeCell value={hours} label="Hrs" />
              <TimeCell value={mins} label="Min" />
              <TimeCell value={secs} label="Sec" />
            </div>
          </div>

          <CTA label="Lock in my founding seat" className="w-full" />

          <div className="text-xs text-center opacity-60 mt-4">
            or spread it: <span className="font-bold text-sand">3 × £175</span> or{' '}
            <span className="font-bold text-sand">10 × £55</span>
          </div>
          {/* Two lines, not four. The old stack repeated the seat cap twice and
              duplicated the guarantee, which already sits in the trust row
              beside the headline. The countdown above covers "closes in". */}
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-terracotta mt-4 text-center">
            <Flame size={12} className="shrink-0" /> {seatLine}
          </div>
          <div className="text-[10px] text-center opacity-40 mt-3">
            Closes 11:59pm {DEADLINE_SHORT} UK
          </div>
        </>
      )}
    </div>
  );

  const renderLiveTool = (tool: Tool, i: number) => (
    <motion.div
      key={tool.name}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center ${
        i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div>
        {tool.images ? (
          <Shots images={tool.images} title={tool.name} />
        ) : (
          <ComingSoon name={tool.name} when={tool.comingSoon!} />
        )}
      </div>

      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center">
            {tool.icon}
          </div>
          <div className="inline-flex items-center gap-2 bg-terracotta text-white px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {tool.status}
          </div>
        </div>

        <h3 className="text-3xl md:text-5xl font-display font-extrabold leading-none mb-4">
          {tool.name}
        </h3>
        <p className="text-lg md:text-2xl font-display font-bold text-terracotta leading-snug mb-5">
          {tool.strap}
        </p>
        <div className="space-y-4 text-base md:text-lg leading-relaxed opacity-80">
          {tool.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderSoonTool = (tool: Tool, i: number) => (
    <motion.div
      key={tool.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: i * 0.08, duration: 0.5 }}
      className="bg-white border border-forest-green/10 rounded-[2rem] p-6 md:p-8 flex flex-col"
    >
      <div className="mb-6">
        {tool.images ? (
          <Shots images={tool.images} title={tool.name} compact />
        ) : (
          <ComingSoon name={tool.name} when={tool.comingSoon!} />
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-forest-green/5 text-forest-green flex items-center justify-center">
          {tool.icon}
        </div>
        <div className="inline-flex items-center gap-1.5 bg-forest-green/5 border border-forest-green/10 text-forest-green px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <Clock size={11} className="text-terracotta" />
          {tool.status}
        </div>
      </div>

      <h3 className="text-2xl md:text-3xl font-display font-extrabold leading-tight mb-3">
        {tool.name}
      </h3>
      <p className="text-base md:text-lg font-bold text-terracotta leading-snug mb-3">
        {tool.strap}
      </p>
      <div className="space-y-3 text-sm md:text-base leading-relaxed opacity-80 flex-1">
        {tool.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="mt-6 pt-5 border-t border-forest-green/10 text-xs font-bold uppercase tracking-widest text-terracotta">
        Included in your founding seat
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green overflow-x-hidden selection:bg-terracotta selection:text-white scroll-smooth">
      <Helmet>
        <title>Service Business OS: own the software your business runs on</title>
        <meta
          name="description"
          content={`A growing suite of focused, AI-powered tools for service businesses. Founding lifetime access for a one off £${FOUNDING_PRICE}, or spread it. Only ${SEATS_TOTAL} seats, then £${MONTHLY} a month.`}
        />
        <link rel="canonical" href="https://thevibecodinglab.co/sbos" />
        {/* The checkout lives one client-side navigation away, so warm both
            ThriveCart origins here and pull the embed script into cache at idle
            priority. By the time anyone clicks through, the expensive parts are
            already done. */}
        <link rel="preconnect" href={WIDGET_ORIGIN} />
        <link rel="preconnect" href={CHECKOUT_ORIGIN} />
        <link rel="dns-prefetch" href={WIDGET_ORIGIN} />
        <link rel="dns-prefetch" href={CHECKOUT_ORIGIN} />
        <link rel="prefetch" as="script" href={WIDGET_SCRIPT} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Toni Martin" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thevibecodinglab.co/sbos" />
        <meta property="og:site_name" content="Service Business OS" />
        <meta property="og:title" content="Own the software your service business runs on" />
        <meta
          property="og:description"
          content={`Relavo, Kestry, Zenitro, Draftd and Vysbl. Founding lifetime access for £${FOUNDING_PRICE} once. Only ${SEATS_TOTAL} seats, then £${MONTHLY} a month.`}
        />
        <meta property="og:image" content={`https://thevibecodinglab.co${OG_IMAGE}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Own the software your service business runs on" />
        <meta
          name="twitter:description"
          content={`Relavo, Kestry, Zenitro, Draftd and Vysbl. Founding lifetime access for £${FOUNDING_PRICE} once. Only ${SEATS_TOTAL} seats.`}
        />
        <meta name="twitter:image" content={`https://thevibecodinglab.co${OG_IMAGE}`} />
      </Helmet>

      {/* Sticky bar */}
      <div className="sticky top-0 z-40 bg-forest-green text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3 md:gap-4">
          <Flame className="text-terracotta shrink-0 animate-pulse" size={18} />
          <div className="text-[11px] md:text-sm font-bold truncate flex-1">
            {closed ? (
              <>
                <span className="opacity-70">Founding access closed</span>{' '}
                <span className="text-terracotta">£{MONTHLY}/month</span>
              </>
            ) : (
              <>
                <span className="opacity-70">Founding lifetime</span>{' '}
                <span className="text-terracotta">£{FOUNDING_PRICE} once</span>
                <span className="opacity-50 hidden sm:inline tabular-nums">
                  {' '}
                  · closes in {pad(days)}d {pad(hours)}:{pad(mins)}:{pad(secs)}
                </span>
                <span className="opacity-50 hidden lg:inline"> · {SEATS_TOTAL} seats</span>
              </>
            )}
          </div>
          {closed ? (
            <a
              href={MONTHLY_URL || '#'}
              className="hidden sm:inline-block shrink-0 bg-terracotta hover:bg-burnt-orange text-white text-[11px] md:text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors"
            >
              Join monthly
            </a>
          ) : (
            <Link
              to={JOIN_PATH}
              className="hidden sm:inline-block shrink-0 bg-terracotta hover:bg-burnt-orange text-white text-[11px] md:text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors"
            >
              Lock it in
            </Link>
          )}
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-green text-white">
        <GrainOverlay />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-24 relative">
          <div className="flex items-center justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest pb-12 md:pb-16">
            <span>Service Business OS</span>
            <span className="flex items-center gap-2 opacity-70">
              <span
                className={`w-2 h-2 rounded-full ${closed ? 'bg-white/40' : 'bg-terracotta animate-pulse'}`}
              />
              {closed ? 'Founding access closed' : 'Founding access open'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-[1.05] tracking-tight mb-6">
                Own the software your service business runs on. Instead of{' '}
                <span className="text-terracotta">renting it forever.</span>
              </h1>

              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-9 max-w-2xl">
                A growing suite of focused, AI-powered tools that quietly run the jobs your business
                depends on. Your conversations, your support, your leads, your proposals. Get
                founding lifetime access once, instead of paying every month for the rest of your
                business life.
              </p>

              {/* Secondary, not a second button. The price card carries the one
                  primary action in the hero; this sends the not-yet-convinced
                  down to the tools instead of repeating the same CTA twice. */}
              <a
                href="#suite"
                className="inline-flex items-center gap-2 text-base md:text-lg font-bold border-b-2 border-terracotta/40 hover:border-terracotta pb-1 transition-colors group"
              >
                See what you get
                <ChevronDown
                  size={18}
                  className="text-terracotta group-hover:translate-y-0.5 transition-transform"
                />
              </a>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 text-xs md:text-sm font-bold opacity-80">
                <span className="inline-flex items-center gap-2">
                  <InfinityIcon size={14} className="text-terracotta" /> Pay once, no renewal
                </span>
                <span className="inline-flex items-center gap-2">
                  <Lock size={14} className="text-terracotta" /> Every future tool included
                </span>
                {hasGuarantee && (
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={14} className="text-terracotta" /> {GUARANTEE.days}-day
                    money-back guarantee
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <PriceCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE STATE OF PLAY */}
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            The state of play
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight mb-6">
            Everything your business runs on.
            <span className="block text-terracotta">In one place.</span>
          </h2>
          <p className="text-lg md:text-xl leading-relaxed opacity-75 max-w-3xl mb-10 md:mb-12">
            Most service owners run on a mess of separate subscriptions, or one bloated platform
            they use a fraction of. Service Business OS is the focused, AI-powered alternative. One
            suite, one home, the tools that actually move the dial.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6">
            {[
              {
                tag: 'The usual way',
                title: 'A pile of monthly subscriptions',
                body: 'A chat tool here, a support desk there, a quiz builder, a proposal tool. Each a tidy little monthly bill that quietly adds up to far more than you would care to admit, forever.',
                dark: false,
              },
              {
                tag: 'The Service Business OS way',
                title: 'One suite, owned once',
                body: 'Focused tools that each do one job properly, powered by AI, in one place. Founding members get the whole suite for life, for a single one off price.',
                dark: true,
              },
            ].map((opt, i) => (
              <motion.div
                key={opt.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`rounded-[2rem] p-7 md:p-9 border ${
                  opt.dark
                    ? 'bg-forest-green text-white border-forest-green'
                    : 'bg-white border-forest-green/10'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${
                    opt.dark ? 'bg-terracotta/20 text-terracotta' : 'bg-forest-green/5 text-forest-green/40'
                  }`}
                >
                  {opt.dark ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                </div>
                <div
                  className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 ${
                    opt.dark ? 'text-terracotta' : 'opacity-50'
                  }`}
                >
                  {opt.tag}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold leading-tight mb-4">
                  {opt.title}
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${opt.dark ? 'opacity-85' : 'opacity-75'}`}>
                  {opt.body}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="bg-forest-green text-white rounded-[2rem] p-7 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-10 w-[360px] h-[360px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-2">
                Founding access
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold leading-tight">
                {SEATS_TOTAL} seats. £{FOUNDING_PRICE} once. Then it moves to £{MONTHLY} a month.
              </h3>
            </div>
            <div className="relative shrink-0">
              <CTA label="Lock in my seat" />
            </div>
          </div>
        </div>
      </Section>

      {/* WHAT IT IS */}
      <Section className="bg-forest-green text-white overflow-hidden">
        <GrainOverlay />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            What it is
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight mb-8">
            Focused tools. Each doing one job properly.
            <span className="block text-terracotta">All powered by AI.</span>
          </h2>
          <p className="text-lg md:text-xl leading-relaxed opacity-80">
            Service Business OS is a set of focused, best in class tools that handle the core jobs
            of running a service business. Each one does a single job well, so there is nothing to
            wrestle with and nothing to learn for a fortnight before it earns its keep. You take
            only the tools you want and ignore the ones you do not. Founding members get the whole
            suite for life.
          </p>
        </div>
      </Section>

      {/* THE SUITE */}
      <Section className="bg-warm-cream" id="suite">
        <GrainOverlay />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12 md:mb-16">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              The suite
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
              Every tool included in
              <span className="block text-terracotta">your founding seat.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="text-xs md:text-sm font-black uppercase tracking-widest text-terracotta whitespace-nowrap">
              Live the moment you join
            </div>
            <div className="h-px flex-1 bg-forest-green/15" />
          </div>

          <div className="space-y-16 md:space-y-24 mb-20 md:mb-28">
            {LIVE_TOOLS.map((tool, i) => renderLiveTool(tool, i))}
          </div>

          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="text-xs md:text-sm font-black uppercase tracking-widest text-terracotta whitespace-nowrap">
              Landing next, already yours
            </div>
            <div className="h-px flex-1 bg-forest-green/15" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-12">
            {SOON_TOOLS.map((tool, i) => renderSoonTool(tool, i))}
          </div>

          <div className="flex items-center justify-center gap-3 text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta shrink-0" />
            <p className="text-sm md:text-lg font-bold">
              The suite keeps growing and your founding seat covers everything new.
            </p>
          </div>
        </div>
      </Section>

      {/* OWN VS RENT */}
      <Section className="bg-forest-green text-white overflow-hidden">
        <GrainOverlay />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            The maths that matters
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight mb-10 md:mb-12">
            Own it. <span className="text-terracotta">Do not rent it.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-[1.5rem] p-7 md:p-9">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-4">
                Paying monthly
              </div>
              <div className="text-4xl md:text-5xl font-display font-black tabular-nums leading-none opacity-90">
                £{MONTHLY}
                <span className="text-lg md:text-xl font-bold opacity-50"> / month</span>
              </div>
              <p className="text-sm md:text-base opacity-70 leading-relaxed mt-4">
                That is £{YEAR_ONE.toLocaleString()} a year. Every year. Forever. And the day you
                stop paying, it all disappears.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-terracotta rounded-[1.5rem] p-7 md:p-9">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-4">
                Founding lifetime
              </div>
              <div className="text-4xl md:text-5xl font-display font-black text-terracotta tabular-nums leading-none">
                £{FOUNDING_PRICE}
                <span className="text-lg md:text-xl font-bold opacity-70"> once</span>
              </div>
              <p className="text-sm md:text-base opacity-70 leading-relaxed mt-4">
                Less than half a year of the monthly price and it is yours for life. It pays for
                itself in about five months, then never costs you another penny.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* JOIN */}
      <Section className="bg-sand" id="join">
        <GrainOverlay />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-10 md:mb-12">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              {closed ? 'Founding access has closed' : 'Founding access'}
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
              {closed ? (
                <>
                  Join the full suite
                  <span className="block text-terracotta">at £{MONTHLY} a month.</span>
                </>
              ) : (
                <>
                  Lock in your
                  <span className="block text-terracotta">founding seat.</span>
                </>
              )}
            </h2>
          </div>

          {closed ? (
            <div className="bg-white border border-forest-green/10 rounded-[2rem] p-8 md:p-10 text-center">
              <p className="text-base md:text-lg leading-relaxed opacity-75 mb-7">
                The {SEATS_TOTAL} founding lifetime seats have gone. You can still join the full
                suite on the monthly membership, with every tool included as it launches.
              </p>
              <CTA label="" size="xl" />
            </div>
          ) : (
            <>
              <div className="bg-white border border-forest-green/10 rounded-[2rem] p-7 md:p-9 mb-8">
                <ul className="space-y-3 mb-8">
                  {[
                    `${SEATS_TOTAL} founding seats at £${FOUNDING_PRICE} lifetime. That is the whole cohort.`,
                    `When the ${SEATS_TOTAL} are gone, the only way in is £${MONTHLY} a month.`,
                    'Founding members are the only people who ever own this suite outright.',
                  ].map((line) => (
                    <li key={line} className="flex gap-3 text-base md:text-lg leading-relaxed">
                      <Check size={20} className="text-terracotta shrink-0 mt-1" strokeWidth={3} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  {PLANS.map((plan) => (
                    <div
                      key={plan.value}
                      className={`rounded-2xl px-5 py-5 text-center border ${
                        plan.best
                          ? 'border-terracotta bg-terracotta/5'
                          : 'border-forest-green/10 bg-warm-cream'
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

                <p className="text-xs md:text-sm opacity-60 text-center mt-6">
                  All three options live inside one checkout. Pick whichever suits you at the next
                  step.
                </p>
              </div>

              {/* The guarantee, stated in full at the point of purchase as clause 4
                  of the terms requires. */}
              {hasGuarantee && (
                <div className="bg-forest-green text-white rounded-[2rem] p-7 md:p-9 mb-8 relative overflow-hidden">
                  <div className="absolute -top-20 -right-16 w-[320px] h-[320px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative flex flex-col md:flex-row md:items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-terracotta/20 text-terracotta flex items-center justify-center shrink-0">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-2">
                        Zero risk
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display font-extrabold leading-tight mb-4">
                        {GUARANTEE.days}-day money-back guarantee.
                      </h3>
                      <p className="text-sm md:text-base opacity-80 leading-relaxed mb-5">
                        Get in, set up the tools you want and see whether they earn their keep. If
                        it is not for you, tell us and you get your money back. No hoops.
                      </p>
                      <ul className="space-y-2.5">
                        {GUARANTEE.conditions.map((line) => (
                          <li
                            key={line}
                            className="flex gap-3 text-sm md:text-base leading-relaxed opacity-90"
                          >
                            <Check
                              size={18}
                              className="text-terracotta shrink-0 mt-1"
                              strokeWidth={3}
                            />
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
                </div>
              )}

              <div className="text-center">
                <CTA size="xl" label="Lock in my founding seat" />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 mt-7 text-xs md:text-sm font-bold opacity-70">
                <span className="inline-flex items-center gap-2">
                  <Flame size={14} className="text-terracotta" /> {seatLine}
                </span>
                <span className="hidden sm:inline opacity-40">·</span>
                <span className="inline-flex items-center gap-2 tabular-nums">
                  <Clock size={14} className="text-terracotta" /> Closes {DEADLINE_SHORT}
                </span>
                {hasGuarantee && (
                  <>
                    <span className="hidden sm:inline opacity-40">·</span>
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck size={14} className="text-terracotta" /> {GUARANTEE.days}-day
                      money-back guarantee
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </Section>

      {/* WHO THIS IS FOR */}
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-10 md:mb-14">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              Fit check
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight">
              Who this is for.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white border border-forest-green/10 rounded-[2rem] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                  <Check size={20} strokeWidth={3} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold">
                  Built for you if
                </h3>
              </div>
              <ul className="space-y-3 text-base md:text-lg leading-relaxed opacity-90">
                {[
                  'You run a service business and want it running like a machine',
                  'You already know the right tools move the dial',
                  'You would rather own your tools than rent them forever',
                  'You are tired of paying monthly for a stack of separate subscriptions',
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <Check size={20} className="text-terracotta shrink-0 mt-1" strokeWidth={3} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-forest-green text-white rounded-[2rem] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                  <X size={20} strokeWidth={3} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold">
                  Not for you if
                </h3>
              </div>
              <ul className="space-y-3 text-base md:text-lg leading-relaxed opacity-90">
                {[
                  'You want hand holding through every single click',
                  'You are after the cheapest possible thing, not the thing that runs your business',
                  'You would rather keep renting a bloated platform you half use',
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <X size={20} className="text-terracotta shrink-0 mt-1" strokeWidth={3} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* SUPPORT */}
      <Section className="bg-forest-green text-white overflow-hidden">
        <GrainOverlay />
        <div className="absolute -bottom-32 left-0 w-[440px] h-[440px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            You are never on your own
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight mb-10 md:mb-12">
            Support, done properly.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-[1.5rem] p-7 md:p-9">
              <div className="w-11 h-11 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center mb-5">
                <LifeBuoy size={22} />
              </div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-3">
                In every tool
              </div>
              <h3 className="text-xl md:text-2xl font-display font-extrabold mb-3">
                A response within 24 hours
              </h3>
              <p className="text-sm md:text-base opacity-75 leading-relaxed">
                Every tool has a support desk built in. Submit a request and you get a real reply
                within a day. No shouting into a void, no ticket black holes.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-[1.5rem] p-7 md:p-9">
              <div className="w-11 h-11 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center mb-5">
                <Users size={22} />
              </div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-3">
                Community included
              </div>
              <h3 className="text-xl md:text-2xl font-display font-extrabold mb-3">
                A room of people who get it
              </h3>
              <p className="text-sm md:text-base opacity-75 leading-relaxed">
                Your access comes with a community where members help each other, see what is being
                built next and shape the roadmap. Use it as much or as little as you like.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              Straight answers
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
              The questions you are already asking.
            </h2>
          </div>
          <div className="space-y-2">
            <FAQItem
              question="What does founding lifetime access actually mean?"
              answer={`You pay once and your access to the whole suite does not expire. No monthly fee, no renewal. There are only ${SEATS_TOTAL} founding seats at £${FOUNDING_PRICE} and when they are gone the only way in is £${MONTHLY} a month. Founding members are the only people who will ever own the suite outright.`}
            />
            <FAQItem
              question={`Why only ${SEATS_TOTAL} seats?`}
              answer={`Founding access is a genuine one off. A small first cohort gets in at a price that will never come back, helps shape the roadmap and gets looked after as the suite grows. Once the ${SEATS_TOTAL} are taken, founding access closes and everyone after joins monthly.`}
            />
            <FAQItem
              question="Can I spread the cost?"
              answer={`Yes. Pay £${FOUNDING_PRICE} in full, which is the best value, or spread it across 3 payments of £175 or 10 payments of £55. Either way you get full access to everything straight away.`}
            />
            {hasGuarantee && (
              <FAQItem
                question="What if I get in and it is not for me?"
                answer={`You are covered by a ${GUARANTEE.days}-day money-back guarantee. Get in, set up the tools you want and see whether they earn their keep. If it is not for you, email us within ${GUARANTEE.days} days of purchase and we refund you in full. Your access is revoked once the refund is processed, and it is one refund per customer.`}
              />
            )}
            <FAQItem
              question="What if I only want one or two of the tools?"
              answer="That is fine. You get access to all of them and use whatever serves your business. Nothing is wasted, because you are not paying monthly for the ones you leave alone."
            />
            <FAQItem
              question="When do I get everything?"
              answer="Relavo and Kestry are live the moment you join. Zenitro arrives on 10 August, Draftd on 14 September and Vysbl in October. Your founding access covers every one of them, including the tools still to come."
            />
            <FAQItem
              question="Is this not just another all in one platform?"
              answer="No. All in ones ask you to move your whole business onto one sprawling platform and pay for dozens of features you never touch. Service Business OS is focused tools that each do one job brilliantly, powered by AI, that you take on your terms and own for life as a founding member."
            />
          </div>
        </div>
      </Section>

      {/* FINAL */}
      <Section className="bg-forest-green text-white text-center overflow-hidden">
        <GrainOverlay />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-6">
            Last thing
          </div>

          <h2 className="text-4xl md:text-7xl font-display font-extrabold leading-[0.95] tracking-tight mb-8">
            Own the tools your business
            <span className="block text-terracotta">runs on, once.</span>
          </h2>

          <p className="text-base md:text-xl opacity-80 leading-relaxed max-w-2xl mx-auto mb-6">
            A pile of subscriptions that never stop billing. Or the whole AI-powered suite, owned
            for life, as one of just {SEATS_TOTAL} founding members.
          </p>

          {closed ? (
            <p className="text-base md:text-lg font-bold text-terracotta mb-10">
              Founding access has closed. Join the full suite at £{MONTHLY} a month.
            </p>
          ) : (
            <>
              <p className="text-base md:text-lg font-bold text-terracotta mb-8">
                £{FOUNDING_PRICE} once, or 3 × £175, or 10 × £55. Then it is £{MONTHLY} a month.
              </p>

              {/* Countdown, repeated at the point of decision */}
              <div className="flex justify-center gap-2 md:gap-3 max-w-sm mx-auto mb-9">
                <TimeCell value={days} label="Days" />
                <TimeCell value={hours} label="Hrs" />
                <TimeCell value={mins} label="Min" />
                <TimeCell value={secs} label="Sec" />
              </div>
            </>
          )}

          <CTA size="xl" label="Lock in my founding seat" />

          {hasGuarantee && (
            <div className="flex items-center justify-center gap-2 mt-6 text-xs md:text-sm font-bold opacity-80">
              <ShieldCheck size={14} className="text-terracotta" />
              Backed by a {GUARANTEE.days}-day money-back guarantee
            </div>
          )}

          <div className="mt-12 text-xs md:text-sm opacity-50 font-medium">
            Service Business OS · Founding access · {SEATS_TOTAL} seats
          </div>
        </div>
      </Section>
    </div>
  );
}
