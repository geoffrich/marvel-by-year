import type { RequestHandler } from '@sveltejs/kit';
import type { ComicDataWrapper } from '$lib/types/marvel';
import testResponse from './testData.json';

import { getComics } from './_api';

const get: RequestHandler = async function get({ params, query }) {
	// TODO: limit year
	let page = parseInt(query.get('page') ?? '0');
	console.log(`Getting comics for ${params.year} (page ${page})`);

	const response: ComicDataWrapper = await getComics(params.year, page);
	if (response.data) {
		const { count, offset, total } = response.data;
		console.log({ count, offset, total });
	}

	const { code, message } = response;

	if (code === 200) {
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
