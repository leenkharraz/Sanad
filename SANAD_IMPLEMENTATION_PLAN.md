# SANAD Implementation Plan

## 1. Existing Project Assessment

The repository was empty prior to this run (only a `README.md` and `.gitignore` created when the
GitHub remote was connected). There was no existing frontend, backend, package manager files, or
framework configuration to preserve or build on top of.

Source material found on disk (not previously part of the repo):

| File | Type | Usable as-is? |
|---|---|---|
| `Downloads/sanad.pdf`, `Downloads/SANAD - سند.pdf` | PDF export of Figma frames (25 screens) | Used as **reference only** — text was extracted to confirm terminology, screen content, and flows. Contains real personal data (a named user's age, height, blood type, allergies, disabilities, and real-looking phone numbers) which is intentionally **not** reproduced anywhere in this codebase, per the "no real personal data" requirement. |
| `Downloads/sanad.fig` | Native Figma binary file | **Not usable programmatically.** No Figma Dev Mode / API access is configured, and there is no exported code project (no `figma-export.zip`, no generated React/CSS from Figma). All components in this codebase are hand-written. |
| `Downloads/SANAD_Color_Palette.md` | Color specification | Used as the **visual source of truth**, copied into `design/SANAD_Color_Palette.md`. |

No `/docs/SANAD.pdf`, `/design/figma-export.zip`, `/design/sanad-colors.json`,
`/src/styles/sanad-colors.css`, or `/public/assets` existed before this run — these paths are
created fresh as part of this plan (the color files; the PDF is referenced from `Downloads/` rather
than duplicated into the repo, since it is 20MB+ of design reference material, not a build input).

**Conclusion:** this is a greenfield build. Section 8 (Technology) options apply in full ("when
starting from scratch, use...").

## 2. Proposed Architecture

- **Framework:** Next.js 16 (App Router), TypeScript, React 19.
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` configuration — no `tailwind.config.js` needed
  in v4; tokens live in `src/styles/tokens.css`).
- **Components:** shadcn/ui primitives (copied into `src/components/ui`, not a runtime dependency)
  for accessible low-level building blocks (button, input, dialog, sheet, switch, tabs, etc.),
  wrapped by SANAD-specific design-system components so nothing hardcodes raw colors.
- **Icons:** `lucide-react`.
- **Forms/validation:** `react-hook-form` + `zod`.
- **State/persistence:** React context + custom hooks backed by `localStorage` (prototype only,
  no backend).
- **No backend.** All "backend-shaped" operations (auth, sending SOS, AI responses) are mocked and
  explicitly labeled as such in the UI.

## 3. Main Routes (Phase 1 scope in **bold**, later phases in normal text)

```
/                          → **splash → redirects to /welcome (or /app/home if session exists)**
/welcome                   → **welcome / value prop / sign in / sign up / demo**
/auth/sign-in              → **sign-in form**
/auth/sign-up              → **sign-up form**
/auth/forgot-password      → **forgot-password**
/onboarding/accessibility  → **multi-select Hearing/Vision/Speech cards**
/onboarding/personalize    → **language, font size, theme, skip-able**
/app/home                  → **authenticated dashboard (bottom nav / sidebar shell)**
/app/assist                → stub (Phase 2/3 hub linking to hearing/vision/speech)
/app/hearing               → stub (Phase 2/3)
/app/vision                → stub (Phase 3)
/app/speech                → stub (Phase 2)
/app/aura                  → stub (Phase 3)
/app/emergency             → stub (Phase 2)
/app/glasses               → stub (Phase 3)
/app/settings              → stub (Phase 4, minimal shell in Phase 1)
/app/profile               → stub (Phase 4)
```

Stub routes render inside the same authenticated app shell (bottom nav / sidebar stays visible)
with a clearly labeled "coming in a later phase" empty state, so navigation is fully wired and
demonstrable without faking functionality.

## 4. Component Structure

```
src/
  app/                     Next.js routes (thin — compose from features/components)
  components/
    design-system/         Button, Card, Input, Badge, SegmentedControl, etc. (token-driven)
    application-shell/      AppShell, MobileBottomNav, DesktopSidebar, SafeArea
    navigation/             NavItem, EmergencyQuickAction
    feedback/               EmptyState, LoadingState, ErrorState, PermissionState, PhaseStub
    forms/                  FormField wrappers around react-hook-form + zod
    accessibility/          SkipLink, VisuallyHidden, ReducedMotionProvider
  features/
    auth/                   SignInForm, SignUpForm, ForgotPasswordForm, DemoUserButton, schemas
    onboarding/             AccessibilityNeedsStep, PersonalizationStep
    home/                   GreetingHeader, ModeCard, GlassesStatusCard, RecentActivityList
  hooks/                    useLocalStorage, useMediaQuery, useReducedMotion
  lib/                      utils (cn), storage keys, constants
  types/                    user, preferences, accessibility-need
  data/                     mock data (demo user, quick phrases seed, etc.)
  styles/                   tokens.css (design tokens), globals.css
```

## 5. Design-System Strategy

- All colors defined once as CSS custom properties in `src/styles/tokens.css`, generated directly
  from `design/SANAD_Color_Palette.md` / `design/sanad-colors.json`.
- Tailwind v4 `@theme inline` maps semantic Tailwind utilities (`bg-background`, `text-primary`,
  `bg-danger`, etc.) to those CSS variables, so components use semantic classes, never raw hex.
- Light mode is the default and the primary target (per the brief: "do not allow calm mode to
  reduce contrast", "keep most screens neutral"). Dark mode and calm mode reuse the same semantic
  tokens with different variable values, switched via a `data-theme` attribute on `<html>`.
- shadcn/ui components are themed through the same CSS variables so they inherit the palette
  automatically rather than shipping their own colors.

## 6. Real Browser-Supported Features (Phase 1 has none of the sensor features; listed here for
   overall plan clarity — implemented in later phases)

- Web Speech Recognition (captions) — Phase 2/3.
- Web SpeechSynthesis (text-to-speech) — Phase 2.
- MediaDevices camera — Phase 3.
- Geolocation — Phase 2.
- localStorage preferences — **Phase 1**.

## 7. Mocked / Simulated Features

- Authentication (no backend — sign-in/sign-up simulate network latency and store a fake session
  in `localStorage`; demo-user path bypasses credentials entirely).
- Social/Nafath sign-in buttons — visibly labeled "Prototype" / "Coming soon", non-functional.
- All AI, Bluetooth, vision, and messaging features in later phases will carry explicit
  "Simulated" / "Demo" badges — none of that is built in Phase 1.

## 8. PWA Approach

- `public/manifest.json` with name "SANAD", short_name "SANAD", theme color `#4A2E22`, background
  color `#FCF9F6`, standalone display, start_url `/`.
- SVG-based app icon (`public/icons/icon.svg`, maskable-safe padding) — raster PNG icon generation
  requires image tooling not available in this environment (no ImageMagick/Sharp/Python Pillow
  installed); documented as a follow-up in the status report.
- Minimal hand-written service worker (`public/sw.js`) caching the static app shell
  (`/`, `/welcome`, manifest, icons) for offline shell display — registered client-side, not via a
  heavy library (`next-pwa` etc. intentionally avoided per "no unnecessary heavy libraries").
- Apple web-app meta tags and viewport/safe-area configuration in the root layout.

## 9. Implementation Phases (this run = Phase 1 only)

Phase 1 (this run): design tokens, app shell, responsive nav, splash, welcome, auth screens,
demo-user flow, accessibility onboarding, personalization, home dashboard, theme foundation,
local preference storage, PWA manifest skeleton.

Phase 2 (future): text-to-speech, quick phrases, live captions, permission handling, SOS,
geolocation, trusted contacts.

Phase 3 (future): vision assistance, camera preview, object-detection simulation, OCR prototype,
distance alerts, reading mode, Aura assistant, smart-glasses connection, translation,
environmental sound alerts, name-call alert.

Phase 4 (future): full settings structure, caption customization, emotion/urgency settings,
profile, dark mode polish, calm mode, Arabic/RTL, desktop shell refinement, PWA install flow,
final accessibility/code review.

## 10. Risks and Limitations

- **No PDF/Figma parsing tooling installed** (no poppler/pdftoppm, no Python). Product content was
  extracted via a Node.js PDF text-parsing script instead of visual inspection — screen layouts
  were interpreted from extracted text plus the written brief, not pixel-matched to Figma.
- **No backend exists.** Every "account", "message sent", "contact saved" concept in Phase 1 is
  local-only and lost if browser storage is cleared; this is explicitly surfaced in the UI copy,
  not hidden.
- **No PNG/ICO icon generation tool available** — PWA icons are SVG-only for now, which is valid
  per the manifest spec but has weaker OS-level support than raster icons on some older Android
  versions.
- **Arabic/RTL is architected for (language switching hook, `dir` attribute wiring, logical
  Tailwind spacing where trivial) but not fully translated in Phase 1** — only English strings
  ship now; Arabic copy and full RTL visual QA is Phase 4 work.
- **Real personal data found in the source PDF was deliberately excluded.** Any resemblance in
  mock data (names, numbers) to real people is coincidental placeholder data, not sourced from the
  PDF.
