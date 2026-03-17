import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

type Idea = {
  name: string;
  description: string;
  monetisation: string;
  industry: string;
  toolType: string;
};

const ideas: Idea[] = [
  {
    name: 'Goal Tracker and Accountability Dashboard',
    description: 'Clients log weekly progress against their goals, the AI analyses patterns and generates a personalised coaching prompt for their next session. Coaches sell access at £37/month per client or bundle into their programme as a premium add-on.',
    monetisation: '£37/month per client',
    industry: 'Business and Executive Coaching',
    toolType: 'Generator',
  },
  {
    name: '360 Feedback Analyser',
    description: 'Leaders paste in feedback from their team, peers and managers and the tool identifies themes, blind spots and development priorities in seconds. Sell to HR teams and leadership coaches at £97 per report or £197/month for unlimited use.',
    monetisation: '£97 per report or £197/month',
    industry: 'Business and Executive Coaching',
    toolType: 'Analyser',
  },
  {
    name: 'Session Prep Generator',
    description: 'Clients answer five questions before each coaching session and the tool generates a structured agenda, key focus areas and suggested breakthroughs. Package into existing coaching programmes or sell as a standalone tool at £47/month.',
    monetisation: '£47/month',
    industry: 'Business and Executive Coaching',
    toolType: 'Generator',
  },
  {
    name: 'Leadership Style Diagnostic',
    description: 'A fifteen question assessment that identifies leadership style, communication preferences and development opportunities. Generates a personalised report with specific recommendations. Sell as a lead magnet or charge £67 per report.',
    monetisation: '£67 per report',
    industry: 'Business and Executive Coaching',
    toolType: 'Diagnostic',
  },
  {
    name: 'Business Decision Framework',
    description: 'Leaders describe a decision they are facing and the tool guides them through a structured thinking process, surfaces blind spots and generates a clear recommendation. £97/month for executive teams.',
    monetisation: '£97/month',
    industry: 'Business and Executive Coaching',
    toolType: 'Generator',
  },
  {
    name: 'Media Monitoring and Opportunity Tracker',
    description: 'Monitors keywords, publications and journalists relevant to your niche. Surfaces press opportunities, podcast appearances and speaking slots in real time. Sell to coaches and consultants at £47/month who want visibility without hiring a PR agency.',
    monetisation: '£47/month',
    industry: 'PR and Visibility',
    toolType: 'Dashboard',
  },
  {
    name: 'Pitch Generator',
    description: 'Users input their story, expertise and target media outlet and the tool generates a personalised media pitch in seconds. £47/month for unlimited pitches or sell as a one-time tool at £97.',
    monetisation: '£47/month or £97 one time',
    industry: 'PR and Visibility',
    toolType: 'Generator',
  },
  {
    name: 'PR ROI Dashboard',
    description: 'Tracks media mentions, audience reach, website traffic from coverage and lead generation from PR activity. Gives consultants and coaches a clear picture of what their visibility is actually generating. £67/month for small businesses.',
    monetisation: '£67/month',
    industry: 'PR and Visibility',
    toolType: 'Dashboard',
  },
  {
    name: 'Thought Leadership Content Planner',
    description: 'Based on their expertise and target publications, generates a 90 day content and PR calendar with specific article ideas, podcast topics and speaking angles. £47/month or include in a visibility programme.',
    monetisation: '£47/month',
    industry: 'PR and Visibility',
    toolType: 'Planner',
  },
  {
    name: 'Bio and Profile Generator',
    description: 'Users answer ten questions about their background, expertise and positioning and the tool generates a professional bio in multiple formats: short, long, speaker profile and social media. One-time purchase at £47 or bundle into a personal branding programme.',
    monetisation: '£47 one time',
    industry: 'PR and Visibility',
    toolType: 'Generator',
  },
  {
    name: 'Cash Flow Forecaster',
    description: 'Business owners input their revenue and expenses and the tool generates a 90 day cash flow forecast with alerts for potential shortfalls and recommendations for improving position. £47/month for small businesses.',
    monetisation: '£47/month',
    industry: 'Finance and Wealth',
    toolType: 'Dashboard',
  },
  {
    name: 'Financial Health Diagnostic',
    description: 'A twenty question assessment that evaluates financial literacy, business financial health and personal wealth position. Generates a personalised report with prioritised recommendations. Sell to financial coaches at £97 per report.',
    monetisation: '£97 per report',
    industry: 'Finance and Wealth',
    toolType: 'Diagnostic',
  },
  {
    name: 'Invoice and Proposal Generator',
    description: 'Users describe the project scope and the tool generates a professional proposal with pricing tiers, payment terms and scope of work. £27/month for freelancers and consultants.',
    monetisation: '£27/month',
    industry: 'Finance and Wealth',
    toolType: 'Generator',
  },
  {
    name: 'Pricing Strategy Tool',
    description: 'Business owners input their costs, market position and ideal client profile and the tool generates a recommended pricing strategy with rationale. £97 one time purchase or £47/month for ongoing access.',
    monetisation: '£47/month or £97 one time',
    industry: 'Finance and Wealth',
    toolType: 'Calculator',
  },
  {
    name: 'Tax Preparation Assistant',
    description: 'Guides small business owners through organising their financial records, categorising expenses and preparing for their accountant. Reduces accountant fees and saves hours of admin. £47/month.',
    monetisation: '£47/month',
    industry: 'Finance and Wealth',
    toolType: 'Planner',
  },
  {
    name: 'Symptom and Wellness Journal',
    description: 'Clients log daily symptoms, energy levels, sleep and mood and the AI identifies patterns and generates insights to share with their practitioner. Wellness coaches sell access at £37/month per client.',
    monetisation: '£37/month per client',
    industry: 'Health and Wellness',
    toolType: 'Tracker',
  },
  {
    name: 'Personalised Nutrition Planner',
    description: 'Users input their health goals, dietary preferences and any restrictions and the tool generates a weekly meal plan with shopping list and prep guide. £27/month or bundle into a nutrition programme.',
    monetisation: '£27/month',
    industry: 'Health and Wellness',
    toolType: 'Planner',
  },
  {
    name: 'Mindset and Habit Tracker',
    description: 'Clients set intentions, log daily habits and the AI generates weekly reflections and personalised nudges based on their patterns. Health coaches include in their programmes or sell standalone at £27/month.',
    monetisation: '£27/month',
    industry: 'Health and Wellness',
    toolType: 'Tracker',
  },
  {
    name: 'Corporate Wellness Diagnostic',
    description: 'A team assessment tool that measures stress levels, work-life balance, energy and engagement across an organisation. Generates a report with recommendations for HR teams. £497 per company assessment.',
    monetisation: '£497 per assessment',
    industry: 'Health and Wellness',
    toolType: 'Diagnostic',
  },
  {
    name: 'Recovery and Performance Optimiser',
    description: 'Athletes and high performers log training, sleep, nutrition and stress and the tool generates personalised recovery recommendations. Sell to personal trainers and performance coaches at £37/month per client.',
    monetisation: '£37/month per client',
    industry: 'Health and Wellness',
    toolType: 'Planner',
  },
  {
    name: 'AI Readiness Assessment',
    description: 'A diagnostic tool that evaluates how ready a business is to adopt AI across their operations. Generates a personalised report with a prioritised implementation roadmap. Sell to businesses at £197 per assessment or use as a lead magnet for consulting engagements.',
    monetisation: '£197 per assessment',
    industry: 'AI Consulting',
    toolType: 'Diagnostic',
  },
  {
    name: 'Prompt Library Builder',
    description: 'Users describe their business and the tool generates a custom library of prompts for their most common tasks, including content creation, client communications and internal processes. £97 one time or £47/month for ongoing updates.',
    monetisation: '£47/month or £97 one time',
    industry: 'AI Consulting',
    toolType: 'Generator',
  },
  {
    name: 'AI Tool Stack Recommender',
    description: 'Users answer questions about their business size, budget and goals and the tool recommends the ideal AI tool stack with implementation priorities and estimated ROI. Use as a lead magnet or sell as a standalone tool at £47.',
    monetisation: '£47 one time',
    industry: 'AI Consulting',
    toolType: 'Generator',
  },
  {
    name: 'AI Policy Generator',
    description: 'Businesses input their industry, team size and AI use cases and the tool generates a bespoke AI usage policy covering data privacy, ethical use and governance. £197 per policy for SMEs.',
    monetisation: '£197 per policy',
    industry: 'AI Consulting',
    toolType: 'Generator',
  },
  {
    name: 'ROI Calculator for AI Implementation',
    description: 'Businesses input their current processes, team size and time spent on manual tasks and the tool calculates the potential ROI of AI implementation. Use as a sales tool for consulting or sell access at £97.',
    monetisation: '£97 one time',
    industry: 'AI Consulting',
    toolType: 'Calculator',
  },
  {
    name: 'Content Repurposing Engine',
    description: 'Users paste in a long-form piece of content and the tool generates social media posts, email newsletters, short form video scripts and blog summaries in their brand voice. £47/month for content creators and marketers.',
    monetisation: '£47/month',
    industry: 'Marketing and Content',
    toolType: 'Generator',
  },
  {
    name: 'Audience Research Tool',
    description: 'Users describe their ideal client and the tool generates detailed audience insights, pain points, objections, desires and content angles. £97 one time or £37/month for ongoing research.',
    monetisation: '£37/month or £97 one time',
    industry: 'Marketing and Content',
    toolType: 'Analyser',
  },
  {
    name: 'Campaign Idea Generator',
    description: 'Marketers input their product, audience and goal and the tool generates five fully formed campaign concepts with messaging, channels and content ideas. £47/month for marketing teams.',
    monetisation: '£47/month',
    industry: 'Marketing and Content',
    toolType: 'Generator',
  },
  {
    name: 'Brand Voice Analyser',
    description: 'Users paste in existing content and the tool analyses their brand voice, identifies inconsistencies and generates a brand voice guide they can share with their team or AI tools. £97 one time purchase.',
    monetisation: '£97 one time',
    industry: 'Marketing and Content',
    toolType: 'Analyser',
  },
  {
    name: 'Email Sequence Builder',
    description: 'Users describe their offer, audience and goal and the tool generates a complete email sequence with subject lines, preview text and body copy. £47/month for coaches, consultants and course creators.',
    monetisation: '£47/month',
    industry: 'Marketing and Content',
    toolType: 'Generator',
  },
  {
    name: 'Contract Review Assistant',
    description: 'Users paste in a contract and the tool highlights key clauses, potential risks and areas to negotiate. Designed for freelancers and small businesses who cannot afford a lawyer for every contract. £47/month.',
    monetisation: '£47/month',
    industry: 'Legal and Compliance',
    toolType: 'Analyser',
  },
  {
    name: 'GDPR Compliance Checker',
    description: 'Businesses input their data collection and processing activities and the tool assesses compliance gaps and generates recommendations. £197 per audit for small businesses.',
    monetisation: '£197 per audit',
    industry: 'Legal and Compliance',
    toolType: 'Diagnostic',
  },
  {
    name: 'Terms and Conditions Generator',
    description: 'Users answer questions about their business and the tool generates a bespoke terms and conditions document. £97 one time or bundle into a legal toolkit at £197.',
    monetisation: '£97 one time',
    industry: 'Legal and Compliance',
    toolType: 'Generator',
  },
  {
    name: 'Employment Policy Generator',
    description: 'Small businesses input their team size, working arrangements and industry and the tool generates essential HR policies. £297 for a full policy suite.',
    monetisation: '£297 one time',
    industry: 'Legal and Compliance',
    toolType: 'Generator',
  },
  {
    name: 'Intellectual Property Audit Tool',
    description: 'Businesses identify their IP assets and the tool assesses protection gaps and generates recommendations for securing their intellectual property. £197 per audit.',
    monetisation: '£197 per audit',
    industry: 'Legal and Compliance',
    toolType: 'Diagnostic',
  },
  {
    name: 'SOP Generator',
    description: 'Users describe a process in plain English and the tool generates a formatted standard operating procedure with steps, responsibilities and quality checks. £47/month for operations teams.',
    monetisation: '£47/month',
    industry: 'Operations and Productivity',
    toolType: 'Generator',
  },
  {
    name: 'Meeting Summariser and Action Tracker',
    description: 'Users paste in meeting notes or a transcript and the tool generates a clean summary, action items with owners and deadlines and a follow up email. £27/month per user.',
    monetisation: '£27/month',
    industry: 'Operations and Productivity',
    toolType: 'Analyser',
  },
  {
    name: 'Client Onboarding Assistant',
    description: 'New clients answer a series of questions and the tool generates a personalised onboarding plan, welcome pack and first session agenda. Service businesses sell this as a premium onboarding experience at £97 per client.',
    monetisation: '£97 per client',
    industry: 'Operations and Productivity',
    toolType: 'Generator',
  },
  {
    name: 'Project Scope Builder',
    description: 'Users describe a project brief and the tool generates a full scope of work with deliverables, timeline, milestones and payment schedule. £47/month for agencies and consultants.',
    monetisation: '£47/month',
    industry: 'Operations and Productivity',
    toolType: 'Generator',
  },
  {
    name: 'Delegation and Hiring Assistant',
    description: 'Business owners input their current workload and the tool identifies which tasks to delegate, what role to hire for first and generates a job description. £97 one time or use as a lead magnet for operations consultants.',
    monetisation: '£97 one time',
    industry: 'Operations and Productivity',
    toolType: 'Generator',
  },
  {
    name: 'Course Curriculum Generator',
    description: 'Educators input their topic, audience and learning outcomes and the tool generates a full course curriculum with module breakdowns, lesson plans and assessment ideas. £97 one time or £47/month.',
    monetisation: '£47/month or £97 one time',
    industry: 'Education and Training',
    toolType: 'Generator',
  },
  {
    name: 'Student Progress Tracker',
    description: 'Tutors and educators track student progress against learning objectives and the AI generates personalised feedback and recommended next steps. £27/month per educator.',
    monetisation: '£27/month',
    industry: 'Education and Training',
    toolType: 'Tracker',
  },
  {
    name: 'Quiz and Assessment Builder',
    description: 'Users describe what they want to assess and the tool generates a complete quiz with questions, answer options and scoring criteria. £47/month for course creators and coaches.',
    monetisation: '£47/month',
    industry: 'Education and Training',
    toolType: 'Generator',
  },
  {
    name: 'Learning Style Diagnostic',
    description: 'Students complete a short assessment and receive a personalised learning profile with recommended study strategies and resources. Sell to tutors and educational programmes at £47 per student.',
    monetisation: '£47 per student',
    industry: 'Education and Training',
    toolType: 'Diagnostic',
  },
  {
    name: 'Lesson Plan Generator',
    description: 'Teachers and trainers input their topic, audience and time available and the tool generates a complete lesson plan with activities, discussion questions and resources. £27/month.',
    monetisation: '£27/month',
    industry: 'Education and Training',
    toolType: 'Generator',
  },
  {
    name: 'Property Investment Analyser',
    description: 'Investors input a property address, purchase price and rental estimate and the tool calculates gross yield, net yield, cash flow and return on investment. Sell to property investors and mortgage brokers at £47/month or £197 one time.',
    monetisation: '£47/month or £197 one time',
    industry: 'Real Estate',
    toolType: 'Calculator',
  },
  {
    name: 'Buyer Matching Tool',
    description: 'Estate agents input a buyer\'s requirements and budget and the tool matches them against available properties and generates a personalised shortlist with reasoning. £97/month for independent estate agents.',
    monetisation: '£97/month',
    industry: 'Real Estate',
    toolType: 'Generator',
  },
  {
    name: 'Rental Yield Calculator and Market Comparator',
    description: 'Landlords input their property details and the tool generates a rental yield analysis benchmarked against the local market with recommendations for maximising returns. £47/month or bundle into a property investment programme.',
    monetisation: '£47/month',
    industry: 'Real Estate',
    toolType: 'Calculator',
  },
  {
    name: 'Tenant Screening Assistant',
    description: 'Landlords input tenant application details and the tool generates a structured screening report with risk assessment and recommended questions for reference checks. £47/month for portfolio landlords.',
    monetisation: '£47/month',
    industry: 'Real Estate',
    toolType: 'Analyser',
  },
  {
    name: 'Property Listing Generator',
    description: 'Agents input property details and the tool generates compelling property listings optimised for portals, social media and email campaigns. £47/month for independent agents and small agencies.',
    monetisation: '£47/month',
    industry: 'Real Estate',
    toolType: 'Generator',
  },
  {
    name: 'Candidate Screening Assistant',
    description: 'Recruiters paste in a job description and candidate CVs and the tool scores each candidate against the requirements, highlights strengths and gaps and generates structured interview questions. £97/month for in-house recruiters and HR teams.',
    monetisation: '£97/month',
    industry: 'Recruitment and HR',
    toolType: 'Analyser',
  },
  {
    name: 'Job Description Generator',
    description: 'Hiring managers describe the role, team and requirements and the tool generates a compelling, inclusive job description optimised for attraction and diversity. £47/month or bundle into an HR toolkit.',
    monetisation: '£47/month',
    industry: 'Recruitment and HR',
    toolType: 'Generator',
  },
  {
    name: 'Culture Fit Assessor',
    description: 'Candidates complete a short values and working style assessment and the tool generates a culture fit score and personalised onboarding recommendations. £97/month for growing businesses.',
    monetisation: '£97/month',
    industry: 'Recruitment and HR',
    toolType: 'Diagnostic',
  },
  {
    name: 'Interview Question Bank',
    description: 'Users input the role, level and competencies and the tool generates a bank of structured interview questions with scoring criteria and red flags to watch for. £47 one time or £27/month for ongoing access.',
    monetisation: '£27/month or £47 one time',
    industry: 'Recruitment and HR',
    toolType: 'Generator',
  },
  {
    name: 'Employee Engagement Pulse Tool',
    description: 'Teams complete a weekly five question check in and the tool aggregates responses, identifies trends and generates management recommendations. £97/month for teams of up to 50.',
    monetisation: '£97/month',
    industry: 'Recruitment and HR',
    toolType: 'Analyser',
  },
  {
    name: 'Creative Brief Generator',
    description: 'Clients answer a series of questions about their project, audience and goals and the tool generates a comprehensive creative brief ready to share with designers, photographers or agencies. £47/month for marketing teams and creative directors.',
    monetisation: '£47/month',
    industry: 'Creative Industries',
    toolType: 'Generator',
  },
  {
    name: 'Client Feedback Interpreter',
    description: 'Creatives paste in vague or contradictory client feedback and the tool translates it into clear, actionable design direction. £37/month for freelance designers, photographers and videographers.',
    monetisation: '£37/month',
    industry: 'Creative Industries',
    toolType: 'Analyser',
  },
  {
    name: 'Project Scope and Pricing Calculator',
    description: 'Creatives input project requirements and the tool generates a detailed scope of work with recommended pricing based on their day rate and market rates. £47/month for freelancers and small creative agencies.',
    monetisation: '£47/month',
    industry: 'Creative Industries',
    toolType: 'Calculator',
  },
  {
    name: 'Portfolio Positioning Tool',
    description: 'Creatives describe their work and ideal clients and the tool generates a positioning statement, bio, service descriptions and suggested portfolio categories. £97 one time for brand identity work.',
    monetisation: '£97 one time',
    industry: 'Creative Industries',
    toolType: 'Generator',
  },
  {
    name: 'Creative Concept Generator',
    description: 'Users input a brief, audience and mood and the tool generates five distinct creative concepts with rationale, visual direction and messaging angles. £47/month for agencies and in-house creative teams.',
    monetisation: '£47/month',
    industry: 'Creative Industries',
    toolType: 'Generator',
  },
  {
    name: 'Product Description Generator',
    description: 'Sellers input product details, features and target audience and the tool generates compelling product descriptions optimised for conversion and SEO across multiple platforms. £47/month for e-commerce stores with large catalogues.',
    monetisation: '£47/month',
    industry: 'E-commerce',
    toolType: 'Generator',
  },
  {
    name: 'Returns Analyser',
    description: 'Sellers input returns data and the tool identifies patterns, root causes and recommendations for reducing return rates and improving product listings. £67/month for growing e-commerce brands.',
    monetisation: '£67/month',
    industry: 'E-commerce',
    toolType: 'Analyser',
  },
  {
    name: 'Customer Segmentation Tool',
    description: 'Sellers input customer purchase history and behaviour data and the tool generates audience segments with personalised marketing recommendations for each. £97/month for e-commerce brands.',
    monetisation: '£97/month',
    industry: 'E-commerce',
    toolType: 'Analyser',
  },
  {
    name: 'Abandoned Cart Recovery Sequence Generator',
    description: 'Sellers input their product and brand details and the tool generates a personalised abandoned cart email sequence with subject lines and copy optimised for recovery. £47/month or one time purchase at £97.',
    monetisation: '£47/month or £97 one time',
    industry: 'E-commerce',
    toolType: 'Generator',
  },
  {
    name: 'Supplier Negotiation Assistant',
    description: 'E-commerce owners input their current supplier terms and purchase volumes and the tool generates a negotiation strategy with scripts and target outcomes. £97 one time for growing brands.',
    monetisation: '£97 one time',
    industry: 'E-commerce',
    toolType: 'Generator',
  },
  {
    name: 'Event Planning Assistant',
    description: 'Clients input their event type, guest count, budget and preferences and the tool generates a complete planning timeline, supplier checklist and budget breakdown. Sell to event planners and venues at £97/month.',
    monetisation: '£97/month',
    industry: 'Hospitality and Events',
    toolType: 'Planner',
  },
  {
    name: 'Guest Experience Personalisation Tool',
    description: 'Hotels and venues input guest preferences and booking history and the tool generates personalised welcome messages, room setup recommendations and activity suggestions. £197/month for boutique hotels and venues.',
    monetisation: '£197/month',
    industry: 'Hospitality and Events',
    toolType: 'Generator',
  },
  {
    name: 'Venue Matching Tool',
    description: 'Event planners input their requirements and the tool generates a shortlist of suitable venues with comparison notes and questions to ask during site visits. £47/month for corporate event planners.',
    monetisation: '£47/month',
    industry: 'Hospitality and Events',
    toolType: 'Generator',
  },
  {
    name: 'Menu and Dietary Requirements Manager',
    description: 'Caterers and venues input guest dietary requirements and the tool generates personalised menus, seating plans and service notes. £67/month for catering companies and event venues.',
    monetisation: '£67/month',
    industry: 'Hospitality and Events',
    toolType: 'Planner',
  },
  {
    name: 'Post Event Feedback Analyser',
    description: 'Event organisers paste in attendee feedback and the tool generates a structured analysis with key themes, NPS score interpretation and recommendations for future events. £47/month or £97 per event report.',
    monetisation: '£47/month or £97 per report',
    industry: 'Hospitality and Events',
    toolType: 'Analyser',
  },
];

