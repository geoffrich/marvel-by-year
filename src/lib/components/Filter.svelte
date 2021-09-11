<script lang="ts">
	// TODO: is there a way to preserve filter state across multiple pages?
	import type { Writable } from 'svelte/store';
	export let items: string[];
	export let legend: string;

	export let included: Writable<Set<string>>;

	let showItems = true;

	function uncheckAll() {
		$included.clear();
		$included = $included;
	}

	function checkAll() {
		$included = new Set(items);
	}

	function handleChange({ target }) {
		if (target.checked) {
			$included.add(target.value);
		} else {
			$included.delete(target.value);
		}

		$included = $included;
	}
</script>

{#if items.length > 1}
	<fieldset>
		<legend>{legend} {$included.size} / {items.length}</legend>
		<div class="buttons">
			<button on:click={checkAll}>Check all</button>
			<button on:click={uncheckAll}>Uncheck all</button>
			<button
				on:click={() => {
					showItems = !showItems;
				}}>{showItems ? 'Hide' : 'Show'}</button
			>
		</div>
		{#if showItems}
			{#each items as i (i)}
				<!-- TODO: count of comics with this filter -->
				<label
					><input on:change={handleChange} type="checkbox" checked={$included.has(i)} value={i} />
					{i}</label
				>
			{/each}
		{/if}
	</fieldset>
{/if}

<style>
	label {
		display: block;
		margin-bottom: 0.25rem;
	}

	fieldset {
		max-height: 300px;
		overflow: auto;
		align-self: start;
		position: relative;
	}

	.buttons {
		position: sticky;
		top: 0;
		background: white;
		padding: 0.25rem;
		transform: translateY(-6px);
	}

	button {
		font-size: 1rem;
		padding: 0.25rem 0.5rem;
	}
</style>
