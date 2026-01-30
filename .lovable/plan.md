
# Plan: Add Mobile Navigation with Tools Menu

## Overview
Create a responsive mobile navigation system using a hamburger menu that slides out a Sheet component. This will properly display all navigation items including the Tools menu with its Pro/Free categorization on mobile devices.

## Problem Statement
Currently, all pages display navigation links in a horizontal row that doesn't adapt well to mobile screens. The CareerToolsMenu dropdown and other nav links either overflow, shrink uncomfortably, or require horizontal scrolling on small devices.

## Solution Architecture

```text
Desktop (768px+)           Mobile (<768px)
+------------------+       +------------------+
| Logo  NavLinks   |       | Logo    [=] Menu |
| Tools Salaries.. |       +------------------+
+------------------+               |
                                   v (opens Sheet)
                           +------------------+
                           | Navigation       |
                           |   Home           |
                           |   Tools >        |
                           |     Free Tools   |
                           |     Pro Tools    |
                           |   Salaries       |
                           |   Benchmarks     |
                           |   Blog           |
                           | [Theme Toggle]   |
                           | [Sign In/User]   |
                           +------------------+
```

## Implementation Steps

### Step 1: Create MobileNav Component
**File:** `src/components/MobileNav.tsx`

A new component that renders:
- A hamburger menu button (visible only on mobile)
- A Sheet that slides in from the right containing:
  - All navigation links as full-width touch targets
  - A collapsible "Tools" section that expands to show Free and Pro tools
  - Pro tools with lock/badge indicators for non-Pro users
  - Theme toggle at the bottom
  - User menu items (Sign In button or user dropdown items)

Key features:
- Uses the existing `useIsMobile` hook to detect mobile
- Uses the existing `Sheet` component for the slide-out menu
- Uses `Collapsible` component for the Tools submenu
- Automatically closes when navigating to a new page
- Properly handles Pro tool access (same logic as CareerToolsMenu)

### Step 2: Create a Shared Navigation Component
**File:** `src/components/Navigation.tsx`

A unified navigation component that:
- On desktop: Shows the existing horizontal navigation layout
- On mobile: Shows logo + hamburger button that opens MobileNav
- Accepts props for customization (e.g., which link is active)
- Handles user authentication state display

This component will replace the repeated nav code in all pages.

### Step 3: Update All Pages to Use Shared Navigation
Update each page to import and use the new `Navigation` component instead of their inline nav implementations:

| Page | Current Nav Pattern | Update |
|------|---------------------|--------|
| Index.tsx | Custom with user menu | Use Navigation component |
| Dashboard.tsx | Standard + "Dashboard" active | Use Navigation component |
| ExploitationCheck.tsx | Standard | Use Navigation component |
| RedFlags.tsx | Standard | Use Navigation component |
| CostOfStaying.tsx | Standard | Use Navigation component |
| Templates.tsx | Standard + "Dashboard" link | Use Navigation component |
| Timeline.tsx | Standard + "Dashboard" link | Use Navigation component |
| Salaries.tsx | Standard + "Salaries" active | Use Navigation component |
| Benchmarks.tsx | Standard + "Benchmarks" active | Use Navigation component |
| Blog.tsx | Standard + "Blog" active | Use Navigation component |
| About.tsx | Standard | Use Navigation component |
| Premium.tsx | Simple back button | Use Navigation component |

---

## Technical Details

### MobileNav Component Structure
```typescript
// src/components/MobileNav.tsx
interface MobileNavProps {
  user: User | null;
  isPro: boolean;
  onSignOut: () => void;
}

// Uses:
// - Sheet, SheetContent, SheetTrigger from ui/sheet
// - Collapsible, CollapsibleTrigger, CollapsibleContent from ui/collapsible
// - useIsMobile hook
// - Same tool definitions as CareerToolsMenu
```

### Navigation Component Structure
```typescript
// src/components/Navigation.tsx
interface NavigationProps {
  activePage?: "home" | "salaries" | "benchmarks" | "blog" | "dashboard" | "tools";
  showDashboardLink?: boolean; // For authenticated pages
  variant?: "default" | "simple"; // Simple for pages like Premium
}
```

### Mobile-Specific Styling
- Navigation items: Full-width, `min-h-12` (48px) for touch targets
- Collapsible tools section with clear indentation
- Pro badges visible on restricted items
- Sheet width: 85% of screen, max 320px

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/MobileNav.tsx` | Create | Mobile slide-out navigation |
| `src/components/Navigation.tsx` | Create | Unified responsive navigation |
| `src/pages/Index.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/Dashboard.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/ExploitationCheck.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/RedFlags.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/CostOfStaying.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/Templates.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/Timeline.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/Salaries.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/Benchmarks.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/Blog.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/About.tsx` | Modify | Replace inline nav with Navigation |
| `src/pages/Premium.tsx` | Modify | Replace inline nav with Navigation |

---

## User Experience Summary

**Desktop Experience (unchanged):**
- Horizontal nav bar with logo, links, Tools dropdown, and user controls
- CareerToolsMenu dropdown works as currently designed

**Mobile Experience (new):**
- Clean header with logo and hamburger menu icon
- Tapping hamburger opens a sheet from the right
- Full navigation available with large touch targets
- Tools section expandable to see all free and Pro tools
- Pro tools clearly marked with badges
- User can sign in/out and toggle theme from the sheet
- Sheet closes automatically after navigation
