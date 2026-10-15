#!/usr/bin/env node
// Fails when an upstream sync drops a pstack-light patch. Run after every merge.
import { readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SHARED_INTERFACE = "adds or changes an interface used by more than one module";

const INVARIANTS = [
  ["skills/poteto-mode/SKILL.md", "## Light mode"],
  ["skills/poteto-mode/SKILL.md", "A Small bug keeps Bug fix steps 1, 4, and 5"],
  ["skills/poteto-mode/SKILL.md", "**Re-size.**"],
  ["skills/poteto-mode/SKILL.md", "Actions outside the repo (team chat, ticket updates, paid evals) need the operator's yes"],
  ["skills/poteto-mode/SKILL.md", "The `effort ceiling` line"],
  ["skills/poteto-mode/SKILL.md", "A `route <work type>: <entry>` line"],
  ["skills/poteto-mode/SKILL.md", SHARED_INTERFACE],
  ["skills/poteto-mode/playbooks/feature.md", "Use the **arena** skill instead of one delegate only when"],
  ["skills/poteto-mode/playbooks/feature.md", SHARED_INTERFACE],
  ["skills/poteto-mode/playbooks/bug-fix.md", SHARED_INTERFACE],
  ["skills/poteto-mode/playbooks/bug-fix.md", "only for a regression whose history matters"],
  ["skills/poteto-mode/playbooks/perf-issue.md", SHARED_INTERFACE],
  ["skills/poteto-mode/playbooks/refactoring.md", SHARED_INTERFACE],
  ["skills/poteto-mode/playbooks/opening-a-pr.md", "plus `interrogate` when its brief asks for it"],
  ["skills/architect/SKILL.md", "unless this session already produced its explanation"],
  ["skills/arena/SKILL.md", "up to two seats"],
  ["skills/interrogate/SKILL.md", "up to two reviewers"],
  ["skills/setup-pstack/SKILL.md", "**(a) Ask for a setup style.**"],
  ["skills/setup-pstack/SKILL.md", "**(d) Ask for routes.**"],
  ["skills/unslop/SKILL.md", "If a skill named house-style is installed beside this skill"],
  ["skills/poteto-help/SKILL.md", SHARED_INTERFACE],
  ["skills/poteto-help/SKILL.md", "github.com/topmass/pstack-light-t3"],
];

// Upstream text that must not come back beside a light patch.
const FORBIDDEN = [
  ["skills/poteto-mode/playbooks/feature.md", "Mandatory: no skip-with-reason escape"],
  ["skills/poteto-mode/playbooks/bug-fix.md", "crosses a function boundary"],
  ["skills/poteto-mode/playbooks/perf-issue.md", "crosses a function boundary"],
  ["skills/poteto-mode/playbooks/refactoring.md", "crosses a function boundary"],
  ["skills/poteto-mode/SKILL.md", "crossing a function boundary"],
  ["skills/poteto-mode/SKILL.md", "up to max"],
  ["skills/poteto-help/SKILL.md", "crosses a function boundary"],
  ["skills/poteto-help/SKILL.md", "mariusflorescu/pstack-t3"],
  ["skills/setup-pstack/SKILL.md", "<entry>, <entry>, <entry>"],
  ["skills/arena/SKILL.md", "up to three"],
  ["skills/interrogate/SKILL.md", "up to three"],
];

const has = ([file, text]) => readFileSync(join(ROOT, file), "utf8").includes(text);
const missing = INVARIANTS.filter((row) => !has(row));
const returned = FORBIDDEN.filter(has);
for (const [file, text] of missing) console.log(`${file}: missing "${text}"`);
for (const [file, text] of returned) console.log(`${file}: upstream text is back "${text}"`);
console.log(`${INVARIANTS.length - missing.length}/${INVARIANTS.length} light patches present, ${returned.length} upstream lines back`);
process.exit(missing.length || returned.length ? 1 : 0);
