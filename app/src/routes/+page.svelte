<script lang="ts">
	import Virtual from '$lib/components/Virtual.svelte';
	import { page } from '$app/state';
	import { pushState, replaceState } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const tour = $derived(data.tour);

	// Keep ?node= in sync with the viewer so every scene has a shareable link. The first scene
	// replaces the history entry; later moves push one, so Back steps through visited scenes.
	// Shallow routing leaves page.url at the originally loaded URL, so the scene shown for each
	// history entry lives in page.state (restored by SvelteKit on Back/Forward).
	function handleNodeChange(nodeId: string) {
		if (nodeId === page.state.nodeId) return;
		const url = new URL(page.url);
		url.searchParams.set('node', nodeId);
		if (page.state.nodeId) pushState(url, { nodeId });
		else replaceState(url, { nodeId });
	}
</script>

<svelte:head>
	<title>{tour.virtualTourPageBlocks.title}</title>
	<meta name="description" content={tour.virtualTourPageBlocks.description} />
	<meta property="og:title" content={tour.virtualTourPageBlocks.title} />
	<meta property="og:description" content={tour.virtualTourPageBlocks.description} />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="page">
	<header class="tour-header">
		<div class="tour-info">
			<h1 class="tour-title">{tour.virtualTourPageBlocks.title}</h1>
			{#if tour.virtualTourPageBlocks.description}
				<p class="tour-description">{tour.virtualTourPageBlocks.description}</p>
			{/if}
		</div>
		<a href="/health" class="health-link">Health Check</a>
	</header>
	<div class="viewer-container">
		{#if data.initialNodeId}
			<Virtual
				virtualTourPageBlocks={tour.virtualTourPageBlocks}
				virtualTourItem={tour.virtualTourItem}
				initialNodeId={data.initialNodeId}
				nodeId={page.state.nodeId}
				onnodechange={handleNodeChange}
			/>
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

	.viewer-container {
		flex: 1;
		min-height: 0;
	}
</style>
