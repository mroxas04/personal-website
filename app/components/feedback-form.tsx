'use client';

import { FormEvent, useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function FeedbackForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setError('');
    const form = event.currentTarget;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Your feedback could not be saved.');

      form.reset();
      setState('success');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Your feedback could not be saved.');
      setState('error');
    }
  }

  return (
    <form className="contact-form feedback-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Name *</span>
          <input name="name" type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          <span>Email used to contact Matthew *</span>
          <input name="email" type="email" autoComplete="email" required maxLength={180} />
        </label>
      </div>

      <label>
        <span>Organization / context <small>Optional</small></span>
        <input name="organization" type="text" autoComplete="organization" maxLength={180} />
      </label>

      <label>
        <span>How useful was the conversation? *</span>
        <select name="rating" required defaultValue="">
          <option value="" disabled>Choose one</option>
          <option value="5">5 — Extremely useful</option>
          <option value="4">4 — Very useful</option>
          <option value="3">3 — Useful</option>
          <option value="2">2 — Somewhat useful</option>
          <option value="1">1 — Not useful yet</option>
        </select>
      </label>

      <label>
        <span>What changed, clarified, or became possible? *</span>
        <textarea name="outcome" required minLength={20} maxLength={2400} rows={6} placeholder="Honest specifics are more useful than praise." />
      </label>

      <label>
        <span>Short testimonial excerpt <small>Optional</small></span>
        <textarea name="testimonial" maxLength={800} rows={4} placeholder="Write this only if there is a sentence you would be comfortable standing behind." />
      </label>

      <label>
        <span>If you wrote a testimonial, how may it be used? *</span>
        <select name="testimonialPermission" required defaultValue="private">
          <option value="private">Keep it private</option>
          <option value="anonymous">Matthew may quote it anonymously after review</option>
          <option value="named">Matthew may quote it with my name after review</option>
        </select>
      </label>

      <div className="form-grid">
        <label>
          <span>Would you refer someone? *</span>
          <select name="referralIntent" required defaultValue="maybe">
            <option value="yes">Yes</option>
            <option value="maybe">Maybe / if the right person comes to mind</option>
            <option value="no">Not right now</option>
          </select>
        </label>
        <label>
          <span>May Matthew follow up? *</span>
          <select name="canFollowUp" required defaultValue="yes">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>

      <label className="honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="form-footer">
        <p>Your response stays private unless you explicitly permit a reviewed excerpt. Nothing is published automatically.</p>
        <button className="button button-acid" type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Saving…' : 'Share feedback'}
          <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className="form-status" aria-live="polite">
        {state === 'success' ? <p className="success-message">Thank you. Your feedback is in Matthew’s private dashboard.</p> : null}
        {state === 'error' ? <p className="error-message">{error}</p> : null}
      </div>
    </form>
  );
}
