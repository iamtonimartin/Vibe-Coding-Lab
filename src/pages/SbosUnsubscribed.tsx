import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MailX, ArrowRight, Clock } from 'lucide-react';
import {
  SEATS_TOTAL,
  DEADLINE_LONG,
  SOLD_OUT,
  SUPPORT_EMAIL,
} from '../components/sbos/config';
import { useCountdown } from '../components/sbos/useCountdown';
import Brand from '../components/sbos/Brand';

/* ------------------------------------------------------------------ *
 * Service Business OS · unsubscribed from the launch emails
 *
 * Point the Kit link trigger here. This page only confirms, it does
 * not unsubscribe anyone: the removal happens in Kit before the
 * redirect. See the note in the handover.
 *
 * Deliberately scoped to this offer, not the whole list. /unsubscribe
 * is the separate Vibe Coding Lab page and says something different.
 * ------------------------------------------------------------------ */

export default function SbosUnsubscribed() {
  const { expired } = useCountdown();
  const closed = SOLD_OUT || expired;

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green overflow-x-hidden selection:bg-terracotta selection:text-white flex flex-col">
      <Helmet>
        <title>Unsubscribed · Service Business OS</title>
        <meta
          name="description"
          content="You have been unsubscribed from the Service Business OS founding launch emails."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Status bar */}
      <div className="bg-forest-green text-white border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest">
          <Brand />
          <span className="opacity-60">Email preferences updated</span>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-forest-green/5 text-forest-green/40 flex items-center justify-center mx-auto mb-8">
            <MailX size={30} />
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-[1.05] tracking-tight mb-6">
            You&apos;re <span className="text-terracotta">unsubscribed.</span>
          </h1>

          <p className="text-lg md:text-xl opacity-75 leading-relaxed mb-10">
            Done. You will not hear anything more about the Service Business OS founding launch. No
            more reminders, no more nudges about the offer.
          </p>

          <div className="bg-white border border-forest-green/10 rounded-[2rem] p-7 md:p-9 text-left mb-10">
            <h2 className="text-xl md:text-2xl font-display font-extrabold mb-3">
              You are still on the list
            </h2>
            <p className="text-base md:text-lg opacity-75 leading-relaxed">
              Only the emails about this specific offer have stopped. You will still get the usual
              updates and anything else genuinely worth your time. Nothing else has changed.
            </p>
          </div>

          {!closed && (
            <>
              <p className="text-base md:text-lg opacity-75 leading-relaxed mb-6">
                Changed your mind, or clicked that by accident? The offer is still open.
              </p>
              <Link
                to="/sbos"
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-burnt-orange text-white px-8 py-5 rounded-2xl font-extrabold text-base md:text-xl shadow-2xl shadow-terracotta/40 hover:scale-105 transition-all"
              >
                See the founding offer <ArrowRight size={18} />
              </Link>
              <div className="flex items-center justify-center gap-2 mt-5 text-xs md:text-sm font-bold opacity-60">
                <Clock size={14} className="text-terracotta" />
                Open until {DEADLINE_LONG} UK, or until the {SEATS_TOTAL} seats are gone
              </div>
            </>
          )}

          <p className="text-sm opacity-50 leading-relaxed mt-12">
            Unsubscribed by mistake, or something not right?{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="underline hover:text-terracotta">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </motion.div>
      </main>

      <footer className="py-8 px-6 text-center opacity-40 text-[10px] md:text-xs font-bold uppercase tracking-widest">
        © 2026 Service Business OS by Ascendz
      </footer>
    </div>
  );
}
