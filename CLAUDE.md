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

## Content Model Notes

- `poseHeading` (number, default 180) — initial horizontal camera angle in degrees
- `posePitch` (number, default 0) — initial vertical camera angle in degrees
- `textureX` / `textureY` — pixel coordinates on the source panorama image where a hotspot appears
- `virtualTourLink` also carries `linkName` (tooltip label) and arrival overrides `arrivalPitch` / `arrivalZoom`
- `virtualTourItem.showInGallery` (boolean, default true) — hide a node from the gallery strip
- The `loader` field on `virtualTourPageBlocks` accepts an image/GIF displayed while panoramas load
- Viewer settings on `virtualTourPageBlocks` (all optional, defaults applied in GROQ via `coalesce`): `defaultZoomLvl` (50), `minFov` (30), `maxFov` (90), `showGalleryOnLoad` (false), `transitionSpeed` ("20rpm"), `autorotateEnabled` (true), `autorotateDelay` (3000 ms), `autorotateSpeed` ("2rpm")

## Known Issues / Tech Debt

- **PSV chunk is large** — `@photo-sphere-viewer` bundles at ~630 kB (minified). Could be lazy-loaded with dynamic `import()` if initial page load becomes a concern.
- **Sanity typegen partial** — `studio/sanity.types.ts` (generated via `npm run typegen` in studio/) only produces Sanity built-in types due to a `styled-components` multiple-instances conflict in the schema extractor (observed on Sanity v5; not yet re-tested since the v6 upgrade). GROQ result types are hand-written in `app/src/lib/types/sanity.ts` instead. Regenerate if schemas change.
