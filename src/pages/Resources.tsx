import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, Lightbulb, BookOpen, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

type Resource = {
  icon: React.ReactNode;
  badge: string;
  title: string;
  desc: string;
  forWho: string;
  cta: string;
  href: string;
  dark: boolean;
};

const RESOURCES: Resource[] = [
  {
    icon: <Play size={26} />,
    badge: 'Free Video Series',
    title: 'How I Built My First AI App in a Week',
    desc: 'A 3-part series showing the exact tools, stack and process behind real, deployed apps like Relavo and Zenitro.',
    forWho: 'Best if you want to see what is actually possible before you start.',
    cta: 'Watch Free',
    href: '/freetraining',
    dark: true,
  },
  {
    icon: <Lightbulb size={26} />,
    badge: 'Free Tool',
    title: 'Find Your App Idea',
    desc: 'Answer 6 quick questions and get an AI-generated app concept tailored to your expertise and goals.',
    forWho: 'Best if you want to build but are not sure what yet.',
    cta: 'Generate My Idea',
    href: '/app-idea',
    dark: false,
  },
  {
    icon: <BookOpen size={26} />,
    badge: 'Free Guide',
    title: 'The Vibe Coding Playbook',
    desc: 'The language, tools and technology behind vibe coding, explained in plain English. A reference you keep coming back to.',
    forWho: 'Best if the jargon is getting in your way.',
    cta: 'Get the Playbook',
    href: '/playbook',
    dark: false,
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-warm-cream text-forest-green selection:bg-terracotta selection:text-white">
      <Helmet>
        <title>Free Resources for Building AI Apps Without Code | Vibe Coding Lab</title>
        <meta name="description" content="Free tools, guides and training to help you build and ship your first AI-powered app without code. Watch the series, find your idea and get the Vibe Coding Playbook." />
        <link rel="canonical" href="https://thevibecodinglab.co/resources" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Nav */}
      <nav className="w-full px-4 md:px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="text-lg md:text-2xl font-display font-extrabold tracking-tighter">
          VIBE<span className="text-terracotta">CODING</span>LAB
        </Link>
        <Link
          to="/#join"
          className="bg-terracotta text-white px-4 md:px-6 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-burnt-orange transition-all shadow-lg shadow-terracotta/20 whitespace-nowrap"
        >
          Start Free Trial
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-green text-white">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center relative">
          <div className="inline-flex items-center gap-2 bg-terracotta/20 border border-terracotta/40 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8">
            Free, no commitment
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-display font-extrabold leading-[1.05] tracking-tight mb-6"
          >
            Free resources to get you{' '}
            <span className="text-terracotta">building.</span>
          </motion.h1>
          <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed max-w-2xl mx-auto">
            Everything here is free. Pick the one that fits where you are right now, from your first
            idea to shipping something real and secure.
          </p>
        </div>
      </section>

      {/* Resource grid */}
      <section className="px-4 md:px-6 py-14 md:py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESOURCES.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col gap-6 ${
                r.dark ? 'bg-forest-green text-white' : 'bg-white text-forest-green border border-forest-green/8'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${r.dark ? 'bg-white/10 text-white' : 'bg-terracotta/10 text-terracotta'}`}>
                  {r.icon}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${r.dark ? 'bg-white/10 text-white' : 'bg-sand text-forest-green'}`}>
                  {r.badge}
                </span>
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl md:text-2xl font-display font-bold leading-tight">{r.title}</h3>
                <p className="text-base md:text-lg leading-relaxed opacity-80">{r.desc}</p>
                <p className={`text-sm font-bold ${r.dark ? 'text-terracotta' : 'text-terracotta'}`}>{r.forWho}</p>
              </div>
              <Link
                to={r.href}
                className={`inline-flex items-center gap-2 font-extrabold px-6 py-3 rounded-xl transition-all hover:scale-105 self-start ${
                  r.dark ? 'bg-white text-forest-green hover:bg-warm-cream' : 'bg-terracotta text-white hover:bg-burnt-orange'
                }`}
              >
                {r.cta} <ArrowRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 md:px-6 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto bg-forest-green text-white rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight mb-4">
              Ready to actually ship something?
            </h2>
            <p className="text-base md:text-lg opacity-80 leading-relaxed max-w-2xl mx-auto mb-8">
              The free resources get you started. The community gets you finished, with live sprints,
              real support and a member app that keeps you building. Start with a 7-day free trial.
            </p>
            <Link
              to="/#join"
              className="inline-flex items-center gap-2 bg-terracotta text-white px-8 py-4 rounded-2xl text-base md:text-lg font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-2xl shadow-terracotta/30"
            >
              Start your 7-day free trial <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
