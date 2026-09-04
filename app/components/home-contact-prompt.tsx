'use client';

import { useEffect, useRef } from 'react';
import { claimHomeContactPromptSession } from '../home-contact-prompt-session';
import CalendlyBookingLink from './calendly-booking-link';

type HomeContactPromptProps = {
  aiQuestionBookingUrl: string;
  coffeeChatBookingUrl: string;
  phone: {
    display: string;
    e164: string;
  };
};

export default function HomeContactPrompt({
  aiQuestionBookingUrl,
  coffeeChatBookingUrl,
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
        <h2 id="home-contact-prompt-heading">Start a conversation.</h2>
        <div className="home-contact-prompt-description" id="home-contact-prompt-description">
          <p>Bring an AI question, or choose a coffee chat if you&apos;d simply like to connect.</p>
          <p>For AI questions, we&apos;ll explore what&apos;s technically possible, what makes sense in practice, and the human considerations that are easy to overlook.</p>
          <p>I&apos;m currently using those conversations to develop and refine my approach to AI advising.</p>
        </div>
      </div>

      <div className="home-contact-prompt-options">
        <CalendlyBookingLink className="home-contact-prompt-option" href={aiQuestionBookingUrl}>
          <span className="content-meta">01 · 45 minutes · Free</span>
          <strong>Talk Through an AI Question</strong>
          <span className="home-contact-prompt-option-detail">Calendly opens in a new tab</span>
          <span aria-hidden="true">↗</span>
        </CalendlyBookingLink>

        <CalendlyBookingLink className="home-contact-prompt-option" href={coffeeChatBookingUrl}>
          <span className="content-meta">02 · Coffee chat</span>
          <strong>Coffee Chat</strong>
          <span className="home-contact-prompt-option-detail">Calendly opens in a new tab</span>
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
