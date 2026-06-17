# Anant Anand Tour Packages — Tech Stack & Architecture Blueprint

**Version 1.0 | June 2026 | Confidential**

Next.js 14 + Supabase + Vercel Stack  
**Full-Stack Web App + No-Code Admin CMS**

Hosting: Vercel (free tier) • Database: Supabase (free tier)

---

## 1. Technology Stack Overview

### 1.1 Stack Decision Rationale

The selected stack is optimised for three constraints: zero hosting cost (Vercel + Supabase free tiers), non-technical admin usability, and strong SEO performance (server-rendered pages for Google indexing).

| Layer | Technology | Version | Reason for Choice |
|---|---|---|---|
| Frontend Framework | Next.js | 14 (App Router) | SSG/ISR for SEO, file-based routing, API routes built-in |
| UI Styling | Tailwind CSS | 3.x | Utility-first, fast iteration, responsive out of the box |
| Component Library | shadcn/ui | Latest | Accessible, unstyled-then-themed, no bundle bloat |
| Rich Text Editor | Tiptap | 2.x | ProseMirror-based, extensible, React-native, free |
| Map Library | Leaflet.js | 1.9 | Open source, no API key, OpenStreetMap tiles = zero cost |
| Database | Supabase (PostgreSQL) | Latest | Free tier, RLS, Auth, Storage, Realtime, REST API |
| Auth | Supabase Auth | Built-in | Email/password for admin, no extra service needed |
| File Storage | Supabase Storage | Built-in | Images, 1GB free; can migrate to Cloudinary in Phase 2 |
| Deployment | Vercel | Free Hobby | Git-push deploy, Edge Network CDN, ISR support |
| Email (Phase 2) | Resend | Free tier | Transactional email for enquiry notifications |
| Analytics | Google Analytics 4 | Free | Traffic tracking, Search Console integration |
| SEO Meta | next-seo | 6.x | Centralised meta, OG, JSON-LD management |
| Sitemap | next-sitemap | 4.x | Auto-generates sitemap.xml on every build |
| Form Handling | React Hook Form + Zod | Latest | Type-safe form validation, zero dependencies |
| State Management | Zustand | 4.x | Lightweight client state for filters; no Redux overhead |
| Icons | Lucide React | Latest | Open source, tree-shakeable, consistent stroke style |
| Fonts | Google Fonts (next/font) | Built-in | Playfair Display, Poppins, Inter, Tiro Devanagari |
| Date Handling | date-fns | 3.x | Lightweight, tree-shakeable, no Moment.js bloat |
| Slug Generation | slugify | Latest | Consistent URL slug generation from tour/post titles |
| Image Optimisation | next/image | Built-in | WebP conversion, lazy load, blur placeholder |

### 1.2 Why Not Alternatives

| Alternative | Reason Not Chosen |
|---|---|
| WordPress + Elementor | Poor Core Web Vitals, plugin bloat, PHP hosting cost, weak React ecosystem |
| Gatsby.js | Build time grows with content; ISR in Next.js is superior for a CMS-driven site |
| Wix / Squarespace | No custom age-group filter, no custom itinerary map, no headless CMS control |
| Create React App | No SSR/SSG — Google cannot crawl JS-only SPA content effectively |
| Firebase | More complex RLS, worse SQL querying; Supabase is simpler for relational data |
| Prisma + PlanetScale | Additional complexity; Supabase client is sufficient for this scale |

---

## 2. System Architecture

### 2.1 High-Level Architecture

The system has two distinct applications that share the same Supabase backend:

| Application | URL | Users | Tech |
|---|---|---|---|
| Public Website | anantanandtourpackage.in | Visitors / Travellers | Next.js 14, Tailwind, Leaflet |
| Admin CMS | anantanandtourpackage.in/admin | Site Owner Only | Next.js 14, shadcn/ui, Tiptap |
| Backend / DB | Supabase Cloud | Both apps | PostgreSQL, Auth, Storage, Edge Functions |
| CDN / Hosting | Vercel Edge Network | All users | Global edge deployment |

### 2.2 Request Flow Architecture

**Static & ISR pages (SEO critical):**

1. User browser requests `/tours/char-dham-yatra`
2. Vercel Edge checks if cached ISR page exists and is fresh (< 5 min)
3. If fresh: serve cached HTML instantly (< 50ms TTFB)
4. If stale: serve stale while regenerating in background from Supabase
5. Next.js server fetches tour data from Supabase REST API
6. Page HTML rendered with full meta tags, JSON-LD, and content
7. Cached at Vercel Edge for next requests

