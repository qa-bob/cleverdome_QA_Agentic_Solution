# Skills — CleverDome QA Agentic Solution

This file documents all slash commands (skills) available in Claude Code for this repository. Invoke any skill by typing `/command-name` in a Claude Code session.

Skill files live in `.claude/commands/`. Each `.md` file in that directory becomes an available slash command.

---

## Available Skills

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyzes the live website defined in `site.config.json`, then generates a complete Page Object Model and test suite covering all discovered pages and features.

**When to use:** First-time setup, or after a major site redesign requires full regeneration of tests.

**Steps it performs:**
1. Runs `/analyze-site` to populate `site.config.json`
2. Creates or updates POM classes in `src/pages/`
3. Generates spec files in `tests/smoke/`, `tests/navigation/`, `tests/forms/`, `tests/functional/`, `tests/visual/`, and `tests/responsive/`
4. Runs `npx tsc --noEmit` to verify TypeScript compiles cleanly

---

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Inspects the live site and outputs a fully-populated `site.config.json` with discovered nav items, form presence, viewport behavior, and site metadata.

**When to use:** Onboarding a new site, or verifying the config is still accurate after a redesign.

**Output:** Updated `site.config.json` + issues checklist.

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Runs the `@smoke` test suite (`npm run test:smoke`) and reports a structured summary of results.

**When to use:** Quick health check before a deployment or after a site change.

**Output:** Pass/fail counts per test, any errors, and next-step suggestions.

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Refreshes visual regression snapshot baselines (`npm run baseline`) after an intentional design change.

**When to use:** After a confirmed, intentional UI change that caused visual diff failures.

**Warning:** Only run this when design changes are confirmed intentional. Running it on a regression will lock in the broken state.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parses `test-results/results.json` and the Playwright HTML report, then displays a formatted test results summary table with pass rates, failed test details, and next-step recommendations.

**When to use:** After `npm test` to get a structured summary of the full run.

**Output:** Table with per-suite pass/fail/flaky counts, full list of failures with error messages, and suggested fixes.

---

## Creating a New Skill

1. Create `.claude/commands/<kebab-case-name>.md`.
2. Start with a `# /command-name` heading.
3. Add **Usage**, **What this command does** (numbered steps), and **Output format** sections.
4. Register the skill in this file under "Available Skills".
5. If the skill delegates to a sub-agent, reference the agent in `.claude/agents/` and document it in `AGENTS.md`.

---

## Skill vs. Agent: When to Use Each

| Use case | Mechanism |
|----------|-----------|
| Repeatable workflow you invoke explicitly | Slash command (skill) in `.claude/commands/` |
| Specialized worker for a complex subtask | Sub-agent in `.claude/agents/` |
| Rule that applies whenever Claude edits certain files | Path-scoped rule in `.claude/rules/` |
| Always-on project instruction | `CLAUDE.md` |
