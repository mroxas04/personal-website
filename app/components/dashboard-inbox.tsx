'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CONTACT_REQUEST_STATUSES,
  CONTACT_REQUEST_STATUS_LABELS,
  type ContactRequestStatus,
} from '../contact-request-status';
import type { ContactRequestRecord } from '../../db/contact-requests';

type Props = {
  initialRequests: ContactRequestRecord[];
  initialEmail: string;
  databaseError: boolean;
};

const reasonLabels: Record<string, string> = {
  'philosophy-ai': 'Philosophy / AI',
  consulting: 'Consulting',
  technical: 'Technical',
  teaching: 'Speaking / teaching',
  other: 'Other',
};

const heardAboutLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  search: 'Search engine',
  'friend-colleague': 'Friend or colleague',
  'orr-fellowship': 'Orr Fellowship',
  'valve-meter': 'Valve+Meter or work',
  purdue: 'Purdue or school',
  'event-talk': 'Event or talk',
  other: 'Somewhere else',
};

function automaticSource(request: ContactRequestRecord) {
  const campaign = [request.utm_source, request.utm_medium, request.utm_campaign]
    .filter(Boolean)
    .join(' / ');

  if (campaign) return campaign;
  if (request.referrer) return request.referrer;
  return 'Direct / untagged';
}

export default function DashboardInbox({ initialRequests, initialEmail, databaseError }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ContactRequestStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const skipInitialSearch = useRef(true);

  useEffect(() => {
    if (skipInitialSearch.current) {
      skipInitialSearch.current = false;
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (status !== 'all') params.set('status', status);
      if (initialEmail) params.set('email', initialEmail);

      try {
        const response = await fetch(`/api/dashboard/contact-requests?${params.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        const result = (await response.json()) as {
          requests?: ContactRequestRecord[];
          error?: string;
        };
        if (!response.ok) throw new Error(result.error || 'The inbox could not be searched.');
        setRequests(result.requests ?? []);
      } catch (searchError) {
        if (searchError instanceof DOMException && searchError.name === 'AbortError') return;
        setError(searchError instanceof Error ? searchError.message : 'The inbox could not be searched.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [initialEmail, query, refreshKey, status]);

  async function changeStatus(id: string, nextStatus: ContactRequestStatus) {
    setUpdatingId(id);
    setError('');
    try {
      const response = await fetch('/api/dashboard/contact-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'The status could not be saved.');

      setRequests((current) => current.map((request) => (
        request.id === id ? { ...request, status: nextStatus } : request
      )));
      setRefreshKey((current) => current + 1);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'The status could not be saved.');
    } finally {
      setUpdatingId('');
    }
  }

  if (databaseError) {
    return <div className="dashboard-empty"><h3>Database unavailable.</h3><p>The contact database could not be read in this environment.</p></div>;
  }

  return (
    <>
      <div className="inbox-tools">
        <label className="inbox-search">
          <span>Search requests</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, organization, message…"
            autoComplete="off"
          />
        </label>
        <label className="inbox-filter">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as ContactRequestStatus | 'all')}>
            <option value="all">All statuses</option>
            {CONTACT_REQUEST_STATUSES.map((value) => (
              <option value={value} key={value}>{CONTACT_REQUEST_STATUS_LABELS[value]}</option>
            ))}
          </select>
        </label>
      </div>

      {initialEmail ? (
        <div className="email-history-scope">
          <span>Showing all requests from</span>
          <strong>{initialEmail}</strong>
          <a href="/dashboard">Clear email history</a>
        </div>
      ) : null}

      <div className="inbox-result-note" aria-live="polite">
        <span>{loading ? 'Searching…' : `${requests.length} request${requests.length === 1 ? '' : 's'} shown`}</span>
        {error ? <strong>{error}</strong> : null}
      </div>

      {requests.length === 0 && !loading ? (
        <div className="dashboard-empty">
          <h3>{query || status !== 'all' || initialEmail ? 'No matching requests.' : 'The inbox is quiet.'}</h3>
          <p>{query || status !== 'all' || initialEmail ? 'Try clearing a filter or searching for something broader.' : 'New submissions from the contact form will appear here automatically.'}</p>
        </div>
      ) : (
        <div className={`request-list ${loading ? 'request-list-loading' : ''}`}>
          {requests.map((request) => (
            <article className="request-card" key={request.id}>
              <div className="request-meta">
                <label className={`request-status-control request-status-${request.status}`}>
                  <span>Status</span>
                  <select
                    value={request.status}
                    disabled={updatingId === request.id}
                    onChange={(event) => changeStatus(request.id, event.target.value as ContactRequestStatus)}
                    aria-label={`Status for request from ${request.name}`}
                  >
                    {CONTACT_REQUEST_STATUSES.map((value) => (
                      <option value={value} key={value}>{CONTACT_REQUEST_STATUS_LABELS[value]}</option>
                    ))}
                  </select>
                </label>
                <time dateTime={new Date(request.created_at).toISOString()}>
                  {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(request.created_at)}
                </time>
                <span>{reasonLabels[request.reason] ?? request.reason}</span>
              </div>
              <div className="request-sender">
                <h3>{request.name}</h3>
                <a href={`mailto:${request.email}`}>{request.email}</a>
                {request.organization ? <span>{request.organization}</span> : null}
                {request.email_request_count > 1 ? (
                  <a className="repeat-contact-flag" href={`/dashboard?email=${encodeURIComponent(request.email)}`}>
                    Repeat contact · {request.email_request_count} total requests
                  </a>
                ) : null}
                <div className="request-attribution">
                  <span>Automatic source</span>
                  <strong>{automaticSource(request)}</strong>
                  {request.heard_about ? <small>Self-reported: {heardAboutLabels[request.heard_about] ?? request.heard_about}</small> : null}
                  {request.landing_path ? <small>Landing page: {request.landing_path}</small> : null}
                </div>
              </div>
              <p>{request.message}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
