
# Plan: Add Career Tools Menu with Upgrade CTAs

## Overview
Create a "Tools" dropdown menu in the main navigation that groups career calculators and premium tools together. For users who are not logged in or not Pro members, show clear upgrade/sign-up CTAs on Pro-only items.

## Implementation Steps

### 1. Create a Reusable CareerToolsMenu Component
**File:** `src/components/CareerToolsMenu.tsx`

Create a dropdown menu component that:
- Groups tools into "Free Tools" and "Pro Tools" sections
- Shows all tools with their respective icons
- Displays a lock icon and "Upgrade" badge for Pro tools when the user is not a Pro member
- For non-logged-in users, Pro items link to `/auth?returnTo=/templates` (or respective page)
- For logged-in non-Pro users, Pro items link to `/?upgrade=pro`
- Uses the existing `DropdownMenu` component from Radix

**Menu Structure:**
```text
Tools (dropdown trigger)
├─ Free Tools
│   ├─ Exploitation Check - "Am I Being Exploited?"
│   ├─ Red Flags - "Company Warning Signs"
│   └─ Cost of Staying - "Earnings Loss Calculator"
└─ Pro Tools
    ├─ Email Templates - "AI Negotiation Scripts" [Pro badge]
    └─ Salary Timeline - "Track Compensation" [Pro badge]
```

### 2. Update Index Page Navigation
**File:** `src/pages/Index.tsx`

Replace the static navigation links in the second row with the new dropdown integrated:
- Keep: Salaries, Benchmarks, Blog
- Add: Tools dropdown menu between Home and Salaries

### 3. Update Other Pages with Navigation
Apply the same navigation pattern to pages that currently have their own nav bars:
- `src/pages/Dashboard.tsx`
- `src/pages/ExploitationCheck.tsx`
- `src/pages/RedFlags.tsx`
- `src/pages/CostOfStaying.tsx`
- `src/pages/Templates.tsx`
- `src/pages/Timeline.tsx`
- `src/pages/Benchmarks.tsx` (if it has nav)

---

## Technical Details

### CareerToolsMenu Component Props/Logic
```typescript
// Uses useAuth() for:
// - user: Check if logged in
// - isPro: Check Pro subscription status

// Tool definitions with metadata:
const freeTools = [
  { name: "Hours Check", description: "Am I being exploited?", path: "/exploitation-check", icon: Calculator },
  { name: "Red Flags", description: "Company warning signs", path: "/red-flags", icon: Flag },
  { name: "Cost of Staying", description: "Earnings loss calculator", path: "/cost-of-staying", icon: TrendingDown },
];

const proTools = [
  { name: "Email Templates", description: "AI negotiation scripts", path: "/templates", icon: Mail },
  { name: "Salary Timeline", description: "Track compensation", path: "/timeline", icon: TrendingUp },
];

// Pro tool link logic:
// - If isPro: link directly to tool
// - If user but not Pro: link to /?upgrade=pro
// - If not logged in: link to /auth?returnTo=[tool-path]
```

### Visual Design
- Use existing `DropdownMenu` components for consistency
- Add subtle separator between Free and Pro sections
- Pro items show a small Crown icon and muted "Pro" label
- Hover states match existing dropdown styling

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/CareerToolsMenu.tsx` | Create | New dropdown menu component |
| `src/pages/Index.tsx` | Modify | Add Tools menu to navigation |
| `src/pages/Dashboard.tsx` | Modify | Add Tools menu to navigation |
| `src/pages/ExploitationCheck.tsx` | Modify | Add Tools menu to navigation |
| `src/pages/RedFlags.tsx` | Modify | Add Tools menu to navigation |
| `src/pages/CostOfStaying.tsx` | Modify | Add Tools menu to navigation |
| `src/pages/Templates.tsx` | Modify | Add Tools menu to navigation |
| `src/pages/Timeline.tsx` | Modify | Add Tools menu to navigation |

---

## User Experience

**Logged-out user sees:**
- Free tools link directly to their pages
- Pro tools show "Pro" badge and lock icon, clicking prompts sign-in first

**Logged-in free user sees:**
- Free tools link directly
- Pro tools show "Pro" badge, clicking shows upgrade prompt

**Pro user sees:**
- All tools link directly with no badges/locks
