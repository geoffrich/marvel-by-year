<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	let reloading = false;

	$: status = $page.status;
	$: error = $page.error;

	function reloadPage() {
		reloading = true;
		goto($page.url.toString()).then(() => {
			reloading = false;
		});
	}
</script>

{#if status === 502}
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
		background-image: none;
	}
</style>
