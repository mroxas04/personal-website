import type { Metadata } from 'next';
import PageHero from '../components/page-hero';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import { MEDIA } from '../../content/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected technical, teaching, and systems projects by Matthew Roxas.',
  alternates: { canonical: '/work' },
};

const projects = [
  { number: '01', type: 'Personal AI system', title: 'Second Mind', description: 'A private, local-first system that turns journals and dated media into a grounded record of memory, identity, and change over time.', tags: ['Local AI', 'Context retrieval', 'Human-in-the-loop'], status: 'In development', href: null },
  { number: '02', type: 'Open-source teaching', title: 'Fourier Data Science Labs', description: 'An interactive lab course for students learning Fourier analysis through Python, data, and computation.', tags: ['Python', 'Jupyter Book', 'Technical teaching'], status: 'Public on GitHub', href: 'https://github.com/mroxas04/DSLab_Fourier' },
  { number: '03', type: 'Community data platform', title: 'Standing Rock Data Project', description: 'Technical and stakeholder leadership for a student team building data infrastructure and decision tools with the Standing Rock Sioux Tribe.', tags: ['Azure', 'Django', 'Project leadership'], status: 'Purdue EPICS', href: 'https://github.com/EPICS-Harnessing-the-Data-Revolution/New-Code-Layout' },
  { number: '04', type: 'Trustworthy AI', title: 'Model Registry', description: 'A hybrid Python and Node.js registry that evaluates open models, datasets, and code against reliability metrics before accepting them.', tags: ['Python', 'Node.js', 'Model evaluation'], status: 'Team project', href: 'https://github.com/ECE461-2025-Team-7/SWE-Phase-2' },
];

export default function WorkPage() {
  return (
    <main>
      <SiteHeader returnTo="/work" />
      <PageHero
        eyebrow={['Selected work', 'Systems in practice']}
        title="Ideas that became systems."
        description="Technical builds, teaching tools, and operating experiments shaped by real constraints and actual people."
        media={MEDIA.workHero}
        mediaVariable="MEDIA.workHero"
      />
      <section className="section work-section standalone-section">
        <div className="project-list">
          {projects.map((project) => {
            const content = <><div className="project-number">{project.number}</div><div className="project-main"><p className="content-meta">{project.type}</p><h2>{project.title}</h2><p className="project-description">{project.description}</p><ul className="tag-list" aria-label={`${project.title} technologies`}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div><div className="project-status"><span>{project.status}</span>{project.href ? <span aria-hidden="true">↗</span> : null}</div></>;
            return project.href ? <a className="project-row" href={project.href} target="_blank" rel="noreferrer" key={project.number}>{content}</a> : <article className="project-row" key={project.number}>{content}</article>;
          })}
        </div>
        <a className="text-link work-more-link" href="https://github.com/mroxas04" target="_blank" rel="noreferrer">View all GitHub repos <span aria-hidden="true">↗</span></a>
      </section>
      <SiteFooter note="Selected work · Systems in practice" />
    </main>
  );
}
