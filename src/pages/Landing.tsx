import { useState, useEffect, useRef, ReactNode } from 'react';
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
  Eye
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
  const sprintStartDate = "2026-03-31T23:59:00";

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
              Lifetime Access. Offer Closes 31 March.
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
              The tools to build anything you can imagine now exist, are accessible to everyone and cost almost nothing to use. The only thing missing is knowing how. That is what we are here for.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
              <button 
                onClick={scrollToOffer}
                className="w-full md:w-auto bg-terracotta text-white px-8 md:px-12 py-5 md:py-6 rounded-2xl text-xl md:text-2xl font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-terracotta/30"
              >
                Join Vibe Coding Lab <ArrowRight />
              </button>
            </div>

            <div className="pt-8 border-t border-forest-green/5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4 opacity-60">Lifetime offer closes 31 March</p>
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
                I build real AI-powered SaaS products using no-code AI tools. Not as a side project. As fully functional, deployed products that demonstrate exactly what is possible with these tools.
              </p>
              <p>
                Relay is my AI assistant builder. Insights is my diagnostic and quiz platform. Both built using the exact method I am teaching inside the Vibe Coding Lab.
              </p>
              <p>
                I build in public. I share every step. Inside this community you build alongside me.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section: What You Get */}
      <Section className="bg-sand/30">
        <GrainOverlay />
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-7xl font-display font-extrabold mb-6 leading-tight">
              Everything You Need to Go From Idea to Builder.
            </h2>
            <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed">
              The Vibe Coding Lab gives you the skills, the tools, the community and the live experience to go from complete beginner to confident builder. Here is everything that is waiting for you inside.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "The Command Centre Sprint",
                desc: "Learn the skills behind vibe coding whilst building your own Personal AI Command Centre from scratch. Three live sessions with Toni's direct support, 25 to 27 March.",
                icon: <Hammer size={26} />,
                bg: "bg-forest-green text-white",
                iconBg: "bg-white/10 text-white",
              },
              {
                title: "A Growing Classroom",
                desc: "Courses, tools and resources that will have you vibing with ease. New content added regularly as the space evolves.",
                icon: <BookOpen size={26} />,
                bg: "bg-white text-forest-green",
                iconBg: "bg-terracotta/10 text-terracotta",
              },
              {
                title: "Access to Relay",
                desc: "My AI assistant builder. Use it, explore it and get inspired by what is possible when you build with no-code AI tools.",
                icon: <Layout size={26} />,
                bg: "bg-white text-forest-green",
                iconBg: "bg-terracotta/10 text-terracotta",
              },
              {
                title: "Access to Insights",
                desc: "My diagnostic and quiz platform. Yours to use from day one. Study it, use it, build something similar yourself.",
                icon: <BarChart size={26} />,
                bg: "bg-white text-forest-green",
                iconBg: "bg-terracotta/10 text-terracotta",
              },
              {
                title: "Direct Support from Toni",
                desc: "Ask questions, get unstuck and keep moving. Direct access inside the community throughout the sprint and beyond.",
                icon: <MessageSquare size={26} />,
                bg: "bg-terracotta text-white",
                iconBg: "bg-white/20 text-white",
              },
              {
                title: "Behind the Scenes",
                desc: "Every app and tool I build, you see the process as it happens. No gatekeeping on the journey.",
                icon: <Eye size={26} />,
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

      {/* Section: Not a Course */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-7xl font-display font-extrabold mb-12 leading-tight">
            The Command Centre Sprint Is Live Right Now.
          </h2>
          <div className="space-y-8 text-xl md:text-2xl leading-relaxed opacity-80 text-left max-w-3xl mx-auto">
            <p>
              Join today and you can jump straight in. The Command Centre Sprint is running live this week and every session is recorded. That means you can watch along as it happens, dip in and out around your schedule and access every replay the moment it goes up.
            </p>
            <p>
              Over three days we are building a fully functioning personal AI Command Centre from scratch. Your own bespoke platform that manages your tasks, drafts your content, tracks your finances and chats with your own knowledge base. Built by you. For you.
            </p>
            <p className="font-bold text-terracotta text-2xl md:text-3xl">
              You will not be starting from zero. You will be starting from today.
            </p>
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
                subtitle: "A SaaS tool for building AI chatbot assistants",
                image: "https://ascendz.co/wp-content/uploads/2026/03/Relay-Assistant-Set-Up-scaled.png"
              },
              {
                name: "Insights",
                subtitle: "A SaaS tool for creating quizzes and diagnostics with AI",
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
                  <p className="opacity-60 font-bold uppercase tracking-widest text-sm">{app.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section: Pricing */}
      <Section id="offer" className="bg-warm-cream overflow-hidden">
        <GrainOverlay />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-6 leading-tight">
            Two Ways In. One Community.
          </h2>
          <p className="text-xl md:text-2xl opacity-80 mb-10 leading-relaxed">
            Inside you get the same community, the same sprint, the same support and the same content whichever option you choose.
          </p>

          {/* Countdown */}
          <div className="bg-forest-green text-white rounded-3xl px-8 py-6 mb-10">
            <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">Lifetime access offer closes in</p>
            <CountdownTimer targetDate="2026-03-31T23:59:00" />
          </div>

          {/* Main card */}
          <motion.div
            animate={{
              boxShadow: ["0 0 0px rgba(194, 94, 68, 0)", "0 0 50px rgba(194, 94, 68, 0.15)", "0 0 0px rgba(194, 94, 68, 0)"]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-white rounded-[3rem] border border-forest-green/5 shadow-2xl overflow-hidden"
          >
            {/* Lifetime section */}
            <div className="p-10 md:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta mb-4">Lifetime Access</p>
              <div className="text-5xl md:text-7xl font-display font-black text-forest-green mb-2">£197</div>
              <p className="text-base font-semibold opacity-50 uppercase tracking-widest mb-8">one time</p>
              <p className="text-lg md:text-xl opacity-80 leading-relaxed mb-10 max-w-xl mx-auto">
                Join before 11:59pm 31 March and lock in lifetime access.
              </p>
              <ul className="flex flex-col gap-4 mb-10 text-left max-w-sm mx-auto">
                {[
                  "Command Centre Sprint replay, available immediately",
                  "Vibe Coding 101",
                  "Access to Relay",
                  "Access to Insights",
                  "Direct support from Toni",
                  "Lifetime community access",
                  "Every future build, tool and live sprint"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-base md:text-lg">
                    <Zap size={18} className="text-terracotta shrink-0" fill="currentColor" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://store.ascendz.co/vibecodinglab-founders/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-terracotta text-white px-8 py-5 md:py-6 rounded-2xl text-lg md:text-2xl font-extrabold hover:bg-burnt-orange hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-terracotta/30 text-center"
              >
                I'm Ready. Secure My Lifetime Access for £197.
              </a>
            </div>

            {/* Monthly section */}
            <div className="border-t border-forest-green/5 bg-sand/40 px-10 md:px-14 py-10">
              <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-3">Prefer to start monthly?</p>
              <div className="text-3xl md:text-4xl font-display font-black text-forest-green mb-1">£35<span className="text-xl font-bold opacity-60">/month</span></div>
              <p className="text-sm font-semibold opacity-40 uppercase tracking-widest mb-6">$47/month</p>
              <p className="text-base md:text-lg opacity-70 leading-relaxed mb-8 max-w-xl mx-auto">
                Full community access, all the same content and direct support from Toni. Cancel any time.
              </p>
              <a
                href="https://www.skool.com/vibecodinglab/about"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-forest-green text-white px-10 py-4 rounded-2xl text-base md:text-lg font-extrabold hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg text-center"
              >
                Join Monthly.
              </a>
            </div>
          </motion.div>

          <p className="text-sm font-semibold opacity-40 mt-8 uppercase tracking-widest">
            Lifetime access offer closes 11:59pm 31 March. All sessions recorded.
          </p>
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
              question="I do not have time."
              answer="The initial sprint is just three days and will teach you skills you can use for a lifetime. Your continued access to the community, resources and recordings means you can fit things around your schedule, so you never have to choose between building and life. Dip in, build something, come back when you are ready."
            />
            <FAQItem
              question="How much does it cost to use the tools?"
              answer="Most of the tools we use have generous free tiers. The main additional cost is AI API usage for the apps you build. A starting top-up of around £5 goes a long way. You are not looking at significant ongoing costs to get started."
            />
            <FAQItem
              question="What if I miss a live session?"
              answer="Every session is recorded and available inside the community. You will never miss anything permanently."
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
          <h2 className="text-5xl md:text-7xl font-display font-extrabold mb-12 leading-[0.9] tracking-tighter">
            The Price of Ideas Without Action Is Always the Same.
          </h2>
          <div className="text-xl md:text-2xl font-medium mb-12 opacity-90 leading-relaxed space-y-6 max-w-3xl mx-auto">
            <p>You have had the idea. You simply didn't have the tools, the method or the budget to make it real.</p>
            <p className="font-bold">That excuse no longer exists.</p>
            <p>AI and no-code tools have made building genuinely accessible for the first time. You do not need a technical co-founder. You do not need tens of thousands of pounds. You do not need to wait for anyone or anything.</p>
            <p>You need the right method, three days and the willingness to build.</p>
          </div>

          <div className="space-y-8">
            <button
              onClick={scrollToOffer}
              className="inline-block bg-white text-terracotta px-12 md:px-16 py-6 md:py-8 rounded-3xl text-xl md:text-3xl font-extrabold hover:bg-warm-cream hover:scale-105 transition-all shadow-2xl"
            >
              Join the Vibe Coding Lab.
            </button>
            <p className="text-base md:text-lg font-semibold opacity-70">
              Join before 11:59pm 31 March to lock in lifetime access.
            </p>
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
            Community access is lifetime. All sessions recorded. The Vibe Coding Lab is on Skool.
          </p>
          <div className="mt-12 pt-12 border-t border-forest-green/5 text-sm font-bold uppercase tracking-widest opacity-30">
            © 2026 Vibe Coding Lab by Ascendz | All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
