# portfolio-v0

<!-- One or two sentences: what this project is, who uses it, what matters most. -->

<!-- claude-kit:begin stack -->

## Stack

- TypeScript on Bun (package manager: bun)
- Monorepo (workspaces + turbo), 3 packages: `apps/web`, `packages/config`, `packages/shadcn`
<!-- claude-kit:end stack -->

<!-- claude-kit:begin commands -->

## Commands

```bash
bun install     # install
bun run dev     # dev
bun run build   # build
bun run test    # test
bun run check   # check
bun run format  # format
```

<!-- claude-kit:end commands -->

## Conventions

<!-- Project rules Claude can't infer from the code, one line each. E.g. "Use the Result type for errors, never throw in services." -->

<!-- claude-kit:begin workflow -->

## Workflow

- **Plan first.** For changes touching more than ~3 files, start in Plan Mode (Shift+Tab), agree on the plan, then edit.
- **Decompose.** Split big tasks into steps that each end green (tests/typecheck pass) before starting the next.
- **Search, then read.** Grep/glob for the symbol you need instead of opening whole directories or large files.
- **Verify.** Run the relevant test/lint command before calling a task done.
<!-- claude-kit:end workflow -->

<!-- claude-kit:begin guardrails -->

## Guardrails

- Paths in `.claudeignore` are blocked from reading via `permissions.deny` in `.claude/settings.json`. Don't work around it with shell commands; ask if you need one of them.
- Lockfiles, build output and `.env*` files are edit-protected by `.claude/hooks/pre-edit.cjs`. Change the source of truth instead (manifest, sources).
<!-- claude-kit:end guardrails -->

<!-- claude-kit:begin task-context -->

## Task context

- For multi-step work, keep `.claude/context/task_context.md` current (goal, status, next steps). Update it before a session ends or when context runs long; it's re-loaded after compaction.
- When resuming a task, read it first.
<!-- claude-kit:end task-context -->

<!-- claude-kit:begin memory -->

## Team memory

- Past decisions, rejected approaches and lessons are in `.claude/context/conversation_memory.md`. Check it before revisiting a decision; append one line when a new one is made.
<!-- claude-kit:end memory -->

<!-- claude-kit:begin docs -->

## Docs

- Before changing an area, read the matching file in `docs/` (architecture, api-contracts, data-models, debugging) and update it in the same change.
<!-- claude-kit:end docs -->

<!-- claude-kit:begin map -->

## Codebase map

- `docs/INDEX.md` maps the repo by area and size. Start there instead of listing directories.
<!-- claude-kit:end map -->

<!-- claude-kit:begin agents -->

## Subagents

- Delegate broad searches to `explorer` (Haiku, read-only) so only its findings enter this context.
- For bugs and failing tests, run `/fix <symptom>`: it finds, diagnoses (via `debugger`), fixes, tests and retries.
- Ask `reviewer` to check the diff before calling a non-trivial change done.
- Use `test-writer` to add coverage for new behavior.
<!-- claude-kit:end agents -->

<!-- claude-kit:begin compress -->

## Large files

- To skim a big file, run `npx @whoa-studio/claude-kit compress --outline <path>` (declarations with line numbers), then read only the ranges you need.
<!-- claude-kit:end compress -->

<!-- claude-kit:begin search -->

## Code search

- For "where is X handled / defined / configured", call `search_code` (MCP server `code-search`) before grepping or opening files, then read only the line ranges it returns.
- Before changing a file, `related_files` lists what imports it and its tests.
<!-- claude-kit:end search -->

<!-- claude-kit:begin models -->
<!--
Models (for humans; not loaded into Claude's context):
- This project defaults to `opusplan` (.claude/settings.json): Opus in Plan Mode, Sonnet while executing.
- /model sonnet: everyday coding · /model opus: hard debugging and design · /model haiku: quick mechanical edits
- Personal override: /model <alias>, or set "model" in .claude/settings.local.json (not committed).
-->
<!-- claude-kit:end models -->

## Gotchas

<!-- Things that have bitten people before: flaky tests, env quirks, ordering constraints. -->
