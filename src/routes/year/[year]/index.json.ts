import type { RequestHandler } from '@sveltejs/kit';
import type { ComicDataWrapper } from '$lib/types/marvel';
import { MAX_YEAR, MIN_YEAR } from '$lib/years';
import { dev } from '$app/env';

import { getComics, getTotalComics } from '$lib/api';
import { getCachedComics } from '$lib/redis';
import { adaptResponses } from '$lib/adapt/comics';
import { performance } from 'perf_hooks';

//@ts-ignore
const get: RequestHandler = async function get({ params }) {
	const start = performance.now();
	const year = parseInt(params.year);

	if (year < MIN_YEAR || year > MAX_YEAR) {
		return {
			status: 400
		};
	}

	console.log(`Getting comics for ${year}`);
	let totalComics = await getTotalComics(year);
	console.log(`Total comics: ${totalComics}`);
	if (totalComics === -1) {
		console.log(`unable to fetch total comics for ${year}`);
		return {
			status: 500
		};
	}

	// reduce API calls/cache hits when developing
	if (dev) {
		totalComics = Math.min(200, totalComics);
	}

	const pages = Array.from(Array(Math.ceil(totalComics / 100)).keys());
	const cache: Record<number, ComicDataWrapper> = {};
	for (const i of pages) {
		// we can't make the redis calls in parallel due to Redis host limitations
		// https://docs.upstash.com/troubleshooting/max_request_size_exceeded
		cache[i] = await getCachedComics(year, i);
	}

	const requests = pages.map((i) => getComics(year, i, cache));
	const results = await Promise.all(requests);

	const end = performance.now();
	console.log('elapsed', (end - start) / 1000);

	const badStatus = results.find((r) => r.code !== 200);
	if (badStatus === undefined) {
		const response = adaptResponses(results);

		return {
			body: response,
			headers: {
				'cache-control': 'public, max-age=86400'
			}
		};
	}

	console.log({ code: badStatus.code, message: badStatus.message });
	return {
		status: 500
	};
};

export { get };
