# Phase 01 — Plan 01-02 Summary

**Plan:** Admin Navigation + Dashboard + Site Settings  
**Status:** ✅ Complete  
**Completed:** 2026-06-18

## What Was Built

### Task 1: Admin Navigation Sidebar
- **components/admin/AdminNav.tsx** — Sidebar with:
  - Desktop: sticky 240px sidebar with gradient teal background
  - Mobile: slide-in drawer with backdrop + hamburger toggle
  - 6 nav items: Dashboard, Tours, Blog Posts, Enquiries, Destinations, Settings
  - Active state highlighting with route matching
  - Logout button via `supabase.auth.signOut()` with loading state
  - View Website link opening in new tab

### Task 2: Database Query for Site Settings
- **lib/supabase/queries/settings.ts** — Two exported functions:
  - `getSettings()` — Fetches row id=1 from `site_settings` table
  - `updateSettings()` — Updates row id=1 with partial patch + timestamp

### Task 3: Admin Dashboard
- **app/admin/dashboard/page.tsx** — Server Component with:
  - 4 stat cards fetched in parallel: Total Tours, Published Tours, Blog Posts, Enquiries
  - Graceful fallback when Supabase is not connected (shows zeros)
  - Recent enquiries table (last 10) via `EnquiryTable` component
  - "Add Tour" CTA button linking to `/admin/tours/new`
- **components/admin/EnquiryTable.tsx** — Sortable table with:
  - Columns: Name, Contact (phone+email+WhatsApp), Tour/Interest, Status badge, Received date
  - 3-column sort by name, status, created_at (toggle asc/desc)
  - Status badges: New (blue), Contacted (yellow), Follow Up (orange), Converted (green), Closed (gray)
  - Relative date display (e.g., "2 hours ago") with tooltip showing exact date

### Task 4: Site Settings Manager
- **app/admin/settings/page.tsx** — Comprehensive React Hook Form with:
  - Agency Info section: name, tagline, phone, WhatsApp, email, address
  - Homepage Hero section: headline, sub-headline, background image URL
  - Stats Counters section: tours, years, destinations, families
  - Social Links section: Facebook, Instagram, YouTube URLs
  - SEO Defaults section: meta title (max 70), meta description (max 160), footer about
  - Fetches current values on mount, submit persists to Supabase
  - Success/error status banners with auto-dismiss
  - Save button disabled when form is not dirty

## Verification
- ✅ `tsc --noEmit` passes
- ✅ `npm run build` succeeds
- ✅ Dashboard renders with AdminNav on both desktop and mobile

## Artefact Checklist (from must_haves)
- ✅ `components/admin/AdminNav.tsx` — Layout sidebar menu shell
- ✅ `app/admin/dashboard/page.tsx` — Dashboard overview interface
- ✅ `app/admin/settings/page.tsx` — Site Settings edit screen
- ✅ `lib/supabase/queries/settings.ts` — Supabase Settings DB query utility
