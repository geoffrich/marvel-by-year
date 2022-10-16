<script lang="ts">
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import { navigating, page } from '$app/stores';
	import 'focus-visible'; // polyfill :focus-visible for Safari
	import '../global.css';

	$: title = $page.data.title;
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<svelte:head>
	<title>{title ? title + ' | ' : ''}MU by Year</title>
	<meta property="og:site_name" content="Marvel Unlimited by Year" />
	<meta property="og:title" content="{title} - Marvel Unlimited by Year" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://marvel.geoffrich.net/" />
	<meta
		property="og:description"
		content={$page.data.description || 'See what issues are available on MU for a given year.'}
	/>
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@geoffrich_" />
	{#if $page.data.image}
		<meta content={$page.data.image} property="og:image" />
	{/if}
</svelte:head>

<nav data-sveltekit-prefetch>
	<a href="/">Home</a>
	<a href="/year">Years</a>
	<a href="/comic/random">Random Comic</a>
	<a href="/year/random">Random Year</a>
</nav>

<main class="spaced">
	<slot />
</main>

<footer>
	Site built by <a href="https://geoffrich.net/">Geoff</a> with
	<a href="https://kit.svelte.dev/">SvelteKit</a>.
</footer>

<style>
	:global(body) {
		max-width: 64rem;
		margin-left: auto;
		margin-right: auto;
		padding: var(--size-3);
		padding-bottom: 0;
	}

	:global(div#svelte) {
		display: flex;
		flex-direction: column;
	}

	nav {
		margin-left: var(--size-1);
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--size-3);
		font-size: var(--font-size-2);
		margin-bottom: var(--size-3);
	}

	footer {
		margin-top: auto;
		padding: var(--size-3) 0;
	}

	nav a {
		padding: var(--size-1);
	}
</style>
