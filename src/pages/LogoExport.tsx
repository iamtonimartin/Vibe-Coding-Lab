import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Brand assets page. Internal only, noindex. The marks are PNGs with
// transparency at 2172x724, so they sit on either background without a plate.
const MARKS = [
  {
    file: '/aisb-logo-lightbg.png',
    label: 'On light',
    caption: 'Use on warm cream, white and any pale surface.',
    surface: 'bg-warm-cream',
  },
  {
    file: '/aisb-logo-darkbg.png',
    label: 'On dark',
    caption: 'Use on forest green and any dark surface.',
    surface: 'bg-forest-green',
  },
];

const PALETTE = [
  { name: 'Terracotta', hex: '#C25E44', role: 'Primary action' },
  { name: 'Forest green', hex: '#0e1f16', role: 'Text and contrast' },
  { name: 'Warm cream', hex: '#F5F5F0', role: 'Background' },
  { name: 'Sand', hex: '#EDE7DE', role: 'Accents' },
];

export default function LogoExport() {
  return (
    <div className="min-h-screen bg-warm-cream text-forest-green p-8 md:p-20">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Brand Assets | AI for Service Businesses</title>
      </Helmet>

      <Link
        to="/"
        className="fixed top-8 left-8 flex items-center gap-2 font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
      >
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="max-w-4xl mx-auto space-y-12 pt-16">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-display font-extrabold">Brand Assets</h1>
          <p className="opacity-60">
            The AI for Service Businesses logo, in both background treatments. Right click and
            save, or download straight from the links below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {MARKS.map((mark) => (
            <div
              key={mark.file}
              className="bg-white p-6 rounded-3xl border border-forest-green/5 shadow-lg space-y-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-bold uppercase tracking-widest text-sm opacity-40">
                  {mark.label}
                </h3>
                <a
                  href={mark.file}
                  download
                  className="text-xs font-bold uppercase tracking-widest text-terracotta hover:underline"
                >
                  Download
                </a>
              </div>
              <div
                className={`${mark.surface} rounded-2xl p-8 md:p-10 flex items-center justify-center min-h-[9rem]`}
              >
                <img
                  src={mark.file}
                  alt={`AI for Service Businesses logo, ${mark.label.toLowerCase()} backgrounds`}
                  className="w-full max-w-xs h-auto"
                  width={2172}
                  height={724}
                />
              </div>
              <p className="text-xs opacity-60">{mark.caption}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-forest-green/5 space-y-5">
          <h3 className="font-bold uppercase tracking-widest text-sm opacity-40">Palette</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {PALETTE.map((c) => (
              <div key={c.hex} className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl border border-forest-green/10 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="min-w-0">
                  <div className="font-bold text-sm">{c.name}</div>
                  <div className="text-xs opacity-50 font-mono">
                    {c.hex} &middot; {c.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-forest-green/5 space-y-3">
          <h3 className="font-bold uppercase tracking-widest text-sm opacity-40">Other assets</h3>
          <ul className="text-sm opacity-70 space-y-2">
            <li>
              <a href="/og-image.jpg" className="text-terracotta hover:underline" download>
                og-image.jpg
              </a>{' '}
              &middot; 1200&times;630, the social share and link preview card.
            </li>
            <li>
              <a href="/favicon.png" className="text-terracotta hover:underline" download>
                favicon.png
              </a>{' '}
              &middot; 256&times;256, the browser tab icon.
            </li>
            <li>
              <a href="/apple-touch-icon.png" className="text-terracotta hover:underline" download>
                apple-touch-icon.png
              </a>{' '}
              &middot; 180&times;180, the iOS home screen icon.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
