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
