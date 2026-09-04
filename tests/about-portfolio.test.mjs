import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteSource = await readFile(new URL('../content/site.ts', import.meta.url), 'utf8');
const aboutSource = await readFile(new URL('../app/about/page.tsx', import.meta.url), 'utf8');

test('About portfolio is a content-driven collection of paired media slots', () => {
  assert.match(siteSource, /export const ABOUT_PORTFOLIO: MediaSlot\[\] = \[/);
  assert.match(siteSource, /MEDIA\.studioMoment/);
  assert.match(siteSource, /MEDIA\.livedMoment/);
  assert.match(siteSource, /MEDIA\.fieldNote/);
  assert.match(siteSource, /MEDIA\.motionStudy/);
  assert.match(aboutSource, /choosePortfolioEntries\(ABOUT_PORTFOLIO, 4\)/);
  assert.match(aboutSource, /portfolioEntries\.map/);
});
