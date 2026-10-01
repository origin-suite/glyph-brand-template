/**
 * The package barrel. One `export … from` line per theme.
 *
 * A brand with a single theme has one line here; a brand presenting several
 * directions, or a light/dark/alt family, has one per member. Nothing else
 * changes — `glyph theme build` and the test suite both read this module's
 * namespace through `collectThemes`, so adding a theme is a new file plus a
 * line here and no edits anywhere else.
 *
 * Note the `.js` extension on a `.ts` file. This package is pure ESM compiled
 * by `tsc`, which does not rewrite import specifiers, and Node's ESM resolver
 * does no extension guessing — so the specifier has to name the file that will
 * exist at runtime, in `dist`. Without it `tsc` fails with TS2835 and Node
 * would fail with ERR_MODULE_NOT_FOUND.
 */
export { brandTheme } from './brandTheme.js';
