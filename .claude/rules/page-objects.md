---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

These rules apply whenever Claude is writing or editing files in `src/pages/`.

## Class structure

Every page object must:
1. `import { type Locator } from '@playwright/test'`
2. `import { BasePage } from '@pages/base.page'`
3. `export class <Name>Page extends BasePage`
4. Declare locators as `readonly Locator` properties

```typescript
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ExamplePage extends BasePage {
  readonly heroHeading: Locator = this.page.locator('h1').first();
  readonly ctaButton: Locator = this.page.getByRole('link', { name: /get started/i }).first();

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

## Critical rules

- **No `expect()` inside page objects** — assertions belong in test files
- Locators must be `readonly` — they are defined on instantiation, not recalculated
- Methods return `Promise<void>` for actions, or a typed value for getters
- Use `this.page` and `this.config` from `BasePage` — not the raw `page` parameter

## Selector strategy

Prefer in this order:
1. `this.page.getByRole('button', { name: /text/i })` — role + accessible name
2. `this.page.getByLabel('Field label')` — form fields
3. `this.page.locator('[data-testid="..."]')` — explicit test hooks
4. `this.page.locator('[aria-label="..."]')` — aria labels
5. Structural or semantic selectors (`'nav a'`, `'main h2'`)
6. CSS class selectors — only when no semantic alternative exists

## Method naming conventions

| Prefix | Returns | Example |
|--------|---------|---------|
| `get*` | `Promise<string>` / typed value | `getHeadingText(): Promise<string>` |
| `is*` / `has*` | `Promise<boolean>` | `isVisible(): Promise<boolean>` |
| `click*` / `open*` / `fill*` | `Promise<void>` | `clickPrimaryButton(): Promise<void>` |
| `navigate*` | `Promise<void>` | `navigateTo(path): Promise<void>` |

## No comments explaining what the code does

Only add a comment when the WHY is non-obvious (hidden constraint, workaround, subtle invariant). Method names should be self-documenting.
