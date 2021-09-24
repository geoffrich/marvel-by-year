import type { RequestHandler } from '@sveltejs/kit';
import Api from '$lib/api';
import Redis from '$lib/redis';

const get: RequestHandler = async function get({ params }) {
	try {
		const redis = new Redis();
		const api = new Api(redis);
		const { decade } = params;
		const comic = await api.getRandomComicsForDecade(parseInt(decade));
		return {
			body: {
				comics: [comic]
			}
		};
	} catch (e) {
		console.log('Error when getting random: ', e);
		return {
			status: 500
		};
	}
};

export { get };
