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

/**
 * Map Sanity query results to Photo Sphere Viewer VirtualTourPlugin nodes:
 * convert null → undefined and drop links that PSV cannot render.
 */
export function toPsvNodes(items: VirtualTourItem[]) {
	return items.map((item) => ({
		id: item.id,
		panorama: item.panorama ?? undefined,
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
					textureX: l.position.textureX as number,
					textureY: l.position.textureY as number
				},
				name: l.name ?? undefined,
				data: l.data ?? undefined
			}))
	}));
}
