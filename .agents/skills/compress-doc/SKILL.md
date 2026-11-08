---
name: compress-doc
description: Shrink a long document (docs, specs, READMEs over ~5K tokens) before reading it, or make a compact version to keep around. Use when a doc is needed repeatedly or is too big to read whole.
---

# Compress a long document

Pick the cheapest step that answers the question; stop as soon as one does.

1. **Map it (free, local).** `npx @whoa-studio/Codex-kit compress --outline <file>` lists the headings with line
   numbers. Read only the sections you need with Read `offset`/`limit`.
2. **Pull out the facts (free, local).** `npx @whoa-studio/Codex-kit compress --extract <file>` keeps only API
   endpoints, constraints and limits, tables, code examples and numbers, each with its line
   number in the source. Good for "what are the rules / endpoints / limits in this spec?".
3. **Summarise (paid, sends the file to the Anthropic API).** Ask the user first, saying which
   file and that it goes to the API. If they agree:
   `npx @whoa-studio/Codex-kit compress --summarize --yes <file> > <dir>/<name>.summary.md`
   It keeps sections with code, tables and API references verbatim, summarises the rest to
   ~20% (`--ratio 0.3` to keep more), and leaves a pointer to the source lines for anything it
   omits. Mention the summary file to the user; don't `@import` it anywhere.

Never summarise legal text, security policies or anything the user needs verbatim; read those
ranges directly instead.
