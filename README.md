# CleverDome — QA Agentic Solution

Playwright + TypeScript browser test suite for [CleverDome](https://www.cleverdome.com/), built with the **Page Object Model (POM)** design pattern and OOP principles. Designed for AI-assisted test generation and maintenance via Claude Code.

| | |
|---|---|
| **Site under test** | https://www.cleverdome.com |
| **Industry** | Cybersecurity (B2B SaaS) |
| **Test runner** | Playwright 1.44+ |
| **Language** | TypeScript 5 (strict mode) |
| **CI/CD** | GitHub Actions |

---

## Purpose

This repository provides automated browser regression testing for CleverDome's public website. Tests cover:

- **Smoke** — site availability, HTTPS, title, no JS errors
- **Navigation** — nav links, mobile menu, routing, logo link
- **Forms** — contact form fields and validation (no actual submission)
- **Functional** — homepage features, content sections, CTA flows, heading hierarchy
- **Visual** — screenshot regression at desktop / tablet / mobile
- **Responsive** — layout at 390px, 768px, 1280px viewport widths

No accounts are created. No forms are submitted. The suite is safe to run against the live production site.

---

## Development Environment Setup

### Prerequisites

| Tool | Minimum | Check |
|------|---------|-------|
| Node.js | 18 | `node -v` |
| npm | 9 | `npm -v` |
| Git | 2.30 | `git --version` |

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd cleverdome_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers + OS dependencies
npx playwright install --with-deps

# 4. Verify setup
npm run typecheck   # TypeScript compiles — no output means success
npm run lint        # ESLint — no output means success
npm run test:smoke  # Smoke tests pass (requires internet)
```

### Configuration

The site under test is configured in `site.config.json`:

```json
{
  "name": "CleverDome",
  "url": "https://www.cleverdome.com",
  "hasContactForm": true,
  "skipVisual": false,
  "skipForms": false
}
```

To override the URL without editing the config (e.g. for staging):

```bash
SITE_URL=https://staging.cleverdome.com npm test
```

---

## Running Tests

```bash
npm test                     # All tests — all browsers
npm run test:smoke           # @smoke tests only
npm run test:navigation      # @navigation tests only
npm run test:forms           # @forms tests only
npm run test:functional      # @functional tests only (add this script — see below)
npm run test:visual          # @visual screenshot regression
npm run test:responsive      # @responsive layout checks
npm run test:headed          # Run with visible browser window (useful for debugging)
npm run report               # Open Playwright HTML report
npm run baseline             # Update visual regression snapshot baselines
npm run typecheck            # TypeScript check (no output = pass)
npm run lint                 # ESLint
```

> Add `test:functional` to `package.json` scripts:
> `"test:functional": "playwright test --grep @functional"`

For interactive debugging, use the Playwright UI:
```bash
npx playwright test --ui
```

---

## Project Structure

```
cleverdome_QA_Agentic_Solution/
│
├── site.config.json          ← Site URL and feature flags — edit this first
├── playwright.config.ts      ← Playwright projects (desktop, mobile, tablet)
├── global-setup.ts           ← Pre-suite site reachability check
│
├── src/
│   ├── pages/                ← Page Object Model classes (one per page/section)
│   │   ├── base.page.ts      ← BasePage — shared navigation and helper methods
│   │   ├── home.page.ts      ← HomePage — hero, headings, CTA buttons
│   │   ├── navigation.page.ts← NavigationPage — nav links, mobile menu
│   │   ├── contact.page.ts   ← ContactFormPage — form fields, validation
│   │   └── features.page.ts  ← FeaturesPage — feature cards, sections, social proof
│   ├── fixtures/
│   │   └── site.fixture.ts   ← Custom Playwright fixture (exposes all page objects)
│   ├── utils/
│   │   ├── link-checker.ts   ← HTTP reachability helpers
│   │   └── visual-helper.ts  ← Cookie banner dismissal, screenshot helpers
│   └── types/
│       └── site-config.types.ts ← SiteConfig interface and loader function
│
├── tests/
│   ├── smoke/                ← @smoke — fast site health checks
│   │   └── site-availability.spec.ts
│   ├── navigation/           ← @navigation — nav links, routing, mobile menu
│   │   └── nav-links.spec.ts
│   ├── forms/                ← @forms — form inspection, validation (no submission)
│   │   └── contact-form.spec.ts
│   ├── functional/           ← @functional — business feature coverage
│   │   ├── homepage-features.spec.ts
│   │   ├── content-sections.spec.ts
│   │   └── cta-flows.spec.ts
│   ├── visual/               ← @visual — screenshot regression baselines
│   │   └── visual-regression.spec.ts
│   ├── responsive/           ← @responsive — viewport layout checks
│   │   └── layout.spec.ts
│   └── custom/               ← @custom — site-specific generated tests (gitignored or committed)
│
├── .claude/
│   ├── agents/               ← Claude Code sub-agent definitions
│   │   ├── site-analyzer.md  ← Crawls the site and updates site.config.json
│   │   └── test-generator.md ← Generates site-specific tests
│   ├── commands/             ← Slash commands (skills) for Claude Code
│   │   ├── generate-full-suite.md
│   │   ├── analyze-site.md
│   │   ├── run-smoke.md
│   │   ├── update-baseline.md
│   │   └── generate-report.md
│   └── rules/                ← Path-scoped coding rules
│       ├── playwright-testing.md   ← Rules for tests/**/*.spec.ts
│       └── page-objects.md         ← Rules for src/pages/**/*.ts
│
├── .github/
│   ├── copilot-instructions.md     ← GitHub Copilot / AI agent rules
│   ├── CONTRIBUTING.md             ← Contributor guide
│   ├── PULL_REQUEST_TEMPLATE.md    ← PR checklist
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md           ← Failing test report template
│   │   └── test_request.md         ← New coverage request template
│   └── workflows/
│       └── playwright.yml          ← CI: run tests on every PR and push to main
│
├── AGENTS.md                 ← AI agent role definitions (all tools)
├── Skills.md                 ← Slash command / skill documentation
├── CLAUDE.md                 ← Claude Code project instructions
└── __snapshots__/            ← Visual regression baselines (committed to repo)
```

---

## Architecture: Page Object Model (POM)

Every page or major site section has a class in `src/pages/`. OOP principles applied:

- **Inheritance** — all page objects extend `BasePage`
- **Encapsulation** — locators are `readonly Locator` properties; actions are methods
- **Single Responsibility** — one class per page or section
- **No assertions in page objects** — `expect()` belongs in test files only

```typescript
// src/pages/example.page.ts
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ExamplePage extends BasePage {
  readonly heroHeading: Locator = this.page.locator('h1').first();
  readonly primaryCta: Locator = this.page.getByRole('link', { name: /get started/i }).first();

  async clickPrimaryCta(): Promise<void> {
    await this.primaryCta.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

### Custom Fixture

Import `test` and `expect` from the project fixture — never from `@playwright/test` directly:

```typescript
import { test, expect } from '@fixtures/site.fixture';

test('hero has a CTA @functional', async ({ homePage, siteConfig }) => {
  const ctas = await homePage.getCTAButtons();
  expect(ctas.length).toBeGreaterThan(0);
});
```

---

## Agents, Skills, and Rules

### Agents

Specialized Claude Code sub-agents that handle specific tasks in isolation. Defined in `.claude/agents/`.

| Agent | Purpose |
|-------|---------|
| `site-analyzer` | Crawls the live site and produces an updated `site.config.json` |
| `test-generator` | Generates site-specific Playwright tests from `site.config.json` |

Full documentation: [`AGENTS.md`](AGENTS.md)

### Skills (Slash Commands)

Reusable workflows invoked with `/command-name` in a Claude Code session. Defined in `.claude/commands/`.

| Command | Purpose |
|---------|---------|
| `/generate-full-suite` | Analyze site + generate complete POM and test suite |
| `/analyze-site` | Inspect the live site and update `site.config.json` |
| `/run-smoke` | Run smoke tests and report results |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Generate formatted test results summary |

Full documentation: [`Skills.md`](Skills.md)

### Rules

Path-scoped coding rules that load automatically when Claude edits matching files. Defined in `.claude/rules/`.

| Rule | Applies to | Purpose |
|------|-----------|---------|
| `playwright-testing.md` | `tests/**/*.spec.ts` | Test import, tagging, fixture, selector conventions |
| `page-objects.md` | `src/pages/**/*.ts` | POM structure, locator strategy, method naming |

### .github Folder Contents

| File | Purpose |
|------|---------|
| `copilot-instructions.md` | Architecture rules for GitHub Copilot and other AI coding assistants |
| `CONTRIBUTING.md` | Contributor setup, branching, test writing, and PR guidelines |
| `PULL_REQUEST_TEMPLATE.md` | Checklist for PRs (typecheck, lint, tags, no form submission) |
| `ISSUE_TEMPLATE/bug_report.md` | Template for reporting failing or flaky tests |
| `ISSUE_TEMPLATE/test_request.md` | Template for requesting new test coverage |
| `workflows/playwright.yml` | GitHub Actions CI — runs full suite on push + smoke tests on PRs |

---

## Contributor Rules

> Full guide: [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md)

1. **Never submit a form** — test field interactions and validation only
2. **Never hardcode the site URL** — use `siteConfig.url` or Playwright `baseURL`
3. **Import from `@fixtures/site.fixture`** — not from `@playwright/test`
4. **Tag every test** with at least one of `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
5. **No `expect()` inside page objects** — assertions belong in test files
6. **No `page.waitForTimeout()`** in smoke/nav/forms/functional tests
7. **Run before opening a PR:**
   ```bash
   npm run typecheck && npm run lint && npm run test:smoke
   ```

---

## CI/CD

GitHub Actions runs on every push to `main` and every pull request:

- **Full matrix** (`chromium-desktop`, `mobile-chrome`, `tablet`) — push to main
- **Smoke gate** (`chromium-desktop` only) — pull requests (fast feedback)
- Artifacts: HTML report, JSON results, and failure screenshots uploaded for 14 days

See [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml).

---

*This project is part of the Phoenix Startup QA Agentic Solutions initiative.*
