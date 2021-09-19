<script lang="ts">
	import type { Writable } from 'svelte/store';
	export let items: Set<string>;
	export let legend: string;

	export let included: Writable<Set<string>>;

	let showItems = true;

	$: sortedItems = [...items].sort();

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

{#if items.size > 1}
	<fieldset>
		<legend>{legend} {$included.size} / {items.size}</legend>
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
			{#each sortedItems as i (i)}
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
		height: 300px; /* I'd like this to be max-height, but content breaks out of the box in Chrome */
		overflow: auto;
		align-self: start;
		position: relative;
	}

	.buttons {
		position: sticky;
		top: 0;
		background: white;
		padding: 0.25rem;
		transform: translateY(-7px);
	}
</style>
