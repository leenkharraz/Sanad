# Sanad

An accessibility-focused smart-glasses companion application designed to support people with hearing, vision, and speech accessibility needs — built as a mobile-first, installable Progressive Web App.

Live Demo: https://sanad-coral.vercel.app

## Overview

Sanad is a Next.js web application designed around a future companion device ("SANAD Glasses") for people who are d/Deaf or hard of hearing, blind or low vision, or nonverbal/speech-impaired. Today, without any physical hardware, it already works as a standalone accessibility tool in the browser: it turns speech into text (live captioning), turns typed text into speech, offers one-tap quick phrases for common needs, and provides an emergency SOS flow with location sharing and trusted contacts.

It is technically interesting for two reasons beyond the accessibility use case:

- It uses real, working browser APIs (Speech Recognition, Speech Synthesis, Geolocation) rather than mocking them, while being explicit in the UI and in this document about the things that *are* mocked (authentication, emergency delivery, hardware pairing).
- It ships a from-scratch, token-driven design system with three verified accessible themes (Light, Dark, Calm) and a working font-scaling mechanism, plus a full English/Arabic UI translation layer.

The project is a portfolio/prototype build, not a production product: there is no backend server, no real device integration, and several screens are intentionally-labeled placeholders for future phases.

## Key Features

- **Live captioning** — real-time speech-to-text using the browser's Speech Recognition API, with interim/final transcript display and a waveform indicator.
- **Text-to-Speech** — converts typed text to spoken audio via the browser's Speech Synthesis API, with English/Arabic voice selection, speed, and pitch controls.
- **Quick Phrases** — user-editable, favoritable tap-to-speak phrases (e.g., "I need help", "Where is the restroom?"), persisted locally and surfaced as one-tap shortcuts on the home dashboard.
- **Emergency SOS** — editable emergency message, trusted-contact management with a real `tel:` call link, and optional location sharing via the browser Geolocation API, behind a confirm-before-send dialog.
- **Noise filtering control** — a persisted on/off toggle and intensity level, explicitly labeled as a saved preference for a future hardware integration (see Implementation Status).
- **Accessibility-first UI** — three themes (Light, Dark, Calm), three font-size levels with a real scaling mechanism, visible keyboard focus states, `prefers-reduced-motion` support, and WCAG-AA-checked color contrast across all themes.
- **Bilingual interface (English/Arabic)** — a full translation dictionary covering the entire UI, switchable from Settings or onboarding. Layout intentionally stays left-to-right in both languages; full right-to-left mirroring is not implemented (see Implementation Status).
- **Client-side prototype authentication** — sign-up/sign-in against a local account store in `localStorage`, with salted password hashing via the Web Crypto API. There is no server: this is a prototype persistence layer, not production authentication infrastructure.
- **Installable PWA** — a web manifest and a minimal service worker cache the static app shell for offline display of already-visited screens.

## How It Works

```
Splash (auto) → Welcome → Sign in / Sign up / Continue as demo user
                                │
                                ▼
                  Onboarding: accessibility needs → language / font / theme
                                │
                                ▼
                        Home dashboard (bottom nav / sidebar)
                     ┌──────────────┼──────────────┬─────────────┐
                     ▼              ▼              ▼             ▼
              Start Captioning  Text to Speech  Quick Phrases  Emergency SOS
               (Hearing tool)   (Speech tool)   (tap to speak)  (contacts,
                                                                 location,
                                                                 confirm-send)
                     │
                     ▼
        Assist hub → Hearing / Vision / Speech / Aura / Smart Glasses
        (Vision, Aura, and Smart Glasses are placeholder screens — see below)
```

Settings lets a user change language (English/Arabic), font size, appearance (Light/Dark/Calm), accessibility needs, and manage device/safety options (Smart Glasses, Emergency).

## Implementation Status

