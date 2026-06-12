# Agents — CleverDome QA Agentic Solution

This file documents the AI agent roles defined for this repository. It is read by Claude Code and other AI coding assistants (Cursor, GitHub Copilot, Devin, etc.) to understand the agent architecture.

Claude Code reads `CLAUDE.md` (which imports this file). Other tools that read `AGENTS.md` directly pick up the same definitions.

---

## Agent Roster

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`

**Role:** Crawls the live website and produces a fully-populated `site.config.json`. Use it to onboard a new company, verify config accuracy after a site redesign, or when running `/analyze-site`.

**Capabilities:**
- Navigate to URLs, follow redirects, resolve canonical URL
- Extract nav items, form fields, headings, and meta tags
- Detect authentication gates and SPA hydration delays
- Dismiss cookie consent banners before inspecting DOM structure

**Inputs:** `url` (required), `companyName` (optional)

**Output:** A valid `site.config.json` JSON block, an issues checklist, and a confidence assessment.

---

### `test-generator`

**File:** `.claude/agents/test-generator.md`

**Role:** Reads `site.config.json` and generates site-specific Playwright TypeScript test files beyond the shared generic suites. Output lands in `tests/custom/`.

**Capabilities:**
- Parse `site.config.json` and identify coverage gaps
- Generate `tests/custom/<scenario>.spec.ts` files
- Add locators to existing page objects or create new ones in `src/pages/`
- Follow strict TypeScript, async/await, and POM conventions throughout

**Inputs:** `siteConfig` (required), `testScenarios` (optional), `pagesToTest` (optional)

**Output:** TypeScript Playwright spec files written to `tests/custom/`.

---

## Agent Design Principles

All agents in this repository follow these rules:

1. **Read `site.config.json` before any test-related action** — it is the single source of truth for the target site.
2. **Never submit forms or create accounts** — test interaction and validation only.
3. **Use `baseURL` from Playwright config** — never hardcode site URLs in generated test code.
4. **Place assertions in test files** — page object methods are actions, not assertions.
5. **Tag every generated test** — use at least one of `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.
6. **Validate TypeScript** — run `npx tsc --noEmit` after generating code.

---

## Adding a New Agent

1. Create `.claude/agents/<agent-name>.md` with a `# Agent: <name>` header.
2. Define **Role**, **When to invoke**, **Capabilities**, **Inputs**, **Output**, and **Step-by-step instructions** sections.
3. Register the agent in this file under the "Agent Roster" section.
4. If the agent is invoked by a slash command, create a matching `.claude/commands/<command>.md`.
