import type { MediaSlot as MediaSlotConfig } from '../../content/site';
import MediaSlot from './media-slot';

type Props = {
  eyebrow: [string, string];
  title: string;
  description: string;
  media: MediaSlotConfig;
  mediaVariable: string;
  className?: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  media,
  mediaVariable,
  className = '',
}: Props) {
  return (
    <section className={`page-hero page-hero-with-media ${className}`.trim()}>
      <p className="eyebrow"><span>{eyebrow[0]}</span><span>{eyebrow[1]}</span></p>
      <h1>{title}</h1>
      <p>{description}</p>
      <MediaSlot
        slot={media}
        variableName={mediaVariable}
        className="page-hero-media"
        priority
      />
    </section>
  );
}
