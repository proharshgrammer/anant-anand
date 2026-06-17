# Anant Anand Tour Packages

## What This Is

A professional travel agency website and admin CMS for Anant Anand Tour Packages, specializing in age-group based trip curation. It is built to establish brand credibility, rank on organic search, and capture leads (via phone, WhatsApp, and enquiry forms) without requiring online ticketing or payment processing in Phase 1. It features a custom admin dashboard that allows non-technical owners to manage tours, blog posts, and site settings.

## Core Value

Capture high-intent travel enquiries and build client trust by offering an intuitive, high-performance web experience highlighted by age-group based tour filtering.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] **Lead Capture System**: Forms on Homepage, Tour Details, and Contact pages that save leads in Supabase, plus a persistent sticky WhatsApp button.
- [ ] **Age-Group Filtering System**: Segmented filters matching traveller profiles (Senior Pilgrims, Families, Youth & Couples, School Groups) implemented site-wide.
- [ ] **Tour Management CMS**: Admin interface for creating, editing, and publishing tours with dynamic inputs for itineries and images.
- [ ] **Interactive Itinerary Map**: Day-wise Leaflet.js route maps generated from admin waypoints (latitude and longitude) on the Tour Detail pages.
- [ ] **Blog & SEO System**: Tiptap-powered rich text blog publisher, featuring SEO meta-fields editing, Article schema, and auto-generated Table of Contents.
- [ ] **Responsive Frontend Pages**: Public pages (Homepage, Tours Listing, Tour Detail, Destinations, Blog, About, Contact, Privacy, Terms) built with Tailwind CSS.
- [ ] **Admin Authentication**: Supabase email/password login and secure session middleware protecting all `/admin/*` routes.
- [ ] **Site Settings CMS**: Panel allowing non-technical edit of site-wide contact info, social links, stats, and SEO defaults.
- [ ] **Performance & Core Web Vitals**: Achieve PageSpeed score >= 85 on mobile, with lazy-loaded WebP images and ISR (Incremental Static Regeneration).

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- **Payment Gateways**: Online transaction and booking checkout are deferred to Phase 3.
- **Mobile Apps**: Dedicated Android/iOS apps are excluded; the site will be fully mobile-responsive.
- **Real-Time Booking Management**: Tour availability checks and automated bookings are out of scope for Phase 1.
- **Multi-language translation**: Beyond bilingual headings/labels, automated site-wide translations are excluded.

## Context

- Target audience spans from senior spiritual travelers to adventurous youth.
- Hosting will be on Vercel (free tier) and database on Supabase (free tier) to minimize running costs to domain purchase only.
- The project is bootstrapped as a greenfield Next.js 14 App Router project.

## Constraints

- **Stack**: Next.js 14 (App Router) + Supabase + Tailwind CSS + Vercel.
- **Budget**: $0 hosting and database cost (strictly using free tiers of Vercel and Supabase).
- **SEO Priority**: Server-side rendering (SSR) or Incremental Static Regeneration (ISR) is mandatory for indexability by search engines.
- **Map Cost**: Use Leaflet.js with OpenStreetMap to ensure no Google Maps API charges.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14 + Supabase Stack | Hybrid SSR/ISR rendering ensures high PageSpeed and SEO, combined with rapid database setup and authentication. | — Pending |
| YOLO Mode Execution | Implicitly chosen for faster progression without waiting for interactive phase approvals. | — Pending |
| Balanced AI Model Profile | Sonnet is used for most planning tasks to achieve the best cost-quality ratio. | — Pending |
| Coarse Granularity | Grouping features into fewer, broader phases to minimize overhead and expedite delivery. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-18 after initialization*
