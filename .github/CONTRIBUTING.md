# Contributing to CleverDome QA Agentic Solution

Thank you for contributing to the CleverDome automated test suite. This guide covers everything you need to get set up, write good tests, and get your changes merged.

---

## Table of Contents

- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Writing Tests](#writing-tests)
- [Page Object Model Rules](#page-object-model-rules)
- [Code Quality](#code-quality)
- [Pull Request Process](#pull-request-process)
- [What NOT to Do](#what-not-to-do)

---

## Development Setup

### Prerequisites

| Tool | Minimum version | Check with |
|------|----------------|------------|
| Node.js | 18 | `node -v` |
| npm | 9 | `npm -v` |
| Git | 2.30 | `git --version` |

### Steps

```bash
# Clone the repo
git clone <repo-url>
cd cleverdome_QA_Agentic_Solution

# Install dependencies
npm install

# Install Playwright browsers and OS dependencies
npx playwright install --with-deps

# Verify everything works
npm run typecheck   # Should exit with no output
npm run lint        # Should exit with no errors
npm run test:smoke  # Should pass (requires internet access)
```

### VS Code (recommended)

Install the [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension for inline test running and step debugging.

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, always passing tests |
| `feat/<description>` | New test coverage for a feature |
| `fix/<description>` | Fix a broken or flaky test |
| `chore/<description>` | Dependency updates, config changes |

Branch off `main` and open a PR back to `main`.

```bash
git checkout main
git pull origin main
git checkout -b feat/pricing-page-tests
```

---

## Writing Tests

### Use the Custom Fixture

Always import `test` and `expect` from the project fixture — not from `@playwright/test` directly:

```typescript
// ✅ Correct
import { test, expect } from '@fixtures/site.fixture';

// ❌ Wrong
import { test, expect } from '@playwright/test';
```

The fixture provides pre-constructed page objects (`homePage`, `navigationPage`, `contactPage`) and `siteConfig` loaded from `site.config.json`.

### Tag Every Test

Every test must have at least one tag in the test name:

```typescript
test('hero section has a CTA button @functional', async ({ homePage }) => { ... });
```

| Tag | Suite folder | When to use |
|-----|-------------|-------------|
| `@smoke` | `tests/smoke/` | Availability, title, no JS errors |
| `@navigation` | `tests/navigation/` | Nav links, routing, menus |
| `@forms` | `tests/forms/` | Form fields, validation only |
| `@functional` | `tests/functional/` | Business features, content sections |
| `@visual` | `tests/visual/` | Screenshot regression |
| `@responsive` | `tests/responsive/` | Layout at viewport breakpoints |

### Never Hardcode URLs

```typescript
// ✅ Correct
await page.goto(siteConfig.url + '/contact');

// ❌ Wrong
await page.goto('https://www.cleverdome.com/contact');
```

### Never Submit Forms

```typescript
// ✅ Correct — fill but never submit
await contactPage.fillForm({ email: 'test@example.com' });
const hasEmailField = await contactPage.hasEmailField();
expect(hasEmailField).toBeTruthy();

// ❌ Wrong — never click submit
await submitButton.click();
```

### Prefer Playwright Auto-Waiting

```typescript
// ✅ Correct — Playwright auto-waits
await expect(locator).toBeVisible();
await locator.click();

// ❌ Wrong — manual timeout
await page.waitForTimeout(2000);
```

---

## Page Object Model Rules

Every page or major site section needs a class in `src/pages/`:

```typescript
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class MyPage extends BasePage {
  // ── Locators ────────────────────────────────────────────────────────────────
  readonly heroHeading: Locator = this.page.locator('h1').first();
  readonly ctaButton: Locator = this.page.getByRole('link', { name: /get started/i }).first();

  // ── Actions (no expect() here) ───────────────────────────────────────────────
  async clickCta(): Promise<void> {
    await this.ctaButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

**Rules:**
- Extend `BasePage`
- Locators are `readonly Locator` properties
- Methods are actions — they do things, not assert things
- No `expect()` inside page objects — those go in test files

### Registering a New Page Object

After creating `src/pages/my-page.page.ts`, add it to `src/fixtures/site.fixture.ts` if it needs to be available as a fixture.

---

## Code Quality

Before opening a PR, all of these must pass locally:

```bash
npm run typecheck   # Zero TypeScript errors
npm run lint        # Zero ESLint errors
npm run test:smoke  # Smoke tests pass
```

Optionally run the full suite locally:

```bash
npm test
```

---

## Pull Request Process

1. Open a PR against `main` using the PR template.
2. Fill in the "What changed" and "Test plan" sections.
3. Ensure GitHub Actions CI passes (green checkmark).
4. Request review from a team member.
5. Squash and merge once approved.

Visual baseline changes must include the updated `__snapshots__/` files committed to the PR.

---

## What NOT to Do

| Action | Reason |
|--------|--------|
| Submit any form | Sends real data to CleverDome's inbox |
| Create user accounts | Pollutes the production database |
| Hardcode site URLs | Breaks environment overrides |
| Put `expect()` in page objects | Violates POM separation of concerns |
| Use `page.waitForTimeout()` in non-visual tests | Causes flaky, slow tests |
| Use `any` type without justification | Defeats TypeScript strict mode |
| Import from `@playwright/test` in test files | Bypasses the custom fixture |
| Commit `node_modules/`, `.env`, or `test-results/` | These are gitignored for good reason |
