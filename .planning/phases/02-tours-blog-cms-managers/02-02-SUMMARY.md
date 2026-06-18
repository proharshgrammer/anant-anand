---
phase: "02"
plan: "02-02"
name: "Tours Manager CMS — Listing, Form & Waypoint Builder"
subsystem: admin-cms
tags: [tours, cms, waypoints, form]
key-files:
  created:
    - lib/supabase/queries/tours.ts
    - components/admin/WaypointBuilder.tsx
    - components/admin/TourForm.tsx
    - app/admin/tours/page.tsx
    - app/admin/tours/new/page.tsx
    - app/admin/tours/[id]/edit/page.tsx
key-decisions:
  - TourForm uses tabbed layout (Details/Itinerary/SEO) to prevent form overload
  - Gallery limited to 8 images; uses existing ImageUploader component
  - Age group selection uses pill-toggle pattern instead of checkboxes for clarity
  - Destinations stored as comma-separated string in form, converted to array on submit
  - `as never` cast used for Supabase insert/update calls (same as existing pattern)
requirements-completed: [CMSM-02, CMSM-03]
duration: "~25 min"
completed: "2026-06-18"
---

# Phase 02 Plan 02-02 Summary

**Tours Manager CMS** — Full admin CMS for tour packages including listing table, create/edit forms with tabbed layout, WaypointBuilder for itinerary map coordinates, and image gallery management.

## What Was Built

### Task 1: Tours Queries (`lib/supabase/queries/tours.ts`)
- `getTours()` — lightweight listing query (selected columns only for performance)
- `getTourById(id)` — full tour with all fields for edit form
- `createTour(data)`, `updateTour(id, data)`, `deleteTour(id)`, `toggleTourPublish(id, state)`

### Task 2: WaypointBuilder (`components/admin/WaypointBuilder.tsx`)
- Ordered list of waypoint cards with teal left-border accent
- Each card: Day badge, Location Name, Lat/Lng inputs (4 decimal step), Description textarea
- ↑/↓ move buttons + 🗑 Remove; auto-renumbers days on reorder
- "Open Google Maps →" helper link with right-click coordinate instructions
- "Add Waypoint (Day N)" button at bottom
- Empty state with descriptive placeholder

### Task 3: TourForm (`components/admin/TourForm.tsx`)
- **Details tab:** Title, Slug (auto-from title), Short/Full description, Category, Difficulty, Days/Nights/Price/Group Size grid, Age Groups (pill toggles), Destinations (comma input), Inclusions/Exclusions (dynamic add/remove list)
- **Itinerary tab:** WaypointBuilder embedded
- **SEO tab:** Meta title (70 char, color-coded counter), Meta description (160 char)
- **Right sidebar:** Hero ImageUploader, Publish/Featured toggles, Gallery (up to 8 images via ImageUploader grid)

### Task 4: Tours Admin Pages
- `app/admin/tours/page.tsx` — listing table: Title, Category badge, Duration, Price (₹ formatted), Status (Published/Draft toggle button), Featured (star toggle), Edit/Delete actions; confirm dialog for delete
- `app/admin/tours/new/page.tsx` — breadcrumb + TourForm → createTour → redirect to listing
- `app/admin/tours/[id]/edit/page.tsx` — loads tour, TourForm with pre-filled data, shows "Saved successfully" green badge on update

## Verification
- ✅ `tsc --noEmit` passes with 0 errors
- ✅ Committed: 800d2b3

## Deviations from Plan
None — executed exactly as planned.

## Self-Check: PASSED
