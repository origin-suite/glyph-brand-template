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
import { createTheme } from '@originsuite/glyph/theme';
export const brandTheme = createTheme({
    name: 'brand-template',
    // URL to a CSS file with @font-face declarations (leave empty for system fonts)
    // fontDefinition: '',
    // URL to a CSS file with global resets/base styles (leave empty if not needed)
    // globals: '',
    // Brand logos — read via useTheme().logoURLs
    // logoURLs: { full: '', thumb: '', bug: '', favicon: '' },
    tokens: {
        color: {
            // ── Surfaces ──
            surface: '#F5F0E1', // page/component ground
            surfaceRaised: '#EBE4D1', // cards, panels — one step from surface
            field: '#FCFAF3', // input/field background
            ink: '#2A2D28', // dark surface, near-black
            inkContrast: '#F5F0E1', // foreground on ink, near-white
            // ── Text ──
            text: '#33362F', // body text, >= 4.5:1 on surface
            textMuted: '#5F665C', // secondary text, >= 4.5:1 on surface
            link: '#157A3B', // derived darker green — see note 2 above
            // ── Brand (the 12 kernel tokens are marked ⚑ in tokens/contract.ts) ──
            primary: '#1FB255', // primary brand/action color
            primaryHover: '#199A48', // darkens: hover moves away from dark text
            primaryContrast: '#0C1810', // text ON primary, >= 4.5:1 — near-black here
            secondary: '#2A2D28', // second brand color, accents
            secondaryHover: '#3E4239', // hover/active shift of secondary
            secondaryContrast: '#F5F0E1', // text on secondary, >= 4.5:1
            accent: '#A8541E', // scarce high-emphasis accent — rust
            accentHover: '#8F4419', // hover/active shift of accent
            accentContrast: '#F5F0E1', // text ON accent, >= 4.5:1. accent is a fill,
            // so it is judged against this, not against surface
            // ── Rules ──
            line: '#D9D2BF', // subtle rule/divider
            lineStrong: '#BDB49E', // emphasized rule
            // ── Semantic (base + surface + contrast per status) ──
            // Never use brand colors here — these must be distinct. glyphLite's
            // success is a teal rather than a green for that reason: in the brand
            // hue it would read as just another primary button.
            //
            // Two different pairings are checked. `x` against `xContrast` is the
            // text on a filled element (4.5:1). `x` against `xSurface` is the alert
            // rule and icon on their own tint — non-text, so 3:1 (WCAG 1.4.11).
            success: '#256A5A', // teal, deliberately out of the brand hue
            successSurface: '#D7E6DF', // tinted background for banners/alerts
            successContrast: '#F5F0E1', // text on filled success element
            warning: '#8A6300',
            warningSurface: '#EFE3C6',
            warningContrast: '#F5F0E1',
            danger: '#A93520',
            dangerSurface: '#EBD5CB',
            dangerContrast: '#F5F0E1',
            info: '#6A5A9C', // dusty violet — the palette's only cool hue
            infoSurface: '#DED8E8',
            infoContrast: '#F5F0E1',
        },
        font: {
            // ── Families ──
            // No webfont and no network request: the stacks reach for the best face
            // each OS ships, and name EB Garamond for display without loading it.
            // Set `fontDefinition` above if your brand needs the file itself.
            sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI Variable Text", "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
            serif: '"EB Garamond", Garamond, "Times New Roman", serif',
            mono: 'ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Consolas, "Liberation Mono", monospace',
            // Display is the serif stack, not the sans one. The contract allows
            // either; glyphLite is an editorial system and headings set in the body
            // face gave it no voice.
            display: '"EB Garamond", Garamond, "Times New Roman", serif',
            // ── Scale (rem) ──
            sizeXs: '0.75rem', // captions, footnotes
            sizeSm: '0.875rem', // labels, kickers
            sizeMd: '1.0625rem', // body — anchor of the scale
            sizeLg: '1.3125rem', // ledes, h3-ish
            sizeXl: '1.75rem', // section headings
            sizeDisplay: '2.75rem', // hero/display headlines
            // ── Weight ──
            weightNormal: '400',
            weightMedium: '500',
            weightBold: '700',
            // ── Tracking (em) ──
            trackingTight: '-0.02em', // display/headline, often negative
            trackingNormal: '0', // body
            trackingKicker: '0.08em', // uppercase kickers/labels
            // ── Leading (unitless) ──
            leadingTight: '1.15', // headlines
            leadingNormal: '1.55', // body
            // ── Measure ──
            measure: '65ch', // max line length for editorial text
        },
        space: {
            xs: '0.25rem', // icon gaps, tight inline
            sm: '0.5rem', // control internal padding
            md: '1rem', // default gap between elements
            lg: '1.5rem', // between component groups
            xl: '3rem', // between page sections
            section: '6rem', // hero/section vertical rhythm
        },
        radius: {
            control: '0', // buttons, inputs, tags
            surface: '0', // cards, modals, popovers
        },
        borderWidth: {
            hairline: '1px', // subtle dividers
            rule: '1px', // load-bearing rule weight
            heavy: '2px', // emphasis — active states, blockquote bars
        },
        shadow: {
            raised: 'none', // the only shadow — 'none' for flat design
        },
        motion: {
            durationFast: '120ms', // micro-interactions (hover)
            durationBase: '200ms', // standard transitions
            easing: 'cubic-bezier(0.2, 0, 0, 1)', // default easing curve
        },
    },
});
