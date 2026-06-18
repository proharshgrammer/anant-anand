---
phase: "02"
plan: "02-03"
name: "Blog Manager CMS — Tiptap Editor, Categories & SEO Fields"
subsystem: admin-cms
tags: [blog, tiptap, enquiries, rich-text, seo]
key-files:
  created:
    - components/admin/RichTextEditor.tsx
    - components/admin/BlogForm.tsx
    - lib/supabase/queries/blog.ts
    - lib/supabase/queries/enquiries.ts
    - app/admin/blog/page.tsx
    - app/admin/blog/new/page.tsx
    - app/admin/blog/[id]/edit/page.tsx
    - app/admin/enquiries/page.tsx
key-decisions:
  - RichTextEditor uses dynamic import (next/dynamic + ssr:false) — Tiptap uses browser APIs incompatible with SSR
  - Table extension uses named export `{ Table }` not default — discovered via tsc error
  - `setContent(value)` with single arg instead of (value, false) — second param changed in Tiptap v2
  - BlogForm auto-calculates read_time_minutes from word count (wordCount / 200) when field is empty
  - EnquiriesPage uses React fragment key pattern for expanded rows (using array iteration with conditional rows)
  - slugify package already present from Phase 1 install (no new dep needed)
requirements-completed: [CMSM-05, CMSM-06]
duration: "~30 min"
completed: "2026-06-18"
---

# Phase 02 Plan 02-03 Summary

**Blog Manager CMS + Tiptap Rich-Text Editor + Enquiries Manager** — Full-featured blog CMS with Tiptap editor (Bold/Italic/H1-H3/Lists/Code/Links/Images/YouTube/Tables), SEO fields, and complete enquiries management with expandable rows, inline status updates, notes, CSV export, and pagination.

## What Was Built

### Tiptap Packages Installed
`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-youtube`, `@tiptap/extension-table`, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header`, `@tiptap/extension-character-count`, `@tiptap/extension-placeholder`

### Task 1: RichTextEditor (`components/admin/RichTextEditor.tsx`)
- Toolbar: Bold, Italic, Strike | H1, H2, H3 | Bullet/Ordered list, Blockquote, Code Block | Link (inline popover), Image upload (→ Supabase Storage → insert), YouTube embed, Insert Table | HR, Undo, Redo
- Editor: Tiptap with `prose prose-teal` class, min-height 400px
- Character count footer: NNN / 50,000 (color coded when approaching limit)
- Link popover: URL input, Apply/Cancel — inserts link or updates existing
- Image upload: opens file picker → uploads to `blog-images/blog-content/` → inserts in editor
- YouTube: `window.prompt` for URL → inserts iframe
- SSR: dynamically imported via `next/dynamic({ ssr: false })`

### Task 2: Query Helpers
- `lib/supabase/queries/blog.ts` — `getBlogPosts()`, `getBlogPostById()`, `createBlogPost()`, `updateBlogPost()`, `deleteBlogPost()`
- `lib/supabase/queries/enquiries.ts` — `getEnquiries(filters?)`, `updateEnquiryStatus()`, `updateEnquiryNotes()`, `deleteEnquiry()`

### Task 3: BlogForm (`components/admin/BlogForm.tsx`)
- **Content tab:** Title, Slug (auto-generated), Excerpt, RichTextEditor for full content
- **Right sidebar:** Status (draft/scheduled/published), Publish date (conditional on status), Schema type, Category, Tags (comma-separated), Author name/bio, Read time (auto-calculated), Featured image (ImageUploader)
- **SEO tab:** Meta title (70 char, color counter), Meta description (160 char), Focus keyword, Canonical URL

### Task 4+5: Blog Admin Pages
- `app/admin/blog/page.tsx` — listing with status badge, quick publish toggle, edit/delete with confirm
- `app/admin/blog/new/page.tsx` — create → redirect to listing
- `app/admin/blog/[id]/edit/page.tsx` — pre-filled form, "Saved successfully" banner

### Task 6: Enquiries Manager (`app/admin/enquiries/page.tsx`)
- Status filter tabs: All | New | Contacted | Follow Up | Converted | Closed
- Row click → expand: shows full message + notes textarea (auto-save on blur)
- Inline status dropdown per row (updates immediately via `updateEnquiryStatus`)
- Color-coded row backgrounds per status
- Relative timestamps ("2h ago") with exact date on hover
- Export CSV button: downloads name/phone/email/tour/status/date
- Pagination: 20 per page
- Delete with confirm dialog

## Verification
- ✅ `tsc --noEmit` passes with 0 errors (after fixing Table named export + setContent call)
- ✅ Committed: 954a4d0

## Deviations from Plan
- **Table named import:** `@tiptap/extension-table` exports `{ Table }` as a named export, not default. Fixed via `import { Table } from '@tiptap/extension-table'`
- **setContent signature:** Tiptap v2 `setContent()` takes 1 arg (content only); second arg `false` is an invalid type. Fixed.
- **Enquiries expanded rows:** Used React fragment approach for expandable rows (conditional sibling TR) — cleaner than the originally planned `<details>` pattern.

## Self-Check: PASSED
