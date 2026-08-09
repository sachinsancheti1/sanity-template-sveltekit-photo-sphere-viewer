<script lang="ts">
	import { Viewer } from '@photo-sphere-viewer/core';
	import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
	import { GalleryPlugin } from '@photo-sphere-viewer/gallery-plugin';
	import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
	import { CompassPlugin } from '@photo-sphere-viewer/compass-plugin';

	import '@photo-sphere-viewer/core/index.css';
	import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
	import '@photo-sphere-viewer/gallery-plugin/index.css';
	import '@photo-sphere-viewer/compass-plugin/index.css';

	import type { VirtualTourItem, VirtualTourPageBlocks } from '$lib/types/sanity';
	import { toPsvNodes } from '$lib/utils/psv';

	let { virtualTourItem, virtualTourPageBlocks }: {
		virtualTourItem: VirtualTourItem[];
		virtualTourPageBlocks: VirtualTourPageBlocks;
	} = $props();

	let wrapper = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!wrapper || !virtualTourPageBlocks.start) return;

		const {
			defaultZoomLvl,
			minFov,
			maxFov,
			showGalleryOnLoad,
			transitionSpeed,
			autorotateEnabled,
			autorotateDelay,
			autorotateSpeed,
		} = virtualTourPageBlocks;

		const viewer = new Viewer({
			container: wrapper,
			loadingImg: virtualTourPageBlocks.loader ?? undefined,
			defaultYaw: '0deg',
			defaultZoomLvl,
			navbar: 'autorotate zoom move gallery caption fullscreen',
			touchmoveTwoFingers: true,
			moveInertia: true,
			minFov,
			maxFov,

			plugins: [
				[
					AutorotatePlugin,
					{
						// null autostartDelay disables auto-start when autorotateEnabled is false
						autostartDelay: autorotateEnabled ? autorotateDelay : null,
						autostartOnIdle: autorotateEnabled,
						autorotateSpeed,
					}
				],
				[
					CompassPlugin,
					{
						size: '120px',
						position: 'bottom right',
						navigation: true,
					}
				],
				[
					GalleryPlugin,
					{
						thumbnailSize: { width: 100, height: 100 },
						visibleOnLoad: showGalleryOnLoad,
						hideOnClick: true,
						navigationArrows: true,
					}
				],
				[
					VirtualTourPlugin,
					{
						renderMode: '3d',
						positionMode: 'manual',
						dataMode: 'client',
						preload: true,
						startNodeId: virtualTourPageBlocks.start.id,
						linksOnCompass: true,
						transitionOptions: {
							showLoader: false,
							speed: transitionSpeed,
							rotation: true,
							effect: 'fade',
						},
						// Include all four fields — PSV does a shallow merge; missing maxPitch → NaN camera pitch → arrows invisible
						arrowsPosition: {
							minPitch: 0.2,
							maxPitch: Math.PI / 2,
							linkOverlapAngle: Math.PI / 4,
							linkPitchOffset: -0.1,
						},
					}
				]
			]
		});

		const virtualTour = viewer.getPlugin(VirtualTourPlugin) as VirtualTourPlugin;

		virtualTour.setNodes(toPsvNodes(virtualTourItem), virtualTourPageBlocks.start.id);

		return () => viewer.destroy();
	});
</script>

<div bind:this={wrapper} class="m-0 w-full h-full"></div>

<style>
	:global(.psv-tooltip-content > img) {
		display: none;
	}
	:global(.psv-tooltip-content > h3) {
		font-size: 0.85rem;
		font-weight: 600;
		margin: 0 0 0.2rem;
	}
	:global(.psv-tooltip-content > p) {
		font-size: 0.75rem;
		opacity: 0.85;
		margin: 0;
		max-width: 200px;
		white-space: normal;
	}
</style>
