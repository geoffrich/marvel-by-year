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
	import { writable } from 'svelte/store';
	import type { ComicDataWrapper, Comic } from '$lib/types/marvel';
	import ComicSummary from '$lib/components/ComicSummary.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import { default as dayjs } from 'dayjs';

	export let data: ComicDataWrapper;

	let year = $page.params.year;

	const sortingOptions = ['name', 'date'];

	let sortBy = 'date';
	let searchText = '';

	$: comics = data.data.results;

	$: series = [...new Set(comics.map((c) => c.series.name))].sort();
	$: selectedSeries = writable(new Set(series));

	// TODO: is there a way to update these based on the other selections?
	$: creators = [...new Set(comics.flatMap((c) => c.creators.items.map((cr) => cr.name)))].sort();
	$: selectedCreators = writable(new Set(creators));

	$: events = [
		...new Set(
			comics.flatMap((c) => {
				const events = c.events.items;
				if (events.length > 0) {
					return events.map((e) => e.name);
				} else {
					return ['(no event)'];
				}
			})
		)
	].sort();
	$: selectedEvents = writable(new Set(events));

	$: filteredComics = filterComics(
		comics,
		searchText,
		$selectedSeries,
		$selectedCreators,
		$selectedEvents
	);

	$: sortedComics = filteredComics.sort((a, b) =>
		sortBy === 'date' ? getComicDate(a).diff(getComicDate(b)) : compareStrings(a.title, b.title)
	);

	function getComicDate(comic: Comic) {
		return dayjs(comic.dates.find((d) => d.type === 'onsaleDate').date);
	}

	function compareStrings(a, b) {
		if (a < b) {
			return -1;
		}

		if (a > b) {
			return 1;
		}

		return 0;
	}

	function filterComics(
		comics: Comic[],
		searchText: string,
		selectedSeries: Set<string>,
		selectedCreators: Set<string>,
		selectedEvents: Set<string>
	) {
		return comics.filter(
			// TODO: this is gross
			(c) =>
				(searchText ? c.title.toUpperCase().includes(searchText.toUpperCase()) : true) &&
				selectedSeries.has(c.series.name) &&
				// TODO: handle no creators
				c.creators.items.find((cr) => selectedCreators.has(cr.name)) !== undefined &&
				(c.events.items.find((cr) => selectedEvents.has(cr.name)) !== undefined ||
					(selectedEvents.has('(no event)') && c.events.items.length === 0))
		);
	}
</script>

<h1>Comics for {year}</h1>
<details open>
	<summary>Filter</summary>
	<p>Displaying {filteredComics.length} of {comics.length} comics</p>
	<label>Search <input type="text" bind:value={searchText} /></label>
	<label for="sorting">Sort by</label>
	<select id="sorting" bind:value={sortBy}>
		{#each sortingOptions as opt (opt)}
			<option>{opt}</option>
		{/each}
	</select>
	<div class="filters">
		<Filter items={series} legend="Series" included={selectedSeries} />
		<Filter items={creators} legend="Creators" included={selectedCreators} />
		<Filter items={events} legend="Events" included={selectedEvents} />
	</div>
</details>
<ul>
	{#each sortedComics as comic (comic.id)}
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
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media screen and (min-width: 450px) {
		ul {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	}

	.filters {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}
</style>
