# Brand template

Template repo for a Glyph brand theme. One brand per repo: tokens, fonts, logos
and the rationale behind them. Consumed as a **git dependency pinned to a tag** —
nothing here is published to npm.

> **This is the generic template.** It contains no brand content. Create a repo
> from it with **Use this template**, then work through [First run](#first-run).

## First run

1. **Rename the package.** `package.json` ships as `@brand/brand`, a deliberate
   non-name — change it to `@originsuite/<brand>-brand`. Repo name is
   `<brand>-brand`. The scope is always `@originsuite`, including for client
   brands: it is a scope the org actually controls, and nothing here is
   published, so it is never resolved against the registry.
2. **Reset the version.** This repo is released, so a repo created from it
   inherits that state: `package.json` `version`, `.release-please-manifest.json`
   and a `CHANGELOG.md` describing *the template's* history. Set both versions to
   `0.0.0` and truncate `CHANGELOG.md` to its heading, or release-please proposes
   the wrong number and files a changelog with someone else's entries in it.
3. **Set the theme name.** `name:` in `src/brandTheme.ts` must be kebab-case; the
   CSS selector `[data-theme="<name>"]` is derived from it, so pick it once and
   leave it.
4. **Write the palette.** Every token in `src/brandTheme.ts` shows its `glyphLite`
   default with a comment explaining what it is for. Change what the brand needs,
   delete what it doesn't — `createTheme` merges onto the baseline, so an omitted
   token keeps the baseline value.
5. **Fonts.** Either point `fontDefinition` at a hosted stylesheet (Google, Adobe)
   and delete `src/fonts.css`, or self-host: drop `.woff2` files in
   `src/fonts/`, fill in `src/fonts.css`, and point `fontDefinition` at it.
   **Everything the package ships lives under `src/`** — `glyph theme build`
   mirrors every non-`.ts` file there into `dist/`, preserving nesting, and
   reads nothing outside it. Logos and other static files go in `src/assets/`.
6. **Globals.** Optional. Delete `src/globals.css` and the `globals` entry if the
   brand needs no base styles. Every rule in it must be scoped with
   `@scope (.theme-<name>) to ([data-theme])` or it leaks into the consuming app
   and into any nested provider — `validateThemeGlobals` checks both halves, and
   the test suite runs it automatically once a theme declares `globals`.
7. `pnpm install && pnpm build && pnpm test`, then **commit `dist`**.
8. Set the repo's custom properties and access — see
   [Repo conventions](#repo-conventions).

### More than one theme

A brand presenting several directions, or a light/dark/alt family, adds one file
per theme beside `src/brandTheme.ts` and one `export … from './<file>.js'` line
in `src/index.ts`. Nothing else changes: `glyph theme build` and the test suite
both read the barrel's namespace through `collectThemes`, so every theme is
built into one `dist/theme.css` and validated individually.

## Consuming this package

### React

```sh
pnpm add git+ssh://git@github.com/origin-suite/<brand>-brand.git#v1.0.0
```

```tsx
import { ThemeProvider } from '@originsuite/glyph/theme';
import { brandTheme } from '@originsuite/<brand>-brand';

<ThemeProvider theme={brandTheme}>
  <App />
</ThemeProvider>;
```

No Glyph change is needed to consume a brand — `ThemeProvider` accepts any
`GlyphTheme`.

### CSS only

Link the generated sheet and set the theme attribute on a wrapper:

```html
<link rel="stylesheet" href="node_modules/@originsuite/<brand>-brand/dist/theme.css" />
<div data-theme="<name>">…</div>
```

The sheet keys on `[data-theme]`, not a class. An element can carry several
theme classes — a derived theme's wrapper has its own plus its base's, via
`globalsScope` — but exactly one `data-theme`, so two blocks can never match the
same wrapper at equal specificity and leave file order to decide which paints.

Then read tokens as `var(--glyph-color-primary)` and so on.

### The git dependency is the only install path

There is no npm package to fall back to, so **a consumer building in CI needs
credentials for a private repo**. While the consumer is an Origin repo using
Origin credentials, no deploy key is required. A per-client deploy key only
becomes necessary when the client's own CI installs the dependency.

## Why `dist` is committed

Git dependencies do not run a build on install — a consumer gets the repo's
files as they are. So `dist` is committed, and CI fails any PR where it is stale
(`git diff --exit-code dist`). Regenerate with `pnpm build` before committing.

`dist/theme.css` is a **frozen snapshot** of the tokens at build time. A Glyph
release that only adds tokens needs no rebuild for the JS export, but does need
one for the CSS file.

## Tests

`pnpm test` asserts this repo's theme is well formed. The contract, AA-contrast
and convention checks are deliberately **not implemented here** — they ship from
Glyph so every brand repo imports one implementation instead of forking a copy
at template-instantiation time. The three `it.todo` entries in
`src/index.test.ts` land when Glyph exports the validators (ORI-403).

**Do not reimplement them locally.** A copy per brand repo is exactly the drift
that arrangement exists to prevent.

## Releases

release-please keeps a release PR open on `main`; merging it bumps the version,
writes `CHANGELOG.md` and tags `vX.Y.Z`. **That tag is the only reason
release-please is here** — consumers pin it.

There is no publish step, and this repo carries none of Glyph's npm plumbing.
Do not copy it in.

The version starts at `0.0.0`. To cut a brand's first release as `v1.0.0`, put
`Release-As: 1.0.0` in a commit footer.

## Ownership

The client owns the token values, the assets and the rationale behind them.
Origin owns Glyph and the token contract.

The package name is a separate question from ownership. It sits under
`@originsuite` regardless, so a repo handed over on client exit is renamed at
that point, along with the imports in whatever consumes it. Decided 2026-09-30;
the alternative (`@<brand>/brand`, which survives a transfer untouched) was
considered and not taken.

## Repo conventions

Naming, all in `origin-suite`: `<brand>-brand`, `<brand>-site`, `<brand>-app`.

Custom properties every brand repo sets:

| Property | Value |
| --- | --- |
| `brand` | the brand slug, e.g. `acme` |
| `project` | `glyph-theme` |
| `type` | `brand` |

Access: a client's developers are **outside collaborators with read on their own
repo** — never org members, so they never see the member list or any other repo.

## Token reference

65 tokens across 7 groups. `src/index.ts` is the authoritative annotated list;
the groups are:

| Group | Tokens | Covers |
| --- | --- | --- |
| `color` | 31 | surfaces, text, brand, rules, and the four semantic triples |
| `font` | 19 | families, the rem size scale, weights, tracking, leading, measure |
| `space` | 6 | `xs` → `section` |
| `radius` | 2 | `control`, `surface` |
| `borderWidth` | 3 | `hairline`, `rule`, `heavy` |
| `shadow` | 1 | `raised` |
| `motion` | 3 | two durations and an easing curve |

Three rules that catch people out, all explained inline in `src/index.ts`:
`primaryContrast` is the text *on* primary and belongs to the pair; `link` is
not automatically the brand colour; hover moves *away* from the contrast text.
Semantic statuses must never reuse the brand hue.
