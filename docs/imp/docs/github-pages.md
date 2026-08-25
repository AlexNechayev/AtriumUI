# Implementation: GitHub Pages landing site

| Field | Value |
| --- | --- |
| Branch | `docs/github-pages` |
| Worktree | `.worktrees/docs-github-pages` |
| Status | In progress (deploying Pages) |

## Goal

Ship a public GitHub Pages site for AtriumUI at `https://alexnechayev.github.io/AtriumUI/` so Buy Me a Coffee and the GitHub repo homepage have a real project website (Name, About, Website).

## Linked official docs

- [README.md](../../../README.md)
- [docs/prd/platform/distribution-hacs.md](../../prd/platform/distribution-hacs.md)
- [docs/ops/install-and-resource.md](../../ops/install-and-resource.md)
- [docs/ARCHITECTURE.md](../../ARCHITECTURE.md) C1 (single module; site is not a second bundle)

## Decisions

- Do **not** publish the existing `docs/` PRD tree as Pages (internal specs).
- Static site lives in `site/` and is deployed with GitHub Actions (`actions/deploy-pages`).
- Visual language matches Home tokens: accent `#0a84ff`, radius 22px, rounded system sans.
- TDD does not apply: no `src/` production behavior.

## Files touched

- `site/index.html`, `site/styles.css`
- `.github/workflows/pages.yml`
- `package.json` homepage
- `README.md`, `docs/ops/install-and-resource.md`
- `docs/imp/docs/github-pages.md`

## Leftover cleanup

- [ ] Optional screenshots under `docs/assets/` embedded on the landing page
- [ ] Point Buy Me a Coffee **Website** at `https://alexnechayev.github.io/AtriumUI/` after the first Pages deploy

## TDD

Not applicable — static marketing page only.

- Red: skipped
- Green: `npm run verify` — 57 files / 470 tests passed
- Refactor: n/a

## Verification

### Automated

- `npm run verify` (sanity; no production code change expected)

### Acceptance

- Pages URL loads Name, About, HACS install, GitHub, and Buy Me a Coffee
- Repo homepage is the Pages URL

### Manual

1. Open `https://alexnechayev.github.io/AtriumUI/`
2. Click GitHub, HACS docs, and Buy Me a Coffee
3. Paste the same URL into Buy Me a Coffee → Website