**Dynamic / interactive actions (filters, forms):**

1. User applies age-group filter on `/tours` page
2. Client-side Zustand state updates URL params (`?ageGroup=senior`)
3. Supabase JS client queries filtered tours directly from browser
4. React re-renders tour grid with new results (no page reload)

### 2.3 Folder Structure

The project follows Next.js 14 App Router conventions:

```
anant-anand/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public site route group
│   │   ├── page.tsx              # Homepage /
│   │   ├── tours/
│   │   │   ├── page.tsx          # /tours listing
│   │   │   └── [slug]/page.tsx   # /tours/[slug] detail
│   │   ├── blog/
│   │   │   ├── page.tsx          # /blog listing
│   │   │   └── [slug]/page.tsx   # /blog/[slug] detail
│   │   ├── destinations/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   └── terms-of-use/page.tsx
│   ├── admin/                    # Admin CMS route group
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── tours/
│   │   │   ├── page.tsx          # Tours table
│   │   │   ├── new/page.tsx      # Create tour
│   │   │   └── [id]/edit/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx          # Posts table
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── enquiries/page.tsx
│   │   ├── destinations/page.tsx
│   │   └── settings/page.tsx
│   └── api/                      # API Routes
│       ├── enquiries/route.ts    # POST: submit enquiry
│       └── revalidate/route.ts   # On-demand ISR revalidation
├── components/
│   ├── public/                   # Public site components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── AgeGroupFilter.tsx    # USP filter widget
│   │   ├── TourCard.tsx
│   │   ├── TourFilters.tsx
│   │   ├── ItineraryMap.tsx      # Leaflet map component
│   │   ├── EnquiryForm.tsx
│   │   ├── WhatsAppButton.tsx
│   │   └── BlogCard.tsx
│   └── admin/                    # Admin CMS components
│       ├── AdminNav.tsx
│       ├── TourForm.tsx
│       ├── WaypointBuilder.tsx   # Map waypoint editor
│       ├── RichTextEditor.tsx    # Tiptap wrapper
│       ├── SEOFields.tsx         # Reusable SEO form section
│       ├── ImageUploader.tsx
│       └── EnquiryTable.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client (RSC)
│   │   └── queries/              # Typed query functions
│   │       ├── tours.ts
│   │       ├── blog.ts
│   │       └── settings.ts
│   ├── seo/
│   │   ├── generateMeta.ts       # Meta tag generator
│   │   └── schema.ts             # JSON-LD generators
│   └── utils.ts                  # slugify, formatPrice, etc.
├── types/
│   └── index.ts                  # TypeScript types (Tour, Post etc.)
├── public/
│   ├── logo.png
│   └── og-default.jpg
├── middleware.ts                  # Auth guard for /admin routes
├── next.config.js
├── next-sitemap.config.js
└── tailwind.config.ts
```

---

## 3. Database Architecture (Supabase / PostgreSQL)

### 3.1 Schema Setup SQL

Run these migrations in order in the Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tours ──────────────────────────────────────────────
CREATE TYPE tour_category AS ENUM
  ('spiritual','trek','hill_station','heritage','beach','wildlife');
CREATE TYPE difficulty_level AS ENUM ('easy','moderate','challenging');

