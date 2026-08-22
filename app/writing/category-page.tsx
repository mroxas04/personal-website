import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import WritingList from '../components/writing-list';
import { WRITING_CATEGORY_DETAILS, type WritingCategory } from '../../content/writing';

type WritingCategoryPageProps = {
  category: WritingCategory;
};

export default function WritingCategoryPage({ category }: WritingCategoryPageProps) {
  const details = WRITING_CATEGORY_DETAILS[category];
  const path = `/writing/${details.slug}`;

  return (
    <main>
      <SiteHeader returnTo={path} />
      <section className="page-hero writing-page-hero">
        <p className="eyebrow"><span>Writing</span><span>{details.plural}</span></p>
        <h1>{details.plural}</h1>
        <p>{details.description}</p>
      </section>
      <WritingList categories={[category]} />
      <SiteFooter note={`Writing · ${details.plural}`} />
    </main>
  );
}
