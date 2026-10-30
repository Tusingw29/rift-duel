# Rift Duel: notes for coding agents

Read `skills/shared-board-etiquette/SKILL.md` first. The task board is `docs/EVIL_ZONE_TASKS.md`.

The project's skills are in `skills/`, one folder each, with a `SKILL.md` giving when to use it, the steps and known gotchas. Claude Code loads them through `.claude/skills`, a link to `skills/`. Other agents should open the matching `SKILL.md` before starting that kind of work.

| Department | Skills | Owner |
| --- | --- | --- |
| Direction | `playtest-triage` (with `codex-prompt.md`), `shared-board-etiquette` | Adam decides; Claude drafts |
| Combat and balance | `bot-probe`, `reaction-check`, `sim-audit`, `sandbox-scenarios` | Codex |
| Animation | `grounded-animation-authoring`, `visual-review-capture` | Claude |
| Characters and art | `fighter-model-build`, `costume-authoring`, `ps1-anime-fighter-art` | Claude |
| Pipeline and QA | `run-tests`, `visual-review-capture` | shared |

`blender-animation-threejs` and `rift-duel-character-pipeline` are historical. Fighters are built with Node and Three.js, not Blender.

House rules:
- Every gameplay change is opt-in behind a URL switch, and the default fingerprint stays unchanged.
- Assets must be licence-clean.
- Mocap BVH files stay out of the repo.
- Run tests with `node scripts/run-tests.mjs`.
