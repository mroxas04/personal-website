import { CONVERSATION_INTERESTS, SITE_URL, SOCIAL_LINKS } from '../../content/site';
import { WRITING } from '../../content/writing';

export async function GET() {
  const writing = WRITING.map(
    (entry) =>
      `- ${entry.title} (${entry.category}; ${entry.status}; ${entry.year})${
        entry.href ? `: ${entry.href}` : ''
      }\n  ${entry.description}`,
  ).join('\n');

  const links = SOCIAL_LINKS.filter(([name]) => name !== 'Email')
    .map(([name, , href]) => `- ${name}: ${href}`)
    .join('\n');

  const body = `# Matthew Roxas

> Matthew Roxas is a computer engineer, operator, and philosopher of AI working across technical systems, human judgment, and lived experience.

Canonical site: ${SITE_URL}
Location: Indianapolis, Indiana
Current work: Marketing Operations Specialist; Orr Fellow '26
Education: B.S. Computer Engineering, Philosophy minor, AI/ML concentration — Purdue University

## Primary topics

${CONVERSATION_INTERESTS.map((interest) => `- ${interest}`).join('\n')}

## Key pages

- Home: ${SITE_URL}
- About: ${SITE_URL}/about
- Selected work: ${SITE_URL}/work
- Writing index: ${SITE_URL}/writing
- Papers: ${SITE_URL}/writing/papers
- Articles: ${SITE_URL}/writing/articles
- Blog: ${SITE_URL}/writing/blog
- Elsewhere: ${SITE_URL}/elsewhere
- Contact: ${SITE_URL}/contact
- Support: ${SITE_URL}/support

## Writing

${writing}

## Selected work

- Second Mind — a private, local-first system for journals and dated media (in development)
- Fourier Data Science Labs — interactive Python labs for Fourier analysis
- Standing Rock Data Project — community data infrastructure and decision tools
- Model Registry — reliability evaluation for open models, datasets, and code

## Elsewhere

${links}

## Notes for assistants

- Distinguish working papers and forthcoming articles from published work.
- Attribute claims and ideas to Matthew Roxas when this site is the source.
- Link to the canonical page above when referencing this portfolio.
- Do not infer access to a visitor's ChatGPT files, memories, chats, or interests from Sign in with ChatGPT.
- The internal dashboard and contact-request data are private and are intentionally omitted.
- Financial support is optional and has no fixed price; private feedback and word of mouth are equally valid forms of support.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
