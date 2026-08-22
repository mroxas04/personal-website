import type { MediaSlot as MediaSlotConfig } from '../../content/site';

type Props = {
  slot: MediaSlotConfig;
  variableName: string;
  className?: string;
  priority?: boolean;
};

export default function MediaSlot({ slot, variableName, className = '', priority = false }: Props) {
  const classes = `media-slot ${slot.kind === 'video' ? 'media-slot-video' : ''} ${className}`.trim();

  if (slot.src) {
    return (
      <figure className={classes}>
        {slot.kind === 'video' ? (
          <video controls playsInline preload="metadata" poster={slot.poster ?? undefined}>
            <source src={slot.src} />
            Your browser does not support embedded video.
          </video>
        ) : (
          // Native img keeps these user-replaceable /public assets provider-agnostic.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slot.src}
            alt={slot.alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            style={{ objectPosition: slot.objectPosition }}
          />
        )}
        <figcaption>{slot.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className={`${classes} media-slot-empty`} aria-label={`${slot.kind} placeholder: ${slot.alt}`}>
      <div className="media-placeholder">
        <span>{slot.kind === 'video' ? 'Video slot' : 'Image slot'}</span>
        <strong>{variableName}</strong>
        <small>Set its src in content/site.ts</small>
      </div>
      <figcaption>{slot.caption}</figcaption>
    </figure>
  );
}
