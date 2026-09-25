# sanity-template-sveltekit-photo-sphere-viewer

A Sanity + SvelteKit template for displaying 360° panoramic images as a navigable virtual tour using [Photo Sphere Viewer](https://photo-sphere-viewer.dev/).

## Project Structure

```text
├── app/          SvelteKit frontend
└── studio/       Sanity Studio (content management)
```

## Running Locally

**App** (from `app/`):

```bash
npm run dev
```

Requires `app/.env` with:

```env
PUBLIC_SANITY_PROJECT_ID=...
PUBLIC_SANITY_DATASET=...
```

**Studio** (from `studio/`):

```bash
npm run dev
```

Requires `studio/.env` with:

```env
SANITY_STUDIO_PROJECT_ID=...
SANITY_STUDIO_DATASET=...
```

## Architecture

### Data Flow

1. `app/src/routes/+page.server.ts` fires one combined GROQ fetch with two projections:
   - `virtualTourPageBlocks` — tour title, description, loader image, starting node reference, and viewer settings (zoom, FOV, gallery, transition, autorotate)
   - `virtualTourItem[]` — all panorama nodes with hotspot links, coordinates, and camera pose
2. `app/src/lib/components/Virtual.svelte` receives this data and initializes Photo Sphere Viewer
3. `app/src/routes/health/` is a separate content-health dashboard: `healthQuery()` in `sanity.ts` reports nodes with missing images, broken references, missing texture coordinates, self-links, and missing metadata

### Sanity Schemas (`studio/schemas/`)

| Schema | Type | Purpose |
| --- | --- | --- |
| `virtualTourPageBlocks` | document | Singleton: tour title, description, loader image, start node |
| `virtualTourItem` | document | One panoramic location: image, caption, poseHeading, posePitch, links |
| `virtualTourLink` | object | Navigation hotspot embedded in a virtualTourItem: target node ref, textureX/Y coords |

### Key App Files

| File | Purpose |
| --- | --- |
| `app/src/routes/+page.server.ts` | Server load — single combined GROQ fetch |
| `app/src/routes/+page.svelte` | Home page — renders title, meta tags, viewer |
| `app/src/routes/health/` | Content-health dashboard listing broken/incomplete tour nodes |
| `app/src/lib/components/Virtual.svelte` | Photo Sphere Viewer init with all plugins |
| `app/src/lib/utils/psv.ts` | Pure Sanity→PSV node mapping (unit-tested in `psv.test.ts`; `npm test` in app/) |
| `app/src/lib/utils/sanity.ts` | GROQ query functions (`virtualTourPageBlocks`, `virtualTourItem`, `healthQuery`) |
| `app/src/lib/server/sanityClient.ts` | Sanity client singleton |
| `app/src/lib/styles/style.css` | Global styles + Tailwind base |

### Photo Sphere Viewer Plugins

- **core** — 360° equirectangular renderer
- **virtual-tour-plugin** — hotspot navigation between nodes (`renderMode: '3d'`, `positionMode: 'manual'`); `arrowsPosition` must include all four fields (PSV does a shallow merge — a missing `maxPitch` makes arrows invisible)
- **gallery-plugin** — thumbnail strip for selecting panoramas
- **autorotate-plugin** — idle auto-rotation, driven by `autorotateEnabled/Delay/Speed` from Sanity
- **compass-plugin** — on-screen compass showing heading and hotspot directions (`linksOnCompass: true`)

### Sanity Studio (v6)

- `structureTool` with custom structure in `studio/deskStructure.ts`
- Dashboard plugin configured in `studio/dashboardConfig.js`
- `sanity-plugin-media` for asset management
- `SCHEMA_GUIDE.md` in `studio/` documents the content model for editors

### Scene links, images, and caching

- **`?node=` scene links** — `+page.server.ts` validates the param (`resolveInitialNodeId`) and passes `initialNodeId`; `+page.svelte` keeps the URL in sync with SvelteKit shallow routing (`pushState`/`replaceState`). The scene for each history entry must live in `page.state.nodeId`: shallow routing deliberately leaves `page.url` at the originally loaded URL, so reading the scene from `page.url` breaks Back. `Virtual.svelte` takes scene requests via its `nodeId` prop in a separate effect so they never rebuild the viewer.
- **Shared views** (`?yaw=&pitch=&zoom=`, degrees; helpers in `lib/utils/view.ts`) apply only when `?node=` is valid, are applied once on the landing scene's first `node-changed`, and suppress autorotate auto-start. `handleNodeChange` strips `VIEW_PARAMS` so they never leak into later history entries. The Share button is a PSV custom navbar button; the page owns URL building and the share/clipboard logic (`handleShare`).
- **Setup and error states** — `+page.server.ts` returns `setupIssue` (`no-tour-page` / `no-start-scene`) instead of throwing when the singleton or its Starting Node is missing; `virtualTourPageBlocks` is typed nullable for this. Setup responses are not edge-cached. `+error.svelte` covers 404s and Sanity outages. Setup copy uses the Studio's labels from `studio/deskStructure.ts` (Virtual Tour → Virtual Tour Section, "Starting Node"), so keep them in sync.
- **Panorama URLs** go through `panoramaUrl()` (WebP, ≤8192px). Use `fm=webp`, not `auto=format`: PSV fetches without an Accept header, so `auto=format` returns JPEG. Hotspot `textureX/Y` are pixels on the *original* upload, so any resize must scale them too (`panoramaScale`, using `panoramaWidth` from the query).
- **Caching** — the tour page sets a 60s edge cache in `+page.server.ts`; `/health` is intentionally uncached.

## Content Model Notes

- `poseHeading` (number, default 180) — initial horizontal camera angle in degrees
- `posePitch` (number, default 0) — initial vertical camera angle in degrees
- `textureX` / `textureY` — pixel coordinates on the source panorama image where a hotspot appears
- `virtualTourLink` also carries `linkName` (tooltip label) and arrival overrides `arrivalPitch` / `arrivalZoom`
- `virtualTourItem.showInGallery` (boolean, default true) — hide a node from the gallery strip
- The `loader` field on `virtualTourPageBlocks` accepts an image/GIF displayed while panoramas load
- Viewer settings on `virtualTourPageBlocks` (all optional, defaults applied in GROQ via `coalesce`): `defaultZoomLvl` (50), `minFov` (30), `maxFov` (90), `showGalleryOnLoad` (false), `transitionSpeed` ("20rpm"), `autorotateEnabled` (true), `autorotateDelay` (3000 ms), `autorotateSpeed` ("2rpm")

## Known Issues / Tech Debt

- **PSV is lazy-loaded** — `Virtual.svelte` dynamically imports all PSV modules inside its `$effect` (~630 kB chunk, kept out of the initial page bundle). Keep PSV imports there as `import type` only; a value import at the top of the file would pull the chunk back into the page bundle. Vite still prints a >500 kB chunk warning for it — expected.
- **Sanity typegen broken upstream** — `npm run typegen` in studio/ produces only Sanity built-in types. Re-tested on Sanity 6.16 / CLI 8.13 (Sept 2026): `sanity schema extract` drops *every* custom type, even a one-field dummy document in a plugin-free config, while the config and schema files load without error — so it's a CLI extractor bug, not the styled-components warning it prints. GROQ result types stay hand-written in `app/src/lib/types/sanity.ts`; update them when schemas change.
- **One upstream advisory** — `npm audit` in studio/ reports js-yaml 3.x inside `@sanity/cli` → `@vercel/frameworks` (dev CLI only). Never accept npm's `audit fix --force` suggestion: it downgrades `sanity` to 5.x.

## CI & Maintenance

- `.github/workflows/ci.yml` runs on every PR and push to main: app `npm test` + `check` + `build`, studio `build` (placeholder Sanity env vars — builds don't fetch data)
- `.github/dependabot.yml` opens at most one monthly update PR each for app, studio, and GitHub Actions (every package, majors included, grouped per folder); let CI go green before merging. TypeScript major bumps are ignored in app/ until SvelteKit's peer range allows TypeScript 7 — remove that `ignore` entry once it does
- Studio `package.json` has scoped npm `overrides` for transitive advisories. When changing a *nested* override, delete that package's entries from `package-lock.json` first — npm won't re-resolve an existing lockfile entry. Keep `studio/pnpm-lock.yaml` in sync with `pnpm install --lockfile-only`
- `react` and `react-dom` must be the exact same version or the studio build and CLI fail
