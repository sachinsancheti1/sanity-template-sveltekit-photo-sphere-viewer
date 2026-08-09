# Changelog

## v2.0.1 — 2026-08-09

Security and dependency maintenance. No feature or schema changes.

### Security

- **App: 6 vulnerabilities → 0.** Fixed via `npm audit fix` (SvelteKit ReDoS in content negotiation, plus vite, postcss, nanoid, and brace-expansion advisories) and a `cookie: ^0.7.2` override (SvelteKit still pins the vulnerable 0.6 range upstream).
- **Studio: 19 vulnerabilities → 1 remaining advisory.** Fixed via the Sanity 6.9.1 upgrade, `npm audit fix`, and scoped overrides (`smol-toml`, `undici`, `uuid`). The remainder is `js-yaml` 3.x inside `@sanity/cli` → `@vercel/frameworks` — dev-CLI-only code, and no safe override exists because it uses the `safeLoad` API that js-yaml 4.x removed; waiting on an upstream bump. Note: `npm audit fix --force` suggests "fixing" this by downgrading to sanity 5.14.1 — don't.

### Upgraded

- Sanity Studio 6.0 → **6.9.1** (with matching `@sanity/vision`; `@sanity/dashboard` 6.0.14)
- `sanity-plugin-media` 4.x → **6.1.1**
- Photo Sphere Viewer plugins aligned at **5.15.1** (previously a mix of 5.4.2 and 5.14.1)
- `@tailwindcss/vite` 4.0.0-beta.6 → **4.3.3 stable**; `tailwindcss` 4.3.3
- Studio `pnpm-lock.yaml` regenerated to match

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
