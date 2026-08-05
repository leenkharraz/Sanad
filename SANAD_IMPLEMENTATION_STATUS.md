# SANAD Implementation Status

Scope executed this run: **Phase 1 visual correction** (the original Phase 1 build used an
invented brand identity and an incorrect brown-dominant palette) followed by **Phase 2**
(Text-to-Speech, Quick Phrases, Live Captions, Emergency SOS), per `SANAD_IMPLEMENTATION_PLAN.md`.

## Phase 1 Visual Correction

The prior Phase 1 pass was functionally correct but visually wrong: it used a drawn SVG "glasses"
square as a fake logo, and a brown-dominant palette (including a near-black brown dark mode) that
did not match the SANAD Figma. This run replaces both, using the Figma/PDF brief, the exact logo
asset, and the v2 palette as the source of truth.

- **Real logo restored.** `public/assets/sanad-logo.png` (the actual SANAD glasses + Arabic سند +
  SANAD wordmark) is now the only brand mark in the app, rendered by
  `src/components/design-system/brand-logo.tsx`. The old invented `AppLogo` SVG and the fake
  `public/icons/icon.svg` brand square are deleted. Used on: splash, welcome, auth header,
  desktop sidebar, and PWA manifest/metadata icons.
  - The supplied PNG had a solid black background baked in (not transparent — verified via PNG
    color-type inspection, not a guess). With your explicit approval, I ran a one-time background
    key-out (flood/threshold on near-black pixels with an anti-aliased edge ramp, no interior
    artwork touched) and replaced `public/assets/sanad-logo.png` with the transparent result. The
    original is preserved for comparison — see Files Changed. No new mark was drawn; only the
    background of your exact file was removed.
  - Next.js's built-in image optimizer was independently found to drop the alpha channel when
    re-encoding this PNG to WebP (confirmed by comparing a raw `sharp` pipeline, which preserved
    alpha, against the Next.js `/_next/image` route, which didn't). `BrandLogo` uses `unoptimized`
    on `next/image` for this asset to route around that bug rather than fight it.
- **Palette rebuilt from `design/SANAD_Color_Palette_v2.md`.** `src/styles/tokens.css` keeps the
  same semantic token names components already used (`background`, `surface`, `surface-soft`,
  `border`, `text-primary`, `primary`, `danger`, `gold`, `brand-700/800`, etc.) but every hex value
  now comes from the v2 palette, so no component needed per-file rewrites. Light mode is cream/
  beige/white (`#FAF0E6` background, `#FCF9F5` surface); brown (`#623B21` / `#53311B`) is confined
  to text, icons, borders, and buttons, never large surfaces.
- **Dark mode is true charcoal**, not brown: `#1E1E1E` background, `#464646`/`#595958` cards,
  `#FAF8F5` text — matches the v2 spec exactly. The old dark mode (`#17110e` background, sepia
  brand scale) is gone. Icon/link accents (`brand-700/800`) also shift to neutral grays in dark
  mode rather than staying brown, so no surface anywhere reads as brown-tinted.
- **Calm mode** uses the cream background with the periwinkle/blue-gray accent system
  (`#DDE8EB` cards, `#9F9EE5` accent, `#52506F` text) from `src/styles/sanad-colors-v2.css` — one
  accent hue, not a rainbow of pastels.
- **Splash screen rebuilt**: layered blurred radial gradients (the five splash tones from the v2
  palette) with a bright center and the real logo, replacing the old flat linear-gradient +
  drawn-icon splash. Respects `prefers-reduced-motion`.
- **Auth screens rebuilt**: warm blurred top section + a near-white sheet with large rounded top
  corners overlapping it, matching the Figma structure, instead of a flat centered card. Added the
  Face ID prototype action (honestly disabled, matching the existing Google/Apple/Nafath pattern).
- **Home dashboard rebuilt** around the actual SANAD dashboard structure instead of three generic
  Hear/See/Speak cards: profile header with Aura shortcut and notifications, date/time card,
  Start Captioning / Text To Speech primary actions, noise filtering control, four quick-phrase
  shortcuts, a prominent Emergency SOS section, then the existing glasses-status card and honest
  empty-state recent activity below. Hear/See/Speak remain reachable from the Assist tab.
- **Bottom navigation** trimmed to four destinations (Home, Assist, Settings, Profile — Aura moved
  into the Home header shortcut and Assist) and restyled as a compact rounded floating pill instead
  of a full-width Material-style bar.
- **PWA branding**: manifest and metadata icons now point at the real logo asset; `theme-color`
  now follows the active theme (cream in light/calm, `#1E1E1E` in dark) via a small effect in
  `PreferencesProvider`, instead of being hardcoded to brown.

## Phase 2 — Real Browser Features

- **Text-to-Speech** (`/app/speech`, `src/features/speech/`): real `SpeechSynthesis` via
  `src/hooks/use-speech-synthesis.ts`. English/Arabic language toggle, large text input, voice
  list filtered by language, speed and pitch sliders, Speak/Stop/Clear. Handles voice loading, zero
  voices for a language (falls back to the browser's default voice, clearly labeled), unsupported
  browsers, empty input, and synthesis errors.
- **Quick Phrases**: `QuickPhrasesProvider` (`src/components/providers/quick-phrases-provider.tsx`)
  persists phrases to `localStorage`. Full CRUD (add/edit/delete/favorite) lives in the Speech
  screen; Home shows the four favorited (or first four) phrases as tap-to-speak shortcuts. Default
  phrases: "Thank you", "I need help", "Where is the restroom?", "I am lost".
- **Live Transcription** (`/app/hearing`, `src/features/hearing/`): real
  `SpeechRecognition`/`webkitSpeechRecognition` via `src/hooks/use-speech-recognition.ts`, with a
  live waveform indicator, interim + final transcript, Start/Stop/Clear. Handles permission denial,
  no-speech, and recognition errors. If the API doesn't exist at all, shows an explicit "Demo mode"
  banner and a scripted, clearly-labeled demo transcript — it never pretends to listen when it
  isn't.
- **Emergency SOS** (`/app/emergency`, `src/features/emergency/`): editable emergency message
  (persisted), trusted contacts with add/edit/delete and a working `tel:` call link, a
  share-location toggle backed by real `navigator.geolocation`
  (`src/hooks/use-geolocation.ts`, handling denied/unsupported/error), and a confirm-before-send
  dialog. Sending is explicitly simulated — clearly labeled before, during, and after — since there
  is no backend to deliver anything. Demo contacts (Layla Ahmad, Omar Al-Faisal) are fictional, not
  sourced from the brief's PDF.
- **Noise filtering** (Home): a real, persisted enable toggle and 0–100 level control
  (`src/features/home/noise-filter-card.tsx`), explicitly labeled as saving a preference only —
  real-time audio processing is called out as a future SANAD Glasses hardware integration.

## Real Browser-Supported Features

- `SpeechSynthesis`, `SpeechRecognition`/`webkitSpeechRecognition`, and `navigator.geolocation` —
  implemented and working where the browser supports them, each with honest unsupported/denied/
  error states.
- `localStorage` for preferences, session, quick phrases, and emergency contacts.
- `prefers-reduced-motion` — respected globally and on the rebuilt splash animation.

## Mocked / Simulated Features

- Authentication (unchanged from Phase 1): simulated latency, no real backend.
- Google / Apple / Nafath / Face ID sign-in: disabled buttons, explicitly labeled as prototype
  placeholders.
- Emergency alert sending: explicitly simulated (see above) — no SMS/notification is ever sent.
  Calling a contact via the `tel:` link does invoke the device's real phone app.

## Missing Backend / AI / Hardware Integrations

Unchanged from Phase 1: no backend exists; Aura, translation, object detection/OCR, and Bluetooth
glasses pairing remain labeled stubs for later phases.

## Verification Performed This Run

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean (0 errors, 0 warnings).
- `npm run build` — succeeds; all 17 routes prerender as static content.
- Manual Playwright-driven screenshot review at 390px width covering: splash, welcome, sign-in,
  home (light/dark/calm), settings, profile, assist, speech, live transcription, and emergency SOS.
  Verified per-screen against the brief's checklist (real logo visible, light mode reads
  cream/beige not brown, dark mode reads charcoal not brown, calm mode reads periwinkle/blue-gray,
  Figma-recognizable structure on home/auth/splash).
- Confirmed the bottom nav's fixed positioning does not overlap page content in real scrolled
  viewport use (a `fullPage` screenshot mode artifact was investigated and ruled out as a real bug).

## Known Limitations

- The PWA manifest icon uses the real logo PNG directly (`461×308`, not square) since no square
  icon crop was supplied and no image-editing direction was given beyond "derive from the real
  asset" — browsers will center/crop it on install. A dedicated square icon export from Figma would
  be a clean follow-up.
- No Arabic UI copy yet (Phase 4 scope, per the original plan) — the language and RTL plumbing
  (`<html lang>`/`dir`) works, and the Text-to-Speech screen exercises Arabic voice playback, but
  interface strings are still English-only.
- This session temporarily installed `playwright` and `sharp` with `npm install --no-save` for
  screenshot QA and the one-time logo background removal. Neither was added to `package.json` or
  `package-lock.json` (verified via `git diff`), but they remain in your local `node_modules` until
  your next clean `npm install`.

---

# Phase 3 — UI/UX Refinement, Responsive Redesign, Font-Size Fix

Scope executed this run: a visual/UX refinement pass across the existing Phase 1/2 app — new
Light/Dark/Calm palettes, the font-size accessibility bug, responsive mobile+desktop polish, the
Home dashboard hierarchy, Settings reorganization, and authentication visual polish — with **no
Phase 2 functionality removed or rebuilt**. Every screen kept its existing components, routes, and
browser-API logic; only presentation, tokens, and a small amount of information architecture
changed.

## 1. Summary

This was a redesign pass on top of the existing Next.js/Tailwind v4/shadcn architecture, not a
rebuild. The token system (`src/styles/tokens.css`) was rewritten to match the three supplied
palettes; a real font-size bug was found and fixed at the architecture level; the Home dashboard,
Settings, and auth screens were reorganized for hierarchy and desktop responsiveness; and every
new pastel/warm accent was wired as a semantic CSS variable rather than hardcoded per component.

## 2. Light Mode changes

Rebuilt around an ivory/beige base per the supplied Mocha palette, replacing the old cream/beige
Figma-v2 tokens:
- `--background: #FAF7F0` (Soft Ivory), `--background-soft: #F2E7D5` (Vanilla Cream) — large
  surfaces are ivory/beige, never brown.
- `--surface: #FFFFFF` for raised cards (Start Captioning/TTS/Quick Phrase tiles, etc.) so cards
  read as elevated against the warm page background instead of everything being one flat tone.
- Brown is confined to `--text-primary` (`#3B2A20` Dark Chocolate), `--text-secondary` (`#7B5E4A`
  Walnut Brown), icons, the primary button (`#7B5E4A` → `#3B2A20` on hover), and selected states
  (`--surface-selected: #EFE1CC`) — never a large fill.
- Borders are low-opacity brown (`rgba(59,42,32,0.12)`), not solid brown outlines, so cards are
  defined by spacing/shadow/radius hierarchy rather than thick borders (per the brief).

## 3. Calm Mode changes

Calm mode now shares the **same ivory/beige base** as Light mode (previously it used a totally
different cream+periwinkle system) with four new controlled pastel accent tokens applied to
specific features only, per the reference palette:
- `--accent-hearing: #D1E7FE` (Soft Blue) → Live Captioning icon chip (Home primary action,
  Assist row, Hearing screen mic circle).
- `--accent-speech: #F3D9FF` (Soft Lavender) → Text to Speech icon chip (Home, Assist).
- `--accent-noise: #BAF1E3` (Soft Mint) → Noise filtering icon chip.
- `--accent-secondary: #C4D0FB` (Periwinkle) → supporting panels (date/time clock chip, glasses
  status chip, selected accessibility-need card, active nav item).
- In Light and Dark mode these four tokens are aliases of the existing neutral `surface-soft`, so
  no component has theme-specific branching — the pastel only appears when `.calm` is active.
- Functional colors (danger/warning/success/info) are **identical to Light mode** in Calm — an
  Emergency alert or form error must read the same regardless of theme.
- Result: one accent hue per section, never more than one pastel per screen at once — verified via
  screenshot, not a rainbow dashboard.

## 4. Dark Mode changes

Rebuilt as a true charcoal scale (previously `#1E1E1E`/`#464646`, functionally similar but not
verified against contrast, and using an inverted-to-white "brand" scale that made warm accents
disappear):
- `--background: #1B1B1B` → `--background-soft: #222222` → `--surface: #292929` →
  `--surface-soft: #303030` → `--surface-strong: #373737` — a clear elevation ladder, no brown.
- Warm SANAD accents (`#D1B89A`, `#A67C52`, `#E3C9A5`) are reserved for the primary button, active
  nav item (`--surface-selected: #3A2E22`), icon tint, and focus rings — confirmed via screenshot
  that no large surface reads as brown.
- Borders are `rgba(255,255,255,0.08–0.14)`.
- Text-on-accent flips appropriately: `--text-inverse: #241C15` (dark) so text sitting on a warm
  beige CTA/selected surface stays legible, instead of white-on-beige.
- Audited every component for hardcoded hex that would break in Dark mode (see §18); none remained
  outside token files after this pass.

## 5. Blurry/glass visual treatment changes

Extracted the previously duplicated, hardcoded-hex blur blobs (splash/welcome/auth each had their
own inline `bg-[#A6866E]/50` etc., which only ever matched Light mode) into a new
`AmbientGlow` component (`src/components/design-system/ambient-glow.tsx`) driven by theme-aware
`--splash-1..5` tokens. Dark mode now gets its own subtle warm-glow tones instead of showing the
light-mode blobs unchanged. Added a `soft` variant of the glow to the Home header and reused the
`hero` variant on Welcome/Splash/Auth. Text is never blurred; blur stays confined to decorative,
`aria-hidden`, `pointer-events-none` layers behind content.

## 6. Mobile responsive redesign

- Home dashboard hierarchy: primary actions (Start Captioning / Text To Speech) enlarged with
  subtitles and a stronger shadow/press state; Noise Filtering and Quick Phrases visually paired;
  Glasses status and Recent Activity paired; Emergency SOS kept full-width and separate (safety
  should not be visually deprioritized into a 2-up grid).
- Verified at 390px with real scrolled viewport screenshots (not just `fullPage` capture, which has
  a known fixed-position-duplication artifact) — no overlap, clipping, or horizontal scroll.
- Bottom navigation unchanged structurally (Home/Assist/Settings/Profile), restyled active-state
  contrast (see §22).

## 7. Desktop responsive redesign

- `AppShell`'s content column widened from `max-w-2xl` (672px) to `max-w-3xl` (768px) for better
  use of space without stretching every card edge-to-edge.
- Home page adds a `lg:grid-cols-2` pairing for Noise Filtering/Quick Phrases and Glasses
  status/Recent activity — selective two-column use, not a blanket reflow.
- Desktop sidebar + centered content reads as an application shell, not a marketing page or a
  phone screen stretched to 1280px (verified via screenshot).

## 8. Home dashboard redesign

Kept every Phase 2 section (header, date/time, primary actions, noise filter, quick phrases,
emergency, glasses status, recent activity — no feature removed, no fake data added). Changes were
presentation-only: stronger visual weight on the two primary actions, ambient glow behind the
header, calm-mode accent chips per §3, and the desktop two-column pairing in §7.

## 9. Header/account placement changes

The Home header already placed the avatar/greeting on the left and Aura + notifications on the
right (Phase 2) — this satisfies the brief's "account access at the top" requirement, so it was
preserved and polished (ambient glow, ring on the avatar) rather than rebuilt. The bottom Profile
tab was kept, so profile is reachable from both the top (Home) and the bottom nav everywhere else.
Task-focused sub-screens (Hearing/Speech/Emergency/Settings) intentionally keep the back-arrow
`ScreenHeader` instead of an avatar — consistent with the reference app's pattern of a rich header
only on hub/dashboard screens.

## 10. Authentication redesign

Kept the existing structure (blurred hero + rounded white sheet) and the real logo. Changes:
real Google/Apple SVG marks and a Fingerprint icon for Nafath (see §11) replacing the old 3-column
lettered-square grid with a clearer full-width "Continue with X" stack; `AmbientGlow` swap (§5);
form labels/inputs/errors were already accessible (visible labels, `role="alert"` errors, no
placeholder-only inputs, 44px inputs) and were left as-is.

## 11. Google/Apple/Nafath provider button status

Real inline SVG marks now used: an accurate multi-color Google "G" and an Apple glyph
(`src/components/design-system/provider-icons.tsx`), plus lucide's `Fingerprint` icon for Nafath
(a generic verified-identity icon, not a reproduction of Nafath's trademarked mark, since no
official asset was supplied — this was a deliberate choice to avoid misrepresenting a real
government service's branding). All three buttons remain `disabled`/`aria-disabled` with an
explicit "Prototype integrations — not connected yet" caption. **No real OAuth or Nafath
integration was implemented**, per the brief.

## 12. SANAD logo status

**Unchanged.** `public/assets/sanad-logo.png` and `BrandLogo` were not touched — no redraw, no
recolor, no regeneration, no new icon. Only its rendered `className` sizing (already
variant-driven) is reused as before. Confirmed via `git diff` that the asset file has zero changes
this run.

## 13. Font-size bug root cause

`PreferencesProvider` set `document.documentElement.dataset.fontSize = preferences.fontSize` on
every change, but **no CSS anywhere read `[data-font-size]`** — the attribute was written and
never consumed. The Settings/Onboarding sliders updated state and persisted it correctly; the
selection simply had zero effect on any rendered text. This existed since Phase 1.

## 14. Font-size fix

Added a `--font-scale` CSS custom property to `tokens.css`, set by attribute selectors:
`[data-font-size="large"] { --font-scale: 1.125 }`, `[data-font-size="extra-large"] { --font-scale: 1.25 }`.
A single unlayered rule, `html { font-size: calc(16px * var(--font-scale)); }`, scales the root
`rem` unit. Because the entire app already uses Tailwind's `rem`-based type scale (`text-sm`,
`text-base`, `text-lg`, etc.), every component picked up correct, proportional scaling with **zero
per-component changes** — no `transform: scale()`, no JS-driven font sizing. Headings scale
proportionally rather than exploding, since they use the same `rem` mechanism at a fixed ratio to
body text.

## 15. Large-text testing

Verified via Playwright screenshots at real (non-`fullPage`) scroll positions on `/app/home` with
"Extra large" selected: text visibly grows, quick-phrase buttons and cards grow to fit (no fixed
heights were present to begin with), no clipping/overflow/horizontal scroll, bottom nav stays
usable, and the setting persists across a full page reload (confirmed by re-reading
`localStorage`-backed preferences after `page.reload()`).

## 16. Arabic status

**Not implemented, as instructed.** The `ar`/RTL plumbing (`<html lang>`/`dir`, the i18n hook
architecture) is untouched. Both places a user could switch the UI language — Settings and the
Personalization onboarding step — now render the Arabic option **disabled** with a "Arabic —
coming in Phase 4" caption, using a new `disabled` prop added to `SegmentedControl`. This makes the
already-broken (untranslated, unverified-RTL) experience unreachable from the UI while leaving the
underlying plumbing intact for Phase 4. The Text-to-Speech screen's language toggle (English/
Arabic voice playback) was **left enabled**, since that's a real, working, unrelated feature.

