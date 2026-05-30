# CLAUDE.md — pay-insight-ai (Underpaid)

## Project overview

**Underpaid** is an AI-powered salary analysis web app that helps workers find out if they are being paid fairly. Users enter their current salary, role, location, experience, and work conditions; the app runs the data against market benchmarks and AI models to produce personalised compensation insights.

The product is built on the **Lovable** AI app builder (automated commits from `gpt-engineer-app[bot]`) and deployed as a Progressive Web App (PWA) with optional Capacitor-based native builds for iOS and Android.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 (SWC plugin) |
| UI library | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS v3 |
| Routing | React Router DOM v6 |
| Server state | TanStack React Query v5 |
| Backend | Supabase (PostgreSQL + Edge Functions + Auth) |
| Payments | Stripe (via Supabase Edge Functions) |
| AI/LLM | OpenAI (called from Edge Functions) |
| PWA | vite-plugin-pwa + Workbox |
| Mobile | Capacitor v8 (iOS + Android) |
| Package manager | npm (also has bun.lockb — prefer npm for consistency) |

---

## Repository structure

```
pay-insight-ai/
├── public/                  # Static assets, sitemap.xml, icons
├── src/
│   ├── App.tsx              # Root component, router, global providers
│   ├── main.tsx             # React DOM entry point
│   ├── index.css            # Global CSS / Tailwind base layer
│   ├── App.css              # App-level styles
│   ├── components/          # Shared UI components
│   │   ├── ui/              # shadcn/ui primitives (auto-generated, do not edit manually)
│   │   ├── admin/           # Admin-only dashboard widgets
│   │   └── *.tsx            # Feature components (see below)
│   ├── pages/               # One file per route
│   ├── contexts/
│   │   └── AuthContext.tsx  # Supabase auth state (user, session, isPremium)
│   ├── hooks/               # Custom React hooks
│   ├── integrations/
│   │   ├── supabase/
│   │   │   ├── client.ts    # Singleton Supabase client
│   │   │   └── types.ts     # Auto-generated DB types (do not edit)
│   │   └── backend/
│   │       ├── client.ts    # HTTP client for edge function calls
│   │       └── config.ts    # Backend base URL config
│   ├── data/                # Static data files (blog posts, benchmarks, salary pages, red flags)
│   ├── lib/                 # Shared utilities (cn helper, etc.)
│   └── types/               # TypeScript type definitions
├── supabase/
│   ├── config.toml          # Supabase project config
│   ├── functions/           # Deno edge functions (one folder per function)
│   │   └── _shared/         # Shared helpers for edge functions
│   └── migrations/          # Timestamped SQL migration files
├── capacitor.config.ts      # Capacitor mobile config
├── components.json          # shadcn/ui component registry config
├── tailwind.config.ts       # Tailwind theme + plugins
├── vite.config.ts           # Vite + PWA config
├── tsconfig.json            # TypeScript project references
└── package.json             # Scripts and dependencies
```

---

## Application routes

All routes are declared in `src/App.tsx`. When adding a new route, add it **above** the `<Route path="*">` catch-all.

| Path | Page file | Notes |
|---|---|---|
| `/` | `Index.tsx` | Landing / hero page |
| `/launch` | `Launch.tsx` | Product launch page |
| `/premium` | `Premium.tsx` | Pricing / subscription page |
| `/dashboard` | `Dashboard.tsx` | Authenticated user dashboard |
| `/auth` | `Auth.tsx` | Sign in / sign up |
| `/install` | `Install.tsx` | PWA install guide |
| `/privacy` | `Privacy.tsx` | Privacy policy |
| `/terms` | `Terms.tsx` | Terms of service |
| `/about` | `About.tsx` | About page |
| `/blog` | `Blog.tsx` | Blog index (featured posts) |
| `/blog/:slug` | `BlogPost.tsx` | Individual post (data from `src/data/blogPosts.ts`) |
| `/exploitation-check` | `ExploitationCheck.tsx` | Wage exploitation calculator |
| `/red-flags` | `RedFlags.tsx` | Pay red-flag checker |
| `/cost-of-staying` | `CostOfStaying.tsx` | Opportunity cost calculator |
| `/benchmarks` | `Benchmarks.tsx` | Industry salary benchmarks |
| `/templates` | `Templates.tsx` | Negotiation email templates |
| `/salaries` | `Salaries.tsx` | Salary database browser |
| `/salaries/:job/:location` | `SalaryByRole.tsx` | Programmatic salary page |
| `/timeline` | `Timeline.tsx` | Personal salary history |
| `/admin` | `Admin.tsx` | Admin analytics dashboard |
| `/admin/users` | `AdminUsers.tsx` | Admin user management |
| `/health` | `HealthCheck.tsx` | App health check endpoint |

