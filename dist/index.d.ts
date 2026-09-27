/**
 * Brand theme.
 *
 * This file IS the deliverable: edit the values below and nothing else.
 * Every token shows its glyphLite default — change what you need,
 * delete what you don't. createTheme() merges onto the baseline,
 * so any omitted token keeps the glyphLite value.
 *
 * Three things the baseline's own palette will teach you, because you will
 * hit them the moment you change the brand colour:
 *
 *  1. `primaryContrast` is the text ON primary, so it belongs to the *pair*.
 *     glyphLite's green needs near-black text; a darker brand colour needs a
 *     light one. Change primary and you almost always change this too.
 *  2. `link` is not automatically the brand colour. A colour bright enough to
 *     fill a button is often too bright to read as text — glyphLite derives a
 *     darker green for links for exactly that reason.
 *  3. Hover moves *away* from the contrast text. glyphLite's contrast text is
 *     dark, so its hover darkens on light grounds and lightens on dark ones.
 *
 * Usage:
 *   import { ThemeProvider } from '@originsuite/glyph/theme';
 *   import { brandTheme } from '@brand/brand';
 *
 *   <ThemeProvider theme={brandTheme}>
 *     <App />
 *   </ThemeProvider>
 */
export declare const brandTheme: any;
