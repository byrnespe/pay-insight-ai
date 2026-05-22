# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 8080
npm run build      # Production build
npm run build:dev  # Development build
npm run lint       # ESLint (flat config, eslint.config.js)
npm run preview    # Preview production build
```

There is no test runner configured in this project.

## Architecture

**Underpaid** is an AI salary analysis SPA. Users input their job details and compensation; an AI analyzes their market position and provides negotiation guidance. Premium features are gated behind a one-time Stripe purchase ($9) or a Pro subscription ($5/mo or $49/yr).

### Frontend

- **Vite + React 18 + TypeScript**, with the `@` alias mapping to `src/`
- **shadcn/ui** components live in `src/components/ui/` — extend, don't modify the primitives directly
- **Tailwind CSS** with `tailwind.config.ts`; dark mode via `ThemeProvider` (`next-themes`)
- **React Router v6** — all routes are in `src/App.tsx`; add new routes above the `*` catch-all
- **TanStack Query** for server state; the `QueryClient` is initialized in `App.tsx`
- **PWA** via `vite-plugin-pwa` and **Capacitor** (`capacitor.config.ts`) for native mobile builds

### Backend (Supabase Edge Functions)

Edge functions are under `supabase/functions/`, each with its own `index.ts`. They run on **Deno** and import from URLs (not npm). Shared code lives in `supabase/functions/_shared/stripe-config.ts`.

The main data pipeline for salary analysis:
1. Frontend calls `analyze-salary` (via `src/lib/salaryAnalysis.ts`)
2. `analyze-salary` first calls `fetch-salary-data`, which aggregates from: BLS/CareerOneStop (government), Perplexity (web search), crowdsourced `saved_reports`, and static benchmarks in `src/data/industryBenchmarks.ts`
3. Aggregated data is injected into a prompt sent to `https://ai.gateway.lovable.dev` using `google/gemini-3-flash-preview` via the `LOVABLE_API_KEY` env var
4. The response is a structured JSON `SalaryAnalysis` object (typed in `src/types/salary.ts`)

### Authentication & Entitlements

`AuthContext` (`src/contexts/AuthContext.tsx`) is the single source of truth for auth state and feature access. All feature gating uses the `Entitlements` interface from `src/types/entitlements.ts` — **never gate on plan names**.

Key helpers from `useAuth()`:
- `hasReport` — one-time purchase purchased
- `isPro` — active Pro subscription
- `canExportPdf` — PDF export allowed
- `canAccessFeature(featureName)` — check any named entitlement

Entitlements are fetched from the `check-entitlements` edge function, which queries Stripe directly (no local DB caching). The `check-entitlements` function uses `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` env vars.

### Supabase Client

The client is at `src/integrations/backend/client.ts`, exported as `supabase` (name preserved for backward compatibility). Config (URL + anon key) is in `src/integrations/backend/config.ts` with hardcoded fallback values so the app works without env vars.

### Database Schema

Key tables (all with RLS enabled):
- `profiles` — auto-created on signup via trigger; stores `display_name`
- `saved_reports` — user salary analysis history (JSONB `analysis_result`)
- `analytics_events` — event tracking (insert-only for all, read-only for admins)
- `user_roles` — `app_role` enum (`admin` | `user`); admin access via `has_role()` security-definer function

### Payments (Stripe)

Product/price IDs are defined in **two places that must be kept in sync**:
- `src/types/entitlements.ts` — `STRIPE_CONFIG` (frontend)
- `supabase/functions/_shared/stripe-config.ts` — `STRIPE_PRODUCTS` (edge functions)

The `stripe-webhook` edge function handles `checkout.session.completed` and `customer.subscription.*` events. `create-checkout` and `customer-portal` edge functions handle checkout session creation and subscription management.

### Analytics

`trackEvent()` from `src/hooks/useAnalytics.ts` sends typed events to the `track-event` edge function and also persists them locally in `localStorage` (capped at 100). It silently fails to avoid disrupting UX. UTM parameters are captured on page load by `useUTMTracking`.

### SEO

Each page calls the `useSEO` hook at the top of the component to set `<title>`, meta description, Open Graph tags, and canonical URL. The canonical base URL is `https://www.underpaidapp.com`. Blog posts are statically defined in `src/data/blogPosts.ts`; adding a new post also requires adding a URL entry to `public/sitemap.xml`.

### Admin

`/admin` and `/admin/users` are protected by `useAdminAuth` (`src/hooks/useAdminAuth.ts`), which checks the `user_roles` table. Admin components are in `src/components/admin/`.
