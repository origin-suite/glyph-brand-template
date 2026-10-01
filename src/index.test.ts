import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  type CollectedTheme,
  collectThemes,
  validateTheme,
  validateThemeContrast,
  validateThemeConventions,
  validateThemeGlobals,
  validateThemeSet,
} from '@originsuite/glyph/theme';
import * as brand from './index.js';

/**
 * The contract, AA-contrast, convention and globals checks are NOT
 * reimplemented here. They ship from Glyph so every brand repo imports one
 * implementation instead of forking a copy at "Use this template" time
 * (ORI-403). A local copy is exactly the drift that caused.
 *
 * Everything is driven off `collectThemes`, the same call `glyph theme build`
 * makes, so the suite can never test a different set of themes than the build
 * emits. Add a theme by adding a file and a line in src/index.ts; nothing
 * here changes.
 */
const themes = collectThemes(brand);

describe('the package barrel', () => {
  /**
   * `collectThemes` filters by `isTheme`, so a broken or renamed export does
   * not fail — it silently vanishes from the collection and every per-theme
   * block below still passes, just over fewer themes. This is the only
   * assertion standing between that and a green suite.
   */
  it('exports at least one theme', () => {
    expect(themes.length).toBeGreaterThan(0);
  });

  /**
   * Two themes sharing a `name` emit the same block into theme.css and the
   * second silently overwrites the first. Vacuous for a single-theme brand,
   * load-bearing the moment a second direction is added.
   */
  it('has no two themes claiming the same name', () => {
    expect(validateThemeSet(themes)).toEqual([]);
  });
});

describe.each<CollectedTheme>(themes)('$exportName', ({ theme }) => {
  it('satisfies the token contract', () => {
    expect(validateTheme(theme)).toEqual([]);
  });

  it('meets the documented AA contrast pairs', () => {
    expect(validateThemeContrast(theme)).toEqual([]);
  });

  it('expresses font sizes in rem', () => {
    expect(validateThemeConventions(theme)).toEqual([]);
  });

  /**
   * Covers both states in one assertion rather than an `it.todo`, so a globals
   * sheet added later is validated with no new wiring. A sheet scoped to the
   * wrong class still renders — it simply matches nothing, or leaks into a
   * nested provider — which is why this cannot be left until someone
   * remembers.
   */
  it('scopes its globals sheet correctly, or declares none', () => {
    if (!theme.globals) {
      expect(theme.globals).toBeFalsy();
      return;
    }
    const css = readFileSync(fileURLToPath(theme.globals), 'utf8');
    expect(validateThemeGlobals(theme, css)).toEqual([]);
  });
});

/**
 * Self-hosted webfonts, if this brand has any.
 *
 * Derived from src/fonts.css so it costs nothing for a brand on hosted fonts
 * and for the unedited template — both declare no faces and this passes with
 * an empty list. It only bites once someone vendors faces.
 *
 * Comments are stripped before matching, because the template ships this sheet
 * with every `@font-face` commented out and an example `url('./fonts/…')`
 * inside the comment.
 *
 * Both trees are checked, and they fail differently:
 *
 *   - src/fonts is the source — a face named but never vendored.
 *     `glyph theme build` mirrors every non-.ts file under src/ into dist/,
 *     so that is where vendored faces live; the root assets/ directory is
 *     not read by the build at all.
 *   - dist/fonts is what `./fonts/*` in the exports map actually resolves to,
 *     populated by the build
 *
 * Asserting only the source would report the repo healthy with nothing to
 * serve (ORI-566). Either failure degrades to the next family in the stack,
 * which renders — nothing looks broken, the brand is just absent.
 */
describe('self-hosted webfonts', () => {
  const declared = (() => {
    if (!existsSync('src/fonts.css')) return [];
    const sheet = readFileSync('src/fonts.css', 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      ''
    );
    return [...sheet.matchAll(/url\(\s*['"]\.\/fonts\/([^'"]+)['"]/g)].map(
      (m) => m[1]!
    );
  })();

  it('declares no faces, or every declared face is vendored and shipped', () => {
    const absent = declared.flatMap((face) =>
      ['src/fonts', 'dist/fonts']
        .filter((dir) => !existsSync(`${dir}/${face}`))
        .map((dir) => `${dir}/${face}`)
    );
    expect(absent).toEqual([]);
  });
});
