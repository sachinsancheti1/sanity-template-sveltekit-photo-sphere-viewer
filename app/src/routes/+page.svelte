<script lang="ts">
	import Virtual from '$lib/components/Virtual.svelte';
	import { page } from '$app/state';
	import { pushState, replaceState } from '$app/navigation';
	import { previewImageUrl } from '$lib/utils/psv';
	import { VIEW_PARAMS, buildShareUrl } from '$lib/utils/view';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const tour = $derived(data.tour);
	const blocks = $derived(tour.virtualTourPageBlocks);
	const sceneLabels = $derived(
		new Map(tour.virtualTourItem.map((item) => [item.id, item.caption ?? item.name]))
	);

	// Link previews describe the scene the link opens on: a shared ?node= link names its scene
	const landingItem = $derived(tour.virtualTourItem.find((item) => item.id === data.initialNodeId));
	const sharedScene = $derived(
		page.url.searchParams.get('node') === data.initialNodeId
			? (landingItem?.caption ?? landingItem?.name)
			: null
	);
	const title = $derived(blocks?.title ?? 'Virtual Tour');
	const shareTitle = $derived(sharedScene ? `${sharedScene} · ${title}` : title);
	// The tab title follows the visitor once they move away from the scene they landed on
	const visitedScene = $derived(
		page.state.nodeId && page.state.nodeId !== data.initialNodeId
			? sceneLabels.get(page.state.nodeId)
			: null
	);
	const documentTitle = $derived(visitedScene ? `${visitedScene} · ${title}` : shareTitle);
	// Canonical link: the tour, plus ?node= only for a valid shared scene (drops stale/unknown IDs)
	const shareUrl = $derived.by(() => {
		const url = new URL(page.url.pathname, page.url.origin);
		if (sharedScene && data.initialNodeId) url.searchParams.set('node', data.initialNodeId);
		return url.href;
	});
	const shareImage = $derived(
		landingItem?.panorama ? previewImageUrl(landingItem.panorama) : undefined
	);

	// Keep ?node= in sync with the viewer so every scene has a shareable link. The first scene
	// replaces the history entry; later moves push one, so Back steps through visited scenes.
	// Shallow routing leaves page.url at the originally loaded URL, so the scene shown for each
	// history entry lives in page.state (restored by SvelteKit on Back/Forward).
	function handleNodeChange(nodeId: string) {
		if (nodeId === page.state.nodeId) return;
		const url = new URL(page.url);
		url.searchParams.set('node', nodeId);
		// A shared view only describes the scene it was shared from
		for (const param of VIEW_PARAMS) url.searchParams.delete(param);
		if (page.state.nodeId) pushState(url, { nodeId });
		else replaceState(url, { nodeId });
	}

	// Share the exact view: the system share sheet on touch devices, the clipboard elsewhere.
	// Returns the confirmation for the viewer to display, if any.
	async function handleShare(view: {
		nodeId: string;
		position: { yaw: number; pitch: number };
		zoom: number;
	}): Promise<string | undefined> {
		const url = buildShareUrl(page.url, view.nodeId, view.position, view.zoom);
		const label = sceneLabels.get(view.nodeId);
		const shareTitle = label ? `${label} · ${title}` : title;

		if (navigator.share && matchMedia('(pointer: coarse)').matches) {
			try {
				await navigator.share({ title: shareTitle, url });
				return undefined;
			} catch (err) {
				if ((err as Error).name === 'AbortError') return undefined;
			}
		}
		try {
			await navigator.clipboard.writeText(url);
			return 'Link to this view copied';
		} catch {
			window.prompt('Copy this link:', url);
			return undefined;
		}
	}
</script>

<svelte:head>
	<title>{documentTitle}</title>
	<meta name="description" content={blocks?.description} />
	<meta property="og:title" content={shareTitle} />
	<meta property="og:description" content={blocks?.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={shareUrl} />
	{#if shareImage}
		<meta property="og:image" content={shareImage} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

<div class="page">
	<header class="tour-header">
		<div class="tour-info">
			<h1 class="tour-title">{title}</h1>
			{#if blocks?.description}
				<p class="tour-description">{blocks.description}</p>
			{/if}
		</div>
		<a href="/health" class="health-link">Health Check</a>
	</header>
	<div class="viewer-container">
		{#if blocks && data.initialNodeId}
			<Virtual
				virtualTourPageBlocks={blocks}
				virtualTourItem={tour.virtualTourItem}
				initialNodeId={data.initialNodeId}
				initialView={data.initialView}
				nodeId={page.state.nodeId}
				onnodechange={handleNodeChange}
				onshare={handleShare}
			/>
		{:else}
			<div class="setup-notice">
				<h2>This tour isn't set up yet</h2>
				<p>
					In the Studio, open <strong>Virtual Tour → Virtual Tour Section</strong>,
					{#if data.setupIssue === 'no-tour-page'}
						fill in the <strong>Title</strong> and <strong>Starting Node</strong>,
					{:else}
						choose a <strong>Starting Node</strong>,
					{/if}
					and publish.
				</p>
				<p class="setup-hint">
					{tour.virtualTourItem.length} scene{tour.virtualTourItem.length === 1 ? '' : 's'} published
					so far.
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
	}

	.tour-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1.25rem;
		background: var(--primary-color);
		color: white;
		flex-shrink: 0;
		gap: 1rem;
	}

	.tour-info {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		min-width: 0;
	}

	.tour-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	.tour-description {
		margin: 0;
		font-size: 0.8rem;
		opacity: 0.8;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		flex-shrink: 100;
	}

	@media (max-width: 640px) {
		.tour-description {
			display: none;
		}
	}

	.health-link {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		font-size: 0.8rem;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.health-link:hover {
		color: white;
	}

	.setup-notice {
		max-width: 32rem;
		margin: 15vh auto 0;
		padding: 0 1.5rem;
		text-align: center;
		line-height: 1.6;
	}

	.setup-notice h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--primary-color);
	}

	.setup-hint {
		margin-top: 1rem;
		font-size: 0.85rem;
		opacity: 0.7;
	}

	.viewer-container {
		flex: 1;
		min-height: 0;
	}
</style>
