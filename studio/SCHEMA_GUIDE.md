# Sanity Schema Guide — Virtual Tour Settings

This guide explains every editable field in the Sanity Studio for this virtual tour template, what effect each field has on the viewer, and recommended values.

---

## Where to find settings in the Studio

| Document type | Purpose | Typical count |
|---|---|---|
| **Virtual Tour Page Blocks** | Tour-wide configuration — viewer behavior, auto-rotate, starting node | 1 (singleton) |
| **Virtual Tour Item** | One panoramic location (360° image + links to other nodes) | One per location |
| **Virtual Tour Link** | A navigation hotspot embedded inside a Virtual Tour Item | One per link |

---

## Virtual Tour Page Blocks

This is the master settings document for the tour. There should be exactly one of these.

### Tour Info tab

| Field | Type | Description |
|---|---|---|
| **Title** | string | Page `<title>` and OpenGraph title shown in the header bar |
| **Description** | string | SEO meta description (100–160 characters recommended) |
| **Loader Image or GIF** | file | Displayed while panoramas are downloading. A small animated GIF works well |
| **Starting Node** | reference → Virtual Tour Item | The panorama shown when the tour first opens. Required |

### Viewer Settings tab

These control the Photo Sphere Viewer (`@photo-sphere-viewer/core`).

| Field | Default | PSV option | Description |
|---|---|---|---|
| **Default Zoom Level** | `50` | `defaultZoomLvl` | Starting zoom (0 = widest / most zoomed out, 100 = tightest). 50 is a comfortable midpoint |
| **Minimum Field of View** | `30°` | `minFov` | How far in the user can zoom. Lower value = more zoom. Keep above 10° |
| **Maximum Field of View** | `90°` | `maxFov` | How far out the user can zoom. Higher value = wider angle. Keep below 120° |
| **Show Gallery on Load** | `false` | `GalleryPlugin.visibleOnLoad` | Whether the thumbnail strip opens automatically. Useful for tours with many locations |
| **Node Transition Speed** | `"20rpm"` | `VirtualTourPlugin.transitionOptions.speed` | Speed of the animated rotation when the viewer moves between panoramas. Use rpm (e.g. `"20rpm"`) or dps (e.g. `"90dps"`) |

### Auto-rotate tab

These control the `AutorotatePlugin` — the idle spin that starts when no interaction is detected.

| Field | Default | PSV option | Description |
|---|---|---|---|
| **Enable Auto-rotate** | `true` | `AutorotatePlugin.autostartOnIdle` | Turn idle rotation on or off. When off the autorotate button in the navbar still exists but only works on demand |
| **Auto-rotate Start Delay** | `3000` ms | `AutorotatePlugin.autostartDelay` | How long (milliseconds) after the last interaction before rotation begins. 3000 = 3 seconds |
| **Auto-rotate Speed** | `"2rpm"` | `AutorotatePlugin.autorotateSpeed` | Rotation speed. Use `"2rpm"` for slow ambient spin, `"10rpm"` for faster. Prefix with `-` to reverse direction (e.g. `"-2rpm"`) |

---

## Virtual Tour Item

One document per panoramic location. Each document becomes one navigable node in the tour.

### Fields

| Field | PSV node field | Description |
|---|---|---|
| **Title** | `name` | Short name shown in the gallery strip, compass tooltip, and navigation arrows |
| **Caption** | `caption` | Displayed in the viewer navbar caption area when this node is active |
| **Description** | `description` | Longer text shown in hotspot tooltips when hovering a navigation arrow that points to this node |
| **Image** | `panorama` | The 360° equirectangular panorama image. Should be at least 4000px wide for good quality |
| **Links to other Locations** | `links` | Array of navigation hotspots pointing to other nodes (see Virtual Tour Link below) |
| **Pose Heading** | `panoData.poseHeading` | Initial horizontal camera angle in degrees (0–360). 180 = facing south. Adjust so the first thing the user sees is meaningful |
| **Pose Pitch** | `panoData.posePitch` | Initial vertical camera angle in degrees. 0 = horizon, positive = up, negative = down |
| **Show in Gallery** | `showInGallery` | Uncheck to hide this node from the thumbnail gallery strip. Useful for utility/transition nodes |

---

## Virtual Tour Link

An embedded object inside a Virtual Tour Item's **Links** array. Each link is one clickable navigation arrow on the panorama surface.

### Fields

| Field | PSV link field | Description |
|---|---|---|
| **Location** | `nodeId` | Reference to the Virtual Tour Item this hotspot navigates to. Required |
| **Texture X** | `position.textureX` | Horizontal pixel position of the hotspot on the source panorama image. Valid values: `0`, `512`, `1024`, `1536`, `2048` (cube face boundaries) |
| **Texture Y** | `position.textureY` | Vertical pixel position. Typically half the image height (e.g. `512` for a 1024px tall image) |
| **Arrow Label** | `name` | Custom tooltip text on the navigation arrow. Defaults to the target node title if left blank |
| **Arrival Pitch** | `data.arrivalPitch` | Stored for future use. Vertical viewing angle (degrees) the camera will snap to when arriving at this node via this link |
| **Arrival Zoom Level** | `data.arrivalZoom` | Stored for future use. Zoom level (0–100) the camera will snap to when arriving via this link |

### Texture coordinate tips

The 3D render mode projects the panorama onto a cube. Say you have a panorama with dimensions 2048x1024, the typical hotspot positions use pixel coordinates on that cube's face grid:

```
textureX: 0     → left face
textureX: 512   → front-left seam
textureX: 1024  → front face
textureX: 1536  → front-right seam
textureX: 2048  → right face

textureY: 512   → center height (usually standard for all hotspots, unless you want to focus downwards or upwards)
```

---

## Hardcoded viewer settings

The following settings are intentionally hardcoded in `app/src/lib/components/Virtual.svelte` and are not exposed in Sanity. Edit the component directly to change them:

| Setting | Value | Reason hardcoded |
|---|---|---|
| `touchmoveTwoFingers` | `true` | Prevents page scroll conflict on mobile; always desirable |
| `moveInertia` | `true` | Momentum pan; rarely needs changing |
| `CompassPlugin.size` | `120px` | Layout detail; change in CSS if needed |
| `CompassPlugin.position` | `bottom right` | Layout detail |
| `GalleryPlugin.thumbnailSize` | `100×100 px` | Matches the `?w=200` thumbnail URL |
| `GalleryPlugin.hideOnClick` | `true` | Good UX default; rarely needs changing |
| `arrowsPosition.minPitch` | `0.2 rad` | Slightly more permissive than PSV default (0.3). All four arrowsPosition fields must be set together — PSV shallow-merges the object |
| `arrowsPosition.maxPitch` | `Math.PI / 2` | PSV default — must be present or camera pitch becomes NaN and arrows vanish |
| `arrowsPosition.linkPitchOffset` | `-0.1` | PSV default — shift arrows slightly downward in GPS mode |
| `defaultYaw` | `0deg` | Per-node heading is controlled by Pose Heading in each node |
| `navbar` order | `autorotate zoom move gallery caption fullscreen` | Fixed navbar layout |
