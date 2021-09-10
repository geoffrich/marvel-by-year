<script lang="ts">
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import { navigating } from '$app/stores';
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
