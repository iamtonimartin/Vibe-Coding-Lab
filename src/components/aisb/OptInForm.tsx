import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * The Kit.com opt-in form, shared by the three lead-magnet pages.
 *
 * `endpoint` maps to the matching handler in server.ts, each of which is wired
 * to its own Kit form id. Keep them in step: a new magnet needs a new endpoint
 * and a new KIT_*_FORM_ID, not a reused one, or the sequences cross over.
 */
export default function OptInForm({
  endpoint,
  submitLabel,
  pendingLabel = 'Sending...',
  redirectTo,
  heading,
  sub,
  finePrint,
}: {
  endpoint: string;
  submitLabel: string;
  pendingLabel?: string;
  redirectTo: string;
  heading: string;
  sub: string;
  finePrint: string;
}) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="formwrap">
      <h2 className="serif">{heading}</h2>
      <div className="fsub">{sub}</div>
      <form
        className="optform"
        onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          setLoading(true);
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ firstName, email }),
            });
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.error || 'Subscription failed');
            }
            window.scrollTo(0, 0);
            navigate(redirectTo);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
      >
        <input
          type="text"
          name="first_name"
          placeholder="First name"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="formerr">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? pendingLabel : submitLabel}
        </button>
      </form>
      <p className="finenote">{finePrint}</p>
    </div>
  );
}
