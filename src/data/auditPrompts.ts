/**
 * The three prompts from The Art of the Audit. Shared by the deck's terminal
 * slides and the /auditprompts reference page so they cannot drift apart.
 */

export type AuditPrompt = {
  id: string;
  file: string;
  name: string;
  when: string;
  blurb: string;
  text: string;
};

export const QUESTIONS_PROMPT = `You are an experienced consultant who prepares people to run listening-led business audits. You are especially good at finding the questions that get someone talking honestly about their real working day, because that is where the useful truth sits.

The business is [what they do and roughly how big]. The founder believes the problem is [what they have told you].

Give me a short set of open questions to ask the people who do the day-to-day work. Aim them at three things: the workarounds people quietly rely on, where the information they actually trust is kept and any gap between what leadership believes and what the team lives day to day. Group them so a conversation can flow, a few to set the scene, a few about the daily reality, one or two to close. Judge a good question by whether it gets someone describing what they actually do: "walk me through your morning" works, "rate the current process" does not.

Keep them warm and conversational, the kind of thing I could ask over a cup of tea. If anything about this business is unusual enough to change which questions matter, ask me one or two things first, then write them.`;

export const REPORT_PROMPT = `You are an experienced operations consultant who writes clear, honest audit reports for non-technical business owners. You name the real problem plainly, you tie every issue to how it grows with the business, then you stay generous to the people while being straight about the systems.

Here is what I have. The business is [what they do, size, where they are heading]. These are my observations from the day, plus the transcripts of the conversations I recorded: [paste your notes and transcripts]. The single most important thing I noticed is [the core gap or truth].

Draft the report in this order: a one page summary that states the core truth in a sentence and lists the main findings, the business context, what I looked at and who I listened to, the findings, a risk table, the cost of doing nothing, what good looks like, a prioritised roadmap and a proposal. Write each finding in the same shape: what is happening today, then the workaround the team has built, then why it matters, then how it worsens as they grow. Keep every finding about the process rather than any person. Work only from what my notes actually support. Where they run out, mark a clear gap for me to fill rather than filling it yourself.

Where someone has said something in their own words that makes the point better than a summary would, use their words rather than mine.

Write it warm and plain and in my voice, lead with what matters most and flag any assumption you make so I can check it before it goes to the client.`;

export const FIRST_CLIENT_PROMPT = `You are a practical business development coach who helps new consultants land their first audit client from the people who already trust them rather than from cold outreach. You are encouraging and realistic.

Here are the businesses and people I already have some relationship with: [list them, however rough].

For each one, tell me three things: whether they look like a plausible first audit client and why, any sign of leaking time or money I might already have noticed and a warm, low pressure way I could open the conversation. Weigh someone who already knows me above a stranger. If my list looks thin, suggest a couple of everyday places I could look for a first client.

Keep it warm, encouraging and practical. Give me openers I could actually say out loud rather than anything that reads like a sales script.`;

export const AUDIT_PROMPTS: AuditPrompt[] = [
  {
    id: 'questions',
    file: 'audit-questions.prompt',
    name: 'Prepare your questions',
    when: 'Before you go in',
    blurb:
      'Turns a generic question list into the right questions for this business, so you walk in ready to listen rather than to read.',
    text: QUESTIONS_PROMPT,
  },
  {
    id: 'report',
    file: 'audit-report.prompt',
    name: 'Notes into a draft',
    when: 'After the day onsite',
    blurb:
      'Takes your observations and transcripts and drafts the report in the right order. You still read every line as yourself.',
    text: REPORT_PROMPT,
  },
  {
    id: 'first-client',
    file: 'first-client.prompt',
    name: 'Find your first client',
    when: 'Before any of it',
    blurb:
      'Works through the people who already trust you and finds the plausible first audit, plus a warm way to open the conversation.',
    text: FIRST_CLIENT_PROMPT,
  },
];
