<script lang="ts">
	import Virtual from '$lib/components/Virtual.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const tour = $derived(data.tour);
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
		<Virtual
			virtualTourPageBlocks={tour.virtualTourPageBlocks}
			virtualTourItem={tour.virtualTourItem}
		/>
	</div>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
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
	}

	.tour-description {
		margin: 0;
		font-size: 0.8rem;
		opacity: 0.8;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
