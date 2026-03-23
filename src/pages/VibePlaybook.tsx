import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, ExternalLink } from 'lucide-react';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type GlossaryTerm = { term: string; category: string; definition: string; example: string };
type FileEntry = { ext: string; name: string; description: string; whenToUse: string };
type FileSection = { heading: string; intro: string; files: FileEntry[] };
type AIModel = { name: string; description: string; pricing: string; bestFor: string };
type AIProvider = { name: string; docsUrl: string; notice?: string; models: AIModel[]; ruleOfThumb: string };
type Tool = { name: string; weUseThis?: boolean; description: string; freeTier: string; bestFor: string; site: string };
type ToolSection = { heading: string; tools: Tool[] };

// ─── GLOSSARY DATA ───────────────────────────────────────────────────────────

const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Building and Development
  {
    term: 'CLI (Command Line Interface)',
    category: 'Building and Development',
    definition: 'A text-based way of giving instructions to your computer by typing commands rather than clicking buttons. It looks intimidating but you only need a handful of commands to get started.',
    example: 'Typing npm install into a terminal to install the packages your project needs.',
  },
  {
    term: 'Command',
    category: 'Building and Development',
    definition: 'A specific instruction you type into the terminal to make something happen.',
    example: 'npm run dev tells your project to start running locally so you can see it in your browser.',
  },
  {
    term: 'Cursor',
    category: 'Building and Development',
    definition: 'An AI-powered code editor that sits on top of your existing development environment. Popular in the vibe coding community for its ability to understand and edit large codebases through conversation.',
    example: 'Asking Cursor to find and fix all the places in your project where a variable name is used incorrectly.',
  },
  {
    term: 'Debugging',
    category: 'Building and Development',
    definition: 'The process of finding and fixing errors in your code. An inevitable and normal part of building anything.',
    example: 'Your app is not displaying data correctly so you work through the code methodically to find where it is going wrong. Claude Code is particularly good at helping debug problems.',
  },
  {
    term: 'Deploy and Deployment',
    category: 'Building and Development',
    definition: 'The process of taking your app from running locally on your computer and making it live on the internet so anyone can access it via a URL.',
    example: 'Deploying your app to Vercel so it lives at a real web address.',
  },
  {
    term: 'Error and Bug',
    category: 'Building and Development',
    definition: 'An error is a problem that stops your code from running. A bug is unexpected behaviour where the code runs but does not do what you intended.',
    example: 'A typo in a variable name causes an error. A form that submits but saves the wrong data is a bug.',
  },
  {
    term: 'Git',
    category: 'Building and Development',
    definition: 'The most popular version control tool. It tracks changes to your project files and lets you save snapshots of your work called commits.',
    example: 'Running git commit with a message saves a snapshot of your project at that point.',
  },
  {
    term: 'GitHub',
    category: 'Building and Development',
    definition: 'A website where you store and manage your Git repositories online. Think of it as Google Drive for your code. It also makes it easy to deploy your project to platforms like Vercel.',
    example: 'Pushing your project to GitHub so Vercel can automatically deploy it every time you make a change.',
  },
  {
    term: 'IDE (Integrated Development Environment)',
    category: 'Building and Development',
    definition: 'A software application that gives you everything you need to build in one place. Think of it as your workshop. It typically includes a code editor, file manager and tools to run and test your project.',
    example: 'Antigravity IDE is the IDE we use inside the Vibe Coding Lab.',
  },
  {
    term: 'Local and Localhost',
    category: 'Building and Development',
    definition: 'Running your app on your own computer rather than on the internet. When your app is running locally you access it through your browser using an address like localhost:3000. Nobody else can see it yet.',
    example: 'Building and testing your Founder Co-Pilot on localhost before deploying it live.',
  },
  {
    term: 'Markdown',
    category: 'Building and Development',
    definition: 'A lightweight way of formatting text using simple symbols rather than a visual editor. Widely used in documentation, README files and AI outputs. Once you recognise the syntax it becomes second nature.',
    example: 'Typing two asterisks around text makes it bold. Typing a hash symbol before text creates a heading. Many AI models return responses formatted in Markdown.',
  },
  {
    term: 'MCP (Model Context Protocol)',
    category: 'Building and Development',
    definition: 'An open standard developed by Anthropic that allows AI models to connect to external tools, data sources and services in a consistent way. Think of it as a universal plug socket for AI integrations.',
    example: 'Using MCP to connect Claude to your Google Calendar so it can check your schedule and suggest when to focus on deep work. Antigravity IDE supports MCP connections, allowing your vibe coded apps to integrate with a wide range of external services.',
  },
  {
    term: 'React',
    category: 'Building and Development',
    definition: 'A popular JavaScript library for building user interfaces. It lets you build reusable components, pieces of UI that you can combine to create full applications. Most modern web apps built with vibe coding tools use React under the hood.',
    example: 'Antigravity IDE frequently generates React-based projects. If you see files ending in .jsx or .tsx you are likely working in a React project.',
  },
  {
    term: 'Refactor',
    category: 'Building and Development',
    definition: 'Improving the structure or quality of existing code without changing what it does. Makes it easier to read, maintain and build on.',
    example: 'After getting your app working, you ask Claude Code to refactor the login function to make it cleaner and more efficient.',
  },
  {
    term: 'Repository (Repo)',
    category: 'Building and Development',
    definition: 'A folder that contains all the files for your project, tracked by Git. Every project has its own repository.',
    example: 'Your Founder Co-Pilot project lives in its own repository on GitHub.',
  },
  {
    term: 'Stack and Tech Stack',
    category: 'Building and Development',
    definition: 'The combination of tools, languages and platforms used to build an application.',
    example: 'The Vibe Coding Lab tech stack is Google AI Studio, Antigravity IDE and Claude Code.',
  },
  {
    term: 'Tailwind CSS',
    category: 'Building and Development',
    definition: 'A utility-first CSS framework that lets you style your application by applying pre-built class names directly to your HTML elements rather than writing custom CSS. Extremely popular in modern web development because it speeds up the design process significantly.',
    example: 'Antigravity IDE uses Tailwind by default for styling. You will see class names like bg-white, text-lg and rounded-md applied directly to elements in your code.',
  },
  {
    term: 'Terminal',
    category: 'Building and Development',
    definition: 'The application on your computer where you type CLI commands. On a Mac it is called Terminal. On Windows it is called Command Prompt or PowerShell.',
    example: 'Opening Terminal and typing cd my-project to navigate into your project folder.',
  },
  {
    term: 'Version Control',
    category: 'Building and Development',
    definition: 'A system for tracking changes to your code over time so you can see what changed, when and why. It also lets you roll back to a previous version if something breaks.',
    example: 'Git is the most widely used version control system.',
  },
  {
    term: 'Vibe Coding',
    category: 'Building and Development',
    definition: 'Building real, functional software using AI tools and natural language rather than writing traditional code. You describe what you want, the AI builds it, you refine and ship it.',
    example: 'Typing build me a lead capture form that saves responses to a database into Google AI Studio and getting working code back.',
  },
  // AI and Models
  {
    term: 'Agentic AI',
    category: 'AI and Models',
    definition: 'AI that does not just respond to questions but takes actions, makes decisions and works through multi-step tasks on your behalf without needing to be told every single step.',
    example: 'Antigravity IDE uses agentic AI to interpret your design, make decisions about how to build it and write the code without you directing every detail.',
  },
  {
    term: 'AI Model',
    category: 'AI and Models',
    definition: 'The underlying intelligence that powers AI tools. Different models have different strengths, costs and capabilities.',
    example: 'Claude Sonnet, GPT-4o and Gemini are all AI models.',
  },
  {
    term: 'API (Application Programming Interface)',
    category: 'AI and Models',
    definition: 'A way for two pieces of software to talk to each other. When your app needs to use an AI model, it sends a request to the model\'s API and gets a response back.',
    example: 'Your Founder Co-Pilot sends your question to the Anthropic API and gets Claude\'s response back to display in the chat.',
  },
  {
    term: 'API Key',
    category: 'AI and Models',
    definition: 'A unique private code that identifies you when your app makes requests to an API. Treat it like a password. Never share it publicly.',
    example: 'You add your Anthropic API key to your project settings so your app can access Claude.',
  },
  {
    term: 'Context Window',
    category: 'AI and Models',
    definition: 'The maximum amount of text an AI model can process in one go. Think of it as the model\'s short term memory. If your conversation exceeds the context window the model starts to forget earlier parts.',
    example: 'If you paste a very long document into a chat and the model seems to forget earlier instructions, you may have exceeded the context window.',
  },
  {
    term: 'Fine-tuning',
    category: 'AI and Models',
    definition: 'Training an existing AI model further on specific data to make it better at a particular task or more aligned with a specific style or domain.',
    example: 'Fine-tuning a model on all your past client proposals so it generates new ones that sound exactly like you.',
  },
  {
    term: 'Hallucination',
    category: 'AI and Models',
    definition: 'When an AI model generates information that sounds confident and plausible but is factually incorrect. A known limitation of all current LLMs.',
    example: 'Asking an AI for statistics and it returns figures that do not exist. Always verify important facts from AI outputs.',
  },
  {
    term: 'LLM (Large Language Model)',
    category: 'AI and Models',
    definition: 'The type of AI model that powers tools like ChatGPT, Claude and Gemini. Trained on vast amounts of text data, they understand and generate human language extremely well.',
    example: 'When you ask Claude to write a proposal, it is an LLM generating that response.',
  },
  {
    term: 'Prompt',
    category: 'AI and Models',
    definition: 'The instruction or question you give to an AI model. The quality of your prompt directly affects the quality of the output.',
    example: 'Write a 300 word LinkedIn post about the importance of systems in a small business, written in a conversational British tone, is a strong, specific prompt.',
  },
  {
    term: 'RAG (Retrieval Augmented Generation)',
    category: 'AI and Models',
    definition: 'A technique that allows an AI to answer questions based on your own documents and data rather than just its general training. The AI retrieves the most relevant parts of your documents before generating a response.',
    example: 'Uploading your brand guidelines to the Knowledge Base and asking what is my brand tone of voice. The AI retrieves the relevant section and answers using your own words.',
  },
  {
    term: 'System Prompt',
    category: 'AI and Models',
    definition: 'A set of instructions given to an AI model before the conversation begins that shapes how it behaves throughout. Used to give the AI a persona, rules or context.',
    example: 'You are a helpful assistant for the Vibe Coding Lab. Always respond in British English and never use em dashes.',
  },
  {
    term: 'Token',
    category: 'AI and Models',
    definition: 'The unit AI models use to measure text. A token is roughly three to four characters or about three quarters of a word. Models charge by the number of tokens processed.',
    example: 'A short message might use 50 tokens. A long document might use 2,000 tokens.',
  },
  // Infrastructure and Deployment
  {
    term: 'Authentication',
    category: 'Infrastructure and Deployment',
    definition: 'The process of verifying who a user is before giving them access to an application. Usually handled via email and password, or third party login like Google.',
    example: 'The login page on your Founder Co-Pilot uses authentication to make sure only you can access your data.',
  },
  {
    term: 'Backend',
    category: 'Infrastructure and Deployment',
    definition: 'The part of an application that runs behind the scenes. It handles logic, stores data, processes requests and communicates with databases and APIs.',
    example: 'When you log in, the backend checks your credentials and decides whether to let you in.',
  },
  {
    term: 'CRUD (Create, Read, Update, Delete)',
    category: 'Infrastructure and Deployment',
    definition: 'The four fundamental operations you can perform on data in any database driven application. Almost every app you build will use all four.',
    example: 'Creating a new task, reading your list of tasks, updating a task\'s status and deleting a completed task are the four CRUD operations in action.',
  },
  {
    term: 'Database',
    category: 'Infrastructure and Deployment',
    definition: 'Where your application stores information persistently. Without a database, data disappears when you close the app.',
    example: 'Supabase is a popular database tool used to store user accounts, tasks and knowledge base documents.',
  },
  {
    term: 'Environment Variables (.env)',
    category: 'Infrastructure and Deployment',
    definition: 'A file where you store sensitive information like API keys so they are not visible in your code. The dot before env means it is a hidden file.',
    example: 'Storing your OpenAI API key in a .env file so it is not accidentally shared on GitHub.',
  },
  {
    term: 'Framework',
    category: 'Infrastructure and Deployment',
    definition: 'A structured foundation for building applications that provides common tools, patterns and rules so you do not have to start from scratch.',
    example: 'React is a popular frontend framework. Next.js builds on top of React and adds additional features.',
  },
  {
    term: 'Frontend',
    category: 'Infrastructure and Deployment',
    definition: 'The part of an application that users see and interact with. Everything visual — buttons, forms, layouts, colours.',
    example: 'The login page and dashboard of your Founder Co-Pilot are the frontend.',
  },
  {
    term: 'Hosting',
    category: 'Infrastructure and Deployment',
    definition: 'Where your application lives on the internet. A hosting provider stores your app\'s files on a server and makes them accessible via a URL.',
    example: 'Vercel provides hosting for your deployed app.',
  },
  {
    term: 'Node.js',
    category: 'Infrastructure and Deployment',
    definition: 'A JavaScript runtime that lets you run JavaScript outside of a browser, on your computer or a server. Many modern web tools require Node.js to be installed.',
    example: 'Installing Node.js before you can use Claude Code or run a local development server.',
  },
  {
    term: 'npm (Node Package Manager)',
    category: 'Infrastructure and Deployment',
    definition: 'A tool that lets you install and manage packages, which are pre-built chunks of code that add functionality to your project. It comes with Node.js.',
    example: 'Running npm install downloads all the packages your project needs to run.',
  },
  {
    term: 'Open Source',
    category: 'Infrastructure and Deployment',
    definition: 'Software whose code is publicly available for anyone to view, use and modify.',
    example: 'Supabase is open source, meaning you can inspect its code and even host it yourself if you want full control.',
  },
  {
    term: 'Package and Library',
    category: 'Infrastructure and Deployment',
    definition: 'Pre-built code that someone else has written and shared that you can add to your project to save time.',
    example: 'Installing a package that handles date formatting so you do not have to write that code yourself.',
  },
  {
    term: 'Serverless',
    category: 'Infrastructure and Deployment',
    definition: 'A way of running backend code without managing your own server. The hosting provider handles all the infrastructure and you only pay for what you use. Scales automatically with demand.',
    example: 'Deploying an API endpoint on Vercel\'s serverless functions so it runs on demand without you needing to manage a server.',
  },
  {
    term: 'Supabase',
    category: 'Infrastructure and Deployment',
    definition: 'An open source database platform that is beginner friendly and works well with vibe coded apps. It handles user authentication, data storage and real time updates.',
    example: 'Using Supabase to store your Founder Co-Pilot users so their tasks and knowledge base persist between sessions.',
  },
  {
    term: 'Vercel',
    category: 'Infrastructure and Deployment',
    definition: 'A popular deployment platform that makes it very easy to take a project from GitHub and make it live on the internet. Free tier is generous for small projects.',
    example: 'Connecting your GitHub repository to Vercel so your app deploys automatically every time you push an update.',
  },
  {
    term: 'Webhook',
    category: 'Infrastructure and Deployment',
    definition: 'A way for one application to automatically notify another when something happens. Rather than constantly checking for updates, the app sends a message the moment an event occurs.',
    example: 'When someone joins your Skool community, a webhook fires and triggers a Make.com scenario that creates their user account in your app.',
  },
  // Micro SaaS and Product
  {
    term: 'Churn',
    category: 'Micro SaaS and Product',
    definition: 'The rate at which subscribers cancel their subscription. Keeping churn low is as important as acquiring new customers.',
    example: 'If you have 100 subscribers and 5 cancel each month, your monthly churn rate is 5%.',
  },
  {
    term: 'Micro SaaS',
    category: 'Micro SaaS and Product',
    definition: 'A small, focused software product built by one person or a tiny team, usually solving one specific problem for a specific audience. Sold on a subscription basis.',
    example: 'A diagnostic tool that coaches use to assess their clients\' business health, charged at £47/month.',
  },
  {
    term: 'MRR (Monthly Recurring Revenue)',
    category: 'Micro SaaS and Product',
    definition: 'The predictable revenue your product generates each month from subscriptions.',
    example: '50 subscribers at £47/month gives you £2,350 MRR.',
  },
  {
    term: 'MVP (Minimum Viable Product)',
    category: 'Micro SaaS and Product',
    definition: 'The simplest version of your product that is functional enough to test with real users and get feedback from.',
    example: 'Your Founder Co-Pilot v1 is an MVP. It works, people can use it and you can improve it based on what you learn.',
  },
  {
    term: 'Production Ready',
    category: 'Micro SaaS and Product',
    definition: 'An app that is stable, secure and reliable enough to be used by real people in the real world, not just a demo or prototype.',
    example: 'Moving from a local localhost version to a deployed, tested, live app that handles real users is making it production ready.',
  },
  {
    term: 'SaaS (Software as a Service)',
    category: 'Micro SaaS and Product',
    definition: 'Software delivered over the internet on a subscription basis rather than as a one-time purchase. Users access it through a browser without installing anything.',
    example: 'Notion, Canva and Slack are all SaaS products.',
  },
  {
    term: 'v1, v2, v3',
    category: 'Micro SaaS and Product',
    definition: 'Shorthand for version numbers. v1 is the first working version. v2 is the improved version after feedback. Iteration is how great products are built.',
    example: 'Build v1, ship it, gather feedback, build v2 with improvements.',
  },
  {
    term: 'Waitlist',
    category: 'Micro SaaS and Product',
    definition: 'A list of people who have expressed interest in your product before it launches. Building a waitlist before you build validates demand and gives you an audience ready to convert.',
    example: 'Collecting email addresses on a simple landing page before your product is ready to launch.',
  },
];

