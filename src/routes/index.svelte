<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { years } from '$lib/years';
</script>

<svelte:head>
	<title>Browse Marvel Unlimited by Year</title>
</svelte:head>

<h1>Browse Marvel Unlimited by Year</h1>
<h2>Jump to a year</h2>
<ul>
	{#each years as year (year)}
		<li><a href="/year/{year}/0">{year}</a></li>
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
