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
		if (_selectedItems.size > 0) {
			// add new items to selected items and carry over what's already there
			// TODO: determine if there's a way to not add new items but still persist "all selected" state
			_selectedItems = new Set(
				[...$items].filter((i) => _selectedItems.has(i) || !oldItems.has(i))
			);
		} else {
			// if nothing is selected, select everything on the new page
			_selectedItems = new Set([...$items]);
		}
		selectedItems.set(_selectedItems);
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
