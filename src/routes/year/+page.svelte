<script lang="ts">
	import { years } from '$lib/years';
</script>

<h1>Years</h1>
<p>Select a year to see all the comics available on Marvel Unlimited for that year.</p>
<ul>
	{#each years as year (year)}
		<li><a href="/year/{year}">{year}</a></li>
	{/each}
</ul>

<style>
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, var(--size-9));
		list-style: none;
		padding: 0;
		gap: var(--size-2);
		justify-content: center;
	}

	li {
		padding: 0;
	}

	a {
		background-color: var(--secondary);
		color: var(--primary);
		display: block;
		padding: var(--size-2);
		margin: 0;
		width: 100%;
		text-align: center;
	}

	a:focus {
		color: white;
		background-color: var(--primary);
	}
</style>
