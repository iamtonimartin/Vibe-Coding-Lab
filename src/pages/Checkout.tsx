import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Flame, Lock, ShieldCheck } from 'lucide-react';

const TC_SCRIPT_ID = 'tc-tonimartin-170-0QYQ8H';
const TC_SCRIPT_SRC = '//tinder.thrivecart.com/embed/v2/thrivecart.js';

const INCLUDED = [
  'Vibe Coding Lab Premium, lifetime access',
  'Claude OS, four live build-alongs',
  'The Site Sprint, live',
  'The Ship Sprint, two live workshops',
  'The Art of the Audit Masterclass',
  'Relavo, lifetime access',
  'Zenitro, lifetime access at launch',
];

export default function Checkout() {
  useEffect(() => {
    // ThriveCart's embed script scans the DOM for .tc-v2-embeddable-target
    // targets and mounts the checkout. The target div is already rendered, so
    // we load the script after mount and clean it up on unmount.
    const existing = document.getElementById(TC_SCRIPT_ID);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = TC_SCRIPT_SRC;
    script.async = true;
    script.id = TC_SCRIPT_ID;
    document.body.appendChild(script);

    return () => {
      document.getElementById(TC_SCRIPT_ID)?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green selection:bg-terracotta selection:text-white">
      <Helmet>
        <title>Checkout | Vibe Coding Lab</title>
        <meta name="description" content="Lifetime access to the Vibe Coding Lab bundle. One payment of £197, or split it." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-green text-white">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8 md:pt-10 pb-16 md:pb-20 relative">
          <Link
            to="/bundle"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity mb-10"
          >
            <ArrowLeft size={16} /> Back to the offer
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-terracotta/20 border border-terracotta/40 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8">
              <Flame size={12} className="text-terracotta" /> Closes 11:30am Tue 9 June
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-display font-extrabold leading-[1.05] tracking-tight mb-6"
            >
              You're one step from{' '}
              <span className="text-terracotta">lifetime access.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-lg md:text-xl font-medium opacity-80 leading-relaxed max-w-2xl mx-auto"
            >
              The whole bundle, worth £1,962, yours for life. One payment of £197, or split into
              2 × £99 or 3 × £66 at checkout.
            </motion.p>
          </div>
        </div>
      </section>

      {/* CHECKOUT */}
      <section className="px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6 md:gap-8 items-start">
          {/* Order summary */}
          <div className="lg:sticky lg:top-8 bg-white border border-forest-green/10 rounded-[2rem] p-7 md:p-8">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-5">
              Your order
            </div>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl md:text-5xl font-display font-black tabular-nums">£197</span>
              <span className="text-base font-bold opacity-50 line-through">£1,962</span>
            </div>
            <div className="text-xs md:text-sm font-medium opacity-60 mb-6">
              One-off, or split into 2 × £99 or 3 × £66
            </div>

            <div className="h-px bg-forest-green/10 mb-6" />

            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mb-4">
              What's included
            </div>
            <ul className="space-y-3 mb-6">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 text-sm md:text-base leading-snug">
                  <Check size={18} className="text-terracotta shrink-0 mt-0.5" strokeWidth={3} />
                  <span className="opacity-90">{item}</span>
                </li>
              ))}
            </ul>

            <div className="h-px bg-forest-green/10 mb-5" />

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs md:text-sm font-bold">
                <ShieldCheck size={16} className="text-terracotta shrink-0" />
                <span>7-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs md:text-sm font-bold">
                <Lock size={16} className="text-terracotta shrink-0" />
                <span>Secure checkout, powered by ThriveCart</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs md:text-sm font-bold">
                <Flame size={16} className="text-terracotta shrink-0" />
                <span>40 founders already in</span>
              </div>
            </div>
          </div>

          {/* ThriveCart embed */}
          <div className="bg-white border border-forest-green/10 rounded-[2rem] p-4 md:p-6 min-h-[480px]">
            <div
              className="tc-v2-embeddable-target"
              data-thrivecart-account="tonimartin"
              data-thrivecart-tpl="v2"
              data-thrivecart-product="170"
              data-thrivecart-embeddable={TC_SCRIPT_ID}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
