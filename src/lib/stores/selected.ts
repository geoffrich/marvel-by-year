import type { Comic } from '$lib/types/marvel';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

interface ComicStore<T> extends Writable<T> {
	applyNewComics: (comics: Comic[]) => void;
}

export function createSelectedStores(
	mapping: (c: Comic) => string | string[]
): [ComicStore<Set<string>>, Writable<Set<string>>, () => void] {
	const items = writable(new Set<string>());
	let oldItems = new Set<string>();

	let _selectedItems = new Set<string>();
	const selectedItems = writable(_selectedItems);

	const unsubscribeItems = items.subscribe(($items) => {
		const newItems = new Set([...$items]);
		if (_selectedItems.size === oldItems.size) {
			// if all items were selected, all items should stay selected
			selectedItems.set(newItems);
		} else {
			// otherwise, selected items should be those that are still present in the new items
			const intersection = new Set([...$items].filter((i) => _selectedItems.has(i)));
			selectedItems.set(intersection);
		}
	});

	const unsubscribeSelected = selectedItems.subscribe(($selected) => {
		_selectedItems = $selected;
	});

	const cleanup = () => {
		unsubscribeItems();
		unsubscribeSelected();
	};

	return [
		{
			...items,
			applyNewComics: (comics: Comic[]) => {
				items.update((currentItems) => {
					oldItems = currentItems;
					return new Set([...comics.flatMap(mapping)]);
				});
			}
		},
		selectedItems,
		cleanup
	];
}