---

## Database schema

Managed via Supabase migrations in `supabase/migrations/`. All tables have Row Level Security (RLS) enabled.

| Table | Purpose |
|---|---|
| `profiles` | Extended user data; auto-created on signup via `handle_new_user` trigger. Has `stripe_customer_id`. |
| `saved_reports` | Salary analysis results saved by authenticated users |
| `analytics_events` | Custom event tracking (page views, button clicks, UTM params) |
| `anonymous_salaries` | Community-submitted salary data (no PII) |
| `salary_contributions` | Links `auth.users` to their `anonymous_salaries` submissions |
| `salary_timeline` | User's personal salary history over time |
| `referrals` | Referral programme — referrer/referred pairs with status |
| `referral_rewards` | Rewards granted to referrers |
| `user_roles` | RBAC — `admin` or `user` roles via `app_role` enum |

**Key RLS pattern**: policies use `auth.uid() = user_id` for user-scoped tables. Admin edge functions use JWT claims (`getClaims`) rather than `getUser` to verify admin role server-side.

When writing new migrations:
- Place them in `supabase/migrations/` with a timestamp prefix
- Always enable RLS on new tables
- Use `auth.uid()` in RLS policies, never hardcode UUIDs

---

## Supabase Edge Functions

Located in `supabase/functions/<function-name>/index.ts`. Written in **Deno TypeScript**. Shared helpers live in `supabase/functions/_shared/`.

### Auth pattern in edge functions

All protected edge functions must verify the caller using JWT claims (not `supabase.auth.getUser()`):

```typescript
const authHeader = req.headers.get("Authorization");
// Use getClaims helper from _shared to extract sub, email, role
```

Always return `401` for unauthenticated requests before doing any DB work.

### Function catalogue

| Function | Purpose |
|---|---|
| `analyze-salary` | Core salary analysis — calls OpenAI, returns structured insights |
| `generate-premium-insights` | Deeper AI insights for premium subscribers |
| `generate-email-template` | AI-generated negotiation email |
| `generate-manager-scripts` | AI conversation scripts for salary talks |
| `generate-rejection-responses` | AI responses to lowball offers |
| `generate-offer-comparison` | Multi-offer comparison analysis |
| `generate-pdf` | Generates downloadable PDF salary report |
| `fetch-salary-data` | Fetches external market salary data (CareerOneStop API) |
| `save-report` | Persists analysis result to `saved_reports` |
| `get-saved-reports` | Retrieves user's report history |
| `get-user-pdfs` | Lists saved PDF reports for the user |
| `delete-user-pdf` | Deletes a user's PDF from storage |
| `check-premium` | Checks Stripe subscription status |
| `check-entitlements` | Fine-grained feature entitlement check |
| `create-checkout` | Creates a Stripe Checkout session |
| `customer-portal` | Redirects to Stripe Customer Portal |
| `stripe-webhook` | Handles Stripe webhook events |
| `track-event` | Writes analytics events to `analytics_events` |
| `admin-analytics` | Aggregated metrics for admin dashboard |
| `admin-users` | Admin CRUD on user records |
| `calculate-exit-readiness` | Computes exit-readiness score |

---

## Key feature components

