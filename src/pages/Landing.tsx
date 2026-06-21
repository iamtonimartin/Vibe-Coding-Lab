import { useState, useRef, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Plus,
  Minus,
  ArrowRight,
  Zap,
  Hammer,
  BookOpen,
  Layout,
  BarChart,
  MessageSquare,
  Eye,
  Play,
  Lightbulb,
  Gift,
  Trophy,
  Flame,
  Target,
  Clock
} from 'lucide-react';
import Footer from '../components/Footer';

const FAQItem = ({ question, answer }: { question: string, answer: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-forest-green/10 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <h3 className="text-base md:text-xl font-bold group-hover:text-terracotta transition-colors pr-4">{question}</h3>
        <div className="text-terracotta">
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 text-forest-green/80 leading-relaxed text-sm md:text-lg">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
      className={`py-14 md:py-24 px-4 md:px-6 relative ${className}`}
    >
      {children}
    </motion.section>
  );
};

const GrainOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

export default function Landing() {
  const [selectedImage, setSelectedImage] = useState<{ name: string, image: string } | null>(null);


  return (
    <div className="min-h-screen selection:bg-terracotta selection:text-white bg-warm-cream text-forest-green overflow-x-hidden scroll-smooth">
      <Helmet>
        <title>Vibe Coding Lab: Build AI-Powered Apps Without Code</title>
        <meta name="description" content="Free resources, tools and a growing community to help you build your first AI-powered app without writing code. Try it free for 7 days. Built by Toni Martin." />
        <link rel="canonical" href="https://thevibecodinglab.co/" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Toni Martin" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thevibecodinglab.co/" />
        <meta property="og:site_name" content="Vibe Coding Lab" />
        <meta property="og:title" content="Vibe Coding Lab: Build AI-Powered Apps Without Code" />
        <meta property="og:description" content="Free resources, tools and a growing community to help you build your first AI-powered app without writing code. Try it free for 7 days." />
        <meta property="og:image" content="https://ascendz.co/wp-content/uploads/2026/03/Toni-Martin-The-Vibe-Coding-Lab.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_GB" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vibe Coding Lab: Build AI-Powered Apps Without Code" />
        <meta name="twitter:description" content="Free resources, tools and a growing community to help you build your first AI-powered app without writing code. Try it free for 7 days." />
        <meta name="twitter:image" content="https://ascendz.co/wp-content/uploads/2026/03/Toni-Martin-The-Vibe-Coding-Lab.jpg" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://thevibecodinglab.co/#website",
              "url": "https://thevibecodinglab.co/",
              "name": "Vibe Coding Lab",
              "description": "Learn to build AI-powered apps without code. Free resources, community and live sessions.",
              "publisher": { "@id": "https://thevibecodinglab.co/#organization" }
            },
            {
              "@type": "Organization",
              "@id": "https://thevibecodinglab.co/#organization",
              "name": "Vibe Coding Lab",
              "url": "https://thevibecodinglab.co/",
              "logo": {
                "@type": "ImageObject",
                "url": "https://ascendz.co/wp-content/uploads/2026/03/Toni-Martin-The-Vibe-Coding-Lab.jpg"
              },
              "founder": {
                "@type": "Person",
                "name": "Toni Martin",
                "jobTitle": "Digital Growth Architect and AI Consultant"
              },
              "sameAs": ["https://www.skool.com/the-vibe-coding-lab-7172/about"]
            }
          ]
        })}</script>
      </Helmet>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-forest-green/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.name}
                className="w-full h-auto shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-terracotta transition-colors flex items-center gap-2 font-bold uppercase tracking-widest"
              >
                Close <Plus className="rotate-45" />
              </button>
              <div className="absolute -bottom-12 left-0 text-white font-display font-bold text-2xl">
                {selectedImage.name}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-warm-cream/80 backdrop-blur-md border-b border-forest-green/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="text-lg md:text-2xl font-display font-extrabold tracking-tighter shrink-0">
            VIBE<span className="text-terracotta">CODING</span>LAB
          </div>
          <div className="flex items-center gap-3 md:gap-8">
            <a
              href="#join"
              className="bg-terracotta text-white px-4 md:px-6 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-burnt-orange hover:scale-105 transition-all shadow-lg shadow-terracotta/20 whitespace-nowrap"
            >
              <span className="sm:hidden">Join Now</span>
              <span className="hidden sm:inline">Join the Community</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-14 md:pt-36 md:pb-20 px-4 md:px-6 relative">
        <GrainOverlay />
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block bg-sand px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
              Free resources + community membership
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-6 tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                className="block"
              >
                Build Your First AI App.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                className="block text-terracotta"
              >
                No Code. No Agency. No Excuses.
              </motion.span>
            </h1>

            <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed opacity-70">
              The tools to build anything you can imagine now exist, are accessible to everyone and cost almost nothing to use. The only thing missing is knowing how.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/resources"
                className="w-full sm:w-auto bg-terracotta text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-burnt-orange hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-terracotta/20"
              >
                Explore Free Resources <ArrowRight />
              </a>
              <a
                href="#join"
                className="w-full sm:w-auto border-2 border-forest-green text-forest-green px-8 py-4 rounded-xl text-base font-bold hover:bg-forest-green hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Join the Community <ArrowRight />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Free Resources teaser */}
      <Section id="resources" className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
            Start free
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight">
            Free resources to get you building.
          </h2>
          <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto leading-relaxed mb-10">
            No commitment required. A video series, an app idea generator and the Vibe Coding
            Playbook. All free.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              { Icon: Play, label: "Free video series" },
              { Icon: Lightbulb, label: "App idea generator" },
              { Icon: BookOpen, label: "The Vibe Coding Playbook" },
            ].map(({ Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 bg-sand text-forest-green text-sm font-bold px-4 py-2 rounded-full"
              >
                <Icon size={16} className="text-terracotta" /> {label}
              </span>
            ))}
          </div>

          <a
            href="/resources"
            className="inline-flex items-center gap-2 bg-terracotta text-white px-8 py-4 rounded-xl text-base font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-lg shadow-terracotta/20"
          >
            Explore all free resources <ArrowRight size={18} />
          </a>
        </div>
      </Section>

      {/* Section: Future */}
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-8 md:mb-12 leading-tight">
            You Already Know This Is the Future.
          </h2>
          <div className="space-y-6 text-base md:text-xl lg:text-2xl leading-relaxed opacity-80">
            <p>
              You have seen the screenshots. The tools. The people building products from their kitchen table that used to require a full development team and a five figure budget.
            </p>
            <p>
              You are not here because you are late. You are here because you are paying attention.
            </p>
            <p>
              The only thing standing between you and building is having the right method, the right tools and someone to show you exactly how it is done.
            </p>
            <p className="font-bold text-terracotta text-2xl md:text-3xl">
              That is what The Vibe Coding Lab is for.
            </p>
          </div>
        </div>
      </Section>

      {/* Section: Builders */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-8 md:mb-12 leading-tight">
            The Builders Are Not Smarter Than You. <span className="text-terracotta">They Just Started.</span>
          </h2>
          <div className="space-y-6 text-base md:text-xl lg:text-2xl leading-relaxed opacity-80">
            <p>
              Vibe coding is not a secret. It is not reserved for developers or technical people.
            </p>
            <p>
              It is a method. A process. A way of working with AI that turns ideas into real, deployed products without writing a single line of traditional code.
            </p>
            <p>
              Anyone can learn it. Most people just have not been shown how yet.
            </p>
            <p className="font-bold text-terracotta text-2xl md:text-3xl">
              You are about to be shown.
            </p>
          </div>
        </div>
      </Section>

      {/* Section: Meet Toni */}
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-sand rounded-[3rem] rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <img
              src="https://ascendz.co/wp-content/uploads/2026/03/Toni-Martin-The-Vibe-Coding-Lab.jpg"
              alt="Toni Martin, founder of Vibe Coding Lab, Digital Growth Architect and AI Consultant"
              className="relative rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 w-full aspect-[4/5] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
              Behind The Vibe <span className="text-terracotta">Coding</span> Lab.
            </h2>
            <div className="space-y-5 text-base md:text-xl leading-relaxed opacity-80">
              <p className="font-bold text-terracotta">
                Built by Toni Martin, Digital Growth Architect and AI Consultant.
              </p>
              <p>
                I build real AI-powered SaaS products using no-code AI tools. Not as a side project. As fully functional, deployed products that demonstrate exactly what is possible with these tools.
              </p>
              <p>
                Relavo is my AI assistant builder. Zenitro is my diagnostic and quiz platform. Both built using the exact method I am teaching inside the Vibe Coding Lab.
              </p>
              <p>
                I build in public. I share every step. Inside this community you build alongside me.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section: What's Inside the Community */}
      <Section className="bg-sand/30">
        <GrainOverlay />
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight">
              Everything Inside the Community.
            </h2>
            <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed">
              It's all included, one membership. Start with a 7-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "A Growing Classroom",
                desc: "Courses, tutorials and step-by-step resources that grow as the space evolves. New content added regularly.",
                icon: <BookOpen size={26} />,
                bg: "bg-forest-green text-white",
                iconBg: "bg-white/10 text-white",
              },
              {
                title: "Access to Relavo",
                desc: "Toni's AI assistant builder. Explore it, use it and get inspired by what is possible when you build with no-code AI tools.",
                icon: <Layout size={26} />,
                bg: "bg-white text-forest-green",
                iconBg: "bg-terracotta/10 text-terracotta",
              },
              {
                title: "Access to Zenitro",
                desc: "The diagnostic and quiz platform. Yours from day one. Study it, use it, build something similar yourself.",
                icon: <BarChart size={26} />,
                bg: "bg-white text-forest-green",
                iconBg: "bg-terracotta/10 text-terracotta",
              },
              {
                title: "Direct Support from Toni",
                desc: "Ask questions, get unstuck and keep moving. Direct access to Toni inside the community.",
                icon: <MessageSquare size={26} />,
                bg: "bg-terracotta text-white",
                iconBg: "bg-white/20 text-white",
              },
              {
                title: "Behind the Scenes",
                desc: "Every app and tool Toni builds, you see the process as it happens. No gatekeeping on the journey.",
                icon: <Eye size={26} />,
                bg: "bg-white text-forest-green",
                iconBg: "bg-terracotta/10 text-terracotta",
              },
              {
                title: "Live Build Sessions",
                desc: "Regular live building sessions where new tools and apps are built in real time alongside the community.",
                icon: <Hammer size={26} />,
                bg: "bg-white text-forest-green",
                iconBg: "bg-terracotta/10 text-terracotta",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col gap-6 ${card.bg}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  {card.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-display font-bold leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed opacity-80">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section: The Member App */}
      <Section className="bg-forest-green text-white overflow-hidden">
        <GrainOverlay />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-terracotta/20 border border-terracotta/40 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6">
              <Trophy size={12} className="text-terracotta" /> The member app
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-[1.05] mb-6 max-w-3xl mx-auto">
              Most people buy a course and never finish it.{' '}
              <span className="text-terracotta">We pay you to ship instead.</span>
            </h2>
            <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-3xl mx-auto">
              Inside the community you get the Build Journey: your dashboard that turns learning into
              real challenges, tracks every win and rewards you for actually doing the work. It is
              built to keep you moving from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10">
            {[
              {
                Icon: Target,
                title: "Real challenges, not lessons",
                body: "Every challenge is something you build and ship for real. Tick it off, earn the badge, move forward.",
              },
              {
                Icon: Gift,
                title: "We pay you to take action",
                body: "Hit milestones and win real prizes, like a £5 gift card you can spend on a Starbucks or whatever you fancy. Actual rewards for actual progress.",
              },
              {
                Icon: Flame,
                title: "Streaks that keep you showing up",
                body: "Log one thing a week and your streak grows. The build streak never resets, so showing up always counts.",
              },
              {
                Icon: Trophy,
                title: "Bonuses unlock as you go",
                body: "Each challenge you complete unlocks the next bonus. The more you do, the more you get.",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[1.75rem] p-7 md:p-8"
              >
                <div className="w-11 h-11 rounded-xl bg-terracotta/20 text-terracotta flex items-center justify-center mb-5">
                  <f.Icon size={22} strokeWidth={2.25} />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-extrabold mb-3">{f.title}</h3>
                <p className="text-sm md:text-base leading-relaxed opacity-80">{f.body}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm md:text-base font-bold opacity-80">
            Accountability built in, so the membership you join is the one you actually use.
          </p>
        </div>
      </Section>

      {/* Section: Proof */}
      <Section className="bg-forest-green text-warm-cream">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-12 text-center leading-tight">
            Proof Over Hype.
          </h2>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20 space-y-6 text-base md:text-xl lg:text-2xl opacity-80">
            <p>
              I do not teach things I have not done.
            </p>
            <p>
              Relavo and Zenitro are not mock-ups or demos. They are fully functional SaaS products built using the same no-code AI tools taught inside the community.
            </p>
            <p className="font-bold text-terracotta">
              Google AI Studio. Antigravity IDE. Claude Code.
            </p>
            <p>
              That is the stack. That is the method. That is what we are building with.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                name: "Relavo",
                subtitle: "A SaaS tool for building AI chatbot assistants",
                image: "/relavo-3.png"
              },
              {
                name: "Zenitro",
                subtitle: "A SaaS tool for creating quizzes and diagnostics with AI",
                image: "/zenitro-3.png"
              }
            ].map((app) => (
              <motion.div
                key={app.name}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedImage(app)}
                className="bg-white/5 p-4 rounded-t-2xl rounded-b-[2.5rem] border border-white/10 backdrop-blur-sm group cursor-zoom-in"
              >
                <div className="aspect-video bg-sand/20 rounded-t-xl overflow-hidden mb-8 relative">
                  <img
                    src={app.image}
                    alt={`${app.name} App Screenshot`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-forest-green/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white">
                      <Eye size={32} />
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="text-3xl font-display font-extrabold mb-2">{app.name}</h3>
                  <p className="opacity-60 font-bold uppercase tracking-widest text-sm">{app.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section: Your First 7 Days */}
      <Section className="bg-sand/30 overflow-hidden">
        <GrainOverlay />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-terracotta mb-4">
              <Clock size={14} /> Your first 7 days
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight mb-6">
              The trial isn't a tour. You ship something.
            </h2>
            <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-2xl mx-auto">
              Full access from minute one. Here's how a week inside looks.
            </p>
          </div>

          <div className="space-y-4 md:space-y-5 mb-12">
            {[
              {
                day: "Day 1",
                title: "Get in and get clear",
                body: "Join the community, meet other builders and earn your first badge by getting clear on what you're going to build.",
              },
              {
                day: "Days 2-3",
                title: "Zero to Deployed",
                body: "Follow the guided workflow from idea to brief to design to deployment. Build alongside me or run with your own idea.",
              },
              {
                day: "By day 5",
                title: "Ship something real",
                body: "Get your first app or site live on the internet, drop the URL in the community and claim your first reward.",
              },
              {
                day: "Day 7",
                title: "Decide",
                body: "Love it? Stay for $67/month, everything included. Not for you? Cancel in two clicks before the trial ends and you won't be charged.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.day}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white border border-forest-green/10 rounded-2xl p-5 md:p-7 flex items-start gap-4 md:gap-6"
              >
                <div className="shrink-0 text-xs md:text-sm font-black uppercase tracking-widest text-terracotta w-16 md:w-24 pt-1">
                  {step.day}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-2xl font-display font-extrabold leading-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed opacity-80">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm md:text-base opacity-70 max-w-2xl mx-auto">
            You add a card to start the trial and get full access for 7 days. Cancel any time before
            day 7 and you won't be charged. No long contracts, cancel whenever after that too.
          </p>
        </div>
      </Section>

      {/* Section: Join the Community */}
      <Section id="join" className="bg-warm-cream overflow-hidden">
        <GrainOverlay />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-4 leading-tight">
              Join the Community. Build Something Real.
            </h2>
            <p className="text-lg md:text-xl opacity-70 leading-relaxed">
              Everything included for one price. Start with a 7-day free trial, cancel any time.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              animate={{
                boxShadow: ["0 0 0px rgba(194, 94, 68, 0)", "0 0 40px rgba(194, 94, 68, 0.15)", "0 0 0px rgba(194, 94, 68, 0)"]
              }}
              className="bg-forest-green text-white rounded-[2rem] shadow-2xl flex flex-col p-8 md:p-10 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-terracotta text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                7-day free trial
              </div>
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Membership</p>
                <div className="text-5xl font-display font-black">$67<span className="text-base font-bold opacity-50">/month</span></div>
                <p className="text-sm font-medium opacity-70 mt-3">Everything included. Start with a 7-day free trial, cancel any time.</p>
              </div>
              <ul className="flex flex-col gap-3 flex-1 mb-8">
                {[
                  "Join a growing community of founders building with AI",
                  "Vibe Coding 101: your foundation course for building AI apps without code",
                  "Zero to Deployed: build and deploy your first AI-powered app, from idea to live",
                  "Vibe Lab: hands-on training for Antigravity, Claude Code and more",
                  "Vibe Tribe: weekly co-working session, drop in and build alongside the community",
                  "Stuck? Let's Fix It: weekly support for your blockers, bugs and automations",
                  "Build Showcase: monthly call where members share what they have been building",
                  "Access to all Vibed Apps including Relavo and every future tool we build",
                  "Monthly members-only session",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-snug">
                    <Zap size={14} className="text-terracotta shrink-0 mt-0.5" fill="currentColor" />
                    <span className="opacity-80">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://www.skool.com/the-vibe-coding-lab-7172/about"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-terracotta text-white px-6 py-3 rounded-xl text-sm font-extrabold hover:bg-burnt-orange transition-all text-center shadow-lg shadow-terracotta/30"
              >
                Start your 7-day free trial →
              </a>
            </motion.div>
          </div>

          <p className="text-center mt-8 text-sm opacity-50 font-medium">
            Card required to start. Cancel before day 7 and you won't be charged. $67/month after that, cancel any time.
          </p>
        </div>
      </Section>

      {/* Section: FAQ */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-10 md:mb-16 text-center leading-tight">
            Still on the Fence? Let's Sort That.
          </h2>
          <div className="space-y-2">
            <FAQItem
              question="I have never built anything technical before."
              answer="Good. You are not learning to code. You are learning to direct AI to build for you. If you can describe what you want in plain English you can build with these tools."
            />
            <FAQItem
              question="I do not have time."
              answer="The resources are self-paced and the community is always on. Dip in, build something, come back when you are ready."
            />
            <FAQItem
              question="How much does it cost to use the tools?"
              answer="Most of the tools we use have generous free tiers. The main additional cost is AI API usage for the apps you build. A starting top-up of around £5 goes a long way. You are not looking at significant ongoing costs to get started."
            />
            <FAQItem
              question="What if I miss a live session?"
              answer="Every live session is recorded and available inside the community. You will never miss anything permanently."
            />
            <FAQItem
              question="Will this still be relevant in six months?"
              answer="Vibe coding is not a trend. It is a fundamental shift in how software gets built. The method works across web pages, tools, apps, automations and everything being built right now. The Vibe Coding Lab evolves as the space evolves and so will you."
            />
          </div>
        </div>
      </Section>

      {/* Section: Final CTA */}
      <Section className="bg-terracotta text-white text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-8 md:mb-12 leading-tight tracking-tight">
            The Price of Ideas Without Action Is Always the Same.
          </h2>
          <div className="text-base md:text-xl lg:text-2xl font-medium mb-10 md:mb-12 opacity-90 leading-relaxed space-y-5 max-w-3xl mx-auto">
            <p>You have had the idea. You simply didn't have the tools, the method or the budget to make it real.</p>
            <p className="font-bold">That excuse no longer exists.</p>
            <p>AI and no-code tools have made building genuinely accessible for the first time. You do not need a technical co-founder. You do not need tens of thousands of pounds. You do not need to wait for anyone or anything.</p>
            <p>You need the right method, the right community and the willingness to start.</p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#join"
                className="inline-block bg-white text-terracotta px-10 py-5 rounded-2xl text-lg md:text-xl font-extrabold hover:bg-warm-cream hover:scale-105 transition-all shadow-2xl"
              >
                Start your 7-day free trial →
              </a>
              <a
                href="#join"
                className="inline-block border-2 border-white/40 text-white px-10 py-5 rounded-2xl text-lg md:text-xl font-extrabold hover:bg-white/10 transition-all"
              >
                See what's included →
              </a>
            </div>
          </div>
        </div>

        {/* Background Decorative Element */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-64 -right-64 w-[600px] h-[600px] border-[40px] border-white/5 rounded-full pointer-events-none"
        />
      </Section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
