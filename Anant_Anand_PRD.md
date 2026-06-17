# Anant Anand Tour Packages — Product Requirements Document

**Version 1.0 | June 2026 | Confidential**

Full-Stack Travel Agency Website with Admin CMS

**Prepared for:** Anant Anand Tour Packages  
**Document Type:** PRD + Feature Specification

---

## 1. Project Overview

### 1.1 Executive Summary

Anant Anand Tour Packages is a full-service Indian travel agency that curates journeys for all age groups — from spiritual pilgrimages for senior families to high-altitude treks for youth. The agency's core USP is age-based trip curation, a differentiator absent from most Indian travel websites.

This document specifies the complete product requirements for the agency's public-facing website and its accompanying no-code admin CMS. The website's primary goal is lead capture and trust-building, not online ticketing or payment processing.

### 1.2 Business Objectives

- Capture leads (phone/WhatsApp/enquiry form) from organic search and social traffic
- Rank on Google for pilgrimage, trekking, and family tour keywords in Hindi belt India
- Establish brand credibility through professional design, testimonials, and blog content
- Allow the non-technical owner to independently manage tours, blogs, and site content
- Scale to new destinations and categories without developer involvement

### 1.3 Core USP — Age-Group Based Tour Filtering

The website will prominently feature a trip discovery mechanism based on traveller profile:

| Traveller Profile | Target Age | Tour Types |
|---|---|---|
| Senior Pilgrims | 55+ | Char Dham, Haridwar, Mathura, Varanasi, easy-pace spiritual circuits |
| Families | All ages | Hill stations, religious circuits, heritage sites, short breaks |
| Youth & Couples | 18–35 | Treks, adventure, solo-friendly, romantic hill escapes |
| Kids & Schools | 5–18 | Educational tours, nature camps, river rafting, eco-trips |

The filter will appear on the Tours listing page and the Homepage hero section as a prominent segmented selector.

### 1.4 Document Scope

- Public website: all pages, components, and interactions
- Admin CMS: all management screens, form fields, and workflows
- SEO architecture: meta fields, blog structure, sitemap, schema
- **Out of scope:** payment gateway, booking management system, mobile app

---

## 2. Brand Identity & Design System

### 2.1 Logo & Identity

The Anant Anand logo combines a peacock feather (culture, spirituality), an infinity symbol (endless journeys), and a bansuri flute (Krishna devotion). The dual-script wordmark (English + Devanagari) signals trust to Hindi-speaking audiences.

### 2.2 Colour Palette

| Role | Colour Name | Hex | Usage |
|---|---|---|---|
| Primary | Deep Teal | #0E7C7B | Navbar, CTAs, headings, map markers |
| Accent 1 | Sacred Gold | #C8960C | Highlights, badges, hover states, star ratings |
| Accent 2 | Saffron Orange | #D4692A | Age-group tags, category pills, alerts |
| Dark | Charcoal | #2B2B2B | Body text, footer background |
| Light BG | Warm Cream | #FFF8F0 | Page background, card backgrounds |
| White | Pure White | #FFFFFF | Cards, modals, form fields |

### 2.3 Typography

| Use | Font | Weight | Notes |
|---|---|---|---|
| Display / Hero | Playfair Display | 700 | Google Font — spiritual, premium feel |
| Headings H2–H3 | Poppins | 600 | Clean, modern, readable |
| Body text | Inter | 400 / 500 | Optimal screen legibility |
| Hindi / Devanagari | Tiro Devanagari | 400 | For bilingual labels and taglines |
| Prices & Numbers | Poppins Mono | 600 | Tabular numbers in cards |

### 2.4 Iconography & Imagery

- Icon library: Lucide Icons (open source, consistent stroke weight)
- Age-group icons: custom SVG set — pilgrim, family, hiker, child — used consistently across the site
- Photography: real destination photography preferred; Unsplash/Pexels as placeholders initially
- All images must have WebP format with AVIF fallback for Core Web Vitals performance

---

## 3. Site Architecture & Pages

### 3.1 Navigation Structure

The main navigation will be fixed/sticky with a transparent-to-solid scroll transition on the homepage:

| Nav Item | Path | Type |
|---|---|---|
| Home | / | Page |
| Tours | /tours | Page + Sub-filters |
| Destinations | /destinations | Page |
| About Us | /about | Page |
| Contact Us | /contact | Page |
| Privacy Policy | /privacy-policy | Footer only |
| Terms of Use | /terms-of-use | Footer only |

