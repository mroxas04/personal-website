'use client';

import { useEffect, useRef } from 'react';
import { claimHomeContactPromptSession } from '../home-contact-prompt-session';
import CalendlyBookingLink from './calendly-booking-link';

type HomeContactPromptProps = {
  bookingUrl: string;
  phone: {
    display: string;
    e164: string;
  };
};

export default function HomeContactPrompt({
  bookingUrl,
  phone,
}: HomeContactPromptProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    let storage: Storage | null = null;

    try {
      storage = window.sessionStorage;
    } catch {
      // The in-memory gate still prevents repeat prompts in this page runtime.
    }

    if (!dialog || !claimHomeContactPromptSession(storage)) {
      return;
    }

    dialog.showModal();
  }, []);

  function closePrompt() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      aria-describedby="home-contact-prompt-description"
      aria-labelledby="home-contact-prompt-heading"
      className="home-contact-prompt"
      ref={dialogRef}
    >
      <div className="home-contact-prompt-topline">
        <p className="section-kicker">A direct line</p>
        <button
          aria-label="Close contact options"
          className="home-contact-prompt-close"
          onClick={closePrompt}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="home-contact-prompt-copy">
        <h2 id="home-contact-prompt-heading">How would you like to connect?</h2>
        <p id="home-contact-prompt-description">
          Have a question about AI or strategy, want to explore a consultation,
          or simply want to reconnect? Choose the path that feels most natural.
        </p>
      </div>

      <div className="home-contact-prompt-options">
        <a className="home-contact-prompt-option" href={`tel:${phone.e164}`}>
          <span className="content-meta">01 · Call</span>
          <strong>Call Matthew</strong>
          <span className="home-contact-prompt-option-detail">{phone.display}</span>
          <span aria-hidden="true">→</span>
        </a>

        <CalendlyBookingLink className="home-contact-prompt-option" href={bookingUrl}>
          <span className="content-meta">02 · Book</span>
          <strong>Free Strategic Diagnosis</strong>
          <span className="home-contact-prompt-option-detail">30-minute AI consultation</span>
          <span aria-hidden="true">↗</span>
        </CalendlyBookingLink>

        <a className="home-contact-prompt-option" href="/contact#write">
          <span className="content-meta">03 · Write</span>
          <strong>Send a note</strong>
          <span className="home-contact-prompt-option-detail">Use the private contact form</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </dialog>
  );
}
