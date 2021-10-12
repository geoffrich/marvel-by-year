import type { RequestHandler } from '@sveltejs/kit';
import type { ComicDataWrapper } from '$lib/types/marvel';
import { MAX_YEAR, MIN_YEAR } from '$lib/years';

import MarvelApi from '$lib/api';
import Redis from '$lib/redis';
import { adaptResponses } from '$lib/adapt/comics';
import { performance } from 'perf_hooks';
import { dev } from '$app/env';

//@ts-ignore
const get: RequestHandler = async function get({ params }) {
	const start = performance.now();
	const year = parseInt(params.year);
	const ignoreCache = false;

	if (year < MIN_YEAR || year > MAX_YEAR) {
		return {
			status: 400
		};
	}

	const redis = new Redis();
	const api = new MarvelApi(redis, ignoreCache);

	console.log(`Getting comics for ${year}`);
	let totalComics = await api.getTotalComics(year);
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
	const cachePromise = ignoreCache ? Promise.resolve({}) : buildCache(year, pages);
	const comicIdPromise = redis.getComicIdsWithImages(year);

	const [cache, comicIdsWithImages] = await Promise.all([cachePromise, comicIdPromise]);
	console.log('cache checked in', (performance.now() - start) / 1000);

	const requests = pages.map((i) => api.getComics(year, i, cache, comicIdsWithImages));
	const results = await Promise.all(requests);

	redis.quit();
	console.log('elapsed', (performance.now() - start) / 1000);

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

	async function buildCache(
		year: number,
		pages: number[]
	): Promise<Record<number, ComicDataWrapper>> {
		const cache: Record<number, ComicDataWrapper> = {};
		const SIMUL_PAGES = 5;
		// only get 5 at a time due to request size limits (the responses are big)
		for (let i = 0; i < pages.length; i += SIMUL_PAGES) {
			const cached = await redis.getCachedComicsMulti(year, pages.slice(i, i + SIMUL_PAGES));
			for (let j = 0; j < cached.length; j++) {
				cache[j + i] = cached[j];
			}
		}
		return cache;
	}
};

export { get };
