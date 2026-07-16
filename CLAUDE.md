# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) then produce a production build in `dist/`
- `npm run typecheck` — type-check only, no emit
- `npm run preview` — serve the built `dist/` locally

There is **no test runner and no ESLint** configured. Type-checking (`npm run typecheck`) is the only automated gate.

## What this is

A single-page recruitment landing page for AIESEC in Tunisia (Vite + React 18 + TypeScript). One route: a hero with brand copy alongside an application form. Submissions are POSTed to a Google Apps Script Web App that appends a row to a Google Sheet. Deployed on Vercel.

## Architecture

**Rendering tree** (`src/App.tsx`): `IntroSplash` → `NavBar` → `Hero` → `Footer`. `Hero` is the substance — it composes `Logo`, `Countdown`, the `STATS` block, and `RecruitmentForm` (the form column sits beside the copy so it's above the fold).

**Form stack**: `react-hook-form` + `zod` via `@hookform/resolvers/zod`. Validation lives entirely in `src/lib/schema.ts` (`applicationSchema` / `ApplicationValues`). Fields render through the reusable `TextField` / `SelectField` in `src/components/Field.tsx`, which wire up accessible labels, `aria-invalid`, and error messaging.

**Submission** (`src/lib/submit.ts`): POSTs JSON to `VITE_APPS_SCRIPT_URL`. It deliberately sends `Content-Type: text/plain` so the request stays a CORS "simple request" and the browser skips the preflight `OPTIONS` call that Apps Script Web Apps don't answer. **Do not change this to `application/json`** — it will break submissions in production. The function returns a `SubmitResult` discriminated union rather than throwing.

### Single sources of truth (edit these, not their consumers)

- **Local Committees** — `src/data/localCommittees.ts` (`LOCAL_COMMITTEES`). Feeds both the `<select>` options and the zod `.refine()` that validates the chosen LC. Add/remove/rename a committee here only.
- **Application deadline** — `DEADLINE` in `src/components/Countdown.tsx`. Consumed in three places: the live countdown, the countdown's "closed" text, and `RecruitmentForm`'s `isClosed` gate (which swaps the form for an "Applications are closed" panel). `RecruitmentForm` imports `DEADLINE` from `Countdown`. Note the human-readable date string "20 July 2026" is hard-coded in copy in several components — update those too.

### Styling

Tailwind CSS **v4** via the `@tailwindcss/vite` plugin — there is **no `tailwind.config.js`**. The brand design system (AIESEC "Blue Book") is defined as `@theme` tokens in `src/index.css`, which generates the custom utilities used throughout: colors `aiesec`/`aiesec-600`/`aiesec-700`, `sunset`, `jade`, `golden`, `ink`, `slateink`, `mist`, `hairline`; shadows `shadow-soft`/`shadow-lift`; and the `Lato` sans font. To add a design token, add a CSS variable in the `@theme` block rather than a config file. Custom utility classes (`.wordmark`, `.eyebrow`, `.duotone`) and the reduced-motion overrides also live in `src/index.css`.

Animations use `framer-motion` and consistently gate on `useReducedMotion()` — preserve that pattern when adding motion. Fonts are self-hosted via `@fontsource/lato` imports in `src/main.tsx` (not a CDN).

### Static assets (`public/`)

The page references these by absolute path and expects them to exist: `hero-conference.jpg` (hero background), `intro-walk.webm` + `intro-walk.mp4` (the one-time `IntroSplash` video), `aiesec-logo.png` (the `Logo` component; the white variant is produced with a CSS `brightness(0) invert(1)` filter, not a separate file), and `favicon.svg`.

## Environment

`VITE_APPS_SCRIPT_URL` — the deployed Apps Script Web App URL (ends in `/exec`). Set it in `.env.local` for local dev and in Vercel's env vars (Production + Preview + Development). See `.env.example` for setup notes. When it's unset, the form still renders but `submitApplication` short-circuits with a "not configured" error instead of posting.
