<script lang="ts">
	import { MAX_YEAR, MIN_YEAR } from '$lib/years';
	import { page } from '$app/stores';

	export let year: number;

	$: hasPrevious = year > MIN_YEAR;
	$: hasNext = year < MAX_YEAR;
	$: search = $page.url.search || '';
</script>

{#if hasPrevious || hasNext}
	<div class="links">
		{#if hasPrevious}
			<a href="/year/{year - 1}{search}">Previous year</a>
		{/if}
		{#if hasNext}
			<a href="/year/{year + 1}{search}">Next year</a>
		{/if}
	</div>
{/if}

<style>
	.links {
		display: flex;
		gap: var(--size-3);
	}

	a {
		padding: var(--size-1);
	}

	a:first-child {
		margin-left: var(--size-00);
	}
</style>
