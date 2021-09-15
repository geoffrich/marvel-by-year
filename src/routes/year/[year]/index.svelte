<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch }) {
		const url = `/year/${page.params.year}.json`;
		const res = await fetch(url, { credentials: 'omit' });
		const response: ComicDataWrapper = await res.json();

		if (res.ok) {
			return {
				props: {
					response,
					year: parseInt(page.params.year)
				},
				maxage: 86400
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script lang="ts">
	import type { ComicDataContainer, ComicDataWrapper, Comic } from '$lib/types/marvel';
	import ComicSummary from '$lib/components/ComicSummary.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import PageLinks from '$lib/components/PageLinks.svelte';
	import { createSelectedStores } from '$lib/stores/selected';
	import {
		getSeries,
		getCreators,
		getEvents,
		compareDates,
		compareTitles,
		isEventSelected,
		isCreatorSelected
	} from '$lib/comics';
	import { prefetch } from '$app/navigation';
	import { browser } from '$app/env';
	import { onDestroy } from 'svelte';

	export let response: ComicDataWrapper;
	export let year: number;

	const sortingOptions = ['name', 'date'];

	let sortBy = 'date';
	let searchText = '';

	// remove duplicate comics from the list
	$: comics = response.data.results.filter(
		(c, idx) => response.data.results.findIndex((c2) => c.id === c2.id) === idx
	);

	$: title = `Comics for ${year}`;

	// TODO: prefetch next year?
	// $: if (browser && maxPage > start) {
	// 	prefetch(`/year/${year}/${start + 1}`);
	// }

	function getMaxPage(data: ComicDataContainer) {
		const { total, limit } = data;
		return Math.floor(total / limit);
	}

	// TODO: refactor this if we're loading all comics at once
	// possibly persist filters across years? but don't keep adding to list
	let [series, selectedSeries, unsub1] = createSelectedStores(getSeries);
	$: series.applyNewComics(comics);

	let [creators, selectedCreators, unsub2] = createSelectedStores(getCreators);
	$: creators.applyNewComics(comics);

	let [events, selectedEvents, unsub3] = createSelectedStores(getEvents);
	$: events.applyNewComics(comics);

	onDestroy(() => {
		unsub1();
		unsub2();
		unsub3();
	});

	$: filteredComics = filterComics(
		comics,
		searchText,
		$selectedSeries,
		$selectedCreators,
		$selectedEvents
	);

	$: sortedComics = filteredComics.sort(sortBy === 'date' ? compareDates : compareTitles);

	function filterComics(
		comics: Comic[],
		searchText: string,
		selectedSeries: Set<string>,
		selectedCreators: Set<string>,
		selectedEvents: Set<string>
	) {
		return comics.filter(
			(c) =>
				(searchText ? c.title.toUpperCase().includes(searchText.toUpperCase()) : true) &&
				selectedSeries.has(c.series.name) &&
				isCreatorSelected(c, selectedCreators) &&
				isEventSelected(c, selectedEvents)
		);
	}

	function resetFilters() {
		$selectedCreators = new Set($creators);
		$selectedSeries = new Set($series);
		$selectedEvents = new Set($events);
		searchText = '';
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1>{title}</h1>
<PageLinks {year} />

<p>
	Displaying comics {comics.length} comics
</p>
<p>
	(Filtered: {filteredComics.length} / {comics.length})
	<button on:click={resetFilters}>Reset filters</button>
</p>

<details>
	<summary>Filter</summary>
	<div class="search">
		<div>
			<label>Search <input type="text" bind:value={searchText} /></label>
		</div>
		<div>
			<label for="sorting">Sort by</label>
			<select id="sorting" bind:value={sortBy}>
				{#each sortingOptions as opt (opt)}
					<option>{opt}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="filters">
		<Filter items={$series} legend="Series" included={selectedSeries} />
		<Filter items={$creators} legend="Creators" included={selectedCreators} />
		<Filter items={$events} legend="Events" included={selectedEvents} />
	</div>
</details>

<ul>
	{#each sortedComics as comic, idx (comic.id)}
		<li>
			<ComicSummary {comic} lazyLoad={idx > 10} />
		</li>
	{:else}
		<li>Nothing to show!</li>
	{/each}
</ul>
<PageLinks {year} />

<p>{response.attributionText}</p>

<style>
	ul {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.filters {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 0.5rem;
	}

	.search {
		margin: 0.5rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input,
	select {
		font-size: inherit;
	}

	@media screen and (min-width: 450px) {
		ul {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}

		.search {
			flex-direction: row;
		}
	}
</style>
