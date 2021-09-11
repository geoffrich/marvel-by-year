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

<script>
	export let status;
	export let error;
</script>

<h1>Error: received status {status}</h1>
{#if error && error.message}
	<p>{error.message}</p>
{/if}
{#if status === 502}
	<p>This could mean the Marvel API didn't respond in time. Try refreshing the page.</p>
{/if}

<style>
	h1 {
		color: var(--error);
	}
</style>
