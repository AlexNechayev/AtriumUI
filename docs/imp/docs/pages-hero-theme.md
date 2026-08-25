# Implementation: Pages hero layout and theme

| Field | Value |
| --- | --- |
| Branch | `docs/pages-hero-theme` |
| Worktree | `.worktrees/docs-pages-hero-theme` |
| Status | In progress |

## Goal

Tighten the GitHub Pages landing hero: drop the Name/By/Website meta row, move Install with HACS into the Install section, move Buy me a coffee into the footer, and add System / Light / Dark (System default).

## Linked official docs

- [docs/imp/docs/github-pages.md](./github-pages.md)
- [docs/prd/platform/distribution-hacs.md](../../prd/platform/distribution-hacs.md)

## Decisions

- Theme default is **System** (`prefers-color-scheme`); explicit Light/Dark persist in `localStorage` (`au-theme`). Colors apply via `html[data-resolved]` so Dark actually overrides light tokens.
- Header coffee nav link removed; coffee CTA lives in the footer only.
- Header Install jumps to `#install` on the same page.

## Files touched

- `site/index.html`
- `site/styles.css`
- `docs/imp/docs/pages-hero-theme.md`

## Leftover cleanup

- [ ] None

## TDD

Not applicable — static `site/` HTML/CSS only. No `src/` production behavior.

## Verification

### Automated

- `npm run verify` (sanity; no production code change expected)

### Acceptance

- Hero has no Name/By/Website `dl.meta`
- Install with HACS is in `#install`
- Buy me a coffee is in `footer`
- Theme control: System (default), Light, Dark

### Manual

1. Open `https://alexnechayev.github.io/AtriumUI/` (after deploy) or `site/index.html`
2. Confirm hero CTAs, install button, footer coffee
3. Cycle System / Light / Dark; reload and confirm persistence
4. With System selected, flip OS appearance and confirm the page follows
