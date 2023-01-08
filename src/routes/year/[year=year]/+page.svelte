<script lang="ts">
	import type { PageData } from './$types';
	import type { Comic } from '$lib/types';
	import ComicSummary from '$lib/components/ComicSummary.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import PageLinks from '$lib/components/PageLinks.svelte';
	import ComicGrid from '$lib/components/ComicGrid.svelte';
	import Select from '$lib/components/form/Select.svelte';
	import { createSelectedStores } from '$lib/stores/selected';
	import {
		getSeries,
		getCreators,
		getEvents,
		compareDates,
		compareTitles,
		isEventSelected,
		isCreatorSelected,
		compareUnlimitedDates,
		getOnSaleDate
	} from '$lib/comics';
	import { matchSorter } from 'match-sorter';
	import type { MatchSorterOptions } from 'match-sorter';
	import { page } from '$app/stores';
	import debounce from 'just-debounce-it';
	import { goto } from '$app/navigation';
	import { SortOption, Month, sortOptionText } from './util';

	export let data: PageData;

	const sortingOptions = Object.values(SortOption);
	const months = Object.values(Month);

	$: monthIndex = months.indexOf(data.month) - 1;

	$: comics = data.response.comics;

	let [series, selectedSeries] = createSelectedStores(getSeries);
	$: series.applyNewComics(comics);

	let [creators, selectedCreators] = createSelectedStores(getCreators);
	$: creators.applyNewComics(comics);

	let [events, selectedEvents] = createSelectedStores(getEvents);
	$: events.applyNewComics(comics);

	// TODO: can this be more efficient?
	// with simulated CPU slowdown, there's lag when clearing the text field
	$: filteredComics = filterComics(
		comics,
		$selectedSeries,
		$selectedCreators,
		$selectedEvents,
		monthIndex
	);

	$: sortedComics = sortComics(filteredComics, data.sortBy, data.search);

	$: orderedComics = data.ascending ? [...sortedComics].reverse() : sortedComics;

	function filterComics(
		comics: Comic[],
		selectedSeries: Set<string>,
		selectedCreators: Set<string>,
		selectedEvents: Set<string>,
		monthIndex: number
	) {
		let noCreatorsSelected = selectedCreators.size === $creators.size;
		let noEventsSelected = selectedEvents.size === $events.size;
		let noSeriesSelected = selectedSeries.size === $series.size;
		return comics.filter(
			(c) =>
				(monthIndex < 0 || getOnSaleDate(c).month() == monthIndex) &&
				(noSeriesSelected || selectedSeries.has(c.series.name)) &&
				(noCreatorsSelected || isCreatorSelected(c, selectedCreators)) &&
				(noEventsSelected || isEventSelected(c, selectedEvents))
		);
	}

	function sortComics(comics: Comic[], sortBy: keyof typeof SortOption, searchText: string) {
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
		goto($page.url.pathname, { replaceState: true, keepFocus: true, noScroll: true });
	}

	let form: HTMLFormElement;
	// todo: handle lack of support
	const requestSubmit = () => form.requestSubmit();
	const debouncedSubmit = debounce(requestSubmit, 250);

	export function submitReplaceState(e: SubmitEvent) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const url = new URL(form.action);
		// @ts-expect-error
		const params = new URLSearchParams(new FormData(form));
		url.search = params.toString();
		goto(url, { replaceState: true, keepFocus: true, noScroll: true });
	}
</script>

<h1>{$page.data.title || `Comics for ${data.year}`}</h1>
<PageLinks year={data.year} />

<p>
	Displaying {comics.length} comics
</p>
<p>
	(Filtered: {sortedComics.length} / {comics.length})
	<button class="reset" on:click={resetFilters}>Reset filters</button>
</p>

<form
	class="search"
	bind:this={form}
	on:submit={submitReplaceState}
	on:input={debouncedSubmit}
	on:change={requestSubmit}
>
	<div>
		<label
			>Search <input
				type="text"
				autocomplete="off"
				autocorrect="off"
				autocapitalize="off"
				spellcheck="false"
				value={data.search}
				name="search"
			/></label
		>
	</div>
	<div>
		<Select
			options={sortOptionText}
			values={sortingOptions}
			id="sorting"
			name="sortBy"
			value={data.sortBy}>Sort by</Select
		>
	</div>
	<div>
		<Select options={months} id="month" value={data.month} name="month">Release Month</Select>
	</div>
	<div>
		<label><input type="checkbox" name="ascending" />Ascending</label>
	</div>
</form>

<details>
	<summary>Filter</summary>
	<div class="filters">
		<Filter items={$series} legend="Series" included={selectedSeries} />
		<Filter items={$creators} legend="Creators" included={selectedCreators} />
		<Filter items={$events} legend="Events" included={selectedEvents} />
	</div>
</details>

<ComicGrid oneColOnMobile={true}>
	{#each orderedComics as comic, idx (comic.id)}
		<li>
			<ComicSummary
				{comic}
				lazyLoad={idx > 10}
				showUnlimitedDate={data.sortBy === SortOption.UnlimitedDate}
			/>
		</li>
	{:else}
		<li>Nothing to show!</li>
	{/each}
</ComicGrid>
<PageLinks year={data.year} />

{#if data.response.attr}
	<p>{data.response.attr}</p>
{/if}

<style>
	.filters {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15.625rem, 1fr));
		gap: var(--size-2);
	}

	.search {
		margin: var(--size-2) 0;
		display: flex;
		flex-direction: column;
		gap: var(--size-2);
		flex-wrap: wrap;
		align-items: baseline;
	}

	input[type='checkbox'] {
		height: var(--size-3);
		width: var(--size-3);
		margin-right: var(--size-1);
	}

	summary {
		padding: var(--size-2);
	}

	@media screen and (min-width: 450px) {
		.search {
			flex-direction: row;
		}
	}

	.reset {
		margin-left: var(--size-2);
	}
</style>
