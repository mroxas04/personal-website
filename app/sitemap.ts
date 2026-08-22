import type { MetadataRoute } from 'next';
import { SITE_URL } from '../content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date('2026-08-22'), changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/writing`, lastModified: new Date('2026-08-22'), changeFrequency: 'monthly', priority: 0.8 },
  ];
}
