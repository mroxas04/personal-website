'use client';

import { useEffect, useRef } from 'react';
import { claimHomeContactPromptSession } from '../home-contact-prompt-session';
import CalendlyBookingLink from './calendly-booking-link';

type HomeContactPromptProps = {
  businessBookingUrl: string;
  coachingBookingUrl: string;
  phone: {
    display: string;
    e164: string;
  };
};

export default function HomeContactPrompt({
  businessBookingUrl,
  coachingBookingUrl,
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
        <h2 id="home-contact-prompt-heading">What kind of conversation do you need?</h2>
        <p id="home-contact-prompt-description">
          For an organization, start with business AI strategy. For your own
          relationship with AI, choose coaching. Calling or writing works too.
        </p>
      </div>

      <div className="home-contact-prompt-options">
        <CalendlyBookingLink className="home-contact-prompt-option" href={businessBookingUrl}>
          <span className="content-meta">01 · For organizations</span>
          <strong>Business AI Strategy Call</strong>
          <span className="home-contact-prompt-option-detail">Systems, teams, operations, implementation</span>
          <span aria-hidden="true">↗</span>
        </CalendlyBookingLink>

        <CalendlyBookingLink className="home-contact-prompt-option home-contact-prompt-option-coaching" href={coachingBookingUrl}>
          <span className="content-meta">02 · For you</span>
          <strong>AI Coaching Conversation</strong>
          <span className="home-contact-prompt-option-detail">Work, learning, decisions, day-to-day use</span>
          <span aria-hidden="true">↗</span>
        </CalendlyBookingLink>

        <a className="home-contact-prompt-option" href={`tel:${phone.e164}`}>
          <span className="content-meta">03 · Call</span>
          <strong>Call Matthew</strong>
          <span className="home-contact-prompt-option-detail">{phone.display}</span>
          <span aria-hidden="true">→</span>
        </a>

        <a className="home-contact-prompt-option" href="/contact#write">
          <span className="content-meta">04 · Write</span>
          <strong>Send a note</strong>
          <span className="home-contact-prompt-option-detail">Use the private contact form</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </dialog>
  );
}
