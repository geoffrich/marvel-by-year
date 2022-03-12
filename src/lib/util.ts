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

// https://italonascimento.github.io/applying-a-timeout-to-your-promises/
export function promiseTimeout(ms: number, promise) {
	// Create a promise that rejects in <ms> milliseconds
	let timeout = new Promise((_, reject) => {
		let id = setTimeout(() => {
			clearTimeout(id);
			reject('Timed out in ' + ms + 'ms.');
		}, ms);
	});

	// Returns a race between our timeout and the passed in promise
	return Promise.race([promise, timeout]);
}
