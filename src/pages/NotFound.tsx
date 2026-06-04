import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

const SUGGESTIONS: { to: string; title: string; blurb: string }[] = [
  {
    to: '/',
    title: 'The home page',
    blurb: 'Vibe Coding Lab in full. Community, sprints, freemium pricing.',
  },
  {
    to: '/bumpsale',
    title: 'The current Bumpsale',
    blurb: 'Lifetime access bundle. Starts at £1, capped at £147.',
  },
  {
    to: '/vibeplaybook',
    title: 'The Vibe Playbook',
    blurb: 'Tools, models and reference guide for building with AI.',
  },
  {
    to: '/freetraining',
    title: 'Free training',
    blurb: 'A short video series on building AI apps without code.',
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-cream text-forest-green selection:bg-terracotta selection:text-white">
      <Helmet>
        <title>Page not found | Vibe Coding Lab</title>
        <meta name="description" content="That page does not exist. Here are a few places to try instead." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="relative overflow-hidden bg-forest-green text-white">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 md:px-6 py-20 md:py-28 text-center relative">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-terracotta/20 border border-terracotta/40 mb-8">
            <Compass size={44} className="text-terracotta" />
          </div>

          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            404 · Page not found
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-[0.95] tracking-tight mb-6">
            Lost the thread?
          </h1>
          <p className="text-lg md:text-2xl font-medium opacity-80 leading-relaxed mb-10">
            That page does not exist (or moved). Here are a few places to try.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-terracotta text-white px-8 py-4 rounded-2xl text-base md:text-lg font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-2xl shadow-terracotta/40"
          >
            Back to Vibe Coding Lab <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <section className="py-14 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              Try one of these
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight">
              The good stuff.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {SUGGESTIONS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group bg-white border border-forest-green/10 rounded-2xl p-6 md:p-7 flex flex-col gap-2 hover:border-terracotta/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg md:text-xl font-display font-extrabold group-hover:text-terracotta transition-colors">
                    {item.title}
                  </h3>
                  <ArrowRight
                    size={20}
                    className="text-terracotta shrink-0 group-hover:translate-x-1 transition-transform"
                  />
                </div>
                <p className="text-sm md:text-base opacity-70 leading-relaxed">{item.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
