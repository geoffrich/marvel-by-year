<script context="module" lang="ts">
	import type { RandomResponse } from '$lib/types';

	export async function load({ fetch }) {
		const url = '/comic/random.json';
		const res = await fetch(url, { credentials: 'omit' });
		const response: RandomResponse = await res.json();

		if (res.ok) {
			return {
				props: {
					comics: response.comics
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
	import type { RandomComic } from '$lib/types';
	import { getImage, ImageSize } from '$lib/comics';

	export let comics: RandomComic[];

	let index = 0;
	const LIST_SIZE = 6;
	let shouldFocusFirstElement = false;

	$: randomList = comics.slice(0, index + LIST_SIZE);
	$: allComicsShowing = randomList.length >= comics.length;

	function showMore() {
		if (allComicsShowing) {
			shouldFocusFirstElement = true;
			fetch('/comic/random.json')
				.then((res) => res.json())
				.then((res) => {
					comics = res.comics;
					index = 0;
				});
		} else {
			index += LIST_SIZE;
		}
	}

	function focusFirst(node: HTMLElement, index: number) {
		// only focus the first element after the list has been updated, not on initial load
		if (index === 0 && shouldFocusFirstElement) {
			node.focus();
		}
	}
</script>

<svelte:head>
	<title>Random comic</title>
</svelte:head>

<h1>Random comic</h1>

<p>
	Tap the covers below to view a random comic on Marvel Unlimited. Depending on your device, it will
	open directly in the app or in the web-based reader.
</p>

<ul class="container">
	{#each randomList as comic, idx (comic.id)}
		<li class="card">
			<a href="https://read.marvel.com/#/book/{comic.id}" use:focusFirst={idx}>
				<img src={getImage(comic.image, ImageSize.XXLarge, comic.ext)} alt="{comic.title} cover" />
				<span class="visually-hidden">Read {comic.title} on Marvel Unlimited</span>
			</a>
			<span class="q" aria-hidden="true">?</span>
		</li>
	{/each}
</ul>

<button on:click={showMore}>{allComicsShowing ? 'Refresh' : 'Load more'}</button>

<style>
	.container {
		display: grid;
		grid-template-columns: repeat(auto-fill, 150px);
		justify-content: center;
		gap: 1rem;

		--red: hsl(0deg 75% 60%);
		--orange: hsl(30deg 95% 60%);
		--yellow: hsl(60deg 80% 65%);
		--green: hsl(140deg 50% 80%);
		--blue: hsl(220deg 100% 80%);
		--purple: hsl(280deg 100% 80%);

		margin-bottom: 1rem;
	}

	ul {
		padding: 0;
		list-style: none;
	}

	.card {
		height: 200px;
		width: 133px;
		display: grid;
		place-items: center;
		--shadow-color: 0deg 0% 50%;
		box-shadow: 1px 2px 2px hsl(var(--shadow-color) / 0.333),
			2px 4px 4px hsl(var(--shadow-color) / 0.333), 3px 6px 6px hsl(var(--shadow-color) / 0.333);
		border-radius: 8px;

		position: relative;
	}

	.card:nth-child(6n + 1) {
		background-color: var(--red);
	}

	.card:nth-child(6n + 2) {
		background-color: var(--orange);
	}

	.card:nth-child(6n + 3) {
		background-color: var(--yellow);
	}

	.card:nth-child(6n + 4) {
		background-color: var(--green);
	}

	.card:nth-child(6n + 5) {
		background-color: var(--blue);
	}

	.card:nth-child(6n) {
		background-color: var(--purple);
	}

	a:focus {
		outline: 0.25rem solid black;
		outline-offset: 0.25rem;
		border-radius: 8px;
	}

	a:focus:not(:focus-visible) {
		outline: none;
	}

	.q {
		color: white;
		font-size: 3rem;
	}

	button {
		max-width: 20rem;
		width: 100%;
		height: 3rem;
		margin-left: auto;
		margin-right: auto;
		display: block;
	}

	a {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	img {
		height: 100%;
	}

	img[src=''] {
		display: none;
	}
</style>
