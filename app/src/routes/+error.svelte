<script lang="ts">
	import { page } from '$app/state';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Tour unavailable'}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="error-page">
	<p class="status">{page.status}</p>
	{#if notFound}
		<h1>This page doesn't exist</h1>
		<p>The link may be mistyped, or the page may have moved.</p>
	{:else}
		<h1>The tour couldn't load</h1>
		<p>
			We couldn't reach the tour's content just now. This is usually temporary — please try again
			in a moment.
		</p>
	{/if}
	<div class="actions">
		{#if !notFound}
			<button type="button" onclick={() => location.reload()}>Try again</button>
		{/if}
		<a href="/">Go to the tour</a>
	</div>
</div>

<style>
	.error-page {
		max-width: 32rem;
		margin: 18vh auto 0;
		padding: 0 1.5rem;
		text-align: center;
		line-height: 1.6;
	}

	.status {
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		opacity: 0.5;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--primary-color);
		margin: 0.25rem 0 0.75rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		margin-top: 1.5rem;
	}

	.actions button {
		padding: 0.6rem 1.4rem;
		border-radius: 0.375rem;
	}

	.actions a {
		color: var(--primary-color);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
