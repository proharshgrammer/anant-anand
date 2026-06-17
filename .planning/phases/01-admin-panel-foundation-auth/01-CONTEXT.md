# Phase 1: Admin Panel Foundation & Auth - Context

**Gathered:** 2026-06-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up the Next.js 14 App Router project foundation with Tailwind CSS and shadcn/ui. Run the Supabase database migrations for all tables (tours, blog_posts, enquiries, site_settings, destinations) and configure RLS policies. Implement Supabase email/password authentication for the admin user, secure the admin routes using Next.js middleware, and construct the administrative sidebar shell, settings CMS, and enquiries list.

</domain>

<decisions>
## Implementation Decisions

### Route File Organization
- **D-01:** Organize the `/app` router into `(public)` and `(admin)` route groups to keep public pages and administrative controls isolated and simplify middleware matching.

### Supabase Integration
- **D-02:** Use separate client instantiations for client-side pages (browser client) and Server Components/API routes (server client) using standard Supabase Next.js helpers to ensure proper session handling and security.

### Admin Navigation Layout
- **D-03:** Build a sticky sidebar layout for desktop displays that collapses to a top nav header with a hamburger menu on mobile viewports.

### Admin Session & Auth Guard
- **D-04:** Use secure cookies for session token persistence to allow the Next.js `middleware.ts` to execute server-side auth validation and handle redirect guards prior to rendering admin routes.

### Claude's Discretion
- UI/UX theme variables: Claude has the flexibility to fine-tune the warm cream background and primary deep teal variables in the styling layer to match the brand identity.
- Exact components hierarchy under `/components/admin/`: Setup folders and layouts with reasonable discretion.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `Anant_Anand_PRD.md` — Defines the complete functional and non-functional specifications.
- `Anant_Anand_Tech_Blueprint.md` — Defines the tech stack, directory layouts, database schema migrations, and build checklist.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (Greenfield project).

### Established Patterns
- None (First phase).

### Integration Points
- `/middleware.ts` will connect Next.js requests to Supabase Auth token validation.
- `/lib/supabase/` will serve as the database client provider for both client and server pages.

</code_context>

<specifics>
## Specific Ideas

- Bilingual taglines/wordmarks (English + Hindi/Devanagari) on the login page and header to align with the brand identity.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Admin Panel Foundation & Auth*
*Context gathered: 2026-06-18*
