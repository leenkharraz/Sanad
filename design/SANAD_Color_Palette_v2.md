# SANAD Color Palette V2 — Figma-Aligned

This palette is aligned to the actual SANAD prototype visuals, not a brown-dominant reinterpretation.

## Design rule

Brown is **not** the main screen color.
- Light mode is primarily cream / white / warm beige.
- Brown is used for text, borders, buttons, and small accents.
- Dark mode is true charcoal / graphite / white — not brown.
- Calm mode is cream + soft blue-gray + periwinkle/lavender.

## Light Mode

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FAF0E6` | Main application background |
| `surface` | `#FCF9F5` | White/cream panels and sheets |
| `surface-card` | `#E2CBB8` | Main warm beige cards |
| `surface-card-muted` | `#C6AF9E` | Stronger beige / selected areas |
| `border` | `#AF9681` | Warm taupe outlines |
| `text-primary` | `#463930` | Main text |
| `text-secondary` | `#7B695C` | Secondary text |
| `primary-action` | `#623B21` | Main button / strong brown action |
| `primary-action-hover` | `#53311B` | Button hover / press |
| `primary-action-text` | `#FFFFFF` | Text on brown buttons |
| `danger` | `#F45B65` | Emergency/SOS |
| `danger-soft` | `#FAD7D9` | Emergency soft background |
| `sparkle-gold` | `#F4B84A` | Logo sparkle / tiny decorative accent |

## Dark Mode — Match Figma

| Token | Hex | Usage |
|---|---|---|
| `dark-background` | `#1E1E1E` | Main app background |
| `dark-surface` | `#464646` | Cards / controls |
| `dark-surface-strong` | `#595958` | Raised or active surfaces |
| `dark-border` | `#9A9797` | Outlines |
| `dark-text-primary` | `#FAF8F5` | Main text |
| `dark-text-secondary` | `#D6D3D0` | Secondary text |
| `dark-black` | `#0B0B0B` | Deep contrast areas |
| `dark-danger` | `#F45B65` | Emergency/SOS |

Important: dark mode must NOT use brown surfaces.

## Calm / Custom Mode — Match Figma

| Token | Hex | Usage |
|---|---|---|
| `calm-background` | `#FAF0E6` | Main cream background |
| `calm-surface` | `#DDE8EB` | Soft blue-gray card fill |
| `calm-border-soft` | `#CCCDE1` | Pale lavender outline |
| `calm-accent` | `#9F9EE5` | Periwinkle/lavender active outline |
| `calm-text` | `#52506F` | Deep muted purple-gray text |
| `calm-danger` | `#FAAFB1` | Softer emergency accent while remaining visible |

## Splash / Entry Visual

The splash and welcome experience should use a soft blurred warm gradient:
- `#A6866E`
- `#B89D88`
- `#DBCABB`
- `#EADBCD`
- `#FEF3E9`

Use large blurred radial gradients rather than flat brown backgrounds.

## Rules

1. Do not use brown as the page background.
2. Do not use brown-tinted dark mode.
3. Preserve the official SANAD glasses + Arabic سند + SANAD logo.
4. Use beige cards and cream surfaces in light mode.
5. Use true charcoal/gray cards in dark mode.
6. Use periwinkle and blue-gray only in calm/custom mode.
7. SOS remains red/pink in every theme.
8. Gold is a tiny decorative accent, not a main UI color.
