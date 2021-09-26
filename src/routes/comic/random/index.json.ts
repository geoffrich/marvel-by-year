import type { RequestHandler } from '@sveltejs/kit';
import Api from '$lib/api';
import Redis from '$lib/redis';
import { decades } from '$lib/years';
import type { RandomComic } from '$lib/types';

const get: RequestHandler = async function get({ query }) {
	try {
		const redis = new Redis();
		const api = new Api(redis);
		const decadeQuery = query.get('decade');
		let comics: RandomComic[] = [];

		if (decadeQuery) {
			const parsedDecade = parseInt(decadeQuery);
			const decade = decades.find((d) => d.startYear === parsedDecade);
			if (!decade) {
				return {
					status: 400
				};
			}
			comics = await api.getRandomComics(decade.startYear, decade.endYear);
		} else {
			comics = await api.getRandomComics();
		}

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
