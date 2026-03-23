import { motion } from 'motion/react';

export default function Unsubscribe() {
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
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[560px]"
        >
          <div className="text-6xl mb-8">✓</div>

          <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-[1.1] mb-8 tracking-tight">
            You are all set.
          </h1>

          <div className="space-y-6 text-lg md:text-xl leading-relaxed opacity-80 mb-12">
            <p>
              You will not receive any more emails about the Vibe Coding Lab. You will still stay on the list for other updates, insights, tips and resources that could support your business.
            </p>
            <p>
              If you ever change your mind or want to explore the Vibe Coding Lab in the future, you will be more than welcome back.
            </p>
            <p>
              In the meantime, thanks for sticking around. I appreciate you.
            </p>
          </div>

          <div className="text-base opacity-50 leading-snug">
            <p className="font-bold">Toni</p>
            <p>Founder, Ascendz</p>
          </div>
        </motion.div>
      </div>

      <footer className="py-8 px-6 text-center opacity-40 text-xs font-bold uppercase tracking-widest">
        © 2026 Vibe Coding Lab by Ascendz | All Rights Reserved
      </footer>
    </div>
  );
}
