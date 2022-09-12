<script>
	import { page } from '$app/stores';

	$: status = $page.status;
	$: error = $page.error
</script>

<h1>Error: received status {status}</h1>
{#if error && error.message}
	<p>{error.message}</p>
{/if}

<style>
	h1 {
		color: var(--error);
		background-image: none;
	}
</style>
