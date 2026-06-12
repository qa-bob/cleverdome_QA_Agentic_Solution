---
name: Failing Test / Bug Report
about: Report a test that is failing, flaky, or producing incorrect results
title: "[BUG] "
labels: bug
assignees: ''
---

## Test that is failing

<!-- Full test name, e.g. "Navigation @navigation > all nav links are reachable (no 404s)" -->

**Spec file:** `tests/<suite>/<file>.spec.ts`
**Test name:**

## Failure type

- [ ] Test consistently fails
- [ ] Test is flaky (sometimes passes, sometimes fails)
- [ ] Test produces incorrect assertion
- [ ] TypeScript compile error

## Error output

```
<!-- Paste the Playwright error message and stack trace here -->
```

## Environment

- **Branch:** `main` / `feat/...`
- **OS:** Windows / macOS / Ubuntu
- **Node version:** `node -v`
- **Playwright version:** `npx playwright --version`
- **Browser project:** `chromium-desktop` / `mobile-chrome` / `tablet`

## Steps to reproduce

```bash
npm run test:<suite>
# or
npx playwright test <path-to-spec> --project=chromium-desktop
```

## Expected behavior

<!-- What should happen? -->

## Actual behavior

<!-- What actually happens? -->

## Additional context

<!-- Screenshots, HTML snapshots, or any other relevant information -->
