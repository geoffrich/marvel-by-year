export function dedupe<Item>(arr: Item[], getId: (arg: Item) => any): Item[] {
	const deduped = arr.filter((c, idx) => {
		const matchingIdIndex = arr.findIndex((c2) => getId(c) === getId(c2));
		if (matchingIdIndex === idx) {
			return true;
		}

		return false;
	});

	if (deduped.length !== arr.length) {
		console.log(arr.length - deduped.length, 'duplicates');
	}

	return deduped;
}