> **Strategic Note — Blog Intentionally Excluded from Primary Navigation**
>
> The `/blog` and `/blog/[slug]` routes remain fully live and public — they are simply omitted from the header nav and footer link sets. Blog posts are designed to be landed on directly from Google search (long-tail keyword pages), not browsed to via the header. This keeps the header focused purely on the lead-gen conversion path.
>
> Discoverability is handled by: the auto-generated XML sitemap submitted to Google Search Console, the Homepage Blog Preview section, and Related Posts / Related Tours widgets. The Blog Manager in admin still creates/edits/publishes posts normally.

### 3.2 Page Specifications

#### 3.2.1 Homepage (/)

The homepage is the primary conversion surface. It must establish trust immediately and funnel users into tour discovery.

Sections in order:

1. **Hero Section** — Full-width cinematic image/video with animated headline, tagline in English + Hindi, and the Age-Group Trip Finder widget as primary CTA
2. **Age-Group Quick Filter Strip** — 4 icon cards (Senior Pilgrims / Families / Youth & Couples / School Groups) linking to filtered tours
3. **Featured Tours** — Horizontal scroll card grid, 6 curated tours with price badge, duration, and age-tag chips
4. **Why Choose Us** — 4 trust pillars: Years of Experience, Tours Completed, Happy Families, Destinations Covered
5. **Destination Highlights** — Visual grid of top destinations (Haridwar, Char Dham, Manali, Kedarnath, Rishikesh, Varanasi etc.) with click-through to filtered tours
6. **Testimonials** — Carousel of customer reviews with star rating, name, tour taken, and photo
7. **Blog Preview** — 3 latest blog cards with thumbnail, title, date, and read-more link
8. **Enquiry Strip / WhatsApp Banner** — Sticky bottom bar on mobile + inline section on desktop with phone, WhatsApp, and form link
9. **Footer** — Logo, nav links, social icons, Privacy Policy, Terms of Use, copyright

#### 3.2.2 Tours Listing Page (/tours)

This is the core product page. It displays all available tour packages with powerful filtering.

**Filter Panel** (sidebar on desktop, bottom drawer on mobile):

- Age Group: Senior Pilgrims | Families | Youth & Couples | School Groups | All
- Category: Spiritual / Pilgrimage | Trek & Adventure | Hill Station | Heritage | Beach | Wildlife
- Duration: 1–3 Days | 4–6 Days | 7–10 Days | 10+ Days
- Budget: Under ₹5,000 | ₹5,000–₹15,000 | ₹15,000–₹30,000 | ₹30,000+
- Sort By: Popularity | Price Low–High | Price High–Low | Newest | Duration

**Tour Card** (each card shows):

- Hero image with age-group badge overlay (colour-coded)
- Tour name, destination, duration badge
- Category tag chip (Spiritual / Trek / Hill etc.)
- Starting price per person with 'per person' label
- Star rating (if testimonials exist)
- 'View Details' CTA button

#### 3.2.3 Tour Detail Page (/tours/[slug])

Each tour gets a rich dedicated page designed to build desire and convert to an enquiry.

Page Sections:

1. **Photo Gallery** — Full-width hero with thumbnail strip below
2. **Tour Summary Bar** — Duration, Group Size, Difficulty, Age Suitability, Starting Price
3. **About This Tour** — Rich text description
4. **Interactive Itinerary Map** — Day-wise route map built from admin-defined waypoints (see Section 4.4)
5. **Day-by-Day Itinerary** — Accordion with day title, locations visited, meals, accommodation tier
6. **Inclusions / Exclusions** — Two-column checklist
7. **Pricing Table** — Group size tiers (Solo / Couple / Group 4+ / Group 10+)
8. **Important Notes** — Cancellation policy, what to carry, fitness requirements
9. **Similar Tours** — 3-card related tours widget
10. **Sticky Enquiry Panel** — Fixed right sidebar on desktop: 'Book Now / Get Quote' form with Name, Phone, Travel Date, Group Size, WhatsApp opt-in

#### 3.2.4 Blog Listing Page (/blog)

- Grid of blog cards: featured image, title, excerpt, author, date, read-time, category tags
- Filter/search by category (Travel Tips | Pilgrimage Guides | Trekking | Destinations | Seasonal)
- Pagination (10 posts per page)
- 'Popular Posts' sidebar widget

