<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				status,
				error
			}
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	let reloading = false;

	export let status;
	export let error: Error;

	let isTimeout = status === 502 || (error && error.message && error.message.includes('Timed out'));

	function reloadPage() {
		reloading = true;
		goto($page.path).then(() => {
			reloading = false;
		});
	}
</script>

{#if isTimeout}
	<h1>Request timed out</h1>
	<p>The Marvel API didn't respond in time. Try reloading the page.</p>
	<button on:click={reloadPage} disabled={reloading}>{reloading ? 'Reloading' : 'Reload'}</button>
{:else}
	<h1>Error: received status {status}</h1>
	{#if error && error.message}
		<p>{error.message}</p>
	{/if}
{/if}

<style>
	h1 {
		color: var(--error);
	}
</style>
