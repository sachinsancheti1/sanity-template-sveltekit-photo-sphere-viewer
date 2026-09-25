<script lang="ts">
	import type { Viewer } from '@photo-sphere-viewer/core';
	import type { VirtualTourPlugin as VirtualTourPluginType } from '@photo-sphere-viewer/virtual-tour-plugin';

	import '@photo-sphere-viewer/core/index.css';
	import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
	import '@photo-sphere-viewer/gallery-plugin/index.css';
	import '@photo-sphere-viewer/compass-plugin/index.css';

	import type { VirtualTourItem, VirtualTourPageBlocks } from '$lib/types/sanity';
	import { toPsvNodes } from '$lib/utils/psv';

	let {
		virtualTourItem,
		virtualTourPageBlocks,
		initialNodeId,
		nodeId,
		onnodechange
	}: {
		virtualTourItem: VirtualTourItem[];
		virtualTourPageBlocks: VirtualTourPageBlocks;
		/** Node the viewer opens on (already validated by the page load). */
		initialNodeId: string;
		/** Node requested by the page after load, e.g. on browser back/forward. */
		nodeId?: string;
		onnodechange?: (nodeId: string) => void;
	} = $props();

	let wrapper = $state<HTMLDivElement | null>(null);
	let virtualTour = $state.raw<VirtualTourPluginType | null>(null);

	$effect(() => {
		if (!wrapper || !virtualTourPageBlocks.start) return;

		// Read reactive values synchronously so the effect tracks them before the async gap
		const container = wrapper;
		const startId = initialNodeId;
		const loadingImg = virtualTourPageBlocks.loader ?? undefined;
		const nodes = toPsvNodes(virtualTourItem);
		const {
			defaultZoomLvl,
			minFov,
			maxFov,
			showGalleryOnLoad,
			transitionSpeed,
			autorotateEnabled,
			autorotateDelay,
			autorotateSpeed
		} = virtualTourPageBlocks;

		let viewer: Viewer | undefined;
		let cancelled = false;

		// PSV is ~650 kB; load it on demand so it stays out of the initial page bundle
		Promise.all([
			import('@photo-sphere-viewer/core'),
			import('@photo-sphere-viewer/virtual-tour-plugin'),
			import('@photo-sphere-viewer/gallery-plugin'),
			import('@photo-sphere-viewer/autorotate-plugin'),
			import('@photo-sphere-viewer/compass-plugin')
		]).then(
			([
				{ Viewer },
				{ VirtualTourPlugin },
				{ GalleryPlugin },
				{ AutorotatePlugin },
				{ CompassPlugin }
			]) => {
				if (cancelled) return;

				viewer = new Viewer({
					container,
					loadingImg,
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
								autorotateSpeed
							}
						],
						[
							CompassPlugin,
							{
								size: '120px',
								position: 'bottom right',
								navigation: true
							}
						],
						[
							GalleryPlugin,
							{
								thumbnailSize: { width: 100, height: 100 },
								visibleOnLoad: showGalleryOnLoad,
								hideOnClick: true,
								navigationArrows: true
							}
						],
						[
							VirtualTourPlugin,
							{
								renderMode: '3d',
								positionMode: 'manual',
								dataMode: 'client',
								preload: true,
								startNodeId: startId,
								linksOnCompass: true,
								transitionOptions: {
									showLoader: false,
									speed: transitionSpeed,
									rotation: true,
									effect: 'fade'
								},
								// Include all four fields — PSV does a shallow merge; missing maxPitch → NaN camera pitch → arrows invisible
								arrowsPosition: {
									minPitch: 0.2,
									maxPitch: Math.PI / 2,
									linkOverlapAngle: Math.PI / 4,
									linkPitchOffset: -0.1
								}
							}
						]
					]
				});

				const plugin = viewer.getPlugin(VirtualTourPlugin) as VirtualTourPluginType;
				plugin.addEventListener('node-changed', ({ node }) => onnodechange?.(node.id));
				plugin.setNodes(nodes, startId);
				virtualTour = plugin;
			}
		);

		return () => {
			cancelled = true;
			virtualTour = null;
			viewer?.destroy();
		};
	});

	$effect(() => {
		if (virtualTour && nodeId && virtualTour.getCurrentNode()?.id !== nodeId) {
			virtualTour.setCurrentNode(nodeId);
		}
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
