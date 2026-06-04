import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forest-green text-white selection:bg-terracotta selection:text-white relative overflow-hidden">
      <Helmet>
        <title>Page not found | Vibe Coding Lab</title>
        <meta name="description" content="That page does not exist." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 py-20 text-center relative">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-terracotta/20 border border-terracotta/40 mb-8">
          <Compass size={44} className="text-terracotta" />
        </div>

        <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
          404 · Page not found
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-[0.95] tracking-tight mb-6 max-w-3xl">
          Lost the thread?
        </h1>
        <p className="text-lg md:text-2xl font-medium opacity-80 leading-relaxed mb-10 max-w-2xl">
          That page does not exist (or moved).
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-terracotta text-white px-8 py-4 rounded-2xl text-base md:text-lg font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-2xl shadow-terracotta/40"
        >
          Return to home <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
