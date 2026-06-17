# Walking Skeleton — Anant Anand Tour Packages

**Phase:** 1
**Generated:** 2026-06-18

## Capability Proven End-to-End

An authenticated admin user can log in to `/admin/login`, receive a cookie-persisted session via Supabase Auth, and be redirected by Next.js server-side middleware to `/admin/dashboard` which retrieves and displays live site stats from the database.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14 App Router | Hybrid rendering models (SSR/ISR) provide optimized load speeds and robust SEO crawling, alongside built-in API routing. |
| Data Layer | PostgreSQL + Supabase Client | Relational schema is ideal for tour itineraries and blog structures; RLS handles public vs admin access cleanly. |
| Auth | Supabase Auth (Email/Password) | Built-in email/password auth provides instant administrative security without hosting separate microservices. |
| Deployment target | Vercel | Seamless native integration with Next.js App Router and edge caching support. |
| Directory layout | Grouped App Router layouts | `(public)` and `(admin)` route groups under `/app` segregate concerns and lock routes cleanly. |

## Stack Touched in Phase 1

- [ ] Project scaffold (Next.js 14 + Tailwind + TypeScript + ESLint)
- [ ] Routing — `/admin/login` and `/admin/dashboard` layout guards
- [ ] Database — `site_settings` read/write, `enquiries` table reads
- [ ] UI — Login forms and dashboard tables built with shadcn/ui
- [ ] Deployment — Documented local full-stack execution and dev server launch

## Out of Scope (Deferred to Later Slices)

- Public client-side pages and filters (Deferred to Phase 3)
- Leaflet.js interactive maps and route rendering (Deferred to Phase 4)
- Tiptap rich-text editor setup (Deferred to Phase 2)
- Image upload pipeline with storage buckets (Deferred to Phase 2)
- Automated email/WhatsApp submission triggers (Deferred to Phase 2/3)

## Subsequent Slice Plan

- Phase 2: CMS Management for Tours & Blogs (Tours Forms, Tiptap, Waypoint builders)
- Phase 3: Public Website & Age-Group Filtering
- Phase 4: Tour Details, Map integrations, and Enquiries forms
- Phase 5: Blog Frontend, legal pages, dynamic next-seo configurations
