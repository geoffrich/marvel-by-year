import type { RequestHandler } from '@sveltejs/kit';
import type { ComicDataWrapper } from '$lib/types/marvel';
import { MAX_YEAR, MIN_YEAR } from '$lib/years';
import { dev } from '$app/env';

import { getComics, getTotalComics } from '$lib/api';

//@ts-ignore
const get: RequestHandler = async function get({ params }) {
	const year = parseInt(params.year);

	if (year < MIN_YEAR || year > MAX_YEAR) {
		return {
			status: 400
		};
	}

	console.log(`Getting comics for ${year}`);
	let totalComics = await getTotalComics(params.year);
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

	const requests = Array.from(Array(Math.ceil(totalComics / 100)).keys()).map((i) =>
		getComics(params.year, i)
	);

	const results = await Promise.all(requests);
	let response: ComicDataWrapper;
	if (results.length === 0) {
		response = createEmptyResponse();
	} else {
		response = {
			...results[0],
			data: {
				...results[0].data,
				results: []
			}
		};
	}

	const badStatus = results.find((r) => r.code !== 200);
	if (badStatus === undefined) {
		for (const result of results) {
			response.data.results = [...response.data.results, ...result.data.results];
		}

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

function createEmptyResponse(): ComicDataWrapper {
	return {
		code: 200,
		message: null,
		copyright: null,
		attributionHTML: '',
		attributionText: '',
		etag: null,
		data: {
			offset: 0,
			limit: 0,
			total: 0,
			count: 0,
			results: []
		}
	};
}
