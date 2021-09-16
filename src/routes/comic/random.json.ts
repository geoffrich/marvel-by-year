import type { RequestHandler } from '@sveltejs/kit';
import { getRandomIds } from '$lib/api';

const get: RequestHandler = async function get({ params }) {
	const ids = await getRandomIds();
	return {
		body: {
			ids
		}
	};
};

export { get };
