<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = function ({ props }) {
		const { decade } = props;
		return {
			props,
			stuff: {
				title: decade ? `Random comics from the ${getDecadeAsString(decade)}` : 'Random comics'
			}
		};
	};

	function getDecadeAsString(decade: number) {
		return decades.find((d) => d.startYear >= decade && decade <= d.endYear).text;
	}
</script>

<script lang="ts">
	import type { RandomComic } from '$lib/types';
	import DecadeForm from '$lib/components/DecadeForm.svelte';
	import ComicGrid from '$lib/components/ComicGrid.svelte';
	import ComicLink from '$lib/components/ComicLink.svelte';
	import { getImage, ImageSize } from '$lib/comics';
	import { blur } from 'svelte/transition';
	import { decades } from '$lib/years';
	import { tick } from 'svelte';
	import { page } from '$app/stores';

	export let comics: RandomComic[];
	export let decade: number;

	let refreshing = false;
	let error = false;
	let container;

	function refresh() {
		refreshing = true;
		// todo: can we use invalidate here?
		fetch($page.url.toString(), { headers: { accept: 'application/json' } })
			.then((res) => res.json())
			.then((res) => {
				comics = res.comics;
				refreshing = false;
				error = false;
				tick().then(() => container.querySelector('a').focus());
			})
			.catch(() => {
				error = true;
				refreshing = false;
			});
	}
</script>

<h1>{$page.stuff.title}</h1>

<p>
	Tap the covers below to view a random comic on Marvel Unlimited. Depending on your device, it will
	open directly in the app or in the web-based reader. You can also narrow the response to only
	include comics from a given decade.
</p>

<DecadeForm selected={decade} />

<div class="container" bind:this={container}>
	<ComicGrid>
		{#each comics as comic (comic.id)}
			<li class="card" in:blur>
				<ComicLink id={comic.id} title={comic.title}>
					<img
						src={getImage(comic.image, ImageSize.XXLarge, comic.ext)}
						alt="{comic.title} cover"
					/>
					<span class="visually-hidden">Read {comic.title} on Marvel Unlimited</span>
				</ComicLink>
				<span class="q" aria-hidden="true">?</span>
			</li>
		{/each}
	</ComicGrid>
</div>

<button disabled={refreshing} on:click={refresh}>{refreshing ? 'Loading' : 'Refresh'}</button>

<p aria-live="polite" class="error">
	{#if error}
		Something went wrong! Try again?
	{/if}
</p>

<style>
	.container {
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
		box-shadow: var(--shadow-med);
		border-radius: 0.5rem;

		position: relative;
		transition: transform 0.2s ease-out;
	}

	.card:hover {
		transform: rotateX(-3deg) rotateY(-20deg);
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

	.card > :global(:first-child) {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
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

	img {
		height: 100%;
	}

	img[src=''] {
		display: none;
	}

	.error {
		color: var(--error);
		text-align: center;
	}
</style>