| Feature | Status |
|---|---|
| Live captioning (Speech Recognition API) | **Implemented** — real browser API, with an explicit "Demo mode" fallback and scripted transcript when the API is unavailable |
| Text-to-Speech (Speech Synthesis API) | **Implemented** — real browser API, English/Arabic voice selection |
| Quick Phrases (CRUD, favorites) | **Implemented** — persisted in `localStorage` |
| Emergency SOS — contacts, `tel:` call link | **Implemented** |
| Emergency SOS — location sharing (Geolocation API) | **Implemented** — real `navigator.geolocation`, with denied/unsupported/error states |
| Emergency SOS — alert sending | **Mocked/Simulated** — no SMS, push notification, or backend delivery exists; sending is clearly labeled as simulated in the UI |
| Sign-in / sign-up | **Prototype local authentication** — client-side account store only (salted password hashing, `localStorage` persistence); no server, no session, and no production authentication guarantees |
| Google / Apple / Nafath / Face ID sign-in | **UI only** — buttons are disabled and labeled "Prototype — not connected yet"; no OAuth or Nafath integration exists |
| Preferences (theme, font size, language, accessibility needs) | **Implemented** — persisted in `localStorage` |
| Light / Dark / Calm themes | **Implemented** — token-driven, contrast-checked |
| Font-size scaling | **Implemented** — root `rem` scaling via a CSS custom property |
| English/Arabic UI text | **Implemented** — full translation dictionary for both languages |
| Right-to-left (RTL) layout | **Not implemented** — the app deliberately renders `dir="ltr"` for both languages; there is no RTL mirroring |
| Noise filtering | **UI only** — toggle and level are saved as a preference; no real-time audio processing occurs |
| Vision assistance (camera, OCR, object detection) | **Planned** — route exists as a labeled placeholder screen only |
| Aura assistant (conversational AI) | **Planned** — route exists as a labeled placeholder screen only |
| Smart Glasses pairing | **Planned** — route exists as a labeled placeholder screen; **no Bluetooth or hardware SDK code exists in this repository** |
| PWA install / offline app shell | **Implemented** — manifest + service worker cache the static shell; sensor/network features still require an active connection |

**Note on hardware and AI claims:** this repository contains no Bluetooth API usage, no camera/`MediaDevices` usage, no third-party AI/LLM integration, and no OAuth provider integration. Every reference to "SANAD Glasses" hardware in the UI is a forward-looking label for unbuilt functionality, not a working integration.

## Technical Highlights

- **Architecture**: Next.js 16 (App Router) with TypeScript (strict mode) and React 19, structured into `app/` (routes), `components/` (design system + shells), `features/` (screen logic), `hooks/`, `lib/`, and `i18n/`.
- **Design system**: Tailwind CSS v4 with CSS-first `@theme` tokens (`src/styles/tokens.css`) — no raw hex values in components; three themes share one semantic token set.
- **Accessibility**: WCAG-AA contrast targets checked per token/theme pair, ≥44px touch targets, visible focus states, `role="alert"` form errors, labeled inputs, and `prefers-reduced-motion` support.
- **Internationalization**: a typed translation lookup (`src/i18n/use-translation.ts`) over English/Arabic dictionaries (~590 keys each); language preference persists and drives voice selection in Text-to-Speech.
- **Validation**: forms use `react-hook-form` with `zod` schemas.
- **State/persistence**: React context providers backed by `localStorage` for preferences, session, quick phrases, and emergency contacts — no backend database.
- **PWA**: hand-written service worker (no third-party PWA library) caching the static app shell; manifest with theme-aware `theme-color`.

## Tech Stack

**Framework & Language**
- Next.js 16 (App Router), React 19, TypeScript (strict)

**Styling & UI**
- Tailwind CSS v4, shadcn/ui-derived primitives (Radix UI under the hood), lucide-react icons

**Forms & Validation**
- react-hook-form, zod

**Browser APIs**
- Web Speech API (`SpeechSynthesis`, `SpeechRecognition`), Geolocation API, Web Crypto API, Service Worker API

**Tooling**
- ESLint (`eslint-config-next`), TypeScript compiler (`tsc --noEmit`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects through a splash screen to `/welcome` on first visit.

```bash
npm run build && npm run start   # production build (also enables the PWA service worker)
npm run lint                     # ESLint
npx tsc --noEmit                 # TypeScript check
```

## Project Status

This is a portfolio-stage prototype, not a production application:

- **No backend server exists.** Accounts, quick phrases, emergency contacts, and preferences all live in the browser's `localStorage` and are lost if it is cleared.
- **Authentication is a client-side prototype**, not production auth — there is no session security model beyond local storage.
- **Emergency SOS sending is simulated** — no message is actually transmitted anywhere.
- **Vision assistance, the Aura assistant, and Smart Glasses hardware pairing are unbuilt** — their routes exist as clearly labeled placeholder screens.
- **RTL layout for Arabic is not implemented**, even though full Arabic UI text is.
- Real, working parts of the app are: live captioning, text-to-speech, quick phrases, emergency contact/location UI, theming, font scaling, and bilingual UI text — all verified against the source in this repository.

## Author

Leen Kharraz
Software Engineering
