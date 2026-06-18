# Phase 5: Blog Frontend, SEO & Verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-18
**Phase:** 5-Blog Frontend, SEO & Verification
**Areas discussed:** Blog listing layout & pagination, Blog detail: content rendering & TOC, SEO: next-seo vs native Metadata API, Static pages & sitemap strategy

---

## Blog Listing Layout & Pagination

| Option | Description | Selected |
|--------|-------------|----------|
| Card grid | Reuses existing card/grid pattern from TourCard | ✓ |
| List layout | Single-column list with image left, text right | |
| Magazine/mixed | Featured hero card + grid below | |

**User's choice:** Card grid

---

| Option | Description | Selected |
|--------|-------------|----------|
| Page numbers | Traditional numbered pagination (1, 2, 3…) | ✓ |
| Load more button | Appends next 10 posts on click | |
| Infinite scroll | Auto-loads on scroll | |

**User's choice:** Page numbers (10/page)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Server component with ISR | Fetch published posts server-side with ISR | ✓ |
| Client-side fetch | 'use client' + useEffect/SWR | |

**User's choice:** Server component with ISR

---

| Option | Description | Selected |
|--------|-------------|----------|
| URL-based category pages | Route segments or query params | ✓ |
| Client-side category tabs | Show category buttons, filter client-side | |

**User's choice:** URL-based category pages

---

## Blog Detail: Content Rendering & TOC

| Option | Description | Selected |
|--------|-------------|----------|
| dangerouslySetInnerHTML + Tailwind prose | Style HTML output with @tailwindcss/typography | ✓ |
| HTML sanitizer + prose | Pass through DOMPurify before rendering | |

**User's choice:** dangerouslySetInnerHTML + Tailwind prose

---

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-generate from H2/H3 | Parse headings, sticky sidebar desktop, collapsible mobile | ✓ |
| No TOC | Skip auto-generated table of contents | |

**User's choice:** Auto-generate from H2/H3

---

| Option | Description | Selected |
|--------|-------------|----------|
| Tour cards grid | Reuse TourCard component in grid | ✓ |
| Compact link list | Simple list of tour names | |
| Skip related tours | Don't render related tours | |

**User's choice:** Tour cards grid

---

| Option | Description | Selected |
|--------|-------------|----------|
| Inline author card | Show name, bio, avatar | |
| Minimal — name only | Name in post metadata line | ✓ |

**User's choice:** Minimal — name only

---

## SEO: next-seo vs Native Metadata API

| Option | Description | Selected |
|--------|-------------|----------|
| Native generateMetadata | Next.js native Metadata API, proven on tour detail | ✓ |
| next-seo package | Component-based API, extra abstraction | |

**User's choice:** Native generateMetadata

---

| Option | Description | Selected |
|--------|-------------|----------|
| Manual script tag | `<script type="application/ld+json">` per page | ✓ |
| schema-dts package | TypeScript-typed schema construction | |

**User's choice:** Manual script tag

---

| Option | Description | Selected |
|--------|-------------|----------|
| next-sitemap package | Standard approach with config + postbuild | ✓ |
| Manual route.ts | Custom `/sitemap.xml` route | |

**User's choice:** next-sitemap package

---

| Option | Description | Selected |
|--------|-------------|----------|
| Standard optimizations | Next.js Image, ISR, lazy-loading, font subsetting | ✓ |
| Aggressive optimization | Plus critical CSS, preconnect, WebP checks | |

**User's choice:** Standard optimizations

---

## Static Pages & Sitemap Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Static info + enquiry form | Office info + existing EnquiryForm component | ✓ |
| Static info only | Just contact details | |

**User's choice:** Static info + enquiry form

---

| Option | Description | Selected |
|--------|-------------|----------|
| Hardcoded server components | Content in React components | ✓ |
| Supabase site_settings | Editable via admin panel | |

**User's choice:** Hardcoded server components

---

| Option | Description | Selected |
|--------|-------------|----------|
| Defer to v2 | NOTF-01 is v2 scope | ✓ |
| Include basic email notification | Add Resend API call | |

**User's choice:** Defer to v2

---

## the agent's Discretion

- Blog card design details (image aspect ratio, excerpt length, hover states)
- TOC visual style (indentation, active heading highlight, scroll behavior)
- Exact route pattern for category filtering
- Contact page layout
- Legal page content structure

## Deferred Ideas

- NOTF-01 (automated email alerts via Resend) — deferred to v2
