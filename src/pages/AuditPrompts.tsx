import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import { AUDIT_PROMPTS, type AuditPrompt } from '../data/auditPrompts';

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const Grain = ({ dark = false }: { dark?: boolean }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 ${
      dark ? 'opacity-[0.07] mix-blend-overlay' : 'opacity-[0.035] mix-blend-multiply'
    }`}
    style={{ backgroundImage: NOISE }}
  />
);

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch {
      /* nothing else to try */
    }
    document.body.removeChild(ta);
  }
}

function PromptCard({ prompt, index }: { prompt: AuditPrompt; index: number }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await copyText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Anything in [square brackets] is a placeholder for the user to swap out.
  const parts = prompt.text.split(/(\[[^\]]+\])/g);

  return (
    <section id={prompt.id} className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
        <span className="font-mono font-bold text-terracotta text-xs tracking-[0.06em]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="font-display font-extrabold text-forest-green text-2xl md:text-3xl tracking-tight">
          {prompt.name}
        </h2>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-terracotta border border-terracotta/50 rounded-full px-2.5 py-1">
          {prompt.when}
        </span>
      </div>
      <p className="text-forest-green/70 leading-relaxed max-w-[44em] mb-5">{prompt.blurb}</p>

      <div className="bg-[#152a1c] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-forest-green/20">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e0655a]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e0b24f]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#78b06a]" />
          <span className="ml-2 font-mono text-[11px] md:text-xs text-sand/50 truncate">
            {prompt.file}
          </span>
          <button
            onClick={copy}
            className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] md:text-xs font-bold border transition-colors whitespace-nowrap ${
              copied
                ? 'bg-[#78b06a] border-[#78b06a] text-forest-green'
                : 'bg-white/10 border-white/15 text-sand hover:bg-terracotta hover:border-terracotta hover:text-white'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="m-0 p-4 md:p-7 font-mono text-[12px] md:text-[13px] leading-[1.75] text-sand whitespace-pre-wrap break-words max-h-none overflow-x-auto">
          {parts.map((p, i) =>
            p.startsWith('[') && p.endsWith(']') ? (
              <span className="text-[#E08A6F]" key={i}>
                {p}
              </span>
            ) : (
              p
            )
          )}
        </pre>
      </div>
    </section>
  );
}

export default function AuditPrompts() {
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAll = async () => {
    await copyText(
      AUDIT_PROMPTS.map(p => `# ${p.name} (${p.file})\n\n${p.text}`).join('\n\n\n---\n\n\n')
    );
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  };

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green font-sans selection:bg-terracotta selection:text-white">
      <Helmet>
        <title>The Three Audit Prompts | Vibe Coding Lab</title>
        <meta
          name="description"
          content="The three prompts from The Art of the Audit: prepare your questions, turn your notes into a draft report and find your first client. Copy and run."
        />
        <link rel="canonical" href="https://thevibecodinglab.co/auditprompts" />
      </Helmet>

      {/* Nav */}
      <div className="sticky top-0 z-50 bg-forest-green/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link to="/" className="font-display font-extrabold text-sand text-sm tracking-tight">
            VIBE<span className="text-terracotta">CODING</span>LAB
          </Link>
          <Link
            to="/artoftheaudit"
            className="bg-terracotta text-white px-4 py-2 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider hover:bg-burnt-orange transition-colors whitespace-nowrap"
          >
            The session
          </Link>
        </div>
      </div>

      {/* Hero */}
      <header className="relative bg-forest-green text-sand overflow-hidden py-12 md:py-20">
        <Grain dark />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8">
          <div className="flex items-center gap-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.22em] text-terracotta mb-5">
            <span className="w-7 h-0.5 bg-current shrink-0" />
            The Art of the Audit
          </div>
          <h1 className="font-display font-extrabold text-white text-[32px] sm:text-5xl md:text-6xl leading-[1] tracking-tighter">
            The three prompts
          </h1>
          <p className="italic text-lg md:text-2xl text-sand/80 mt-5 max-w-[30em] leading-snug">
            Copy, paste, swap the bits in brackets for your own client. The listening is still yours.
            These only do the parts that used to eat weeks.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              onClick={copyAll}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-extrabold transition-colors ${
                copiedAll
                  ? 'bg-[#78b06a] text-forest-green'
                  : 'bg-terracotta text-white hover:bg-burnt-orange'
              }`}
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'All three copied' : 'Copy all three'}
            </button>
            {AUDIT_PROMPTS.map((p, i) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="text-[11px] md:text-xs font-bold uppercase tracking-[0.1em] text-sand/70 hover:text-white border-b border-white/25 hover:border-white pb-1 transition-colors"
              >
                {String(i + 1).padStart(2, '0')} {p.name}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Read me */}
      <div className="bg-[#fbeee8] border-b border-terracotta/25">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-5 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 sm:gap-4 items-start">
          <span className="font-mono font-bold text-[11px] uppercase tracking-[0.08em] text-terracotta whitespace-nowrap sm:pt-1">
            How to use
          </span>
          <p className="text-[15px] text-forest-green leading-relaxed">
            Anything in <b className="font-extrabold text-terracotta">[square brackets]</b> is yours
            to replace. Everything else is the prompt doing its job. Run them in whichever AI you
            already work in.
          </p>
        </div>
      </div>

      {/* The prompts */}
      <main className="relative max-w-4xl mx-auto px-5 md:px-8 py-12 md:py-20 flex flex-col gap-14 md:gap-20">
        {AUDIT_PROMPTS.map((p, i) => (
          <PromptCard key={p.id} prompt={p} index={i} />
        ))}
      </main>

      {/* Footer */}
      <footer className="relative bg-forest-green text-sand/70 py-12 md:py-16 text-center overflow-hidden">
        <Grain dark />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8">
          <div className="font-display font-extrabold text-sand text-xl tracking-tight">
            VIBE<span className="text-terracotta">CODING</span>LAB
          </div>
          <div className="italic text-sand/60 mt-1 mb-8">The Art of the Audit</div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/sampleauditreport"
              className="inline-flex items-center gap-2 bg-terracotta text-white px-5 py-3 rounded-full text-sm font-extrabold hover:bg-burnt-orange transition-colors"
            >
              The sample report
            </Link>
            <Link
              to="/artoftheaudit"
              className="inline-flex items-center gap-2 border border-white/25 text-sand px-5 py-3 rounded-full text-sm font-extrabold hover:border-white hover:text-white transition-colors"
            >
              Back to the session
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
