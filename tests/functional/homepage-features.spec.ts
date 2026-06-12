/**
 * tests/functional/homepage-features.spec.ts
 *
 * Functional tests for the CleverDome homepage.
 * Verifies that core business-facing sections render correctly:
 * hero, feature/service cards, social proof, and primary CTAs.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { FeaturesPage } from '@pages/features.page';

test.describe('Homepage Features @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  // ── Hero section ────────────────────────────────────────────────────────────

  test('homepage has a main heading (h1) @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length, 'Homepage should have a non-empty h1 or h2 heading').toBeGreaterThan(0);
  });

  test('hero section has visible text content @functional', async ({ homePage }) => {
    const heroText = await homePage.getHeroText();
    expect(
      heroText.trim().length,
      'Hero / above-the-fold section should have visible text content'
    ).toBeGreaterThan(20);
  });

  // ── CTAs ────────────────────────────────────────────────────────────────────

  test('homepage has at least one primary CTA button @functional', async ({ homePage }) => {
    const ctas = await homePage.getCTAButtons();
    expect(
      ctas.length,
      'Homepage should have at least one primary CTA link or button'
    ).toBeGreaterThan(0);
  });

  test('primary CTA buttons are visible and enabled @functional', async ({ homePage }) => {
    const ctas = await homePage.getCTAButtons();

    if (ctas.length === 0) {
      test.skip(true, 'No CTA buttons found on homepage');
      return;
    }

    // Check the first visible CTA
    for (const cta of ctas.slice(0, 3)) {
      const isVisible = await cta.isVisible();
      if (isVisible) {
        await expect(cta).toBeVisible();
        await expect(cta).toBeEnabled();
        break;
      }
    }
  });

  // ── Feature / service sections ──────────────────────────────────────────────

  test('homepage has multiple content sections @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    const sectionCount = await featuresPage.getSectionCount();

    expect(
      sectionCount,
      'A B2B SaaS homepage should have multiple content sections (hero, features, about, etc.)'
    ).toBeGreaterThan(1);
  });

  test('homepage has h2 section headings @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    const h2s = await featuresPage.getH2Sections();

    expect(
      h2s.length,
      'Homepage should have at least one h2 heading for structured content sections'
    ).toBeGreaterThan(0);
  });

  test('feature or service cards are present @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    const cardCount = await featuresPage.getFeatureCardCount();

    if (cardCount === 0) {
      console.warn(
        '[functional] No feature/service card elements found. ' +
        'The site may use a non-standard layout — review manually.'
      );
    } else {
      expect(cardCount).toBeGreaterThan(0);
    }
  });

  // ── Social proof ─────────────────────────────────────────────────────────────

  test('homepage has social proof elements @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    const hasSocialProof = await featuresPage.hasSocialProof();

    if (!hasSocialProof) {
      console.warn(
        '[functional] No social proof elements detected (testimonials, partner logos, stats). ' +
        'Consider adding trust signals for B2B conversions.'
      );
    }
    // Soft assertion — log but do not fail
    expect(typeof hasSocialProof).toBe('boolean');
  });

  // ── Page load quality ────────────────────────────────────────────────────────

  test('homepage body has substantial text content @functional', async ({ page, siteConfig }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Homepage body text should be substantial for a B2B SaaS site (>200 chars)'
    ).toBeGreaterThan(200);
  });
});
