import type { PanoData } from '@photo-sphere-viewer/core';
import type { VirtualTourItem } from '../types/sanity';

/**
 * Pick the node a visitor lands on: the requested one (e.g. from `?node=`) when it
 * exists in the tour, otherwise the configured start node.
 */
export function resolveInitialNodeId(
	requested: string | null | undefined,
	items: Pick<VirtualTourItem, 'id'>[],
	startId: string
): string {
	return requested && items.some((item) => item.id === requested) ? requested : startId;
}

/** Widest panorama requested from the Sanity image CDN; larger uploads are downscaled. */
export const PANORAMA_MAX_WIDTH = 8192;

/**
 * Sanity CDN URL for a panorama: capped at PANORAMA_MAX_WIDTH (never upscaled) and served as
 * WebP. `fm=webp` is explicit because PSV fetches panoramas without an Accept header, so
 * `auto=format` would always fall back to JPEG.
 */
export function panoramaUrl(url: string): string {
	const u = new URL(url);
	u.searchParams.set('w', String(PANORAMA_MAX_WIDTH));
	u.searchParams.set('fit', 'max');
	u.searchParams.set('fm', 'webp');
	u.searchParams.set('q', '85');
	return u.toString();
}

/**
 * Factor to apply to hotspot pixel coordinates (textureX/Y), which are measured on the original
 * upload, when panoramaUrl() serves a downscaled copy.
 */
export function panoramaScale(originalWidth: number | null): number {
	return originalWidth && originalWidth > PANORAMA_MAX_WIDTH
		? PANORAMA_MAX_WIDTH / originalWidth
		: 1;
}

/**
 * Map Sanity query results to Photo Sphere Viewer VirtualTourPlugin nodes:
 * convert null → undefined and drop links that PSV cannot render.
 */
export function toPsvNodes(items: VirtualTourItem[]) {
	return items.map((item) => {
		const scale = panoramaScale(item.panoramaWidth);
		return {
			id: item.id,
			panorama: item.panorama ? panoramaUrl(item.panorama) : undefined,
			name: item.name ?? undefined,
			caption: item.caption ?? undefined,
			description: item.description ?? undefined,
			thumbnail: item.thumbnail ?? undefined,
			showInGallery: item.showInGallery,
			// PanoData type requires geometry fields PSV doesn't need when only pose is provided — cast is safe
			panoData: item.panoData
				? ({
						poseHeading: item.panoData.poseHeading ?? undefined,
						posePitch: item.panoData.posePitch ?? undefined
					} as unknown as PanoData)
				: undefined,
			links: (item.links ?? [])
				.filter(
					(l) => l.nodeId !== null && l.position.textureX !== null && l.position.textureY !== null
				)
				.map((l) => ({
					nodeId: l.nodeId as string,
					position: {
						textureX: (l.position.textureX as number) * scale,
						textureY: (l.position.textureY as number) * scale
					},
					name: l.name ?? undefined,
					data: l.data ?? undefined
				}))
		};
	});
}
