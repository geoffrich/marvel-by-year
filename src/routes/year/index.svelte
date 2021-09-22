<script lang="ts">
	import { years } from '$lib/years';
</script>

<h1>Years</h1>
<p>Select a year to see all the comics available on Marvel Unlimited for that year.</p>
<ul>
	{#each years as year (year)}
		<li><a href="/year/{year}" sveltekit:prefetch>{year}</a></li>
	{/each}
</ul>

<style>
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, 50px);
		list-style: none;
		padding: 0;
		gap: 0.5rem;
		justify-content: center;
	}

	li {
		background-color: var(--secondary);
	}

	ul a {
		display: block;
		padding: 0.5rem;
	}
</style>
