# pstack-light for T3 Code

pstack is an engineering skill library for coding agents by Lauren Tan ([poteto](https://x.com/poteto)). [pstack-t3](https://github.com/mariusflorescu/pstack-t3) ports it to [T3 Code](https://github.com/pingdotgg/t3code) for Claude Code and Codex threads. pstack-light is a fork of that port. It keeps the rules that catch bugs and trims the rules that launch extra agents or raise reasoning effort.

## Why a light version

Full pstack sends a medium feature through four skills that each launch agents: `how`, `architect`, `arena`, and `interrogate`. Each panel defaults to three models. By our count from the skill text, one feature can start about ten child agents. We have not measured that count. Effort can also climb to max on hard work.

That cost pays off on a migration or a cross-cutting redesign. Most daily work is a one-file fix or a small feature, and there it burns tokens without catching more bugs. pstack-light sizes each task first and spends agents only where the task needs them.

## What you keep

- Every skill, playbook, and principle from pstack-t3, with the same names.
- The bug-fix discipline. The agent reproduces the bug on the real surface, finds the root cause with runtime evidence, and ships only what the evidence supports.
- The test rules. A test calls the code the way users do and asserts a literal result. The agent deletes any test that would still pass if every function returned `undefined`. The `tdd` skill prefers no test to a bad test.
- Proof before done. The agent verifies the real artifact, not a proxy like "it compiles".
- Multi-model review with `/interrogate` and design bakeoffs with `/arena`, when the work earns them.

## What changes

| Rule | pstack-t3 | pstack-light |
|---|---|---|
| Task size | Every task runs a playbook | A small task skips the playbook and every fan-out skill |
| `architect` | Any code that crosses a function boundary | A change to an interface that more than one module uses |
| `arena` in the Feature playbook | Mandatory when more than one design is valid | Only when the design is still open and a wrong pick is costly to undo |
| `how` and `why` in the Bug fix playbook | Always | `how` only for an unread subsystem, `why` only for a regression whose history matters |
| Panel size with no models file | Up to three seats | Up to two seats |
| Reasoning effort | Starts at xhigh and can rise to max | Starts at high and needs your yes to go higher |
| External actions | Team chat, tickets, and evals proceed without asking | They need your yes first |
| `unslop` | pstack's own rules | Defers to a `house-style` skill if you have one |

The Feature playbook still delegates every diff to a child agent. That keeps the author and the reviewer separate, which is where pstack catches most mistakes.

## Install

```bash
npx skills add topmass/pstack-light-t3 -g -a claude-code -a codex
```

This command copies each skill into `~/.agents/skills/` for Codex and links it from `~/.claude/skills/` for Claude Code. Install globally or per project, but not both. Codex loads neither copy when the same skill name exists in both places.

Some setups make `~/.claude/skills` a symlink to `~/.agents/skills`. In that setup, clone the repo and link each skill yourself:

```bash
git clone https://github.com/topmass/pstack-light-t3 ~/Code/pstack-light-t3
for d in ~/Code/pstack-light-t3/skills/*/; do ln -s "$d" ~/.agents/skills/; done
```

You also need `gh` and [Bun](https://bun.sh). The `orch` and `watch-pr` scripts run on Bun.

## Get started

1. Run `/setup-pstack`. Pick the `medium - high reasoning` budget. The skill writes one model per role to `~/.config/pstack/pstack-models.md`.
2. Run `/poteto-mode` for features and hard bugs. The agent states the size it picked. Small fixes do not need it.
3. Run `/poteto-help` when you are not sure which skill fits.

Codex threads type `$<name>` where this README writes `/<name>`.

## Skills you will use most

| Skill | Use it when |
|---|---|
| `/poteto-mode` | You start a feature, a hard bug, or a migration. |
| `/poteto-help` | You are not sure which skill or playbook fits. |
| `/setup-pstack` | You want to pick the model and effort for each role. |
| `/interrogate` | You have a diff and want several models to try to break it. |
| `/blast-radius` | A small change might break something else, and you want proof by running code. |
| `/arena` | You want several attempts at one artifact and the best parts of each. |
| `/why` | You want to know why code was built a certain way. |
| `/deslop` | You want AI slop removed from the branch before you commit. |
| `/tdd` | You fix a bug that has a cheap local test path. |

All 55 skills live in `skills/`. `/poteto-help` explains each one.

## How it works on T3

Every delegated agent is a T3 `delegate_task` child on the model you picked for its role. A writer that needs its own branch runs in a T3 worktree thread. `gh` opens PRs, and T3's PR watch wakes the thread when checks finish. [T3-NATIVE.md](./T3-NATIVE.md) maps each Cursor mechanism to its T3 tool, and `node scripts/check-t3-native.mjs` enforces that map.

## Staying current

This fork tracks pstack-t3 as the `upstream` remote. To sync, run `git fetch upstream && git merge upstream/main` and keep every change in the table above. Then run these checks:

```bash
node scripts/check-t3-native.mjs
cd skills/poteto-mode/scripts && bun test && bun run typecheck
```

## Credit

pstack is by [Lauren Tan](https://x.com/poteto), from [cursor/plugins](https://github.com/cursor/plugins/tree/main/pstack). The T3 port is [mariusflorescu/pstack-t3](https://github.com/mariusflorescu/pstack-t3). `skills/deslop` comes from cursor/plugins `cursor-team-kit`. This fork is not affiliated with Cursor, with the pstack author, or with the pstack-t3 author.

## License

MIT. [LICENSE](./LICENSE) keeps the upstream copyright notices.
