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
	import { invalidate } from '$app/navigation';
	import type { RandomComic } from '$lib/types';
	import { getImage, ImageSize } from '$lib/comics';

	export let comics: RandomComic[];

	let index = 0;
	const LIST_SIZE = 6;
	$: randomList = comics.slice(index, index + LIST_SIZE);

	function setRandomId() {
		index = (index + LIST_SIZE) % comics.length;
		if (index === 0) {
			invalidate('comic/random.json');
		}
	}

	function getBackground(index: number) {
		switch (index) {
			case 0:
				return '--red';
			case 1:
				return '--orange';
			case 2:
				return '--yellow';
			case 3:
				return '--green';
			case 4:
				return '--blue';
			case 5:
				return '--purple';
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

<div class="container">
	{#each randomList as comic, idx}
		<div class="card" style="--background: var({getBackground(idx)})">
			<a href="https://read.marvel.com/#/book/{comic.id}">
				Random comic {idx}
			</a>
			<span class="q">?</span>
		</div>
	{/each}
</div>

<button on:click={setRandomId}>Load more</button>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;

		--red: hsl(0deg 75% 60%);
		--orange: hsl(30deg 95% 60%);
		--yellow: hsl(60deg 80% 65%);
		--green: hsl(140deg 50% 80%);
		--blue: hsl(220deg 100% 80%);
		--purple: hsl(280deg 100% 80%);

		margin-bottom: 1rem;
	}

	.card {
		height: 200px;
		width: 133px;
		display: grid;
		place-items: center;
		background-color: var(--background);
		--shadow-color: 0deg 0% 50%;
		box-shadow: 1px 2px 2px hsl(var(--shadow-color) / 0.333),
			2px 4px 4px hsl(var(--shadow-color) / 0.333), 3px 6px 6px hsl(var(--shadow-color) / 0.333);
		border-radius: 8px;

		position: relative;
	}

	.card:focus-within {
		outline: 0.25rem solid white;
		outline-offset: -0.5rem;
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
		opacity: 0;
	}
</style>
