---
name: fix
description: Fix a bug end to end (find the code, diagnose the root cause, implement, verify with tests, retry on failure). Use for bug reports, failing tests and errors.
---

# Fix: $ARGUMENTS

Run this loop. Keep the main context small: subagents return findings, not file dumps.

1. **Find.** Call `search_code` with the symptom (error text, names), then `related_files` on the top hit to see its callers and tests.
2. **Diagnose.** Delegate to the `debugger` agent with the symptom, the error output and the
   files from step 1. Wait for its root cause, evidence, proposed fix and regression test.
3. **Implement.** Make the smallest change that fixes the root cause (not the symptom), and add
   the regression test it proposed. For more than a few test cases, delegate to `test-writer`.
4. **Validate.** Run the relevant tests and the typecheck/lint from AGENTS.md.
   - Passing: continue to step 5.
   - Failing: go back to step 3 with the previous attempt and the new failures in mind. Don't
     repeat an approach that already failed. After **2 failed retries**, stop and report what
     you tried, what failed and your best hypothesis, and ask the user how to proceed.
5. **Review.** For anything beyond a one-line fix, ask the `reviewer` agent to check the diff and
   address what it finds.
6. **Report** the root cause, the fix and the test in three short lines.

For a fix that spans several steps or sessions, keep `.Codex/context/task_context.md` updated after each step.
