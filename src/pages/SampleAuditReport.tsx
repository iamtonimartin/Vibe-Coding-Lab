import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ArrowUp, FileText } from 'lucide-react';

const BASE = '/sampleauditreport';

// Google Docs "/copy" opens the make-your-own-copy dialog rather than the doc,
// so nobody lands on a read-only original and starts typing into it.
const TEMPLATE_URL = 'https://docs.google.com/document/d/1KHylNBCZn24arChXNKleYIAMZZA4nP28/copy';

// Same fractal noise the landing page and the audit deck use.
const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const Grain = ({ dark = false }: { dark?: boolean }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 ${
      dark ? 'opacity-[0.07] mix-blend-overlay' : 'opacity-[0.035] mix-blend-multiply'
    }`}
    style={{ backgroundImage: NOISE }}
  />
);

// ─── SHARED PIECES ───────────────────────────────────────────────────────────

const Eyebrow = ({ children, dark = false }: { children: ReactNode; dark?: boolean }) => (
  <div
    className={`flex items-center gap-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.22em] mb-5 md:mb-8 ${
      dark ? 'text-terracotta' : 'text-terracotta'
    }`}
  >
    <span className="w-7 h-0.5 bg-current shrink-0" />
    {children}
  </div>
);

// Terracotta italic accent used inside headings.
const A = ({ children }: { children: ReactNode }) => (
  <em className="text-terracotta font-normal italic">{children}</em>
);

const Callout = ({ children }: { children: ReactNode }) => (
  <div className="bg-forest-green text-sand/90 rounded-2xl md:rounded-3xl p-6 md:p-8 my-7 max-w-[44em] [&_p]:mb-0 [&_p+p]:mt-4 [&_strong]:text-white">
    {children}
  </div>
);

const Hot = ({ children }: { children: ReactNode }) => (
  <div className="bg-[#fbeee8] border border-terracotta/30 border-l-[3px] border-l-terracotta rounded-2xl p-5 md:p-6 my-7 max-w-[44em] [&_p]:mb-0 [&_p]:text-forest-green [&_strong]:text-terracotta">
    {children}
  </div>
);

const H4 = ({ children }: { children: ReactNode }) => (
  <h4 className="font-display font-extrabold text-forest-green text-lg md:text-2xl leading-tight tracking-tight mt-10 mb-3">
    {children}
  </h4>
);

const H5 = ({ children }: { children: ReactNode }) => (
  <h5 className="font-sans font-extrabold text-terracotta text-[11px] md:text-xs uppercase tracking-[0.12em] mt-10 mb-3">
    {children}
  </h5>
);

/**
 * Tables become stacked, labelled cards under md. Same data drives both, so the
 * mobile view can never drift from the desktop one.
 */
function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="my-7">
      <table className="hidden md:table w-full border-collapse text-[15px]">
        <thead>
          <tr>
            {head.map(h => (
              <th
                key={h}
                className="text-left font-sans font-extrabold text-[10.5px] uppercase tracking-[0.1em] text-terracotta pb-3 pr-4 align-top border-b-2 border-terracotta/25"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, k) => (
                <td
                  key={k}
                  className={`py-3.5 pr-4 align-top leading-relaxed border-t border-forest-green/10 ${
                    k === 0 ? 'text-forest-green font-bold' : 'text-forest-green/70'
                  }`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="md:hidden flex flex-col gap-3">
        {rows.map((r, i) => (
          <div
            key={i}
            className="bg-white border border-forest-green/10 rounded-2xl p-4 flex flex-col gap-3"
          >
            {r.map((c, k) => (
              <div key={k}>
                <div className="font-extrabold text-[10px] uppercase tracking-[0.09em] text-terracotta mb-1">
                  {head[k]}
                </div>
                <div
                  className={`text-[15px] leading-snug ${
                    k === 0 ? 'text-forest-green font-bold' : 'text-forest-green/70'
                  }`}
                >
                  {c}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="sticky top-0 z-50 bg-forest-green/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between gap-4">
        <Link to={BASE} className="font-display font-extrabold text-sand text-sm tracking-tight">
          VIBE<span className="text-terracotta">CODING</span>LAB
        </Link>
        <nav className="flex items-center gap-5 md:gap-6">
          <Link
            to={BASE}
            className="hidden sm:block text-[13px] font-bold text-sand/75 hover:text-sand transition-colors"
          >
            Contents
          </Link>
          <Link
            to={`${BASE}/summary`}
            className="hidden md:block text-[13px] font-bold text-sand/75 hover:text-sand transition-colors"
          >
            Summary
          </Link>
          <Link
            to={`${BASE}/proposal`}
            className="hidden md:block text-[13px] font-bold text-sand/75 hover:text-sand transition-colors"
          >
            Proposal
          </Link>
          <a
            href={TEMPLATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-terracotta text-white px-4 py-2 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider hover:bg-burnt-orange transition-colors whitespace-nowrap"
          >
            Copy the template
          </a>
        </nav>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative bg-forest-green text-sand/70 py-12 md:py-16 text-center overflow-hidden">
      <Grain dark />
      <div className="relative max-w-5xl mx-auto px-5 md:px-8">
        <div className="font-display font-extrabold text-sand text-xl tracking-tight">
          VIBE<span className="text-terracotta">CODING</span>LAB
        </div>
        <div className="italic text-sand/60 mt-1 mb-8">The Art of the Audit</div>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={TEMPLATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-terracotta text-white px-6 py-3.5 rounded-full text-sm font-extrabold hover:bg-burnt-orange transition-colors"
          >
            <FileText className="w-4 h-4" /> Make your own copy
          </a>
          <Link
            to="/artoftheaudit"
            className="inline-flex items-center gap-2 border border-white/25 text-sand px-6 py-3.5 rounded-full text-sm font-extrabold hover:border-white hover:text-white transition-colors"
          >
            Back to the session
          </Link>
        </div>
        <div className="h-px bg-white/10 my-9" />
        <div className="text-[13px] leading-relaxed text-sand/50">
          A fictional worked example, built for The Art of the Audit.
          <br />
          Keep the shape, swap in your client and write it in your own voice.
        </div>
      </div>
    </footer>
  );
}

// ─── CHAPTERS ────────────────────────────────────────────────────────────────

type Chapter = {
  slug: string;
  num: string;
  label: string;
  title: ReactNode;
  blurb: string;
  body: ReactNode;
};

const CHAPTERS: Chapter[] = [
  {
    slug: 'summary',
    num: '01',
    label: 'Summary',
    title: (
      <>
        You asked where to start with AI. <A>The answer is: not with AI.</A>
      </>
    ),
    blurb:
      'The honest answer is that AI is not your first move. This report explains why not and what to do instead.',
    body: (
      <>
        <p>
          Maple and Moss has built something solid. Twelve years, twenty-four people, a contract book
          most firms in the sector would want and a reputation that wins work without much selling.
          The instinct that the business is falling behind on technology is correct. The conclusion
          that the answer is to buy or build some AI is not, at least not yet.
        </p>
        <p>
          Over one day onsite and five conversations, a consistent picture emerged. Almost nothing
          about a job exists in a form a computer could read. Work is scheduled in one spreadsheet
          that one person can drive. Jobs are recorded on paper, photographed and sent in by chat.
          Invoices are re-keyed by hand from those photos, weeks after the work was done. Nobody can
          answer "is that job finished" without ringing somebody.
        </p>
        <p>
          None of this is the team's fault. They have built workarounds for everything the business
          never gave them. Those workarounds are impressive. They are also the reason AI cannot help
          you yet.
        </p>
        <Callout>
          <p>
            <strong>The gap worth naming.</strong> The brief was where do we start with AI. Every
            conversation after that pointed at something underneath it. AI needs something to read.
            Right now your operation leaves almost no readable trace.
          </p>
          <p>
            Buying an AI tool today would put a very clever thing on top of paper, photographs and a
            chat thread. It would tell you nothing you do not already know. That is not a reason to
            give up on AI. It is the reason to do one thing first.
          </p>
        </Callout>
        <H5>The four findings in short</H5>
        <ul className="list-none p-0 my-6 max-w-[44em]">
          {[
            [
              '01',
              'A job exists on paper and nowhere else.',
              'Written on a sheet, photographed and sent in. Nothing structured survives.',
            ],
            [
              '02',
              "The schedule lives in one spreadsheet, in one person's head.",
              'The business stops when that person is away.',
            ],
            [
              '03',
              'Invoices are re-keyed by hand, weeks late.',
              'Twice-entered and slow, so the cash arrives later than it should.',
            ],
            [
              '04',
              'Nobody can answer a simple question without a phone call.',
              'Where is the team, was the job done, was it signed off.',
            ],
          ].map(([n, b, x]) => (
            <li
              key={n}
              className="grid grid-cols-[auto_1fr] gap-4 py-3.5 border-t border-forest-green/10 first:border-t-0"
            >
              <span className="font-mono font-bold text-terracotta text-[13px] pt-0.5">{n}</span>
              <span>
                <b className="block text-forest-green font-extrabold mb-0.5">{b}</b>
                {x}
              </span>
            </li>
          ))}
        </ul>
        <H5>The recommendation, in one sentence</H5>
        <p>
          Before buying or building any AI, give the business one reliable record of a job, from
          scheduled to done to invoiced, in place before the new contract starts. Then AI stops being
          a guess and becomes an obvious next step with real data underneath it.
        </p>
      </>
    ),
  },
  {
    slug: 'context',
    num: '02',
    label: 'Context',
    title: (
      <>
        Why this is <A>the moment</A> to look.
      </>
    ),
    blurb:
      'Twenty-four staff, a growing contract book and a new contract in ten weeks that adds forty per cent more sites.',
    body: (
      <>
        <p>
          Maple and Moss provides commercial grounds maintenance across business parks, schools and
          housing developments. Elena founded it twelve years ago with a van and one contract. It now
          runs six teams, eighteen people out on the road and six in the office.
        </p>
        <p>
          Three things make this the right moment to look hard at how the business runs. The contract
          book has grown steadily for four years and the operation has absorbed it through effort
          rather than systems. The office team has not grown at the same rate, so the same six people
          are handling considerably more. And the largest contract the business has ever won starts
          in ten weeks, adding roughly forty per cent more sites.
        </p>
        <p>
          The instinct behind the brief is sound. The business is behind on technology and it is
          starting to cost real money. This report is about doing something about that in the right
          order.
        </p>
      </>
    ),
  },
  {
    slug: 'what-we-looked-at',
    num: '03',
    label: 'What we looked at',
    title: (
      <>
        The most useful hour was <A>spent in a van.</A>
      </>
    ),
    blurb:
      'One day onsite and five conversations. What the office believes and what the road teams experience turned out to be two different pictures.',
    body: (
      <>
        <p>
          The audit ran across one day onsite and five conversations with the people who actually do
          the work, including a morning out with a road team.
        </p>
        <p>
          The approach had three parts. A look across the tools in use, from the scheduling
          spreadsheet to the accounting software to the chat groups. A conversation with each person
          about their own day, where the time goes and what they work around. And a quiet mapping of
          where the same piece of information is written down more than once, which is usually where
          the risk is hiding.
        </p>
        <p>
          The most useful hour was not spent looking at software. It was spent in a van. What the
          office believes happens on a site and what actually happens are two different stories. The
          second one is the one this report is built on. The founder can tell you the plan. Only the
          people doing the work can tell you where it breaks.
        </p>
        <p>
          We spoke to the founder, the operations lead, the office coordinator, the accounts
          assistant and a team leader. Their focus areas are listed in the appendix. Everything that
          follows relates to processes and systems, not to individuals.
        </p>
      </>
    ),
  },
  {
    slug: 'findings',
    num: '04',
    label: 'Findings',
    title: (
      <>
        Where the operation pays <A>a daily tax.</A>
      </>
    ),
    blurb:
      "Four findings. Every one of them is a place where a job exists only in someone's head, on paper or in a chat thread.",
    body: (
      <>
        <p className="italic text-lg md:text-xl text-forest-green/70 leading-snug mb-8 max-w-[34em]">
          What follows is not a list of complaints. It is a map of where the operation is paying a
          daily tax that grows with every site added.
        </p>

        <H4>Finding 01 &middot; A job exists on paper and nowhere else</H4>
        <p>
          Every job is written up on a paper sheet on site. At the end of the day it is photographed
          and sent into the office on a chat group. Someone in the office reads the photograph and
          does something with it.
        </p>
        <p>
          Marcus, who leads a team, has done it this way for nine years and is fast at it. But once
          that photo lands in a chat thread, the job is effectively gone. It cannot be searched,
          counted, reported on or checked. It exists as an image in a conversation.
        </p>
        <p>
          <strong>Why it matters.</strong> Everything the business might want to know later, which
          sites take longer than quoted, which jobs get queried, how much a contract really costs to
          service, is locked inside photographs of handwriting. And it is the single reason AI cannot
          help you today. There is nothing for it to read.
        </p>

        <H4>Finding 02 &middot; The schedule lives in one spreadsheet, in one person's head</H4>
        <p>
          Sam builds next week's schedule in a spreadsheet every Thursday. It works well, because Sam
          has been doing it for six years and knows which teams suit which sites, who is on holiday
          and which client will ring if the visit slips.
        </p>
        <p>
          Almost none of that reasoning is written down. The spreadsheet is the output. The logic is
          in Sam's head.
        </p>
        <p>
          <strong>Why it matters.</strong> When Sam is off, scheduling either does not happen or
          happens badly. As the operation grows the spreadsheet gets harder to hold. The day Sam
          leaves, six years of judgement leaves with them. This is the most valuable knowledge in the
          business and it is the least protected.
        </p>

        <H4>Finding 03 &middot; Invoices are re-keyed by hand, weeks late</H4>
        <p>
          Dan invoices from the job photos. He works through the chat history, reads what was done,
          matches it to a contract and types it into the accounting software. It takes days each
          month. Because the photos arrive in a stream rather than a list, work is occasionally
          missed entirely.
        </p>
        <p>
          <strong>Why it matters.</strong> The same information is entered twice, once by hand on
          site and once by hand in the office. The second time is a fortnight or more after the
          first. The business is invoicing later than it needs to, which is a cash flow cost. Every
          missed job is revenue that simply never gets billed.
        </p>

        <H4>Finding 04 &middot; Nobody can answer a simple question without a phone call</H4>
        <p>
          When a client rings to ask whether a visit happened, Priya cannot answer from a screen. She
          rings the team, waits for the evening photo or checks the schedule and assumes. The same is
          true internally: where is a team, is that job done, was it signed off.
        </p>
        <p>
          <strong>Why it matters.</strong> Every one of those questions is answered by interrupting
          somebody. It is slow. It makes the business look less organised than it is. And it scales
          badly. Forty per cent more sites means forty per cent more of those calls.
        </p>
      </>
    ),
  },
  {
    slug: 'risk',
    num: '05',
    label: 'Risk',
    title: (
      <>
        The same findings, <A>read forward in time.</A>
      </>
    ),
    blurb:
      'Five risks that grow with every site added. Each is real today. Each is removed by the same foundation.',
    body: (
      <>
        <p>
          The findings describe what is happening now. Read as risks, they describe what happens as
          the business grows.
        </p>
        <DataTable
          head={['Risk', 'What is happening today', 'How it grows', 'What removes it']}
          rows={[
            [
              'The business cannot see itself',
              'Job records exist only as photos in a chat thread',
              'Every new site adds volume nobody can count or report on',
              'A structured job record, captured once, on site',
            ],
            [
              'Scheduling is one person deep',
              "Six years of judgement lives in Sam's head, not in the system",
              'More teams and sites make the spreadsheet harder to hold. A leaver takes it all',
              'Scheduling logic captured in a system the team shares',
            ],
            [
              'Cash arrives late',
              'Invoicing is re-keyed by hand from photos, weeks after the work',
              'More jobs, more re-keying, later cash, more missed billing',
              'Invoices drawn from the job record automatically',
            ],
            [
              'No evidence a job was done',
              'Sign-off is a photograph of a signature, if it happened',
              'Disputes become likelier as client numbers rise',
              'Time-stamped, photographed sign-off attached to the job',
            ],
            [
              'AI cannot be adopted at all',
              'There is no readable data for any tool to work from',
              'The gap between ambition and reality widens each year',
              'One reliable record of a job, which is the precondition for everything else',
            ],
          ]}
        />
      </>
    ),
  },
  {
    slug: 'cost-of-standing-still',
    num: '06',
    label: 'Cost of standing still',
    title: (
      <>
        The new contract is <A>the deadline,</A> whether you like it or not.
      </>
    ),
    blurb:
      'Not a systems failure. A systems absence. Every gap is filled by a person. Every one of those is a risk waiting.',
    body: (
      <>
        <p>
          The current operation does not have a systems failure. It has a systems absence. Every gap
          is filled by a person doing something by hand. Every one of those workarounds is a risk
          waiting for the day it does not get done.
        </p>
        <p>
          This holds at today's size because a capable team compensates with effort and care. The
          schedule works because Sam makes it work. Invoices go out because Dan reads every photo.
          Clients are answered because Priya makes the calls.
        </p>
        <p>
          In ten weeks the largest contract in the company's history starts and adds roughly forty
          per cent more sites. The same six people in the office absorb all of it. The scheduling
          spreadsheet gets harder. The chat thread gets longer. Invoicing takes days that do not
          exist. The probability of a missed job, a late invoice or a dispute nobody can settle rises
          with every site.
        </p>
        <p>
          And a year from now, the AI question is still on the table, still unanswerable, because
          nothing underneath it has changed.
        </p>
        <Hot>
          <p>
            <strong>
              The right time to fix this is before the contract starts, not during it.
            </strong>
          </p>
        </Hot>
      </>
    ),
  },
  {
    slug: 'what-good-looks-like',
    num: '07',
    label: 'What good looks like',
    title: (
      <>
        One reliable record of a job. <A>Then AI has something to work with.</A>
      </>
    ),
    blurb:
      'Captured once, on site, by the person doing the work. That single change removes most of this report.',
    body: (
      <>
        <p>
          <strong>One reliable record of a job.</strong> A job is scheduled, done, signed off and
          invoiced. Every one of those things happens against the same record. Captured once, on
          site, on a phone, by the person doing the work. Not typed twice. Not photographed. Not lost
          in a chat thread.
        </p>
        <p>
          That single change removes most of this report. The schedule stops being one person's
          spreadsheet. Invoicing stops being archaeology. Priya answers a client from a screen.
          Marcus stops filling in paper.
        </p>
        <Callout>
          <p>
            <strong>And then AI has something to work with.</strong> This is the part worth being
            precise about, because it is what was actually asked. Once a job leaves a clean,
            structured trace, the AI question stops being "what should we buy" and starts being
            obvious. Drafting quotes from what similar sites actually took. Showing which contracts
            are genuinely profitable rather than which feel busy. Answering "which sites have we
            missed this month" in a sentence.
          </p>
          <p>None of that is exotic. All of it is impossible today.</p>
        </Callout>
        <p>The order matters. Foundation, then intelligence on top of it. Not the other way round.</p>
      </>
    ),
  },
  {
    slug: 'roadmap',
    num: '08',
    label: 'Roadmap',
    title: (
      <>
        Foundation first. <A>Intelligence on top.</A>
      </>
    ),
    blurb: 'What to do first, in what order and the one thing not to do yet.',
    body: (
      <>
        <p>
          <strong>Before the new contract starts, the next ten weeks.</strong> Get jobs off paper.
          One structured job record, captured on site, replacing the sheet and the photo. This is the
          non-negotiable. The contract is the deadline.
        </p>
        <p>
          <strong>The following month.</strong> Connect that record to invoicing, so Dan bills from
          the job rather than from a photograph of it.
        </p>
        <p>
          <strong>Then.</strong> Bring scheduling into the same system, so the logic in Sam's head
          becomes something the business owns.
        </p>
        <p>
          <strong>Only after all of that.</strong> Look at AI properly. By then there is real data,
          so the conversation is specific rather than speculative.
        </p>
        <p>
          <strong>Quick wins to do straight away, regardless.</strong> Back up the scheduling
          spreadsheet daily and agree who owns it. Ask Sam to spend an hour writing down the rules
          they use when building the schedule. Neither waits on a build. The second one protects the
          most valuable knowledge in the business.
        </p>
        <Hot>
          <p>
            <strong>One thing not to do.</strong> Do not buy an AI tool yet. Not this quarter, not
            for this problem. Anything you bought today would sit on top of paper and a chat thread
            and tell you nothing you do not already know. Worse, it would sour the whole idea of AI
            for the team just as you need them behind it.
          </p>
        </Hot>
      </>
    ),
  },
  {
    slug: 'proposal',
    num: '09',
    label: 'Proposal',
    title: (
      <>
        A low risk <A>way to start.</A>
      </>
    ),
    blurb:
      'The work that follows, priced, with every step already paid for rolling into the next.',
    body: (
      <>
        <p>
          <strong>Discovery.</strong> A short, paid piece of work that turns this audit into a
          defined build plan: exactly what the job record captures, how it connects to the accounting
          software and a firm price. You own the plan whether or not you go further. This is the
          natural place to start.
        </p>
        <p>
          <strong>The build.</strong> The job record first, then invoicing, then scheduling, priced
          individually so you commission what you need when you need it.
        </p>
        <p>
          <strong>On the numbers.</strong> This audit is charged at &pound;3,500, credited in full
          against Discovery if you go ahead. Discovery is then credited against the build if
          commissioned within ninety days. Every step already paid for rolls into the next.
        </p>
        <p className="italic text-lg md:text-xl text-forest-green/70 leading-snug mt-8 max-w-[34em]">
          A note on how the audit itself is priced. &pound;3,500 is the entry point. It scales with
          the size of the team and the complexity of the operation, because both decide how many
          conversations the listening takes and how tangled the systems are to map.
        </p>
      </>
    ),
  },
  {
    slug: 'appendix',
    num: '10',
    label: 'Appendix',
    title: (
      <>
        Supporting <A>detail.</A>
      </>
    ),
    blurb: 'Who we spoke to, what we did not assess and where to go from here.',
    body: (
      <>
        <H5>Who we spoke to</H5>
        <DataTable
          head={['Person', 'Role', 'Focus of their conversation']}
          rows={[
            [
              'Elena',
              'Founder',
              'Growth plan, the new contract, where she believes the business is behind',
            ],
            ['Sam', 'Operations lead', 'Scheduling, team allocation, the spreadsheet'],
            ['Priya', 'Office coordinator', 'Client calls, job queries, chasing teams'],
            ['Dan', 'Accounts assistant', 'Invoicing, the job photos, month end'],
            ['Marcus', 'Team leader', 'A morning on site, paper job sheets, what actually happens'],
          ]}
        />

        <H5>Systems in use</H5>
        <DataTable
          head={['System', 'Role', 'Recommendation']}
          rows={[
            [
              'Scheduling spreadsheet',
              'The real operational plan',
              'Replace with a shared, structured schedule',
            ],
            ['Chat groups', 'How jobs get reported in', 'Replace for job reporting, keep for chatter'],
            ['Paper job sheets', 'The record of work done', 'Replace with on-site capture'],
            ['Accounting software', 'Financial source of truth', 'Keep, feed it from the job record'],
          ]}
        />

        <H5>What we did not assess</H5>
        <p>
          The following were out of scope and are named here so the boundary is clear: the commercial
          terms of existing contracts, pricing and quoting strategy, vehicle and equipment
          management, HR policy and any formal review of accounting practice. Each could be looked at
          separately if useful.
        </p>

        <H5>Where to go from here</H5>
        <p>
          Sit with the findings and share them with anyone who needs to be aligned. Do the two quick
          wins this week, because they protect the business now and wait on nothing. Then decide
          whether to start with Discovery, which is the contained, low risk way to turn this into a
          firm plan before the contract starts. There is no obligation to go further until that plan
          is in front of you.
        </p>
      </>
    ),
  },
];

// ─── CHAPTER PAGE ────────────────────────────────────────────────────────────

export function AuditChapter() {
  const { slug } = useParams();
  const idx = CHAPTERS.findIndex(c => c.slug === slug);
  if (idx === -1) return <Navigate to={BASE} replace />;

  const ch = CHAPTERS[idx];
  const prev = CHAPTERS[idx - 1];
  const next = CHAPTERS[idx + 1];

  return (
    <div className="min-h-screen bg-warm-cream text-forest-green font-sans selection:bg-terracotta selection:text-white flex flex-col">
      <Helmet>
        <title>{`${ch.label} | Maple and Moss Audit Report | Vibe Coding Lab`}</title>
        <meta name="description" content={ch.blurb} />
        <link rel="canonical" href={`https://thevibecodinglab.co${BASE}/${ch.slug}`} />
      </Helmet>

      <TopBar />

      <article className="flex-1 max-w-3xl w-full mx-auto px-5 md:px-8 py-10 md:py-20">
        <div className="flex items-center gap-3 text-[11px] md:text-xs font-mono font-bold uppercase tracking-[0.14em] text-terracotta mb-5">
          <span className="w-7 h-0.5 bg-current shrink-0" />
          {ch.num} &middot; {ch.label}
        </div>

        <h1 className="font-display font-extrabold text-forest-green text-[28px] sm:text-4xl md:text-5xl leading-[1.08] tracking-tight mb-8">
          {ch.title}
        </h1>

        <div className="text-[16.5px] md:text-[17px] leading-[1.65] text-forest-green/70 [&_p]:mb-4 [&_p]:max-w-[44em] [&_strong]:text-forest-green [&_strong]:font-extrabold">
          {ch.body}
        </div>

        {/* Chapter to chapter, rather than scrolling back up a long page. */}
        <nav className="mt-14 pt-8 border-t border-forest-green/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prev ? (
            <Link
              to={`${BASE}/${prev.slug}`}
              className="group bg-white border border-forest-green/10 rounded-2xl p-4 hover:border-terracotta transition-colors"
            >
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-terracotta mb-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </div>
              <div className="font-display font-extrabold text-forest-green leading-tight">
                {prev.num} &middot; {prev.label}
              </div>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              to={`${BASE}/${next.slug}`}
              className="group bg-white border border-forest-green/10 rounded-2xl p-4 hover:border-terracotta transition-colors sm:text-right"
            >
              <div className="flex items-center gap-2 sm:justify-end text-[10px] font-extrabold uppercase tracking-[0.12em] text-terracotta mb-1.5">
                Next <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div className="font-display font-extrabold text-forest-green leading-tight">
                {next.num} &middot; {next.label}
              </div>
            </Link>
          )}
        </nav>

        <Link
          to={BASE}
          className="inline-flex items-center gap-2 mt-8 text-terracotta hover:text-burnt-orange font-bold text-xs uppercase tracking-[0.06em] transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" /> All chapters
        </Link>
      </article>

      <Footer />
    </div>
  );
}

