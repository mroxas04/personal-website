import type { MetadataRoute } from 'next';
import { SITE_URL } from '../content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-08-23');

  return [
    { url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/work`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/writing`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/writing/papers`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/writing/articles`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/writing/blog`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/elsewhere`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/support`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date('2026-08-25'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date('2026-08-25'), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
