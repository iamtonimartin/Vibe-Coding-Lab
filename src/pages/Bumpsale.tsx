import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
const CHECKOUT_URL = `https://app.bumpsale.co/bumpsales/${BUMPSALE_ID}/checkouts/new/`;
const PRICE_CAP = 147;
const DEADLINE = new Date('2026-06-04T23:59:00+01:00');


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

const SessionItem = ({
  session,
  when,
  title,
  body,
}: {
  session: string;
  when: string;
  title: string;
  body: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-forest-green/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-start justify-between gap-4 group"
      >
        <div className="flex-1 min-w-0">
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-1">
            {session} · {when}
          </div>
          <h4 className="text-base md:text-lg font-display font-extrabold group-hover:text-terracotta transition-colors">
            {title}
          </h4>
        </div>
        <div className="text-terracotta shrink-0 mt-1">
          {open ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm md:text-base leading-relaxed opacity-80">
              {body}
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
  currentPrice = '£1',
  onClick,
}: {
  size?: 'lg' | 'xl';
  className?: string;
  variant?: 'terracotta' | 'white';
  currentPrice?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-block text-center ${colors} ${sizing} rounded-2xl font-extrabold hover:scale-105 transition-all ${className}`}
    >
      Buy now at {currentPrice} →
    </a>
  );
};

type VisualKind = 'chat' | 'quiz' | 'community' | 'code' | 'browser' | 'sessions';

type BundleItem = {
  index: string;
  title: string;
  tag: string;
  worth: string;
  worthValue: number;
  paragraphs: string[];
  cta?: string;
  icon: ReactNode;
  accent: 'terracotta' | 'sand' | 'forest';
  kind: VisualKind;
  images?: string[];
  scrollImage?: string;
  modal?: { title: string; body: ReactNode };
};

const ImageGallery = ({
  images,
  title,
  previewMode = 'static',
}: {
  images: string[];
  title: string;
  previewMode?: 'static' | 'scroll-browser';
}) => {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const openLightbox = (e: React.MouseEvent, src: string) => {
    e.stopPropagation();
    setLightbox(src);
  };

  const Thumb = ({ src, idx }: { src: string; idx: number }) => {
    if (previewMode === 'scroll-browser') {
      return (
        <button
          type="button"
          onClick={(e) => openLightbox(e, src)}
          className="block w-full text-left cursor-zoom-in aspect-[16/10] relative overflow-hidden bg-white group"
          aria-label={`Open ${title} screen ${idx + 1}`}
          style={{ backgroundColor: 'white' }}
        >
          <div className="absolute top-0 left-0 right-0 h-6 md:h-7 flex items-center gap-1.5 px-3 bg-warm-cream border-b border-forest-green/10 z-10">
            <div className="w-2 h-2 rounded-full bg-terracotta/60" />
            <div className="w-2 h-2 rounded-full bg-forest-green/15" />
            <div className="w-2 h-2 rounded-full bg-forest-green/15" />
          </div>
          <div className="absolute inset-0 pt-6 md:pt-7 overflow-hidden bg-white" style={{ backgroundColor: 'white' }}>
            <img
              src={src}
              alt={`${title} screen ${idx + 1}`}
              loading="lazy"
              className="w-full block animate-site-scroll"
              style={{ backgroundColor: 'white' }}
            />
          </div>
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={(e) => openLightbox(e, src)}
        className="block w-full text-left cursor-zoom-in group"
        aria-label={`Open ${title} screen ${idx + 1} larger`}
      >
        <img
          src={src}
          alt={`${title} screen ${idx + 1}`}
          loading="lazy"
          className="w-full h-auto block transition-transform group-hover:scale-[1.01]"
          style={{ backgroundColor: 'white' }}
        />
      </button>
    );
  };

  const lightboxNode = (
    <AnimatePresence>
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[2147483646] flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          style={{ backgroundColor: '#0e1f16' }}
          onClick={(e) => {
            e.stopPropagation();
            setLightbox(null);
          }}
        >
          <motion.div
            key={lightbox}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl shadow-2xl cursor-default overflow-y-auto"
            style={{
              backgroundColor: 'white',
              maxWidth: 'min(900px, calc(100vw - 3rem))',
              maxHeight: 'calc(100vh - 3rem)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox}
              alt={`${title} enlarged`}
              className="block w-full h-auto"
              style={{ backgroundColor: 'white' }}
            />
          </motion.div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
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
      {images.length === 1 ? (
        <div className="rounded-xl overflow-hidden border border-forest-green/10 bg-warm-cream mb-6">
          <Thumb src={images[0]} idx={0} />
        </div>
      ) : (
        <div className="mb-6 -mx-2 px-2">
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 scroll-px-2">
            {images.map((src, i) => (
              <div
                key={src}
                className="shrink-0 snap-center w-[88%] md:w-[80%] rounded-xl overflow-hidden border border-forest-green/10 bg-warm-cream shadow-sm"
                style={{ backgroundColor: 'white' }}
              >
                <Thumb src={src} idx={i} />
              </div>
            ))}
          </div>
          <p className="text-xs opacity-50 text-center mt-1">
            Swipe for more · tap any screen to enlarge · {images.length} screens
          </p>
        </div>
      )}

      {mounted && createPortal(lightboxNode, document.body)}
    </>
  );
};

const BundleVisual = ({ kind, accent, heroImage, scrollImage, title }: { kind: VisualKind; accent: 'terracotta' | 'sand' | 'forest'; heroImage?: string; scrollImage?: string; title?: string }) => {
  if (scrollImage) {
    return (
      <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-forest-green/10 bg-white mb-6 shadow-sm relative">
        {/* Browser chrome */}
        <div className="absolute top-0 left-0 right-0 h-6 md:h-7 flex items-center gap-1.5 px-3 bg-warm-cream border-b border-forest-green/10 z-10">
          <div className="w-2 h-2 rounded-full bg-terracotta/60" />
          <div className="w-2 h-2 rounded-full bg-forest-green/15" />
          <div className="w-2 h-2 rounded-full bg-forest-green/15" />
        </div>
        {/* Scrolling content */}
        <div className="absolute inset-0 pt-6 md:pt-7 overflow-hidden bg-white">
          <img
            src={scrollImage}
            alt={title ? `${title} preview` : ''}
            className="w-full block bg-white animate-site-scroll"
            loading="lazy"
          />
        </div>
      </div>
    );
  }
  if (heroImage) {
    return (
      <div className="rounded-2xl overflow-hidden border border-forest-green/10 bg-white mb-6 shadow-sm">
        <img
          src={heroImage}
          alt={title ? `${title} preview` : ''}
          className="w-full h-auto block bg-white"
          loading="lazy"
        />
      </div>
    );
  }

  const dark = accent === 'forest';
  // On dark (forest) cards: light tokens. On light cards: dark tokens.
  const frame = dark
    ? 'bg-white/5 border border-white/10'
    : 'bg-warm-cream border border-forest-green/10';
  const dim = dark ? 'bg-white/20' : 'bg-forest-green/20';
  const dimSoft = dark ? 'bg-white/10' : 'bg-forest-green/10';
  const accentBg = 'bg-terracotta';
  const accentSoft = dark ? 'bg-terracotta/60' : 'bg-terracotta/40';
  const label = dark ? 'text-white/60' : 'text-forest-green/60';

  const wrap = `aspect-[16/10] rounded-2xl ${frame} p-3 md:p-4 mb-6 overflow-hidden relative`;

  switch (kind) {
    case 'chat': // Relavo: chat dashboard
      return (
        <div className={`${wrap} flex gap-2`}>
          <div className="w-2/5 space-y-1.5">
            {[true, false, false].map((active, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 p-1.5 rounded-lg ${active ? (dark ? 'bg-white/10' : 'bg-terracotta/10') : ''}`}
              >
                <div className={`w-5 h-5 rounded-full ${accentSoft} shrink-0`} />
                <div className="flex-1 space-y-1">
                  <div className={`h-1 w-3/4 rounded ${dim}`} />
                  <div className={`h-1 w-1/2 rounded ${dimSoft}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col justify-end gap-1.5">
            <div className={`h-2 w-2/3 rounded-full ${dimSoft}`} />
            <div className={`h-2 w-1/2 rounded-full ${accentBg} self-end`} />
            <div className={`h-2 w-3/4 rounded-full ${dimSoft}`} />
            <div className={`h-2 w-2/5 rounded-full ${accentBg} self-end`} />
          </div>
        </div>
      );

    case 'quiz': // Zenitro: quiz
      return (
        <div className={`${wrap} flex flex-col`}>
          <div className="flex gap-1.5 mb-3">
            {[true, true, false, false, false].map((filled, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${filled ? accentBg : dimSoft}`}
              />
            ))}
          </div>
          <div className={`h-2 w-3/4 rounded-full ${dim} mb-3`} />
          <div className="space-y-1.5 flex-1">
            {[false, true, false].map((selected, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 p-1.5 rounded-lg border ${selected ? `border-transparent ${accentBg}` : dark ? 'border-white/15 bg-white/5' : 'border-forest-green/15 bg-white/60'}`}
              >
                <div className={`w-3 h-3 rounded-full ${selected ? 'bg-white' : dimSoft}`} />
                <div className={`h-1.5 flex-1 rounded ${selected ? 'bg-white/80' : dim}`} />
              </div>
            ))}
          </div>
        </div>
      );

    case 'community': // VCL Premium: community feed
      return (
        <div className={`${wrap} grid grid-cols-2 gap-2`}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`${dark ? 'bg-white/8' : 'bg-white/70'} rounded-xl p-2 border ${dark ? 'border-white/10' : 'border-forest-green/5'}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={`w-4 h-4 rounded-full ${i % 2 === 0 ? accentBg : accentSoft}`} />
                <div className={`h-1 flex-1 rounded ${dim}`} />
              </div>
              <div className="space-y-0.5">
                <div className={`h-1 w-full rounded ${dimSoft}`} />
                <div className={`h-1 w-3/4 rounded ${dimSoft}`} />
              </div>
            </div>
          ))}
        </div>
      );

    case 'code': // Zero to Deployed: code editor
      return (
        <div className={`${wrap} flex flex-col`}>
          <div className="flex gap-1 mb-2">
            <div className={`px-2 py-0.5 rounded-t text-[8px] font-mono ${dark ? 'bg-white/10 text-white/70' : 'bg-forest-green text-warm-cream'}`}>
              app.tsx
            </div>
            <div className={`px-2 py-0.5 rounded-t text-[8px] font-mono ${dimSoft} ${label}`}>
              api.ts
            </div>
          </div>
          <div className="flex-1 space-y-1 font-mono">
            {[
              { indent: 0, w: '40%', color: 'accent' },
              { indent: 1, w: '70%', color: 'dim' },
              { indent: 2, w: '55%', color: 'dimSoft' },
              { indent: 2, w: '65%', color: 'accent' },
              { indent: 1, w: '35%', color: 'dim' },
              { indent: 0, w: '50%', color: 'accent' },
            ].map((line, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`text-[7px] ${label} w-2`}>{i + 1}</div>
                <div style={{ marginLeft: line.indent * 8 }} className="flex-1">
                  <div
                    className={`h-1.5 rounded ${line.color === 'accent' ? accentBg : line.color === 'dim' ? dim : dimSoft}`}
                    style={{ width: line.w }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'browser': // Build Your Website: browser preview
      return (
        <div className={`${wrap} flex flex-col`}>
          <div className={`flex items-center gap-1.5 pb-2 border-b ${dark ? 'border-white/10' : 'border-forest-green/10'}`}>
            <div className={`w-2 h-2 rounded-full ${accentSoft}`} />
            <div className={`w-2 h-2 rounded-full ${dimSoft}`} />
            <div className={`w-2 h-2 rounded-full ${dimSoft}`} />
            <div className={`ml-1 h-2 flex-1 rounded-full ${dimSoft}`} />
          </div>
          <div className="flex-1 pt-2 flex flex-col gap-1.5">
            <div className={`h-3 w-1/2 rounded ${dim}`} />
            <div className={`h-1.5 w-3/4 rounded ${dimSoft}`} />
            <div className="flex gap-1 mt-1">
              <div className={`flex-1 h-6 rounded ${accentBg}`} />
              <div className={`flex-1 h-6 rounded ${dimSoft}`} />
              <div className={`flex-1 h-6 rounded ${dimSoft}`} />
            </div>
          </div>
        </div>
      );

    case 'sessions': // Claude OS: 4 session cards in 2x2 grid
      return (
        <div className={`${wrap} grid grid-cols-2 gap-2`}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`rounded-xl p-2 flex flex-col ${dark ? 'bg-white/8 border border-white/10' : 'bg-white/70 border border-forest-green/5'}`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-display font-black ${accentBg} text-white`}>
                  {n}
                </div>
                <div className={`h-1 flex-1 rounded ${dim}`} />
              </div>
              <div className="space-y-0.5">
                <div className={`h-1 w-full rounded ${dimSoft}`} />
                <div className={`h-1 w-2/3 rounded ${dimSoft}`} />
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

const READY_BUNDLE: BundleItem[] = [
  {
    index: '01',
    title: 'Vibe Coding Lab Premium',
    tag: 'Lifetime access',
    worth: '£180/year',
    worthValue: 180,
    icon: <Lock />,
    accent: 'forest',
    kind: 'community',
    images: ['/vcl-skool.jpg'],
    paragraphs: [
      "You'll never build alone.",
      "VCL is the community for founders building with AI. Inside Premium, you get the Vibe Lab (hands-on training for the tools Toni actually uses, including Antigravity and Claude Code), Vibe Tribe (weekly co-working where you build alongside other founders) and Stuck? Let's Fix It (weekly drop-in support for when something breaks at 11pm and you have no idea why).",
      "You also get access to the VCL community and a library of vibe coding resources that grows every week.",
      "The community is the difference between \"I tried for two hours and gave up\" and \"someone showed me the fix in three minutes.\"",
    ],
    cta: 'See inside VCL',
    modal: {
      title: 'Vibe Coding Lab Premium',
      body: (
        <>
          <ImageGallery images={['/vcl-skool.jpg']} title="VCL Premium" />
          <p>
            The community for founders building with AI. Vibe Lab training, weekly Vibe Tribe
            co-working, Stuck? Let's Fix It weekly support. All yours, lifetime.
          </p>
        </>
      ),
    },
  },
  {
    index: '02',
    title: 'Claude OS',
    tag: '4 live build-alongs · Lifetime access',
    worth: '£497',
    worthValue: 497,
    icon: <Sparkles />,
    accent: 'terracotta',
    kind: 'sessions',
    images: ['/claude-os.jpg'],
    paragraphs: [
      "Run your business on Claude.",
      "Most people use Claude like a chatbot. They open the app, ask a question, close it. They're using maybe 5% of what's actually possible.",
      "Claude OS is the programme that teaches you to use Claude as the operating system your business runs on. Personalisation, Projects, Skills, Artifacts, connectors, the lot. Not as a feature list. As a system that compounds.",
      "Each session is a live build-along, up to 2 hours, with an optional 1 hour of implementation co-work after. You'll never sit through padding.",
      "Plus every template you need to implement it. The Prompt Architect tool, ready-to-use Project templates, Skills you can plug in, connected workflow recipes. Everything pre-built so you're never staring at a blank canvas in a session.",
    ],
    cta: 'See the 4 sessions',
    modal: {
      title: 'Claude OS · The 4 sessions',
      body: (
        <>
          <div className="-mt-2">
            <SessionItem
              session="Session 1"
              when="Tue 9 June · 11:30am-2:30pm UK"
              title="Make Claude yours"
              body="Build a Claude that knows who you are, talks to you the way you want and remembers what matters. Personal context, preferences, custom instructions, memory, importing context from other LLMs. We'll apply the ICI Framework (Identity, Capability, Interaction) as we go, the proprietary prompt engineering methodology behind every product Toni builds."
            />
            <SessionItem
              session="Session 2"
              when="Tue 16 June · 11:30am-2:30pm UK"
              title="Run your business inside Projects"
              body="Set up the 2-3 Claude Projects that mirror the most important parts of your business. System prompts that actually work, knowledge bases Claude can use and a starter pack of Project templates designed for non-technical founders."
            />
            <SessionItem
              session="Session 3"
              when="Tue 23 June · 11:30am-2:30pm UK"
              title="Make Claude produce your work"
              body="Use Skills to produce real, polished business output that pulls from your Projects. Documents, slide decks, spreadsheets. Branded and accurate, because by now Claude knows your business."
            />
            <SessionItem
              session="Session 4"
              when="Tue 30 June · 11:30am-2:30pm UK"
              title="Connect Claude to your stack"
              body="Connect Claude to the tools you use every day. Google Drive, Gmail, Calendar, the Cowork tools, Artifacts, the Claude + Canva workflow. Build one connected workflow that uses everything from the previous sessions."
            />
          </div>
          <p className="text-sm opacity-70 mt-6 pt-5 border-t border-forest-green/10">
            The 4 build-alongs above are the foundation. As Claude evolves and new features ship,
            new sessions get added to Claude OS. Lifetime access means you get them all.
          </p>
        </>
      ),
    },
  },
  {
    index: '03',
    title: 'The Site Sprint',
    tag: 'Live workshop · Wed 10 June',
    worth: '£147',
    worthValue: 147,
    icon: <Globe />,
    accent: 'sand',
    kind: 'browser',
    images: ['/site-sprint.jpg'],
    paragraphs: [
      "Stop paying for things you could build in an afternoon.",
      "One live session. Build and deploy a real website with AI, from blank page to live URL. The skill that turns \"I need to hire a developer\" into \"I'll just make it myself this weekend.\"",
      "Live with Toni Wednesday 10 June, 1pm UK. Recording included in your VCL access.",
    ],
    cta: 'See sites built with vibe coding',
    modal: {
      title: 'Sites built with vibe coding',
      body: (
        <>
          <ImageGallery
            images={['/thevibed-scroll.jpg', '/tonimartin-scroll.jpg', '/thebuild-scroll.jpg', '/fortivise-scroll.jpg']}
            previewMode="scroll-browser"
            title="Site Sprint"
          />
          <p>
            Four real sites, all built with vibe coding. The Vibed (publication for non-technical
            founders building with AI), Toni Martin (founder portfolio), The Build (live event),
            Fortivise (consultancy). Each one designed, built and shipped without a developer.
          </p>
          <p className="mt-4 text-sm opacity-70">
            Tap any preview to scroll the full page.
          </p>
        </>
      ),
    },
  },
  {
    index: '04',
    title: 'The Ship Sprint',
    tag: 'Live workshop series · 7 + 9 July',
    worth: '£297',
    worthValue: 297,
    icon: <Code />,
    accent: 'terracotta',
    kind: 'code',
    images: ['/ship-sprint.jpg'],
    paragraphs: [
      "Ship your first web app. For real.",
      "Two live workshops, hosted inside VCL. You'll plan a build with AI, build it out with Claude Code, connect a database with Supabase and deploy to Vercel. By the end, you have a real, working, deployed web app and the exact repeatable process Toni uses to build the products clients pay premium rates to commission.",
      "Live with Toni Tuesday 7 July and Thursday 9 July, 10am UK. Recordings included in your VCL access.",
    ],
  },
];

const SHIPPING_BUNDLE: BundleItem[] = [
  {
    index: '05',
    title: 'Relavo',
    tag: 'Lifetime access',
    worth: '£297',
    worthValue: 297,
    icon: <Layers />,
    accent: 'terracotta',
    kind: 'chat',
    images: ['/relavo-3.png', '/relavo-2.png', '/relavo-1.png'],
    paragraphs: [
      "The custom GPT replacement.",
      "Build AI assistants trained on your content, deployed on your website or inside your course portal, fully branded as you. Your audience never sees Relavo. They see your assistant. The same capability as a custom GPT, without the OpenAI login wall, the ChatGPT branding or losing your audience the moment they want to use it.",
      "Lifetime access means new features keep shipping. You keep getting them. Forever.",
    ],
    cta: 'See Relavo in action',
    modal: {
      title: 'Relavo',
      body: (
        <>
          <ImageGallery
            images={['/relavo-3.png', '/relavo-2.png', '/relavo-1.png']}
            title="Relavo"
          />
          <p>
            Build AI assistants trained on your content, deployed on your website or inside your
            course portal, fully branded as you. Your audience sees your assistant, not Relavo.
            Custom GPT capability without the OpenAI login wall or the ChatGPT branding.
          </p>
        </>
      ),
    },
  },
  {
    index: '06',
    title: 'Zenitro',
    tag: 'Lifetime access at launch',
    worth: '£297',
    worthValue: 297,
    icon: <Sparkles />,
    accent: 'forest',
    kind: 'quiz',
    images: ['/zenitro-3.png', '/zenitro-2.png', '/zenitro-1.png', '/zenitro-4.png'],
    paragraphs: [
      "Turn your expertise into a diagnostic product.",
      "If you're a coach, consultant or expert, you've answered the same questions a hundred times. Zenitro lets you turn that expertise into an interactive AI-powered quiz, assessment or diagnostic tool, branded as yours, scoring and segmenting your audience while you sleep.",
      "Launching soon. The moment it ships, you're in for life at the bundle tier.",
    ],
    cta: 'See Zenitro in action',
    modal: {
      title: 'Zenitro',
      body: (
        <>
          <ImageGallery
            images={['/zenitro-3.png', '/zenitro-2.png', '/zenitro-1.png', '/zenitro-4.png']}
            title="Zenitro"
          />
          <p>
            Turn your expertise into an AI-powered diagnostic. Build quizzes and assessments that
            score people, qualify leads or deliver personalised results, all driven by AI.
          </p>
        </>
      ),
    },
  },
];

const READY_VALUE = READY_BUNDLE.reduce((s, i) => s + i.worthValue, 0);
const SHIPPING_VALUE = SHIPPING_BUNDLE.reduce((s, i) => s + i.worthValue, 0);
const BONUS_VALUE = 247;
const TOTAL_VALUE = READY_VALUE + SHIPPING_VALUE + BONUS_VALUE;

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

const TOTAL_SLOTS = PRICE_CAP;

export default function Bumpsale() {
  const [modal, setModal] = useState<{ title: string; body: ReactNode } | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string>('£1');
  const { days, hours, mins, secs, expired } = useCountdown();

  useEffect(() => {
    let cancelled = false;
    const fetchState = () => {
      fetch(`https://app.bumpsale.co/buttons/${BUMPSALE_ID}`)
        .then((r) => r.json())
        .then((d) => {
          if (cancelled) return;
          const bs = d?.bumpsale;
          if (bs?.orders_count != null) setOrders(bs.orders_count);
          if (bs?.current_price_formatted) setCurrentPrice(bs.current_price_formatted);
        })
        .catch(() => {});
    };
    fetchState();
    const id = setInterval(fetchState, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const openCheckout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCheckoutOpen(true);
  };

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data === 'close' || e.data?.type === 'close') setCheckoutOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCheckoutOpen(false);
    };
    window.addEventListener('message', onMessage);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = checkoutOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [checkoutOpen]);

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

  const renderBundleCard = (item: BundleItem, i: number) => {
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
        <BundleVisual kind={item.kind} accent={item.accent} heroImage={item.scrollImage ? undefined : item.images?.[0]} scrollImage={item.scrollImage} title={item.title} />

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
  };

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green overflow-x-hidden selection:bg-terracotta selection:text-white scroll-smooth">
      <Helmet>
        <title>The ultimate AI build bundle for non-technical founders | Vibe Coding Lab</title>
        <meta
          name="description"
          content="The training, the community, the support and two AI tools you'll keep forever. Bumpsale starts at £1, caps at £147. Ends 11:59pm Thursday 4 June."
        />
        <link rel="canonical" href="https://thevibecodinglab.co/bumpsale" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Toni Martin" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thevibecodinglab.co/bumpsale" />
        <meta property="og:site_name" content="Vibe Coding Lab" />
        <meta property="og:title" content="The ultimate AI build bundle for non-technical founders" />
        <meta
          property="og:description"
          content="Worth £1,962. Yours from £1. The price goes up £1 with every sale, capped at £147. Ends 4 June."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The ultimate AI build bundle for non-technical founders" />
        <meta
          name="twitter:description"
          content="Worth £1,962. Yours from £1. The price goes up £1 with every sale, capped at £147. Ends 4 June."
        />
      </Helmet>

      {/* Ticker tape: new bonus announcement */}
      <div className="bg-terracotta text-white overflow-hidden border-b border-burnt-orange/40">
        <div className="flex whitespace-nowrap animate-marquee py-2 md:py-2.5 text-xs md:text-sm font-bold uppercase tracking-wider">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {[
                '🎁 Just added',
                'The Audit & Consulting Playbook',
                'How I charge £3,500/day',
                'Worth £247',
                'Yours free with every Bumpsale',
              ].map((segment, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-5 md:px-7">{segment}</span>
                  <span className="opacity-50">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky urgency bar */}
      <div className="sticky top-0 z-40 bg-forest-green text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-4">
          <Flame className="text-terracotta shrink-0 animate-pulse" size={18} />
          <div className="text-[11px] md:text-sm font-bold truncate">
            <span className="opacity-70">Current price</span>{' '}
            <span className="text-terracotta">{currentPrice}</span>
            <span className="opacity-50 hidden md:inline"> · climbs to £{PRICE_CAP}</span>
          </div>
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
              <Flame size={12} className="text-terracotta" /> A Vibe Coding Lab Bumpsale
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto">
              The ultimate bundle for non-technical founders who want to
              <span className="text-terracotta"> actually build with AI.</span>
            </h1>

            <p className="text-lg md:text-2xl font-medium opacity-80 leading-relaxed max-w-3xl mx-auto mb-10">
              Stop watching everyone else ship products. The training, the community, the support
              and two AI tools you'll keep forever. Starting from £1.
            </p>

            {/* Value stack */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-3">
              <div className="flex items-baseline gap-3">
                <span className="text-base md:text-xl font-bold opacity-50 line-through">
                  Worth £{TOTAL_VALUE.toLocaleString()}.
                </span>
              </div>
              <div className="text-2xl md:text-4xl font-display font-black text-terracotta">
                Yours from £1.
              </div>
            </div>
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta/80 mb-10">
              £197 from 5 June · £1 today
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
              <div className="text-7xl md:text-9xl font-display font-black text-terracotta tabular-nums leading-none">
                {currentPrice}
              </div>
              <div className="text-xs md:text-sm font-medium opacity-60 mt-3">
                Price climbs by £1 with every sale
              </div>
            </motion.div>

            <div className="flex justify-center mb-10">
              <BuyButton size="xl" onClick={openCheckout} currentPrice={currentPrice} />
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm opacity-70 mb-4">
              <Clock size={14} />
              <span className="font-bold uppercase tracking-widest">
                {expired ? 'Campaign ended' : 'Ends in · 11:59pm Thu 4 June'}
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
            Every time someone buys this bundle,{' '}
            <span className="text-terracotta">the price goes up by £1.</span>
          </h2>
          <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-3xl mx-auto mb-12">
            The first buyer paid £1. The second paid £2. The price climbs with every sale until it
            caps at £147, or until 11:59pm on Thursday 4 June, whichever comes first.
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

          <div className="max-w-2xl mx-auto mb-4 grid grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white border border-forest-green/10 rounded-2xl px-5 py-4 md:px-6 md:py-5">
              <div className="text-3xl md:text-5xl font-display font-black text-terracotta tabular-nums leading-none">
                {orders ?? '…'}
              </div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mt-2">
                {orders === 1 ? 'Bundle sold' : 'Bundles sold'}
              </div>
            </div>
            <div className="bg-forest-green text-white rounded-2xl px-5 py-4 md:px-6 md:py-5">
              <div className="text-3xl md:text-5xl font-display font-black tabular-nums leading-none">
                {orders === null ? '…' : Math.max(0, TOTAL_SLOTS - orders)}
              </div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mt-2">
                Spots remaining
              </div>
            </div>
          </div>

          <div
            data-bumpsale-progress={BUMPSALE_ID}
            className="max-w-2xl mx-auto mb-10"
          />

          <BuyButton onClick={openCheckout} currentPrice={currentPrice} />
        </div>
      </Section>

      {/* WHAT YOU'RE GETTING */}
      <Section className="bg-sand overflow-hidden">
        <GrainOverlay />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-10 md:mb-14">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              What you're getting
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
              Everything you need to go from
              <span className="block text-terracotta">watching to building.</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto text-center text-base md:text-lg leading-relaxed opacity-80 space-y-4 mb-16 md:mb-20">
            <p>
              Most non-technical founders get stuck in the same place. They know AI is changing
              everything. They've watched other people ship products. But every time they try to
              start, they hit a wall. They don't know which tools to use. They don't know how to
              talk to AI to get what they want. And they have no one to ask when they're stuck at
              11pm.
            </p>
            <p className="font-bold text-forest-green">
              This bundle removes every one of those walls.
            </p>
          </div>

          {/* Tier 1: The Core */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6 md:mb-8 pb-4 border-b border-forest-green/15">
            <div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-2">
                Tier 1 · The skill, the system, the support
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold leading-tight">
                Build with AI properly. From your very first prompt.
              </h3>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
                Stated value
              </div>
              <div className="text-2xl md:text-3xl font-display font-black text-terracotta">
                £{READY_VALUE.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8 md:mb-10">
            {READY_BUNDLE.map((item, i) => renderBundleCard(item, i))}
          </div>

          {/* Just-added bonus callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="bg-forest-green text-white rounded-[2rem] p-7 md:p-10 mb-8 md:mb-10 relative overflow-hidden max-w-5xl mx-auto"
          >
            <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-20 w-[260px] h-[260px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-terracotta/20 border border-terracotta/40 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-5">
                <Flame size={12} className="text-terracotta" /> Just added · 31 May
              </div>
              <h3 className="text-3xl md:text-5xl font-display font-extrabold leading-[1.05] mb-4">
                I just earned £3,500 for a day's work.{' '}
                <span className="text-terracotta italic">Here's how.</span>
              </h3>
              <p className="text-base md:text-xl font-medium opacity-90 leading-relaxed mb-6 max-w-3xl">
                A new bonus session walking through the exact audit and consulting playbook I use
                with clients.
              </p>
              <div className="space-y-4 mb-6 text-sm md:text-base opacity-90 leading-relaxed max-w-3xl">
                <p>
                  This morning I'm sending out a six-figure build proposal off the back of an
                  onsite AI and Systems audit I ran yesterday in Middlesbrough. £3,500 for the
                  day, with a much bigger engagement to follow.
                </p>
                <p>
                  I realised I haven't packaged the audit and consulting side of what I do
                  anywhere. The way I land these engagements. The framework I run during the
                  audit. How AI Studio, Antigravity and Claude Code give me the foundation to put
                  proposals like this together.
                </p>
                <p className="font-bold text-white">
                  So I'm adding it to the Bumpsale. A live session covering:
                </p>
              </div>
              <ul className="space-y-3 mb-6 text-sm md:text-base max-w-3xl">
                {[
                  { icon: '🔍', text: 'How I land £3,000+ day rates for audits' },
                  { icon: '📋', text: 'The framework I use during the audit itself' },
                  { icon: '🤖', text: 'How Claude, AI Studio and Antigravity produce findings clients actually act on' },
                  { icon: '💼', text: 'How to structure proposals that close six-figure engagements' },
                ].map((line, idx) => (
                  <li key={idx} className="flex items-start gap-3 leading-relaxed opacity-90">
                    <span className="text-lg md:text-xl shrink-0 mt-0.5">{line.icon}</span>
                    <span>{line.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm md:text-base opacity-85 leading-relaxed mb-6 max-w-3xl">
                If you bought the Bumpsale to build for yourself, the rest of the bundle is what
                you need. If you also want to monetise these skills with clients at premium rates,
                this is the bonus that pays for the entire bundle a hundred times over.
              </p>
              <div className="inline-flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-5">
                <Flame size={12} /> Worth £{BONUS_VALUE} · Free with any Bumpsale purchase
              </div>
              <p className="text-xs md:text-sm opacity-60 italic max-w-3xl">
                Already bought? This is yours automatically. Check your email for the session date
                and details.
              </p>
            </div>
          </motion.div>

          {/* Flexible attendance note */}
          <div className="bg-white border border-forest-green/10 rounded-2xl p-5 md:p-7 mb-16 md:mb-20 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                <Check size={18} strokeWidth={3} />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-display font-extrabold mb-2">
                  Flexible attendance
                </h4>
                <p className="text-sm md:text-base leading-relaxed opacity-80">
                  Claude OS, The Site Sprint and The Ship Sprint are all included in the bundle.
                  Each one stands on its own. Come to everything, come to some, come to one. You
                  decide what's useful for you. Every session is recorded and lives inside VCL, so
                  missing a live one isn't the end of the world.
                </p>
              </div>
            </div>
          </div>

          {/* Tier 2: The Bonuses */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6 md:mb-8 pb-4 border-b border-forest-green/15">
            <div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-2">
                Tier 2 · Lifetime SaaS upside
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold leading-tight">
                Two AI products. Yours forever. Growing with you.
              </h3>
              <p className="text-sm md:text-base opacity-70 mt-2 max-w-2xl">
                These weren't in the original plan. We added them because if you're going to learn
                to build with AI, you may as well have tools to build with too. Both are Toni's
                own products. Both are yours for life.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
                Stated value
              </div>
              <div className="text-2xl md:text-3xl font-display font-black text-terracotta">
                £{SHIPPING_VALUE.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {SHIPPING_BUNDLE.map((item, i) => renderBundleCard(item, i))}
          </div>
        </div>
      </Section>

      {/* VALUE STACK REVEAL */}
      <Section className="bg-forest-green text-white overflow-hidden">
        <GrainOverlay />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-10 md:mb-14">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              The honest maths
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight">
              Even if the bonuses went nowhere.
              <span className="block text-terracotta">You'd still be ahead.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-7">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mb-3">
                Locked in today
              </div>
              <div className="text-4xl md:text-5xl font-display font-black text-terracotta tabular-nums">
                £{READY_VALUE.toLocaleString()}
              </div>
              <div className="text-xs md:text-sm opacity-70 mt-2">
                VCL Premium, Claude OS, The Site Sprint, The Ship Sprint. Live programme starts
                Tuesday 9 June.
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-7">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mb-3">
                Just added bonus
              </div>
              <div className="text-4xl md:text-5xl font-display font-black text-terracotta tabular-nums">
                £{BONUS_VALUE.toLocaleString()}
              </div>
              <div className="text-xs md:text-sm opacity-70 mt-2">
                The Audit & Consulting Playbook. Live session for everyone who buys the Bumpsale.
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-7">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mb-3">
                Lifetime SaaS upside
              </div>
              <div className="text-4xl md:text-5xl font-display font-black tabular-nums opacity-80">
                £{SHIPPING_VALUE.toLocaleString()}
              </div>
              <div className="text-xs md:text-sm opacity-70 mt-2">
                Relavo lifetime, Zenitro lifetime at launch. Growing forever.
              </div>
            </div>
            <div className="bg-terracotta rounded-2xl p-6 md:p-7">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-90 mb-3">
                Top price you'd pay
              </div>
              <div className="text-4xl md:text-5xl font-display font-black tabular-nums">
                £{PRICE_CAP}
              </div>
              <div className="text-xs md:text-sm opacity-90 mt-2">
                Even if you're the last buyer through the door.
              </div>
            </div>
          </div>

          <p className="text-base md:text-xl font-medium opacity-90 leading-relaxed max-w-3xl mx-auto text-center">
            The core stack plus the new bonus is worth{' '}
            <span className="text-terracotta font-bold">
              {Math.round((READY_VALUE + BONUS_VALUE) / PRICE_CAP)}× the top price
            </span>
            . The SaaS bonuses are pure upside.
          </p>
        </div>
      </Section>

      {/* WHO THIS IS FOR / ISN'T FOR */}
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-10 md:mb-14">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              Who this is for
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight">
              Honest about fit.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white border border-forest-green/10 rounded-[2rem] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                  <Check size={20} strokeWidth={3} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold">
                  This is for you if
                </h3>
              </div>
              <ul className="space-y-3 text-base md:text-lg leading-relaxed opacity-90">
                {[
                  "You're a non-technical founder who wants to build with AI without learning to code the traditional way",
                  "You've watched the vibe coding movement happen and you want a way in",
                  'You want to actually use Claude properly, not just chat to it',
                  'You want lifetime access to two AI products you can use across your own work and your clients',
                  'You want to lock in lifetime VCL Premium access at a one-off price',
                ].map((line, i) => (
                  <li key={i} className="flex gap-3">
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
                  This is not for you if
                </h3>
              </div>
              <ul className="space-y-3 text-base md:text-lg leading-relaxed opacity-90">
                {[
                  "You're looking for done-for-you services",
                  "You don't want to actually build anything",
                  "You're a VCL VIP lifetime deal holder, you already have access to Relavo and Zenitro through your LTD",
                ].map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <X size={20} className="text-terracotta shrink-0 mt-1" strokeWidth={3} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
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
              { label: `Buyer #${PRICE_CAP} will pay`, price: `£${PRICE_CAP}` },
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

          <p className="text-base md:text-lg opacity-90 mb-4 leading-relaxed">
            And that's where it stops. The campaign ends when {PRICE_CAP} bundles have sold or at
            11:59pm on Thursday 4 June 2026, whichever comes first.
          </p>
          <p className="text-base md:text-lg opacity-90 mb-2 leading-relaxed">
            After this Bumpsale closes, the exact same bundle goes on sale at £197 until the live
            programme starts on Tuesday 9 June. After that, the offer comes off entirely.
          </p>
          <p className="text-base md:text-lg font-bold mb-10">
            Whatever you pay in the Bumpsale, you get exactly the same bundle.
          </p>

          <BuyButton size="xl" variant="white" onClick={openCheckout} currentPrice={currentPrice} />
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
                { label: 'VCL Premium access', detail: 'emailed within 48 hours of purchase.' },
                { label: 'Claude OS', detail: 'first live session Tuesday 9 June, 11:30am UK. Full schedule sent on access.' },
                { label: 'The Site Sprint', detail: 'live Wednesday 10 June, 1pm UK.' },
                { label: 'The Ship Sprint', detail: 'live Tuesday 7 July and Thursday 9 July, 10am UK.' },
                { label: 'Relavo access', detail: 'emailed within 48 hours of purchase.' },
                { label: 'Zenitro access', detail: 'emailed when the product launches.' },
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
            <p className="text-sm md:text-base opacity-70 mt-6 pt-6 border-t border-forest-green/10">
              All sessions recorded and stored inside VCL.
            </p>
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
              question="Can I miss the live sessions and still get value?"
              answer="Yes. Every session is recorded and available inside VCL. Some sessions may suit you more than others, come to the ones you want."
            />
            <FAQItem
              question="Can I get a refund?"
              answer="No. The Bumpsale model relies on every sale counting toward the price for the next buyer. By buying, you're locking in your spot in the sequence."
            />
            <FAQItem
              question="I'm already in VCL. Should I still buy this?"
              answer="If you're a VCL VIP lifetime member, you already have access to Relavo and Zenitro, so this isn't for you. If you're on a paid monthly plan or a free Standard member, this is a way to lock in lifetime Premium access, Claude OS and both SaaS products at one shot."
            />
            <FAQItem
              question="When does Claude OS start?"
              answer="Tuesday 9 June, 11:30am-2:30pm UK. Four live sessions across the following four weeks (16, 23 and 30 June). Full schedule visible inside VCL within 48 hours of your purchase."
            />
            <FAQItem
              question="I've never built anything before. Will I be lost?"
              answer="No. The whole bundle is designed for non-technical founders. Claude OS starts at the foundations. The Site Sprint and The Ship Sprint are live, so you can ask questions as you go."
            />
            <FAQItem
              question="What happens after the Bumpsale closes?"
              answer={`The exact same bundle stays available at £197 until Tuesday 9 June when the live programme kicks off. After that, the bundle comes off sale entirely. The Bumpsale is the only time you can get it for less than £${PRICE_CAP}.`}
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

          <div className="text-2xl md:text-4xl font-display font-black mb-4">
            Live price: <span className="text-terracotta">{currentPrice}</span>
          </div>
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta/90 mb-10">
            £197 from 5 June · After 9 June, this bundle is gone
          </div>

          <BuyButton size="xl" onClick={openCheckout} currentPrice={currentPrice} />

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
              className="relative bg-warm-cream text-forest-green rounded-[2rem] p-8 md:p-12 max-w-2xl w-full max-h-[88vh] overflow-y-auto cursor-default"
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

      {/* Checkout overlay */}
      <AnimatePresence>
        {checkoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[2147483647] bg-forest-green/90 backdrop-blur-sm"
          >
            <button
              onClick={() => setCheckoutOpen(false)}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white text-forest-green hover:bg-warm-cream flex items-center justify-center shadow-2xl transition-all"
              aria-label="Close checkout"
            >
              <X size={20} strokeWidth={3} />
            </button>
            <iframe
              src={CHECKOUT_URL}
              title="Bumpsale checkout"
              className="w-full h-full border-0 bg-white"
              allow="payment"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
