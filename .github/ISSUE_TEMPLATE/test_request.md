---
name: Test Coverage Request
about: Request new test coverage for a page, feature, or user flow
title: "[TEST] "
labels: enhancement
assignees: ''
---

## What needs to be tested

<!-- Describe the page, feature, or user flow that lacks test coverage -->

**Page / URL path:** (e.g., `/pricing`, `/about`, `/resources`)
**Feature:** (e.g., pricing tiers, video embed, accordion FAQ)

## Type of coverage needed

- [ ] `@smoke` — basic availability
- [ ] `@navigation` — links and routing
- [ ] `@forms` — form fields and validation
- [ ] `@functional` — business logic and content
- [ ] `@visual` — screenshot regression
- [ ] `@responsive` — layout at breakpoints

## Why this matters

<!-- What does this test protect against? What regression would it catch? -->

## Acceptance criteria

<!-- How do we know the tests are good enough? -->

- [ ] ...
- [ ] ...

## Notes for implementer

<!-- Any known quirks, edge cases, or constraints on this page/feature -->

- Do not submit forms
- Do not create accounts
- Handle the case where the page may not exist on all environments
