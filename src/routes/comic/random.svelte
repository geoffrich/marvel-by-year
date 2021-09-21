<script context="module" lang="ts">
	import type { RandomResponse } from '$lib/types';

	export async function load({ fetch }) {
		const url = '/comic/random.json';
		const res = await fetch(url, { credentials: 'omit' });
		const response: RandomResponse = await res.json();

		if (res.ok) {
			return {
				props: {
					ids: response.ids
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

	export let ids: string[];

	let index = 0;
	const LIST_SIZE = 5;
	$: randomList = ids.slice(index, index + LIST_SIZE);

	function setRandomId() {
		index = (index + LIST_SIZE) % ids.length;
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
		}
	}
</script>

<h1>Get a random comic from Marvel Unlimited</h1>

<div class="container">
	{#each randomList as randomId, idx}
		<div class="card" style="--background: var({getBackground(idx)})">
			<a href="https://read.marvel.com/#/book/{randomId}">Random comic {idx + 1}</a>
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

		margin-bottom: 1rem;
	}

	.card {
		height: 200px;
		width: 133px;
		display: grid;
		place-items: center;
		background-color: var(--background);
	}

	button {
		max-width: 20rem;
		width: 100%;
		height: 3rem;
		margin-left: auto;
		margin-right: auto;
		display: block;
	}
</style>
