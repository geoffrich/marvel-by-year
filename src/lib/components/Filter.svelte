<script lang="ts">
	import { Plus, Minus } from '$lib/icons';
	import IconButton from './IconButton.svelte';

	/** Mapping of IDs (included in the set) with text values */
	export let items: Record<number, string>;
	export let legend: string;

	export let included: Set<number>;

	let showItems = true;

	$: sortedItems = Object.entries(items).sort((a, b) => (a[1] > b[1] ? 1 : -1));

	function uncheckAll() {
		included.clear();
		included = included;
	}

	function checkAll() {
		included = new Set(Object.keys(items).map((x) => Number(x)));
	}

	function updateShowItems() {
		showItems = !showItems;
	}

	// TODO: confusing that `included` may have items not in this set after a page navigation. remove entirely?
	// also confusing since 0 === everything
</script>

{#if sortedItems.length > 1}
	<fieldset>
		<legend>{legend} {included.size} / {sortedItems.length}</legend>
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
			{#each sortedItems as [k, v] (k)}
				<label
					><input
						type="checkbox"
						checked={included.has(Number(k))}
						value={k}
						name={legend.toLowerCase()}
					/>
					{v}</label
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
