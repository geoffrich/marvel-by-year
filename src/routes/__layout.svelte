<script context="module" lang="ts">
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import { navigating, page } from '$app/stores';
	import 'focus-visible'; // polyfill :focus-visible for Safari
	import '../global.css';
</script>

<script lang="ts">
	$: title = $page.stuff.title;
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<svelte:head>
	<title>{title ? title + ' | ' : ''}MU by Year</title>
</svelte:head>

<nav>
	<a href="/" sveltekit:prefetch>Home</a>
	<a href="/year" sveltekit:prefetch>Years</a>
	<a href="/comic/random" sveltekit:prefetch>Random Comic</a>
	<a href="/year/random" sveltekit:prefetch>Random Year</a>
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
