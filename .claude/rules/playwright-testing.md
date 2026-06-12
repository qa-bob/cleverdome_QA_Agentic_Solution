---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Playwright Test File Rules

These rules apply whenever Claude is writing or editing files in `tests/`.

## Imports

Always import from the project fixture, never from `@playwright/test` directly:

```typescript
import { test, expect } from '@fixtures/site.fixture';
```

## Test structure

Every test must:
1. Be inside a `test.describe()` block that includes the tag in the description
2. Have the tag in the individual test name as well
3. Use `async/await` — no promise chains

```typescript
test.describe('Feature Name @functional', () => {
  test('describes behavior clearly @functional', async ({ homePage }) => {
    // ...
  });
});
```

## Available fixtures

| Fixture | Type | Notes |
|---------|------|-------|
| `siteConfig` | `SiteConfig` | Loaded from `site.config.json` |
| `homePage` | `HomePage` | Pre-navigated to site root |
| `navigationPage` | `NavigationPage` | Not pre-navigated |
| `contactPage` | `ContactFormPage` | Not pre-navigated |
| `page` | Playwright `Page` | Raw page (use for viewport overrides) |

## Selectors

Prefer in this order:
1. `getByRole()` — semantic, accessible
2. `getByText()` / `getByLabel()` — user-visible text
3. `locator('[data-testid="..."]')` — test-specific attributes
4. `locator('[aria-label="..."]')` — accessibility attributes
5. CSS class selectors — last resort, most brittle

## Tags (required on every test)

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, title, HTTPS check |
| `@navigation` | Nav links, routing, mobile menu |
| `@forms` | Form fields, validation, no submission |
| `@functional` | Business features, content sections |
| `@visual` | `toHaveScreenshot()` calls |
| `@responsive` | Viewport-specific layout |

## Do not

- Use `page.waitForTimeout()` in smoke/navigation/forms/functional tests
- Call `expect()` inside page object methods
- Hardcode URLs — use `siteConfig.url` or Playwright `baseURL`
- Submit forms
- Use `any` type without `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment
