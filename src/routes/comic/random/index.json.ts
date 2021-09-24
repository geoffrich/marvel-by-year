import type { RequestHandler } from '@sveltejs/kit';
import Api from '$lib/api';
import Redis from '$lib/redis';

const get: RequestHandler = async function get({ query }) {
	try {
		const redis = new Redis();
		const api = new Api(redis);
		const decade = parseInt(query.get('decade'));
		let decadeStart = decade,
			decadeEnd = decade + 9;
		if ([1930, 1940, 1950].includes(decade)) {
			decadeStart = 1930;
			decadeEnd = 1959;
		}
		const comics = await api.getRandomComics(decadeStart, decadeEnd);
		return {
			body: {
				comics
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
