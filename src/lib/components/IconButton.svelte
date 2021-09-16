<script>
	export let altText;
</script>

<button on:click>
	<slot />
	<span class="visually-hidden">{altText}</span>
</button>

<style>
	button {
		all: unset;
		box-sizing: border-box;
		height: 1.25rem;
		width: 1.25rem;
		vertical-align: middle;
		color: var(--primary);
	}

	button:hover,
	button:active {
		filter: brightness(1.1);
	}

	button:focus {
		border: 2px solid black;
		border-radius: 50%;
	}

	button:focus:not(:focus-visible) {
		border: none;
	}
</style>