#### 3.2.5 Blog Detail Page (/blog/[slug])

- Full SEO-optimised article with structured heading hierarchy (H1 → H2 → H3)
- Author bio box, publish date, last updated date
- Social share buttons (WhatsApp, Facebook, Twitter/X, Copy Link)
- Table of Contents (auto-generated from headings)
- Related Tours widget (matching blog category to tour category)
- Related Posts section at bottom
- Schema markup: Article + BreadcrumbList

#### 3.2.6 About Us Page (/about)

- Agency story, founder message, team photos
- Timeline of milestones
- Trust badges: registered, insured, years active
- Gallery of past trips

#### 3.2.7 Contact Us Page (/contact)

- Enquiry form: Name, Email, Phone, Destination of Interest, Travel Dates, Group Size, Message
- WhatsApp direct chat CTA (pre-filled message)
- Office address with embedded Google Map
- Phone number with click-to-call
- Social media links

#### 3.2.8 Destinations Page (/destinations)

- Visual grid of all destinations, each linking to a filtered tours listing
- Region filter: North India | South India | East India | West India | International

#### 3.2.9 Legal Pages

- **Privacy Policy** (`/privacy-policy`) — GDPR/Indian IT Act compliant, covers form data, cookies, third-party tools
- **Terms of Use** (`/terms-of-use`) — booking terms, cancellation policy, liability, IP ownership

---

## 4. Functional Requirements

### 4.1 Lead Capture System

The website is lead-focused, not transactional. Every page must have at least one lead capture mechanism:

- Sticky WhatsApp button (bottom-right, all pages, all devices)
- Enquiry forms: Homepage, Tour Detail page (sticky sidebar), Contact page
- Form fields stored in Supabase `enquiries` table
- On form submit: show success message + trigger WhatsApp/email notification to owner
- No payment gateway required in Phase 1

**Form Submission Flow:**

1. User fills enquiry form on any page
2. Client-side validation (required fields, phone format, date validation)
3. POST to Supabase via Supabase JS client
4. Success toast shown to user
5. Owner receives WhatsApp message via Twilio/WATI or email via Resend (Phase 2 optional)

### 4.2 Age-Based Filtering System

This is the primary USP feature and must be implemented with high visual priority:

- Four age-group categories stored as enum in Supabase: `senior | family | youth | school`
- Each tour can have multiple age-group tags
- Homepage hero contains an 'I am travelling as...' segmented pill selector
- Selecting a group instantly navigates to `/tours?ageGroup=senior` (or relevant value)
- Tours listing page reads URL query params and pre-applies filters on load
- Age-group badge overlaid on all tour cards (colour-coded by group)

### 4.3 Tour Management

Tours are the core data entity. Key functional requirements:

- Tours must be creatable, editable, and unpublishable entirely from the Admin Panel
- Slug auto-generated from tour name (editable by admin)
- Tours can be featured (appear in Homepage featured grid)
- Tours can be soft-deleted (hidden from site, kept in DB)
- Image uploads handled via Supabase Storage with automatic resizing (Phase 2: Cloudinary)

### 4.4 Interactive Itinerary Map

This is a key differentiator feature on the Tour Detail page. Each tour has a custom day-wise route map:

- Map rendered using Leaflet.js (open source, no API cost) with OpenStreetMap tiles
- Admin enters each stop as: Day Number, Location Name, Latitude, Longitude, Description
- Map displays numbered markers per day with connecting polyline route
- Clicking a marker shows a popup with day info and activity description
- On mobile: map is collapsible to avoid dominating the viewport
- Admin map builder: simple table in admin panel where rows = waypoints; drag to reorder

### 4.5 Blog & SEO System

The blog is the primary SEO growth engine. It must support full editorial control:

- Rich text editor (Tiptap) with heading styles, bold/italic, links, images, ordered/unordered lists, blockquotes, code blocks
- Per-post SEO fields: Meta Title (60 char limit indicator), Meta Description (160 char limit indicator), Focus Keyword, Canonical URL
- Open Graph fields: OG Title, OG Description, OG Image
- Schema type selector: Article | TravelGuide | FAQ | HowTo
- Auto-generated Table of Contents from H2/H3 headings
- Post status: Draft | Scheduled | Published
- Schedule publish: date/time picker for future posts
- Estimated read time: auto-calculated (200 wpm)
- Category and tag assignment
- Related tours linking: select tours to show at bottom of post