const GLOSSARY_CATEGORIES = [
  'All',
  'Building and Development',
  'AI and Models',
  'Infrastructure and Deployment',
  'Micro SaaS and Product',
];

// ─── FILE TYPE DATA ───────────────────────────────────────────────────────────

const FILE_TYPE_SECTIONS: FileSection[] = [
  {
    heading: 'Web Files',
    intro: 'These are the files that make up what users see and interact with in a browser.',
    files: [
      {
        ext: '.html',
        name: 'HTML',
        description: 'The foundation of every web page. HTML stands for HyperText Markup Language and it defines the structure and content of a page. Headings, paragraphs, buttons, images and forms are all created with HTML.',
        whenToUse: 'For simple static web pages, landing pages and content that does not need dynamic functionality. The sales page and opt-in page on thevibecodinglab.co are HTML files.',
      },
      {
        ext: '.css',
        name: 'CSS',
        description: 'Cascading Style Sheets. CSS controls how your HTML looks. Colours, fonts, spacing, layouts and animations are all handled by CSS.',
        whenToUse: 'Alongside HTML to style your pages. CSS is often embedded directly inside HTML files in vibe coded projects rather than as a separate file.',
      },
      {
        ext: '.js',
        name: 'JavaScript',
        description: 'The programming language of the web. JavaScript makes pages interactive and dynamic. Buttons that do things, forms that validate, content that updates without a page reload.',
        whenToUse: 'When you need interactivity or logic on a web page. Also used on the backend with Node.js.',
      },
      {
        ext: '.jsx',
        name: 'JSX',
        description: 'A syntax that lets you write HTML-like code inside JavaScript. Makes it easier to build user interface components.',
        whenToUse: 'In React projects. Often seen in older React projects. Modern projects typically use .tsx instead.',
      },
      {
        ext: '.ts and .tsx',
        name: 'TypeScript and TSX',
        description: 'A more structured version of JavaScript that adds type checking, which means it catches certain errors before your code runs. TSX is TypeScript with JSX, which allows you to write HTML-like code inside JavaScript.',
        whenToUse: 'Most modern web apps built with frameworks like React or Next.js use TypeScript. Antigravity IDE often generates TypeScript files. TSX files are used for React components.',
      },
    ],
  },
  {
    heading: 'Configuration and Data Files',
    intro: 'These files control how your project behaves, stores settings and manages sensitive information.',
    files: [
      {
        ext: '.config.js and .config.ts',
        name: 'Config Files',
        description: 'Configuration files that tell frameworks and tools how to behave. Different tools use different config file names but they all follow a similar pattern.',
        whenToUse: 'You will encounter these when working with frameworks like Next.js (next.config.js), styling tools like Tailwind (tailwind.config.js) and testing tools. They are usually generated automatically when you set up a project. Claude Code can help you modify them safely when needed.',
      },
      {
        ext: '.env',
        name: 'Environment Variables',
        description: 'A hidden configuration file that stores sensitive information like API keys and database passwords. The dot at the start makes it hidden on most systems.',
        whenToUse: 'Every project that connects to an external service like an AI API or a database needs a .env file. Never share this file publicly or commit it to GitHub.',
      },
      {
        ext: '.gitignore',
        name: 'Gitignore',
        description: 'A hidden file that tells Git which files and folders to ignore and not track or upload to GitHub. Not technically an extension but you will encounter it in every project.',
        whenToUse: 'Always. Your .env file, node_modules folder and other sensitive or unnecessary files should always be listed in your .gitignore so they are never accidentally shared publicly.',
      },
      {
        ext: '.json',
        name: 'JSON',
        description: 'JavaScript Object Notation. A lightweight format for storing and exchanging structured data. Looks like a list of labelled values.',
        whenToUse: 'For configuration files, storing data and sending information between a frontend and a backend or API. You will encounter JSON constantly in vibe coded projects.',
      },
      {
        ext: 'package-lock.json and yarn.lock',
        name: 'Lock Files',
        description: 'Files automatically generated by npm or Yarn that record the exact versions of every package your project uses. They ensure everyone working on the project uses identical versions.',
        whenToUse: 'You do not create these manually. They are generated automatically when you install packages. Do not edit them and do not delete them. If you see them in your project, leave them alone.',
      },
      {
        ext: '.sql',
        name: 'SQL',
        description: 'Structured Query Language. Used to communicate with databases. SQL files contain database queries and commands for creating, reading, updating and deleting data.',
        whenToUse: 'When setting up or modifying a database. Supabase uses SQL under the hood. You may encounter SQL files when building apps that store data.',
      },
      {
        ext: '.toml',
        name: 'TOML',
        description: 'A simple configuration file format designed to be easy to read. Stands for Tom\'s Obvious Minimal Language.',
        whenToUse: 'Used by some frameworks and deployment tools for project configuration. You may encounter it in Next.js or Vercel projects.',
      },
      {
        ext: '.yaml and .yml',
        name: 'YAML',
        description: 'Another configuration file format, similar to TOML but more widely used. Stands for Yet Another Markup Language.',
        whenToUse: 'Common in deployment configuration files, CI/CD pipelines and tools like GitHub Actions. Often seen in more complex project setups.',
      },
    ],
  },
  {
    heading: 'Documentation Files',
    intro: 'These files are used for written content, notes and documentation.',
    files: [
      {
        ext: '.md',
        name: 'Markdown',
        description: 'A plain text file that uses simple symbols to create formatted text. Widely used for documentation, README files and notes.',
        whenToUse: 'For writing documentation, project notes and README files on GitHub. Also used in some content management systems and note-taking apps.',
      },
      {
        ext: '.pdf',
        name: 'PDF',
        description: 'Portable Document Format. A file that preserves formatting and looks the same on any device.',
        whenToUse: 'For documents you want to share in a fixed format, like guides, reports or downloadable resources.',
      },
      {
        ext: '.txt',
        name: 'TXT',
        description: 'A plain text file with no formatting. The simplest file type.',
        whenToUse: 'For simple notes, raw data or content that does not need any formatting.',
      },
    ],
  },
  {
    heading: 'Media Files',
    intro: 'These files store images and visual assets used in your projects.',
    files: [
      {
        ext: '.jpg',
        name: 'JPG',
        description: 'A compressed image format best suited to photographs and images with lots of colour variation. Smaller file size but loses some quality in the compression.',
        whenToUse: 'For photographs, hero images and any image where file size matters more than perfect quality.',
      },
      {
        ext: '.png',
        name: 'PNG',
        description: 'An image format that supports transparency and maintains full quality without compression loss. Larger file size than JPG.',
        whenToUse: 'For logos, icons, screenshots and any image that needs a transparent background or pixel-perfect quality.',
      },
      {
        ext: '.svg',
        name: 'SVG',
        description: 'A vector image format that scales perfectly at any size without losing quality because it is built from mathematical paths rather than pixels.',
        whenToUse: 'For logos, icons and any graphic that needs to look sharp at different sizes. Ideal for UI elements that appear across different screen sizes.',
      },
    ],
  },
];

