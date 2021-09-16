<script lang="ts">
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import { navigating } from '$app/stores';
	import '../global.css';
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<nav>
	<a href="/">Home</a>
</nav>

<main>
	<slot />
</main>

<footer>
	Built by <a href="https://geoffrich.net/">Geoff</a> with
	<a rel="noreferrer" href="https://kit.svelte.dev/">SvelteKit</a>.
</footer>

<style>
	:global(body) {
		max-width: 1024px;
		margin-left: auto;
		margin-right: auto;
		padding: 1rem;
	}

	:global(div#svelte) {
		display: grid;
		grid-template-rows: auto 1fr auto;
	}
</style>
