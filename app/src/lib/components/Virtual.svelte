<script lang="ts">
	import { Viewer } from '@photo-sphere-viewer/core';
	import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
	import { GalleryPlugin } from '@photo-sphere-viewer/gallery-plugin';

	import '@photo-sphere-viewer/core/index.css';
	import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
	import '@photo-sphere-viewer/gallery-plugin/index.css';

	let { virtualTourItem, virtualTourPageBlocks } = $props();

	let wrapper = $state(null);

	$effect(() => {
		if (wrapper) {
			const viewer = new Viewer({
				container: wrapper,
				loadingImg: virtualTourPageBlocks.loader,
				defaultYaw: '0deg',
				defaultZoomLvl: 0,
				navbar: 'zoom move gallery caption fullscreen',

				plugins: [
					[
						GalleryPlugin,
						{
							thumbnailSize: { width: 100, height: 100 }
						}
					],
					[
						VirtualTourPlugin,
						{
							renderMode: '3d',
							positionMode: 'manual',
							dataMode: 'client',
							preload: true,
							startNodeId: virtualTourPageBlocks.startID
						}
					]
				]
			});
			const virtualTour = viewer.getPlugin(VirtualTourPlugin);

			virtualTour.setNodes(virtualTourItem, virtualTourPageBlocks.start.id);
		}
	});
</script>

<div bind:this={wrapper} class="m-0 w-full h-full"></div>

<style>
	:global(.psv-tooltip-content > img, .psv-tooltip-content > p) {
		display: none;
	}
	:global(.psv-tooltip-content > h3) {
		font-size: 12px;
	}
</style>