// ─── AI MODELS DATA ──────────────────────────────────────────────────────────

const AI_PROVIDERS: AIProvider[] = [
  {
    name: 'Anthropic Claude',
    docsUrl: 'https://platform.anthropic.com/docs/about-claude/models',
    models: [
      {
        name: 'Claude Opus 4.6',
        description: 'Anthropic\'s most capable model. Exceptional at complex reasoning, large codebase analysis and agentic tasks. Supports a 1 million token context window.',
        pricing: '$5 per million input tokens, $25 per million output tokens.',
        bestFor: 'Complex architecture decisions, deep debugging, analysing large codebases, tasks requiring the deepest reasoning. Use deliberately and sparingly.',
      },
      {
        name: 'Claude Sonnet 4.6',
        description: 'The daily driver, preferred over Sonnet 4.5 by many developers, delivering near-Opus-level intelligence at Sonnet pricing. Fast, reliable and handles the vast majority of tasks without compromise.',
        pricing: '$3 per million input tokens, $15 per million output tokens.',
        bestFor: 'Most everyday coding tasks, content generation, building features. This should be your default for most vibe coding work.',
      },
      {
        name: 'Claude Haiku 4.5',
        description: 'The fastest and most affordable Claude model. Optimised for speed and high volume tasks.',
        pricing: '$1 per million input tokens, $5 per million output tokens.',
        bestFor: 'Simple classifications, quick edits, routine questions and high volume tasks where cost matters most.',
      },
    ],
    ruleOfThumb: 'Haiku for simple tasks, Sonnet for most things, Opus when you genuinely need the deepest reasoning.',
  },
  {
    name: 'Google Gemini',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/models',
    notice: 'Note: Gemini 3 Pro Preview was deprecated and shut down on March 9, 2026. The current flagship is Gemini 3.1 Pro Preview, listed below. All Gemini 3 pricing remains subject to change as models move from preview to stable.',
    models: [
      {
        name: 'Gemini 3.1 Pro (Preview)',
        description: 'Google\'s most advanced Gemini model. Strong reasoning, multimodal capabilities and support for very long context. High performance on complex reasoning benchmarks including ARC-AGI-2.',
        pricing: '$2 per million input tokens, $12 per million output tokens up to 200K context. Pricing increases above 200K.',
        bestFor: 'The most complex reasoning tasks, large document analysis, agentic workflows.',
      },
      {
        name: 'Gemini 3 Flash (Preview)',
        description: 'The fast, cost-efficient Gemini 3 model. Strong performance at a fraction of the Pro price. Supports a context window of up to 1 million tokens.',
        pricing: '$0.50 per million input tokens, $3 per million output tokens.',
        bestFor: 'Everyday tasks, content generation and building in Google AI Studio where the free tier is generous.',
      },
      {
        name: 'Gemini 3.1 Flash-Lite (Preview)',
        description: 'Google\'s fastest and most cost-efficient Gemini 3 model, built for high-volume developer workloads. Supports a context window of up to 1 million tokens. Outperforms 2.5 Flash with significantly faster response times and higher output speed.',
        pricing: '$0.25 per million input tokens, $1.50 per million output tokens.',
        bestFor: 'Translation, classification, content moderation and any high volume task where speed and cost matter most.',
      },
      {
        name: 'Gemini 2.5 Flash',
        description: 'The proven, stable workhorse. Excellent free tier in Google AI Studio makes it the natural starting point for most vibe coders.',
        pricing: '$0.30 per million input tokens, $2.50 per million output tokens.',
        bestFor: 'Getting started, prototyping and any project where you want a stable, well-tested model.',
      },
    ],
    ruleOfThumb: 'Start with 2.5 Flash in Google AI Studio for free. Move to Gemini 3 Flash or Pro as your builds get more complex.',
  },
  {
    name: 'OpenAI GPT',
    docsUrl: 'https://platform.openai.com/docs/pricing',
    notice: 'OpenAI has progressed through the GPT-5 series including GPT-5.4. Pricing can differ slightly by provider and contract so always verify against the official pricing page.',
    models: [
      {
        name: 'GPT-5.4',
        description: 'OpenAI\'s most capable model as of early 2026. Built for complex, high-stakes professional work with enhanced reasoning and large context support.',
        pricing: 'Around $2.50 per million input tokens, $15 per million output tokens. Always confirm against OpenAI\'s current pricing page as this varies slightly by platform.',
        bestFor: 'The most demanding tasks only. Reserve it for complex reasoning, deep analysis and multi-step agentic work.',
      },
      {
        name: 'GPT-5',
        description: 'Released August 2025. Strong general purpose performance at a competitive price point.',
        pricing: '$1.25 per million input tokens, $10 per million output tokens.',
        bestFor: 'Complex professional tasks where you want strong OpenAI capability without the higher GPT-5.4 price tag.',
      },
      {
        name: 'GPT-4o',
        description: 'Still widely used and well supported. Strong multimodal capabilities handling text and images.',
        pricing: '$2.50 per million input tokens, $10 per million output tokens.',
        bestFor: 'Multimodal tasks, applications already built on the GPT-4o ecosystem, broad use cases.',
      },
      {
        name: 'GPT-4o mini',
        description: 'A budget-friendly variant of GPT-4o with strong everyday performance at minimal cost.',
        pricing: 'Approximately $0.15 per million input tokens, $0.60 per million output tokens. Check OpenAI\'s current pricing page for exact values as these vary by SKU.',
        bestFor: 'Simple tasks, high volume applications and use cases where cost efficiency is the priority.',
      },
    ],
    ruleOfThumb: 'GPT-4o mini or smaller GPT-5 family variants for most lightweight tasks, GPT-5 or GPT-4o for more complex work, GPT-5.4 only when you genuinely need the most powerful reasoning available.',
  },
];

