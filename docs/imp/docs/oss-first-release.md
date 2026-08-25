# Implementation: OSS first-release packaging

| Field | Value |
| --- | --- |
| Branch | `docs/oss-first-release` |
| Worktree | `.worktrees/docs-oss-first-release` |
| Status | In progress (files ready; GitHub rename / public / tag next) |

## Goal

Prepare AtriumUI for a first public GitHub/HACS release: rename the GitHub repo from HAD to AtriumUI, add standard open-source project files, restructure the README, and attach `atrium-ui.js` via GitHub Releases.

## Linked official docs

- [README.md](../../../README.md)
- [docs/prd/platform/distribution-hacs.md](../../prd/platform/distribution-hacs.md)
- [docs/ops/install-and-resource.md](../../ops/install-and-resource.md)
- [docs/ARCHITECTURE.md](../../ARCHITECTURE.md) C1, C3
- [docs/PRD.md](../../PRD.md)

## Decisions

- Product tags (`au-*`) and bundle name (`atrium-ui.js`) stay unchanged.
- First public GitHub tag is `v0.5.4` to match `package.json` (no jump to 1.0.0).
- External contributors follow `CONTRIBUTING.md`; they are not required to use Cursor worktrees.
- TDD does not apply: no `src/` production behavior change.
- Historical `graphify-out/` snapshots are left as generated artifacts.
- Local iCloud folder `HAD` is not renamed (would break the Cursor workspace).

## Files touched

- `LICENSE`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`
- `.github/FUNDING.yml`, `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/release.yml`
- `README.md`, `package.json`, `hacs.json`
- `MASTER_ASSESSMENT.md`, `docs/PRD.md`, `docs/SCOPE_AND_FEATURES.md`
- `docs/ops/install-and-resource.md`, `docs/prd/platform/distribution-hacs.md`
- `docs/imp/docs/oss-first-release.md`

## Leftover cleanup

- [ ] Tag `v0.5.4` on `main` after this branch is merged (GitHub Release workflow attaches `atrium-ui.js`)
- [ ] Optional: add screenshots under `docs/assets/`
- [ ] Optional: rename the local checkout folder from `HAD` to `AtriumUI`

## TDD

Not applicable — documentation, license, GitHub metadata, and release workflow only. No production `src/` behavior was added or changed.

- Red: skipped (no production behavior)
- Green: `npm run verify` — 57 files / 470 tests passed; `dist/atrium-ui.js` built
- Refactor: n/a

## Verification

### Automated

- `npm run verify` (typecheck + lint + 470 tests + build) — passed in `.worktrees/docs-oss-first-release`
- Confirm `LICENSE`, `CONTRIBUTING.md`, issue templates, and `.github/FUNDING.yml` exist in the worktree

### Acceptance (from docs/prd/platform/distribution-hacs.md)

- AC3: HACS Dashboard install steps document `https://github.com/AlexNechayev/AtriumUI` (type Dashboard)

### Manual

1. Open `https://github.com/AlexNechayev/AtriumUI` (old `/HAD` URL should redirect)
2. New Issue → templates appear (bug / feature / question)
3. Sponsor/coffee button visible (FUNDING.yml)
4. After `v0.5.4` release: asset `atrium-ui.js` is attached
5. In HA: HACS → custom repository → `https://github.com/AlexNechayev/AtriumUI` → type Dashboard