CREATE TABLE tours (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description      TEXT,
  short_description TEXT,
  category         tour_category NOT NULL,
  age_groups       TEXT[] DEFAULT '{}',
  duration_days    INTEGER NOT NULL,
  duration_nights  INTEGER NOT NULL,
  price_per_person NUMERIC(10,2) NOT NULL,
  pricing_tiers    JSONB DEFAULT '{}',
  difficulty       difficulty_level DEFAULT 'easy',
  max_group_size   INTEGER,
  destinations     TEXT[] DEFAULT '{}',
  inclusions       TEXT[] DEFAULT '{}',
  exclusions       TEXT[] DEFAULT '{}',
  itinerary        JSONB DEFAULT '[]',
  waypoints        JSONB DEFAULT '[]',
  images           JSONB DEFAULT '[]',
  hero_image       TEXT,
  is_featured      BOOLEAN DEFAULT FALSE,
  is_published     BOOLEAN DEFAULT FALSE,
  meta_title       TEXT,
  meta_description TEXT,
  og_image         TEXT,
  rating           NUMERIC(3,2),
  review_count     INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Blog Posts ──────────────────────────────────────────
CREATE TYPE post_status AS ENUM ('draft','scheduled','published');

CREATE TABLE blog_posts (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                TEXT NOT NULL,
  slug                 TEXT UNIQUE NOT NULL,
  content              TEXT,
  excerpt              TEXT,
  featured_image       TEXT,
  featured_image_alt   TEXT,
  author_name          TEXT DEFAULT 'Anant Anand Team',
  author_bio           TEXT,
  category             TEXT,
  tags                 TEXT[] DEFAULT '{}',
  status               post_status DEFAULT 'draft',
  published_at         TIMESTAMPTZ,
  meta_title           TEXT,
  meta_description     TEXT,
  focus_keyword        TEXT,
  og_image             TEXT,
  og_title             TEXT,
  og_description       TEXT,
  schema_type          TEXT DEFAULT 'Article',
  canonical_url        TEXT,
  read_time_minutes    INTEGER,
  related_tour_ids     UUID[] DEFAULT '{}',
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── Enquiries ───────────────────────────────────────────
CREATE TYPE enquiry_status AS ENUM
  ('new','contacted','follow_up','converted','closed');

CREATE TABLE enquiries (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  email          TEXT,
  phone          TEXT NOT NULL,
  tour_id        UUID REFERENCES tours(id) ON DELETE SET NULL,
  tour_name      TEXT,
  travel_date    DATE,
  group_size     INTEGER,
  message        TEXT,
  whatsapp_opt_in BOOLEAN DEFAULT FALSE,
  source_page    TEXT,
  status         enquiry_status DEFAULT 'new',
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Site Settings (single row) ────────────────────────────
CREATE TABLE site_settings (
  id                   INTEGER PRIMARY KEY DEFAULT 1,
  agency_name          TEXT DEFAULT 'Anant Anand Tour Packages',
  tagline              TEXT,
  phone                TEXT,
  whatsapp_number      TEXT,
  email                TEXT,
  address              TEXT,
  hero_headline        TEXT,
  hero_subheadline     TEXT,
  hero_bg_url          TEXT,
  stat_tours           INTEGER DEFAULT 0,
  stat_years           INTEGER DEFAULT 0,
  stat_destinations    INTEGER DEFAULT 0,
  stat_families        INTEGER DEFAULT 0,
  social_facebook      TEXT,
  social_instagram     TEXT,
  social_youtube       TEXT,
  footer_about         TEXT,
  site_meta_title      TEXT,
  site_meta_description TEXT,
  default_og_image     TEXT,
  map_embed_url        TEXT,
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO site_settings (id) VALUES (1); -- seed single row

-- ── Destinations ────────────────────────────────────────
CREATE TABLE destinations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  region      TEXT,
  description TEXT,
  image       TEXT,
  image_alt   TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auto-update trigger ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW(); RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3.2 Row Level Security (RLS) Policy

RLS ensures the public can only read published content, while the admin can read/write everything:

```sql
-- Enable RLS on all tables
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- PUBLIC: read only published tours
CREATE POLICY "public_read_published_tours" ON tours
  FOR SELECT TO anon
  USING (is_published = TRUE);

-- PUBLIC: read only published blog posts
CREATE POLICY "public_read_published_posts" ON blog_posts
  FOR SELECT TO anon
  USING (status = 'published' AND published_at <= NOW());

-- PUBLIC: read site settings
CREATE POLICY "public_read_settings" ON site_settings
  FOR SELECT TO anon USING (TRUE);

-- PUBLIC: read destinations
CREATE POLICY "public_read_destinations" ON destinations
  FOR SELECT TO anon USING (TRUE);

-- PUBLIC: insert enquiries (form submissions)
CREATE POLICY "public_insert_enquiries" ON enquiries
  FOR INSERT TO anon WITH CHECK (TRUE);

-- ADMIN (authenticated): full access to all tables
CREATE POLICY "admin_all_tours" ON tours
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_all_posts" ON blog_posts
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_all_enquiries" ON enquiries
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_all_settings" ON site_settings
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_all_destinations" ON destinations
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
```

### 3.3 Supabase Storage Buckets

| Bucket Name | Public? | Used For | Size Limit |
|---|---|---|---|
| tour-images | Yes | Tour hero & gallery images | 5MB per file |
| blog-images | Yes | Blog featured & inline images | 3MB per file |
| destination-images | Yes | Destination card images | 3MB per file |
| site-assets | Yes | Logo, OG images, hero backgrounds | 10MB per file |

---

## 4. SEO Architecture

### 4.1 Rendering Strategy by Page

| Page | Strategy | Revalidation | Reason |
|---|---|---|---|
| Homepage / | ISR | 600s (10 min) | Dynamic featured tours, static-like traffic |
| Tours Listing /tours | SSR | Per request | Filters are dynamic, query-param driven |
| Tour Detail /tours/[slug] | ISR | 300s (5 min) | SEO critical, changes infrequently |
| Blog Listing /blog | ISR | 300s (5 min) | New posts don't need instant appear |
| Blog Detail /blog/[slug] | ISR | 300s (5 min) | SEO critical, most traffic lands here |
| Static Pages | SSG | Build time only | About, Contact, Privacy, Terms |
| Admin /admin/* | SSR (no cache) | Always fresh | Real-time data for admin |

### 4.2 JSON-LD Schema Implementation

Every page type outputs appropriate structured data for Google rich results:

```typescript
// lib/seo/schema.ts

// Tour Detail Page → TouristTrip schema
export function tourSchema(tour: Tour) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.short_description,
    url: `https://anantanand.com/tours/${tour.slug}`,
    image: tour.hero_image,
    offers: {
      '@type': 'Offer',
      price: tour.price_per_person,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Anant Anand Tour Packages',
      url: 'https://anantanand.com',
    }
  };
}

// Blog Post → Article schema
export function articleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': post.schema_type || 'Article',
    headline: post.title,
    description: post.meta_description,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author_name },
    publisher: {
      '@type': 'Organization',
      name: 'Anant Anand Tour Packages',
      logo: { '@type': 'ImageObject', url: 'https://anantanand.com/logo.png' }
    }
  };
}

// Homepage → LocalBusiness schema
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Anant Anand Tour Packages',
  url: 'https://anantanand.com',
  telephone: '+91-XXXXXXXXXX',
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  sameAs: ['https://facebook.com/anantanand', 'https://instagram.com/anantanand']
};
```

### 4.3 Sitemap Configuration

```javascript
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://anantanand.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/admin/login'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://anantanand.com/sitemap-tours.xml'],
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin' }
    ]
  },
  transform: async (config, path) => ({
    loc: path,
    changefreq: path.startsWith('/tours/') ? 'weekly'
               : path.startsWith('/blog/') ? 'weekly' : 'monthly',
    priority: path === '/' ? 1.0
            : path.startsWith('/tours/') ? 0.9
            : path.startsWith('/blog/') ? 0.8 : 0.6,
    lastmod: new Date().toISOString(),
  })
};
```

---

## 5. Authentication & Middleware

### 5.1 Admin Auth Flow

1. Owner visits `/admin/login`
2. Submits email + password to Supabase Auth
3. Supabase returns session token; stored in secure HTTP-only cookie
4. `middleware.ts` intercepts all `/admin/*` requests
5. Supabase server client checks session validity from cookie
6. Invalid session → redirect to `/admin/login`
7. Valid session → request proceeds to admin page

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }
  return res;
}

export const config = {
  matcher: ['/admin/:path*']
};
```

---

## 6. Key Component Specifications

### 6.1 Age-Group Filter Component

The primary USP component. Appears in the homepage hero and as a sidebar filter on `/tours`.

```typescript
// components/public/AgeGroupFilter.tsx
const AGE_GROUPS = [
  { id: 'senior',  label: 'Senior Pilgrims', icon: '🙏', color: 'orange',
    desc: '55+ │ Spiritual & Comfortable Pace' },
  { id: 'family',  label: 'Families',        icon: '👨‍👩‍👧', color: 'teal',
    desc: 'All Ages │ Hill Stations & Heritage' },
  { id: 'youth',   label: 'Youth & Couples', icon: '🏔️', color: 'green',
    desc: '18–35 │ Treks & Adventure' },
  { id: 'school',  label: 'School Groups',   icon: '🎒', color: 'purple',
    desc: '5–18 │ Educational & Nature' },
];
// On click: router.push(`/tours?ageGroup=${id}`)
// Active state: highlighted border + background
// Colour-coded badges appear on all tour cards matching the group
```

### 6.2 Itinerary Map Component

Client-side only component (no SSR — Leaflet requires `window`). Uses dynamic import with `ssr: false`.

```typescript
// components/public/ItineraryMap.tsx
// Loaded via: dynamic(() => import('./ItineraryMap'), { ssr: false })

type Waypoint = {
  day: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
};

// Renders:
// 1. Leaflet map centred on midpoint of all waypoints
// 2. Numbered circular markers (day number) per waypoint
// 3. Polyline connecting all waypoints in order
// 4. Click marker → popup with day title + description
// 5. Day-by-day legend below the map
// 6. On mobile: map height = 250px, collapsible
// 7. Tile layer: OpenStreetMap (free, no API key)

// Admin input → stored as tour.waypoints JSONB array
// Example:
// [{ day:1, name:'Delhi',    lat:28.6139, lng:77.2090, description:'Departure' },
//  { day:2, name:'Haridwar', lat:29.9457, lng:78.1642, description:'Ganga Aarti' }]
```

### 6.3 Admin Waypoint Builder

The non-technical admin interface for creating itinerary maps. No map knowledge required:

| Field | Type | Notes |
|---|---|---|
| Day | Number input | 1, 2, 3… (auto-incremented, editable) |
| Location Name | Text input | e.g. 'Haridwar — Ganga Aarti' |
| Latitude | Number input | e.g. 29.9457 — with 'Find Coords' helper link to maps.google.com |
| Longitude | Number input | e.g. 78.1642 |
| Description | Textarea | Activities, meals, stays for this day |
| Actions | Buttons | ↑ Move Up │ ↓ Move Down │ 🗑 Remove |

A 'Find Coordinates' helper link opens Google Maps — owner searches the location, right-clicks, and copies the lat/lng shown. Instructions printed directly in the admin UI.

### 6.4 Blog Rich Text Editor (Tiptap)

Tiptap extensions enabled for the blog editor:

- StarterKit (Bold, Italic, Strike, Code, Blockquote, Lists, Headings H1–H4, Horizontal Rule, History)
- Image — paste or upload; stores to Supabase Storage, returns URL
- Link — with `target=_blank` and `rel=noopener`
- Table — basic 2-column tables for comparison content
- Youtube — embed YouTube videos by pasting URL
- Character Count — displayed in footer of editor
- Placeholder — 'Start writing your post...'

---

## 7. Environment Variables & Deployment

### 7.1 Environment Variables

Create a `.env.local` file locally and add these to Vercel dashboard under **Project Settings → Environment Variables**:

```bash
# .env.local

# Supabase (get from Supabase dashboard → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  # safe to expose (RLS enforces security)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...      # NEVER expose to client — server only

# Site
NEXT_PUBLIC_SITE_URL=https://anantanand.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919XXXXXXXXX   # with country code, no +

# ISR Revalidation secret (generate a random string)
REVALIDATION_SECRET=your-random-secret-here

# Phase 2: Email notifications
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### 7.2 Vercel Deployment Steps

1. Push repository to GitHub (private repo recommended)
2. Log in to vercel.com → 'Add New Project' → Import from GitHub
3. Select the repository → Framework: Next.js (auto-detected)
4. Add all environment variables from Section 7.1
5. Click Deploy — first deployment takes ~2 minutes
6. Connect custom domain in Vercel Dashboard → Domains → Add `anantanand.com`
7. Add Vercel nameservers to domain registrar OR add CNAME/A records as instructed
8. Enable Automatic HTTPS — Vercel handles SSL certificates automatically

> **Deployment Notes:** Every git push to `main` triggers automatic redeployment. Preview deployments are created for every Pull Request. Vercel free tier: 100GB bandwidth/month, 6000 build minutes/month — sufficient for Phase 1. ISR pages are served from Vercel's global Edge Network.

### 7.3 Supabase Setup Steps

1. Go to supabase.com → Create new project → Choose region: **Southeast Asia (Singapore)** for lowest latency from India
2. Note the Project URL and anon key from Settings → API
3. Open SQL Editor → run the schema SQL from Section 3.1
4. Run the RLS policies SQL from Section 3.2
5. Create Storage buckets from Section 3.3 (Storage → New bucket)
6. Create admin user: Authentication → Users → Invite user (enter owner's email)
7. Owner receives email, sets password, and can now log in to `/admin`

---

## 8. Developer Build Checklist

### Phase 1 Build Order (Recommended)

Follow this sequence to avoid dependency blockers:

#### Week 1 — Foundation

- [ ] Initialise Next.js 14 project with App Router + TypeScript + Tailwind
- [ ] Install and configure Supabase client libraries
- [ ] Run database schema + RLS migrations in Supabase
- [ ] Set up `middleware.ts` for admin auth guard
- [ ] Build Admin Login page + test authentication flow
- [ ] Implement `site_settings` table + Settings page in admin

#### Week 2 — Admin CMS

- [ ] Build Tours Manager: table view, create form, edit form, publish toggle
- [ ] Build Waypoint Builder component
- [ ] Build Image Uploader (drag-drop → Supabase Storage)
- [ ] Build Blog Manager: table view, Tiptap editor, SEO fields tab
- [ ] Build Enquiries table with status management
- [ ] Build Admin Dashboard with stats cards

#### Week 3 — Public Site Core

- [ ] Build Navbar (responsive, transparent-to-solid scroll)
- [ ] Build Footer with legal page links
- [ ] Build Homepage with all 9 sections
- [ ] Build Age-Group Filter component (USP)
- [ ] Build Tours Listing page with all filters + URL param sync
- [ ] Build TourCard component with age-group badge

#### Week 4 — Tour Detail + Map

- [ ] Build Tour Detail page layout
- [ ] Implement Leaflet.js itinerary map (dynamic import)
- [ ] Build day-by-day accordion itinerary
- [ ] Build sticky enquiry sidebar / mobile bottom sheet
- [ ] Build EnquiryForm component with Supabase insert
- [ ] WhatsApp sticky button (all pages)

#### Week 5 — Blog + SEO

- [ ] Build Blog Listing page with category filter
- [ ] Build Blog Detail page with auto-generated TOC
- [ ] Implement next-seo for all page meta
- [ ] Implement JSON-LD schema for Tours, Articles, LocalBusiness
- [ ] Configure next-sitemap
- [ ] Build About, Contact, Destinations pages
- [ ] Build Privacy Policy + Terms of Use pages

#### Week 6 — QA & Launch

- [ ] Mobile responsiveness audit on all pages
- [ ] PageSpeed Insights test → fix any Core Web Vitals issues
- [ ] Accessibility audit (axe-core or Lighthouse)
- [ ] End-to-end test: add tour in admin → verify live on site
- [ ] End-to-end test: submit enquiry → verify in admin
- [ ] Set up Google Analytics 4 + Search Console
- [ ] Deploy to production domain
- [ ] Submit sitemap to Google Search Console

---

## 9. Starter package.json

Run `npm install` with these dependencies to bootstrap the project:

```json
{
  "name": "anant-anand-tours",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build && next-sitemap",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.x",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2",
    "@supabase/auth-helpers-nextjs": "^0.10",
    "@tiptap/react": "^2",
    "@tiptap/starter-kit": "^2",
    "@tiptap/extension-image": "^2",
    "@tiptap/extension-link": "^2",
    "@tiptap/extension-youtube": "^2",
    "@tiptap/extension-table": "^2",
    "@tiptap/extension-character-count": "^2",
    "@tiptap/extension-placeholder": "^2",
    "leaflet": "^1.9",
    "@types/leaflet": "^1.9",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "zod": "^3",
    "zustand": "^4",
    "next-seo": "^6",
    "next-sitemap": "^4",
    "lucide-react": "^0.383",
    "date-fns": "^3",
    "slugify": "^1.6",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "tailwindcss": "^3",
    "autoprefixer": "^10",
    "postcss": "^8",
    "eslint": "^8",
    "eslint-config-next": "14.2.x"
  }
}
```

---

## 10. Cost Summary (Phase 1)

| Service | Plan | Monthly Cost | Notes |
|---|---|---|---|
| Vercel | Hobby (Free) | ₹0 | 100GB bandwidth, unlimited deploys |
| Supabase | Free Tier | ₹0 | 500MB DB, 1GB storage, 50k monthly active users |
| OpenStreetMap / Leaflet | Free | ₹0 | No API key, no rate limits |
| Google Fonts | Free | ₹0 | Self-hosted via next/font |
| Google Analytics 4 | Free | ₹0 | Standard traffic analytics |
| Domain (.com) | Purchase | ~₹1,000/yr | One-time annual cost, ~₹85/month |
| **TOTAL Phase 1** | — | **~₹85/month** | Effectively free to run |
| Phase 2 Additions | Resend (email) | ₹0 | 100 emails/day free tier |
| Future: Cloudinary | Free tier | ₹0 | 25GB storage, 25GB bandwidth/month |

> **Cost Scaling Note:** Vercel free tier supports ~100,000 page views/month before needing upgrade ($20/month). Supabase free tier is sufficient until ~5,000 tours/posts and ~10,000 enquiries. Both services have affordable paid tiers if the business grows significantly.

---

*End of Tech Stack & Architecture Blueprint*

Anant Anand Tour Packages • Version 1.0 • June 2026 • Confidential — Internal Use Only