// ─── TOOLKIT DATA ────────────────────────────────────────────────────────────

const TOOLKIT_SECTIONS: ToolSection[] = [
  {
    heading: 'Databases and Backend',
    tools: [
      {
        name: 'Supabase',
        weUseThis: true,
        description: 'An open source database platform built on PostgreSQL. Handles user authentication, data storage, real-time updates and file storage. Beginner friendly with a generous free tier and excellent documentation.',
        freeTier: 'Yes. Generous limits for small projects.',
        bestFor: 'Storing user data, building login systems and any app that needs to persist information between sessions.',
        site: 'supabase.com',
      },
      {
        name: 'Firebase',
        description: 'Google\'s backend platform. Similar to Supabase in many ways but proprietary rather than open source. Strong real-time database capabilities and deep integration with other Google services.',
        freeTier: 'Yes. Spark plan is free with usage limits.',
        bestFor: 'Real-time applications, apps already in the Google ecosystem and projects where you want a fully managed backend with minimal setup.',
        site: 'firebase.google.com',
      },
      {
        name: 'PlanetScale',
        description: 'A MySQL-compatible serverless database platform known for its ability to scale without downtime. Popular with production applications that need to grow quickly.',
        freeTier: 'Limited. Check current plans.',
        bestFor: 'Production-grade applications that need a scalable relational database.',
        site: 'planetscale.com',
      },
    ],
  },
  {
    heading: 'Deployment and Hosting',
    tools: [
      {
        name: 'Vercel',
        weUseThis: true,
        description: 'The most popular deployment platform for modern web apps. Connects directly to GitHub and deploys automatically every time you push an update. Excellent free tier and extremely fast global content delivery.',
        freeTier: 'Yes. Generous hobby tier for personal projects.',
        bestFor: 'Deploying Next.js apps and any frontend project. The go-to choice for most vibe coded projects.',
        site: 'vercel.com',
      },
      {
        name: 'Railway',
        weUseThis: true,
        description: 'A simple, developer-friendly hosting platform that supports a wider range of project types than Vercel including backends, databases and scheduled tasks. Good for full-stack apps that need more than just frontend hosting.',
        freeTier: 'Yes. Limited free tier available.',
        bestFor: 'Full-stack apps, backend services and projects that need a database and a server running together.',
        site: 'railway.app',
      },
      {
        name: 'Render',
        description: 'Similar to Railway. Easy to deploy backends, databases and scheduled jobs. Known for being straightforward and affordable.',
        freeTier: 'Yes. Free tier available with some limitations on sleep behaviour.',
        bestFor: 'Backend APIs, Node.js servers and apps that need always-on hosting at low cost.',
        site: 'render.com',
      },
      {
        name: 'Netlify',
        description: 'A frontend hosting and deployment platform similar to Vercel. Strong support for static sites, serverless functions and form handling built in.',
        freeTier: 'Yes. Generous free tier for personal projects.',
        bestFor: 'Static sites, landing pages and projects that do not need a complex backend.',
        site: 'netlify.com',
      },
    ],
  },
  {
    heading: 'Automation and Workflows',
    tools: [
      {
        name: 'Make.com',
        weUseThis: true,
        description: 'A visual automation platform that connects apps and services through drag and drop workflows called scenarios. No code required. Extremely powerful for automating repetitive business processes.',
        freeTier: 'Yes. 1,000 operations per month on the free plan.',
        bestFor: 'Connecting your apps together, automating workflows and triggering actions based on events. Used extensively inside the Vibe Coding Lab for membership automation.',
        site: 'make.com',
      },
      {
        name: 'n8n',
        description: 'An open source automation platform similar to Make.com but with the option to self-host for full control and lower costs at scale. More technical than Make but more flexible.',
        freeTier: 'Yes. Free to self-host. Cloud version has a free tier.',
        bestFor: 'Developers who want more control over their automations or need to process high volumes without per-operation costs.',
        site: 'n8n.io',
      },
      {
        name: 'Zapier',
        description: 'The original no-code automation platform. Enormous library of app integrations. Easier to use than Make or n8n but more limited and more expensive at scale.',
        freeTier: 'Yes. Limited to 100 tasks per month on the free plan.',
        bestFor: 'Simple automations between popular apps where ease of use matters more than cost or complexity.',
        site: 'zapier.com',
      },
    ],
  },
  {
    heading: 'Payments',
    tools: [
      {
        name: 'Stripe',
        description: 'The industry standard payment processing platform. Handles one-time payments, subscriptions, invoicing and much more. Excellent documentation and developer experience.',
        freeTier: 'No monthly fee. Charges a percentage per transaction (typically 1.4% plus 20p for European cards).',
        bestFor: 'Any app that needs to take payments. The default choice for most vibe coded products.',
        site: 'stripe.com',
      },
    ],
  },
  {
    heading: 'UI and Styling',
    tools: [
      {
        name: 'Tailwind CSS',
        description: 'A utility-first CSS framework that lets you style your application by applying pre-built class names directly in your code. Extremely popular in modern web development and used by default in many Antigravity projects.',
        freeTier: 'Free and open source.',
        bestFor: 'Styling any web app quickly without writing custom CSS from scratch.',
        site: 'tailwindcss.com',
      },
      {
        name: 'Shadcn UI',
        description: 'A collection of beautifully designed, accessible UI components built on top of Tailwind CSS. Not a traditional component library — you copy the components directly into your project and own them completely.',
        freeTier: 'Free and open source.',
        bestFor: 'Building polished interfaces quickly using pre-built components like buttons, modals, forms and cards.',
        site: 'ui.shadcn.com',
      },
    ],
  },
  {
    heading: 'Version Control',
    tools: [
      {
        name: 'GitHub',
        description: 'The most widely used platform for storing and managing code repositories. Connects directly to Vercel, Railway and most other deployment platforms for automatic deployments.',
        freeTier: 'Yes. Unlimited public and private repositories on the free plan.',
        bestFor: 'Storing your project code, tracking changes and enabling automatic deployments. Essential for any serious vibe coded project.',
        site: 'github.com',
      },
    ],
  },
];

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function parseFreeTier(freeTier: string): { label: string; detail: string } {
  const dotIdx = freeTier.indexOf('. ');
  if (dotIdx !== -1) {
    return { label: freeTier.substring(0, dotIdx), detail: freeTier.substring(dotIdx + 2) };
  }
  return { label: freeTier.replace(/\.$/, ''), detail: '' };
}

