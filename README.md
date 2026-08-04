# SANAD

SANAD connects smart glasses with a mobile-first web application to assist people with hearing,
vision, and speech needs. This repository is a Next.js (App Router) + TypeScript + Tailwind CSS
application built to look, feel, and navigate like a native mobile app rather than a website, and
to be installable as a Progressive Web App.

**Current status:** Phase 1 (Foundation) only. See `SANAD_IMPLEMENTATION_STATUS.md` for the full
feature-by-feature breakdown and `SANAD_IMPLEMENTATION_PLAN.md` for the architecture and phased
roadmap.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects through a splash screen to
`/welcome` on first visit.

## Production Build

```bash
npm run build
npm run start
```

## Other Commands

```bash
npm run lint        # ESLint
npx tsc --noEmit    # TypeScript check
```

## PWA Installation

The app ships a web manifest (`public/manifest.json`) and a minimal service worker
(`public/sw.js`) that caches the static app shell for offline display. The service worker only
registers in production builds (`npm run build && npm run start`), not in `next dev`.

- **Chrome / Edge (desktop or Android):** open the app, then use the browser's "Install app" /
  "Add to Home screen" prompt (address-bar icon or menu).
- **Safari (iOS):** Share menu → "Add to Home Screen".

Installing does **not** make microphone, camera, GPS, Bluetooth, or AI features work offline —
those all require an active browser session and, in later phases, network access.

## Required Browser Permissions

Phase 1 does not request any browser permissions. Later phases will request, when their features
are used:

- Microphone (live captions, voice input)
- Camera (vision assistance, OCR)
- Location (Emergency SOS)
- Bluetooth (smart glasses pairing)

Each will be requested only on the screen that needs it, with an explicit permission-denied state
in the UI (not silently failing).

## Supported Browsers

Built against evergreen Chromium, Firefox, and Safari. Phase 1 has no browser-specific feature
dependencies. Phase 2+ features (Speech Recognition, SpeechSynthesis, MediaDevices, Geolocation)
will each render a clearly labeled "not supported in this browser" fallback where the underlying
Web API isn't available, rather than failing silently.

## Real Features (Phase 1)

- Local persistence of preferences and session via `localStorage`.
- Fully responsive layout (bottom nav on mobile, sidebar on tablet/desktop).
- `prefers-reduced-motion` support.
- Visible keyboard focus states on all interactive controls.

## Mocked Features (Phase 1)

- Authentication (no backend — simulated latency, session stored locally).
- Google / Apple / Nafath sign-in buttons (disabled, labeled "Prototype — not connected yet").
- Password reset (simulated confirmation, no email sent).
- All screens under Hear / See / Speak / Aura / Emergency / Smart Glasses are placeholder stubs for
  now — see `SANAD_IMPLEMENTATION_STATUS.md` for what's real vs. planned.

## Project Structure

```
src/
  app/                     Next.js App Router routes
  components/
    ui/                    shadcn/ui primitives (themed via design tokens)
    design-system/         SANAD-specific building blocks (logo, segmented control)
    application-shell/     App shell, bottom nav, desktop sidebar
    navigation/            Nav item renderers, SOS quick action
    feedback/              Empty/error states, phase stubs
    providers/             Preferences/session context, PWA service worker registration
  features/
    auth/                  Sign-in/up/forgot-password forms + schemas
    onboarding/             Accessibility-needs and personalization steps
    home/                   Home dashboard building blocks
    settings/               Settings editors
  hooks/                   useMediaQuery, etc.
  lib/                     utils, storage, mock auth
  types/                   Preferences, user/session types
  data/                    Static option/nav/mode data
  styles/                  Design tokens (tokens.css)
design/
  SANAD_Color_Palette.md   Visual source of truth
  sanad-colors.json        Machine-readable color tokens
public/
  manifest.json            PWA manifest
  sw.js                    Minimal app-shell service worker
  icons/icon.svg           App icon
```
