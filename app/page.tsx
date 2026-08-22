import ContactForm from './components/contact-form';
import MediaSlot from './components/media-slot';
import Link from 'next/link';
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser, isDashboardOwner } from './chatgpt-auth';
import { CONVERSATION_INTERESTS, MEDIA, SITE_URL, SOCIAL_LINKS } from '../content/site';
import { WRITING } from '../content/writing';

export const dynamic = 'force-dynamic';

const intersections = [
  {
    index: '01',
    label: 'Technical',
    detail: 'AI, data & software',
    description: 'Understanding how the system actually works.',
  },
  {
    index: '02',
    label: 'Operational',
    detail: 'People, process & decisions',
    description: 'Turning scattered inputs into useful movement.',
  },
  {
    index: '03',
    label: 'Philosophical',
    detail: 'Meaning, embodiment & agency',
    description: 'Asking what the system means for a life lived inside it.',
  },
];

const projects = [
  {
    number: '01',
    type: 'Personal AI system',
    title: 'Second Mind',
    description:
      'A private, local-first system that turns journals and dated media into a grounded record of memory, identity, and change over time.',
    tags: ['Local AI', 'Context retrieval', 'Human-in-the-loop'],
    status: 'In development',
    href: null,
  },
  {
    number: '02',
    type: 'Open-source teaching',
    title: 'Fourier Data Science Labs',
    description:
      'An interactive lab course for students learning Fourier analysis through Python, data, and computation.',
    tags: ['Python', 'Jupyter Book', 'Technical teaching'],
    status: 'Public on GitHub',
    href: 'https://github.com/mroxas04/DSLab_Fourier',
  },
  {
    number: '03',
    type: 'Community data platform',
    title: 'Standing Rock Data Project',
    description:
      'Technical and stakeholder leadership for a student team building data infrastructure and decision tools with the Standing Rock Sioux Tribe.',
    tags: ['Azure', 'Django', 'Project leadership'],
    status: 'Purdue EPICS',
    href: 'https://github.com/EPICS-Harnessing-the-Data-Revolution/New-Code-Layout',
  },
  {
    number: '04',
    type: 'Trustworthy AI',
    title: 'Model Registry',
    description:
      'A hybrid Python and Node.js registry that evaluates open models, datasets, and code against reliability metrics before accepting them.',
    tags: ['Python', 'Node.js', 'Model evaluation'],
    status: 'Team project',
    href: 'https://github.com/ECE461-2025-Team-7/SWE-Phase-2',
  },
];

const timeline = [
  {
    period: '2022–26',
    title: 'Purdue University',
    detail: 'B.S. Computer Engineering · Philosophy minor · AI/ML concentration',
  },
  {
    period: '2023–26',
    title: 'Teaching & building',
    detail: 'Data science labs, Fourier analysis, trustworthy AI, and community data systems',
  },
  {
    period: 'Now',
    title: 'Valve+Meter + Orr Fellowship',
    detail: 'Marketing operations, reporting, automation, and the systems between them',
  },
  {
    period: 'Next',
    title: 'A longer inquiry',
    detail: 'Graduate work joining philosophy, computer science, and the question of AI',
  },
];

function formatInterests(interests: readonly string[]) {
  return new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(interests);
}