### 4.6 Site-Wide SEO Implementation

| SEO Element | Implementation | Managed By |
|---|---|---|
| Page Title Tags | Dynamic per page, template-based | Admin CMS (per tour/blog) |
| Meta Descriptions | Admin-editable per page | Admin CMS |
| Canonical URLs | Auto-set, overrideable | Auto |
| OG / Twitter Cards | Full og:image, og:title support | Admin CMS |
| JSON-LD Schema | TourPackage, Article, LocalBusiness, FAQ | Auto-generated |
| Sitemap | Auto-generated XML sitemap (next-sitemap) | Auto |
| Robots.txt | Managed in repo | Developer |
| Image Alt Tags | Required field in admin for all images | Admin CMS |
| URL Structure | SEO-friendly slugs: `/tours/char-dham-yatra-12-days` | Admin CMS |
| Page Speed | Next.js Image, lazy load, WebP, ISR/SSG | Developer |
| Breadcrumbs | Schema-marked on all deep pages | Auto |

### 4.7 Performance Requirements

- Google PageSpeed Score: ≥ 85 on mobile, ≥ 95 on desktop
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID/INP < 200ms
- All images served as WebP with lazy loading
- Homepage: Static generation (SSG) with ISR revalidation every 10 minutes
- Tour detail & blog pages: ISR with 5-minute revalidation

---

## 5. Admin Panel Requirements

### 5.1 Overview

The Admin Panel is a separate, password-protected web application hosted at `/admin`. It requires zero coding knowledge to use. The owner must be able to manage all content through visual forms and button clicks.

### 5.2 Authentication

- Single admin login (email + password) via Supabase Auth
- Session persists for 7 days; auto-logout on inactivity
- All admin routes protected by middleware — unauthorized access redirects to `/admin/login`
- No public registration — owner account created once at setup

### 5.3 Admin Panel Sections

#### Dashboard

- Summary cards: Total Tours, Published Tours, Total Blogs, Total Enquiries (this month)
- Recent enquiries table (last 10) with Name, Phone, Tour Interest, Date
- Quick actions: + New Tour, + New Blog Post

#### Tours Manager

- Table: all tours with Name, Category, Age Groups, Status, Created Date, Actions (Edit/Delete/View)
- Search and filter by status/category
- New Tour Form — all fields in Section 6.1
- Itinerary Map Builder — visual waypoint table (see Section 4.4)
- Image uploader with drag-and-drop, reorder, alt-tag field
- Publish / Unpublish toggle

#### Blog Manager

- Table: all posts with Title, Status, Category, Date, Actions
- New/Edit Post Form with all SEO fields:
  - Post Title
  - Slug (auto-generated, editable)
  - Featured Image + Alt Text
  - Category (dropdown) + Tags (multi-select or comma input)
  - Author Name + Author Bio (optional)
  - Rich Text Body (Tiptap editor with toolbar)
  - SEO Tab: Meta Title (char counter), Meta Description (char counter), Focus Keyword, OG Image
  - Schema Type selector
  - Related Tours selector (multi-select)
  - Publish Date/Time + Status (Draft/Scheduled/Published)

#### Enquiries Manager

- Full table of all enquiries with filters (date range, tour interest, status)
- Click to expand: full enquiry details
- Mark as Contacted / Follow-up / Converted
- Export to CSV

#### Site Settings

Non-technical owner can edit site-wide content without touching code:

- Agency Info: Name, Tagline, Phone, WhatsApp Number, Email, Address
- Hero Section: Headline, Subheadline, Background Image/Video URL
- Why Choose Us: 4 stats (Tours Done, Years, Destinations, Families)
- Social Links: Facebook, Instagram, YouTube, WhatsApp
- Footer Content: About text, copyright year
- SEO Defaults: Site Meta Title, Site Meta Description, Default OG Image
- Contact Page: Map embed URL, Office hours

#### Destinations Manager

- Add/edit destination cards (name, region, image, description, slug)
- Destinations appear on `/destinations` page and as filter options

---

## 6. Data Models

