import type { Metadata } from 'next';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import {
  PEOPLE_SPOTLIGHTS,
  type PeopleCard,
  type PeopleGroup,
} from '../../content/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gratitude',
  description:
    'A living thank-you to the mentors, peers, and mentees who have shaped Matthew Roxas’s life.',
  alternates: { canonical: '/gratitude' },
  openGraph: {
    title: 'Gratitude · Matthew Roxas',
    description:
      'A living thank-you to the mentors, peers, and mentees who have shaped Matthew Roxas’s life.',
    url: '/gratitude',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'Gratitude · Matthew Roxas',
    description:
      'A living thank-you to the mentors, peers, and mentees who have shaped Matthew Roxas’s life.',
    images: [],
  },
};

const GROUPS: Array<{
  id: PeopleGroup;
  label: string;
  description: string;
}> = [
  {
    id: 'mentors',
    label: 'Mentors',
    description: 'People who have offered guidance, perspective, and a path to grow toward.',
  },
  {
    id: 'peers',
    label: 'Peers',
    description: 'People growing alongside me, close enough to share the work and the becoming.',
  },
  {
    id: 'mentees',
    label: 'Mentees',
    description: 'People who have trusted me to support some part of their own growth.',
  },
];

function PersonCard({ person }: { person: PeopleCard }) {
  return (
    <article className={`person-card ${person.imageSrc ? '' : 'person-card-placeholder'}`.trim()}>
      <div className="person-image">
        {person.imageSrc ? (
          // These are user-selected, provider-agnostic images managed in content/site.ts.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.imageSrc}
            alt={person.imageAlt}
            loading="lazy"
            style={{ objectPosition: person.imagePosition }}
          />
        ) : (
          <div className="person-image-placeholder" aria-label={person.imageAlt}>
            <span>Photo slot</span>
            <strong>Preferably, you together</strong>
          </div>
        )}
      </div>
      <div className="person-copy">
        <p className="person-label">Role in my life</p>
        <h3>{person.name}</h3>
        <p className="person-role">{person.role}</p>
        {person.note ? <p className="person-note">{person.note}</p> : null}
        {person.linkedinUrl ? (
          <a className="text-link person-link" href={person.linkedinUrl} target="_blank" rel="noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="person-link-pending">LinkedIn to add</span>
        )}
      </div>
    </article>
  );
}

export default function GratitudePage() {
  return (
    <main>
      <SiteHeader returnTo="/gratitude" />
      <section className="page-hero gratitude-hero">
        <p className="eyebrow"><span>Gratitude</span><span>A living thank-you</span></p>
        <h1>The people who shaped my life.</h1>
        <p>
          A growing record of the people who have guided me, grown alongside me, and trusted me
          to support their growth.
        </p>
        <nav className="gratitude-index" aria-label="Gratitude categories">
          {GROUPS.map((group, index) => (
            <a href={`#${group.id}`} key={group.id}>
              <span>0{index + 1}</span>
              {group.label}
            </a>
          ))}
        </nav>
      </section>

      <div className="people-directory">
        {GROUPS.map((group, index) => {
          const people = PEOPLE_SPOTLIGHTS.filter((person) => person.group === group.id);

          return (
            <section className="people-group" id={group.id} key={group.id}>
              <header className="people-group-heading">
                <span>0{index + 1}</span>
                <div>
                  <h2>{group.label}</h2>
                  <p>{group.description}</p>
                </div>
              </header>
              <div className="people-grid">
                {people.map((person) => <PersonCard person={person} key={`${person.group}-${person.name}`} />)}
              </div>
            </section>
          );
        })}
      </div>
      <SiteFooter note="Gratitude · Mentors, peers & mentees" />
    </main>
  );
}
