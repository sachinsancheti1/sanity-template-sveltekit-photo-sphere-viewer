# Changelog

## v2.0.0 — 2026-08-09

A major overhaul of the template. Existing Sanity datasets are fully compatible — every new schema field is optional with a sensible default.

### Added

- **Autorotate plugin** — idle auto-rotation, configurable from the Studio (`autorotateEnabled`, `autorotateDelay`, `autorotateSpeed`)
- **Compass plugin** — on-screen compass with navigation hotspots plotted on it (`linksOnCompass`)
- **CMS-driven viewer settings** on `virtualTourPageBlocks`: `defaultZoomLvl`, `minFov`, `maxFov`, `showGalleryOnLoad`, `transitionSpeed`
- **Per-link arrival control** on `virtualTourLink`: `arrivalPitch`, `arrivalZoom`, and a `linkName` tooltip label
- **`showInGallery`** flag on `virtualTourItem` to hide nodes from the gallery strip
- **Content health dashboard** at `/health` in the app — lists nodes with missing images, broken references, missing texture coordinates, self-links, and missing metadata
- **Studio dashboard** and [sanity-plugin-media](https://github.com/sanity-io/sanity-plugin-media) for asset management
- `SCHEMA_GUIDE.md` in `studio/` documenting the content model for editors

### Fixed

- Tour started at the wrong node (`startID` reference mismatch)
- `posePitch` was ignored — initial vertical camera angle now applies
- Navigation-breaking errors in the virtual tour
- Duplicate viewport meta tag; error-variable shadowing in the page load

### Changed

- **Sanity Studio upgraded to v6**, using the structure tool (`deskTool` was deprecated)
- **Svelte 5** (runes), **Tailwind CSS v4**, **Vite 8**, **TypeScript 6**
- **Node.js 22+ now required**
- Removed unused dependencies (`@sanity/image-url`, `groq`)

## v1.x

Initial template: 360° virtual tour with Photo Sphere Viewer (core, virtual-tour, gallery plugins), Sanity Studio, and SvelteKit.
