import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function Playbook() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
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

      <div className="container mx-auto max-w-5xl px-6 py-16 flex-1 flex flex-col justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-sand px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-8">
            Free Resource
          </div>

          <h1 className="text-4xl md:text-7xl font-display font-extrabold leading-[1.1] mb-6 tracking-tight">
            Your Free Vibe Coding Reference Guide
          </h1>

          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-6 opacity-90">
            Everything you need to understand the language, tools and technology behind vibe coding. All in one place. All in plain English.
          </p>

          <p className="text-lg font-medium max-w-xl mx-auto mb-12 italic opacity-70 leading-relaxed">
            The Vibe Playbook covers everything you will encounter on your vibe coding journey.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto mb-12">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
              <img src="/vibe-playbook-cover.jpg" alt="The Vibe Playbook preview" className="w-full h-full object-cover" />
            </div>

            <ul className="flex flex-col items-start gap-4 text-left">
              {([
                <>A searchable glossary of <strong>over 50 terms</strong> explained in plain English with real examples.</>,
                <>A complete file types reference so nothing in your project feels mysterious.</>,
                <>A breakdown of every major AI model, what each one is good for and how to choose between them.</>,
                <>A curated toolkit of the tools that power modern vibe coded projects.</>
              ] as React.ReactNode[]).map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-lg font-bold">
                  <CheckCircle2 className="text-terracotta w-6 h-6 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-lg font-medium max-w-xl mx-auto mb-12 italic opacity-70 leading-relaxed">
            Whether you are just getting started or actively building, this is the reference guide you will keep coming back to.
          </p>

          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-forest-green/5 max-w-lg mx-auto">
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                setLoading(true);
                try {
                  const res = await fetch('/api/subscribe-playbook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, email }),
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
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-warm-cream border border-forest-green/10 focus:outline-none focus:border-terracotta transition-colors text-lg"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-warm-cream border border-forest-green/10 focus:outline-none focus:border-terracotta transition-colors text-lg"
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
              <p className="text-sm font-bold opacity-40 mt-4">
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
