'use client';

import { FormEvent, useState } from 'react';
import {
  clearStoredAttribution,
  readStoredAttribution,
  type ContactAttribution,
} from '../contact-attribution';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

function readAttribution(): Partial<Omit<ContactAttribution, 'capturedAt'>> {
  try {
    const parsed = readStoredAttribution(sessionStorage);
    if (!parsed) return {};

    return {
      utmSource: parsed.utmSource,
      utmMedium: parsed.utmMedium,
      utmCampaign: parsed.utmCampaign,
      utmContent: parsed.utmContent,
      utmTerm: parsed.utmTerm,
      clickIdType: parsed.clickIdType,
      clickId: parsed.clickId,
      landingPath: parsed.landingPath,
      referrer: parsed.referrer,
    };
  } catch {
    return {};
  }
}

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setError('');

    const form = event.currentTarget;
    const payload = {
      ...Object.fromEntries(new FormData(form).entries()),
      ...readAttribution(),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong.');
      }

      form.reset();
      setSmsConsent(false);
      clearStoredAttribution(sessionStorage);
      setState('success');
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Something went wrong. Please try again.',
      );
      setState('error');
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Name *</span>
          <input name="name" type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          <span>Email *</span>
          <input name="email" type="email" autoComplete="email" required maxLength={180} />
        </label>
      </div>

      <label>
        <span>Organization / context</span>
        <input name="organization" type="text" autoComplete="organization" maxLength={180} />
      </label>

      <label>
        <span>Mobile number <small>Optional</small></span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={40}
          required={smsConsent}
          aria-describedby="sms-consent-disclosure"
        />
      </label>

      <fieldset className="sms-consent">
        <legend>SMS follow-up <small>Optional</small></legend>
        <label className="sms-consent-choice">
          <input
            name="smsConsent"
            type="checkbox"
            value="yes"
            checked={smsConsent}
            onChange={(event) => setSmsConsent(event.currentTarget.checked)}
          />
          <span>I agree to receive one-to-one text responses and follow-up from Matthew Roxas about this request.</span>
        </label>
        <p id="sms-consent-disclosure">
          Consent is optional and is not required to send this form. Message frequency varies.
          Message and data rates may apply. Reply STOP to opt out or HELP for help. See the{' '}
          <a href="/privacy">privacy policy</a> and <a href="/terms">SMS terms</a>.
        </p>
      </fieldset>

      <label>
        <span>What kind of conversation? *</span>
        <select name="reason" required defaultValue="">
          <option value="" disabled>
            Pick the closest fit
          </option>
          <option value="philosophy-ai">Philosophy, AI, or human judgment</option>
          <option value="consulting">Consulting or collaboration</option>
          <option value="technical">Technical project</option>
          <option value="teaching">Speaking or teaching</option>
          <option value="other">Something else entirely</option>
        </select>
      </label>

      <label>
        <span>How did you hear about me? <small>Optional</small></span>
        <select name="heardAbout" defaultValue="">
          <option value="">Choose one if you remember</option>
          <option value="linkedin">LinkedIn</option>
          <option value="search">Search engine</option>
          <option value="friend-colleague">Friend or colleague</option>
          <option value="orr-fellowship">Orr Fellowship</option>
          <option value="valve-meter">Valve+Meter or work</option>
          <option value="purdue">Purdue or school</option>
          <option value="event-talk">Event or talk</option>
          <option value="other">Somewhere else</option>
        </select>
      </label>

      <label>
        <span>What’s on your mind? *</span>
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={2400}
          rows={7}
          placeholder="A little context goes a long way."
        />
      </label>

      <label className="honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="form-footer">
        <p>
          Your note and basic referral details are saved privately so Matthew can follow up. See the{' '}
          <a href="/privacy">privacy policy</a>.
        </p>
        <button className="button button-acid" type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Sending…' : 'Send the note'}
          <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className="form-status" aria-live="polite">
        {state === 'success' ? (
          <p className="success-message">Got it. Your note is in Matthew’s private inbox.</p>
        ) : null}
        {state === 'error' ? <p className="error-message">{error}</p> : null}
      </div>
    </form>
  );
}