### 6.1 Tours Table (tours)

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key, auto-generated |
| title | TEXT | Tour name, required |
| slug | TEXT UNIQUE | URL slug, auto-generated from title |
| description | TEXT | Rich text / Markdown body |
| short_description | TEXT | 150-char summary for cards |
| category | ENUM | spiritual │ trek │ hill_station │ heritage │ beach │ wildlife |
| age_groups | TEXT[] | Array: senior │ family │ youth │ school |
| duration_days | INTEGER | Number of days |
| duration_nights | INTEGER | Number of nights |
| price_per_person | NUMERIC | Starting price in INR |
| pricing_tiers | JSONB | { solo, couple, group4, group10 } pricing |
| difficulty | ENUM | easy │ moderate │ challenging |
| max_group_size | INTEGER | Max travellers per batch |
| destinations | TEXT[] | List of destination names |
| inclusions | TEXT[] | What is included |
| exclusions | TEXT[] | What is excluded |
| itinerary | JSONB | Array of { day, title, description, locations[] } |
| waypoints | JSONB | Array of { day, name, lat, lng, description } |
| images | JSONB | Array of { url, alt } |
| hero_image | TEXT | Primary image URL |
| is_featured | BOOLEAN | Show on homepage |
| is_published | BOOLEAN | Visible on site |
| meta_title | TEXT | SEO: page title |
| meta_description | TEXT | SEO: meta description |
| og_image | TEXT | SEO: Open Graph image |
| rating | NUMERIC | Average rating (computed) |
| review_count | INTEGER | Number of reviews |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto, trigger-updated |

### 6.2 Blog Posts Table (blog_posts)

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | TEXT | Post title |
| slug | TEXT UNIQUE | URL slug |
| content | TEXT | HTML from Tiptap editor |
| excerpt | TEXT | Manual or auto-extracted summary |
| featured_image | TEXT | Image URL |
| featured_image_alt | TEXT | Alt text for featured image |
| author_name | TEXT | Author display name |
| author_bio | TEXT | Short bio (optional) |
| category | TEXT | Post category |
| tags | TEXT[] | Array of tags |
| status | ENUM | draft │ scheduled │ published |
| published_at | TIMESTAMPTZ | Publish date/time |
| meta_title | TEXT | SEO title |
| meta_description | TEXT | SEO description |
| focus_keyword | TEXT | Primary SEO keyword |
| og_image | TEXT | Open Graph image |
| og_title | TEXT | Open Graph title |
| og_description | TEXT | Open Graph description |
| schema_type | TEXT | Article │ TravelGuide │ FAQ │ HowTo |
| canonical_url | TEXT | Override canonical (optional) |
| read_time_minutes | INTEGER | Auto-calculated |
| related_tour_ids | UUID[] | Linked tours |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

### 6.3 Enquiries Table (enquiries)

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | TEXT | Full name |
| email | TEXT | Email address |
| phone | TEXT | Mobile number (Indian format) |
| tour_id | UUID nullable | Tour they enquired about |
| tour_name | TEXT | Tour name (denormalized for display) |
| travel_date | DATE | Preferred travel date |
| group_size | INTEGER | Number of travellers |
| message | TEXT | Free text message |
| whatsapp_opt_in | BOOLEAN | Agreed to WhatsApp contact |
| source_page | TEXT | Which page form was submitted from |
| status | ENUM | new │ contacted │ follow_up │ converted │ closed |
| notes | TEXT | Admin internal notes |
| created_at | TIMESTAMPTZ | Auto |

### 6.4 Site Settings Table (site_settings)

| Field | Type | Notes |
|---|---|---|
| id | INTEGER | Always 1 (single row) |
| agency_name | TEXT | Display name |
| tagline | TEXT | Site tagline |
| phone | TEXT | Primary contact |
| whatsapp_number | TEXT | WhatsApp number with country code |
| email | TEXT | Contact email |
| address | TEXT | Office address |
| hero_headline | TEXT | Homepage hero headline |
| hero_subheadline | TEXT | Homepage hero subheadline |
| hero_bg_url | TEXT | Background image/video URL |
| stat_tours | INTEGER | Tours completed count |
| stat_years | INTEGER | Years in business |
| stat_destinations | INTEGER | Destinations count |
| stat_families | INTEGER | Families served count |
| social_facebook | TEXT | Facebook URL |
| social_instagram | TEXT | Instagram URL |
| social_youtube | TEXT | YouTube URL |
| footer_about | TEXT | Footer about text |
| site_meta_title | TEXT | Default site meta title |
| site_meta_description | TEXT | Default meta description |
| default_og_image | TEXT | Default OG image URL |
| map_embed_url | TEXT | Google Maps embed for contact page |
| updated_at | TIMESTAMPTZ | Last updated |

