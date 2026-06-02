import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Mail,
  Zap,
  Clock,
  Calendar,
  ArrowRight,
  Inbox,
} from 'lucide-react';

type Status = 'now' | 'soon' | 'later';

const DELIVERABLES: {
  title: string;
  when: string;
  status: Status;
  detail: string;
}[] = [
  {
    title: 'Vibe Coding Lab Premium',
    when: '5 June',
    status: 'now',
    detail: "Your Premium upgrade invite lands on 5 June, the day after the Bumpsale closes. Standard members get bumped up; new members get a fresh login.",
  },
  {
    title: 'Claude OS',
    when: 'Starts Tue 9 June',
    status: 'soon',
    detail: "Four live build-alongs starting Tuesday 9 June, 11:30am-2:30pm UK (then 16, 23 and 30 June). Full schedule and joining link land inside VCL with your Premium access.",
  },
  {
    title: 'The Site Sprint',
    when: 'Wed 10 June',
    status: 'soon',
    detail: "One live session Wednesday 10 June, 1pm UK. Recording inside VCL if you can't make it.",
  },
  {
    title: 'The Ship Sprint',
    when: '7 + 9 July',
    status: 'later',
    detail: "Two live workshops Tuesday 7 July and Thursday 9 July, 10am UK. Recordings included.",
  },
  {
    title: 'The Art of the Audit Masterclass',
    when: 'Date inside VCL',
    status: 'later',
    detail: "New bonus masterclass: how to land £3,000+ day rate audits, the framework Toni runs onsite, and how to structure proposals that close six-figure engagements. Date and joining link announced inside VCL.",
  },
  {
    title: 'Relavo',
    when: '5 June',
    status: 'now',
    detail: "Your Relavo account details land in your inbox on 5 June. Lifetime access locked in at the bundle tier.",
  },
  {
    title: 'Zenitro',
    when: 'At launch',
    status: 'later',
    detail: "Launching soon. The moment it ships, you're in for life. I'll email the access link.",
  },
];

const statusStyles: Record<Status, { dot: string; label: string }> = {
  now: { dot: 'bg-terracotta', label: 'text-terracotta' },
  soon: { dot: 'bg-terracotta/60', label: 'text-terracotta/80' },
  later: { dot: 'bg-forest-green/40', label: 'text-forest-green/60' },
};

export default function Complete() {
  return (
    <div className="min-h-screen bg-warm-cream text-forest-green selection:bg-terracotta selection:text-white">
      <Helmet>
        <title>You're in! | Vibe Coding Lab</title>
        <meta name="description" content="Your bundle is confirmed. Here's what's coming and when." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-green text-white">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 md:px-6 py-20 md:py-28 text-center relative">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-terracotta mb-8 shadow-2xl shadow-terracotta/40"
          >
            <CheckCircle2 size={48} strokeWidth={2.5} className="text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-7xl font-display font-extrabold leading-[0.95] tracking-tight mb-6"
          >
            You're in.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-2xl font-medium opacity-80 leading-relaxed mb-10"
          >
            Welcome in. Your lifetime access is locked in.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/15 rounded-full px-5 py-2.5 text-xs md:text-sm font-bold"
          >
            <Inbox size={16} className="text-terracotta" />
            <span>Order confirmation sent to your inbox</span>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S COMING */}
      <section className="py-14 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              Here's what's coming
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight">
              And when to expect it.
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            {DELIVERABLES.map((d, i) => {
              const s = statusStyles[d.status];
              return (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="bg-white border border-forest-green/10 rounded-2xl p-5 md:p-6 flex items-start gap-4 md:gap-5"
                >
                  <div className="shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${s.dot} ring-4 ring-current/10`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-2">
                      <h3 className="text-lg md:text-xl font-display font-extrabold leading-tight">
                        {d.title}
                      </h3>
                      <div className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${s.label}`}>
                        {d.when}
                      </div>
                    </div>
                    <p className="text-sm md:text-base leading-relaxed opacity-80">
                      {d.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHECK YOUR INBOX */}
      <section className="px-4 md:px-6 pb-14 md:pb-24">
        <div className="max-w-4xl mx-auto bg-forest-green text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-terracotta/20 border border-terracotta/40 flex items-center justify-center shrink-0">
              <Mail size={32} className="text-terracotta" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold mb-3 leading-tight">
                Check your inbox (and spam folder).
              </h3>
              <p className="text-base md:text-lg opacity-80 leading-relaxed">
                Your order confirmation should be there already. If it's not in your main inbox in
                the next few minutes, peek in spam and mark it as safe so the rest of your access
                emails come through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHILE YOU WAIT */}
      <section className="bg-sand py-14 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              While you wait
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight">
              Two things you can do today.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="bg-white rounded-[2rem] p-7 md:p-9 border border-forest-green/10 flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-5">
                <Calendar size={22} />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-extrabold leading-tight mb-3">
                Block out the live dates
              </h3>
              <p className="text-sm md:text-base leading-relaxed opacity-80 flex-1 mb-6">
                Claude OS runs Tuesdays 9, 16, 23 and 30 June at 11:30am UK. The Site Sprint
                is Wednesday 10 June at 1pm UK. The Ship Sprint is Tuesday 7 July and Thursday 9
                July at 10am UK. Drop them in your calendar now.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta">
                <Clock size={14} /> First session 9 June
              </div>
            </div>

            <div className="bg-forest-green text-white rounded-[2rem] p-7 md:p-9 flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-5">
                <Zap size={22} />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-extrabold leading-tight mb-3">
                Jot down your business
              </h3>
              <p className="text-sm md:text-base leading-relaxed opacity-80 flex-1 mb-6">
                Session 2 of Claude OS sets up the 2-3 Claude Projects that mirror the most
                important parts of your business. Spend 10 minutes listing those parts now and
                you'll fly through that session.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta">
                <Clock size={14} /> 10 minute exercise
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="py-14 md:py-20 px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-display font-extrabold mb-4 leading-tight">
            Something missing or off?
          </h3>
          <p className="text-base md:text-lg opacity-80 leading-relaxed mb-8">
            Reply to your order confirmation email and I'll personally sort it. The Bumpsale model
            relies on every sale counting toward the price for the next buyer, so refunds aren't
            possible, but I will make sure you get everything you paid for.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-terracotta hover:text-burnt-orange transition-colors"
          >
            Back to Vibe Coding Lab <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
