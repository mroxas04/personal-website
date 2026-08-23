import PageHero from '../components/page-hero';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import WritingList from '../components/writing-list';
import { MEDIA } from '../../content/site';
import { WRITING_CATEGORY_DETAILS, type WritingCategory } from '../../content/writing';

type WritingCategoryPageProps = {
  category: WritingCategory;
};

export default function WritingCategoryPage({ category }: WritingCategoryPageProps) {
  const details = WRITING_CATEGORY_DETAILS[category];
  const path = `/writing/${details.slug}`;
  const heroMedia = {
    Paper: { slot: MEDIA.papersHero, variable: 'MEDIA.papersHero' },
    Article: { slot: MEDIA.articlesHero, variable: 'MEDIA.articlesHero' },
    Blog: { slot: MEDIA.blogHero, variable: 'MEDIA.blogHero' },
  }[category];

  return (
    <main>
      <SiteHeader returnTo={path} />
      <PageHero
        eyebrow={['Writing', details.plural]}
        title={details.plural}
        description={details.description}
        media={heroMedia.slot}
        mediaVariable={heroMedia.variable}
        className="writing-page-hero"
      />
      <WritingList categories={[category]} />
      <SiteFooter note={`Writing · ${details.plural}`} />
    </main>
  );
}
