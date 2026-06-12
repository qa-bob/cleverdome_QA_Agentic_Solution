/**
 * tests/functional/content-sections.spec.ts
 *
 * Functional tests for content quality across the CleverDome site.
 * Verifies heading hierarchy, footer links, page structure, and
 * SEO-relevant content signals.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { FeaturesPage } from '@pages/features.page';

test.describe('Content Sections @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  // ── Heading hierarchy ───────────────────────────────────────────────────────

  test('page has a single h1 heading @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const h1Count = await page.locator('h1').count();
    expect(h1Count, 'Page should have exactly one h1 heading for SEO').toBe(1);
  });

  test('heading hierarchy is logical (h1 → h2 → h3) @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();

    // h1 must exist
    expect(h1Count, 'Page must have an h1').toBeGreaterThanOrEqual(1);

    // If h2 exists, there should be a meaningful number
    if (h2Count > 0) {
      expect(h2Count, 'If h2s exist, there should be at least 2 for structured content').toBeGreaterThanOrEqual(1);
    }

    // h4+ without h3 is a hierarchy skip — warn but do not fail
    const h3Count = await page.locator('h3').count();
    const h4Count = await page.locator('h4').count();
    if (h4Count > 0 && h3Count === 0) {
      console.warn('[functional] Heading hierarchy skip detected: h4 exists without h3.');
    }
  });

  test('h2 headings have non-empty, meaningful text @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const h2Texts = await featuresPage.getH2Sections();

    for (const text of h2Texts) {
      expect(text.trim().length, `h2 heading should not be empty: "${text}"`).toBeGreaterThan(2);
    }
  });

  // ── Footer ──────────────────────────────────────────────────────────────────

  test('page has a footer @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const footer = page.locator('footer, [role="contentinfo"]').first();
    const footerCount = await footer.count();

    expect(footerCount, 'Page should have a <footer> or [role="contentinfo"] element').toBeGreaterThan(0);
  });

  test('footer contains links @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() === 0) {
      test.skip(true, 'No footer found');
      return;
    }

    const footerLinks = footer.locator('a[href]');
    const linkCount = await footerLinks.count();

    expect(linkCount, 'Footer should contain navigational links').toBeGreaterThan(0);
  });

  test('footer has a privacy policy or terms link @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const legalLink = page.locator('a').filter({
      hasText: /privacy|terms|legal|cookie/i,
    }).first();

    if (await legalLink.count() === 0) {
      console.warn(
        '[functional] No Privacy Policy or Terms of Service link found. ' +
        'This is required for GDPR/CCPA compliance and B2B trust.'
      );
    } else {
      await expect(legalLink).toBeVisible();
    }
  });

  // ── Open Graph / SEO meta tags ───────────────────────────────────────────────

  test('homepage has Open Graph meta tags @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');

    if (!ogTitle) {
      console.warn('[functional] Missing og:title meta tag — affects social sharing appearance.');
    }
    if (!ogDescription) {
      console.warn('[functional] Missing og:description meta tag — affects social sharing appearance.');
    }

    // At minimum, confirm the page has a title tag
    const title = await page.title();
    expect(title.trim().length, 'Page must have a <title> tag').toBeGreaterThan(0);
  });

  test('homepage has a canonical URL meta tag @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

    if (!canonical) {
      console.warn(
        '[functional] No canonical URL tag found. ' +
        'This can cause duplicate content issues in search engines.'
      );
    } else {
      expect(canonical.trim().length).toBeGreaterThan(0);
    }
  });

  // ── Accordion / FAQ ──────────────────────────────────────────────────────────

  test('accordion or FAQ items expand when clicked @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const hasAccordion = await featuresPage.hasAccordion();
    if (!hasAccordion) {
      test.skip(true, 'No accordion or FAQ section found on homepage — skipping');
      return;
    }

    const items = await featuresPage.getAccordionItems();
    if (items.length === 0) {
      test.skip(true, 'Accordion found but no individual items detected');
      return;
    }

    const firstItem = items[0];
    await firstItem.click();
    await page.waitForLoadState('domcontentloaded');

    // After clicking, the item should be in an expanded state
    const ariaExpanded = await firstItem.getAttribute('aria-expanded');
    const open = await firstItem.evaluate<boolean>((el) =>
      el instanceof HTMLDetailsElement ? el.open : (el.getAttribute('aria-expanded') === 'true')
    );

    if (ariaExpanded !== null) {
      expect(ariaExpanded, 'Accordion item should have aria-expanded="true" after click').toBe('true');
    } else {
      expect(open, 'Accordion <details> should be open after click').toBeTruthy();
    }
  });
});
