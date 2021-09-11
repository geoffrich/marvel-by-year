<script lang="ts">
	import { default as dayjs } from 'dayjs';
	const MAX_YEAR = dayjs().year();
	const MIN_YEAR = 1939;

	const years = Array.from(Array(MAX_YEAR - MIN_YEAR + 1).keys()).map((x) => x + MIN_YEAR);
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
		gap: 2px;
	}

	li {
		background-color: var(--secondary);
	}

	a {
		display: block;
		padding: 0.5rem;
	}
</style>
