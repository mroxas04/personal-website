import ContactForm from './components/contact-form';

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

const socials = [
  {
    name: 'LinkedIn',
    handle: '/in/matthew-roxas',
    href: 'https://www.linkedin.com/in/matthew-roxas',
  },
  {
    name: 'GitHub',
    handle: '@mroxas04',
    href: 'https://github.com/mroxas04',
  },
  {
    name: 'Email',
    handle: 'matthewgroxas@gmail.com',
    href: 'mailto:matthewgroxas@gmail.com',
  },
];

const pendingSocials = ['Instagram', 'BeReal', 'Belly', 'Ruxisms', 'Duolingo'];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Matthew Roxas, home">
          MR<span className="wordmark-dot" aria-hidden="true" />
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#writing">Writing</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#elsewhere">Elsewhere</a>
        </nav>
        <a className="contact-link" href="#contact">
          Start a conversation <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span>Matthew Roxas</span>
            <span>Indianapolis, IN</span>
            <span>Est. 2004</span>
          </p>

          <h1>
            Building at the edge of <em>systems</em> and lived experience.
          </h1>

          <div className="hero-intro">
            <p>
              I’m a computer engineer, operator, and philosopher of AI. I turn
              messy information into useful systems, then ask what those systems
              mean for the people living inside them.
            </p>
            <a className="text-link" href="#about">
              A little more about me <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <aside className="portrait-card" aria-label="Profile summary">
          <div className="portrait-frame">
            <img
              src="https://avatars.githubusercontent.com/u/112834121?v=4"
              alt="Matthew Roxas"
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
            <p className="content-meta">Working paper · Philosophy of AI · 2026</p>
            <h3>Does artificial intelligence truly reason?</h3>
            <p>
              Embodiment may give an artificial system a meaningful world to act
              within. My argument is that reasoning demands something more: the
              ability to take up a history as one’s own, reinterpret it, and
              project toward future possibilities.
            </p>
            <div className="essay-actions">
              <a className="button button-dark" href="#contact">
                Ask me about the paper <span aria-hidden="true">↗</span>
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

      <section className="section about-section" id="about">
        <div className="section-intro">
          <p className="section-kicker">03 / About</p>
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
          <p className="section-kicker">04 / Elsewhere</p>
          <h2>The other tabs I keep open.</h2>
          <p>
            Professional updates, code, daily life, language streaks, and the
            increasingly specific corners of the internet I call mine.
          </p>
        </div>

        <div className="social-board">
          {socials.map((social, index) => (
            <a
              className="social-link"
              href={social.href}
              target={social.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={social.href.startsWith('mailto:') ? undefined : 'noreferrer'}
              key={social.name}
            >
              <span className="social-index">0{index + 1}</span>
              <span className="social-name">{social.name}</span>
              <span className="social-handle">{social.handle}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}

          {pendingSocials.map((social, index) => (
            <div className="social-link social-link-pending" key={social}>
              <span className="social-index">0{index + socials.length + 1}</span>
              <span className="social-name">{social}</span>
              <span className="social-handle">URL needed</span>
              <span aria-hidden="true">·</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="contact-heading">
          <p className="section-kicker">05 / Contact</p>
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
