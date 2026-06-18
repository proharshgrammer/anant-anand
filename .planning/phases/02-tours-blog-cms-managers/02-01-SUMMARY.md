---
phase: "02"
plan: "02-01"
name: "Supabase Storage Buckets & Image Uploader Component"
subsystem: admin-cms
tags: [storage, upload, images, destinations]
key-files:
  created:
    - lib/supabase/queries/storage.ts
    - lib/supabase/queries/destinations.ts
    - components/admin/ImageUploader.tsx
    - components/admin/DestinationForm.tsx
    - app/admin/destinations/page.tsx
key-decisions:
  - Used `as never` casting for insert/update calls due to auth-helpers-nextjs@0.10 generic inference limitation — same pattern as existing queries/settings.ts
requirements-completed: [CMSM-04]
duration: "~20 min"
completed: "2026-06-18"
---

# Phase 02 Plan 02-01 Summary

**Supabase Storage helpers + ImageUploader component + Destinations CMS** — client-side drag-and-drop file upload to Supabase Storage with preview, alt text, progress state, and error handling; plus full CRUD Destinations admin page.

## What Was Built

### Task 1: Storage Helpers (`lib/supabase/queries/storage.ts`)
- `uploadImage(bucket, file, folder?)` — uploads to Supabase Storage, returns `{url, path}`
- `deleteImage(bucket, path)` — removes file from bucket
- `listImages(bucket, folder)` — lists files with public URLs
- `getPathFromUrl(url, bucket)` — extracts storage path from public URL (for deletion by URL)

### Task 2: ImageUploader (`components/admin/ImageUploader.tsx`)
- Drag-and-drop zone with dashed border, upload icon, hover states
- File input (hidden, triggered by click or drag)
- Preview: 128px thumbnail with ✕ remove button when `value` is set
- Upload states: `idle → uploading (spinner) → success (checkmark) → error (red message)`
- Client-side validation: file size (configurable `maxSizeMB`) and MIME type check
- Alt text input field with helper text (accessibility & SEO)
- Reusable props: `bucket`, `folder`, `value`, `onChange`, `onAltChange`, `maxSizeMB`, `accept`

### Task 3: Destinations Queries (`lib/supabase/queries/destinations.ts`)
- `getDestinations()`, `createDestination()`, `updateDestination()`, `deleteDestination()`

### Task 4: Destinations CMS
- `components/admin/DestinationForm.tsx` — modal dialog form with React Hook Form + Zod validation
  - Auto-slug generation from name on blur
  - ImageUploader for destination image (bucket: `destination-images`)
  - Is Featured toggle
- `app/admin/destinations/page.tsx` — full CRUD client component
  - Table: Name + thumbnail, Region, Featured star toggle, Created At, Actions
  - Featured toggle via star icon (yellow when featured)
  - Add/Edit via modal overlay, Delete with confirm dialog
  - Empty state with CTA button

## Verification
- ✅ `tsc --noEmit` passes with 0 errors
- ✅ Committed: bf22344

## Deviations from Plan
- **TypeScript insert/update type cast:** `@supabase/auth-helpers-nextjs@0.10` infers `never[]` for table insert types when using `createClientComponentClient<Database>()`. Fixed with `as never` cast — same pattern already established in `lib/supabase/queries/settings.ts`. Not a runtime issue.

## Self-Check: PASSED
