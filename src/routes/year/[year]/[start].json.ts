import type { RequestHandler } from '@sveltejs/kit';
import type { ComicDataWrapper } from '$lib/types/marvel';
import { MAX_YEAR, MIN_YEAR } from '$lib/years';
import testResponse from '../testData.json';

import { getComics } from './_api';

//@ts-ignore
const get: RequestHandler = async function get({ params }) {
	const year = parseInt(params.year);
	let page = parseInt(params.start);
	if (year < MIN_YEAR || year > MAX_YEAR || page < 0) {
		return {
			status: 400
		};
	}

	console.log(`Getting comics for ${year} (page ${page})`);

	const response: ComicDataWrapper = await getComics(params.year, page);
	if (response.data) {
		const { count, offset, total } = response.data;
		console.log({ count, offset, total });
	}

	const { code, message } = response;

	if (code === 200) {
		response.data.results = response.data.results.map((r) => {
			return {
				...r,
				// we're not currently using these, so let's slim down the API response
				characters: {
					...r.characters,
					items: []
				},
				stories: {
					...r.stories,
					items: []
				},
				textObjects: [],
				variants: [],
				collectedIssues: [],
				prices: []
			};
		});
		return {
			body: response,
			headers: {
				'cache-control': 'public, max-age=86400'
			}
		};
	}

	console.log({ code, message });
	return {
		status: 500
	};
};

export { get };
