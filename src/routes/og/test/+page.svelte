<script>
	import { years } from '$lib/years';

	function handleError(e) {
		e.target.style = 'display: none;';
	}
</script>

<div class="years">
	{#each years as year}
		<img src="/og/{year}.png" on:error={handleError} alt="" />
	{/each}
</div>

<style>
	.years {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}
</style>
