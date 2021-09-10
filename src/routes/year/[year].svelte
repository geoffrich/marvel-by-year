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
</script>

<h1>Comics for {year}</h1>
<ul>
	{#each comics as comic (comic.id)}
		<li>
			<ComicSummary {comic} />
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}
</style>
