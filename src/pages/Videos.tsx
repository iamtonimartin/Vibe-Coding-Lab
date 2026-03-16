import { useRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';

const GrainOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 overflow-hidden">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const Section = ({ children, className = "", id = "" }: { children: ReactNode, className?: string, id?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`py-24 px-6 relative ${className}`}
    >
      {children}
    </motion.section>
  );
};

const VideoPlaceholder = ({ label }: { label: string }) => (
  <div className="aspect-video bg-sand/50 rounded-[2rem] border-2 border-forest-green/5 flex items-center justify-center group cursor-pointer overflow-hidden relative shadow-xl hover:shadow-2xl transition-all duration-500">
    <div className="absolute inset-0 bg-forest-green/5 group-hover:bg-forest-green/0 transition-colors duration-500" />
    <div className="w-20 h-20 bg-terracotta text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 z-10">
      <Play size={32} fill="currentColor" />
    </div>
    <div className="absolute bottom-8 left-8 text-sm font-bold uppercase tracking-widest opacity-40">
      {label}
    </div>
  </div>
);

export default function Videos() {
  return (
    <div className="min-h-screen selection:bg-terracotta selection:text-white bg-warm-cream text-forest-green overflow-x-hidden scroll-smooth">
      <GrainOverlay />

      {/* Navigation */}
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

      {/* Hero Section */}
      <Section className="pt-40 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-sand px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-8">
            You Are In. Here Is Everything.
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-extrabold leading-[0.9] mb-8 tracking-tighter">
            Two Videos. Fifteen Minutes. <span className="text-terracotta">Everything changes.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-80 max-w-2xl mx-auto">
            Watch the videos, find your app idea, then come build with{"\u00A0"}us.
          </p>
        </div>
      </Section>

      {/* Video 1 */}
      <Section className="bg-white/50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight">
              Video 1. Why I Am So Excited About This.
            </h2>
            <p className="text-lg md:text-xl opacity-80 leading-relaxed">
              Start here. This is why vibe coding changes everything for ambitious entrepreneurs and why right now is the moment to pay attention.
            </p>
          </div>
          <div className="aspect-video rounded-[2rem] overflow-hidden shadow-xl">
            <iframe
              src="https://player.vimeo.com/video/1173833089?badge=0&autopause=0&player_id=0&app_id=58479"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              className="w-full h-full"
              title="Video 1"
            />
          </div>
        </div>
      </Section>

      {/* Video 2 */}
      <Section>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 aspect-video rounded-[2rem] overflow-hidden shadow-xl">
            <iframe
              src="https://player.vimeo.com/video/1173842937?badge=0&autopause=0&player_id=0&app_id=58479"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              className="w-full h-full"
              title="Video 2"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight">
              Video 2. The Tools You Need to Get Started.
            </h2>
            <p className="text-lg md:text-xl opacity-80 leading-relaxed">
              No fluff. Just the exact tech stack I use to build real AI-powered products. What each tool does, why I chose it and how they work together. You will finish this video knowing exactly what to download and where to start.
            </p>
          </div>
        </div>
      </Section>

      {/* Video 3 */}
      <Section className="bg-white/50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight">
              Video 3. Behind the Scenes. The Apps and Tools That Started It All.
            </h2>
            <p className="text-lg md:text-xl opacity-80 leading-relaxed">
              Get an exclusive look at Relay and Insights, two fully functional SaaS apps built using Google AI Studio, Antigravity and Claude Code so you can see how it all comes together for yourself.
            </p>
          </div>
          <VideoPlaceholder label="VIDEO 3 PLACEHOLDER" />
        </div>
      </Section>

      {/* App Idea Section */}
      <Section className="bg-sand/30">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-7xl font-display font-extrabold leading-tight">
              Now Find Your App Idea.
            </h2>
            <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">
              You have seen the method. You have seen the proof. Now find out what you should build first.
            </p>
            <p className="text-xl md:text-2xl font-bold text-terracotta">
              Answer six quick questions and get a personalised AI-powered app idea in 60 seconds.
            </p>
          </div>

          <div className="space-y-6">
            <Link
              to="/app-idea"
              className="inline-block bg-terracotta text-white px-12 py-6 rounded-2xl text-2xl font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-2xl shadow-terracotta/30"
            >
              Find My App Idea
            </Link>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60">
              Free. No sign up required. Takes 60 seconds.
            </p>
          </div>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section className="bg-forest-green text-white">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-7xl font-display font-extrabold leading-tight">
            Ready to Start Building?
          </h2>
          <div className="space-y-5 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto text-left">
            <p className="font-bold">The best way to learn vibe coding is to actually build something. So that is exactly what we do.</p>
            <p className="opacity-80">Three days. Live sessions. Me in the room answering your questions every step of the way.</p>
            <p className="opacity-80">You will leave with a working AI-powered Founder Co-Pilot and the skills to build whatever comes next.</p>
            <p className="font-bold">Two ways to join:</p>
            <p>🔥 <strong className="font-bold">Lifetime access at £97.</strong> <span className="opacity-80">Available until 11:59pm 24 March. Never available again.</span></p>
            <p>💛 <strong className="font-bold">Monthly at £35/month ($47/month).</strong> <span className="opacity-80">Join now, cancel any time.</span></p>
            <p className="opacity-80">Sprint starts 25 March. Both options get you full access.</p>
          </div>

          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-3 bg-terracotta text-white px-12 py-6 rounded-2xl text-2xl font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-2xl shadow-terracotta/30"
          >
            Join the Vibe Coding Lab <ArrowRight />
          </Link>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-forest-green/5 text-center">
        <div className="text-xl font-display font-extrabold tracking-tighter mb-4">
          VIBE<span className="text-terracotta">CODING</span>LAB
        </div>
        <p className="text-sm opacity-40">© 2026 Vibe Coding Lab by Ascendz | All Rights Reserved</p>
      </footer>
    </div>
  );
}
