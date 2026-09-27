# glyph-brand-template — Claude Code Context

## What this repo is

The generic template every Glyph brand repo is created from: public, template-flagged,
and containing **no brand content**. A new client is "Use this template" → rename →
write the theme. Origin and Baldwin are both consumers of it, not variants of it.

Authoritative spec is **ORI-403** in Linear (`origincreativ`). Related: ORI-402 (org
custom properties), ORI-404 (`origin-brand`), ORI-405 (`baldwin-brand`), ORI-166
(`glyph theme init`). The Glyph library itself is `../glyph-monorepo`, which owns the
token contract.

## The distribution model

- Consumed as a **git dependency pinned to a tag** — `pnpm add git+ssh://git@github.com/origin-suite/<brand>-brand.git#v1.0.0`.
- **Nothing here is ever published to npm.** No brand repo is. So this repo carries none
  of Glyph's OIDC, Trusted Publisher or provenance plumbing — do not copy that workflow's
  publish half in.
- `release.yml` is the `release-please-action` step alone. **The tag is the only reason
  release-please is here**, because that tag is what consumers pin.
- `@originsuite/glyph` is a peer dependency. The only runtime import is `createTheme`.

## Deliberate choices that look like bugs

Every item below was decided on purpose. Do not "fix" one without reading the ticket.

- **`dist/` is committed.** Git dependencies do not build on install, so consumers get
  these files as-is. **Never add `dist` to `.gitignore`.** CI enforces freshness with
  `git diff --exit-code dist`, so rebuild and commit it before pushing.
- **Source maps are off.** `dist` is reviewed by hand; maps would double its diff on
  every palette change.
- **The value check in `src/baseline-drift.test.ts` is skipped on purpose.**
  `src/index.ts` documents the baseline rebuilt in ORI-422, which exists only on glyph's
  `main`, while published 0.2.0 still carries the pre-rebuild palette — **32 of 65 leaves
  differ, and that is expected**. Unskip it only when the dev dependency moves to Glyph
  >= 0.3.0. Do not delete it and do not rewrite values to make it pass.
- **This repo does not implement contract or AA-contrast assertions.** They ship from
  Glyph and are imported, because a template's files are *copied* at instantiation and a
  local copy would fork into every brand repo the moment it is created. The three
  `it.todo` entries in `src/index.test.ts` hold the place until Glyph exports the
  validators (ORI-403). **Never reimplement them here.**
- **`scripts/build-css.mjs` is a stopgap, not tech debt.** `tsc` cannot emit the
  `theme.css` the exports map promises. `glyph theme build` replaces it when Glyph 0.3.0
  ships — a one-line change to the build script plus deleting the file.
- **`package.json` is named `@brand/brand`** — a placeholder. Renaming it self-disables
  the template-only tests, which is intended behaviour, not a side effect.
- **`private: true` stays.** Nothing here publishes, and it blocks an accidental
  `npm publish`.
- **pnpm settings live in `pnpm-workspace.yaml`** (`allowBuilds: esbuild`), not in
  `package.json`'s `pnpm` field — pnpm 11 stopped reading that field. vitest needs
  esbuild's postinstall, and CI needs the setting committed.

## Commands

```sh
pnpm install
pnpm build        # tsc + generate dist/theme.css
pnpm test         # vitest run
pnpm test:watch
```

## Conventions

- **Conventional Commits.** release-please reads them. The version starts at `0.0.0`;
  cut a brand's first release as `v1.0.0` with a `Release-As: 1.0.0` commit footer.
- **No AI attribution in commits** — no `Co-Authored-By: Claude` or any AI reference, ever.
- **Stage named files, never directories.**
- **PR titles must NOT carry a conventional prefix.** GitHub writes the PR title into the
  merge commit body, and a prefix there makes release-please count the work twice. Same
  rule as the Glyph monorepo.
- CSS uses `var(--glyph-*)` tokens only — no raw hex, rem or px literals.
- In the Glyph library the user writes implementation code and Claude writes the failing
  test. Scaffolding this repo was requested directly; when in doubt about writing
  implementation, ask.

## What must never end up here

- **Brand content of any kind** — no client tokens, fonts, logos or names. ORI-403's
  "done when" requires this repo to be verifiably generic.
- A publish step, or any npm credential plumbing.
- A copy of Glyph's contract or AA-contrast assertions.
