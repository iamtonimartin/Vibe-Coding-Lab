import { Link } from 'react-router-dom';

const SKOOL_URL = 'https://www.skool.com/the-vibe-coding-lab-7172/about';

export default function Footer() {
  return (
    <footer className="bg-forest-green text-white">
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-10 mb-12">
          <div>
            <div className="text-2xl font-display font-extrabold tracking-tighter mb-4">
              VIBE<span className="text-terracotta">CODING</span>LAB
            </div>
            <p className="opacity-70 leading-relaxed max-w-xs">
              Build and ship real AI-powered apps without code, securely. Start with a 7-day free
              trial.
            </p>
          </div>

          <div>
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-4">
              Explore
            </div>
            <ul className="space-y-3 text-sm font-bold opacity-80">
              <li><Link to="/" className="hover:text-terracotta transition-colors">Home</Link></li>
              <li><Link to="/resources" className="hover:text-terracotta transition-colors">Free resources</Link></li>
              <li><Link to="/playbook" className="hover:text-terracotta transition-colors">The Vibe Coding Playbook</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-terracotta mb-4">
              Join
            </div>
            <ul className="space-y-3 text-sm font-bold opacity-80">
              <li><Link to="/#join" className="hover:text-terracotta transition-colors">Start your free trial</Link></li>
              <li>
                <a href={SKOOL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
                  The community on Skool
                </a>
              </li>
              <li>
                <a href="mailto:clientsupport@ascendz.co" className="hover:text-terracotta transition-colors">
                  Contact support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] md:text-xs font-bold uppercase tracking-widest opacity-50">
          <span>© 2026 Vibe Coding Lab by Ascendz. All rights reserved.</span>
          <span>Build it. Ship it. Make it hold up.</span>
        </div>
      </div>
    </footer>
  );
}
