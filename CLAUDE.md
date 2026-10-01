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
- **The value check in `src/baseline-drift.test.ts` is live** as of the move to
  `0.3.0-banana.0` (2026-09-30), and passes. It was skipped while this repo installed
  published 0.2.0, whose pre-rebuild palette differed from the ORI-422 baseline
  `src/brandTheme.ts` documents in **32 of 65 leaves**. It now guards the real failure:
  a baseline value moving without this file following. Do not delete it and do not
  rewrite values to make it pass — if it fails, the annotated file is stale.
- **This repo does not implement contract, AA-contrast, convention or globals
  assertions.** They ship from Glyph and are imported, because a template's files are
  *copied* at instantiation and a local copy would fork into every brand repo the moment
  it is created. All four validators are wired in `src/index.test.ts` as of the 0.3.0
  dep move; the `it.todo` placeholders are gone. **Never reimplement them here.**
- **The suite is driven by `collectThemes`, never a hand-written list.** It reads the
  barrel's namespace — the same call `glyph theme build` makes — so the tests cannot
  cover a different set of themes than the build emits. `collectThemes` filters by
  `isTheme`, so a broken export silently *shrinks* the collection rather than failing;
  the "exports at least one theme" assertion is what stops that passing quietly.
- **One theme per file, re-exported from `src/index.ts`.** A brand with several
  directions or a light/dark/alt family adds a file and a barrel line, nothing else.
  Relative specifiers carry a **`.js` extension** even though the sources are `.ts`:
  pure ESM compiled by `tsc`, which does not rewrite specifiers, and Node's ESM
  resolver does no extension guessing.
- **`glyph theme build` emits the CSS**, replacing the `scripts/build-css.mjs` stopgap
  (deleted 2026-09-30). `tsc` cannot emit the `theme.css` the exports map promises, so
  the build is `tsc -p tsconfig.build.json && glyph theme build`.
- **The static sheet keys on `[data-theme="<name>"]`, not `.theme-<name>`.** The stopgap
  emitted the class form; the CLI does not, and the CLI is correct — an element carries
  many theme classes (a derived theme's wrapper has its own plus its base's, via
  `globalsScope`) but exactly one `data-theme`, so two class-keyed blocks could match
  the same wrapper at equal specificity. **Any repo migrating off the stopgap changes
  its public CSS contract and needs a major bump**, not a quiet swap.
- **`tsconfig.json` checks, `tsconfig.build.json` emits.** The checking config includes
  the test files on purpose: an editor type-checks a file using the nearest tsconfig
  that *includes* it, so excluding tests drops them into an inferred project and they
  show errors in the IDE that `tsc` and CI never see. CI runs `pnpm typecheck` before
  `pnpm build`.
- **`package.json` is named `@brand/brand`** — a placeholder, and a deliberate
  non-name. Renaming it self-disables the template-only tests, which is intended
  behaviour, not a side effect. **Rename to `@originsuite/<brand>-brand`** — the scope
  is always `@originsuite`, including for client brands. Nothing here is published, so
  the name is never resolved against the registry; it is only an import specifier.
  Settled 2026-09-30 (ORI-404). The alternative, `@<brand>/brand`, would survive a
  client handover untouched, which the chosen form does not — a transferred repo gets
  renamed along with its consumers' imports.
- **`private: true` stays.** Nothing here publishes, and it blocks an accidental
  `npm publish`.
- **`include-component-in-tag: false` stays.** release-please's manifest mode defaults
  it to *true* and derives the component from the package name, so tags would come out
  as `<package>-v1.0.0` — `origin-brand-v1.0.0`, `acme-brand-v1.0.0`, and for this
  unrenamed template `brand-v1.0.0`. That breaks three things: the documented
  `#v1.0.0` install command 404s, the ref differs per brand so no copy-pasteable
  command exists, and `glyph theme init` (ORI-166) has no predictable tag to pin.
  Found the hard way when origin-brand cut its first release (ORI-404).
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
