# Implementation: Pages about copy

| Field | Value |
| --- | --- |
| Branch | `docs/pages-about-copy` |
| Worktree | `.worktrees/docs-pages-about-copy` |
| Status | In progress |

## Goal

Change the GitHub Pages hero from first person (“I build AtriumUI”) to product voice (“AtriumUI is…”).

## Linked official docs

- [docs/imp/docs/github-pages.md](./github-pages.md)
- [docs/imp/docs/pages-hero-theme.md](./pages-hero-theme.md)

## Decisions

- Only the visible hero paragraph; the meta description already started with “AtriumUI is”.

## Files touched

- `site/index.html`
- `docs/imp/docs/pages-about-copy.md`

## Leftover cleanup

- [ ] None

## TDD

Not applicable — static copy on `site/`.

## Verification

### Automated

- `npm run verify` (sanity; no production code change)

### Acceptance

- Hero reads “AtriumUI is a Home Assistant Lovelace design system…”

### Manual

1. Open https://alexnechayev.github.io/AtriumUI/ (hard-refresh)
2. Confirm the first sentence of the about paragraph