## 17. Settings redesign

- Reorganized into named groups per the brief: accessibility needs, App language, **App text &
  display** (new, links to a dedicated sub-page), **Device & safety** (Smart Glasses + Emergency —
  see below), and More settings (Phase 4 stubs, each now with an icon).
- Fixed a real information-architecture bug: Settings previously listed **"Emergency" as a "Phase
  4" stub**, even though Emergency SOS (contacts, geolocation, simulated send) has been fully built
  since Phase 2. It's now a real navigable row to `/app/emergency`. Smart Glasses got the same
  treatment, linking to the existing `/app/glasses` stub (which already honestly shows "not
  connected").
- New `/app/settings/display` page ("App Text & Display") groups Font size and Appearance
  together, with the font-size options shown as selectable rows previewing their own size, and the
  new `ThemeModeSelector`.

## 18. Components created/changed

**Created:**
- `AmbientGlow` (`components/design-system/ambient-glow.tsx`) — theme-aware blur/glow, replaces
  three copies of hardcoded blob markup.
- `ThemeModeSelector` (`features/settings/theme-mode-selector.tsx`) — 3-swatch Light/Calm/Dark
  preview selector, used in Settings → Display and the Personalization onboarding step.
- Google/Apple icon SVGs (`components/design-system/provider-icons.tsx`).
- `/app/settings/display` page.

**Changed (presentation/tokens only, no logic removed):** `SegmentedControl` (added per-option
`disabled`), `PhaseStub`, `ProviderButtons`, `nav-item` (BottomNavItem/SidebarNavItem active-state
color), Home header/primary-actions/date-time/noise-filter/glasses-status, Assist page, Settings
page, Profile page avatar ring, Splash/Welcome/AuthScreenLayout (swapped hardcoded blobs for
`AmbientGlow`), accessibility-need-card selected state, Emergency screen (hardcoded hover hex →
token), preferences-provider (theme-color meta + font-scale), root layout (viewport zoom fix, see
§20).

## 19. Design-token changes

Full rewrite of `src/styles/tokens.css` per §2–4 above, plus:
- New tokens registered in `globals.css`'s `@theme inline`: `--color-background-soft`,
  `--color-surface-selected`, `--color-accent-hearing/-speech/-noise/-secondary`.
- New `--surface-selected` token, used for active nav items and selected accessibility-need cards.
- `--font-scale` + `[data-font-size]` scale rules (§14).
- Contrast-driven color corrections (§21): `--danger`, `--danger-hover`, `--danger-soft`,
  `--warning`, and `--text-muted` were all re-picked to clear WCAG AA 4.5:1 against every
  background they're actually used on — the originally-chosen values (carried over from the old
  palette) failed contrast checks once verified with real math (see §21).
