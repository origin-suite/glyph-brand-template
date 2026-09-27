import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { glyphLite } from '@originsuite/glyph/themes';
import { brandTheme } from './index';

/**
 * Template-only invariants: they assert this repo is still an unedited
 * pass-through of the Glyph baseline. Both self-disable the moment
 * package.json is renamed, so a brand repo that writes a real palette never
 * inherits a suite that fails on its first day.
 *
 * These are deliberately local. The contract and AA-contrast checks are not —
 * those ship from Glyph so every brand repo imports one implementation instead
 * of forking a copy at template-instantiation time (ORI-403). Nothing here is
 * a contract assertion; it is a claim about the template itself.
 */
const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
) as { name: string };

const IS_UNEDITED_TEMPLATE = pkg.name === '@brand/brand';

/**
 * Parsed group by group, never flattened.
 *
 * `color.surface` and `radius.surface` are both real contract keys, so a flat
 * set of key names cannot tell whether both were written down — the same trap
 * packages/glyph/src/themes/baselineDefaults.test.ts documents hitting.
 */
function tokensWrittenDown(): Record<string, Set<string>> {
  const source = readFileSync(new URL('./index.ts', import.meta.url), 'utf8');
  const written: Record<string, Set<string>> = {};
  let group: string | null = null;

  for (const line of source.slice(source.indexOf('tokens: {')).split('\n')) {
    const header = line.match(/^ {4}([A-Za-z]+): \{/);
    if (header) {
      group = header[1]!;
      written[group] = new Set();
      continue;
    }
    const pair = line.match(/^ {6}([A-Za-z][A-Za-z0-9]*): '/);
    if (pair && group) written[group]!.add(pair[1]!);
  }

  return written;
}

describe.skipIf(!IS_UNEDITED_TEMPLATE)(
  'the unedited template tracks the Glyph baseline',
  () => {
    /**
     * SKIPPED until the dev dependency moves to Glyph 0.3.0.
     *
     * src/index.ts documents the baseline rebuilt in ORI-422, which exists only
     * on glyph's main branch. Published 0.2.0 still carries the pre-rebuild
     * palette, so 32 of 65 leaves differ right now — expected, not drift. The
     * values are written as explicit overrides, so a brand renders the intended
     * palette either way; only the "this is the glyphLite default" comments are
     * wrong against 0.2.0.
     *
     * Unskip when package.json installs >=0.3.0. It then guards the real
     * failure: a baseline value moving without this file following. That has
     * already happened once inside Glyph — the template's `display` named the
     * sans stack for years after the baseline moved to serif.
     */
    it.skip('every token value equals the installed glyphLite baseline (needs Glyph 0.3.0)', () => {
      expect(brandTheme.tokens).toEqual(glyphLite.tokens);
    });

    /**
     * Version-independent, so this one runs today.
     *
     * The value check above is blind to a token ADDED to the contract:
     * createTheme merges it in from the baseline, so brandTheme carries it
     * while src/index.ts never mentions it — and whoever writes the next brand
     * reads an incomplete list with nothing warning them.
     */
    it('writes down every token the baseline defines', () => {
      const written = tokensWrittenDown();
      const absent: string[] = [];

      for (const [group, tokens] of Object.entries(glyphLite.tokens)) {
        for (const key of Object.keys(tokens)) {
          if (!written[group]?.has(key)) absent.push(`${group}.${key}`);
        }
      }

      expect(absent).toEqual([]);
    });
  }
);
