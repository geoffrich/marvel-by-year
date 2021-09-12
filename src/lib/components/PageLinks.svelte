<script lang="ts">
	export let current;
	export let max;
	export let year;
</script>

{#if current > 0 || current < max}
	<div class="links">
		{#if current > 0}
			<a href="/year/{year}/{current - 1}" sveltekit:prefetch>Previous page</a>
		{/if}
		{#if current < max}
			<a href="/year/{year}/{current + 1}" sveltekit:prefetch>Next page</a>
		{/if}
	</div>
{/if}

<style>
	.links {
		display: flex;
		gap: 1rem;
	}
</style>