const INDUSTRIES = [
  'All Industries',
  'Business and Executive Coaching',
  'PR and Visibility',
  'Finance and Wealth',
  'Health and Wellness',
  'AI Consulting',
  'Marketing and Content',
  'Legal and Compliance',
  'Operations and Productivity',
  'Education and Training',
  'Real Estate',
  'Recruitment and HR',
  'Creative Industries',
  'E-commerce',
  'Hospitality and Events',
];

const TOOL_TYPES = [
  'All Types',
  'Generator',
  'Diagnostic',
  'Tracker',
  'Dashboard',
  'Calculator',
  'Planner',
  'Analyser',
];

const THREE_POINTS = [
  'You do not need to build something complicated. The best tools do one thing brilliantly. Simple, focused and genuinely useful beats complex and overwhelming every time.',
  'You do not need a huge audience to monetise. At £47/month you only need 22 paying users to generate £1,000/month. At £97/month you need 11. These are achievable numbers.',
  'You do not need to build for everyone. Pick a niche you understand, a problem you have personally experienced and an audience you can reach. That is your starting point.',
];

export default function IdeasAccess() {
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedType, setSelectedType] = useState('All Types');

  const filtered = ideas.filter((idea) => {
    const matchIndustry = selectedIndustry === 'All Industries' || idea.industry === selectedIndustry;
    const matchType = selectedType === 'All Types' || idea.toolType === selectedType;
    return matchIndustry && matchType;
  });

  const resultLabel =
    filtered.length === ideas.length
      ? `Showing all ${ideas.length} ideas`
      : `Showing ${filtered.length} of ${ideas.length} ideas`;

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green font-sans selection:bg-terracotta selection:text-white scroll-smooth">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-warm-cream/80 backdrop-blur-md border-b border-forest-green/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-lg md:text-2xl font-display font-extrabold tracking-tighter shrink-0">
            VIBE<span className="text-terracotta">CODING</span>LAB
          </Link>
          <a
            href="https://store.ascendz.co/vibecodinglab-founders/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-terracotta text-white px-4 md:px-6 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-burnt-orange hover:scale-105 transition-all shadow-lg shadow-terracotta/20 whitespace-nowrap"
          >
            Get Lifetime Access
          </a>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-sand px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-8"
          >
            Your Free Resource
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-7xl font-display font-extrabold leading-[1.0] tracking-tighter mb-10"
          >
            70 AI-Powered Tools You Could Build and Monetise{' '}
            <span className="text-terracotta">This Week.</span>
          </motion.h1>

          {/* Intro copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto space-y-5 text-lg md:text-xl leading-relaxed mb-10"
          >
            <p className="opacity-80">One of the biggest barriers to building an AI-powered tool or micro SaaS product is not technical ability. It is imagination. Most people struggle to picture what they could actually create, so they never start.</p>
            <p className="font-bold text-xl md:text-2xl">This list exists to fix that.</p>
            <p className="opacity-80">Every single tool below is buildable using vibe coding and no-code AI tools. Some could be built in an afternoon. Others might take a few days. All of them solve a real problem, serve a specific audience and have a clear path to generating revenue.</p>
            <p className="font-bold">A few things worth knowing before you dive in:</p>
          </motion.div>

          {/* Three-column points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
          >
            {THREE_POINTS.map((point, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-left border border-forest-green/5 shadow-sm">
                <div className="w-8 h-8 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center text-sm font-extrabold mb-4">{i + 1}</div>
                <p className="text-base leading-relaxed opacity-80">{point}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-center max-w-4xl mx-auto space-y-5 text-lg md:text-xl leading-relaxed mb-10"
          >
            <p className="opacity-80">The pricing suggestions are starting points based on what similar tools charge in the market right now. Your pricing will depend on your audience, your positioning and how much value the tool genuinely delivers. Always test before you settle.</p>
            <p className="font-bold text-xl md:text-2xl">Now find your idea. Then come build it.</p>
          </motion.div>
        </div>
      </section>

      {/* Filter intro — visually distinct section break */}
      <section className="px-6 py-12 bg-sand/40 border-y border-forest-green/8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Browse the Ideas</p>
          <p className="text-xl md:text-2xl font-bold">
            Filter by your industry and tool type to find the ideas most relevant to you.
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[65px] z-40 bg-warm-cream/95 backdrop-blur-md border-b border-forest-green/8 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Industry filter */}
            <div className="relative w-full sm:w-auto">
              <label className="sr-only">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="appearance-none w-full sm:w-auto bg-white border border-forest-green/15 text-forest-green rounded-2xl pl-5 pr-10 py-3 text-sm font-bold focus:outline-none focus:border-terracotta transition-colors cursor-pointer"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 opacity-40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Tool type filter */}
            <div className="relative w-full sm:w-auto">
              <label className="sr-only">Tool Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none w-full sm:w-auto bg-white border border-forest-green/15 text-forest-green rounded-2xl pl-5 pr-10 py-3 text-sm font-bold focus:outline-none focus:border-terracotta transition-colors cursor-pointer"
              >
                {TOOL_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 opacity-40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Reset */}
            {(selectedIndustry !== 'All Industries' || selectedType !== 'All Types') && (
              <button
                onClick={() => { setSelectedIndustry('All Industries'); setSelectedType('All Types'); }}
                className="text-sm font-bold text-terracotta hover:text-burnt-orange transition-colors underline underline-offset-2 self-center"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-sm font-bold opacity-50 shrink-0">{resultLabel}</p>
        </div>
      </div>

      {/* Card Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24 opacity-40">
              <p className="text-xl font-bold">No ideas match your filters.</p>
              <p className="text-sm mt-2">Try broadening your selection.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((idea) => (
                  <motion.div
                    key={idea.name}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl p-6 border border-forest-green/5 shadow-sm hover:shadow-lg hover:border-forest-green/10 transition-all duration-300 flex flex-col gap-4"
                  >
                    <h3 className="text-lg font-display font-extrabold leading-tight">{idea.name}</h3>
                    <p className="text-sm opacity-70 leading-relaxed flex-1">{idea.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-forest-green/5">
                      <span className="bg-terracotta/10 text-terracotta text-xs font-bold px-3 py-1 rounded-full">
                        {idea.monetisation}
                      </span>
                      <span className="bg-sand text-forest-green/60 text-xs font-bold px-3 py-1 rounded-full">
                        {idea.industry}
                      </span>
                      <span className="bg-sand text-forest-green/60 text-xs font-bold px-3 py-1 rounded-full">
                        {idea.toolType}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* App Idea Generator Section */}
      <section className="px-6 py-24 bg-sand/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight tracking-tighter">
            Didn't Find Your Idea in the List?
          </h2>
          <p className="text-xl md:text-2xl opacity-80 leading-relaxed max-w-2xl mx-auto">
            Sometimes the best idea is the one nobody has thought of yet. Answer six quick questions about your expertise, your clients and what you want to build and get a personalised AI-powered app idea generated just for you in 60 seconds.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/app-idea"
              className="inline-flex items-center gap-3 bg-terracotta text-white px-10 py-5 rounded-2xl text-xl font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-2xl shadow-terracotta/30"
            >
              Find My Personalised App Idea <ArrowRight size={20} />
            </Link>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60">
              Free. No sign up required. Takes 60 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-forest-green text-white">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight tracking-tighter">
            Ready to Build One of These?
          </h2>
          <p className="text-xl md:text-2xl opacity-80 leading-relaxed max-w-2xl mx-auto">
            Every tool on this list is buildable using vibe coding and no-code AI tools. No development team. No huge budget. Just you, the right method and the willingness to start. Join the Vibe Coding Lab and learn exactly how.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-3 bg-terracotta text-white px-10 py-5 rounded-2xl text-xl font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-2xl shadow-terracotta/30"
            >
              Join the Vibe Coding Lab <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 text-center opacity-40 text-xs font-bold uppercase tracking-widest border-t border-forest-green/5">
        © 2026 Vibe Coding Lab by Ascendz | All Rights Reserved
      </footer>
    </div>
  );
}
