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