- `src/styles/sanad-colors-v2.css` (an unused reference-only file, not imported anywhere) was
  updated to match for documentation accuracy.

## 20. Files changed

29 files modified, 4 new files (see `git diff --stat` for exact line counts):
tokens.css, sanad-colors-v2.css, globals.css, layout.tsx (viewport `maximumScale` 1→5, fixing a
pinch-zoom-blocking accessibility anti-pattern), preferences-provider.tsx, app-shell.tsx,
segmented-control.tsx, phase-stub.tsx, nav-item.tsx, ambient-glow.tsx (new), provider-icons.tsx
(new), theme-mode-selector.tsx (new), settings/display/page.tsx (new), plus the Home/Assist/
Settings/Profile/Auth/Onboarding/Emergency/Hearing files listed in §18.

## 21. Responsive QA performed

Real dev server + Playwright (already present in `node_modules` from a prior session's temporary
install; not added to `package.json`) driving actual Chromium, not just static analysis:
- 42 full-page screenshots across mobile (390px) and desktop (1280px): splash, welcome, sign-in,
  sign-up, onboarding (both steps), Home in Light/Calm/Dark, Assist, Settings, Settings → Display
  in each theme, Emergency, Hearing, Speech, Profile.
- Additional non-`fullPage` viewport screenshots at multiple scroll offsets specifically to verify
  large-font Home doesn't overlap/clip (the `fullPage` mode has a known fixed-position-duplication
  rendering artifact, noted in the Phase 2 report — confirmed again this run and ruled out via the
  scroll-position screenshots).
