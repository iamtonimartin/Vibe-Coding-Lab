import { motion } from 'motion/react';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LogoExport() {
  const logoSvg = `
    <svg width="800" height="200" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="200" fill="#F5F5F0"/>
      <text x="40" y="140" font-family="Outfit, sans-serif" font-weight="800" font-size="120" letter-spacing="-0.05em">
        <tspan fill="#163020">VIBE</tspan>
        <tspan fill="#C25E44">CODING</tspan>
        <tspan fill="#163020">LAB</tspan>
      </text>
    </svg>
  `;

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green p-8 md:p-20 flex flex-col items-center justify-center">
      <Link to="/" className="fixed top-8 left-8 flex items-center gap-2 font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-extrabold">Logo Assets</h1>
          <p className="opacity-60">High-resolution web version of the Vibe Coding Lab logo.</p>
        </div>

        <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-2xl border border-forest-green/5 flex items-center justify-center overflow-hidden">
          <div className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter select-all">
            VIBE<span className="text-terracotta">CODING</span>LAB
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-forest-green/5 space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm opacity-40">SVG Code</h3>
            <textarea 
              readOnly 
              value={logoSvg.trim()}
              className="w-full h-32 p-4 bg-warm-cream/30 rounded-xl font-mono text-xs outline-none resize-none"
            />
            <p className="text-xs opacity-60 italic">Copy this into a .svg file for a perfect vector logo.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-forest-green/5 flex flex-col justify-center items-center gap-4">
            <h3 className="font-bold uppercase tracking-widest text-sm opacity-40">PNG Export</h3>
            <p className="text-center text-sm opacity-60">To get a PNG, you can screenshot the logo above or use the "Save Image As" if rendered as an image.</p>
            <div className="w-full h-1 bg-forest-green/5 rounded-full" />
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-40">
                <span>Primary</span>
                <span>#C25E44</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-40">
                <span>Secondary</span>
                <span>#163020</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