// ─── INDEX ───────────────────────────────────────────────────────────────────

export default function SampleAuditReport() {
  return (
    <div className="min-h-screen bg-warm-cream text-forest-green font-sans selection:bg-terracotta selection:text-white">
      <Helmet>
        <title>Sample Audit Report: Maple and Moss | Vibe Coding Lab</title>
        <meta
          name="description"
          content="A complete worked example of a systems audit report, in ten chapters. Fictional client, real findings. Keep the shape, swap in your client and write it in your own voice."
        />
        <link rel="canonical" href={`https://thevibecodinglab.co${BASE}`} />
      </Helmet>

      <TopBar />

      {/* Hero */}
      <header className="relative bg-forest-green text-sand overflow-hidden py-14 md:py-24">
        <Grain dark />
        <div
          aria-hidden
          className="absolute right-[-2%] top-[38%] font-display font-extrabold text-sand/[0.045] leading-[0.8] tracking-tighter pointer-events-none select-none"
          style={{ fontSize: 'clamp(120px,22vw,300px)' }}
        >
          AUDIT
        </div>
        <div className="relative max-w-5xl mx-auto px-5 md:px-8">
          <div className="inline-flex items-center gap-2 bg-terracotta/15 border border-terracotta/40 text-[#E08A6F] font-mono font-bold text-[11px] uppercase tracking-[0.08em] px-3.5 py-1.5 rounded-full mb-6">
            &#9678; Fictional worked example
          </div>
          <Eyebrow dark>Systems audit report</Eyebrow>
          <h1 className="font-display font-extrabold text-white text-[34px] sm:text-5xl md:text-7xl leading-[0.98] tracking-tighter">
            You do not have an <A>AI problem</A> yet.
          </h1>
          <p className="italic text-lg md:text-2xl text-sand/80 mt-6 md:mt-8 max-w-[30em] leading-snug">
            An assessment of how Maple and Moss runs today, what would have to be true before AI
            could help and the order to do it in.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mt-10 md:mt-14 pt-7 md:pt-9 border-t border-white/10">
            {[
              ['Prepared for', 'Elena Marsh', 'Founder'],
              ['On behalf of', 'Maple and Moss', 'Grounds Maintenance'],
              ['Engagement', 'One day onsite', 'Plus five conversations'],
              ['Prepared by', '[Your name]', '[Your studio]'],
            ].map(([l, v, s]) => (
              <div key={l}>
                <div className="font-extrabold text-[10px] uppercase tracking-[0.14em] text-terracotta mb-2">
                  {l}
                </div>
                <div className="text-white text-[15px] leading-snug">
                  {v}
                  <span className="block text-sand/70 font-normal">{s}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 md:mt-11 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              to={`${BASE}/summary`}
              className="inline-flex items-center gap-2.5 bg-terracotta text-white px-6 md:px-7 py-4 rounded-full text-sm font-extrabold tracking-wide hover:bg-burnt-orange transition-colors"
            >
              Start reading <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={TEMPLATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sand/80 hover:text-white font-bold text-xs uppercase tracking-[0.1em] border-b border-white/35 hover:border-white pb-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Make your own copy
            </a>
          </div>
        </div>
      </header>

      {/* Read me first */}
      <div className="bg-[#fbeee8] border-b border-terracotta/25">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-5 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 sm:gap-4 items-start">
          <span className="font-mono font-bold text-[11px] uppercase tracking-[0.08em] text-terracotta whitespace-nowrap sm:pt-1">
            Read me first
          </span>
          <p className="text-[15px] text-forest-green leading-relaxed">
            <b className="font-extrabold">Maple and Moss is not a real business.</b> Real audit
            reports are full of real client data and cannot be shared, so this one was built to
            behave exactly like a real one. Every name and number is invented. Every finding is one
            genuinely seen in real businesses.{' '}
            <b className="font-extrabold text-terracotta">Use it as a template:</b> take your own
            copy of the Google Doc, keep the shape, swap in your client and write it in your own
            voice.
          </p>
        </div>
      </div>

      {/* Contents */}
      <section className="relative bg-white py-14 md:py-24 overflow-hidden">
        <Grain />
        <div className="relative max-w-5xl mx-auto px-5 md:px-8">
          <Eyebrow>Contents</Eyebrow>
          <h2 className="font-display font-extrabold text-forest-green text-[28px] sm:text-4xl md:text-5xl leading-[1.06] tracking-tight mb-9 md:mb-12">
            Ten chapters. <A>Read in order or jump to what matters.</A>
          </h2>
          <div className="flex flex-col">
            {CHAPTERS.map(c => (
              <Link
                key={c.slug}
                to={`${BASE}/${c.slug}`}
                className="group grid grid-cols-1 md:grid-cols-[150px_1fr_40px] gap-2 md:gap-7 items-start py-5 md:py-6 border-t border-forest-green/10 hover:pl-2 transition-all"
              >
                <div>
                  <div className="font-mono text-[11.5px] text-terracotta font-bold tracking-[0.06em]">
                    {c.num}
                  </div>
                  <div className="font-extrabold text-forest-green text-sm mt-0.5">{c.label}</div>
                </div>
                <div>
                  <p className="font-display font-extrabold text-forest-green text-lg md:text-[23px] leading-tight tracking-tight mb-2">
                    {c.title}
                  </p>
                  <p className="text-[14.5px] text-forest-green/70 leading-relaxed max-w-[46em]">
                    {c.blurb}
                  </p>
                </div>
                <ArrowRight className="hidden md:block w-5 h-5 text-terracotta justify-self-end self-center group-hover:translate-x-1.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing note */}
      <section className="relative bg-[#152a1c] text-sand/85 py-10 md:py-14 overflow-hidden">
        <Grain dark />
        <div className="relative max-w-5xl mx-auto px-5 md:px-8">
          <p className="italic max-w-[46em] mx-auto text-[16px] md:text-[16.5px] leading-relaxed">
            The same audit, dialled down. Maple and Moss has a team, which is what makes the
            listening rich. Run this for a solo business and the shape does not change, it just gets
            smaller. You listen to the founder, maybe a virtual assistant or a contractor, plus one
            or two of their customers. The findings are wherever the founder's own time and money
            leak. The risk register almost writes itself, because the single point of failure is the
            founder. Same framework, dialled to size, priced from the same entry point.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
