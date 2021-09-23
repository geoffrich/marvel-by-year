<script context="module" lang="ts">
	// https://italonascimento.github.io/applying-a-timeout-to-your-promises/
	const promiseTimeout = function (ms, promise) {
		// Create a promise that rejects in <ms> milliseconds
		let timeout = new Promise((_, reject) => {
			let id = setTimeout(() => {
				clearTimeout(id);
				reject('Timed out in ' + ms + 'ms.');
			}, ms);
		});

		// Returns a race between our timeout and the passed in promise
		return Promise.race([promise, timeout]);
	};

	const DEFAULT_TIMEOUT = 9000;

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch }) {
		const url = `/year/${page.params.year}.json?${page.query.toString()}`;
		// Netlify functions have a execution time limit of 10 seconds
		// The Marvel API can be slow and take 20+ seconds in some cases
		// If we don't hear back in time, throw an error so the user can easily retry
		try {
			const res = await promiseTimeout(DEFAULT_TIMEOUT, fetch(url, { credentials: 'omit' }));
			const response: ComicResponse = await res.json();

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
		} catch (e) {
			console.log(page.params.year, e);
			return {
				status: 500,
				error: e
			};
		}
	}
</script>

<script lang="ts">
	import type { ComicResponse, Comic } from '$lib/types';
	import ComicSummary from '$lib/components/ComicSummary.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import PageLinks from '$lib/components/PageLinks.svelte';
	import { createSelectedStores } from '$lib/stores/selected';
	import titleStore from '$lib/stores/title';
	import {
		getSeries,
		getCreators,
		getEvents,
		compareDates,
		compareTitles,
		isEventSelected,
		isCreatorSelected,
		compareUnlimitedDates
	} from '$lib/comics';
	import { onDestroy } from 'svelte';
	import { matchSorter } from 'match-sorter';
	import type { MatchSorterOptions } from 'match-sorter';

	export let response: ComicResponse;
	export let year: number;

	enum SortOption {
		BestMatch = 'best match',
		Title = 'title',
		PublishDate = 'publish date',
		UnlimitedDate = 'unlimited date'
	}

	const sortingOptions = Object.values(SortOption);

	let sortBy = SortOption.BestMatch;
	let searchText = '';
	let timer: ReturnType<typeof setTimeout>;
	let sortDescending = true;

	function updateSearchText(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			searchText = (e.target as HTMLInputElement).value;
		}, 250);
	}

	$: comics = response.comics;
	$: title = `Comics for ${year}`;
	$: $titleStore = title;

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

	// TODO: can this be more efficient?
	// with simulated CPU slowdown, there's lag when clearing the text field
	$: filteredComics = filterComics(comics, $selectedSeries, $selectedCreators, $selectedEvents);

	$: sortedComics = sortComics(filteredComics, sortBy, searchText);

	$: orderedComics = sortDescending ? sortedComics : [...sortedComics].reverse();

	function filterComics(
		comics: Comic[],
		selectedSeries: Set<string>,
		selectedCreators: Set<string>,
		selectedEvents: Set<string>
	) {
		let noCreatorsSelected = selectedCreators.size === $creators.size;
		let noEventsSelected = selectedEvents.size === $events.size;
		let noSeriesSelected = selectedSeries.size === $series.size;
		if (noCreatorsSelected && noEventsSelected && noSeriesSelected) {
			return comics;
		}
		return comics.filter(
			(c) =>
				(noSeriesSelected || selectedSeries.has(c.series.name)) &&
				(noCreatorsSelected || isCreatorSelected(c, selectedCreators)) &&
				(noEventsSelected || isEventSelected(c, selectedEvents))
		);
	}

	function sortComics(comics: Comic[], sortBy: string, searchText: string) {
		let sortFunction: MatchSorterOptions<Comic>['sorter'];

		switch (sortBy) {
			case SortOption.PublishDate:
				sortFunction = (matchItems) => matchItems.sort((a, b) => compareDates(a.item, b.item));
				break;
			case SortOption.Title:
				sortFunction = (matchItems) => matchItems.sort((a, b) => compareTitles(a.item, b.item));
				break;
			case SortOption.UnlimitedDate:
				sortFunction = (matchItems) =>
					matchItems.sort((a, b) => compareUnlimitedDates(a.item, b.item));
				break;
		}

		const matchedComics = matchSorter(comics, searchText, {
			keys: ['title'],
			// baseSort tie-breaks items that have the same ranking
			// when there's no search text (i.e. all items have same ranking), sort by date
			baseSort: searchText
				? (a, b) => compareTitles(a.item, b.item)
				: (a, b) => compareDates(a.item, b.item),
			// sorter sorts the items after matching them
			// using a custom function here means the items are sorted by something other than rank
			sorter: sortFunction
		});
		return matchedComics;
	}

	function resetFilters() {
		$selectedCreators = new Set($creators);
		$selectedSeries = new Set($series);
		$selectedEvents = new Set($events);
		searchText = '';
	}
</script>

<h1>{title}</h1>
<PageLinks {year} />

<p>
	Displaying {comics.length} comics
</p>
<p>
	(Filtered: {sortedComics.length} / {comics.length})
	<button on:click={resetFilters}>Reset filters</button>
</p>

<div class="search">
	<div>
		<label
			>Search <input
				type="text"
				autocomplete="off"
				autocorrect="off"
				autocapitalize="off"
				spellcheck="false"
				value={searchText}
				on:input={updateSearchText}
			/></label
		>
	</div>
	<div>
		<label for="sorting">Sort by</label>
		<select id="sorting" bind:value={sortBy}>
			{#each sortingOptions as opt (opt)}
				<option>{opt}</option>
			{/each}
		</select>
	</div>
	<div>
		<label><input type="checkbox" bind:checked={sortDescending} />Descending</label>
	</div>
</div>

<details>
	<summary>Filter</summary>
	<div class="filters">
		<Filter items={$series} legend="Series" included={selectedSeries} />
		<Filter items={$creators} legend="Creators" included={selectedCreators} />
		<Filter items={$events} legend="Events" included={selectedEvents} />
	</div>
</details>

<ul>
	{#each orderedComics as comic, idx (comic.id)}
		<li>
			<ComicSummary
				{comic}
				lazyLoad={idx > 10}
				showUnlimitedDate={sortBy === SortOption.UnlimitedDate}
			/>
		</li>
	{:else}
		<li>Nothing to show!</li>
	{/each}
</ul>
<PageLinks {year} />

{#if response.attr}
	<p>{response.attr}</p>
{/if}

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
		flex-wrap: wrap;
	}

	input,
	select {
		font-size: inherit;
	}

	input[type='checkbox'] {
		height: 1rem;
		width: 1rem;
		margin-right: 0.25rem;
	}

	summary {
		padding: 0.5rem;
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
