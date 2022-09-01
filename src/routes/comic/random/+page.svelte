<script lang="ts">
	import type { PageData } from './$types';
	import DecadeForm from '$lib/components/DecadeForm.svelte';
	import ComicGrid from '$lib/components/ComicGrid.svelte';
	import ComicLink from '$lib/components/ComicLink.svelte';
	import { getImage, ImageSize } from '$lib/comics';
	import { blur } from 'svelte/transition';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	let refreshing = false;
	let error = false;
	let container: HTMLElement;

	function refresh() {
		invalidateAll().then(() => container.querySelector('a').focus());
	}
</script>

<h1>{$page.data.title}</h1>

<p>
	Tap the covers below to view a random comic on Marvel Unlimited. Depending on your device, it will
	open directly in the app or in the web-based reader. You can also narrow the response to only
	include comics from a given decade.
</p>

<DecadeForm selected={data.decade} />

<div class="container" bind:this={container}>
	<ComicGrid>
		{#each data.comics as comic (comic.id)}
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
		--red: var(--red-7);
		--orange: var(--orange-5);
		--yellow: var(--yellow-2);
		--green: var(--green-3);
		--blue: var(--blue-3);
		--purple: var(--grape-3);

		margin-bottom: var(--size-3);
	}

	.card {
		height: 200px;
		width: 133px;
		display: grid;
		place-items: center;
		box-shadow: var(--shadow-med);
		border-radius: var(--radius-2);

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
		font-size: var(--font-size-7);
	}

	button {
		max-width: var(--size-14);
		width: 100%;
		margin-left: auto;
		margin-right: auto;
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
