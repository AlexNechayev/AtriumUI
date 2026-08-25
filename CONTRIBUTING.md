# Contributing to AtriumUI

Thanks for helping improve AtriumUI, a Home Assistant Lovelace design system.
By participating you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## How to report issues

Use a GitHub issue template — do not open a blank issue:

- **Bug report** — something does not work as documented
- **Feature request** — a card, shell, or editor change
- **Question** — install or YAML help

Security issues: see [SECURITY.md](SECURITY.md). Do not file public issues for vulnerabilities.

## Development setup

You need Node.js 22+ and npm.

```bash
git clone https://github.com/AlexNechayev/AtriumUI.git
cd AtriumUI
npm install
```

Useful commands:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run verify    # typecheck + lint + test + build (required before a PR)
```

Watch a build into a Home Assistant `www` folder:

```bash
HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha
```

See [docs/ops/local-dev-ha.md](docs/ops/local-dev-ha.md) for the HA loop and [demo/home-dashboard.yaml](demo/home-dashboard.yaml) for sample YAML (replace placeholder entity ids).

## Making a change

1. Fork the repository and create a branch from `main` (`feature/…`, `fix/…`, or `docs/…`).
2. For behavior changes, add or update Vitest tests under `test/**/*.test.ts` **before** changing `src/` (red → green → refactor). Prefer the acceptance criteria in `docs/prd/**`.
3. Keep the change scoped. Do not drive-by reformat unrelated files.
4. Follow existing Lit / TypeScript patterns. Cards must keep the native Lovelace contract (`setConfig`, entity updates, visual editor, teardown).
5. Run `npm run verify` and keep it green.
6. Open a pull request using the PR template. Link the issue if there is one.

Documentation-only changes do not need new tests, but they should stay consistent with [docs/PRD.md](docs/PRD.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Project constraints (do not break)

- Single ES module: `dist/atrium-ui.js`
- One shell card: `custom:au-shell-grid` (classic grid and Home → Rooms)
- Design tokens in `src/theme/tokens.ts` are the visual source of truth
- Preserve `AuActionCardBase`, `AuBaseEditor`, the `CARDS` registry, `resolveDomainControl`, and classic grid compatibility

## Pull request checklist

- [ ] `npm run verify` passes
- [ ] Tests cover new or changed behavior
- [ ] README / changelog updated when user-facing YAML or install steps change
- [ ] No secrets, credentials, or personal Home Assistant URLs

## Support the project

If AtriumUI is useful in your home, you can [buy Alex a coffee](https://www.buymeacoffee.com/AlexNechayev).
