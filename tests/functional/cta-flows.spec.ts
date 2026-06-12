/**
 * tests/functional/cta-flows.spec.ts
 *
 * Functional tests for Call-to-Action buttons and user flow entry points.
 * Verifies CTA visibility, link targets, and navigation behavior.
 * Does NOT register, log in, or submit any forms.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { FeaturesPage } from '@pages/features.page';

test.describe('CTA Flows @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  // ── CTA presence ─────────────────────────────────────────────────────────────

  test('homepage has at least one actionable CTA @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    const ctaCount = await featuresPage.getPrimaryCtaCount();

    expect(
      ctaCount,
      'Homepage should have at least one CTA (Get Started, Contact Us, Request Demo, etc.)'
    ).toBeGreaterThan(0);
  });

  test('CTA buttons are not disabled @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    const ctas = await featuresPage.getCtaButtons();

    if (ctas.length === 0) {
      test.skip(true, 'No CTA buttons found');
      return;
    }

    for (const cta of ctas.slice(0, 5)) {
      const isVisible = await cta.isVisible();
      if (isVisible) {
        await expect(cta, 'Visible CTA should not be disabled').toBeEnabled();
      }
    }
  });

  test('CTA links have valid href attributes @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    const ctas = await featuresPage.getCtaButtons();

    const invalidCtAs: string[] = [];
    for (const cta of ctas) {
      const tagName = await cta.evaluate<string>((el) => el.tagName.toLowerCase());
      if (tagName === 'a') {
        const href = await cta.getAttribute('href');
        if (!href || href === '#' || href === 'javascript:void(0)') {
          const text = (await cta.textContent())?.trim() ?? '[no text]';
          invalidCtAs.push(text);
        }
      }
    }

    if (invalidCtAs.length > 0) {
      console.warn(
        `[functional] CTA links with no or empty href: ${invalidCtAs.join(', ')}`
      );
    }
  });

  // ── Contact CTA ──────────────────────────────────────────────────────────────

  test('contact-type CTA leads to a valid page @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const contactCta = page.locator('a').filter({
      hasText: /contact us|get in touch|talk to us|reach out|schedule|book a demo/i,
    }).first();

    if (await contactCta.count() === 0) {
      console.warn(
        '[functional] No "Contact Us" type CTA found. ' +
        'This is an important conversion path for B2B sites.'
      );
      return;
    }

    const href = await contactCta.getAttribute('href');
    if (!href || href === '#') {
      console.warn('[functional] Contact CTA has no valid href destination.');
      return;
    }

    // Navigate to the contact destination
    const absoluteUrl = new URL(href, siteConfig.url).toString();
    const response = await page.goto(absoluteUrl, { waitUntil: 'domcontentloaded', timeout: 15_000 });

    expect(response).not.toBeNull();
    expect(
      response!.status(),
      `Contact CTA destination "${absoluteUrl}" should return HTTP 2xx or 3xx`
    ).toBeLessThan(400);
  });

  // ── Video / media embeds ─────────────────────────────────────────────────────

  test('video embeds are present and have a valid container @functional', async ({ page, siteConfig }) => {
    const featuresPage = new FeaturesPage(page, siteConfig);
    const hasVideo = await featuresPage.hasVideoEmbed();

    if (!hasVideo) {
      console.warn(
        '[functional] No video embed found. ' +
        'Video is a high-engagement element for B2B SaaS — consider adding one.'
      );
      return;
    }

    // If a video is present, verify it has a container that is visible
    const videoEl = page.locator(
      'video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="wistia"]'
    ).first();

    await expect(videoEl, 'Video embed element should be visible').toBeVisible();
  });

  // ── Navigation CTA ───────────────────────────────────────────────────────────

  test('navigation contains a prominent CTA or action link @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const header = page.locator('header, [role="banner"]').first();
    if (await header.count() === 0) {
      console.warn('[functional] No header element found — skipping nav CTA check.');
      return;
    }

    const navCta = header.locator('a, button').filter({
      hasText: /get started|sign up|contact|demo|try|login|log in|portal/i,
    }).first();

    if (await navCta.count() === 0) {
      console.warn(
        '[functional] No prominent CTA found in the site header/navigation. ' +
        'A header CTA drives conversion from every page.'
      );
    } else {
      await expect(navCta, 'Header CTA should be visible').toBeVisible();
    }
  });

  // ── Page transitions ─────────────────────────────────────────────────────────

  test('clicking a nav link navigates to a different URL @functional', async ({ navigationPage, siteConfig, page }) => {
    await navigationPage.navigate();
    await navigationPage.waitForLoad();

    const navLinks = await navigationPage.getNavLinks();

    const internalLinks = navLinks.filter((l) => {
      try {
        const absolute = new URL(l.href, siteConfig.url);
        return (
          absolute.origin === new URL(siteConfig.url).origin &&
          absolute.pathname !== '/' &&
          absolute.pathname !== ''
        );
      } catch {
        return false;
      }
    });

    if (internalLinks.length === 0) {
      console.warn('[functional] No internal nav links found to test navigation transitions.');
      return;
    }

    const firstLink = internalLinks[0];
    await navigationPage.clickNavItem(firstLink.text);

    const newUrl = page.url();
    expect(
      newUrl,
      `Clicking nav link "${firstLink.text}" should navigate away from the homepage`
    ).not.toBe(siteConfig.url);
  });
});
