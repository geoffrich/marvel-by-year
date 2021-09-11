import type { Comic } from '$lib/types/marvel';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

interface ComicStore<T> extends Writable<T> {
	applyNewComics: (comics: Comic[]) => void;
}

export function createSelectedStores(
	mapping: (c: Comic) => string | string[]
): [ComicStore<Set<string>>, Writable<Set<string>>] {
	const items = writable(new Set<string>());
	let oldItems = new Set<string>();

	let _selectedItems = new Set<string>();
	const selectedItems = writable(_selectedItems);

	items.subscribe(($items) => {
		if (_selectedItems.size === oldItems.size || _selectedItems.size === 0) {
			// if all items were selected, all items should stay selected
			// (even with new items added)
			selectedItems.set(new Set([...$items]));
		} else {
			// otherwise, selected items should be those that are still present in the new items
			selectedItems.set(new Set([...$items].filter((i) => _selectedItems.has(i))));
		}
	});

	selectedItems.subscribe(($selected) => {
		_selectedItems = $selected;
	});

	return [
		{
			...items,
			applyNewComics: (comics: Comic[]) => {
				items.update((currentItems) => {
					oldItems = currentItems;
					return new Set([...currentItems, ...comics.flatMap(mapping)]);
				});
			}
		},
		selectedItems
	];
}