export default async function Home() {
  const user = await getChatGPTUser();
  const visitorName = user?.displayName ?? null;
  const showDashboard = isDashboardOwner(user);
  const featuredWriting = WRITING[0];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Matthew Roxas',
        description: 'Systems, AI, philosophy, and the work between them.',
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: 'Matthew Roxas — Systems, AI & Philosophy',
        mainEntity: {
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: 'Matthew Roxas',
          url: SITE_URL,
          homeLocation: { '@type': 'City', name: 'Indianapolis' },
          jobTitle: 'Marketing Operations Specialist',
          alumniOf: { '@type': 'CollegeOrUniversity', name: 'Purdue University' },
          knowsAbout: [
            'Artificial intelligence',
            'Computer engineering',
            'Embodied cognition',
            'Marketing operations',
            'Philosophy of technology',
          ],
          sameAs: SOCIAL_LINKS.filter(([name]) => name !== 'Email').map(([, , href]) => href),
        },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="site-header">
        <Link className="wordmark" href="/#top" aria-label="Matthew Roxas, home">
          MR<span className="wordmark-dot" aria-hidden="true" />
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#writing">Writing</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#elsewhere">Elsewhere</a>
          {showDashboard ? <Link href="/dashboard">Dashboard</Link> : null}
        </nav>
        <div className="header-actions">
          <a className="contact-link" href="#contact">Start a conversation</a>
          {user ? (
            <a className="auth-link" href={chatGPTSignOutPath('/')}>
              Sign out <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <a className="auth-link" href={chatGPTSignInPath('/')}>
              Sign in with ChatGPT <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span>{user ? `Signed in · ${visitorName}` : 'Welcome'}</span>
            <span>Indianapolis, IN</span>
            <span>Est. 2004</span>
          </p>

          <p className="hero-manifesto">
            Building at the edge of <em>systems</em> and lived experience.
          </p>

          <h1>{visitorName ? <>Hi, <em>{visitorName}</em>. I’m Matthew Roxas.</> : <>Hi, I’m <em>Matthew Roxas</em>.</>}</h1>

          <div className="hero-intro">
            <div className="hero-bio">
              <p>
                I’m a computer engineer, operator, and philosopher of AI. I turn
                messy information into useful systems, then ask what those systems
                mean for the people living inside them.
              </p>
              <a className="text-link" href="#about">A little more about me <span aria-hidden="true">↓</span></a>
            </div>
            <aside className="conversation-context" aria-label="Possible conversation topics">
              <span className="content-meta">A few places we might overlap</span>
              <p>
                {user ? (
                  <>ChatGPT keeps your files and interest profile private from this site. Based on the work I share here, the things we could talk about are {formatInterests(CONVERSATION_INTERESTS)}. Looking forward to starting a conversation with you, {visitorName}!</>
                ) : (
                  <>The things we could talk about are {formatInterests(CONVERSATION_INTERESTS)}. Sign in if you’d like a personal hello—your ChatGPT files and interest profile stay private.</>
                )}
              </p>
            </aside>
          </div>
        </div>

        <aside className="portrait-card" aria-label="Profile summary">
          <div className="portrait-frame">
            <MediaSlot
              slot={MEDIA.heroPortrait}
              variableName="MEDIA.heroPortrait"
              className="portrait-media"
              priority
            />
            <span className="portrait-status">Currently curious</span>
          </div>
          <div className="portrait-caption">
            <span>Marketing Operations Specialist</span>
            <span>Orr Fellow · ’26</span>
          </div>
        </aside>
      </section>

      <section className="intersection-strip" aria-label="Areas of practice">
        <div className="section-marker">
          <span>My practice</span>
          <span>Three lenses, one perspective</span>
        </div>
        <div className="intersection-grid">
          {intersections.map((item) => (
            <article className="intersection" key={item.index}>
              <span className="intersection-index">{item.index}</span>
              <div>
                <h2>{item.label}</h2>
                <p>{item.detail}</p>
                <p className="intersection-description">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section writing-section" id="writing">
        <div className="section-intro">
          <p className="section-kicker">01 / Writing</p>
          <h2>Thinking in public.</h2>
          <p>
            Notes and longer arguments about intelligence, embodiment, context,
            and the parts of human judgment that resist clean abstraction.
          </p>
        </div>

        <article className="featured-essay">
          <div className="essay-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="orbit-center" />
            <span className="orbit-label label-enacted">Enacted meaning</span>
            <span className="orbit-label label-reflected">Reflected meaning</span>
            <span className="orbit-code">MR / PAPER 01</span>
          </div>
          <div className="essay-copy">
            <p className="content-meta">
              {featuredWriting.status} · {featuredWriting.outlet} · {featuredWriting.year}
            </p>
            <h3>{featuredWriting.title}</h3>
            <p>{featuredWriting.description}</p>
            <div className="essay-actions">
              <a className="button button-dark" href="#contact">
                Ask me about the paper <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="/writing">
                Browse the writing index <span aria-hidden="true">→</span>
              </a>
              <a
                className="text-link"
                href="https://www.linkedin.com/in/matthew-roxas"
                target="_blank"
                rel="noreferrer"
              >
                Follow my writing <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </article>

        <div className="field-notes">
          <article className="field-note field-note-blue">
            <p className="content-meta">Field note · Systems</p>
            <blockquote>
              “Structured, but malleable.” Enough structure to move with
              intention; enough openness to revise the map when the terrain
              changes.
            </blockquote>
          </article>
          <article className="field-note field-note-paper">
            <p className="content-meta">Ongoing inquiry · AI</p>
            <h3>Context is not just more information.</h3>
            <p>
              It is a lived relation among history, stakes, attention, and the
              person for whom something matters.
            </p>
          </article>
        </div>
      </section>

      <section className="section work-section" id="work">
        <div className="section-intro section-intro-light">
          <p className="section-kicker">02 / Selected work</p>
          <h2>Ideas that became systems.</h2>
          <p>
            A mix of technical builds, operating systems, teaching tools, and
            longer experiments in what useful technology can look like.
          </p>
          <a
            className="text-link"
            href="https://github.com/mroxas04"
            target="_blank"
            rel="noreferrer"
          >
            View all GitHub repos <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="project-list">
          {projects.map((project) => {
            const content = (
              <>
                <div className="project-number">{project.number}</div>
                <div className="project-main">
                  <p className="content-meta">{project.type}</p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <ul className="tag-list" aria-label={`${project.title} technologies`}>
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <div className="project-status">
                  <span>{project.status}</span>
                  {project.href ? <span aria-hidden="true">↗</span> : null}
                </div>
              </>
            );

            return project.href ? (
              <a
                className="project-row"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                key={project.number}
              >
                {content}
              </a>
            ) : (
              <article className="project-row" key={project.number}>
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section media-section" id="field-notes">
        <div className="section-intro">
          <p className="section-kicker">03 / Field notes</p>
          <h2>A life beyond the résumé.</h2>
          <p>
            Photographs and motion can hold the texture that a project list cannot.
            These named slots are ready for the moments you want to share.
          </p>
        </div>
        <div className="media-grid">
          <MediaSlot slot={MEDIA.studioMoment} variableName="MEDIA.studioMoment" className="media-wide" />
          <MediaSlot slot={MEDIA.livedMoment} variableName="MEDIA.livedMoment" />
          <MediaSlot slot={MEDIA.fieldNote} variableName="MEDIA.fieldNote" />
          <MediaSlot slot={MEDIA.motionStudy} variableName="MEDIA.motionStudy" className="media-wide" />
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="section-intro">
          <p className="section-kicker">04 / About</p>
          <h2>A technical life with philosophical stakes.</h2>
        </div>

        <div className="about-grid">
          <div className="about-statement">
            <p className="about-lede">
              I’m most at home when a problem refuses to stay in one discipline.
            </p>
            <div className="about-columns">
              <p>
                My technical background is in computer engineering, AI, data,
                and software. My day-to-day work now lives in marketing
                operations, where I connect reporting, automation, process, and
                people so decisions have somewhere solid to land.
              </p>
              <p>
                Philosophy gives that work a horizon. Through Merleau-Ponty and
                embodied cognition, I’m interested in what intelligence loses
                when we treat meaning as disembodied information processing. The
                long game is scholarship and teaching at that intersection.
              </p>
            </div>
            <div className="principle-card">
              <span className="principle-mark">*</span>
              <p>
                Build systems that support judgment without quietly replacing
                the person whose judgment matters.
              </p>
            </div>
          </div>

          <ol className="timeline" aria-label="Matthew's path">
            {timeline.map((item) => (
              <li key={item.period}>
                <span className="timeline-period">{item.period}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section elsewhere-section" id="elsewhere">
        <div className="section-intro">
          <p className="section-kicker">05 / Elsewhere</p>
          <h2>The other tabs I keep open.</h2>
          <p>
            Professional updates, code, daily life, language streaks, and the
            increasingly specific corners of the internet I call mine.
          </p>
        </div>

        <div className="social-board">
          {SOCIAL_LINKS.map(([name, handle, href], index) => (
            <a
              className="social-link"
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
              key={name}
            >
              <span className="social-index">0{index + 1}</span>
              <span className="social-name">{name}</span>
              <span className="social-handle">{handle}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}

        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="contact-heading">
          <p className="section-kicker">06 / Contact</p>
          <h2>Bring me the interesting, messy question.</h2>
          <p>
            I’m especially open to conversations about AI and human judgment,
            philosophical consulting, technical systems, teaching, or a project
            that does not fit neatly into one box yet.
          </p>
          <div className="availability">
            <span className="availability-dot" aria-hidden="true" />
            Open to thoughtful conversations
          </div>
        </div>
        <ContactForm />
      </section>

      <footer className="site-footer">
        <a className="footer-mark" href="#top">
          Matthew Roxas<span>.</span>
        </a>
        <p>Systems, AI & Philosophy · Indianapolis</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
