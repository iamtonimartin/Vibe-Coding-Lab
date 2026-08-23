# Delivery email: The AI Build Standards

Paste into the Kit automation that fires when someone joins the Build Standards
form. Kit's `{{ subscriber.first_name }}` merge tag is used below.

Set the two links as buttons in Kit's editor, not plain links. The first one is
the whole job of this email, so it should look like it.

---

## Subject line

Pick one:

1. **Your AI Build Standards are ready**
2. **You're in. Here are your 19 build standards.**
3. **Right then. Let's make sure it actually works.**

Preview text: `Open the guide, then go and check something.`

---

## Body

Hi {{ subscriber.first_name }},

Thank you. Genuinely.

Your copy of The AI Build Standards is ready and waiting.

**[ BUTTON: Open the guide ]** → https://aiforservicebusinesses.co/standards

### Getting in takes about ten seconds

Click through, enter the email address you used at checkout and the guide
opens. You only need to do that once on each device, so next time you will go
straight in.

Bookmark it. This is a reference you come back to, not something you read once
and file away.

### What you have just got your hands on

Nineteen standards. Twenty-six copy-paste prompts.

Every one of them built on the ICI framework, so your AI coding tool knows
exactly who it is being, what to inspect and how to report back to you in plain
English.

Security. Privacy and GDPR. Data integrity. Forms and user input. AI guardrails.
Accessibility. Performance. Responsive design. SEO, AEO, structured data and the
rest.

Then the Master Prompt at the end, which sets the standard for everything you
build from here.

### Where to start

Do not read it front to back. That is not what it is for.

Go to START HERE, pick the handful that actually apply to what you have already
built and run those first. Security, privacy, data, forms and AI guardrails are
the five worth doing today.

Most people find something in the first hour. That is rather the point.

And if a section comes back clean? Brilliant. That is a good result too. The
purpose is not to find problems, it is to make sure the questions got asked.

### One more thing

The standards keep a build honest. They do not teach you the method behind them.

That is what AI for Service Businesses is for. Claude OS, The Art of the Audit,
Site Sprint and Ship Sprint, weekly sessions and a room full of people building
the same way you are. The Standards are included in there too.

It is £37 one time, charged as $47 by Skool. The price only goes up from here.

**[ BUTTON: See what's inside ]** → https://www.skool.com/the-vibe-coding-lab-7172/about

Any trouble getting into the guide, just hit reply or email
clientsupport@ascendz.co and I will sort it out for you.

Now go and check something.

Toni

---

## Notes

- The access link is `aiforservicebusinesses.co/standards`. It is gated against
  this Kit form, so only people on it can open the guide. Do not put the guide
  behind any other URL.
- The purchaser list is cached for five minutes. Somebody who buys and clicks
  through instantly may be turned away once. It is worth not promising
  "instant" anywhere in this email, which is why the copy above does not.
- If you rename the Skool community, this link changes and so does
  `SKOOL_URL` in `src/config/external.ts`.
