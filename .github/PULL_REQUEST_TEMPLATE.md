## What changed

<!-- Briefly describe the tests added, updated, or removed -->

- [ ] Added new tests
- [ ] Updated existing tests
- [ ] Fixed failing/flaky tests
- [ ] Updated page objects
- [ ] Updated configuration
- [ ] Updated documentation

## Test coverage

<!-- Which pages or features do the new/updated tests cover? -->

## How to verify

<!-- Steps a reviewer can follow to verify these changes work -->

```bash
# Run the affected suite(s)
npm run test:smoke
# or
npm run test:functional
# or
npm test
```

## Checklist

- [ ] `npm run typecheck` passes (zero TypeScript errors)
- [ ] `npm run lint` passes (zero ESLint errors)
- [ ] All new tests have at least one tag (`@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`)
- [ ] No hardcoded URLs — using `baseURL` or `siteConfig.url`
- [ ] No `expect()` calls inside page object methods
- [ ] No form submissions
- [ ] Visual snapshot baselines updated (if visual tests changed)
- [ ] Page object updated / created if new locators were needed
