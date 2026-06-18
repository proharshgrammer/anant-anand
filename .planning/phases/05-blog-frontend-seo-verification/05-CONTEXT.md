# Phase 5: Blog Frontend, SEO & Verification - Context

**Gathered:** 2026-06-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete public blog pages (listing with pagination, detail with TOC), SEO infrastructure (metadata, JSON-LD schemas, sitemap), static/legal pages (Contact, About, Privacy Policy, Terms of Use), and a PageSpeed optimization pass. This completes the remaining public-facing pages and ensures search engine visibility.

Requirements covered: PUBL-05, PUBL-06, PUBL-07, SEOP-01, SEOP-02, SEOP-03, SEOP-04.
</domain>

<decisions>
## Implementation Decisions

### Blog Listing Page
- **D-01:** Card grid layout — reuse existing card/grid patterns from TourCard for visual consistency
- **D-02:** Traditional numbered pagination (10 posts per page) — SEO-friendly distinct URLs
- **D-03:** Server component with ISR — follow tour detail pattern for better SEO and faster initial load
- **D-04:** URL-based category filtering (`/blog?category={slug}` or `/blog/category/{slug}`) — distinct URLs for each category

### Blog Detail Page
- **D-05:** Render HTML content via `dangerouslySetInnerHTML` with `@tailwindcss/typography` prose classes — content is admin-generated (trusted source)
- **D-06:** Auto-generate Table of Contents from H2/H3 headings in the content — sticky sidebar on desktop, collapsible on mobile, show current reading position
- **D-07:** Related tours displayed as TourCard grid at bottom of post — reuse existing TourCard component
- **D-08:** Author info minimal — name only in post metadata line

### SEO & Metadata
- **D-09:** Use native Next.js `generateMetadata` API — not next-seo (already installed but unnecessary with App Router). Follow the proven pattern from `app/tours/[slug]/page.tsx`
- **D-10:** JSON-LD schemas via manual `<script type="application/ld+json">` per page — no schema-dts package needed
- **D-11:** Schema types: Article for blog posts, TouristTrip for tour detail pages, LocalBusiness for homepage
- **D-12:** next-sitemap package — install, create `next-sitemap.config.js`, add `postbuild` script to `package.json`
- **D-13:** PageSpeed >= 85 mobile via standard optimizations (Next.js Image, ISR, lazy-loading, font subsetting)

### Static Pages
- **D-14:** Contact page — static office info + reuse existing EnquiryForm component with existing server action
- **D-15:** About, Privacy Policy, Terms of Use — hardcoded server components, not fetched from Supabase

### the agent's Discretion
- Blog card design details (image aspect ratio, excerpt length, hover states)
- TOC visual style (indentation, active heading highlight, scroll behavior)
- Exact route pattern for category filtering (`/blog/category/{slug}` vs `?category=`)
- Contact page layout (two-column vs single-column, map embed style)
- Legal page content structure

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/ROADMAP.md` — Phase 5 goal, plans, requirements mapping
- `.planning/REQUIREMENTS.md` — PUBL-05, PUBL-06, PUBL-07, SEOP-01, SEOP-02, SEOP-03, SEOP-04 definitions
- `.planning/PROJECT.md` — Core value, constraints (SSR/ISR required, $0 hosting)

### Data Model
- `types/index.ts` — BlogPost interface with all fields (related_tour_ids, schema_type, seo fields, etc.)

### Existing Query Patterns
- `lib/supabase/queries/blog.ts` — Existing admin queries (need new public queries with pagination)
- `lib/supabase/queries/tours.ts` — Reference for server-side query pattern with `createServerClient()`
- `lib/supabase/client.ts` — Browser Supabase client
- `lib/supabase/server.ts` — Server Supabase client (for SSR/ISR data fetching)

### SEO Patterns (Reference Implementations)
- `app/tours/[slug]/page.tsx` — `generateMetadata` pattern for dynamic SEO metadata
- `app/layout.tsx` — Root layout base Metadata object (title template, OG defaults)

### Reusable Components
- `components/tours/TourCard.tsx` — Reusable card component for blog listing grid
- `components/public/EnquiryForm.tsx` — For contact page form
- `app/actions/enquiry.ts` — Server action for enquiry form submission
- `components/public/PublicLayoutProvider.tsx` — Conditional layout rendering pattern

### Existing Routes (Pattern Context)
- `app/tours/page.tsx` — Client-side listing with filtering (blog listing will differ — server component)
- `app/destinations/page.tsx` — Simple server component pattern for static-like pages
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/tours/TourCard.tsx` — Adapt for blog post cards (image, title, excerpt, date, category badge)
- `components/public/EnquiryForm.tsx` — Reuse on Contact page with existing server action
- `app/actions/enquiry.ts` — Existing server action for form submission
- `components/ui/badge.tsx` — shadcn badge for category labels, status indicators
- `components/ui/accordion.tsx` — For mobile TOC if needed
- `lib/utils.ts` — Existing `formatDate` utility (or use installed `date-fns`)

### Established Patterns
- **Server components for detail pages** — `app/tours/[slug]/page.tsx` (async, `createServerClient()`)
- **`generateMetadata` for SEO** — pattern proven on tour detail page; blog pages should follow same pattern
- **Card grids for listings** — `components/tours/TourCard.tsx` uses a consistent card pattern
- **ISR for content pages** — revalidate pattern for data that changes infrequently

### Integration Points
- `components/public/Navbar.tsx` — Already has `/blog` and `/contact` links (currently 404)
- `components/public/Footer.tsx` — Already has blog, contact, privacy, terms links (currently 404)
- `components/public/PublicLayoutProvider.tsx` — Renders Navbar/Footer on public pages
- Blog data model has `related_tour_ids: string[]` — ready for related tours feature
- `app/admin/blog/` — Admin CMS already creates/manages blog posts with SEO fields

### Gaps to Address
- No public blog queries exist — need `getPublishedBlogPosts(page, limit, category?)` and `getBlogPostBySlug(slug)` using server client
- `next-sitemap` not installed — needs `npm install next-sitemap`, config file, `postbuild` script
- `@tailwindcss/typography` may not be installed — verify and install if needed
- Duplicate WhatsApp components exist (`FloatingWhatsAppCTA.tsx` and `WhatsAppButton.tsx`) — both rendered
</code_context>

<specifics>
## Specific Ideas

- Blog listing should feel content-first — cards with featured image, title, excerpt, date, and category badge
- TOC should highlight the current section as the user scrolls (Intersection Observer)
- JSON-LD schemas should be added to both existing pages (tours detail, homepage) and new pages (blog)
- Static pages follow the minimalist server component pattern from `app/destinations/page.tsx`
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Automated email alerts for enquiries (NOTF-01) are v2 and not included.
</deferred>

---

*Phase: 05-Blog Frontend, SEO & Verification*
*Context gathered: 2026-06-18*
