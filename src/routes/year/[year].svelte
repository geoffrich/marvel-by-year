<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch }) {
		const start = page.query.get('start') ?? 0;
		const url = `/year/${page.params.year}.json?page=${start}`;
		const res = await fetch(url, { credentials: 'omit' });

		if (res.ok) {
			return {
				props: {
					response: await res.json(),
					year: page.params.year,
					start: parseInt(start)
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
	import { writable } from 'svelte/store';
	import type { ComicDataContainer, ComicDataWrapper, Comic } from '$lib/types/marvel';
	import ComicSummary from '$lib/components/ComicSummary.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import { default as dayjs } from 'dayjs';

	export let response: ComicDataWrapper;
	export let year: string;
	export let start: number;

	import { onMount } from 'svelte';

	onMount(() => {
		console.log('mounting');
	});

	const sortingOptions = ['name', 'date'];

	let sortBy = 'date';
	let searchText = '';

	$: comics = response.data.results;
	$: maxPage = getMaxPage(response.data);

	function getMaxPage(data: ComicDataContainer) {
		const { total, limit } = data;
		return Math.floor(total / limit);
	}

	$: series = [...new Set(comics.map((c) => c.series.name))].sort();
	$: selectedSeries = writable(new Set(series));

	// TODO: is there a way to update these based on the other selections?
	$: creators = [
		...new Set(
			comics.flatMap((c) => {
				const creators = c.creators.items;
				if (creators.length > 0) {
					return creators.map((cr) => cr.name);
				} else {
					return ['(unknown)'];
				}
			})
		)
	].sort();
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
				isCreatorSelected(c, selectedCreators) &&
				isEventSelected(c, selectedEvents)
		);
	}

	function isEventSelected(comic: Comic, selectedEvents: Set<string>) {
		const eventList = comic.events.items;

		return (
			eventList.find((e) => selectedEvents.has(e.name)) !== undefined ||
			(selectedEvents.has('(no event)') && eventList.length === 0)
		);
	}

	function isCreatorSelected(comic: Comic, selectedCreators: Set<string>) {
		const creatorList = comic.creators.items;

		return (
			creatorList.find((e) => selectedCreators.has(e.name)) !== undefined ||
			(selectedCreators.has('(unknown)') && creatorList.length === 0)
		);
	}
</script>

<h1>
	Comics for {year}
</h1>
{#if start > 0 || start < maxPage}
	<div class="links">
		{#if start > 0}
			<a href="/year/{year}?start={start - 1}" sveltekit:prefetch>Previous page</a>
		{/if}
		{#if start < maxPage}
			<a href="/year/{year}?start={start + 1}" sveltekit:prefetch>Next page</a>
		{/if}
	</div>
{/if}
<!-- TODO: better way to word this -->
<p>Displaying {filteredComics.length} of {comics.length} comics (Total: {response.data.total})</p>

<details>
	<summary>Filter</summary>
	<div class="search">
		<label>Search <input type="text" bind:value={searchText} /></label>
		<label for="sorting">Sort by</label>
	</div>
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

<small>{response.attributionText}</small>

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

	.links {
		display: flex;
		gap: 1rem;
	}

	.search {
		margin-bottom: 0.5rem;
	}
</style>
