<script lang="ts">
	import Virtual from '$lib/components/Virtual.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let e = data.e;
</script>

<svelte:head>
	<title>{e.virtualTourPageBlocks.title}</title>
	<meta name="description" content={e.virtualTourPageBlocks.description} />
	<meta property="og:title" content={e.virtualTourPageBlocks.title} />
	<meta property="og:description" content={e.virtualTourPageBlocks.description} />
	<meta property="og:type" content="website" />
</svelte:head>

<h1>{e.virtualTourPageBlocks.title}</h1>
<p>{e.virtualTourPageBlocks.description}</p>
<div class="app">
	<Virtual virtualTourPageBlocks={e.virtualTourPageBlocks} virtualTourItem={e.virtualTourItem} />
</div>

<style>
	.app {
		margin: 0;
		width: 80vw;
		height: 80vh;
		font-family: sans-serif;
	}
</style>
