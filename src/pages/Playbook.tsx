import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Playbook() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green font-sans selection:bg-terracotta selection:text-white flex flex-col">

      {/* Wordmark */}
      <div className="w-full px-6 py-6 text-center">
        <a
          href="https://thevibecodinglab.co"
          className="text-2xl font-display font-extrabold tracking-tighter"
        >
          VIBE<span className="text-terracotta">CODING</span>LAB
        </a>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-2xl px-6 py-10 flex-1 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="inline-block bg-sand px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-8">
            Free Resource
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-[1.1] mb-6 tracking-tight">
            Your Free Vibe Coding Reference Guide
          </h1>

          <p className="text-xl md:text-2xl font-medium mb-10 opacity-90 leading-relaxed">
            Everything you need to understand the language, tools and technology behind vibe coding. All in one place. All in plain English.
          </p>

          <div className="text-left max-w-xl mx-auto space-y-5 mb-12 text-lg leading-relaxed opacity-80">
            <p>The Vibe Playbook covers everything you will encounter on your vibe coding journey.</p>
            <p>A searchable glossary of over 50 terms explained in plain English with real examples. A complete file types reference so nothing in your project feels mysterious. A breakdown of every major AI model, what each one is good for and how to choose between them. A curated toolkit of the tools that power modern vibe coded projects.</p>
            <p>Whether you are just getting started or actively building, this is the reference guide you will keep coming back to.</p>
          </div>

          {/* Form */}
          <div className="w-full max-w-[480px] mx-auto">
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                setLoading(true);
                try {
                  const res = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                  });
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'Subscription failed');
                  }
                  window.scrollTo(0, 0);
                  navigate('/vibeplaybook');
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white border border-forest-green/10 focus:outline-none focus:border-terracotta transition-colors text-lg"
                required
              />
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-terracotta text-white px-8 py-5 rounded-2xl text-xl font-extrabold hover:bg-burnt-orange transition-all shadow-xl shadow-terracotta/20 disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Me the Playbook'}
              </button>
              <p className="text-sm font-medium opacity-50 leading-relaxed pt-1">
                You will also receive occasional emails about vibe coding, building with AI and what we are working on inside the Vibe Coding Lab. No spam, unsubscribe any time.
              </p>
            </form>
          </div>
        </motion.div>
      </div>

      <footer className="py-8 px-6 text-center opacity-40 text-xs font-bold uppercase tracking-widest">
        © 2026 Vibe Coding Lab by Ascendz | All Rights Reserved
      </footer>
    </div>
  );
}
