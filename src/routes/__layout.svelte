<script lang="ts">
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import { navigating } from '$app/stores';
	import '../global.css';
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<nav>
	<a href="/" sveltekit:prefetch>Home</a>
	<a href="/year" sveltekit:prefetch>Years</a>
	<a href="/comic/random" sveltekit:prefetch>Random Comic</a>
</nav>

<main>
	<slot />
</main>

<footer>
	Site built by <a href="https://geoffrich.net/">Geoff</a> with
	<a href="https://kit.svelte.dev/">SvelteKit</a>.
</footer>

<style>
	:global(body) {
		max-width: 1024px;
		margin-left: auto;
		margin-right: auto;
		padding: 1rem;
		padding-bottom: 0;
	}

	:global(div#svelte) {
		display: flex;
		flex-direction: column;
	}

	nav {
		display: flex;
		gap: 1rem;
	}

	footer {
		margin-top: auto;
		padding: 1rem 0;
	}
</style>
