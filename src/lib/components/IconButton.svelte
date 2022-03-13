<script>
	export let altText;
	export let size = null;
</script>

<button on:click style:--_icon-size={size}>
	<slot />
	<span class="visually-hidden">{altText}</span>
</button>

<style>
	button {
		all: unset;
		box-sizing: border-box;
		vertical-align: middle;
		color: var(--primary);
	}

	button:hover,
	button:active {
		filter: brightness(1.5);
	}

	button:focus {
		outline: var(--size-1) solid var(--brand);
		border-radius: var(--radius-round);
	}

	button:focus:not(:focus-visible) {
		border: none;
	}
</style>
