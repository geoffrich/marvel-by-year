<script>
	export let altText;
	export let size = null;
</script>

<button on:click style:--size={size}>
	<slot />
	<span class="visually-hidden">{altText}</span>
</button>

<style>
	button {
		all: unset;
		box-sizing: border-box;
		height: var(--size, var(--size-4));
		width: var(--size, var(--size-4));
		vertical-align: middle;
		color: var(--primary);
	}

	button:hover,
	button:active {
		filter: brightness(1.8);
	}

	button:focus {
		border: 2px solid black; /* TODO: dark mode / prop */
		border-radius: var(--radius-round);
	}

	button:focus:not(:focus-visible) {
		border: none;
	}
</style>
