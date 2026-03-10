/**
 * NewsletterForm.jsx — React island for the footer newsletter subscription.
 * Loaded via client:visible — zero JS until the footer scrolls into view.
 */
import { useState } from 'react';
import { API_URL } from '../../lib/constants';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'already' | 'error' | null
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/newsletter/subscribe/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      let data = {};
      try { data = await res.json(); } catch {}

      if (data?.message === 'Email already subscribed' || data?.error === 'Email already subscribed') {
        setStatus('already');
      } else if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="flex justify-start items-center w-full max-w-md" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          className="p-2 text-black text-sm sm:text-base rounded-l focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-yellow-500 text-black font-semibold px-2 sm:px-2 py-2 text-sm sm:text-base w-auto sm:w-36 md:w-40 rounded-r whitespace-nowrap disabled:opacity-60"
          disabled={loading}
        >
          {loading ? '...' : 'HOP IN!'}
        </button>
      </form>
      {status === 'success' && (
        <p className="text-green-400 mt-2 text-sm">Thank you for subscribing! Please check your email.</p>
      )}
      {status === 'already' && (
        <p className="text-yellow-400 mt-2 text-sm">This email is already subscribed to our newsletter.</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 mt-2 text-sm">Subscription failed. Please try again later.</p>
      )}
    </div>
  );
}