- Verified theme persistence across a hard reload and confirmed `console --errors` was empty on
  every navigation across both viewport sizes.

## 22. Accessibility QA performed

- **Contrast audit**: computed WCAG relative-luminance contrast ratios for every text/background
  pairing across all three themes (script-verified, not eyeballed). Found and fixed three real
  failures: `--danger` text on `--danger-soft` (2.80:1 → 4.99:1 after darkening danger and
  lightening danger-soft), `--warning` text on `--warning-soft` (3.08:1 → 5.15:1), and
  `--text-muted` on `--background` (3.16:1 → 4.63:1). Also found and fixed two component-level
  contrast failures introduced by the new Calm pastels: the date/time clock readout and the active
  bottom-nav/sidebar label were using `text-brand-700` on top of the periwinkle accent (3.89:1,
  fails for real text though it would have passed the looser 3:1 icon threshold) — switched both
  to `text-text-primary` (8.9–12.4:1 across all three themes).
- Fixed a genuine accessibility bug in `layout.tsx`: `maximumScale: 1` in the viewport meta blocked
  pinch-to-zoom entirely, which fights against a font-size accessibility feature existing at all.
  Changed to `maximumScale: 5`.
- Confirmed touch targets stay ≥44px (`size-11`/`h-11` conventions already in place, unchanged).
- Confirmed all form inputs still have visible `<Label htmlFor>`, `role="alert"` error text, and no
  placeholder-only fields (this was already correct in Phase 1/2 auth forms; left untouched).
