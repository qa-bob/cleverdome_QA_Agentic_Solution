# GitHub Copilot Instructions — CleverDome QA Agentic Solution

This repository is a **Playwright + TypeScript** browser test suite for [CleverDome](https://www.cleverdome.com/), a B2B cybersecurity platform. It follows the **Page Object Model (POM)** design pattern with OOP principles throughout.

---

## Architecture Overview

```
src/pages/         Page Object classes — one per page or site section
src/fixtures/      Custom Playwright test fixture (exposes page objects)
src/utils/         Shared helpers (link checker, visual helper)
src/types/         TypeScript interfaces (SiteConfig)
tests/smoke/       @smoke — fast availability checks
tests/navigation/  @navigation — nav links and routing
tests/forms/       @forms — form fields and validation
tests/functional/  @functional — business feature coverage
tests/visual/      @visual — screenshot regression
tests/responsive/  @responsive — layout at breakpoints
tests/custom/      @custom — site-specific generated tests
```

---

## Rules for Generating Code

### Page Object Model (POM)

- Every page or major section has its own class in `src/pages/`
- All page object classes **extend `BasePage`** from `src/pages/base.page.ts`
- Locators are **`readonly Locator`** properties declared on the class
- Methods represent **user actions** — they navigate, click, fill, select
- **No `expect()` calls inside page objects** — assertions belong in test files only
- Use **role-based and semantic selectors** over CSS class names

```typescript
// ✅ Correct page object method
async clickGetStarted(): Promise<void> {
  await this.page.getByRole('link', { name: /get started/i }).first().click();
}

// ❌ Wrong — assertion in page object
async assertHeroVisible(): Promise<void> {
  await expect(this.heroSection).toBeVisible(); // belongs in test file
}
```

### Tests

- Import `test` and `expect` from `@fixtures/site.fixture` — **not** from `@playwright/test`
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- **Never hardcode the base URL** — use `siteConfig.url` from the fixture
- **Never submit forms** — test field interactions and validation only
- **Never create user accounts** or enter real credentials
- Use Playwright auto-waiting — avoid `page.waitForTimeout()` except for animation settling in visual tests

### TypeScript

- Strict mode is enabled — no implicit `any`, no `as any` without comment
- All method parameters and return types must be explicitly typed
- Use `async/await` throughout — no `.then()` chains in test code

### Path Aliases

Use these aliases instead of relative imports:

```typescript
import { BasePage } from '@pages/base.page';
import { loadSiteConfig } from '@app-types/site-config.types';
import { test, expect } from '@fixtures/site.fixture';
import { dismissCookieBanner } from '@utils/visual-helper';
```

---

## What NOT to Do

- Do not submit any form
- Do not create accounts or log in (unless `auth.required: true` in `site.config.json`)
- Do not hardcode `https://www.cleverdome.com` in test code — always use `baseURL` or `siteConfig.url`
- Do not use `page.waitForTimeout()` in functional/navigation tests (visual tests may use it for animation)
- Do not put `expect()` inside page object methods
- Do not use `any` type without an explicit `// eslint-disable` justification comment
- Do not import directly from `@playwright/test` in test files — use `@fixtures/site.fixture`

---

## Test Tagging Reference

| Tag | When to apply |
|-----|--------------|
| `@smoke` | Site loads, title present, no critical JS errors |
| `@navigation` | Nav links, routing, mobile menu, logo links |
| `@forms` | Form fields, validation, submit button presence |
| `@functional` | Business features: hero, CTA, sections, content |
| `@visual` | `toHaveScreenshot()` regression tests |
| `@responsive` | Viewport-specific layout checks |
| `@custom` | Site-specific tests generated for unique features |

---

## Site Configuration

`site.config.json` at the project root controls what gets tested:

```json
{
  "name": "CleverDome",
  "url": "https://www.cleverdome.com",
  "hasContactForm": true,
  "skipVisual": false,
  "skipForms": false,
  "auth": { "required": false }
}
```

Read this file before generating any selectors or assertions — it determines which test suites run.
