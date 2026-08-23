'use client';

import { FormEvent, useState } from 'react';
import {
  FEEDBACK_STATUSES,
  FEEDBACK_STATUS_LABELS,
  SUPPORT_TYPES,
  SUPPORT_TYPE_LABELS,
  type FeedbackStatus,
} from '../support-types';
import type {
  ConsultationFeedbackRecord,
  getSupportDashboardData,
} from '../../db/support';

type SupportDashboardData = Awaited<ReturnType<typeof getSupportDashboardData>>;

type Props = {
  initialData: SupportDashboardData | null;
  databaseError: boolean;
};

function dollars(cents: number | null) {
  if (cents === null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function permissionLabel(feedback: ConsultationFeedbackRecord) {
  if (!feedback.testimonial) return 'No testimonial submitted';
  if (feedback.testimonial_permission === 'named') return 'Named quotation permitted';
  if (feedback.testimonial_permission === 'anonymous') return 'Anonymous quotation permitted';
  return 'Private only';
}

export default function SupportDashboard({ initialData, databaseError }: Props) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [message, setMessage] = useState('');

  async function refresh() {
    const response = await fetch('/api/dashboard/support', { cache: 'no-store' });
    const result = (await response.json()) as SupportDashboardData & { error?: string };
    if (!response.ok) throw new Error(result.error || 'Support data could not be refreshed.');
    setData(result);
  }

  async function addContribution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const form = event.currentTarget;
    try {
      const response = await fetch('/api/dashboard/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'The support entry could not be saved.');
      form.reset();
      setMessage('Support entry saved.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The support entry could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  async function changeFeedbackStatus(id: string, status: FeedbackStatus) {
    setUpdatingId(id);
    setMessage('');
    try {
      const response = await fetch('/api/dashboard/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'The feedback status could not be saved.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The feedback status could not be saved.');
    } finally {
      setUpdatingId('');
    }
  }

  if (databaseError || !data) {
    return <div className="dashboard-empty"><h3>Support data unavailable.</h3><p>The private support tables could not be read in this environment.</p></div>;
  }

  return (
    <>
      <div className="support-dashboard-stats">
        <article><span>Supporters</span><strong>{data.stats.supporterCount}</strong></article>
        <article><span>Support acts</span><strong>{data.stats.contributionCount}</strong></article>
        <article><span>Recorded payments</span><strong>{dollars(data.stats.amountCents)}</strong></article>
        <article><span>Feedback / new</span><strong>{data.stats.feedbackCount} / {data.stats.newFeedbackCount}</strong></article>
      </div>

      <div className="support-dashboard-grid">
        <section className="support-admin-panel" aria-labelledby="record-support-heading">
          <div className="support-admin-heading"><p className="section-kicker">Manual ledger</p><h3 id="record-support-heading">Record support.</h3></div>
          <form className="support-entry-form" onSubmit={addContribution}>
            <div className="form-grid">
              <label><span>Name *</span><input name="supporterName" required maxLength={120} /></label>
              <label><span>Email <small>Matches contacts</small></span><input name="supporterEmail" type="email" maxLength={180} /></label>
            </div>
            <div className="form-grid">
              <label><span>Support type *</span><select name="supportType" required defaultValue=""><option value="" disabled>Choose one</option>{SUPPORT_TYPES.map((type) => <option value={type} key={type}>{SUPPORT_TYPE_LABELS[type]}</option>)}</select></label>
              <label><span>Amount received <small>USD, if monetary</small></span><input name="amount" inputMode="decimal" placeholder="0.00" /></label>
            </div>
            <div className="form-grid">
              <label><span>Impact points *</span><select name="impactPoints" defaultValue="1"><option value="1">1 — Helpful</option><option value="2">2 — Meaningful</option><option value="3">3 — Significant</option><option value="4">4 — Major</option><option value="5">5 — Transformative</option></select></label>
              <label><span>Date</span><input name="occurredDate" type="date" /></label>
            </div>
            <label><span>Private note</span><textarea name="note" maxLength={800} rows={3} /></label>
            <p className="support-points-note">Impact points are your private judgment aid. They do not convert money, referrals, or testimonials into an objective public score.</p>
            <button className="button button-dark" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add to ledger'} <span aria-hidden="true">↗</span></button>
          </form>
        </section>

        <section className="support-admin-panel" aria-labelledby="leaderboard-heading">
          <div className="support-admin-heading"><p className="section-kicker">Internal only</p><h3 id="leaderboard-heading">Support leaderboard.</h3></div>
          {data.leaderboard.length ? <ol className="support-leaderboard">{data.leaderboard.map((supporter, index) => <li key={supporter.supporter_key}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{supporter.supporter_name}</strong>{supporter.supporter_email ? <small>{supporter.supporter_email}</small> : null}</div><div><strong>{supporter.impact_points} pts</strong><small>{supporter.contribution_count} acts · {dollars(supporter.amount_cents)}</small></div></li>)}</ol> : <div className="dashboard-empty compact-empty"><h3>No support recorded yet.</h3></div>}
        </section>
      </div>

      <section className="feedback-inbox" aria-labelledby="feedback-inbox-heading">
        <div className="inbox-heading"><h3 id="feedback-inbox-heading">Consultation feedback</h3><span>Private until explicitly approved</span></div>
        {data.feedback.length ? <div className="feedback-list">{data.feedback.map((feedback) => <article className="feedback-card" key={feedback.id}>
          <div className="feedback-card-meta"><strong>{feedback.rating}/5</strong><time dateTime={new Date(feedback.created_at).toISOString()}>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(feedback.created_at)}</time><label><span>Status</span><select value={feedback.status} disabled={updatingId === feedback.id} onChange={(event) => changeFeedbackStatus(feedback.id, event.target.value as FeedbackStatus)}>{FEEDBACK_STATUSES.map((status) => <option value={status} key={status}>{FEEDBACK_STATUS_LABELS[status]}</option>)}</select></label></div>
          <div className="feedback-person"><h4>{feedback.name}</h4><a href={`mailto:${feedback.email}`}>{feedback.email}</a>{feedback.organization ? <span>{feedback.organization}</span> : null}<small>{permissionLabel(feedback)}</small><small>Referral: {feedback.referral_intent} · Follow-up: {feedback.can_follow_up ? 'yes' : 'no'}</small></div>
          <div className="feedback-copy"><p>{feedback.outcome}</p>{feedback.testimonial ? <blockquote>“{feedback.testimonial}”</blockquote> : null}</div>
        </article>)}</div> : <div className="dashboard-empty compact-empty"><h3>No feedback yet.</h3><p>Responses from the public feedback form will appear here.</p></div>}
      </section>
      <p className="support-admin-message" aria-live="polite">{message}</p>
    </>
  );
}
