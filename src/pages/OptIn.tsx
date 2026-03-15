import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function OptIn() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green font-sans selection:bg-terracotta selection:text-white flex flex-col">
      <div className="container mx-auto max-w-4xl px-6 py-16 flex-1 flex flex-col justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-sand px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-8">
            Free Access
          </div>

          <h1 className="text-4xl md:text-7xl font-display font-extrabold leading-[1.1] mb-6 tracking-tight">
            How I Built My First AI App in a Week Using No-Code AI Tools 
            <span className="block text-2xl md:text-4xl text-terracotta italic mt-4">(And How You Can Too)</span>
          </h1>

          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12 opacity-90">
            Get the free video series plus discover your personalised app idea in 60 seconds.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto mb-12">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
              <img src="/video-thumbnail.jpg" alt="Free training preview" className="w-full h-full object-cover" />
            </div>

            <ul className="flex flex-col items-start gap-4 text-left">
              {[
                "The complete video series",
                "The live build watch-along",
                "The personalised app idea generator"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-lg font-bold">
                  <CheckCircle2 className="text-terracotta w-6 h-6 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-lg font-medium max-w-xl mx-auto mb-12 italic opacity-70 leading-relaxed">
            "Built by a Digital Growth Architect who went from idea to deployed app in a week. No developer. No agency. Just AI tools and a process that works."
          </p>

          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-forest-green/5 max-w-lg mx-auto">
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
                      body: JSON.stringify({ firstName, email }),
                    });
                    if (!res.ok) {
                      const data = await res.json().catch(() => ({}));
                      throw new Error(data.error || 'Subscription failed');
                    }
                    navigate('/videos');
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
                  {loading ? 'Signing you up...' : 'Get Instant Access'}
                </button>
                <p className="text-sm font-bold opacity-40 mt-4">no spam, unsubscribe any time</p>
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
