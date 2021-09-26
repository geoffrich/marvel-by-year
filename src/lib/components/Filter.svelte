<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Plus, Minus } from '$lib/icons';
	import IconButton from './IconButton.svelte';

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

	function updateShowItems() {
		showItems = !showItems;
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
			{#if showItems}
				<IconButton size="1.5rem" altText="Hide" on:click={updateShowItems}>
					<Minus />
				</IconButton>
			{:else}
				<IconButton size="1.5rem" altText="Show" on:click={updateShowItems}>
					<Plus />
				</IconButton>
			{/if}
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
		transform: translateY(-7px);
		display: flex;
		gap: 0.25rem;
		align-items: center;
	}

	.buttons > :global(:last-child) {
		margin-left: auto;
	}
</style>
