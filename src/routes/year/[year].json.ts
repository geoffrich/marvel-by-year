import type { RequestHandler } from '@sveltejs/kit';
import testResponse from './testData.json';

import { getComics } from './_api';

const get: RequestHandler = async function get({ params }) {
	// TODO: paginate
	const response = await getComics(params.year);
	return {
		body: response
	};
};

export { get };