---

## 7. Key User Journeys

### 7.1 Pilgrim Discovery Journey (Senior User)

1. Lands on homepage via Google search 'Char Dham yatra package from Delhi'
2. Sees 'Senior Pilgrims' age-group card in the filter strip — clicks it
3. Tours page loads pre-filtered to spiritual tours for seniors
4. Browses cards, clicks 'Char Dham Yatra – 12 Days'
5. Reads itinerary, sees the day-wise map, reads inclusions
6. Clicks 'Get a Free Quote' in sticky sidebar
7. Fills name, phone, travel date, group size → submits
8. Owner receives notification, calls back within the hour

### 7.2 Youth Trek Discovery Journey

1. Clicks Instagram story → lands on homepage
2. Selects 'Youth & Couples' chip → filtered to treks and hill stations
3. Taps 'Kedarnath Base Camp Trek – 6 Days'
4. Scrolls through gallery and day-wise map, checks difficulty badge (Moderate)
5. Taps WhatsApp sticky button → opens pre-filled WhatsApp chat

### 7.3 Admin Content Creation Journey

1. Owner logs in to `/admin` with email and password
2. Clicks 'Tours' → '+ New Tour'
3. Fills all form fields: title, description, category, age groups, price, duration
4. Uploads images via drag-and-drop
5. Adds itinerary waypoints in the map builder table (Day, Location, Lat, Lng, Description)
6. Previews the tour page
7. Clicks 'Publish' → tour appears live on the website

---

## 8. Non-Functional Requirements

### 8.1 Mobile-First Design

- All pages designed mobile-first; desktop is an enhancement
- Touch targets ≥ 44px, no hover-only interactions
- Sticky WhatsApp CTA always visible on mobile
- Tour filters collapse into a bottom drawer on mobile

### 8.2 Accessibility

- WCAG 2.1 AA compliance: colour contrast, focus rings, ARIA labels
- All images have descriptive alt text (enforced in admin)
- Forms have visible labels and error messages

### 8.3 Security

- All admin routes protected by Supabase Auth middleware
- Row Level Security (RLS) on Supabase: public can only read published content
- Form inputs sanitised server-side to prevent XSS/injection
- Environment variables for all secrets (never in client bundle)

### 8.4 Scalability

- ISR (Incremental Static Regeneration) allows unlimited tours/blogs with no rebuild cost
- Supabase free tier supports up to 500MB DB, 1GB storage — sufficient for Phase 1
- Architecture supports adding payment gateway, user accounts, and booking system in Phase 2

---

## 9. Phased Delivery Plan

| Phase | Deliverables | Timeline |
|---|---|---|
| Phase 1 — Core | Next.js site, all pages, Supabase schema, Admin panel, Tour management, Blog management, Lead capture forms, Static SEO setup, Vercel deployment | 6–8 weeks |
| Phase 2 — Growth | WhatsApp/email notifications on enquiry, Blog category pages, Destination detail pages, Sitemap auto-generation, Image CDN (Cloudinary), Google Analytics 4 + Search Console setup | 2–3 weeks after Phase 1 |
| Phase 3 — Scale | User reviews/ratings, Tour comparison tool, Payment integration (Razorpay) for deposits, Multi-language (Hindi) support, PWA / mobile app shell | TBD based on traction |

---

## 10. Acceptance Criteria

- [ ] Owner can log in to admin panel and publish a new tour without developer help
- [ ] Owner can write and publish a full SEO blog post with meta fields, OG image, and schema type
- [ ] Tour detail page shows interactive day-wise map with correct markers from admin input
- [ ] Age-group filter on tours page works correctly for all four groups
- [ ] Enquiry form submits successfully and data appears in admin enquiries table
- [ ] WhatsApp sticky button appears on all pages on mobile
- [ ] Homepage loads in < 3 seconds on a 4G connection
- [ ] All tour and blog pages have correct meta title, meta description, and OG image
- [ ] Privacy Policy and Terms of Use are accessible from the footer on every page
- [ ] Admin login is inaccessible to unauthenticated users
- [ ] Google PageSpeed score ≥ 85 on mobile for homepage

---

*End of Product Requirements Document*

Anant Anand Tour Packages • Version 1.0 • June 2026 • Confidential — Internal Use Only