- Confirmed `prefers-reduced-motion` handling in `tokens.css` is unchanged and still applies.

## 23. Commands run

`npx tsc --noEmit`, `npm run lint`, `npm run build` — run twice (once after the initial redesign
pass, once after the contrast-driven token fixes) to make sure the fixes didn't regress anything.

## 24. TypeScript result

Clean — no errors on either run.

## 25. Lint result

Clean — 0 errors, 0 warnings on either run.

## 26. Build result

Succeeds both times; all 20 routes (17 from Phase 2 + the new `/app/settings/display`) prerender
as static content.

## 27. Phase 2 regression testing

All exercised live via the Playwright walkthrough (demo sign-in → onboarding → Home → each
feature screen) and/or manually reasoned about since no logic files were touched:

- **Text-to-Speech** — works (screen structure/inputs untouched; only visual polish deferred, no
  changes made to `use-speech-synthesis.ts` or the screen's logic this run).
- **Quick Phrases** — works; visible and speakable from Home (screenshot-confirmed) and full CRUD
  page untouched.
- **Live Transcription** — works; idle/listening/unsupported states unchanged, only the idle mic
  chip's background color now uses `accent-hearing` (cosmetic).
- **Emergency SOS** — works; message editing, contacts, geolocation request, and the
  confirm-before-send dialog all screenshot-verified; only the alert banner's color token and a
  hardcoded hover hex were changed (both cosmetic/contrast fixes).
- **Geolocation** — untouched (`use-geolocation.ts` not modified).
- **Noise Filtering** — works; toggle and level stepper screenshot-verified, only the icon chip
  background token changed.
- **Theme persistence** — works and was specifically re-verified after the font-size fix: theme and
  font-size both survive a full page reload (`localStorage`-backed, confirmed via Playwright).

## 28. Remaining limitations

- Visual QA covered the flows listed in §21 but not every possible state (e.g., populated Recent
  Activity, multiple emergency contacts, RTL rendering) since Arabic is now unreachable from the UI
  by design.
- The Nafath icon is a generic Fingerprint glyph, not Nafath's actual trademark — no official asset
  was available to reproduce accurately (see §11).
- `playwright` remains a temporary, unsaved dev dependency in local `node_modules` (not added to
  `package.json`/lockfile) — same caveat as the Phase 2 report.
- The desktop two-column Home layout was added for Noise Filtering/Quick Phrases and Glasses/Recent
  Activity only; other screens (Settings, Emergency, feature screens) remain single-column at all
  widths, which is a deliberate scope choice, not an oversight — see §7.

## 29. Features intentionally postponed

Per the brief: full Arabic UI/RTL visual QA, real OAuth/Nafath integration, Bluetooth glasses
pairing, Aura production AI, object detection/OCR/vision assistance, translation engine, and a real
emergency-delivery backend. All remain honestly labeled stubs or disabled prototype controls.

## 30. Recommended Phase 4 work

- Full Arabic translation + RTL visual audit (the plumbing is ready; re-enable the disabled option
  once verified) — includes an audit for physical (`ml-`/`mr-`/`left-`/`right-`) Tailwind utilities
  that would need swapping to logical properties for correct RTL mirroring.
- A dedicated square PWA icon export (still using the non-square logo PNG directly, per the Phase 1
  note).
- Vision Assistance (camera/OCR/object detection), Aura's real conversational backend, and Smart
  Glasses Bluetooth pairing, per the original phased plan.
- Consider auditing the remaining "Phase 4" Settings stubs (Caption Display, Emotion & Urgency,
  Voice Settings, Translation, Privacy, About SANAD) for which ones have real Phase 2/3 features
  hiding behind them, the way Emergency did this run.
