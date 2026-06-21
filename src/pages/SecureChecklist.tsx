import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Inbox } from 'lucide-react';

const WHAT_YOU_GET: string[] = [
  'The Critical 5: the handful of checks behind almost every vibe-coded leak.',
  '6 build areas covering keys, database access, logins, data, AI features and launch.',
  'A copy-paste security review prompt you run in a second AI model.',
  'Plain-English explanations, no security background needed.',
];

export default function SecureChecklist() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green font-sans selection:bg-terracotta selection:text-white flex flex-col">
      <Helmet>
        <title>The Secure Build Checklist | Vibe Coding Lab</title>
        <meta name="description" content="A free field guide to ship AI-built apps that hold up. 5 critical checks, 6 build areas and a copy-paste review prompt that catches the mistakes behind almost every vibe-coded leak." />
        <link rel="canonical" href="https://thevibecodinglab.co/secure-checklist" />
      </Helmet>

      {/* Wordmark */}
      <div className="w-full px-6 py-6 text-center">
        <Link to="/" className="text-2xl font-display font-extrabold tracking-tighter">
          VIBE<span className="text-terracotta">CODING</span>LAB
        </Link>
      </div>

      <div className="container mx-auto max-w-5xl px-6 py-12 md:py-16 flex-1 flex flex-col justify-center text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-sand px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-8">
            <ShieldCheck size={16} className="text-terracotta" /> Secure by default
          </div>

          <h1 className="text-4xl md:text-7xl font-display font-extrabold leading-[1.05] mb-6 tracking-tight">
            The Secure Build Checklist
          </h1>

          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-6 opacity-90">
            Build it right from the start, so you never have to be rescued later.
          </p>

          <p className="text-lg font-medium max-w-2xl mx-auto mb-12 italic opacity-70 leading-relaxed">
            Most vibe-coded apps do not get hacked by clever attackers. They leak from a handful of
            basic mistakes the AI quietly left in, and nobody checked. This guide catches them.
          </p>

          {submitted ? (
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-forest-green/5 max-w-lg mx-auto">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-terracotta mb-5">
                <Inbox size={26} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold mb-3">Check your inbox.</h2>
              <p className="text-base md:text-lg opacity-80 leading-relaxed">
                The Secure Build Checklist is on its way to <strong>{email}</strong>. If it is not there
                in a couple of minutes, check your spam folder.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto items-center text-left">
              <ul className="space-y-5">
                {WHAT_YOU_GET.map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg font-bold">
                    <CheckCircle2 className="text-terracotta w-6 h-6 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-forest-green/5">
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError('');
                    setLoading(true);
                    try {
                      const res = await fetch('/api/subscribe-secure', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ firstName, email }),
                      });
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.error || 'Subscription failed');
                      }
                      window.scrollTo(0, 0);
                      setSubmitted(true);
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
                    {loading ? 'Sending...' : 'Send Me the Checklist'}
                  </button>
                  <p className="text-sm font-bold opacity-40 mt-4">
                    You will also receive occasional emails about building securely with AI and what we
                    are working on inside the Vibe Coding Lab. No spam, unsubscribe any time.
                  </p>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <footer className="py-8 px-6 text-center opacity-40 text-xs font-bold uppercase tracking-widest">
        © 2026 Vibe Coding Lab by Ascendz | All Rights Reserved
      </footer>
    </div>
  );
}
