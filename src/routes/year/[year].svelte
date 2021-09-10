<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const url = `/year/${page.params.year}.json`;
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					data: await res.json()
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import type { ComicDataWrapper } from '$lib/types/marvel';
	import ComicSummary from '$lib/components/ComicSummary.svelte';

	export let data: ComicDataWrapper;

	let year = $page.params.year;

	$: comics = data.data.results;
	$: series = [...new Set(comics.map((c) => c.series.name))].sort();

	$: selectedSeries = new Set(series);

	function handleChange({ target }) {
		if (target.checked) {
			selectedSeries.add(target.value);
		} else {
			selectedSeries.delete(target.value);
		}

		selectedSeries = selectedSeries;
	}

	function uncheckAll() {
		selectedSeries.clear();
		selectedSeries = selectedSeries;
	}

	function checkAll() {
		selectedSeries = new Set(series);
	}
</script>

<h1>Comics for {year}</h1>
<details>
	<summary>Filter</summary>
	<fieldset>
		<legend>Series</legend>
		<button on:click={checkAll}>Check all</button>
		<button on:click={uncheckAll}>Uncheck all</button>
		{#each series as s (s)}
			<label
				><input
					on:change={handleChange}
					type="checkbox"
					checked={selectedSeries.has(s)}
					value={s}
				/>
				{s}</label
			>
		{/each}
	</fieldset>
</details>
<ul>
	{#each comics.filter((c) => selectedSeries.has(c.series.name)) as comic (comic.id)}
		<li>
			<ComicSummary {comic} />
		</li>
	{:else}
		<li>Nothing to show!</li>
	{/each}
</ul>

<small>{data.attributionText}</small>

<style>
	ul {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}

	label {
		display: block;
	}

	fieldset {
		height: 300px;
		overflow: auto;
	}
</style>
