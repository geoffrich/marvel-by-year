<script lang="ts">
	import { Plus, Minus } from '$lib/icons';
	import IconButton from './IconButton.svelte';

	/** Mapping of IDs (included in the set) with text values */
	export let items: Record<number, string>;
	export let legend: string;
	export let name: string;

	export let included: Set<number>;

	let showItems = true;

	$: isFiltered = included.size > 0;
	$: sortedItems = Object.entries(items).sort((a, b) => (a[1] > b[1] ? 1 : -1));

	function uncheckAll() {
		included.clear();
		included = included;
	}

	function updateShowItems() {
		showItems = !showItems;
	}
</script>

{#if sortedItems.length > 1}
	<fieldset>
		<legend
			>{legend}
			{#if isFiltered}({included.size} selected){/if}</legend
		>
		<div class="buttons">
			<button on:click={uncheckAll} class:hidden={!isFiltered}>Show all</button>
			<IconButton size="1.5rem" altText={showItems ? 'Hide' : 'Show'} on:click={updateShowItems}>
				{#if showItems}
					<Minus />
				{:else}
					<Plus />
				{/if}
			</IconButton>
		</div>
		{#if showItems}
			{#each sortedItems as [id, title] (id)}
				<label
					><input type="checkbox" checked={included.has(Number(id))} value={id} {name} />
					{title}</label
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

	button.hidden {
		opacity: 0.5;
	}
</style>
