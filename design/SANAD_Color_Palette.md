# SANAD Color Palette

This palette is based on the current SANAD visual identity shown in the project materials: warm brown, beige, cream, soft gold, and a clear emergency red. It is polished for a modern mobile-first web application and improves contrast, hierarchy, and accessibility.

## Core Brand Colors

| Token | Hex | Usage |
|---|---:|---|
| `brand-900` | `#3A241A` | Main dark brown, headings, primary text, dark logo treatment |
| `brand-800` | `#4A2E22` | Primary buttons, active navigation, strong accents |
| `brand-700` | `#624032` | Hover states, emphasized cards, secondary controls |
| `brand-600` | `#7A5544` | Secondary buttons, icons, borders |
| `brand-500` | `#9A715E` | Muted brand accents, decorative elements |
| `brand-300` | `#C7A894` | Soft borders, input outlines, inactive controls |
| `brand-200` | `#DDC8B8` | Card fills, segmented controls, soft surfaces |
| `brand-100` | `#EEE1D5` | Light background blocks, onboarding cards |
| `brand-50` | `#F7F0EA` | Very light warm surface |

## Neutral and Surface Colors

| Token | Hex | Usage |
|---|---:|---|
| `background` | `#FCF9F6` | Main app background |
| `surface` | `#FFFDFC` | Cards, sheets, dialogs |
| `surface-soft` | `#F5ECE4` | Secondary sections, grouped settings |
| `surface-strong` | `#E9D8CA` | Selected cards and highlighted controls |
| `border` | `#D8C3B3` | Default borders and dividers |
| `border-strong` | `#B99179` | Focused controls and stronger separators |
| `text-primary` | `#2B1A14` | Main readable text |
| `text-secondary` | `#6F574B` | Supporting text |
| `text-muted` | `#927B70` | Placeholders and low-priority labels |
| `text-inverse` | `#FFFDFC` | Text on dark brown surfaces |

## Accent Colors

| Token | Hex | Usage |
|---|---:|---|
| `gold` | `#F2B84B` | SANAD sparkle accent, premium highlights |
| `gold-soft` | `#FBE8B6` | Gold background tint |
| `peach` | `#D99A75` | Warm decorative accent |
| `lavender-calm` | `#A99BEF` | Optional calm or ADHD-friendly mode accent |
| `lavender-soft` | `#EEEAFE` | Calm-mode background |

## Functional Colors

| Token | Hex | Usage |
|---|---:|---|
| `success` | `#2F7D5A` | Connected, completed, safe state |
| `success-soft` | `#DFF1E8` | Success backgrounds |
| `warning` | `#B7791F` | Caution, attention |
| `warning-soft` | `#F9EBCB` | Warning backgrounds |
| `danger` | `#D64545` | Emergency SOS, destructive actions |
| `danger-hover` | `#B93434` | Emergency hover or pressed state |
| `danger-soft` | `#FBE3E3` | Emergency background |
| `info` | `#3F6E8A` | Information, translation, system notices |
| `info-soft` | `#E3EEF4` | Information background |

## Dark Mode

| Token | Hex | Usage |
|---|---:|---|
| `dark-background` | `#17110E` | Main dark background |
| `dark-surface` | `#241A16` | Dark cards and sheets |
| `dark-surface-soft` | `#30221C` | Secondary dark surfaces |
| `dark-border` | `#5B4337` | Borders in dark mode |
| `dark-text-primary` | `#FFF8F3` | Main dark-mode text |
| `dark-text-secondary` | `#D8C5B8` | Secondary dark-mode text |
| `dark-muted` | `#AA9081` | Muted dark-mode text |

## Recommended Gradient

Use sparingly for splash screens, onboarding, or hero areas.

```css
background: linear-gradient(
  145deg,
  #FCF9F6 0%,
  #F5ECE4 48%,
  #E9D8CA 100%
);
```

## Primary UI Rules

- Use `#4A2E22` for primary buttons.
- Use `#FCF9F6` as the main background.
- Use `#FFFDFC` for cards.
- Use `#2B1A14` for body text.
- Use `#D64545` only for emergency or destructive actions.
- Use `#F2B84B` as a limited accent, not a main background.
- Avoid using beige text on beige backgrounds.
- Avoid applying borders to every element.
- Keep most screens neutral and use brown only for emphasis.
- Keep button text white on the dark brown primary button.
- Keep touch targets at least 44px high.

## Suggested Semantic Mapping

```text
Primary button:       #4A2E22
Primary hover:        #3A241A
Secondary button:     #EEE1D5
Secondary text:       #6F574B
Page background:      #FCF9F6
Card background:      #FFFDFC
Selected card:        #E9D8CA
Default border:       #D8C3B3
Focus ring:           #B99179
Emergency action:     #D64545
Success state:        #2F7D5A
Accent highlight:     #F2B84B
```

## Notes for Claude Code

Use this file as the visual source of truth. Create CSS variables and Tailwind theme tokens from these values. Do not hardcode colors repeatedly inside components. Preserve good contrast and use semantic tokens such as `--primary`, `--background`, `--surface`, `--danger`, and `--text-primary`.
