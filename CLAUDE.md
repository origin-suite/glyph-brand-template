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
- **`glyph theme build` is the whole build**, replacing the `scripts/build-css.mjs`
  stopgap (deleted 2026-09-30). `tsc` cannot emit the `theme.css` the exports map
  promises, so the build is `glyph theme build --tsconfig tsconfig.build.json
  --fetch-globals` and nothing else.

  **There is no `tsc` step in front of it, and adding one back is duplication.** The
  build read `tsc -p tsconfig.build.json && glyph theme build …` until 2026-11-19,
  which compiled the repo twice over the same config — the CLI compiles it itself from
  the `--tsconfig` it is given. Verified before removal: from an empty `dist` the CLI
  alone reproduces every committed file byte for byte, `.d.ts` included.

  **The type-error gate is not lost with it.** The CLI's compile fails the build on a
  type error — exit 2, the offending file and TS code printed, and nothing written to
  `dist`:

  ```
  Unable to compile the brand repo at …
  src/brandTheme.ts(47,7): error TS2322: Type 'number' is not assignable to type 'string'.
  ```

  `pnpm typecheck` still runs ahead of it in CI, and still earns its place there: it
  uses `tsconfig.json`, which includes the test files that `tsconfig.build.json`
  excludes.
- **`build` must be passed `--tsconfig tsconfig.build.json`; `check` must not be.**
  The CLI compiles the repo itself and defaults to `tsconfig.json`, which here sets
  `noEmit: true` on purpose. As of `0.3.0-banana.2` a no-emit config is a hard error
  (exit 2) instead of a compile that writes nothing — before that, `build` reported
  success having emitted nothing of its own, and only looked correct because the `tsc`
  step ahead of it had already filled `dist`. That is the ORI-1245 shape: a pass that
  depended on what happened to be on disk. `check` needs no flag, because it compiles
  to a scratch tree and overrides `noEmit` there.
- **Both `build` and `check` pass `--fetch-globals`, and must keep passing it
  together.** Without it a `globals` URL on `http(s)://` is not read; it reports
  `globals-unchecked`, which blocks. A theme declaring no `globals` skips the
  validator entirely, so the flag is **inert in this repo** — `globals` in
  `src/brandTheme.ts` is commented out, and a brand pointing it at a local
  `src/globals.css` resolves to `file:` and needs no fetch either. It is here so a
  brand that hosts its globals sheet validates rather than blocks, and because the
  two commands must agree: a flag on one path only is how a PR passes `check` and
  fails `build`.
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
  behaviour, not a side effect. **The scope follows who can end up owning the repo**,
  revised 2026-11-18:
  - **An Origin brand → `@originsuite/<brand>-brand`.** `origin-brand` ships this way.
    Origin never hands its own brand over, so the scope costs nothing.
  - **A client brand → `@<client>/brand`.** `baldwin-brand` is `@baldwin/brand`. A
    client exit is a repo transfer, and this form survives one untouched: nothing of
    Origin's is left in the client's tree, and no consumer import changes.

  Nothing here is published either way, so the name is never resolved against the
  registry — it is only ever an import specifier.

  This **reverses** the blanket `@originsuite/<brand>-brand` rule settled 2026-09-30
  (ORI-404, `c7927dd`). That rule's stated upside was "a scope the org actually
  controls", which carries no mechanical force for a name that never reaches a
  registry — no collision, no squatting, nothing to control — while the handover
  rename it accepted as "a known cost" is real. It was also generalised from
  `origin-brand`, the one case where handover cannot happen. ORI-406, and ORI-405
  step 2 after it, had specified a client-owned scope on exactly these grounds
  beforehand, spelled `@baldwin-co/brand`; that spelling was never implemented.
  **Three forms therefore appear in the history and only one is current. Do not
  "fix" `@baldwin/brand` to either of the others.**
- **`private: true` stays.** Nothing here publishes, and it blocks an accidental
  `npm publish`.
- **`include-component-in-tag: false` stays.** release-please's manifest mode defaults
  it to *true* and derives the component from the package name, so tags would come out
  as `<package>-v1.0.0` — `origin-brand-v1.0.0`, `acme-brand-v1.0.0`, and for this
  unrenamed template `brand-v1.0.0`. That breaks three things: the documented
  `#v1.0.0` install command 404s, the ref differs per brand so no copy-pasteable
  command exists, and `glyph theme init` (ORI-166) has no predictable tag to pin.
  Found the hard way when origin-brand cut its first release (ORI-404).
- **CI runs `check` *and* `build` on pull requests, not `check` alone.** ORI-425's
  "done when" reads "`check` on PR and `build` on merge", which taken literally would
  move the `git diff --exit-code dist` guard off the only event where it can block
  anything. `dist` is committed, so a stale one has to fail the PR; discovering it on
  `main` is too late, because release-please tags that commit and the tag is what
  consumers pin. `check` is therefore wired as the fast validation gate *ahead of*
  build on both events, which is the "fast fail on a PR before spending the build"
  the ticket's Trigger section actually asks for.
- **pnpm settings live in `pnpm-workspace.yaml`** (`allowBuilds: esbuild`), not in
  `package.json`'s `pnpm` field — pnpm 11 stopped reading that field. vitest needs
  esbuild's postinstall, and CI needs the setting committed.

## Commands

```sh
pnpm install
pnpm check        # validate every theme, write nothing
pnpm build        # tsc + generate dist/theme.css
pnpm test         # vitest run
pnpm test:watch
```

`pnpm check` is the one command that leaves the tree untouched, so it is the one to
reach for while iterating on a palette. `pnpm build` cannot stand in for it: its
leading `tsc` emits `dist/*.js` before validation decides whether to write
`theme.css`, so a build that fails validation leaves `dist` half-updated and the
freshness diff reporting a change that is only the failure's own residue.

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
