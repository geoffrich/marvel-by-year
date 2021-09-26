<script>
	export let altText;
	export let size = '';

	$: style = size ? `--size: ${size}; ` : '';
</script>

<button on:click {style}>
	<slot />
	<span class="visually-hidden">{altText}</span>
</button>

<style>
	button {
		all: unset;
		box-sizing: border-box;
		height: var(--size, 1.25rem);
		width: var(--size, 1.25rem);
		vertical-align: middle;
		color: var(--primary);
	}

	button:hover,
	button:active {
		filter: brightness(1.8);
	}

	button:focus {
		border: 2px solid black;
		border-radius: 50%;
	}

	button:focus:not(:focus-visible) {
		border: none;
	}
</style>
