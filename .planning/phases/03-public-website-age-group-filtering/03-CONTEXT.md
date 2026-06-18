# Phase 3: Public Website & Age-Group Filtering - Context

**Gathered:** 2026-06-18
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the public-facing pages for the website, including shared layout components (Navbar, Footer, floating CTA), the Homepage, the Destinations page, and the Tours Listing page. It also introduces the core USP age-group filtering logic and URL sync via Zustand.
</domain>

<decisions>
## Implementation Decisions

### Filtering UI Behavior
- Filters should apply instantly (results update immediately as filters are toggled, providing fast feedback).
- When a filter is instantly applied, the page should automatically scroll to the top of the tour results grid to bring results into focus.

### the agent's Discretion
- Homepage Hero Filter Design (e.g., Pills, dropdowns)
- Empty States for Filters (What to show when 0 tours match)
- Tour Card Design (How to display the age badges, hover states)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — Defines all v1 requirements, including the 9 homepage sections (PUBL-01) and filtering rules (FILT-01, FILT-02, FILT-03).
</canonical_refs>

<specifics>
## Specific Ideas
- Filter states must be synced with the URL query parameters (e.g., `?ageGroup=...`) using Zustand so that links are easily shareable.
</specifics>

<deferred>
## Deferred Ideas
None — The discussion focused purely on the scope defined in the roadmap.
</deferred>

---

*Phase: 03-public-website-age-group-filtering*
*Context gathered: 2026-06-18*
