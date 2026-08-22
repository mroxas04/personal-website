import type { ReactNode } from 'react';
import {
  WRITING,
  WRITING_CATEGORY_DETAILS,
  type WritingCategory,
} from '../../content/writing';

type WritingListProps = {
  categories: WritingCategory[];
};

export default function WritingList({ categories }: WritingListProps) {
  return (
    <div className="writing-index">
      {categories.map((category, categoryIndex) => {
        const entries = WRITING.filter((entry) => entry.category === category);
        const details = WRITING_CATEGORY_DETAILS[category];

        return (
          <section className="writing-category" key={category} aria-labelledby={`category-${details.slug}`}>
            <div className="writing-category-heading">
              <span>0{categoryIndex + 1}</span>
              <h2 id={`category-${details.slug}`}>{details.plural}</h2>
              <p>{entries.length} {entries.length === 1 ? 'piece' : 'pieces'}</p>
            </div>
            <div className="writing-list">
              {entries.map((entry) => {
                const body: ReactNode = (
                  <>
                    <div className="writing-entry-meta"><span>{entry.status}</span><span>{entry.year}</span></div>
                    <div><p className="content-meta">{entry.outlet}</p><h3>{entry.title}</h3><p>{entry.description}</p></div>
                    <span className="writing-entry-action" aria-hidden="true">{entry.href ? '↗' : '—'}</span>
                  </>
                );

                return entry.href ? (
                  <a className="writing-entry" href={entry.href} target="_blank" rel="noreferrer" key={entry.title}>{body}</a>
                ) : (
                  <article className="writing-entry" key={entry.title}>{body}</article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
