import type { RequestHandler } from '@sveltejs/kit';
import Api from '$lib/api';
import Redis from '$lib/redis';

const get: RequestHandler = async function get({ params }) {
	const redis = new Redis();
	const api = new Api(redis);
	const comics = await api.getRandomComics();
	return {
		body: {
			comics
		}
	};
};

export { get };
