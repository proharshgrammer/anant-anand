# Roadmap: Anant Anand Tour Packages

## Overview

A phased journey to construct a high-performance Next.js 14 website and Supabase CMS for Anant Anand Tour Packages. The implementation starts by establishing the admin panel database/auth foundation, follows with CMS management for tours and blogs, implements public landing pages with custom age-group filters, maps itineraries with Leaflet.js, and concludes with blog templates, legal pages, SEO optimization, and performance audits.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Admin Panel Foundation & Auth** - Setup project core, database migrations, auth, and dashboard shell. ✅ Complete (2026-06-18)
- [ ] **Phase 2: Tours & Blog CMS Managers** - Build admin CMS forms, Tiptap editor, image uploads, and map waypoint builder.
- [ ] **Phase 3: Public Website & Age-Group Filtering** - Implement public pages layout, Homepage, and age-group filter search logic.
- [ ] **Phase 4: Tour Details, Maps & Lead Capture** - Render Tour Detail page, Leaflet.js route maps, and Supabase enquiries submission.
- [ ] **Phase 5: Blog Frontend, SEO & Verification** - Create public blog layouts, next-seo tag generators, JSON-LD schemas, and deploy.

## Phase Details

### Phase 1: Admin Panel Foundation & Auth

**Goal**: Establish Next.js App Router workspace, run Supabase schema migrations, create auth middleware, and build admin settings.
**Mode**: mvp
**Depends on**: Nothing (first phase)
**Requirements**: [AUTH-01, AUTH-02, AUTH-03, CMSM-01, CMSM-07]
**Success Criteria** (what must be TRUE):

  1. Next.js App Router builds successfully with Tailwind CSS.
  2. Database tables (tours, blog_posts, enquiries, site_settings, destinations) are initialized in Supabase with RLS.
  3. Admin can log in to `/admin` with email and password, and unauthenticated traffic to `/admin/*` redirects to `/admin/login`.
  4. Site Settings CMS and Enquiries manager tables are functional.

**Plans**: 2 plans — **2/2 COMPLETE** ✅

Plans:
**Wave 1**

- [x] 01-01: Bootstrap Next.js, install packages, configure Supabase client, setup schema migrations, and secure admin middleware.

**Wave 2**

- [x] 01-02: Create Admin Dashboard layout, stats summary widgets, Recent Enquiries table, and Site Settings manager.

### Phase 2: Tours & Blog CMS Managers

**Goal**: Build the administrative interface for managing tours, blog articles, storage buckets, and map coordinates.
**Mode**: mvp
**Depends on**: Phase 1
**Requirements**: [CMSM-02, CMSM-03, CMSM-04, CMSM-05, CMSM-06]
**Success Criteria** (what must be TRUE):

  1. Admin can create, edit, and publish tours with drag-and-drop images uploaded to Supabase storage.
  2. Admin can drag-and-reorder day-by-day itinerary waypoints using a visual builder.
  3. Admin can compose and save blog posts using Tiptap rich-text editor, assigning tags and categories.

**Plans**: 3 plans

Plans:

- [ ] 02-01: Set up Supabase storage buckets and build the drag-and-drop Image Uploader component with alt text support.
- [ ] 02-02: Implement Tours Manager CMS: listing table, tour creation form, editing form, and interactive Waypoint Builder.
- [ ] 02-03: Implement Blog Manager CMS: post editor using Tiptap (bold, italic, tables, embeds), categories, status selectors, and SEO tabs.

### Phase 3: Public Website & Age-Group Filtering

**Goal**: Construct the public-facing pages, navbar, footer, and the core USP age-group filtering logic.
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: [PUBL-01, PUBL-02, PUBL-04, FILT-01, FILT-02, FILT-03]
**Success Criteria** (what must be TRUE):

  1. Homepage exhibits all 9 required sections in correct order, featuring dynamic tour previews and testimonials.
  2. Age-group segment filter updates URL search query parameters and displays color-coded badges on cards.
  3. Tours Listing page parses query parameters and updates the grid dynamically.

**Plans**: 2 plans

Plans:

- [ ] 03-01: Create shared Layout components (Navbar, Footer, WhatsApp floating CTA), Destinations page, and Homepage.
- [ ] 03-02: Create Tours Listing page with collapsible filters panel, search inputs, and Zustand-managed URL sync.

### Phase 4: Tour Details, Maps & Lead Capture

**Goal**: Set up Tour Detail pages, client-side Leaflet.js itinerary maps, and save user queries into Supabase.
**Mode**: mvp
**Depends on**: Phase 3
**Requirements**: [PUBL-03, IMAP-01, IMAP-02, IMAP-03, LEAD-01, LEAD-02]
**Success Criteria** (what must be TRUE):

  1. Tour Detail pages render duration, pricing, galleries, accordions, and sticky enquiry sidebars.
  2. Leaflet.js dynamically loads waypoints, connects them with polyline overlays, and displays day-wise popup details.
  3. Submitting the enquiry form saves client details into Supabase `enquiries` table.

**Plans**: 2 plans

Plans:

- [ ] 04-01: Create Tour Detail page layout, day accordion, pricing matrix, and dynamic Leaflet.js Route Map.
- [ ] 04-02: Integrate the Lead Capture form to write enquiries to Supabase, validating inputs (Indian phone formatting, group sizes).

### Phase 5: Blog Frontend, SEO & Verification

**Goal**: Complete blog posts rendering, meta headers, structured schemas, sitemap generation, and performance audits.
**Mode**: mvp
**Depends on**: Phase 4
**Requirements**: [PUBL-05, PUBL-06, PUBL-07, SEOP-01, SEOP-02, SEOP-03, SEOP-04]
**Success Criteria** (what must be TRUE):

  1. Blog Listing (with pagination) and Blog Detail (with dynamic TOC and related tours) pages render correctly.
  2. every page outputs appropriate next-seo metadata and JSON-LD schema (TouristTrip, Article, LocalBusiness).
  3. XML sitemap generates on build, and Lighthouse audits demonstrate Mobile PageSpeed >= 85.

**Plans**: 2 plans

Plans:

- [ ] 05-01: Build public Blog Listing grid and dynamic Blog Detail layout with author bios and related tours.
- [ ] 05-02: Integrate next-seo metadata, generate JSON-LD schemas, configure next-sitemap, build legal pages, and run PageSpeed audit.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Admin Panel Foundation & Auth | 2/2 | ✅ Complete | 2026-06-18 |
| 2. Tours & Blog CMS Managers | 0/3 | Not started | - |
| 3. Public Website & Age-Group Filtering | 0/2 | Not started | - |
| 4. Tour Details, Maps & Lead Capture | 0/2 | Not started | - |
| 5. Blog Frontend, SEO & Verification | 0/2 | Not started | - |
