# Requirements: Anant Anand Tour Packages

**Defined:** 2026-06-18
**Core Value:** Capture high-intent travel enquiries and build client trust by offering an intuitive, high-performance web experience highlighted by age-group based tour filtering.

## v1 Requirements

Requirements for the initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: Admin user can log in to the admin panel (`/admin/login`) with email and password via Supabase Auth.
- [ ] **AUTH-02**: Admin user session persists for 7 days in a secure cookie, with automatic logout on inactivity.
- [ ] **AUTH-03**: All routes under `/admin/*` are protected using Next.js middleware, redirecting unauthenticated traffic to `/admin/login`.

### Public Website Pages

- [ ] **PUBL-01**: Homepage implementing the 9 specified layout sections in order: Hero, Age-Group Filter, Featured Tours, Why Choose Us, Destination Highlights, Testimonials, Blog Preview, Enquiry/WhatsApp Strip, and Footer.
- [ ] **PUBL-02**: Tours Listing page showing all tour packages with search input, category filters (Spiritual, Trek, Hill Station, Heritage, Beach, Wildlife), duration filters, budget filters, and sorting.
- [ ] **PUBL-03**: Tour Detail page showing dynamic tour summary (duration, group size, difficulty, age suitability, starting price), photo gallery, about rich text, accordion day-by-day itinerary, Leaflet map, pricing table, inclusions/exclusions, and sticky enquiry sidebar.
- [ ] **PUBL-04**: Destinations Page displaying a visual grid of top destinations (Haridwar, Char Dham, Manali, Kedarnath, Rishikesh, Varanasi) with region filtering.
- [ ] **PUBL-05**: Blog Listing page with pagination (10 posts per page) and category filtering.
- [ ] **PUBL-06**: Blog Detail page showing full post content, author bio, social share options, auto-generated Table of Contents, and related tours widget.
- [ ] **PUBL-07**: Static pages (About Us, Contact Us, Privacy Policy, Terms of Use) populated with copy, office address, and embedded maps.

### Age-Group Filtering

- [ ] **FILT-01**: Segmented selector in Homepage Hero and Tours Listing sidebar for traveller profiles (Senior Pilgrims, Families, Youth & Couples, School Groups).
- [ ] **FILT-02**: Tour cards display color-coded age suitability badges (Senior Pilgrims = #D4692A, Families = #0E7C7B, Youth & Couples = Hiker Icon, School Groups = Child Icon).
- [ ] **FILT-03**: Tours Listing page reads URL query parameters (`?ageGroup=...`) to pre-apply appropriate filters on page load.

### Interactive Itinerary Map

- [ ] **IMAP-01**: Leaflet.js map component dynamically imported client-side (no SSR block) on the Tour Detail page utilizing free OpenStreetMap tiles.
- [ ] **IMAP-02**: Map displays numbered circular markers representing day-wise waypoints connected by a polyline route.
- [ ] **IMAP-03**: Clicking a map marker opens a popup detailing the day number, location name, and activity description.

### Lead Capture System

- [ ] **LEAD-01**: Enquiry form (Name, Phone, Travel Date, Group Size, WhatsApp opt-in) on Tour Detail (sticky panel) and Contact pages saving entries to Supabase `enquiries` table.
- [ ] **LEAD-02**: Persistent floating WhatsApp CTA button displayed in the bottom-right corner of all pages across all devices.

### CMS Management

- [ ] **CMSM-01**: Admin dashboard showing summary stats (Total Tours, Published Tours, Blog Posts, Enquiries) and a table of the 10 most recent enquiries.
- [ ] **CMSM-02**: Tours Manager table in admin displaying all tours with options to create, edit, publish/unpublish, and soft-delete.
- [ ] **CMSM-03**: Waypoint Builder table inside the Tour Form allowing admin to add, drag-reorder, and delete itinerary waypoints (day, name, lat, lng, desc) with helper links to find coordinates.
- [ ] **CMSM-04**: Image Uploader supporting drag-and-drop file uploads to Supabase Storage, returning URLs and requiring image Alt tags.
- [ ] **CMSM-05**: Blog Manager table displaying posts with statuses (Draft, Scheduled, Published) and a Tiptap rich-text editor supporting bold, italic, links, images, tables, YouTube embeds, and char counters.
- [ ] **CMSM-06**: Enquiries Manager listing submissions with status updates (New, Contacted, Follow Up, Converted, Closed) and internal notes field.
- [ ] **CMSM-07**: Site Settings editor permitting admin to edit contact details, stats, social links, and SEO defaults.

### SEO & Performance

- [ ] **SEOP-01**: Dynamic meta titles and descriptions managed per tour/blog page using `next-seo`.
- [ ] **SEOP-02**: JSON-LD schema dynamically generated (TouristTrip for Tour Detail, Article for Blog Posts, and LocalBusiness for Homepage).
- [ ] **SEOP-03**: Automatic sitemap.xml and robots.txt generation configured via `next-sitemap`.
- [ ] **SEOP-04**: Maintain PageSpeed Score >= 85 on mobile using Next.js Image Optimization and ISR (Incremental Static Regeneration).

## v2 Requirements

Deferred to future releases.

- **NOTF-01**: Automated WhatsApp/Email alerts (via Resend) to site owner when an enquiry form is submitted.
- **CLDN-01**: Migrate file storage from Supabase Storage to Cloudinary CDN for advanced image compression.
- **LANG-01**: Complete Hindi translation toggle for full bilingual capability across the frontend.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Payment Gateways | Online booking checkout and deposit collection are deferred to Phase 3. |
| Dedicated Mobile Apps | Kept out of scope; a responsive web design satisfies all mobile use cases. |
| Booking Availability Engine | Real-time calendar slot bookings are out of scope for Phase 1. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| CMSM-01 | Phase 1 | Pending |
| CMSM-02 | Phase 1 | Pending |
| CMSM-03 | Phase 1 | Pending |
| CMSM-04 | Phase 1 | Pending |
| CMSM-05 | Phase 1 | Pending |
| CMSM-06 | Phase 1 | Pending |
| CMSM-07 | Phase 1 | Pending |
| PUBL-01 | Phase 2 | Pending |
| PUBL-02 | Phase 2 | Pending |
| PUBL-04 | Phase 2 | Pending |
| FILT-01 | Phase 2 | Pending |
| FILT-02 | Phase 2 | Pending |
| FILT-03 | Phase 2 | Pending |
| PUBL-03 | Phase 3 | Pending |
| IMAP-01 | Phase 3 | Pending |
| IMAP-02 | Phase 3 | Pending |
| IMAP-03 | Phase 3 | Pending |
| LEAD-01 | Phase 3 | Pending |
| LEAD-02 | Phase 3 | Pending |
| PUBL-05 | Phase 4 | Pending |
| PUBL-06 | Phase 4 | Pending |
| PUBL-07 | Phase 4 | Pending |
| SEOP-01 | Phase 4 | Pending |
| SEOP-02 | Phase 4 | Pending |
| SEOP-03 | Phase 4 | Pending |
| SEOP-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-18*
*Last updated: 2026-06-18 after initial definition*
