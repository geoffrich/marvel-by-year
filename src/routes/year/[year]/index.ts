import type { RequestHandler } from './__types/index';
import type { ComicDataWrapper } from '$lib/types/marvel';
import { MAX_YEAR, MIN_YEAR } from '$lib/years';

import MarvelApi from '$lib/api';
import Redis from '$lib/redis';
import { promiseTimeout } from '$lib/util';
import { adaptResponses } from '$lib/adapt/comics';
import { performance } from 'perf_hooks';
import { dev } from '$app/env';

const DEFAULT_TIMEOUT = 9000;

export const GET: RequestHandler = async function get(event) {
	try {
		const { request } = event;
		// Netlify functions have a execution time limit of 10 seconds
		// The Marvel API can be slow and take 20+ seconds in some cases
		// If we don't hear back in time, throw an error so the user can easily retry
		// Only do this when rendering a page so the user sees a useful error page
		// In the browser, we don't want to fail too early.
		const isPageRequest = request.headers.get('accept').includes('html');
		const apiCall = getComics(event);
		return isPageRequest ? await promiseTimeout(DEFAULT_TIMEOUT, apiCall) : await apiCall;
	} catch (e) {
		const message = e instanceof Error ? e.message : e.toString();
		return {
			status: message.includes('Timed out') ? 502 : 500
		};
	}
};

async function getComics({ params }) {
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
			body: {
				response,
				year
			},
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
}
