<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { years } from '$lib/years';

	export const load: Load = function () {
		return {
			stuff: {
				title: 'Years'
			}
		};
	};
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

	a {
		display: block;
		padding: 0.5rem;
	}
</style>