function FreeTierPill({ text }: { text: string }) {
  let cls = '';
  if (text.startsWith('Yes') || text.startsWith('Free')) {
    cls = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  } else if (text.startsWith('Limited') || text.startsWith('No monthly')) {
    cls = 'bg-amber-50 text-amber-700 border border-amber-200';
  } else {
    cls = 'bg-gray-100 text-gray-500 border border-gray-200';
  }
  return <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${cls}`}>{text}</span>;
}

// ─── SHARED CTA ───────────────────────────────────────────────────────────────

function PlaybookCTA() {
  return (
    <div className="bg-forest-green text-warm-cream px-8 py-16 md:px-16 md:py-24 text-center">
      <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-6 leading-tight">
        Ready to Build?
      </h2>
      <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-2xl mx-auto mb-10">
        The Vibe Playbook is just the starting point. Join the Vibe Coding Lab to put this knowledge into practice, access real AI-powered tools and build alongside a community of entrepreneurs who are done watching from the sidelines.
      </p>
      <a
        href="https://thevibecodinglab.co"
        className="inline-flex items-center bg-terracotta text-white px-10 py-5 rounded-2xl text-lg font-extrabold hover:bg-burnt-orange hover:scale-105 transition-all shadow-2xl shadow-black/20"
      >
        Join the Vibe Coding Lab
      </a>
    </div>
  );
}

// ─── GLOSSARY TAB ─────────────────────────────────────────────────────────────

function GlossaryTab() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    return GLOSSARY_TERMS.filter(t => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q) || t.example.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const resultLabel = activeCategory === 'All'
    ? `Showing ${filtered.length} terms`
    : `Showing ${filtered.length} terms in ${activeCategory}`;

  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="text-xl opacity-80 mb-10 leading-relaxed">
        Every term you will encounter on your vibe coding journey, explained in plain English with real examples. Search for a term or filter by category.
      </p>

      {/* Search + Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/40 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search for a term..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-forest-green/10 focus:outline-none focus:border-terracotta transition-colors text-base"
          />
        </div>
        <select
          value={activeCategory}
          onChange={e => setActiveCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white border border-forest-green/10 focus:outline-none focus:border-terracotta transition-colors text-sm font-bold text-forest-green cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23163020%22%20fill-opacity%3D%220.4%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center]"
        >
          {GLOSSARY_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <p className="text-sm font-bold opacity-50 mb-8">{resultLabel}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-24 opacity-40">
          <p className="text-xl font-bold">No terms match your search.</p>
          <p className="text-sm mt-2">Try a different word or clear the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(t => (
            <div key={t.term} className="bg-white rounded-2xl p-6 border border-forest-green/5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-display font-extrabold text-forest-green leading-tight min-w-0">{t.term}</h3>
                <span className="bg-sand text-forest-green/60 text-xs font-bold px-3 py-1 rounded-full shrink-0 mt-0.5 whitespace-nowrap">{t.category}</span>
              </div>
              <p className="text-base opacity-80 leading-relaxed">{t.definition}</p>
              <div className="border-l-4 border-terracotta/50 pl-4 mt-1">
                <p className="text-sm italic opacity-65 leading-relaxed">{t.example}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <PlaybookCTA />
    </>
  );
}

// ─── FILE TYPES TAB ───────────────────────────────────────────────────────────

function FileTypesTab() {
  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="text-xl opacity-80 mb-12 leading-relaxed">
        Every file you encounter when vibe coding belongs to a category. Understanding what each file type does and when you will encounter it removes a lot of the mystery from building. Use this as a quick reference when you see an unfamiliar extension in your project.
      </p>
      {FILE_TYPE_SECTIONS.map(section => (
        <div key={section.heading} className="mb-14">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold mb-2">{section.heading}</h2>
          <p className="text-base opacity-55 mb-6 italic">{section.intro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.files.map(file => (
              <div key={file.ext} className="bg-white rounded-2xl p-6 border border-forest-green/5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <code className="text-sm font-extrabold bg-terracotta/10 text-terracotta px-3 py-1 rounded-lg whitespace-nowrap">{file.ext}</code>
                  <h3 className="text-lg font-display font-extrabold">{file.name}</h3>
                </div>
                <p className="text-base opacity-80 leading-relaxed">{file.description}</p>
                <p className="text-sm italic opacity-60 leading-relaxed border-l-4 border-terracotta/30 pl-4">{file.whenToUse}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <PlaybookCTA />
    </>
  );
}

// ─── AI MODELS TAB ────────────────────────────────────────────────────────────

function AIModelsTab() {
  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="text-xl opacity-80 mb-8 leading-relaxed">
        Every time your app calls an AI model it uses tokens and every token costs money. Understanding which models exist, what they are good at and how much they cost is one of the most important skills you will develop as a vibe coder. Use the cheapest model that can do the job well enough. Save the powerful models for tasks that genuinely need them.
      </p>

      {/* Disclaimer */}
      <div className="border border-terracotta/30 bg-terracotta/5 rounded-2xl p-5 mb-12 text-sm leading-relaxed text-forest-green/80">
        <strong className="text-forest-green">DISCLAIMER:</strong> AI models and their pricing change faster than almost anything else in technology. The information below was accurate in March 2026. Always check the official documentation before building at scale. Links to official sources are provided for each provider.
      </div>

      {AI_PROVIDERS.map(provider => (
        <div key={provider.name} className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold">{provider.name}</h2>
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-terracotta hover:text-burnt-orange flex items-center gap-1 transition-colors"
            >
              Official docs <ExternalLink size={13} />
            </a>
          </div>

          {provider.notice && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-700 font-medium leading-relaxed">
              {provider.notice}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {provider.models.map(model => (
              <div key={model.name} className="bg-white rounded-2xl p-6 border border-forest-green/5 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-display font-extrabold">{model.name}</h3>
                <p className="text-base opacity-80 leading-relaxed">{model.description}</p>
                <div className="bg-sand rounded-xl px-4 py-3 text-sm font-bold text-forest-green leading-relaxed">
                  {model.pricing}
                </div>
                <p className="text-sm opacity-70 leading-relaxed">
                  <span className="font-bold">Best for:</span> {model.bestFor}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-sand/60 rounded-2xl px-6 py-4 text-base font-medium italic opacity-75">
            Rule of thumb: {provider.ruleOfThumb}
          </div>
        </div>
      ))}

      {/* Choosing the Right Model */}
      <div className="bg-forest-green text-warm-cream rounded-3xl p-8 md:p-12 mt-4">
        <h2 className="text-2xl md:text-4xl font-display font-extrabold mb-8 leading-tight">
          Choosing the Right Model: A Simple Framework
        </h2>
        <p className="text-lg opacity-80 mb-8 leading-relaxed">Ask yourself three questions before choosing a model:</p>
        <div className="space-y-6 mb-10 text-lg leading-relaxed">
          <p>
            <strong>How complex is the task?</strong>{' '}
            <span className="opacity-80">Simple and well-defined tasks can use cheaper, faster models. Complex multi-step reasoning tasks need more capable models.</span>
          </p>
          <p>
            <strong>How many times will this run?</strong>{' '}
            <span className="opacity-80">If your app calls a model thousands of times a day, the cost difference compounds dramatically. A cheap model for high volume tasks can save you significant money at scale.</span>
          </p>
          <p>
            <strong>How important is the output?</strong>{' '}
            <span className="opacity-80">If getting it wrong has real consequences, use a more capable model. If it is a rough draft or a quick summarisation, a cheaper model is fine.</span>
          </p>
        </div>

        <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-6">Rough Guide by Task Type</p>
        <div className="space-y-5">
          {[
            {
              label: 'Simple tasks like classification, quick edits, summarisation',
              models: ['Claude Haiku', 'Gemini Flash-Lite', 'GPT-4o mini'],
            },
            {
              label: 'Everyday tasks like content generation, feature building, general coding',
              models: ['Claude Sonnet', 'Gemini Flash', 'GPT-5'],
            },
            {
              label: 'Complex tasks like architecture decisions, large codebase analysis, deep reasoning',
              models: ['Claude Opus', 'Gemini 3.1 Pro', 'GPT-5.4'],
            },
          ].map((row, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-sm opacity-80 sm:flex-1 leading-relaxed">{row.label}:</p>
              <div className="flex flex-wrap gap-2 shrink-0">
                {row.models.map(m => (
                  <span key={m} className="bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <PlaybookCTA />
    </>
  );
}

// ─── TOOLKIT TAB ──────────────────────────────────────────────────────────────

function ToolkitTab() {
  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="text-xl opacity-80 mb-12 leading-relaxed">
        A growing reference of the tools that power modern vibe coded projects. What each one does, whether it has a free tier and what it is best used for. Tools marked with a We Use This badge are ones we actively use inside the Vibe Coding Lab.
      </p>
      {TOOLKIT_SECTIONS.map(section => (
        <div key={section.heading} className="mb-14">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold mb-6">{section.heading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.tools.map(tool => {
              const { label: ftLabel, detail: ftDetail } = parseFreeTier(tool.freeTier);
              return (
                <div key={tool.name} className="bg-white rounded-2xl p-6 border border-forest-green/5 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
                  {/* Name + badge */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-display font-extrabold">{tool.name}</h3>
                    {tool.weUseThis && (
                      <span className="bg-terracotta text-white text-xs font-bold px-3 py-1 rounded-full shrink-0">We Use This</span>
                    )}
                  </div>
                  {/* Description */}
                  <p className="text-base opacity-80 leading-relaxed">{tool.description}</p>
                  {/* Free tier */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold">Free tier:</span>
                      <FreeTierPill text={ftLabel} />
                    </div>
                    {ftDetail && (
                      <p className="text-xs opacity-50 leading-relaxed mt-1">{ftDetail}</p>
                    )}
                  </div>
                  {/* Best for */}
                  <p className="text-sm opacity-70 leading-relaxed">
                    <span className="font-bold">Best for:</span> {tool.bestFor}
                  </p>
                  {/* Official site */}
                  <p className="text-sm">
                    <span className="font-bold">Official site:</span>{' '}
                    <a
                      href={`https://${tool.site}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terracotta hover:text-burnt-orange transition-colors font-bold inline-flex items-center gap-1"
                    >
                      {tool.site} <ExternalLink size={13} />
                    </a>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
    <PlaybookCTA />
    </>
  );
}

