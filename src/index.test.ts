import { existsSync, readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { brandTheme } from './index';

/**
 * The real contract, AA-contrast and convention checks are NOT written here on
 * purpose. They ship from Glyph so every brand repo imports one implementation
 * instead of forking a copy at "Use this template" time — see ORI-403. The
 * imports below land once Glyph exports them:
 *
 *   import { validateTheme, validateThemeContrast } from '@originsuite/glyph/theme';
 *
 *   it('is a valid theme', () => expect(validateTheme(brandTheme)).toEqual([]));
 *   it('meets AA', () => expect(validateThemeContrast(brandTheme)).toEqual([]));
 *
 * Do not reimplement them here. A local copy is exactly the drift ORI-403
 * exists to prevent.
 */
describe('brandTheme', () => {
  it('builds through createTheme without throwing', () => {
    expect(brandTheme).toBeTypeOf('object');
    expect(brandTheme.tokens).toBeTypeOf('object');
  });

  it('has a kebab-case name, which the CSS selector is derived from', () => {
    expect(brandTheme.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('carries every token group the contract requires', () => {
    expect(Object.keys(brandTheme.tokens).sort()).toEqual([
      'borderWidth',
      'color',
      'font',
      'motion',
      'radius',
      'shadow',
      'space',
    ]);
  });

  it.todo('satisfies the token contract — needs validateTheme exported (ORI-403)');
  it.todo('meets the documented AA contrast pairs — needs validateThemeContrast exported (ORI-403)');
  it.todo('scopes globals.css to .theme-<name> — needs validateThemeGlobals exported (ORI-403)');
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
 * inside the comment (see scripts/build-css.mjs, which does the same).
 *
 * Both trees are checked, and they fail differently:
 *
 *   - assets/fonts is the source — a face named but never vendored
 *   - dist/fonts is what `./fonts/*` in the exports map actually resolves to,
 *     populated by a copy step in the build
 *
 * The copy step is the one that was missing: this script only *logged* a
 * reminder, so the export pointed into a directory that did not exist
 * (ORI-566). Asserting only the source would have reported the repo healthy
 * with nothing to serve. Either failure degrades to the next family in the
 * stack, which renders — nothing looks broken, the brand is just absent.
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
      ['assets/fonts', 'dist/fonts']
        .filter((dir) => !existsSync(`${dir}/${face}`))
        .map((dir) => `${dir}/${face}`)
    );
    expect(absent).toEqual([]);
  });
});
