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
	import { Refresh } from '$lib/icons';
	import IconButton from '$lib/components/IconButton.svelte';

	export let ids: string[];

	let index = 0;
	$: randomId = ids[index];

	function setRandomId() {
		index = (index + 1) % randomId.length;
		if (index === 0) {
			invalidate('comic/random.json');
		}
	}
</script>

<h1>Get a random comic from Marvel Unlimited</h1>
<a href="https://read.marvel.com/#/book/{randomId}">Random comic!</a>
<IconButton altText="Refresh" on:click={setRandomId}><Refresh /></IconButton>
