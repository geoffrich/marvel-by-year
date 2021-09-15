<script lang="ts">
	import { MAX_YEAR, MIN_YEAR } from '$lib/years';

	export let year: number;

	$: hasPrevious = year > MIN_YEAR;
	$: hasNext = year < MAX_YEAR;
</script>

{#if hasPrevious || hasNext}
	<div class="links">
		{#if hasPrevious}
			<a href="/year/{year - 1}" sveltekit:prefetch>Previous year</a>
		{/if}
		{#if hasNext}
			<a href="/year/{year + 1}" sveltekit:prefetch>Next year</a>
		{/if}
	</div>
{/if}

<style>
	.links {
		display: flex;
		gap: 1rem;
	}
</style>