| Component | File | What it does |
|---|---|---|
| `SalaryForm` | `src/components/SalaryForm.tsx` | Main data entry form (job, location, salary, etc.) |
| `SalaryResults` | `src/components/SalaryResults.tsx` | Renders the full analysis output with charts |
| `SalaryBrowser` | `src/components/SalaryBrowser.tsx` | Browse/search community salary data |
| `SalarySubmissionForm` | `src/components/SalarySubmissionForm.tsx` | Anonymous salary contribution form |
| `OfferComparisonTool` | `src/components/OfferComparisonTool.tsx` | Compare two or more job offers |
| `ManagerScriptGenerator` | `src/components/ManagerScriptGenerator.tsx` | Generate conversation scripts |
| `RejectionResponseGenerator` | `src/components/RejectionResponseGenerator.tsx` | Generate rejection counter-scripts |
| `Navigation` | `src/components/Navigation.tsx` | Desktop nav bar with auth state |
| `MobileNav` | `src/components/MobileNav.tsx` | Mobile bottom navigation |
| `AccountSettings` | `src/components/AccountSettings.tsx` | Profile + subscription management |
| `SavedReportsHistory` | `src/components/SavedReportsHistory.tsx` | List of past analyses |
| `SavedPdfReports` | `src/components/SavedPdfReports.tsx` | PDF download management |
| `TimelineChart` | `src/components/TimelineChart.tsx` | Recharts-based salary history chart |
| `EmailCapture` | `src/components/EmailCapture.tsx` | Lead capture / waitlist form |
| `ExitIntentPopup` | `src/components/ExitIntentPopup.tsx` | Exit-intent conversion popup |
| `InstallPrompt` | `src/components/InstallPrompt.tsx` | PWA install banner |
| `SplashScreen` | `src/components/SplashScreen.tsx` | PWA standalone mode splash |
| `FAQSchema` | `src/components/FAQSchema.tsx` | Injects FAQ JSON-LD for SEO |

---

## Auth and user context

`src/contexts/AuthContext.tsx` wraps the entire app and exposes:
- `user` — Supabase `User` object (null if logged out)
- `session` — active Supabase session
- `isPremium` — boolean derived from Stripe subscription check
- `signIn`, `signOut`, `signUp` helpers

Use the `useAuth()` hook (from `AuthContext`) anywhere authentication state is needed. Do **not** call `supabase.auth.getUser()` directly in components.

Admin access is checked via `useAdminAuth` hook (`src/hooks/useAdminAuth.ts`) which verifies the `user_roles` table.

---

## Custom hooks

| Hook | File | Purpose |
|---|---|---|
| `useAuth` | via `AuthContext` | Auth state and actions |
| `useAdminAuth` | `hooks/useAdminAuth.ts` | Admin role gate |
| `useAnalytics` | `hooks/useAnalytics.ts` | Fire analytics events via `track-event` function |
| `useUTMTracking` | `hooks/useUTMTracking.ts` | Capture UTM params on load, store to analytics |
| `useSEO` | `hooks/useSEO.ts` | Set page title/meta tags dynamically |
| `use-mobile` | `hooks/use-mobile.tsx` | Responsive breakpoint detection |
| `use-toast` | `hooks/use-toast.ts` | Programmatic toast notifications |

---

## Static data files

Large data sets are stored as TypeScript modules in `src/data/`:

| File | Contents |
|---|---|
| `blogPosts.ts` | All blog post content (title, slug, body HTML/Markdown, metadata) |
| `industryBenchmarks.ts` | Salary benchmarks by industry, role, and region |
| `salaryPages.ts` | Config for programmatic `/salaries/:job/:location` pages |
| `redFlags.ts` | Curated list of pay red-flag patterns |

When adding new blog posts, add entries to `blogPosts.ts` and update `public/sitemap.xml` with the new URL and `lastmod` date.

When adding new programmatic salary pages, update both `salaryPages.ts` and `public/sitemap.xml`.

---

## Development workflow

### Local dev server

```bash
npm install
npm run dev        # starts Vite on http://localhost:8080
```

### Build

```bash
npm run build      # production build
npm run build:dev  # development build (useful for debugging)
npm run preview    # preview the production build locally
```

### Linting

```bash
npm run lint       # ESLint with TypeScript rules
```

There is no test suite configured. Verify features manually via the dev server.

### Path alias

`@/` maps to `src/`. Always use this alias for imports; never use relative paths like `../../components`.

```typescript
import { Button } from "@/components/ui/button";
```

### Supabase Edge Functions (local)

```bash
supabase functions serve <function-name> --env-file .env.local
```

Edge functions are Deno-based — import from `https://deno.land/` URLs or `npm:` specifiers.

---

