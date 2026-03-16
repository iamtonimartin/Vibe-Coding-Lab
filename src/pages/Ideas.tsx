import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function Ideas() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: '-80px' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Subscription failed');
      }
      window.scrollTo(0, 0);
      navigate('/ideas-access');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green font-sans selection:bg-terracotta selection:text-white scroll-smooth">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-warm-cream/80 backdrop-blur-md border-b border-forest-green/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-lg md:text-2xl font-display font-extrabold tracking-tighter">
            VIBE<span className="text-terracotta">CODING</span>LAB
          </Link>
          <Link
            to="/"
            className="bg-terracotta text-white px-4 md:px-6 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-burnt-orange hover:scale-105 transition-all shadow-lg shadow-terracotta/20 whitespace-nowrap"
          >
            Get Lifetime Access
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="pt-32 pb-20 px-6 flex flex-col items-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-sand px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-8"
        >
          Free Resource
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-7xl font-display font-extrabold leading-[1.0] tracking-tighter text-center max-w-4xl mb-6"
        >
          70 AI-Powered Tools You Could Build and Monetise This Week.{' '}
          <span className="text-terracotta">No Code Required.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl md:text-2xl font-medium opacity-80 max-w-2xl text-center mb-12 leading-relaxed"
        >
          Browse 70 ideas across 14 industries, filtered by niche and tool type, each with a clear monetisation angle. Find your idea in minutes.
        </motion.p>

        {/* Preview image + Bullets side by side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8 items-center w-full max-w-3xl mb-12"
        >
          <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-sand border-2 border-forest-green/5 shadow-xl">
            <img
              src="/ideas-thumbnail.jpg"
              alt="70 AI-powered tool ideas preview"
              className="w-full h-full object-cover"
            />
          </div>
          <ul className="flex flex-col gap-5">
            {[
              '70 ideas across 14 industries',
              'Filter by your niche and tool type',
              'Clear monetisation potential for every single idea',
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-lg font-bold">
                <CheckCircle2 className="text-terracotta w-6 h-6 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Credibility line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-base md:text-lg italic opacity-60 max-w-xl text-center mb-12 leading-relaxed"
        >
          Built by Toni Martin, Digital Growth Architect and AI Consultant who has built two fully functional SaaS products using nothing but no-code AI tools and ambition.
        </motion.p>

        {/* Form */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 24 }}
          animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-forest-green/5 space-y-4"
          >
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-2xl bg-warm-cream border border-forest-green/10 focus:outline-none focus:border-terracotta transition-colors text-lg"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-2xl bg-warm-cream border border-forest-green/10 focus:outline-none focus:border-terracotta transition-colors text-lg"
            />
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-white px-8 py-5 rounded-2xl text-xl font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-xl shadow-terracotta/20 disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Show Me The Ideas'}
            </button>
            <p className="text-sm font-bold opacity-40 text-center">No spam. Unsubscribe any time.</p>
          </form>
        </motion.div>
      </main>

      <footer className="py-8 px-6 text-center opacity-40 text-xs font-bold uppercase tracking-widest border-t border-forest-green/5">
        © 2026 Vibe Coding Lab by Ascendz | All Rights Reserved
      </footer>
    </div>
  );
}
