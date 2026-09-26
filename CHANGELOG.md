# Changelog

## v2.3.0 — 2026-09-26

### Added

- **Share this view.** A Share button in the viewer toolbar creates a link to exactly what the visitor is looking at: scene, direction, and zoom (`?node=…&yaw=…&pitch=…&zoom=…`, degrees). Phones and tablets open the system share sheet; desktops copy the link and confirm in the viewer.
- **Shared views open where they were shared.** The viewer turns to the linked direction and zoom, and idle autorotate doesn't start on its own for these links (the autorotate button still works). Hand-edited values are normalized; the view params drop out of the URL once the visitor moves to another scene.
- **Tab title follows the scene** (`<scene> · <tour>`), and is restored on Back.
- **Setup guidance** instead of a blank page when the tour has no Virtual Tour Section document or no Starting Node, pointing editors to the exact Studio location. A missing document previously caused a server error.
- **Error pages** for "page not found" and "tour couldn't load" (e.g. Sanity unreachable), with a Try again button.

## v2.2.0 — 2026-09-26

### Added

- **Shareable scene links.** The URL tracks the current scene as `?node=<id>`: moving to a scene adds a history entry, Back/Forward return to earlier scenes, and opening a link lands directly on its scene. Unknown or deleted scene IDs fall back to the start scene.
- **Link previews.** `og:image` is a 1200×630 crop of the scene the link opens on (`twitter:card: summary_large_image`); shared scene links are titled `<scene> · <tour>`. `og:url` is canonical, keeping `?node=` only for valid scenes.

### Performance

- Panoramas are requested as WebP (quality 85) and capped at 8192px wide, never upscaled. On the demo tour that is ~22% smaller per panorama. Gallery thumbnails use `auto=format`.
- Hotspot `textureX`/`textureY` are rescaled when a panorama wider than 8192px is downscaled, so hotspots stay on the same spot. The query now fetches each image's original width for this.
- The tour page is edge-cached (`s-maxage=60`, `stale-while-revalidate=600`, plus `CDN-Cache-Control`). Browsers don't cache it and `/health` stays uncached.

### Fixed

- The root layout's padded, width-capped container left a gap above the header, made the tour page scroll, and stopped the viewer short of the edges on wide screens.
- On mobile, the viewer's bottom controls could sit under the browser's address bar (now sized with `100dvh`).
- Long tour titles overlapped the Health Check link on phones.

## v2.1.0 — 2026-09-25

### Performance

- **Photo Sphere Viewer is now lazy-loaded.** The tour page's own JavaScript dropped from 648 kB to 4 kB; the ~630 kB viewer bundle loads in parallel once the page mounts, so the page shell and title paint sooner.

### Added

- **CI** — GitHub Actions runs the app's tests, type-check, and build plus the studio build on every pull request.
- **Dependabot** — grouped monthly dependency update PRs for the app, the studio, and GitHub Actions.
- Unit tests for the Sanity → Photo Sphere Viewer data mapping (`npm test` in `app/`).

### Security & upgrades

- Sanity Studio 6.9.1 → **6.16.0**; React 19.3.0 (`react` and `react-dom` aligned — a mismatch breaks the studio build)
- Fixed a new high-severity `adm-zip` advisory in Sanity's CLI tooling via a scoped override, plus a `colord` advisory via `npm audit fix`. The studio is back to the single known upstream `js-yaml` advisory (dev CLI only).

### Fixed

- `npm run typegen` in the studio failed on the newer Sanity CLI (it now requires `--force` to overwrite `schema.json`). Note that typegen still only emits built-in types because of an upstream Sanity extractor bug; app types remain hand-written.

### Removed

- Leftover Renovate config and CODEOWNERS entry that pointed at Sanity's own team and preset — neither ever worked for copies of this template.

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
