import { useState, useEffect, useRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  ArrowRight,
  Zap,
  Rocket,
  Code,
  Cpu,
  Users,
  ChevronLeft,
  ChevronRight,
  Hammer,
  BookOpen,
  Layout,
  BarChart,
  MessageSquare,
  Eye,
  Flame
} from 'lucide-react';

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 md:gap-8 justify-center items-center py-8">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds }
      ].map((item) => (
        <div key={item.label} className="text-center">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl md:text-6xl font-display font-extrabold text-terracotta tabular-nums"
          >
            {String(item.value).padStart(2, '0')}
          </motion.div>
          <div className="text-xs md:text-sm uppercase tracking-widest font-semibold opacity-60 mt-1">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-forest-green/10 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <h3 className="text-xl font-bold group-hover:text-terracotta transition-colors">{question}</h3>
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
            <div className="pt-4 pb-2 text-forest-green/80 leading-relaxed text-lg">
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
      className={`py-24 px-6 relative ${className}`}
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
  const sprintStartDate = "2026-03-25T09:00:00";
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cards = container.children;
    const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    for (let i = 0; i < cards.length; i++) {
      (cards[i] as HTMLElement).setAttribute('data-active', (i === closestIndex).toString());
    }
  };

  useEffect(() => {
    // Initial check
    handleScroll();
    
    // Add a small delay to ensure layout is stable
    const timer = setTimeout(handleScroll, 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToOffer = () => {
    document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [selectedImage, setSelectedImage] = useState<{ name: string, image: string } | null>(null);

  const headlineWords = "Stop Waiting. Start Building.".split(" ");

  return (
    <div className="min-h-screen selection:bg-terracotta selection:text-white bg-warm-cream text-forest-green overflow-x-hidden scroll-smooth">
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
            <button 
              onClick={scrollToOffer}
              className="bg-terracotta text-white px-4 md:px-6 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-burnt-orange hover:scale-105 transition-all shadow-lg shadow-terracotta/20 whitespace-nowrap"
            >
              <span className="sm:hidden">Join Now</span>
              <span className="hidden sm:inline">Secure Lifetime Access</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <GrainOverlay />
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block bg-sand px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-8">
              Founding Lifetime Access. Sprint Starts 25 March.
            </div>
            
            <h1 className="text-6xl md:text-9xl font-display font-extrabold leading-[0.85] mb-10 tracking-tighter">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                  className={`inline-block mr-4 last:mr-0 ${i >= 2 ? 'text-terracotta' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <p className="text-xl md:text-3xl font-medium max-w-3xl mx-auto mb-12 leading-relaxed opacity-90">
              Stop outsourcing. Start building. Join the Vibe Coding Lab and build your own AI-powered Founder Co-Pilot in 3 days using no-code tools, with direct support from Toni. Lifetime access for £97.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
              <button 
                onClick={scrollToOffer}
                className="w-full md:w-auto bg-terracotta text-white px-8 md:px-12 py-5 md:py-6 rounded-2xl text-xl md:text-2xl font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-terracotta/30"
              >
                Secure Lifetime Access £97 <ArrowRight />
              </button>
            </div>

            <div className="pt-8 border-t border-forest-green/5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4 opacity-60">Sprint starts 25 March</p>
              <CountdownTimer targetDate={sprintStartDate} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section: Future */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-7xl font-display font-extrabold mb-12 leading-tight">
            You Already Know This Is the Future.
          </h2>
          <div className="space-y-8 text-xl md:text-2xl leading-relaxed opacity-80">
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
      <Section className="bg-warm-cream">
        <GrainOverlay />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-7xl font-display font-extrabold mb-12 leading-tight">
            The Builders Are Not Smarter Than You. <span className="text-terracotta">They Just Started.</span>
          </h2>
          <div className="space-y-8 text-xl md:text-2xl leading-relaxed opacity-80">
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
      <Section className="bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-sand rounded-[3rem] rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <img 
              src="https://ascendz.co/wp-content/uploads/2026/03/Toni-Martin-The-Vibe-Coding-Lab.jpg" 
              alt="Toni Martin" 
              className="relative rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 w-full aspect-[4/5] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl md:text-7xl font-display font-extrabold leading-tight">
              Behind The Vibe <span className="text-terracotta">Coding</span> Lab.
            </h2>
            <div className="space-y-6 text-xl leading-relaxed opacity-80">
              <p className="font-bold text-terracotta">
                Built by Toni Martin, Digital Growth Architect and AI Consultant.
              </p>
              <p>
                I build real AI-powered SaaS products using no-code AI tools. Not as a side project. As actual client work, deployed and in use right now.
              </p>
              <p>
                Relay is my AI assistant builder. Insights is my diagnostic and quiz platform. Both built using the exact method I am teaching inside The Vibe Coding Lab.
              </p>
              <p>
                I build in public. I share every step. And inside this community you get to build alongside me.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section: What You Get */}
      <Section className="bg-warm-cream overflow-hidden">
        <GrainOverlay />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <h2 className="text-4xl md:text-7xl font-display font-extrabold mb-16 text-center leading-tight">
            Everything You Need to Go From Idea to Builder.
          </h2>
          
          <div className="relative group">
            {/* Navigation Arrows */}
            <button 
              onClick={() => {
                const container = document.getElementById('scroll-container');
                if (container) container.scrollBy({ left: -424, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 w-12 h-12 rounded-full bg-white border border-forest-green/10 shadow-lg flex items-center justify-center text-forest-green hover:bg-forest-green hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => {
                const container = document.getElementById('scroll-container');
                if (container) container.scrollBy({ left: 424, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 w-12 h-12 rounded-full bg-white border border-forest-green/10 shadow-lg flex items-center justify-center text-forest-green hover:bg-forest-green hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>

            <div 
              id="scroll-container"
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-12 gap-6 snap-x no-scrollbar px-[10vw] md:px-[calc(50%-200px)]"
              onScroll={handleScroll}
            >
              {[
                { 
                  title: "Live Vibe Coding Sprint", 
                  desc: "25 to 27 March. Build your first AI-powered project with Toni live. Ship something real.",
                  features: ["Daily building prompts", "Live Q&A sessions"],
                  icon: <Hammer size={28} />,
                },
                { 
                  title: "Vibe Coding 101", 
                  desc: "The complete starter course covering tools, prompting, building and deploying.",
                  features: ["Full library of tutorials", "Step-by-step guides"],
                  icon: <BookOpen size={28} />,
                },
                { 
                  title: "Access to Relay", 
                  desc: "My AI assistant builder. Use it, study it, get inspired by it.",
                  features: ["AI Assistant Builder", "Visual logic editor"],
                  icon: <Layout size={28} />,
                },
                { 
                  title: "Access to Insights", 
                  desc: "My diagnostic and quiz platform. Yours to use from day one.",
                  features: ["Diagnostic Platform", "Quiz builder"],
                  icon: <BarChart size={28} />,
                },
                { 
                  title: "Direct Support from Toni", 
                  desc: "Ask questions, get unstuck, keep moving. Direct access for troubleshooting.",
                  features: ["Direct Skool community access", "Personal feedback"],
                  icon: <MessageSquare size={28} />,
                },
                { 
                  title: "Behind the Scenes", 
                  desc: "Every new app, every new tool, every new method. You get it all as I build it.",
                  features: ["Build-in-public updates", "Early tool access"],
                  icon: <Eye size={28} />,
                },
                { 
                  title: "Lifetime Community Access", 
                  desc: "Every session recorded. Learn at your pace, build on your schedule.",
                  features: ["Recorded session library", "Lifetime membership"],
                  icon: <Flame size={28} />,
                }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  data-active="false"
                  className="flex-none w-[300px] md:w-[400px] snap-center p-8 md:p-10 rounded-[2.5rem] border border-forest-green/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col gap-8 bg-white text-forest-green data-[active=true]:bg-forest-green data-[active=true]:text-white group/card"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-terracotta/5 group-data-[active=true]/card:bg-white/10 text-terracotta group-data-[active=true]/card:text-white transition-colors">
                    {card.icon}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-display font-bold leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-lg leading-relaxed opacity-80">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-auto space-y-3">
                    {card.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <Zap size={16} className="text-terracotta group-data-[active=true]/card:text-white shrink-0" fill="currentColor" />
                        <span className="text-sm md:text-base font-semibold opacity-90">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2, 3, 4, 5, 6].map((dot) => (
              <div key={dot} className="w-2 h-2 rounded-full bg-forest-green/20" />
            ))}
          </div>
        </div>
      </Section>

      {/* Section: Proof */}
      <Section className="bg-forest-green text-warm-cream">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-display font-extrabold mb-12 text-center leading-tight">
            Proof Over Hype.
          </h2>
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-6 text-xl md:text-2xl opacity-80">
            <p>
              I do not teach things I have not done.
            </p>
            <p>
              Relay and Insights are not mock-ups or demos. They are fully functional SaaS products built using the same no-code AI tools you will use inside the sprint.
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
                name: "Relay", 
                image: "https://ascendz.co/wp-content/uploads/2026/03/Relay-Assistant-Set-Up-scaled.png" 
              },
              { 
                name: "Insights", 
                image: "https://ascendz.co/wp-content/uploads/2026/03/Insights-Results-Page-scaled.png" 
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
                  <p className="opacity-60 font-bold uppercase tracking-widest text-sm">Deployed SaaS Product — Click to Expand</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section: Pricing */}
      <Section id="offer" className="bg-warm-cream overflow-hidden">
        <GrainOverlay />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            animate={{ 
              boxShadow: ["0 0 0px rgba(242, 125, 38, 0)", "0 0 50px rgba(242, 125, 38, 0.15)", "0 0 0px rgba(242, 125, 38, 0)"] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-white p-12 md:p-20 rounded-[4rem] border border-forest-green/5 shadow-2xl relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-8 leading-tight">
              One Price. No Subscriptions. No Upsells.
            </h2>

            <div className="text-5xl md:text-7xl font-display font-black text-terracotta mb-6">
              £97
            </div>
            <p className="text-lg font-bold uppercase tracking-[0.2em] mb-12 opacity-60">founding lifetime access</p>

            <div className="max-w-2xl mx-auto text-left mb-16 space-y-6 text-xl md:text-2xl opacity-80">
              <p>
                This price exists because you are joining at the very beginning. It will not be available once the sprint closes. Everyone who joins after pays more. Probably significantly more.
              </p>
              
              <ul className="flex flex-col gap-4 pt-8 max-w-md mx-auto">
                {[
                  "Live sprint, 25 to 27 March",
                  "Vibe Coding 101",
                  "Relay access",
                  "Insights access",
                  "Direct support from Toni",
                  "Lifetime community access",
                  "Every future build and tool"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 font-bold text-lg">
                    <Zap size={20} className="text-terracotta shrink-0" fill="currentColor" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <p className="text-xl font-bold">All of it. Forever. £97.</p>
              <a
                href="https://store.ascendz.co/vibecodinglab-founders/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-terracotta text-white px-8 md:px-10 py-5 md:py-6 rounded-3xl text-lg md:text-2xl font-extrabold hover:bg-burnt-orange hover:scale-[1.02] transition-all shadow-2xl shadow-terracotta/30 text-center"
              >
                I'm Ready. Secure My Lifetime Access for £97.
              </a>
              <p className="text-sm font-medium opacity-50 text-center pt-2">
                Prefer to start smaller?{' '}
                <a
                  href="https://www.skool.com/vibecodinglab/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Join on the monthly plan for £35/$47
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Section: FAQ */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-display font-extrabold mb-16 text-center leading-tight">
            Still on the Fence? Let's Sort That.
          </h2>
          <div className="space-y-2">
            <FAQItem 
              question="I have never built anything technical before." 
              answer="Good. You are not learning to code. You are learning to direct AI to build for you. If you can describe what you want in plain English you can build with these tools."
            />
            <FAQItem 
              question="I do not know what to build." 
              answer={
                <>
                  That is exactly what the free <Link to="/app-idea" className="text-terracotta underline font-bold hover:text-burnt-orange transition-colors">App Idea Generator</Link> is for. Use it before you join and you will arrive on day one with a clear idea ready to go.
                </>
              }
            />
            <FAQItem 
              question="I do not have time." 
              answer="The sprint runs over three days. You can ship your first project in a couple of hours. This is not a commitment, it is a fast start."
            />
            <FAQItem 
              question="Will this still be relevant in six months?" 
              answer="Vibe coding is not a trend. It is a fundamental shift in how software gets built. The method works across web pages, tools, apps, automations and everything being built right now. The Vibe Coding Lab evolves as the space evolves. Your lifetime access means you are always inside."
            />
          </div>
        </div>
      </Section>

      {/* Section: Final CTA */}
      <Section className="bg-terracotta text-white text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-8xl font-display font-extrabold mb-12 leading-[0.9] tracking-tighter">
            The Price of Ideas Without Action Is Always the Same.
          </h2>
          <div className="text-2xl md:text-3xl font-medium mb-12 opacity-90 leading-relaxed space-y-6 max-w-3xl mx-auto">
            <p>You have had the idea. You just did not have the tools, the method or the budget to make it real.</p>
            <p className="font-bold">That excuse no longer exists.</p>
            <p>AI and no-code tools have made building genuinely accessible for the first time. You do not need a technical co-founder. You do not need tens of thousands of pounds. You do not need to wait for anyone or anything.</p>
            <p>You need the right method, three days and the willingness to build.</p>
          </div>

          <div className="space-y-12">
            <div className="inline-block bg-white/10 px-8 py-3 rounded-full text-xl font-bold uppercase tracking-widest">
              The sprint starts 25 March.
            </div>

            <p className="text-2xl font-bold italic opacity-80">Founding lifetime access closes when it closes.</p>

            <button
              onClick={scrollToOffer}
              className="w-full md:w-auto bg-white text-terracotta px-12 md:px-16 py-6 md:py-8 rounded-3xl text-xl md:text-3xl font-extrabold hover:bg-warm-cream hover:scale-105 transition-all shadow-2xl"
            >
              I'm Ready. Let's Build.
            </button>
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
      <footer className="py-16 px-6 bg-warm-cream border-t border-forest-green/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="text-2xl font-display font-extrabold tracking-tighter mb-8">
            VIBE<span className="text-terracotta">CODING</span>LAB
          </div>
          <p className="text-lg font-bold opacity-60 max-w-2xl mx-auto leading-relaxed">
            All sessions recorded. Community access is lifetime. Sprint runs 25 to 27 March live via The Vibe Coding Lab on Skool.
          </p>
          <div className="mt-12 pt-12 border-t border-forest-green/5 text-sm font-bold uppercase tracking-widest opacity-30">
            © 2026 Vibe Coding Lab by Ascendz | All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
