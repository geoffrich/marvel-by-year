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
			<IconButton size="1.5rem" altText={showItems ? 'Hide' : 'Show'} on:click={updateShowItems}>
				{#if showItems}
					<Minus />
				{:else}
					<Plus />
				{/if}
			</IconButton>
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
		margin-bottom: var(--size-1);
	}

	fieldset {
		max-height: var(--size-14);
		overflow: auto;
		align-self: start;
		position: relative;
		border-color: var(--secondary);
	}

	.buttons {
		position: sticky;
		top: 0;
		padding: var(--size-1);
		transform: translateY(-7px);
		display: flex;
		gap: var(--size-1);
		align-items: center;
	}

	.buttons > :global(:last-child) {
		margin-left: auto;
	}

	button {
		padding-inline: var(--size-2);
	}
</style>
