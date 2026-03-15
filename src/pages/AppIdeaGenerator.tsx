import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Loader2, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function AppIdeaGenerator() {
  const [formData, setFormData] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'streaming' | 'done'>('idle');
  const [result, setResult] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  // --- CONFIGURATION ---
  // Add your OpenAI API Key here
  const OPENAI_API_KEY = ''; 

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResult('');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!OPENAI_API_KEY) {
      // SIMULATE MOCK RESPONSE FOR PREVIEW
      setTimeout(() => {
        setStatus('streaming');
        simulateStreaming(`## The Vibe Architect AI

You have a deep understanding of **${formData.q1}**, and your clients are always asking **"${formData.q2}"**. This tells me you are sitting on a goldmine of expertise that needs a scalable home.

Your app, **The Vibe Architect**, is a high-energy strategic companion for entrepreneurs who want to master ${formData.q1} without the overwhelm. It uses AI to turn your "unfair advantage" of **${formData.q3}** into a daily actionable roadmap for your users. Unlike generic tools that focus on the wrong metrics (the thing people always get wrong: **${formData.q4}**), this app prioritises **${formData.q5}** energy and precise execution.

What makes this genuinely different is the "Vibe-Check" engine — it doesn't just give data; it filters every decision through your specific business philosophy, ensuring that everything built feels authentic to the user's brand.

This idea is perfect for you because it directly addresses the ${formData.q6} you want to be known for, while leveraging your unique ability to talk for hours about ${formData.q1} into a structured, AI-powered mentor.`);
      }, 2000);
      return;
    }

    const systemPrompt = "You are a brilliant, creative product strategist who specialises in helping entrepreneurs build AI-powered apps and tools. Based on the answers provided, generate an exciting, specific and genuinely useful app idea for this person. Your response must include: a suggested app name (wrap in ##), a one paragraph description of what the app does, who would use it and why they would love it, what makes it genuinely different from everything else out there, and one sentence on why this idea is perfect for this specific person based on their answers. Tone should be high energy, exciting and encouraging. British English spelling throughout. No em dashes. Write directly to the person in second person. Use markdown for structure.";

    const userPrompt = `
      Here are my answers:
      1. I know this inside out: ${formData.q1}
      2. My clients always ask: ${formData.q2}
      3. The unfair advantage I'd give: ${formData.q3}
      4. People always get this wrong: ${formData.q4}
      5. My business energy: ${formData.q5}
      6. I want to be known for building: ${formData.q6}
    `;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: true
        })
      });

      if (!response.ok) throw new Error('API request failed');

      setStatus('streaming');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              
              try {
                const json = JSON.parse(data);
                const content = json.choices[0].delta.content;
                if (content) {
                  fullText += content;
                  setResult(fullText);
                }
              } catch (e) {}
            }
          }
        }
      }
      setStatus('done');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please check your API key and connection.');
      setStatus('idle');
    }
  };

  const simulateStreaming = (text: string) => {
    let i = 0;
    const interval = setInterval(() => {
      setResult(text.slice(0, i));
      i += 5;
      if (i > text.length) {
        clearInterval(interval);
        setResult(text);
        setStatus('done');
      }
    }, 20);
  };

  useEffect(() => {
    if (status === 'streaming' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [result, status]);

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green selection:bg-terracotta/20">
      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <nav className="fixed top-0 w-full z-50 bg-warm-cream/80 backdrop-blur-md border-b border-forest-green/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-lg md:text-2xl font-display font-extrabold tracking-tighter shrink-0">
            VIBE<span className="text-terracotta">CODING</span>LAB
          </Link>
          <div className="flex items-center gap-3 md:gap-8">
            <Link 
              to="/"
              className="bg-terracotta text-white px-4 md:px-6 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-burnt-orange hover:scale-105 transition-all shadow-lg shadow-terracotta/20 whitespace-nowrap"
            >
              Get Lifetime Access
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 relative z-10">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-6 tracking-tight">
              AI App Idea <span className="text-terracotta">Generator</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-80 leading-relaxed">
              Answer six questions. Get your personalised AI-powered app idea instantly.
            </p>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="space-y-10 bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-forest-green/5"
            >
              <div className="space-y-4">
                <label className="block text-lg font-bold">What do you know so well you could talk about it for hours without notes?</label>
                <textarea 
                  name="q1" 
                  required 
                  value={formData.q1}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-forest-green/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all min-h-[100px] bg-warm-cream/30" 
                  placeholder="e.g. Sustainable gardening, high-ticket sales, vintage watch restoration..."
                />
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-bold">What do your clients or customers always ask you first?</label>
                <textarea 
                  name="q2" 
                  required 
                  value={formData.q2}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-forest-green/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all min-h-[100px] bg-warm-cream/30" 
                  placeholder="e.g. How do I start? What is the cost? Why is this better than the alternative?"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-bold">If you could give every person in your industry one unfair advantage what would it be?</label>
                <textarea 
                  name="q3" 
                  required 
                  value={formData.q3}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-forest-green/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all min-h-[100px] bg-warm-cream/30" 
                  placeholder="e.g. Instant market data, automated client follow-ups, perfect pitch decks..."
                />
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-bold">What is something people in your world always get wrong?</label>
                <textarea 
                  name="q4" 
                  required 
                  value={formData.q4}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-forest-green/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all min-h-[100px] bg-warm-cream/30" 
                  placeholder="e.g. Thinking they need a huge budget, focusing on the wrong metrics..."
                />
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-bold">Pick a word that describes your business energy</label>
                <div className="relative">
                  <select 
                    name="q5" 
                    required 
                    value={formData.q5}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-2xl border border-forest-green/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all bg-warm-cream/30 appearance-none"
                  >
                    <option value="" disabled>Select your energy...</option>
                    <option value="Bold">Bold</option>
                    <option value="Nurturing">Nurturing</option>
                    <option value="Rebellious">Rebellious</option>
                    <option value="Precise">Precise</option>
                    <option value="Playful">Playful</option>
                    <option value="Authoritative">Authoritative</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-bold">What would you love to be known for building?</label>
                <textarea 
                  name="q6" 
                  required 
                  value={formData.q6}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-forest-green/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all min-h-[100px] bg-warm-cream/30" 
                  placeholder="e.g. The simplest tool for X, a community that solves Y..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-terracotta text-white py-6 rounded-2xl text-2xl font-extrabold hover:bg-burnt-orange hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-terracotta/30 flex items-center justify-center gap-3"
              >
                <Sparkles size={28} />
                Generate My App Idea
              </button>
            </motion.form>
          )}

          {status === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-16 text-center"
            >
              <div className="inline-block mb-6">
                <Loader2 size={64} className="text-terracotta animate-spin" />
              </div>
              <h2 className="text-3xl font-display font-bold text-terracotta">
                Building your idea<span className="animate-pulse">...</span>
              </h2>
              <p className="mt-4 opacity-60 font-medium">Our AI strategist is crafting your personalised product...</p>
            </motion.div>
          )}

          {(status === 'streaming' || status === 'done') && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 space-y-12"
              ref={resultsRef}
            >
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-2 border-terracotta/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/5 rounded-bl-full"></div>
                <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-terracotta prose-strong:text-forest-green prose-p:leading-relaxed">
                  <ReactMarkdown
                    components={{
                      h2: ({node, ...props}) => <h2 className="text-3xl font-display font-black text-terracotta mb-6 mt-0" {...props} />,
                      p: ({node, ...props}) => <p className="mb-6 last:mb-0" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-forest-green" {...props} />
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              </div>

              {status === 'done' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-3 bg-terracotta text-white px-10 py-6 rounded-2xl text-2xl font-extrabold hover:bg-burnt-orange hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-terracotta/30"
                  >
                    <Rocket size={28} />
                    Ready to Build This? Join The Vibe Coding Lab
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-16 px-6 text-center opacity-40 text-sm font-bold uppercase tracking-widest">
        © 2026 Vibe Coding Lab by Ascendz | All Rights Reserved
      </footer>
    </div>
  );
}