## Environment variables

The Supabase client reads its config from two Vite env vars (set in `.env.local`, never committed):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Edge functions read server-side secrets from Supabase secrets (set via `supabase secrets set`), including:
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CAREERONESTOP_USER_ID` / `CAREERONESTOP_TOKEN`

---

## UI conventions

### Component library — shadcn/ui

All primitive UI elements live in `src/components/ui/`. These are **generated files** — regenerate them with the shadcn CLI rather than editing directly:

```bash
npx shadcn-ui@latest add <component-name>
```

### Icons

Use `lucide-react` exclusively for icons. Do not add other icon libraries.

### Styling

- Utility-first with Tailwind CSS classes.
- Use the `cn()` helper from `src/lib/utils.ts` to merge conditional classes.
- Dark mode is supported via `next-themes` (`ThemeProvider` wraps the app).
- Avoid inline `style` props unless Tailwind cannot achieve the result.

### Charts

Use `recharts` (already installed). The `TimelineChart` component is a reference implementation.

### Forms

Use `react-hook-form` + `zod` for all forms. Connect resolvers via `@hookform/resolvers/zod`.

### Toast notifications

Use the `useToast` hook (shadcn toast) for UI feedback. Use `sonner` for simpler one-off toasts.

---

## SEO and content

- Each page should call `useSEO()` to set title and meta description.
- Blog posts use `FAQSchema` for structured data where relevant.
- `public/sitemap.xml` is maintained manually — update it when adding new public URLs.
- `public/robots.txt` controls crawl behaviour.
- Programmatic salary pages (`/salaries/:job/:location`) pull config from `src/data/salaryPages.ts`; add new entries there to expand coverage.

---

## PWA and mobile

- PWA manifest is configured in `vite.config.ts` under `VitePWA`.
- The app name in the manifest is **"Underpaid"**.
- Splash screen is shown only in standalone (installed) mode — see `SplashScreen.tsx`.
- Capacitor config is in `capacitor.config.ts`. Native builds are separate from the web build.
- Push notifications use `@capacitor/push-notifications`.

---

## Payments (Stripe)

- Checkout flow: front-end calls `create-checkout` edge function → Stripe Checkout → webhook handled by `stripe-webhook`.
- Subscription status is stored on `profiles.stripe_customer_id` and checked via `check-premium`.
- Customer portal is accessed via `customer-portal` edge function redirect.
- **Never** put Stripe secret keys in front-end code.

---

## Admin panel

Routes: `/admin` (analytics) and `/admin/users` (user list).

- Protected by `useAdminAuth` hook; non-admins are redirected.
- Admin roles are set in the `user_roles` table with `role = 'admin'`.
- Edge functions `admin-analytics` and `admin-users` verify admin status server-side via JWT claims before returning data.

---

## Adding new features — checklist

1. **New page**: create `src/pages/MyPage.tsx`, add a `<Route>` in `App.tsx` above the catch-all, call `useSEO()` at the top of the component.
2. **New edge function**: create `supabase/functions/my-function/index.ts`, include CORS headers and auth verification, add to the catalogue above.
3. **New DB table**: create a timestamped migration in `supabase/migrations/`, enable RLS, add policies, regenerate types (`supabase gen types typescript`), update `src/integrations/supabase/types.ts`.
4. **New UI component**: add to `src/components/`, use shadcn primitives + Tailwind + `cn()`.
5. **New public URL**: update `public/sitemap.xml`.

---

## Conventions and gotchas

- **Do not edit** `src/components/ui/*` files directly — regenerate via shadcn CLI.
- **Do not edit** `src/integrations/supabase/types.ts` manually — regenerate via `supabase gen types typescript`.
- Edge functions authenticate via **JWT claims** (`getClaims` from `_shared`), not `supabase.auth.getUser()`. This is intentional to avoid an extra network round-trip.
- The `@` import alias must be used for all intra-project imports.
- This project was bootstrapped by Lovable; avoid reverting auto-generated boilerplate unless there is a clear reason.
- Blog content and industry benchmarks are stored as large static TypeScript files (not a CMS). Keep changes scoped — editing `blogPosts.ts` touches a 140 KB file.
- When committing migrations, **never** alter existing migration files; always add a new one.
