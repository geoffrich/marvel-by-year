<script lang="ts">
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	export let items: string[];
	export let legend: string;

	export let included: Writable<Set<string>>;

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
		<button on:click={checkAll}>Check all</button>
		<button on:click={uncheckAll}>Uncheck all</button>
		{#each items as i (i)}
			<!-- TODO: count of comics with this filter -->
			<label
				><input on:change={handleChange} type="checkbox" checked={$included.has(i)} value={i} />
				{i}</label
			>
		{/each}
	</fieldset>
{/if}

<style>
	label {
		display: block;
	}

	fieldset {
		max-height: 300px;
		overflow: auto;
		align-self: start;
	}
</style>