// ─── TABS CONFIG ─────────────────────────────────────────────────────────────

const TABS = [
  { id: 'glossary', label: 'Glossary' },
  { id: 'file-types', label: 'File Types' },
  { id: 'ai-models', label: 'AI Models' },
  { id: 'toolkit', label: 'The Toolkit' },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function VibePlaybook() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'glossary';

  const setTab = (id: string) => setSearchParams({ tab: id });

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green font-sans selection:bg-terracotta selection:text-white scroll-smooth">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-warm-cream/80 backdrop-blur-md border-b border-forest-green/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-lg md:text-2xl font-display font-extrabold tracking-tighter">
            VIBE<span className="text-terracotta">CODING</span>LAB
          </Link>
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-terracotta text-white px-4 md:px-6 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-burnt-orange hover:scale-105 transition-all shadow-lg shadow-terracotta/20 whitespace-nowrap"
          >
            Get Lifetime Access
          </Link>
        </div>
      </nav>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-32 pb-12 px-6 text-center"
      >
        <div className="inline-block bg-sand px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
          Handy Resource
        </div>
        <h1 className="text-4xl md:text-7xl font-display font-extrabold leading-[0.95] tracking-tighter mb-6">
          The Vibe Playbook
        </h1>
        <p className="text-xl md:text-2xl font-medium opacity-80 max-w-2xl mx-auto leading-relaxed">
          Everything you need to understand the language, tools and technology behind vibe coding. Use this as your reference guide as you build.
        </p>
      </motion.div>

      {/* Sticky Tab Bar */}
      <div className="sticky top-[65px] z-40 bg-warm-cream/95 backdrop-blur-md border-b border-forest-green/8 px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-start sm:justify-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-terracotta text-white shadow-md shadow-terracotta/20'
                    : 'bg-warm-cream border border-forest-green/15 text-forest-green hover:border-terracotta/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'glossary' && <GlossaryTab />}
        {activeTab === 'file-types' && <FileTypesTab />}
        {activeTab === 'ai-models' && <AIModelsTab />}
        {activeTab === 'toolkit' && <ToolkitTab />}
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 text-center opacity-40 text-xs font-bold uppercase tracking-widest border-t border-forest-green/5">
        © 2026 Vibe Coding Lab by Ascendz | All Rights Reserved
      </footer>
    </div>
  );
}
