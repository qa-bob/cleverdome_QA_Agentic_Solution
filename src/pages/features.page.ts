import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface SectionInfo {
  heading: string;
  elementCount: number;
}

export class FeaturesPage extends BasePage {
  // ── Feature / service card sections ─────────────────────────────────────────

  private get featureCardLocator(): Locator {
    return this.page.locator(
      '[class*="feature"], [class*="service"], [class*="card"], ' +
      '[class*="benefit"], [class*="solution"], ' +
      '[data-testid*="feature"], [data-testid*="service"]'
    );
  }

  async getFeatureCards(): Promise<Locator[]> {
    return this.featureCardLocator.all();
  }

  async getFeatureCardCount(): Promise<number> {
    return this.featureCardLocator.count();
  }

  // ── Section headings ─────────────────────────────────────────────────────────

  async getH2Sections(): Promise<string[]> {
    const headings = await this.page.locator('h2').all();
    const texts: string[] = [];
    for (const h of headings) {
      const text = (await h.textContent())?.trim();
      if (text) texts.push(text);
    }
    return texts;
  }

  async getH3Headings(): Promise<string[]> {
    const headings = await this.page.locator('h3').all();
    const texts: string[] = [];
    for (const h of headings) {
      const text = (await h.textContent())?.trim();
      if (text) texts.push(text);
    }
    return texts;
  }

  // ── Accordion / expandable content ──────────────────────────────────────────

  async hasAccordion(): Promise<boolean> {
    const count = await this.page.locator(
      'details, [class*="accordion"], [class*="faq"], [role="button"][aria-expanded]'
    ).count();
    return count > 0;
  }

  async getAccordionItems(): Promise<Locator[]> {
    return this.page.locator(
      'details, [class*="accordion"] [class*="item"], [class*="faq"] [class*="item"]'
    ).all();
  }

  // ── Media / video embeds ─────────────────────────────────────────────────────

  async hasVideoEmbed(): Promise<boolean> {
    const count = await this.page.locator(
      'video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="wistia"], ' +
      '[class*="video"], [data-testid*="video"]'
    ).count();
    return count > 0;
  }

  // ── Social proof ─────────────────────────────────────────────────────────────

  async hasSocialProof(): Promise<boolean> {
    const count = await this.page.locator(
      '[class*="testimonial"], [class*="review"], [class*="quote"], ' +
      '[class*="partner"], [class*="logo"], [class*="trust"], ' +
      'blockquote'
    ).count();
    return count > 0;
  }

  async getStatNumbers(): Promise<string[]> {
    const statLocators = await this.page.locator(
      '[class*="stat"], [class*="number"], [class*="counter"], [class*="metric"]'
    ).all();
    const stats: string[] = [];
    for (const s of statLocators) {
      const text = (await s.textContent())?.trim();
      if (text) stats.push(text);
    }
    return stats;
  }

  // ── CTA discovery ────────────────────────────────────────────────────────────

  async getCtaButtons(): Promise<Locator[]> {
    const ctaLocator = this.page.locator('a, button').filter({
      hasText: /get started|try free|sign up|contact us|request demo|learn more|schedule|book/i,
    });
    return ctaLocator.all();
  }

  async getPrimaryCtaCount(): Promise<number> {
    return (await this.getCtaButtons()).length;
  }

  // ── Page section count ───────────────────────────────────────────────────────

  async getSectionCount(): Promise<number> {
    return this.page.locator('section, [class*="section"], main > div').count();
  }
}
