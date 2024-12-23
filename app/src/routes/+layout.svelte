<script>
	import '$lib/styles/style.css';
	let { children } = $props();
</script>

<main class="container mx-auto py-8">
	{@render children()}
</main>
